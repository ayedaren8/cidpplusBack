const {
    url
} = require("./config");
const scrape = require('./index')
let login = async (ws, user) => {
    let page = await scrape(ws, user)
    try {
        await page.goto(url.info)
        let res = await page.$('pre')
        res = await page.evaluate(Node => Node.innerText, res)
        return res
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
module.exports = login