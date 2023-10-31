import fs from 'fs'
const mkdir = {
    folderPath: './data/userCookie',
    RewardPath: './data/reward',
    user: './data/user',
};
const File = {
    username: mkdir.folderPath + '/username.json',
    ltuid: mkdir.folderPath + '/ltuid.json',
    device: mkdir.user + '/device.json',
};
/**处理必要目录 */
(function () {
    Object.keys(mkdir).forEach(k => {
        if (!fs.existsSync(mkdir[k])) {
            fs.mkdirSync(mkdir[k], { recursive: true });
        }
    })
    Object.keys(File).forEach(k => {
        if (!fs.existsSync(File[k])) {
            fs.writeFileSync(File[k], '{}', 'utf-8');
        }
    })
})()

class gsData {
    getltuidByUserName(username) {
        let data = JSON.parse(fs.readFileSync(File.username, 'utf-8'))
        return data[username] ? data[username] : null
    }
    getCookieByLtuid(ltuid) {
        let data = JSON.parse(fs.readFileSync(File.ltuid, 'utf-8'))
        return data[ltuid]
    }
    /**
     * 
     * @param {string} ltuid 
     * @param {string} Cookie 
     */
    setUserCookie(ltuid, Cookie) {
        let data = JSON.parse(fs.readFileSync(File.ltuid, 'utf-8'))
        data[ltuid] = Cookie
        fs.writeFileSync(File.ltuid, JSON.stringify(data), 'utf-8')
    }
    setUserName(username, ltuid) {
        let data = JSON.parse(fs.readFileSync(File.username, 'utf-8'))
        data[username] = ltuid
        fs.writeFileSync(File.username, JSON.stringify(data), 'utf-8')
    }
    getReward(game_biz = '') {
        if (game_biz) return ''
        let key = `${mkdir.RewardPath}/${game_biz}.json`
        if (!fs.existsSync(key)) return ''
        return fs.readFileSync(key, 'utf-8')
    }
    setReward(game_biz, data) {
        let key = `${mkdir.RewardPath}/${game_biz}.json`
        fs.writeFileSync(key, data, 'utf-8')
    }

    getUserDevice(username = '') {
        if (!username) return null;
        let data = JSON.parse(fs.readFileSync(File.device, 'utf-8'))
        return data[username] ? data[username] : null
    }
    setUserDevice(username = '', device) {
        if (!username) return;
        let data = JSON.parse(fs.readFileSync(File.device, 'utf-8'))
        data[username] = device
        fs.writeFileSync(File.device, JSON.stringify(data), 'utf-8')
    }
}
export default new gsData()


