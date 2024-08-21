
declare class v1Cookie {
    ltuid: string;
    cookie_token: string;
    ltoken: string;
    account_id: string;
    devicefp: string;
    devicefp_seed_time: string;
    devicefp_seed_id: string
}
declare class v2Cookie {
    ltuid_v2: string
    ltoken_v2: string
    cookie_token_v2: string
    account_id_v2: string
    account_mid_v2: string
    ltmid_v2: string
}
declare class webCookie {
    v1: v1Cookie;
    v2: v2Cookie;
}

export default class webLogin {
    constructor(username: string, password: string);
    login(): Promise<webCookie>
} 