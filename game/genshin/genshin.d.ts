import mysApi from "../mysApi/mysapi";
import { GameRoles } from '../mysApi/mysapi'

export default class genshin extends mysApi {
    static initByCookie(cookie: string): genshin | undefined;
    static initByUserName(username: string): genshin | undefined;
    static init(cookie: string): false | genshin;
    constructor(cookie: string) { super(cookie) };
    getUserGameRoles(): Promise<GameRoles[]>
    sign(): Promise<boolean>;
}