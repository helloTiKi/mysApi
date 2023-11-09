import md5 from 'md5';
import axios from 'axios';
import Cookie from '../user/CookiesUtils.js';
import { appconfig, hostSalt, saltType } from '../config/appconfig.js';
import { geetest } from 'geetest-auto';
import CryptoJS from 'crypto-js';

function getSaltFunction(salt = '') {
    if (!salt) return false
    let type = saltType[salt];
    switch (type) {
        case 1:
            return function () {
                return getDs(salt)
            }
        case 2:
            return function (body = '', query = '') {
                return getDssign(salt, body, query)
            }
        default:
            return false
    }
}
function getUrlHost(url = '') {
    if (/https?:\/\/(.*?)\//g.test(url)) {
        let data = /https?:\/\/(.*?)\//g.exec(url)[1]
        return data
    }
    return ''
}
function getUrlQuery(url = '') {
    if (/\?(.*?)$/g.test(url)) {
        return /\?(.*?)$/g.exec(url)[1]
    }
    return ''
}
function getUrlSign(url, data = '') {
    let host = getUrlHost(url)
    let salt = hostSalt[host] || ''
    if (!salt) return ''
    let query = getUrlQuery(url);
    let signFunction = getSaltFunction(salt);
    if (signFunction) {
        return signFunction(data, query)
    }
    return ''
}
function getDs(salt) {
    let str = `salt=${salt}&t=${getTimeNow(10)}&r=${getRandomString(6)}`
    return md5(str)
}

function getDssign(salt, body = '', query = '') {
    var valueOf = getTimeNow(10);
    var sb3 = getRandomString(6);
    var m26360b = md5(`salt=${salt}&t=${valueOf}&r=${sb3}&b=${body}&q=${query}`);
    return valueOf + ',' + sb3 + ',' + m26360b;
}

/**
 * @typedef {object} mysResponse
 * @property {number} retcode
 * @property {string} message
 * @property {object} data
 * @property {object} headers
 */

export default class RequestUtils {
    constructor() {
        let th = this
        this.cookie = new Cookie()
        this.request = axios.create({
            transformRequest: [function (data, headers) {
                //判断url是否有额外的请求值            
                !function () {
                    var url = this.url;
                    let sign = getUrlSign(url)
                    if (sign) {
                        headers['DS'] = sign
                    }
                }()
                return data;
            }]
        })
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