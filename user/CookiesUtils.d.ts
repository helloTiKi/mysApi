export default class Cookie {
    static init(cookie: string | object | Array): Cookie | false
    constructor(cookie: string | object | Array)
    get CookieString(): string
    get v1Cookie(): string
    get v2Cookie(): string
    get v3Cookie(): string
    setCookie(key = '', value = ''): void
    setCookieByObject(obj = {}): void
    setCookieByString(str = ''): void
    setCookieByHeader(header = {}): void
    setCookieByArray(arr = []): void
    removeCookie(key = ''): void
    removeAllCookie(): void
    getCookie(key = ''): string
    getAllCookie(): object
}