import gsData from "../config/gsData.js";
import RSAUtils from "../utils/RSAUtils.js";
import MobileCaptcha from "./MobilCaptcha/MobilCaptcha.js";
import { getDevice } from "./device/getDevice.js";
import RequestUtils from "./network/RequestUtils.js";


export default class login {
    static async loginByPassword(username, password) {
        let request = new RequestUtils();
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-passport/app/loginByPassword'
        let body = {
            "account": RSAUtils.encrypt(username),
            "password": RSAUtils.encrypt(password),
        }
        let UserDevice = await getDevice(username)

        request.setHeaders({
            'x-rpc-device_fp': UserDevice.device_fp,
            'x-rpc-device_id': UserDevice.seed_id,
            'x-rpc-device_model': 'NX629J',
            'x-rpc-device_name': 'NX629J',
            'x-rpc-lifecycle_id': UserDevice.device_id,
        })

        var response = await request.post(url, JSON.stringify(body));
        let mysdata = response
        if (mysdata.retcode !== 0) {
            switch (mysdata.retcode) {
                /**设备验证 */
                case -3235:
                    let verify = response.headers['x-rpc-verify']
                    verify = JSON.parse(JSON.parse(verify).verify_str)
                    if (await MobileCaptcha.createMobileCaptchaByActionTicket(verify.ticket, request.getHeaders())) {
                        return async function (mobile_captcha) {
                            if (MobileCaptcha.verifyActionTicketPartly(verify.ticket, mobile_captcha, request.getHeaders())) {
                                let data = await login.checkRiskVerified(verify.ticket, request.getHeaders())
                                return {
                                    /**@type {string} */
                                    stoken: data.token.token,
                                    /**@type {string} */
                                    login_ticket: data.login_ticket,
                                    /**@type {string} */
                                    mid: data.user_info.mid,
                                    /**@type {string} */
                                    stuid: data.user_info.aid
                                }
                            }
                        }
                    } else {
                        console.log('验证码获取失败')
                        return false
                    }
                    break;
            }
        } else {
            return {
                /**@type {string} */
                stoken: mysdata.data.token.token,
                /**@type {string} */
                login_ticket: mysdata.data.login_ticket,
                /**@type {string} */
                mid: mysdata.data.user_info.mid,
                /**@type {string} */
                stuid: mysdata.data.user_info.aid
            }
        }
    }
    static async checkRiskVerified(action_ticket = '', _headers = {}) {
        let request = new RequestUtils()
        request.setHeaders(_headers)
        let url = 'https://passport-api.mihoyo.com/account/ma-cn-passport/app/checkRiskVerified'
        let body = {
            "action_ticket": action_ticket
        }
        let mysdata = await request.post(url, body)
        if (mysdata.data.retcode === 0) {
            return mysdata.data.data
        } else {
            return false
        }
    }
}

