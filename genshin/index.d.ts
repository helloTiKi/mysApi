import mysApi from "../mysApi/mysapi";


export default class genshin extends mysApi {
    constructor(cookie: string);
    sign(): Promise<boolean>;
}