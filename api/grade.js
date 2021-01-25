const {
    url
} = require("../scrape/config");
const {
    resHandler
} = require("../util/util");
const scrape = require('../scrape/index')
const log = require("../util/log");

let grade = async (ws, ctx) => {
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
        await page.goto(url.mygrade)
        await navigationPromise;
        let xueqi = await page.$('#hfSemesterFramework')
        let chengji = await page.$('#hfAverageMarkFromClass')
        xueqi = await page.evaluate(Node => JSON.parse(Node.value), xueqi)
        chengji = await page.evaluate(Node => JSON.parse(Node.value), chengji)
        xueqi.forEach((year) => {
            year.List.forEach((sem) => {
                sem.gradeList = []
                chengji.forEach((les) => {
                    if (sem.SemesterId == les.SemesterID) {
                        sem.gradeList.push(les)
                    }
                })

            })
        })
        ctx.body = await resHandler(xueqi)
    } catch (error) {
        log(error, user.username)
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
module.exports = grade