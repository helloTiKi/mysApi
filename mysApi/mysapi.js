import md5 from "md5";
import lodash from "lodash";
import fetch from "node-fetch";
import util from 'node:util'
import webLogin from "../webLogin/webLogin.js";
import gsData from "../config/gsData.js";
import user from "../user/user.js";

Object.prototype.json = function () { return JSON.stringify(this) }
class cookie {
    cookie = {}
    /**
     * 
     * @param {string} cookie 
     */
    constructor(cookie) {
        if (!cookie) return
        cookie = cookie.replace(/ /g, '');
        if (typeof cookie == 'string') {
            cookie = cookie.split(';');
        }
        for (let i of cookie) {
            let [key, value] = i.split('=')
            this.cookie[key] = value
        }

    }
    /**
     * 
     * @param {'all'|'v1'|'v2'|'v3'} type all为取所有Cooke，v1指webcookie，v2新版webCooke，v3手机cookie（stoken）
     * @returns 
     */
    tocookie(type = 'all') {
        switch (type) {
            case 'all':
                let ret = []
                Object.keys(this.cookie).forEach(e => {
                    if (this.cookie[e]) ret.push(`${e}=${this.cookie[e]}`)
                })
                return ret.join(';')
            default:
                return this.getCookie(type)

        }

    }
    /**
     * 
     * @param {string|string[]} key 
     * @returns {string|object}
     */
    get(key) {
        if (typeof key == 'string') {
            return this.cookie[key] || ''
        } else if (Array.isArray(key)) {
            let ret = {}
            for (let i of key) {
                ret[i] = this.cookie[i]
            }
            return ret
        }
    }
    getCookie(type = 'v1') {
        let map = {
            v1: ['ltoken', 'cookie_token', 'ltuid', 'account_id'],
            v2: ['ltoken_v2', 'cookie_token_v2', 'ltuid_v2', 'account_id_v2'],
            v3: ['stoken', 'stuid', 'mid']
        }
        let ret = [];
        map[type].forEach(e => {
            ret.push(`${e}=${this.cookie[e]}`)
        })
        return ret.join(';')
    }
    setWebCookie(cookie) {
        let ck = { ...cookie.v1, ...cookie.v2 }
        this.cookie = ck
    }
    setCookieString(cookie) {
        if (!cookie) return
        cookie = cookie.replace(/ /g, '');
        if (typeof cookie == 'string') {
            cookie = cookie.split(';');
        }
        for (let i of cookie) {
            let [key, value] = i.split('=')
            this.cookie[key] = value
        }
    }
}
/**
* @typedef mysResponse
* @property {number} retcode
* @property {string} message
* @property {object} data
*/

function getMysCookie(cookie) {
    let v1map = ['ltoken', 'cookie_token', 'ltuid', 'account_id', 'DEVICEFP']
    let cookieret = []
    switch (typeof cookie) {
        case 'string':
            cookie = cookie.replace(' ', '')
            cookie = cookie.replace('\n', '')
            let cook = {}
            cookie.split(';').forEach(key => {
                let k = key.split('=')
                cook[k[0]] = k[1]
            })
            cookie = cook;
        case 'object':
            Object.keys(cookie).forEach(key => {
                if (v1map.includes(key)) {
                    cookieret.push(key + '=' + cookie[key])
                }
            })
            break
    }
    return cookieret.join(';')
}

export default class mysApi extends user {

    isLogin = false;
    server = ''
    /**
     * @returns {string}
     */
    get ltuid() {
        return this._cookie.getCookie('ltuid')
    }
    get device() {
        if (!this._device) this._device = `Yz-${md5(this.ltuid).substring(0, 5)}`
        return this._device
    }
    get cookie_v2() {
        return this._cookie.tocookie('v2')
    }
    get cookie_v3() {
        return this._cookie.tocookie('v3')
    }
    constructor(cookies) {
        super(cookies)
        this.UserGameRoles = {}
        if (this.cookie) {
            this.init()
        }
    }
    init() {
        let th = this
        /**@private */
        this.UserGameRoles = new Promise((resolve, reject) => {
            th.request.setHeaders({
                'Cookie': this.cookie,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67',
            })
            let url = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie'
            th.request.get(url).then(data => {
                if (data.retcode != 0) {
                    console.error(data.message);
                    resolve({});
                    if (this.ltuid) gsData.setUserCookie(this.ltuid, '')
                    this.isLogin = false
                    return;
                }
                let list = data.data.list;
                let user = {}
                list.forEach(obj => {
                    user[obj.game_biz] = obj;
                })
                resolve(user)
                this.isLogin = true;
                gsData.setUserCookie(this.ltuid, this._cookie.CookieString)
            })

        })
    }
    /**
     * @param {object} config 
     * @param {'get'|'post'} config.method
     * @param {string} config.url
     * @param {string} config.query
     * @param {boolean} config.sign
     * @param {any} config.body
     * @param {object} config.headers
     * @returns 
     */
    async send(config) {
        if (!this.isLogin) return false;
        let { method, url, query, sign, body, headers } = config

        let _headers = this.getHeaders(query, body, sign)
        _headers.cookie = this.cookie

        /**如果有传入协议头，则叠加一起 */
        if (headers) _headers = { ..._headers, ...headers }
        /**构造请求体 */
        let param = {
            headers: _headers,
            method: method || 'get',
        }
        /**如果存在查询键，则修改url */
        if (query) url += `?${query}`
        /**如果存在body,则添加到请求体 */
        if (body) param.body = body
        /**@type {Response} */
        let response = {}
        try {
            response = await fetch(url, param)
        } catch (error) {
            console.error(error.toString())
            return false
        }
        if (!response.ok) {
            console.error(`[米游社接口][${type}][${this.uid}] ${response.status} ${response.statusText}`)
            return false
        }
        /**@type {mysResponse} */
        const res = await response.json()
        if (!res) {
            console.mark('mys接口没有返回')
            return false
        }

        if (res.retcode !== 0) {
            console.debug(`[米游社接口][请求参数] ${url} ${JSON.stringify(param)}`)
        }
        return res
    }
    async getUserGameRoles(game_biz = '') {
        if (this.cookie != '') if (util.types.isPromise(this.UserGameRoles)) this.UserGameRoles = await this.UserGameRoles
        return game_biz ? this.UserGameRoles[game_biz] : this.UserGameRoles;
    }
    async login(username, password = '') {
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
    async createVerification() {
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
    async verifyVerification() {
        let url = "https://api-takumi-record.mihoyo.com/game_record/app/card/wapi/verifyVerification"
    }
    getDs(q = '', b = '') {
        let n = ''
        if (['cn_gf01', 'cn_qd01'].includes(this.server)) {
            n = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs'
        } else if (['os_usa', 'os_euro', 'os_asia', 'os_cht'].includes(this.server)) {
            n = 'okr4obncj8bw5a65hbnn5oo6ixjc3l9w'
        } else {
            n = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs'
        }
        let t = Math.round(new Date().getTime() / 1000)
        let r = Math.floor(Math.random() * 900000 + 100000)
        let DS = md5(`salt=${n}&t=${t}&r=${r}&b=${b}&q=${q}`)
        return `${t},${r},${DS}`
    }
    /** 签到ds */
    getDsSign() {
        /** @Womsxd */
        const n = 'Qqx8cyv7kuyD8fTw11SmvXSFHp7iZD29'
        const t = Math.round(new Date().getTime() / 1000)
        const r = lodash.sampleSize('abcdefghijklmnopqrstuvwxyz0123456789', 6).join('')
        const DS = md5(`salt=${n}&t=${t}&r=${r}`)
        return `${t},${r},${DS}`
    }
    getHeaders(query = '', body = '', sign = false, iscdk = false) {
        const cn = {
            app_version: '2.37.1',
            User_Agent: `Mozilla/5.0 (Linux; Android 12; ${this.device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.37.1`,
            client_type: 5,
            Origin: 'https://webstatic.mihoyo.com',
            X_Requested_With: 'com.mihoyo.hyperion',
            Referer: 'https://webstatic.mihoyo.com'
        }
        const os = {
            app_version: '2.9.0',
            User_Agent: `Mozilla/5.0 (Linux; Android 12; ${this.device}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBSOversea/2.9.0`,
            client_type: '2',
            Origin: 'https://webstatic-sea.hoyolab.com',
            X_Requested_With: 'com.mihoyo.hoyolab',
            Referer: 'https://webstatic-sea.hoyolab.com'
        }
        let client
        if (this.server.startsWith('os')) {
            client = os
        } else {
            client = cn
        }
        if (sign) {
            return {
                'x-rpc-app_version': client.app_version,
                'x-rpc-client_type': client.client_type,
                'x-rpc-device_id': this.getGuid(),
                'User-Agent': client.User_Agent,
                'X-Requested-With': client.X_Requested_With,
                'x-rpc-platform': 'android',
                'x-rpc-device_model': this.device,
                'x-rpc-device_name': this.device,
                'x-rpc-channel': 'miyousheluodi',
                'x-rpc-sys_version': '6.0.1',
                Referer: client.Referer,
                DS: this.getDsSign()
            }
        }
        return {
            'x-rpc-app_version': client.app_version,
            'x-rpc-client_type': client.client_type,
            'User-Agent': client.User_Agent,
            Referer: client.Referer,
            DS: this.getDs(query, body),
            "x-rpc-device_fp": this.device_fp
        }
    }
    getGuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }

    async getActionTicketBySToken() {
        let cookie = this.cookie_v3


    }

    /**
     * 绑定游戏默认角色
     * @param {object} config 
     * @param {string} config.action_ticket
     * @param {string} config.game_biz
     * @param {string} config.game_uid
     * @param {string} config.region
     */
    async changeGameRoleByDefault(config) {
        let { action_ticket, game_biz, game_uid, region } = config
        let body = { action_ticket, game_biz, game_uid, region, t: this.getTimeStamp() }
        let data = await this.send({
            url: 'https://api-takumi.mihoyo.com/binding/api/changeGameRoleByDefault',
            method: 'POST',
            body: body.json(),
        })

    }

    getTimeStamp(t13 = true) {
        return String(t13 ? new Date().getTime() : Math.round(new Date().getTime() / 1000))
    }
}