const {
    url
} = require("../scrape/config");
const {
    resHandler
} = require("../util/util");
const scrape = require('../scrape/index')
const log = require("../util/log");

let grade = async (ws, user) => {
    let page = await scrape(ws, user)
    try {
        await page.goto(url.mygrade)
        let xueqi = await page.$('#hfSemesterFramework')
        let chengji = await page.$('#hfAverageMarkFromClass')
        xueqi = await page.evaluate(Node => JSON.parse(Node.value), xueqi)
        chengji = await page.evaluate(Node => JSON.parse(Node.value), chengji)
        xueqi.forEach((year) => {
            year.List.forEach((sem) => {
                sem.gradeList = []
                chengji.forEach((les) => {
                    console.log(sem.SemesterId);
                    if (sem.SemesterId == les.SemesterID) {
                        sem.gradeList.push(les)
                    }
                })

            })
        })
        return await resHandler(xueqi)
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