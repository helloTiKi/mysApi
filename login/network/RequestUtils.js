import lodash from 'lodash';
import md5 from 'md5';
import axios from 'axios';
import Cookie from './CookiesUtils.js';
import { appconfig } from '../../config/appconfig.js';
import { geetest } from 'geetest-auto';
import CryptoJS from 'crypto-js';


/**
 * @typedef {object} mysResponse
 * @property {number} retcode
 * @property {string} message
 * @property {object} data
 * @property {object} headers
 */


export default class RequestUtils {
    /**@private */
    SALT_PROD = "JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS";
    /**@private */
    randomRange = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    /**@private */
    SALT_DEV = "IZPgfb0dRPtBeLuFkdDznSZ6f4wWt6y2";
    /**@private */
    salt = this.SALT_DEV;
    static createSign(body = '', query = '') {
        try {
            var valueOf = getTimeNow(10);
            var sb3 = getRandomString(6);
            var m26360b = md5("salt=" + this.salt + "&t=" + valueOf + "&r=" + sb3 + "&b=" + body + "&q=" + query);
            return valueOf + ',' + sb3 + ',' + m26360b;
        } catch (e) {
            console.error(e);
            return "";
        }
    }
    setEnv(porteEnv = 1) {
        var i = porteEnv;
        var str = this.SALT_DEV;
        if (i != 1) {
            if (i != 2) {
                if (i != 3) {
                    if (i != 4 && i != 5) {
                        throw "Invalid porte env";
                    }
                }
            }
            str = this.SALT_PROD;
        }
        this.salt = str;
    }
    constructor() {
        let th = this
        this.cookie = new Cookie()
        this.request = axios.create()
        this.request.interceptors.response.use(function (response) {
            th.cookie.setCookieByHeader(response.headers)
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
        this.headers = appconfig
    }
    async get(url = '', query = '') {
        let response = this.request.get(url, {
            headers: {
                ...this.headers,
                DS: RequestUtils.createSign('', query)
            },
            params: query
        });
        return await this.checkResponse(response)
    }
    /**
     * 
     * @param {string} url 
     * @param {string} body 
     * @param {string} query 
     * @returns {Promise<mysResponse>}
     */
    async post(url = '', body = '', query = '') {
        let response = await this.request.post(url, body, {
            headers: {
                ...this.headers,
                DS: RequestUtils.createSign(body, query)
            },
            params: query
        });

        switch (await this.checkResponse(response)) {
            case 'ok':
                let ret = {
                    ...response.data,
                    headers: response.headers
                }
                return ret
            case 'error':
                console.error(response.data)
                return false
            case 'repeat':
                response = await this.post(url, body, query)
                this.setHeader('x-rpc-aigis', '')
                return response
        }
    }
    setHeaders(headers) {
        this.headers = { ... this.headers, ...headers };
    }
    getHeaders() {
        return this.headers;
    }
    setHeader(key, value) {
        this.headers[key] = value;
    }
    setCookie(key, value) {
        this.cookie.setCookie(key, value)
    }
    /**
     * 
     * @param {any} response 
     * @returns {Promise<'ok'|'repeat'|'error'>}
     */
    async checkResponse(response) {
        /**@type {mysResponse} */
        let mysdata = response.data;
        if (mysdata.retcode == -3101) {
            //风险验证
            console.log('请求频繁需要验证')
            let verifierData = JSON.parse(response.headers['x-rpc-aigis']);
            let session_id = verifierData.session_id;
            let geetestData = JSON.parse(verifierData.data);
            let Gee = new geetest(geetestData.gt, geetestData.challenge)
            let res = await Gee.start()
            this.setHeader('x-rpc-aigis', `${session_id};${CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(res)))}`)
            return 'repeat';
        } else {
            if ([-3235, 0].includes(mysdata.retcode)) {
                return 'ok'
            } else {
                debugger
                return 'ok'
            }
        }
    }
}