import gsData from "../config/gsData.js";

import RSAUtils from "../utils/RSAUtils.js";
import RequestUtils from "../utils/RequestUtils.js";
import utils from "../utils/utils.js";
import Cookie from "./CookiesUtils.js";
import { getDevice_2, getDevice_5 } from "./device/getDevice.js";
async function login(username, password = '') {
    if (username == '') return '账号不能为空'
    let ltuid = gsData.getltuidByUserName(username)
    if (ltuid) {
        let cookie = gsData.getCookieByLtuid(ltuid)
        if (cookie) {
            this._cookie.setCookieString(cookie)
            this.init()
            return this.cookie
        }
    }
    if (password == '') return '密码不能为空'
    let login = new webLogin(username, password)
    let cookie = await login.login()
    this._cookie.setWebCookie(cookie)

    this.init()
    gsData.setUserName(username, this.ltuid)
    return this.cookie
}
/**创建验证 */
async function createVerification() {
    let data = await this.send({
        method: 'get',
        url: 'https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/createVerification',
        query: 'is_high=true'
    })
    if (!data) {
        return false
    }
    if (data.retcode == 0) {
        return data.data
    } else {
        return false
    }
}
async function verifyVerification() {
    let url = "https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/verifyVerification"
}


/**
 * @typedef userConfig
 * @property {string} username
 * @property {string} cookie
 * @property {'cookie'|'username'} type
 */

export default class user {
    #isLogin = false; //是否登录
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
     * @param {string} username 传入username
     */
    static initByUserName(username) {
        let tuid = gsData.getltuidByUserName(username)
        if (tuid) {
            let cookie = gsData.getCookieByLtuid(tuid)
            return new user(cookie)
        } else {
            return new user()
        }
    }
    static initByCookie(str) {
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
    get username() {
        return gsData.getUserNameByLtuid(this.ltuid) || this.ltuid
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
        if (cookie instanceof user) {
            this._cookie = cookie._cookie
            this.request = cookie.request
            this.UserGameRoles = cookie.UserGameRoles
            return
        }
        this._cookie = new Cookie(cookie)
        this.request = new RequestUtils(this._cookie)
        this.UserGameRoles = undefined
        if (cookie == '') return
        this.init()
    }
    async verifyLtoken() {
        //如果两个参数都为空，直接返回false
        if (!this.ltuid || !this.ltoken) {
            return false;
        }
        let device = gsData.getUserDevice(this.username, 2)
        //如果最后更新时间大于一天，则执行更新
        if (device?.lastUpdateTime < Date.now() - 1000 * 60 * 60 * 24) {
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
    async verifyCookieToken() {
        //如果两个参数都为空，直接返回false
        if (!this.ltuid || !this.ltoken) {
            return false;
        }
        let device = gsData.getUserDevice(this.username, 2)
        //如果最后更新时间大于一天，则执行更新
        if (device?.lastUpdateTime < Date.now() - 1000 * 60 * 60 * 24) {
            device = await getDevice_2(this.username)
        }
        this.request.setHeaders({
            'x-rpc-device_fp': device.device_fp,
            'x-rpc-device_id': device.bbs_device_id
        })
        let response = await this.request.post(
            'https://passport-api.mihoyo.com/account/ma-cn-session/web/verifyCookieToken')
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
    async loginByMobileCaptcha(username = '', callback) {
        if (username.length != 11 || typeof callback != 'function') return false
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-verifier/verifier/createLoginCaptcha'
        let body = {
            "mobile": RSAUtils.encrypt(username),
            "area_code": RSAUtils.encrypt("+86"),
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
        if (response.retcode == -3235) return console.error("设备需要风险验证"), false
        if (response.retcode != 0) return console.error(response.message), false
        body['action_type'] = response.data.action_type
        body.captcha = await callback()
        if (body.captcha == '') return console.error("验证码不能为空"), false
        url = "https://passport-api.mihoyo.com/account/ma-cn-passport/app/loginByMobileCaptcha";
        response = await this.request.post(url, JSON.stringify(body));
        if (response.retcode != 0) return console.error(response.message), false
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
    }
    saveCookie() {
        let data = this._cookie.CookieString
        gsData.setUserCookie(this.ltuid || this.stuid, data)
    }
    async isLogin() {
        if (typeof this.UserGameRoles?.then) await this.UserGameRoles
        return this.#isLogin
    }
    async init() {
        let th = this
        /**@private */
        this.UserGameRoles = new Promise(async (resolve, reject) => {
            if (!await this.verifyLtoken()) {//检查LToken是否有效
                await this.getLTokenBySToken()
                if (!await this.verifyLtoken()) {
                    reject('获取LToken失败')
                    console.error('获取LToken失败')
                    return
                }
            }
            if (!await this.verifyCookieToken()) {//检查CookieToken是否有效
                await this.getCookieTokenByStoken()
                if (!await this.verifyCookieToken()) {
                    reject('获取CookieToken失败')
                    console.error('获取CookieToken失败')
                    return
                }
            }
            th.request.setHeaders({
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67',
            })
            let url = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie'
            let data = await th.request.get(url)
            if (data.retcode != 0) {
                console.error(data.message);
                resolve({});
                if (this.ltuid) gsData.setUserCookie(this.ltuid, '')
                this.#isLogin = false
                return;
            }
            let list = data.data.list;
            let user = {}
            list.forEach(obj => {
                if (!user[obj.game_biz]) user[obj.game_biz] = [];
                user[obj.game_biz].push(obj);
            })
            this.#isLogin = true;
            gsData.setUserCookie(this.ltuid, this._cookie.CookieString)
            resolve(user)
        })
    }
}