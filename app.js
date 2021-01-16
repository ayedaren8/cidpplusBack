const Koa = require('koa')
const app = new Koa()
const bodyParser = require("koa-bodyParser");
const router = require("koa-router")();
const newBrowser = require('./scrape/browser.js')
const scarpe = require('./scrape/index')

let browser = newBrowser()
browser.then((b) => {
    console.log(b.target());
})
app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
})
app.use(bodyParser())
router.get('/api', async (ctx) => {
    let user = {
        username: '175043115',
        password: 'Ygq520123456!'
    }
    ctx.body = await scarpe(browser, user)
})

router.post('/api', async (ctx) => {
    console.log(ctx.request.body);
    ctx.body = ctx.request.body
})

app.use(router.routes(), router.allowedMethods())
app.listen(3000, () => {
    console.log('[demo] request get is starting at http://127.0.0.1:3000')
})
app.on('error', (error) => {
    console.log(error);
})