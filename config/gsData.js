import fs from 'fs'
const mkdir = {
    userCookie: './data/userCookie',
    RewardPath: './data/reward',
    user: './data/user',
};
const File = {
    username: mkdir.userCookie + '/username.json',
    ltuid: mkdir.userCookie + '/ltuid.json',
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
/**
 * 获取指定路径的json文件内容，如果不存在则会自动创建空json文件
 * @param {string} file 
 * @returns {object}
 */
function getFile(file) {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '{}', 'utf-8');
    }
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
}
/**
 * 设置指定路径的json文件内容
 * @param {string} file 
 * @param {string} data 
 */
function setFile(file, data) {
    let saveData = ''
    switch (typeof data) {
        case 'string':
            saveData = data
            break;
        case 'object':
            saveData = JSON.stringify(data)
            break;
        default:
            saveData = ''
    }
    fs.writeFileSync(file, saveData, 'utf-8');
}

class gsData {
    getltuidByUserName(username) {
        let data = getFile(File.username)
        return data[username] ? data[username] : null
    }
    getCookieByLtuid(ltuid) {
        let key = `${mkdir.userCookie}/${ltuid}.json`
        let data = getFile(key).Cookie
        return data
    }
    /**
     * 
     * @param {string} ltuid 
     * @param {string} Cookie 
     */
    setUserCookie(ltuid, Cookie) {
        let key = `${mkdir.userCookie}/${ltuid}.json`
        setFile(key, { Cookie })
    }
    setUserName(username, ltuid) {
        let data = getFile(File.username)
        data[username] = ltuid
        setFile(File.username, JSON.stringify(data))
    }
    getReward(game_biz = '') {
        if (game_biz) return ''
        let key = `${mkdir.RewardPath}/${game_biz}.json`
        if (!fs.existsSync(key)) return ''
        return fs.readFileSync(key, 'utf-8')
    }
    setReward(game_biz, data) {
        let key = `${mkdir.RewardPath}/${game_biz}.json`
        setFile(key, data)
    }
    getUserDevice(username = '') {
        if (!username) return null;
        let data = getFile(File.device)
        return data[username] ? data[username] : null
    }
    setUserDevice(username = '', device) {
        if (!username) return;
        let data = getFile(File.device)
        data[username] = device
        setFile(File.device, JSON.stringify(data))
    }
}
export default new gsData()


