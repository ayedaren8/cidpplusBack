const puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs');
const {
    url,
    puppeteer_config
} = require('./config')


function isNeedCaptcha(user) {
    console.log(`正在校验${user.username}是否需要验证码`);
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
        console.log('需要验证码，程序结束');
        page.browser().close()
        return
    } else {
        console.log('不需要验证码');
    }
    await page.goto(url.login);
    await page.type('#username', user.username)
    await page.type('#password', user.password)
    await page.click('button')
    await page.waitForNavigation()
    let cookies = await page.cookies()
    console.log(cookies[0]['domain']);
    if (cookies[0]['domain'] === url.jw_index) {
        fs.writeFileSync(`${__dirname}/cookies/${user.username}.json`, JSON.stringify(cookies))
    } else {
        throw Error('用户名或密码错误')
    }
    return page
}

let scrape = async (browser, user) => {
    // let user = {
    //     username: '175043115',
    //     password: 'Ygq520123456!'
    // }
    let cookies = null
    if (!fs.existsSync(`${__dirname}/cookies`)) {
        fs.mkdirSync(`${__dirname}/cookies`)
    }
    let page = await pageFactory()

    if (!fs.existsSync(`${__dirname}/cookies/${user.username}.json`)) {
        console.log('没有cookℹes文件');
        page = await makeCookies(page, user)
    } else {
        console.log('使用cookies');
        cookies = JSON.parse(fs.readFileSync(`${__dirname}/cookies/${user.username}.json`))
        await page.setCookie(cookies[0])
    }
    if (!page) {
        return
    }
    await page.goto(url.mygrade)
    if (await page.title() === '无权限，请重试') {
        console.log('cookies过期');
        page = await makeCookies(page, user)
        await page.goto(url.mygrade)
    }
    let res = await page.$('#hfAverageMarkFromClass')
    res = await page.evaluate(Node => Node.value, res)
    await page.browser().close();
    return res
}

module.exports = scrape