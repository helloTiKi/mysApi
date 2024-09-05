import user from "../user/user"
import RequestUtils from "../utils/RequestUtils"

declare class GameRoles {
    game_biz: string
    region: string
    game_uid: string
    nickname: string
    level: number
    is_chosen: boolean
    region_name: string
    is_official: boolean
}
declare class UserGameRoles {
    /**原神 */
    'hk4e_cn': GameRoles[]
    /**崩坏：星穹铁道 */
    'hkrpg_cn': GameRoles[]
    "bh3_cn": GameRoles[]
}


interface mysResponse {
    retcode: number
    message: string
    data: object
}

interface mysHeaders {
    'x-rpc-app_version': string
    'x-rpc-client_type': string
    'x-rpc-device_id': string
    'x-rpc-device_model': string
    'x-rpc-device_name': string
    'User-Agent': string
    'x-rpc-platform': string
    DS: string
}

interface mysRequest {
    url: string
    method: 'GET' | 'POST'
    query?: string
    body?: object
    sign?: boolean
    headers?: mysHeaders
}

class mysApi extends user {
    public model: 'genshin' | 'bh3' | 'StarRail' | string
    server: string
    request: RequestUtils
    constructor(cookie: string, config?: { model?: 'genshin' | 'bh3' | 'StarRail' | string, server?: string })
    UserGameRoles: UserGameRoles
    /**
     * 用户名登入
     * @param username 用户名
     * 只传入用户名，将会尝试获取保存的cookie，如果获取结果为空且未传入密码，将会使用手机验证码登入
     */
    login(username: string): Promise<string>
    public isLogin(): Promise<boolean>
    getDsSign(): string
    getDs(): string
}

export default mysApi 