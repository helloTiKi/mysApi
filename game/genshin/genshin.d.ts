import { GameRoles, mysApi } from '../../mysApi/mysapi'

class genshin extends mysApi {
    static initByCookie(cookie: string): genshin;
    static initByUserName(username: string): genshin;
    static init(cookie: string): false | genshin;
    constructor(cookie: string) { super(cookie) }
    getUserGameRoles(): Promise<GameRoles[]>
    sign(): Promise<boolean>;
}

export default genshin