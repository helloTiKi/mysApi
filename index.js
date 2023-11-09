import lodash from "lodash";
import login from "./login/login.js";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
global.getRandomString = function (long = 0, istoLowerCase = true) {
    if (long <= 0) return ''
    let str = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let result = lodash.sampleSize(str, long).join('');
    return istoLowerCase ? result.toLowerCase() : result;
}
global.getTimeNow = function (length = 13) {
    let time = new Date().getTime() + ''
    return time.slice(0, length)
}

let response = await login.loginByPassword('17305928209', 'a13859926972')

if (typeof response === 'function') {
    debugger
    let captcha = ''
    let data = await response(captcha)
    console.log(data)
}
console.log(response)
debugger