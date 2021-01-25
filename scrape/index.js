const puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs');
const log = require('../util/log')
const {
    url,
    puppeteer_config
} = require('./config');

async function pageFactory(browser) {
    // browser = await browser.createIncognitoBrowserContext()
    let page = await (await browser).newPage()
    await page.setRequestInterception(true);
    page.on('request', async (request) => {
        // 如果文件类型为image,则中断加载
        if (puppeteer_config.disableFile.includes(request.resourceType())) {
            request.abort();
            return;
        }
        // 正常加载其他类型的文件
        request.continue();
    })
    return await page
}

function isNeedCaptcha(username) {
    log(`正在校验${username}是否需要验证码`, username);
    //校验验证码
    const options = {
        hostname: url.get_captcha,
        port: 80,
        path: `?username=${username}&pwdEncrypt2=pwdEncryptSalt&_=${new Date().getTime()}`,
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

async function makeCookies(browser, user) {
    if (await isNeedCaptcha(user.username).then(d => d) === 'true') {
        log('需要验证码，程序结束', user.username);
        let err = new Error()
        err.message = {
            code: 'user:needCaptcha',
            desc: "出现了验证码，机器暂时无法处理，请登陆http://ehall.cidp.edu.cn处理后重新登陆"
        }
        throw err
    } else {
        log('不需要验证码', user.username);
    }
    let page = await pageFactory(browser)
    await page.goto(url.login);
    log(`${JSON.stringify(user)}正在登陆`, 'test');
    try {
        await page.$eval('#username', (input, user) => {
            input.value = `${user.username}`;
        }, user);
        await page.$eval('#password', (input, user) => {
            input.value = `${user.password}`
        }, user);
        const navigationPromise = page.waitForNavigation();
        await page.$eval('button', a => a.click())
        await navigationPromise;
    } catch (error) {
        await page.close()
        let err = new Error()
        err.message = {
            code: 'server:navigationTimeout',
            desc: "导航超时"
        }
        throw err
    }
    if (await page.title() === "教务管理系统") {
        log('登录成功', user.username);
        return await page
    } else {
        console.log();
        if (await page.title() == "Unified Identity Authentication") {
            log('用户名或密码错误', user.username);
            console.log('用户名或密码错误', user.username);
            await page.close()
            let err = new Error()
            err.message = {
                code: 'user:badPassword',
                desc: "用户名或密码错误"
            }
            throw err
        } else {
            console.log(await page.title());
            await page.close()
            let err = new Error()
            err.message = {
                code: 'sever:tooManyRequests',
                desc: "当前服务器正忙,请稍后重试！"
            }
            throw err
        }

    }
}

async function scrape(ws, user) {
    if (ws == undefined) {
        let err = new Error()
        err.message = {
            code: "server:missChromium",
            desc: "浏览器实例缺失,如尝试多次无效后，请联系开发谢谢"
        }
        throw err
    }
    if (user.username === undefined || user.password === undefined) {
        let err = new Error()
        err.message = {
            code: "user:missNessaryData",
            desc: "缺少必要参数，需要重新登录"
        }
        throw err
    }
    let browser = await puppeteer.connect({
        browserWSEndpoint: ws
    })
    browser = await browser.createIncognitoBrowserContext()
    let page = await makeCookies(browser, user)
    return await page
}

module.exports = scrape