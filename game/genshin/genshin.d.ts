import mysApi from "../mysApi/mysapi";
import {GameRoles} from '../mysApi/mysapi'

export default class genshin extends mysApi {
    static initByCookie(cookie: string): false | genshin;
    static initByUserName(username: string): false | genshin;
    static init(cookie: string): false | genshin;
    constructor(cookie: string);
    getUserGameRoles(): Promise<GameRoles[]>
    sign(): Promise<boolean>;
}