const url = {
    login: 'http://authserver.cidp.edu.cn/authserver/login?service=http%3a%2f%2fjw.cidp.edu.cn%2fLoginHandler.ashx',
    jw_index: 'jw.cidp.edu.cn',
    mygrade: 'https://jw.cidp.edu.cn/Teacher/MarkManagement/StudentAverageMarkSearchFZ.aspx',
    get_captcha: 'http://authserver.cidp.edu.cn/authserver/needCaptcha.html'
}
const puppeteer_config = {
    launch: {
        headless: false,
        args: [
            '--no-sandbox', // 沙盒模式
            '--disable-setuid-sandbox', // uid沙盒
            '--disable-dev-shm-usage', // 创建临时文件共享内存
            '--disable-accelerated-2d-canvas', // canvas渲染
            '--disable-gpu', // GPU硬件加速
            '--no-zygote'
        ]
    },
    disableFile: ['image', 'stylesheet']
}
module.exports = {
    url,
    puppeteer_config
}