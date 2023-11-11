import mysApi from "../mysApi/mysapi";


export default class genshin extends mysApi {
    static init(cookie: string): false | genshin;
    constructor(cookie: string);
    sign(): Promise<boolean>;
}