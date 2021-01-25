const {
    url
} = require("../scrape/config");
const scrape = require('../scrape/index')
const {
    resHandler
} = require("../util/util");
let course = async (ws, ctx) => {
    let user = {
        username: ctx.request.body.username,
        password: ctx.request.body.password
    }
    try {
        var page = await scrape(ws, user)
    } catch (error) {
        throw error
    }
    try {
        const navigationPromise = page.waitForNavigation();
        await page.goto(url.course)
        await navigationPromise;
        let res = await page.$('pre')
        res = await page.evaluate(Node => Node.innerText, res)
        try {
            res = JSON.parse(res)
            ctx.body = await resHandler(res)
        } catch (error) {
            throw error
        }

    } catch (error) {
        // console.log('出现未知错误');
        console.log(error);
        let err = new Error()
        err.message = {
            code: 'server:unknow',
            desc: error
        }
        throw err
    } finally {
        if (page !== undefined) {
            await page.close()
        }
    }
}
module.exports = course