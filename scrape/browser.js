const puppeteer = require('puppeteer')
const {
    puppeteer_config
} = require('./config')
const fs = require('fs')

let newBrowser = async () => {
    let browser = await puppeteer.launch(puppeteer_config.launch)
    let ws = browser.wsEndpoint();

    browser.disconnect()
    return ws
}

module.exports = newBrowser