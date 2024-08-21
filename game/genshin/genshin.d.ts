import { GameRoles, mysApi } from '../../mysApi/mysapi'
import user from '../../user/user'


class genshin extends mysApi {
    static initByCookie(cookie: string): genshin;
    static initByUserName(username: string): genshin;
    static initByUser(user: user): genshin;
    static init(cookie: string): false | genshin;
    constructor(cookie: string) { super(cookie) }
    getUserGameRoles(): Promise<GameRoles[]>
    sign(): Promise<{ retcode: number, msg: string, is_invalid: boolean, is_sign: boolean }>;
}

export default genshin