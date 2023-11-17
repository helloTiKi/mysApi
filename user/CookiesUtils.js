

export default class Cookie {
    static init(cookie) {
        let c = new Cookie(cookie)
        return (c.keyForIn('v3') || c.keyForIn('v2') || c.keyForIn('v1') || false) ? c : false
    }
    /**
     * 
     * @param {string|object|Array} cookie 
     * @returns {'v1'|'v2'|'v3'|false}
     */
    static getCookieType(cookie) {
        let c = new Cookie(cookie)
        return c.keyForIn('v3') ? 'v3' : c.keyForIn('v2') ? 'v2' : c.keyForIn('v1') ? 'v1' : false
    }
    /**
     * 
     * @param {string|object|Array} cookie 
     */
    constructor(cookie = '') {
        this.cookie = {}
        Object.defineProperty(this.cookie, 'CookieString', {
            get: function () {
                return Object.keys(this).map(function (key) {
                    return key + '=' + this[key];
                }, this).join('; ');
            }
        })
        Object.defineProperty(this.cookie, 'v1Cookie', {
            get: function () {
                let v1 = ['ltuid', 'ltoken', 'cookie_token', 'account_id']
                let ret = []
                v1.forEach(e => {
                    if (this[e]) {
                        ret.push(e + '=' + this[e])
                    } else {
                        ret.push(e + '=')
                    }
                })
                return ret.join('; ')
            }
        })
        Object.defineProperty(this.cookie, 'v2Cookie', {
            get: function () {
                let v1 = ['ltuid_v2', 'ltoken_v2', 'cookie_token_v2', 'ltmid_v2']
                let ret = []
                v1.forEach(e => {
                    if (this[e]) {
                        ret.push(e + '=' + this[e])
                    } else {
                        ret.push(e + '=')
                    }
                })
                return ret.join('; ')
            }
        })
        Object.defineProperty(this.cookie, 'v3Cookie', {
            get: function () {
                let v1 = ['stoken', 'stuid', 'mid']
                let ret = []
                v1.forEach(e => {
                    if (this[e]) {
                        ret.push(e + '=' + this[e])
                    } else {
                        ret.push(e + '=')
                    }
                })
                return ret.join('; ')
            }
        })
        if (cookie) {
            switch (typeof cookie) {
                case "string":
                    this.setCookieByString(cookie);
                    break;
                case "object":
                    if (Array.isArray(cookie)) {
                        this.setCookieByArray(cookie);
                    } else {
                        this.setCookieByObject(cookie);
                    }
                    break;
            }
        }
        if (!this.cookie['account_id']) this.cookie['account_id'] = this.cookie['ltuid']||this.cookie['stuid']
    }
    get CookieString() {
        return this.cookie.CookieString;
    }
    get v1Cookie() {
        return this.cookie.v1Cookie;
    }
    get v2Cookie() {
        return this.cookie.v2Cookie;
    }
    get v3Cookie() {
        return this.cookie.v3Cookie;
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
        str = str.replace(/ /g, '')
        str.replace(/(\w+)=([^;]+);?/g, ($0, $1, $2) => {
            this.setCookie($1, $2)
            return ''
        })
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
    getAllCookie() {
        return this.cookie
    }
    /**
     * 
     * @param {string[]|'v1'|'v2'|'v3'} key 
     */
    keyForIn(key) {
        let keys = Object.keys(this.cookie)
        let isok = 0
        if (typeof key == 'string') {
            switch (key) {
                case "v1":
                    ['ltoken', 'ltuid', 'cookie_token'].forEach(e => {
                        if (keys.includes(e)) isok++
                    })
                    return isok == 3
                case "v2":
                    ['ltoken_v2', 'ltuid_v2', 'cookie_token_v2', 'ltmid_v2'].forEach(e => {
                        if (keys.includes(e)) isok++
                    })
                    return isok == 4
                case "v3":
                    ['stoken', 'stuid'].forEach(e => {
                        if (keys.includes(e)) isok++
                    })
                    return isok == 2
            }
        } else if (Array.isArray(key)) {
            key.forEach(e => {
                if (keys.includes(e)) isok++
            })
            return isok == key.length
        } else return false
    }
    getCookieType() {
        return this.keyForIn('v3') ? 'v3' : this.keyForIn('v2') ? 'v2' : this.keyForIn('v1') ? "v1" : null
    }
}