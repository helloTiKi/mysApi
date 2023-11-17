declare class gsData {
    /**
     * 根据用户名来获取保存的ltuid
     * @param userName 用户名
     */
    getltuidByUserName(userName: string): string | null;
    /**
     * 通过米游社id获取username
     * @param ltuid 米游社uid
     */
    getUserNameByLtuid(ltuid: string): string | null;
    /**
     * 通过用户名获取保存的cookie
     * @param username 用户名
     */
    getCookieByUserName(username: string): string | null;
    /**
     * 根据米游社uid来获取保存的cookie
     * @param ltuid 米游社uid
     */
    getCookieByLtuid(ltuid: string): string | null;
    /**
     * 保存用户cookie
     * @param ltuid 米游社id
     * @param cookie cookie
     */
    setUserCookie(ltuid: string, cookie: string): void;
    /**
     * 保存用户名绑定的米游社uid
     * @param userName 用户名
     * @param ltuid 米游社id
     */
    setUserName(userName: string, ltuid: string): void;

    getReward(game_biz: 'genshin' | 'StarRail'): string
    setReward(game_biz: 'genshin' | 'StarRail', reward: string): void

    getUserDevice(userName: string, type: 2 | 4 | 5): UserDevice | null
    setUserDevice(userName: string, device: UserDevice, type: 2 | 4 | 5): void

}

type UserDevice = {
    device_id: string
    seed_id: string
    seed_time: string
    platform: string
    device_fp: string
    app_name: string
    ext_fields: string
    bbs_device_id: string
    lastUpdateTime: string
}

export default new gsData();
export type { UserDevice };