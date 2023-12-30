import genshin from "./game/genshin/genshin.js"
import user from "./user/user.js";
import { StarRail } from "./game/StarRail/StarRail.js";
import { bh3 } from "./game/bh3/bh3.js";

// 关闭https证书验证，用于开发环境
//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';

export { genshin, StarRail, bh3, user }