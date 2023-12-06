import { defaultDevice } from "../../config/appconfig.js";
import gsData from "../../config/gsData.js";
import axios from "axios";
import utils from "../../utils/utils.js";

export function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export async function getDevice_5(username) {
    let UserDevice = gsData.getUserDevice(username, 5);
    if (!UserDevice) {
        UserDevice = {
            device_id: getGuid(),
            device_fp: utils.getRandomString(10),
            seed_id: utils.getRandomString(16),
            seed_time: String(new Date().getTime()),
            app_name: 'bbs_cn',
            platform: '5',
            ext_fields: JSON.stringify(defaultDevice(5))
        }
    }
    delete UserDevice.lastUpdateTime;
    if (!await getFp(UserDevice)) return null
    UserDevice.lastUpdateTime = String(new Date().getTime());
    gsData.setUserDevice(username, UserDevice, '5');
    return UserDevice;
}
export async function getDevice_2(username) {
    let UserDevice = gsData.getUserDevice(username, 2);
    if (!UserDevice) {
        UserDevice = {
            device_id: utils.getRandomString(16),
            device_fp: utils.getRandomNumber(10),
            seed_id: getGuid(),
            seed_time: String(new Date().getTime()),
            app_name: 'bbs_cn',
            platform: '2',
            ext_fields: JSON.stringify(defaultDevice(2)),
            bbs_device_id: getGuid()
        }
    }
    delete UserDevice.lastUpdateTime;
    if (!await getFp(UserDevice)) return null
    UserDevice.lastUpdateTime = String(new Date().getTime());
    gsData.setUserDevice(username, UserDevice, '2');
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
