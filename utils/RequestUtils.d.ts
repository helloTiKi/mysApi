import { AxiosResponse } from "axios";
import Cookie from "../user/CookiesUtils";


type mysResponse = {
    retcode: number;
    message: string;
    data: object;
    headers: object;
}

export default class RequestUtils {
    cookie: Cookie
    constructor(cookie: Cookie)
    post(url: string, body: string, query: string): Promise<mysResponse>
    get(url: string, query: string): Promise<mysResponse>
    setHeaders(headers: object): void
    getHeaders(): object
    setHeader(key: string, value: string): void
    checkResponse(response: AxiosResponse): string
}