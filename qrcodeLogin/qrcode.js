
//apikey 4261|KhtM7sPUNgyBG5EKvTqekDSi2VJBXQRpV7kpUhqz
export default class qrcode {
    constructor(user) {
        this.user = user;
    }
    async authLogin(ticket) {

    }

    async getGameToken() {
        let url = `https://api-takumi.miyoushe.com/auth/api/getGameToken?uid=${this.user.uid}`
    }
}


/**
 * POST https://api-sdk.mihoyo.com/hkrpg_cn/combo/panda/qrcode/scan
 * DS: 1699518013,adc63m,95775cf19bc5a97024a257c1088f22dc
 * x-rpc-app_version: 2.58.2
 * x-rpc-channel: nochannel
 * x-rpc-client_type: 2
 * x-rpc-device_fp: 38d7f12d54f50
 * x-rpc-device_id: f758e199-b49a-3a25-8d3c-4dcedaa5b783
 * x-rpc-device_model: SEA-AL10
 * x-rpc-device_name: HUAWEI SEA-AL10
 * x-rpc-sys_version: 7.1.2
 * x-rpc-verify_key: bll8iq97cem8
 * {"app_id":8,"device":"f758e199-b49a-3a25-8d3c-4dcedaa5b783","ticket":"654c961eb94b690d74f2cecf"}
 * 
 * GET https://api-takumi.miyoushe.com/auth/api/getGameToken?uid=299253595
 * DS: 1699518017,cf973g,bc1d012fd0513259f307591984af3526
 * x-rpc-app_version: 2.58.2
 * x-rpc-channel: nochannel
 * x-rpc-client_type: 2
 * x-rpc-device_fp: 38d7f12d54f50
 * x-rpc-device_id: f758e199-b49a-3a25-8d3c-4dcedaa5b783
 * x-rpc-device_model: SEA-AL10
 * x-rpc-device_name: HUAWEI SEA-AL10
 * x-rpc-sys_version: 7.1.2
 * x-rpc-verify_key: bll8iq97cem8
 * 
 * POST https://api-sdk.mihoyo.com/hkrpg_cn/combo/panda/qrcode/confirm
 * 
 * {"app_id":8,
 * "device":"f758e199-b49a-3a25-8d3c-4dcedaa5b783",
 * "payload":{
 *      "proto":"Account",
 *      "raw":"{\"uid\":\"299253595\",
 *      \"token\":\"jNNccWStYRYzF9CNtX9AGsBoosizgF6u\"
 *      }"
 * },
 * "ticket":"654c961eb94b690d74f2cecf"}
 */