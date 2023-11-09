
type loginCookie_v3 = {
    stoken: string
    login_ticket: string
    mid: string
    stuid: string
}


export default class login {
    constructor() { }
    static loginByPassword(userName: string, password: string): Promise<loginCookie_v3>

}