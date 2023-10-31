
import mysApi from "../mysApi/mysapi.js";
import { geetest } from "geetest-auto";

import gsData from "../config/gsData.js";


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
    /**@param {string} cookie  */
    constructor(cookie) {
        super(cookie);
    }
    async sign() {
        const UserGameRoles = await this.getUserGameRoles('hk4e_cn');
        const signInfo = await this.get_sign_info();

        if (!signInfo) return false
        if (signInfo.retcode == -100 && signInfo.message == '尚未登录') {
            console.error(`[签到失败][uid:${UserGameRoles.game_uid}] 绑定cookie已失效`)
            return {
                retcode: -100,
                msg: `签到失败，uid:${UserGameRoles.game_uid}，绑定cookie已失效`,
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
                msg: `uid:${UserGameRoles.game_uid}，今天已签到\n第${Info.total_sign_day}天奖励：${reward}`,
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
                msg: `uid:${UserGameRoles.game_uid}，${tips}\n第${totalSignDay}天奖励：${reward}`
            }
        }

        return {
            retcode: -1000,
            msg: `uid:${UserGameRoles.game_uid}，签到失败：${this.signMsg}`
        }
    }
    /**
     * 
     * @returns {Promise<genShinSignInfoData>}
     */
    async get_sign_info() {
        let UserGameRoles = await this.getUserGameRoles('hk4e_cn')
        const signInfo = await this.send({
            url: "https://api-takumi.mihoyo.com/event/bbs_sign_reward/info",
            method: "get",
            query: `act_id=e202009291139501&region=${UserGameRoles.region}&uid=${UserGameRoles.game_uid}`,
            sign: true,
        })

        return signInfo
    }
    async bbs_sign() {
        let url = "https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign"
        let UserGameRoles = await this.getUserGameRoles('hk4e_cn')
        let sign = await this.send({
            url,
            method: "post",
            body: JSON.stringify({
                'act_id': 'e202009291139501',
                'region': UserGameRoles.region,
                'uid': UserGameRoles.game_uid
            }),
            sign: true
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
                    'uid': UserGameRoles.game_uid
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
        const UserGameRoles = await this.getUserGameRoles('hk4e_cn')
        let today = new Date()
        let reward = gsData.getReward('genshin')
        if (reward) {
            reward = JSON.parse(reward)
        }
        if (!reward || reward[endMonth] < today.getMonth() + 1) {
            let res = await this.send({
                url: "https://api-takumi.mihoyo.com/event/bbs_sign_reward/home",
                method: "get",
                sign: true,
                query: `act_id=e202009291139501&region=${UserGameRoles.region}&uid=${UserGameRoles.game_uid}`
            })
            if (!res || res.retcode !== 0) return ''
            let data = res.data
            if (data && data.awards && data.awards.length > 0) {
                reward = data.awards
                reward.endMonth = today.getMonth() + 1
                gsData.setReward('genshin', JSON.stringify(reward))
            } else {
                return ''
            }
        }

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