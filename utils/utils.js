import { md5 } from "./md5.js";
import { saltType, urlMap, hostSalt } from "../config/appconfig.js";
import CryptoJS from "crypto-js";


class util {
    constructor() { }
    getRandomString(length = 0) {
        if (length == 0) return ''
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    getTimeNow(length = 10) {
        if (length != 10 && length != 13) return ''
        let time = new Date().getTime() + ''
        return time.slice(0, length)
    }
    /**
    * 
    * @param {string} url 
    * @param {Cookie} cookie 
    * @returns {string}
    */
    getUrlCookie(url = '', cookie) {
        let _url = this.getUrlPath(url, false);
        for (const key of Object.keys(urlMap)) {
            if (urlMap[key].includes(_url)) {
                return cookie[key]
            }
        }
        return cookie.v1Cookie
    }
    getUrlPath(url = '', noHost = true) {
        if (url == '') return ''
        let _url = ''
        //如果url带有查询值则先分离开，只取路径
        if (url.indexOf('?') != -1) {
            let index = url.indexOf('?')
            _url = url.slice(0, index)
        } else _url = url
        let data = /https?:(\/\/.*?)(\/.*?)$/g.exec(_url)
        if (!noHost) {
            if (data) {
                return data[1] + data[2]
            }
        } else {
            if (data) {
                return data[2]
            }
        }
    }
    getSaltFunction(salt = '') {
        if (!salt) return false
        let type = this.getSaltType(salt)
        let th = this
        switch (type) {
            case 1:
                return function () {
                    return th.getDs(salt)
                }
            case 2:
                return function (body = '{}', query = '') {
                    return th.getDssign(salt, body, query)
                }
            default:
                return false
        }
    }
    getSaltType(salt = '') {
        if (!salt) return 0
        for (const type in saltType) {
            if (saltType[type].includes(salt)) return Number(type)
        }
        return 0
    }
    getUrlHost(url = '') {
        if (/https?:\/\/(.*?)\//g.test(url)) {
            let data = /https?:\/\/(.*?)\//g.exec(url)[1]
            return data
        }
        return ''
    }
    getUrlQuery(url = '') {
        if (/\?(.*?)$/g.test(url)) {
            return /\?(.*?)$/g.exec(url)[1]
        }
        return ''
    }
    getUrlSign(url = '', data = '') {
        if (url == '') return ''
        let host = this.getUrlHost(url)
        let salt = hostSalt[host] || ''
        switch (typeof salt) {
            case "string":
                break
            case "function":
                salt = salt(url)
                break
            default:
                return ''
        }

        let query = this.getUrlQuery(url);
        let signFunction = this.getSaltFunction(salt);
        if (signFunction) {
            return signFunction(data, query)
        }
        return ''
    }
    getDs(salt = '') {
        let t = this.getTimeNow(10)
        let r = this.getRandomString(6)
        let str = `salt=${salt}&t=${t}&r=${r}`
        return `${t},${r},${md5(str)}`
    }
    getDssign(salt = '', body = '', query = '') {
        var valueOf = this.getTimeNow(10);
        var sb3 = this.getRandomString(6);
        var m26360b = md5(`salt=${salt}&t=${valueOf}&r=${sb3}&b=${body}&q=${query}`);
        return valueOf + ',' + sb3 + ',' + m26360b;
    }
    getGuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }
        return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
    }
    getRandomNumber(length = 6, min = 0, max = 9) {
        let str = '';
        for (let i = 0; i < length; i++) {
            str += Math.floor(Math.random() * (max - min + 1) + min)
        }
        return str
    }
    jsonToQuery(json) {
        if (!json || typeof json !== 'object') return '';
        let arr = [];
        for (let key in json) {
            arr.push(key + '=' + json[key])
        }
        return arr.join('&')
    }
    Base64Encode(data) {
        switch (typeof data) {
            case "string":
                return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
            default:
                return CryptoJS.enc.Base64.stringify(CryptoJS.lib.WordArray.create(data));
        }
    }
    Base64Decode(data) {
        return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
    }
}

export default new util();