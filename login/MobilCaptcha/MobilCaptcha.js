import { geetest } from "geetest-auto";
import { appconfig } from "../../config/appconfig.js";
import axios from "axios";
import RequestUtils from "../network/RequestUtils.js";


export default class MobileCaptcha {
    static async createMobileCaptchaByActionTicket(actionTicket = '', _headers = {}) {
        if (actionTicket == '') return false;
        let Referer = `https://user.mihoyo.com/login-platform/mobile.html?action_ticket=${actionTicket}&action_type=verify_for_component&client_type=${appconfig["x-rpc-client_type"]}&game_biz=${appconfig["x-rpc-game_biz"]}&app_id=${appconfig["x-rpc-app_id"]}&app_version=${appconfig["x-rpc-app_version"]}`
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-verifier/verifier/createMobileCaptchaByActionTicket';
        let request = new RequestUtils();
        request.setHeaders({
            ...appconfig, ..._headers,
            Referer: Referer,
            'x-rpc-mi_referrer': Referer + '#/security-verification/1'
        })

        let body = {
            action_ticket: actionTicket,
            action_type: 'verify_for_component',
        }
        let response = await request.post(url, JSON.stringify(body))
        if (response.retcode == 0 && String(response.message).toLowerCase() == 'ok') return true
        else {
            switch (response.data.retcode) {
                default: debugger
            }

        }
        return false;
    }
    static async verifyActionTicketPartly(actionTicket = '', mobile_captcha = '') {
        if (actionTicket == '' || mobile_captcha == '') return false;
        let Referer = `https://user.mihoyo.com/login-platform/mobile.html?action_ticket=${actionTicket}&action_type=verify_for_component&client_type=${appconfig["x-rpc-client_type"]}&game_biz=${appconfig["x-rpc-game_biz"]}&app_id=${appconfig["x-rpc-app_id"]}&app_version=${appconfig["x-rpc-app_version"]}`
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-verifier/verifier/verifyActionTicketPartly';
        let headers = {
            ...appconfig, ..._headers,
            Referer: Referer,
            'x-rpc-mi_referrer': Referer + '#/security-verification/1'
        }
        let body = {
            action_ticket: actionTicket,
            action_type: 'verify_for_component',
            verify_method: 'verify_method',
            mobile_captcha: mobile_captcha
        }
        let response = await axios.post(url, body, { headers: headers })
        if (response.data.retcode == 0 && String(response.data.message).toLowerCase() == 'ok') return true

        return false;
    }
}