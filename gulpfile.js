const {
    src,
    dest,
    watch,
    series
} = require('gulp');
const del = require("del");

async function clear() {
    console.log('clear');
    await del(['./app'])

}

function mv() {
    const ignorelist = ['!./**/node_modules/**', '!./**/log/**', '!./**/cookies/**', '!gulpfile.js', '!*.lock']
    console.log('mv');
    return src(['./**', ...ignorelist])
        .pipe(dest('./app'));
}

const copyToApp = series(clear, mv)

function defaultTask(cb) {
    watch(['app.js'], {
            event: 'change'
        },
        copyToApp)
    cb();
}
exports.clear = clear
exports.default = defaultTask