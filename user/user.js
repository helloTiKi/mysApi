import gsData from "../config/gsData.js";
import login from "../login/login.js";
import RequestUtils from "../utils/RequestUtils.js";
import Cookie from "./CookiesUtils.js";

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
            //判断参数是否是cookie字段，是否存在关键字段
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
    get ltuid() {
        return this._cookie.getCookie('ltuid')
    }
    get stuid() {
        return this._cookie.getCookie('stuid')
    }
    get ltoken() {
        return this._cookie.getCookie('ltoken')
    }
    get stoken() {
        return this._cookie.getCookie('stoken')
    }
    get cookie() {
        return this._cookie.CookieString
    }
    constructor(cookie = '') {
        this._cookie = new Cookie()
        this.request = new RequestUtils(this._cookie)
        this._cookie.setCookieByString(cookie)
    }
    get v2Cookie() {

    }
    async verifyLtoken() {
        //如果两个参数都为空，直接返回false
        if (!ltuid || !ltoken) {
            return false;
        }
        let request = new RequestUtils()
        request.cookie.setCookieByHeader({
            ltuid,
            ltoken
        })
        let response = await request.post(
            'https://passport-api-v4.mihoyo.com/account/ma-cn-session/web/verifyLtoken',
            JSON.stringify({ t: getTimeNow(13) }))
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

    }
}