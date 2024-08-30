import genshin from "./game/genshin/genshin.js"
import user from "./user/user.js";
import { StarRail } from "./game/StarRail/StarRail.js";
import { bh3 } from "./game/bh3/bh3.js";
import gsData from "./config/gsData.js";


// 关闭https证书验证，用于开发环境
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

/* const mysApi = {
    genshin,
    user,
    StarRail,
    bh3
} */

class MysApi extends user {
    constructor(cookies = "") {
        super(cookies)
    }
    async getUserGameRoles() {
        if (typeof this.UserGameRoles.then == 'function') this.UserGameRoles = await this.UserGameRoles
    }
    async sign(type = "all", gameUid = "") {
        await this.getUserGameRoles()
        let retdata = {}
        switch (type) {
            case "all":
                retdata.genshin = await this.genshin.sign(gameUid)
                retdata.StarRail = await this.StarRail.sign(gameUid)
                retdata.bh3 = await this.bh3.sign(gameUid)
                break;
            case "bh3":
                retdata = await this.bh3.sign(gameUid)
                break;
            case "sr":
            case "StarRail":
                retdata = await this.StarRail.sign(gameUid)
                break;
            case "gs":
            case "genshin":
                retdata = await this.genshin.sign(gameUid)
                break;
            default:
                retdata = { code: 404, msg: "未知的游戏类型" }
                break;
        }
        return retdata
    }
    get genshin() {
        if (!this._genshin) {
            this._genshin = genshin.initByUser(this)
        }
        return this._genshin
    }
    get StarRail() {
        if (!this._StarRail) {
            this._StarRail = StarRail.initByUser(this)
        }
        return this._StarRail
    }
    get bh3() {
        if (!this._bh3) {
            this._bh3 = bh3.initByUser(this)
        } return this._bh3
    }
    static initByUserName(userName) {
        let tuid = gsData.getltuidByUserName(userName)
        if (tuid) {
            let cookie = gsData.getCookieByLtuid(tuid)
            if (cookie) {
                return new MysApi(cookie);
            }
        }
        return new MysApi()
    }
    static genshin = genshin
    static user = user
    static StarRail = StarRail
    static bh3 = bh3
}


export default MysApi
