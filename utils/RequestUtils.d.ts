import { AxiosResponse } from "axios";
import Cookie from "../user/CookiesUtils";

type mysHeaders = {
    'x-rpc-client_type': number
    'x-rpc-app_version': string
    'x-rpc-device_fp': string
    'x-rpc-device_id': string
    'x-rpc-device_model': string
    'x-rpc-device_name': string
    'x-rpc-platform': string
    'x-rpc-channel': string
    'x-rpc-sys_version': string
    'DS': string

}

type mysResponse = {
    retcode: number;
    message: string;
    data: object;
    headers: object;
}

export default class RequestUtils {
    cookie: Cookie
    constructor(cookie: Cookie)
    post(url: string, body: string, query: string, headers: mysHeaders): Promise<mysResponse>
    get(url: string, query: string): Promise<mysResponse>
    setHeaders(headers: mysHeaders): void
    getHeaders(): object
    setHeader(key: string, value: string): void
    checkResponse(response: AxiosResponse): string
}
export { mysHeaders, mysResponse }