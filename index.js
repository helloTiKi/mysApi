import lodash from "lodash"
import genshin from "./game/genshin/genshin.js"
import user from "./user/user.js";
import { StarRail } from "./game/StarRail/StarRail.js";
import { bh3 } from "./game/bh3/bh3.js";


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';


let _genshin = bh3.initByUserName('17040490122')

if (!_genshin) {
    let use = new user();
    let data = await use.loginByPassWord('17040490122', 'whw123..')
} else {
    let userdata = await _genshin.getUserGameRoles()
    console.log(userdata)
    userdata = await _genshin.sign(userdata[0].game_uid)
    console.log(userdata)
}