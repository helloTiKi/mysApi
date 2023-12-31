import gsData from "../config/gsData.js";
import login from "../login/login.js";
import RSAUtils from "../utils/RSAUtils.js";
import RequestUtils from "../utils/RequestUtils.js";
import utils from "../utils/utils.js";
import Cookie from "./CookiesUtils.js";
import { getDevice_2, getDevice_5 } from "./device/getDevice.js";


/**
 * @typedef userConfig
 * @property {string} username
 * @property {string} cookie
 * @property {'cookie'|'username'} type
 */

export default class user {
    static async verifyLtoken(ltuid = '', ltoken = '') {
        //如果两个参数都为空，直接返回false
        if (!ltuid || !ltoken) {
            return false;
        }
        let request = new RequestUtils()
        request.cookie.setCookieByHeader({
            ltuid,
            ltoken
        })
        let response = await request.post('https://passport-api-v4.mihoyo.com/account/ma-cn-session/web/verifyLtoken')
        if (response.retcode == 0) {
            return true
        } else {
            return false
        }
    }
    static async getUserGameRolesByCookie(cookie = '') {
        if (cookie == '') return false
        let _cookie = new Cookie(cookie)
        let request = new RequestUtils(_cookie)
        let data = await request.get('https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie')

    }
    /**
     * 
     * @param {string} str 传入cookie或者username
     */
    static init(str) {
        let tuid = gsData.getltuidByUserName(str)
        if (tuid) {
            let cookie = gsData.getCookieByLtuid(tuid)
            if (cookie) {
                return new user(cookie)
            }
        } else {
            //判断参数是否存在cookie字段，是否存在关键字段
            let data = str.split(';')
            let cookieKey = []
            data.forEach(e => {
                let d = e.split('=');
                cookieKey.push(d[0])
            })
            if (cookieKey.includes('stoken') && cookieKey.includes('stuid')) {
                //存在appCookie
                return new user(str)
            } else if (cookieKey.includes('ltoken') && cookieKey.includes('ltuid')
                && cookieKey.includes('cookie_token')) {
                //存在webcookie
                return new user(str)
            } else {
                return false
            }
        }
    }
    get username() {
        return gsData.getUserNameByLtuid(this.ltuid)
    }
    get ltuid() {
        return this._cookie.getCookie('ltuid') || this._cookie.getCookie('stuid')
    }
    get stuid() {
        return this._cookie.getCookie('stuid') || this._cookie.getCookie('ltuid')
    }
    get ltoken() {
        return this._cookie.getCookie('ltoken')
    }
    get stoken() {
        return this._cookie.getCookie('stoken')
    }
    get v1Cookie() {
        return this._cookie.v1Cookie
    }
    get v2Cookie() {
        return this._cookie.v2Cookie
    }
    get v3Cookie() {
        return this._cookie.v3Cookie
    }
    get allCookie() {
        return this._cookie.CookieString
    }
    constructor(cookie = '') {
        this._cookie = new Cookie(cookie)
        this.request = new RequestUtils(this._cookie)
    }
    async verifyLtoken() {
        //如果两个参数都为空，直接返回false
        if (!this.ltuid || !this.ltoken) {
            return false;
        }
        let device = gsData.getUserDevice(this.username, 2)
        //如果最后更新时间大于一天，则执行更新
        if (device.lastUpdateTime < Date.now() - 1000 * 60 * 60 * 24) {
            device = await getDevice_2(this.username)
        }
        this.request.setHeaders({
            'x-rpc-device_fp': device.device_fp,
            'x-rpc-device_id': device.bbs_device_id
        })
        let response = await this.request.post(
            'https://passport-api-v4.mihoyo.com/account/ma-cn-session/web/verifyLtoken',
            JSON.stringify({ t: utils.getTimeNow(13) }))
        if (response.retcode == 0) {
            return true
        } else {
            return false
        }
    }
    async verify() {
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-session/app/verify'
        //{"mid":"0cbakh8te4_mhy",
        //"token":{"token":"v2_MFz7DIP-sBu4NZgN95yNi18pvWIUxp20jhI53vEZ5Q8A_k9WsjyY63PsCzrRYE5GApuRfbxuI4V-WGmvtYleOIOkTPFk-xdfLg-H","token_type":1}}
    }
    async getLTokenBySToken() {
        let url = 'https://passport-api.mihoyo.com/account/auth/api/getLTokenBySToken'
        let response = await this.request.get(url)
        if (response.retcode == 0) {
            this.saveCookie()
            return true
        } else {
            console.error(response)
            return false
        }
    }
    async getCookieTokenByStoken() {
        let url = 'https://passport-api.mihoyo.com/account/auth/api/getCookieAccountInfoBySToken'
        let response = await this.request.get(url)
        if (response.retcode == 0) {
            this.saveCookie()
            return true
        } else {
            console.error(response)
            return false
        }
    }
    async loginByPassWord(username = '', password = '') {
        if (username == '' || password == '') return false
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-passport/app/loginByPassword'
        let body = {
            "account": RSAUtils.encrypt(username),
            "password": RSAUtils.encrypt(password),
        }
        let device = await getDevice_2(username)
        this.request.setHeaders({
            'x-rpc-device_fp': device.device_fp,
            'x-rpc-device_id': device.bbs_device_id,
            'x-rpc-device_model': 'SEA-AL10',
            'x-rpc-device_name': 'SEA-AL10',
            'x-rpc-lifecycle_id': utils.getGuid()
        })
        var response = await this.request.post(url, JSON.stringify(body));
        if (response.retcode == -3235) return false//设备需要风险验证
        if (response.retcode == 0) {
            let data = {
                /**@type {string} */
                stoken: response.data.token.token,
                /**@type {string} */
                login_ticket: response.data.login_ticket,
                /**@type {string} */
                mid: response.data.user_info.mid,
                /**@type {string} */
                stuid: response.data.user_info.aid
            }
            this._cookie.setCookieByObject(data)
            gsData.setUserCookie(data.stuid, data)
            return data
        } else return false
    }
    saveCookie() {
        let data = this._cookie.CookieString
        gsData.setUserCookie(this.ltuid || this.stuid, data)
    }
}