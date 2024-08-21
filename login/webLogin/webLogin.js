
let puppeteer = undefined

async function initPupp() {
    if (typeof puppeteer === undefined) return puppeteer
    // 加载 puppeteer 模块
    console.log('正在启动puppeteer')
    puppeteer = (await import('puppeteer')).default

    return puppeteer
}

export default class webLogin {
    constructor(username = '', password = '') {
        this.username = username;
        this.password = password;
        if (username == '') return
        this.loginType = this.password == '' ? 'capt' : 'pwd';
    }
    async login() {
        return new Promise(async (resolve, reject) => {
            await initPupp()
            const browser = await puppeteer.launch({ headless: false, defaultViewport: null, ignoreHTTPSErrors: true });
            const context = await browser.createIncognitoBrowserContext();
            const page = await context.newPage();
            page.on('frameattached', async frame => {
                await frame.waitForSelector('.captcha-login-page')
                if (this.loginType == 'capt') {

                } else {
                    await frame.evaluate(() => {
                        document.querySelector('#tab-password').click()
                    })
                    await frame.waitForSelector('.password-login-page')
                    await frame.type('#username', this.username, { delay: 20 })
                    await frame.type('#password', this.password, { delay: 20 })
                    await frame.evaluate(() => { document.querySelector('.el-checkbox__original').click() })
                    await frame.evaluate(() => { document.querySelector('.el-button').click() })
                }
            })
            page.on('framedetached', async frame => {
                try {
                    let data = function (cookies) {
                        let retcookies = {
                            v1: {},
                            v2: {}
                        };
                        cookies.forEach(cookie => {
                            if (cookie.name.includes('_v2')) {
                                retcookies.v2[cookie.name] = cookie.value;
                            } else {
                                retcookies.v1[cookie.name] = cookie.value;
                            }
                        })
                        return retcookies
                    }(await page.cookies())
                    resolve(data)
                    await page.close()
                    await context.close()
                    await browser.close()
                } catch (error) {
                    //console.log('error')
                }
            })
            await page.goto('https://www.miyoushe.com/ys/')
            await page.waitForSelector('.header__avatarwrp')
            await page.evaluate(() => {
                document.querySelector('.header__avatarwrp').click()
            })
        })
    }
};

