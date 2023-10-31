import { defaultDevice } from "../../config/appconfig.js";
import gsData from "../../config/gsData.js";
import axios from "axios";
function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export async function getDevice(username) {
    let UserDevice = gsData.getUserDevice(username);
    if (!UserDevice) {
        UserDevice = {
            device_id: getGuid(),
            device_fp: '38d7f125b9802',
            seed_id: getRandomString(16),
            seed_time: String(new Date().getTime()),
            app_name: 'bbs_cn',
            platform: '5',
            ext_fields: JSON.stringify(defaultDevice())
        }
    }
    if (!await getFp(UserDevice)) return null
    gsData.setUserDevice(username, UserDevice);
    return UserDevice;
}

export async function getFp(UserDevice) {
    let url = 'https://public-data-api.mihoyo.com/device-fp/api/getFp'
    let res = await axios.post(url, JSON.stringify(UserDevice))
    if (res.data.retcode === 0) {
        UserDevice.device_fp = res.data.data.device_fp
        return true
    }
    return false
}