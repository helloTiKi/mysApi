type mysToken = {
    stoken: string
    login_ticket: string
    mid: string
    stuid: string
}
/**
 * 此函数被调用时，请返回收到的验证码
 */
type captchaCallback = function(): Promise<string>



export default class user {
    get username(): string
    get ltuid(): string
    get stuid(): string
    get ltoken(): string
    get stoken(): string
    get v1Cookie(): string
    get v2Cookie(): string
    get v3Cookie(): string
    get allCookie(): string
    static initByCookie(cookie: string): user
    static initByUserName(username: string): user
    constructor(cookie: string | user)
    async verifyLtoken(): Promise<boolean>
    async verifyCookieToken(): Promise<boolean>
    async getLTokenBySToken(): Promise<boolean>
    async getCookieTokenByStoken(): Promise<boolean>
    async loginByPassWord(username: string, password: string): Promise<mysToken | false>
    async loginByMobileCaptcha(username: string, captcha: captchaCallback): Promise<mysToken | false>
    async isLogin(): Promise<boolean>
}