const log = require('../util/log')
module.exports = function catchError(ctx, next) {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            log(JSON.stringify(error.message), 'ERROR')
            ctx.body = {
                code: error.message.code || "system:unknow",
                desc: error.message.desc || "不知道怎么就出错了"
            };
            ctx.app.emit('error', error); // 触发应用层级错误事件
        }
    }
}