const puppeteer = require('puppeteer')
const {
    puppeteer_config
} = require('./config')

async function newBrowser() {
    let browser = new Promise((resolve, reject) => {
        resolve(puppeteer.launch(puppeteer_config.launch))
    })
    return await browser
}

module.exports = newBrowser