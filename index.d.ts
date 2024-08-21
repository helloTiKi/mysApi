import genshin from "./game/genshin/genshin.js"
import user from "./user/user.js";
import { StarRail } from "./game/StarRail/StarRail.js";
import { bh3 } from "./game/bh3/bh3.js";

/* const mysApi = {
    genshin,
    user,
    StarRail,
    bh3
} */
export default class mysApi extends user {
    static genshin: genshin;
    static user: user;
    static StarRail: StarRail;
    static bh3: bh3;
    static initByUserName(userName: string): mysApi;
    constructor(cookie: string): void;
    get genshin(): genshin;
    get StarRail(): StarRail;
    get bh3(): bh3;
    async sign(gameType: "bh3" | "genshin" | "sr", gameUid: string): Promise<{ retcode: number, msg: string, is_invalid: boolean, is_sign: boolean }>;
};