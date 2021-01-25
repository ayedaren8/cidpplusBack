const Koa = require('koa')
const app = new Koa()
const bodyParser = require("koa-bodyparser");
const router = require("koa-router")();
const newBrowser = require('./scrape/browser.js');
const log = require('./util/log')
const login = require('./api/login')
const grade = require('./api/grade');
const course = require('./api/course');
const exam = require('./api/exam');
const catchError = require('./middlewares/catchError')
// const cpus = require('os').cpus()
let MAX_SIZE = 1
let browserList = []
for (let index = 0; index < MAX_SIZE; index++) {
    (async () => {
        browserList.push(await newBrowser())
        if (browserList.length === MAX_SIZE) {
            log(`启动了${MAX_SIZE}个browser实例`, 'system');
            browserList.forEach(
                (e) => {
                    log(`启动${e}`, 'system');
                }
            )
        }
    })()
}
app.use(catchError())
app.use(bodyParser())

router.post('/api/info', async (ctx, next) => {
    await next()
    await login(browserList[Math.floor(Math.random() * MAX_SIZE)], ctx)
    if (ctx.request.body.username != ctx.body.data.srNum) {
        console.log(`出现混乱`);
        console.log(ctx.body);
    }
})

router.post('/api/course', async (ctx, next) => {

    await login(browserList[Math.floor(Math.random() * MAX_SIZE)], ctx)
    if (ctx.request.body.username != ctx.body.data.srNum) {
        console.log(`出现混乱`);
        console.log(ctx.body);
    }
    console.log(ctx.request.body.username + '$$$$' + ctx.body.data.srNum)
})

router.post('/api/exam', async (ctx, next) => {

    await login(browserList[Math.floor(Math.random() * MAX_SIZE)], ctx)
    if (ctx.request.body.username != ctx.body.data.srNum) {
        console.log(`出现混乱`);
        console.log(ctx.body);
    }
    console.log(ctx.request.body.username + '$$$$' + ctx.body.data.srNum)
})

router.post('/api/grade', async (ctx, next) => {
    await grade(browserList[Math.floor(Math.random() * MAX_SIZE)], ctx)
    if (ctx.request.body.username != ctx.body.data.srNum) {
        console.log(`出现混乱`);
        console.log(ctx.body);
    }
    console.log(ctx.request.body.username + '$$$$' + ctx.body.data.srNum)
})
app.use(async (ctx, next) => {
    await next()
    console.log(`${ctx.URL} 返回——>>>${JSON.stringify(ctx.response.body)}`); // 打印耗费时间
})
app.use(router.routes(), router.allowedMethods())
app.listen(3000, () => {
    console.log('[demo] request get is starting at http://127.0.0.1:3000')
})