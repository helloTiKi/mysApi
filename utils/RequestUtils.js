import md5 from 'md5';
import axios from 'axios';
import Cookie from '../user/CookiesUtils.js';
import { hostSalt, saltType, urlMap } from '../config/appconfig.js';
import { geetest } from 'geetest-auto';
import CryptoJS from 'crypto-js';
import utils from './utils.js';
import gsData from '../config/gsData.js';

axios.defaults.headers.common = {
    'x-rpc-app_id': 'bll8iq97cem8',
    'x-rpc-aigis': '',
    'x-rpc-app_version': '2.58.2',
    'x-rpc-client_type': 2,
    'x-rpc-game_biz': 'bbs_cn',
    'x-rpc-sdk_version': '2.16.0',
    'x-rpc-sys_version': '7.1.2',
    'User-Agent': 'okhttp/4.9.3'
}


/**
 * @typedef {object} mysResponse
 * @property {number} retcode
 * @property {string} message
 * @property {object} data
 * @property {object} headers
 */

export default class RequestUtils {
    /**
     * 
     * @param {Cookie} cookieTool 
     */
    constructor(cookieTool) {
        this.headers = {}
        let th = this
        this.cookie = cookieTool instanceof Cookie ? cookieTool : false || new Cookie()
        this.request = axios.create({
            transformRequest: [function (data, headers) {
                var url = this.url
                let sign = utils.getUrlSign(url, data)
                if (sign) {
                    headers['DS'] = sign
                }
                let cookie = utils.getUrlCookie(url, th.cookie)
                if (cookie) {
                    headers['Cookie'] = cookie
                }
                if (headers['x-rpc-client_type']) {
                    let UserDevice = gsData.getUserDevice(th.cookie.getCookie('ltuid'), 2)
                    if (UserDevice) {
                        //如果最后更新时间超过1天则不使用
                        if (UserDevice.lastUpdateTime && Date.now() - UserDevice.lastUpdateTime < 86400000) {
                            headers['x-rpc-device-fp'] = UserDevice.device_fp
                            headers['x-rpc-device_id'] = UserDevice.bbs_device_id
                        }
                    }
                }
                return data;
            }]
        })
        this.request.interceptors.response.use(function (response) {
            th.cookie.setCookieByHeader(response.headers)
            return response;
        }, function (error) {
            return Promise.reject(error);
        });
    }
    /**
     * 
     * @param {string} url 
     * @param {object} query 
     * @returns {Promise<mysResponse>}
     */
    async get(url = '', query, header = {}) {
        if (query) {
            switch (typeof query) {
                case 'string':
                    url += `?${query}`
                    break
                case 'object':
                    url += `?${utils.jsonToQuery(query)}`
                    break
            }
        }
        let response = await this.request.get(url, {
            headers: {
                ...this.headers,
                ...header
            }
        });
        switch (await this.checkResponse(response.data)) {
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
                response = await this.get(url, query)
                this.setHeader('x-rpc-aigis', '')
                return response
        }
    }
    /**
     * 
     * @param {string} url 
     * @param {string} body 
     * @param {string} query 
     * @returns {Promise<mysResponse>}
     */
    async post(url = '', body = '', query = '', headers = {}) {
        if (query != '') {
            switch (typeof query) {
                case 'string':
                    url += `?${query}`
                    break
                case 'object':
                    url += `?${utils.jsonToQuery(query)}`
                    break
            }
        }
        let response = await this.request.post(url, body, {
            headers: {
                ...this.headers,
                ...headers
            },
        });

        switch (await this.checkResponse(response.data)) {
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
    /**
     * 
     * @param {mysResponse} response 
     * @returns {Promise<'ok'|'repeat'|'error'>}
     */
    async checkResponse(response) {
        let mysdata = response
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
                return 'ok'
            }
        }
    }
}