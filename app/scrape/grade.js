const {
    url
} = require("./config");
const scrape = require('./index')
let grade = async (ws, user) => {
    let page = await scrape(ws, user)
    try {
        await page.goto(url.mygrade)
        let res = await page.$('#hfAverageMarkFromClass')
        res = await page.evaluate(Node => Node.value, res)
        return res
    } catch (error) {
        log(error, user.username)
        let err = new Error()
        err.message = {
            code: 'server:unknow',
            desc: error.message
        }
        throw err
    } finally {
        await page.close()
    }
}
module.exports = grade