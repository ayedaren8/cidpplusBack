const puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs');
const log = require('./log')
const {
    url,
    puppeteer_config
} = require('./config')

async function pageFactory(browser) {
    let page = (await (await browser).newPage())
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
        // 如果文件类型为image,则中断加载
        if (puppeteer_config.disableFile.includes(request.resourceType())) {
            request.abort();
            return;
        }
        // 正常加载其他类型的文件
        request.continue();
    });
    return page
}

function isNeedCaptcha(user) {
    log(`正在校验${user.username}是否需要验证码`, user.username);
    //校验验证码
    const options = {
        hostname: url.get_captcha,
        port: 80,
        path: `?username=${user.username}&pwdEncrypt2=pwdEncryptSalt&_=${new Date().getTime()}`,
        method: 'GET'
    }
    return new Promise((resolve, reject) => {
        http.get(options.hostname + options.path, (req, res) => {
            req.on('data', (d) => {
                resolve(d.toString())
            })
        })
    })
}

async function makeCookies(page, user) {
    if (await isNeedCaptcha(user).then(d => d) === 'true') {
        log('需要验证码，程序结束', user.username);
        await page.close()
        let err = new Error()
        err.message = {
            code: 'user:needCaptcha',
            desc: "需要验证码"
        }
        throw err
    } else {
        log('不需要验证码', user.username);
    }
    await page.goto(url.login);
    await page.type('#username', user.username)
    await page.type('#password', user.password)
    await page.click('button')
    try {
        await page.waitForNavigation()
    } catch (error) {
        let err2 = new Error()
        err2.message = {
            code: 'server:NavigationTimeOut',
            desc: "服务器跳转超时"
        }
        throw err2
    }
    let cookies = await page.cookies()
    log('cookies-Domain：' + cookies[0]['domain'], user.username);
    if (cookies[0]['domain'] === url.jw_index) {
        fs.writeFileSync(`${__dirname}/cookies/${user.username}.json`, JSON.stringify(cookies))
        log('登录成功', user.username);
    } else {
        log('用户名或密码错误', user.username);
        console.log('用户名或密码错误', user.username);
        page.close()
        let err = new Error()
        err.message = {
            code: 'user:badPassword',
            desc: "用户名或密码错误"
        }
        throw err
    }
    return page
}

async function isCookiesUseful(page, user) {
    await page.goto(url.mygrade)
    if (await page.title() === '无权限，请重试') {
        log('cookies过期', user.username);
        page = await makeCookies(page, user)
        return await page
    } else {
        return await page
    }
}

let scrape = async (ws, user) => {
    let browser = puppeteer.connect({
        browserWSEndpoint: ws
    })
    let cookies = null
    if (!fs.existsSync(`${__dirname}/cookies`)) {
        fs.mkdirSync(`${__dirname}/cookies`)
    }
    let page = await pageFactory(browser)

    if (!fs.existsSync(`${__dirname}/cookies/${user.username}.json`)) {
        log('没有cookies', user.username);
        page = await makeCookies(page, user)
    } else {
        log('使用cookies', user.username);
        cookies = JSON.parse(fs.readFileSync(`${__dirname}/cookies/${user.username}.json`))
        await page.setCookie(cookies[0])
    }
    if (!page) {
        return
    }
    page = await isCookiesUseful(page, user)
    return await page
}


module.exports = scrape