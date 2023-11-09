import gsData from "../config/gsData";
import login from "../login/login";



export default class user {
    constructor(name, password) {
        this.name = name;
        this.password = password;
        let ltuid = gsData.getltuidByUserName(name)
        if (ltuid) {
            let cookie = gsData.getCookieByLtuid(ltuid);
            this.isLogin = true;
        } else {
            this.isLogin = false;
        }

    }
    async checkLogin() {

    }
}