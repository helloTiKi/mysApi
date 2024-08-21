import gsData from "../../config/gsData.js";
import mysApi from "../../mysApi/mysapi.js";
import user from "../../user/user.js";

export class bh3 extends mysApi {
    /**默认官服 */
    game_biz = 'bh3_cn'
    game_mode = 'bh3'
    act_id = 'e202306201626331'
    static initByCookie(cookie) {
        return new bh3(cookie);
    }
    static initByUserName(username) {
        let tuid = gsData.getltuidByUserName(username)
        if (tuid) {
            let cookie = gsData.getCookieByLtuid(tuid)
            if (cookie) {
                return new bh3(cookie);
            } else return false
        }
        return false;
    }
    static initByUser(use) {
        return new bh3(user);
    }

    get region() {
        for (const data of this.UserGameRoles[this.game_biz]) {
            if (data.game_uid == this.uid) {
                return data.region
            }
        }
        return ''
    }
    constructor(cookie) {
        super(cookie);
    }
    /**在使用其他api之前，请先等待这个函数完成在进行使用，否则会出现不可控的错误 */
    async getUserGameRoles() {
        if (typeof this.UserGameRoles.then == 'function') this.UserGameRoles = await this.UserGameRoles
        return this.UserGameRoles[this.game_biz] || null
    }
    async sign(game_uid = '') {
        if (!game_uid) return false
        this.uid = game_uid
        const signInfo = await this.get_sign_info()

        if (!signInfo) return false
        if (signInfo.retcode == -100 && signInfo.message == '尚未登录') {
            console.error(`[签到失败][uid:${this.uid}] 绑定cookie已失效`)
            return {
                retcode: -100,
                msg: `签到失败，uid:${this.uid}，绑定cookie已失效`,
                is_invalid: true
            }
        }
        if (signInfo.retcode !== 0) {
            return {
                retcode: signInfo.retcode,
                msg: `签到失败：${signInfo.message || '未知错误'}`
            }
        }
        if (signInfo.data.first_bind) {
            return {
                retcode: 100,
                msg: '签到失败：首次请先手动签到'
            }
        }
        let Info = signInfo.data
        /**是否已签到 */
        if (Info.is_sign) {
            // logger.mark(`[原神已签到][uid:${this.mysApi.uid}][qq:${lodash.padEnd(this.e.user_id,11,' ')}]`)
            let reward = await this.getReward(Info.total_sign_day)
            return {
                retcode: 0,
                msg: `uid:${this.uid}，今天已签到\n第${Info.total_sign_day}天奖励：${reward}`,
                is_sign: true
            }
        }

        /** 签到 */
        let res = await this.bbs_sign()

        if (res) {
            let totalSignDay = Info.total_sign_day
            if (!Info.is_sign) {
                totalSignDay++
            }
            let tips = '签到成功'
            if (this.signed) {
                tips = '今天已签到'
            }
            let reward = await this.getReward(totalSignDay)
            return {
                retcode: 0,
                msg: `uid:${this.uid}，${tips}\n第${totalSignDay}天奖励：${reward}`
            }
        }

        return {
            retcode: -1000,
            msg: `uid:${this.uid}，签到失败：${this.signMsg}`
        }
    }

    async get_sign_info() {
        if (this.region == '') return null
        const signInfo = await this.request.get("https://api-takumi.mihoyo.com/event/luna/info"
            , {
                act_id: this.act_id,
                region: this.region,
                uid: this.uid
            })

        return signInfo
    }
    async bbs_sign() {
        let url = "https://api-takumi.mihoyo.com/event/luna/sign"
        let body = JSON.stringify({
            'act_id': this.act_id,
            'region': this.region,
            'uid': this.uid
        })

        let sign = await this.request.post(url, body, '', {
            'x-rpc-client_type': 5,
            'x-rpc-channel': 'nochannel',
            'x-rpc-platform': 'android'
        })
        if (!sign) {
            return false
        }
        /** 签到成功 */
        if (sign.retcode === -5003) {
            return true
        }
        /**风控验证 */
        if (sign.data && (sign.data.risk_code === 375)) {
            let { gt, challenge } = sign.data;
            let geet = new geetest(gt, challenge)
            let data = await geet.start(function (result) {
            })
            sign = await this.send({
                url,
                method: "post",
                body: JSON.stringify({
                    'act_id': 'e202009291139501',
                    'region': UserGameRoles.region,
                    'uid': game_uid
                }),
                sign: true,
                header: {
                    "x-rpc-challenge": data.geetest_challenge,
                    "x-rpc-validate": data.geetest_validate,
                    "x-rpc-seccode": data.geetest_seccode
                }
            })
            if (sign.retcode != 0) {
                /**验证码失败 */
                return false
            }
        }
        if (sign.retcode === 0 && (sign?.data.success === 0 || sign?.message === 'OK')) {
            return true
        }
        return false
    }
    // 缓存签到奖励
    async getReward(signDay = 0) {
        let today = new Date()
        let reward = gsData.getReward(this.game_mode)
        if (reward) {
            reward = JSON.parse(reward)
        }
        if (!reward || reward?.endMonth < today.getMonth() + 1) {
            let res = await this.request.get("https://api-takumi.mihoyo.com/event/luna/home",
                {
                    act_id: this.act_id
                })

            if (!res || res.retcode !== 0) return ''
            let data = res.data
            if (data && data.awards && data.awards.length > 0) {
                reward = {}
                reward.list = data.awards
                reward.endMonth = data.month
                gsData.setReward(this.game_mode, JSON.stringify(reward))
            } else {
                return ''
            }
        }
        reward = reward.list
        if (reward && reward.length > 0) {
            reward = reward[signDay - 1] || ''
            if (reward.name && reward.cnt) {
                reward = `${reward.name}*${reward.cnt}`
            }
        } else {
            reward = ''
        }
        return reward
    }
}