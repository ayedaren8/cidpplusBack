const semId = 64 //学期编号
const url = {
  login: 'http://authserver.cidp.edu.cn/authserver/login?service=http%3a%2f%2fjw.cidp.edu.cn%2fLoginHandler.ashx',
  jw_index: 'jw.cidp.edu.cn',
  mygrade: 'https://jw.cidp.edu.cn/Teacher/MarkManagement/StudentAverageMarkSearchFZ.aspx',
  get_captcha: 'http://authserver.cidp.edu.cn/authserver/needCaptcha.html',
  info: 'https://jw.cidp.edu.cn/RegisterInfo/RegisterManageHandler.ashx?action=getInfo',
  course: `https://jw.cidp.edu.cn/Teacher/TimeTableHandler.ashx?action=getTeacherTimeTable&&isShowStudent=1&&semId=${semId}&&testTeacherTimeTablePublishStatus=1`,
  exam: `https://jw.cidp.edu.cn/Student/StudentExamArrangeTableHandler.ashx?semId=${semId}`
}
const puppeteer_config = {
  launch: {
    headless: true,
    args: [
      '--no-sandbox', // 沙盒模式
      '--disable-setuid-sandbox', // uid沙盒
      '--disable-dev-shm-usage', // 创建临时文件共享内存
      '--disable-accelerated-2d-canvas', // canvas渲染
      '--disable-gpu', // GPU硬件加速
      '--no-zygote'
    ],
    ignoreHTTPSErrors: true,
    executablePath: process.env.NODE_ENV === 'production' ? '/usr/bin/chromium-browser' : undefined
  },
  disableFile: ['image', 'stylesheet']
}
module.exports = {
  url,
  puppeteer_config
}