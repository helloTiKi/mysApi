
var appconfig = {
    'x-rpc-app_id': 'bll8iq97cem8',
    'x-rpc-aigis': '',
    'x-rpc-app_version': '2.58.2',
    'x-rpc-client_type': 2,
    'x-rpc-game_biz': 'bbs_cn',
    'x-rpc-sdk_version': '2.16.0',
    'x-rpc-sys_version': '7.1.2',
    'User-Agent': 'okhttp/4.9.3'
}

function defaultDevice() {
    return {
        "userAgent": "Mozilla/5.0 (Linux; Android 7.1.2; NX629J Build/N2G48C; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36 miHoYoLogin/2.16.0",
        "browserScreenSize": "333000",
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

var retcode = {
    '0': 'ok',
    '-3235': '您正在新设备上登录，为保障您的账号安全，请先使用手机短信验证身份',
    '-3102': '图片验证码失败'
}

var Api = {

}

var salt={
    '2.58.2':{
        getDS:'KTJQGN2a2Trqk0tcQZS6JV3rU7CnV8Q6'
    }
}

export {
    appconfig, defaultDevice, retcode
}