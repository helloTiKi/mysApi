import Cookie from "../user/CookiesUtils.js";



declare class util {
    getRandomString(length: number): string
    getRandomNumber(length: number): string
    getRandomNumber(length: number, min: number, max: number): string
    getTimeNow(length: 10 | 13): string
    getUrlCookie(url: string, cookie: Cookie): string
    getUrlPath(url: string, noHost = true): string
    getSaltFunction(salt: string): (() => string) | ((body: string, query: string) => string)
    getSaltType(salt: string): number
    getUrlHost(url: string): string
    getUrlQuery(url: string): string
    getUrlSign(url: string, data: string): string
    getDs(salt: string): string
    getDssign(salt: string, body: string, query: string): string
    getGuid(): string
    jsonToQuery(json: object): string
    Base64Encode(data: any): string
    Base64Decode(data: string): string
}
export default new util()