import lodash from "lodash";
import fetch from "node-fetch";
import util from 'node:util'
import webLogin from "../login/webLogin/webLogin.js";
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
    constructor(cookies, config = {}) {
        super(cookies)
        this.model = config.model || 'gs'
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

    async signIn(gids) {

    }
}