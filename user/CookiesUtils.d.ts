export default class Cookie {
    get CookieString(): string
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