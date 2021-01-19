const log = require('../util/log')
module.exports = function catchError(ctx, next) {
    return async (ctx, next) => {
        try {
            await next();
        } catch (error) {
            log(JSON.stringify(error.message), 'ERROR')
            ctx.body = {
                code: error.message.code,
                desc: error.message.desc
            };
            ctx.app.emit('error', error); // 触发应用层级错误事件
        }
    }
}