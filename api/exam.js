const {
    url
} = require("../scrape/config");
const scrape = require('../scrape/index')
const {
    resHandler
} = require("../util/util");
let exam = async (ws, user) => {
    let page = await scrape(ws, user)
    try {
        await page.goto(url.exam)
        let res = await page.$('pre')
        res = await page.evaluate(Node => Node.innerText, res)
        return await resHandler(JSON.parse(res))
    } catch (error) {
        console.log('出现未知错误');
        console.log(error);
        let err = new Error()
        err.message = {
            code: 'server:unknow',
            desc: error
        }
        throw err
    } finally {
        await page.close()
    }

}
module.exports = exam