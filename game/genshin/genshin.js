import mysApi from "../../mysApi/mysapi.js";
import { geetest } from "geetest-auto";
import gsData from "../../config/gsData.js";

import util from 'node:util'


/**
 * @typedef GameRoles
 * @property {string} game_biz
 * @property {string} game_uid
 * @property {boolean} is_chosen
 * @property {boolean} is_offial
 * @property {number} level
 * @property {string} nickname
 * @property {string} region
 * @property {string} region_name
 */

/**
 * @typedef signInfo
 * @property {boolean} first_bind
 * @property {boolean} is_sign
 * @property {boolean} is_sub
 * @property {boolean} month_first
 * @property {boolean} month_last_day
 * @property {number} sign_cnt_missed
 * @property {string} today
 * @property {number} total_sign_day
 */

/**
 * @typedef genShinSignInfoData
 * @property {number} retcode
 * @property {string} message
 * @property {signInfo} data
 */

export default class genshin extends mysApi {
    static init(cookie = '') {
        if (cookie == '') return false
    }
    static initByCookie(cookie) {
        return new genshin(cookie);
    }
    static initByUserName(username) {
        let tuid = gsData.getltuidByUserName(username)
        if (tuid) {
            let cookie = gsData.getCookieByLtuid(tuid)
            if (cookie) {
                return new genshin(cookie);
            } else return undefined
        }
        return undefined;
    }
    static initByUser(user) {
        return new genshin(user);
    }
    get region() {
        for (const data of this.UserGameRoles['hk4e_cn']) {
            if (data.game_uid == this.uid) {
                return data.region
            }
        }
        return ''
    }
    constructor(cookie) {
        super(cookie, { model: "genshin" });
    }
    async sign(game_uid = '') {
        if (game_uid == '') return false
        this.uid = game_uid
        const signInfo = await this.get_sign_info();
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
    /**
     * 
     * @returns {Promise<genShinSignInfoData>}
     */
    async get_sign_info() {
        if (this.region == '') return null
        const signInfo = await this.request.get("https://api-takumi.mihoyo.com/event/luna/info"
            , `act_id=e202311201442471&region=${this.region}&uid=${this.uid}`, { 'x-rpc-signgame': 'hk4e' })

        return signInfo
    }
    async bbs_sign() {
        let url = "https://api-takumi.mihoyo.com/event/luna/sign"
        let body = JSON.stringify({
            'act_id': 'e202311201442471',
            'region': this.region,
            'uid': this.uid
        })

        let sign = await this.request.post(url, body, '', {
            'x-rpc-client_type': 5,
            'x-rpc-channel': 'nochannel',
            'x-rpc-platform': 'android',
            'x-rpc-signgame': 'hk4e'
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
                    'region': this.region,
                    'uid': this.uid
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
        let reward = gsData.getReward('genshin')
        if (reward) {
            reward = JSON.parse(reward)
        }
        if (!reward || reward?.endMonth < today.getMonth() + 1) {
            let res = await this.request.get("https://api-takumi.mihoyo.com/event/bbs_sign_reward/home",
                `act_id=e202009291139501&region=${this.region}&uid=${this.uid}`)

            if (!res || res.retcode !== 0) return ''
            let data = res.data
            if (data && data.awards && data.awards.length > 0) {
                reward = {}
                reward.list = data.awards
                reward.endMonth = data.month
                gsData.setReward('genshin', JSON.stringify(reward))
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
    async getUserGameRoles() {
        if (util.types.isPromise(this.UserGameRoles)) this.UserGameRoles = await this.UserGameRoles
        return this.UserGameRoles['hk4e_cn'] || null
    }

    async getAnnList() {
        //https://hk4e-api.mihoyo.com/common/hk4e_cn/announcement/api/getAnnList?game=hk4e&game_biz=hk4e_cn&lang=zh-cn&bundle_id=hk4e_cn&channel_id=1&level=59&platform=pc&region=cn_gf01&uid=223136265
    }

    async getAnnContent() {
        //https://hk4e-api-static.mihoyo.com/common/hk4e_cn/announcement/api/getAnnContent?game=hk4e&game_biz=hk4e_cn&lang=zh-cn&bundle_id=hk4e_cn&platform=pc&region=cn_gf01&t=1700144683_ddfa5b374c711d8b2a84102629612833
    }
}