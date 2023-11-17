import md5 from "md5";
import lodash from "lodash";
import fetch from "node-fetch";
import util from 'node:util'
import webLogin from "../webLogin/webLogin.js";
import gsData from "../config/gsData.js";
import user from "../user/user.js";

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
    model = ''
    isLogin = false;
    constructor(cookies) {
        super(cookies)
        this.UserGameRoles = {}
        this.init()
    }
    async init() {
        let th = this
        /**@private */
        this.UserGameRoles = new Promise(async (resolve, reject) => {
            if (!await this.verifyLtoken()) {
                await this.getLTokenBySToken()
            }
            if (this._cookie.getCookie('cookie_token') == '') {
                await this.getCookieTokenByStoken()
            }
            th.request.setHeaders({
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
                    if (!user[obj.game_biz]) user[obj.game_biz] = [];
                    user[obj.game_biz].push(obj);
                })
                resolve(user)
                this.isLogin = true;
                gsData.setUserCookie(this.ltuid, this._cookie.CookieString)
            })

        })
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
    async getActionTicketBySToken() {
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
            body
        })

    }
}