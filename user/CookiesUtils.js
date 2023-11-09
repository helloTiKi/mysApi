

export default class Cookie {
    cookie = {};
    constructor() {
        Object.defineProperty(this.cookie, 'CookieString', {
            get: function () {
                return Object.keys(this).map(function (key) {
                    return key + '=' + this[key];
                }, this).join('; ');
            }
        })
    }
    get CookieString() {
        return this.cookie.CookieString;
    }
    setCookie(key = '', value = '') {
        if (!key) return
        if (value) {
            this.cookie[key] = value
        } else {
            this.cookie[key] = ''
        }
    }
    setCookieByObject(obj = {}) {
        for (let key in obj) {
            this.setCookie(key, obj[key])
        }
    }
    setCookieByString(str = '') {
        if (!str) return
        str = str.replace(' ', '')
        let arr = str.split(';')
        for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split('=')
            this.setCookie(arr2[0], arr2[1])
        }
    }
    setCookieByHeader(header = {}) {
        if (!header) return
        if (!header['set-cookie']) return
        let arr = header['set-cookie']
        for (let i = 0; i < arr.length; i++) {
            let arr2 = arr[i].split(';')
            let key = arr2[0].split('=')[0]
            let value = arr2[0].split('=')[1]
            this.setCookie(key, value)
        }
    }
    setCookieByArray(arr = []) {
        for (let i = 0; i < arr.length; i++) {
            let key = arr[i][0]
            let value = arr[i][1]
            this.setCookie(key, value)
        }
    }
    removeCookie(key = '') {
        if (!key) return
        delete this.cookie[key]
    }
    removeAllCookie() {
        this.cookie = {}
    }
    getCookie(key = '') {
        if (!key) return this.cookie
        return this.cookie[key] || ''
    }
}