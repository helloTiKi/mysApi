import utils from "../utils/utils.js"



function defaultDevice(type = 2) {
    switch (type) {
        case 1:
        case 2:
            return {
                "hostname": "ubuntu",
                "buildTime": "1653312251000",
                "oaid": "error_1002005",
                "romCapacity": "256",
                "serialNumber": "004c4019",
                "sdkVersion": "25",
                "vaid": "error_1002005",
                "ramCapacity": "15998",
                "osVersion": "7.1.2",
                "buildType": "user",
                "manufacturer": "HUAWEI",
                "screenSize": "900x1600",
                "aaid": "error_1002005",
                "accelerometer": "0.14x9.66x2.5462418",
                "deviceType": "aosp",
                "cpuType": "armeabi-v7a",
                "board": "SEA-AL10",
                "magnetometer": "-36.49x0.044999998x0.034999996",
                "romRemain": "224",
                "appMemory": "256",
                "display": "N2G48C",
                "buildUser": "build",
                "brand": "HUAWEI",
                "productName": "SEA-AL10",
                "ramRemain": "15540",
                "buildTags": "release-keys",
                "deviceInfo": "google/android_x86/x86:7.1.2/N2G48C/N975FXXU1ASGO:user/release-keys",
                "gyroscope": "0.0x0.0x4.0E-4",
                "hardware": "android_x86",
                "devId": "REL",
                "vendor": "中国移动",
                "model": "SEA-AL10"
            }
        case 5:
            return {
                "userAgent": "Mozilla/5.0 (Linux; Android 7.1.2; NX629J Build/N2G48C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36 miHoYoLogin/2.16.0",
                "browserScreenSize": "284850",
                "maxTouchPoints": "5",
                "isTouchSupported": "1",
                "browserLanguage": "zh-CN",
                "browserPlat": "Linux i686",
                "browserTimeZone": "Asia/Shanghai",
                "webGlRender": "Adreno (TM) 640",
                "webGlVendor": "Qualcomm",
                "numOfPlugins": "0",
                "listOfPlugins": "unknown",
                "screenRatio": "2",
                "deviceMemory": "4",
                "hardwareConcurrency": "4",
                "cpuClass": "unknown",
                "ifNotTrack": "unknown",
                "ifAdBlock": "0",
                "hasLiedLanguage": "0",
                "hasLiedResolution": "1",
                "hasLiedOs": "0",
                "hasLiedBrowser": "0",
                "canvas": "e69d3b0a60291840b05df25ecf4c785d26154685744bef60ffb670432f52c3db",
                "webDriver": "0",
                "colorDepth": "24",
                "pixelRatio": "2",
                "packageName": "unknown",
                "packageVersion": "2.19.0",
                "webgl": "6d1465cae3498454f01675cf4c2ad5aec0881cb776cb034eb9d2212989f3259e"
            }
    }
}

var retcode = {
    '0': 'ok',
    '-3235': '您正在新设备上登录，为保障您的账号安全，请先使用手机短信验证身份',
    '-3102': '图片验证码失败'
}

var urlMap = {
    v1Cookie: [
        '//api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie',
        '//passport-api-v4.mihoyo.com/account/ma-cn-session/web/verifyLtoken',
        "//api-takumi.mihoyo.com/event/bbs_sign_reward/info",
        '//api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
        '//api-takumi.mihoyo.com/event/bbs_sign_reward/home'
    ],
    v3Cookie: [
        '//passport-api.mihoyo.com/account/auth/api/getLTokenBySToken',
        '//passport-api.mihoyo.com/account/auth/api/getCookieAccountInfoBySToken'
    ]
}

var saltType = {
    '1': [
        'KTJQGN2a2Trqk0tcQZS6JV3rU7CnV8Q6',
        'kzTvKGDHumYf6h1Ia5txMjxAJuTtD0ol'
    ],
    '2': [
        'JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS'
    ]
}

var hostSalt = {
    'passport-api.mihoyo.com': 'JwYDpKvLj6MrMqqYU6jTKF17KNO2PXoS',
    'api-takumi.mihoyo.com': function (url = '') {
        if (url == '') return ''
        let path = utils.getUrlPath(url)
        let map = ['/event/bbs_sign_reward/sign'];
        return map.includes(path) ? 'KTJQGN2a2Trqk0tcQZS6JV3rU7CnV8Q6' : 'kzTvKGDHumYf6h1Ia5txMjxAJuTtD0ol'
    }
}


export {
    defaultDevice, retcode, hostSalt, saltType, urlMap
}