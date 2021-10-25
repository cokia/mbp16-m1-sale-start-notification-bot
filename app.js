const TelegramBot = require('node-telegram-bot-api');
const cheerio = require('cheerio');
const axios = require('axios');
const schedule = require('node-schedule');
const fs = require('fs');
const configfilePath = './bot_config.json'

let config;
let bot;


async function initConfig(){

  console.log(`%c ________________________________________
   - Apple Store KR MBP16 M1 NOTIFICATION BOT - 
      COKIA 2021.10.25 v1.0.0    
                     
 ----------------------------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`, "font-family:monospace")

const isConfigExists = fs.existsSync(configfilePath)

if (!isConfigExists) {
    throw new Error("No config file exists")
}
  config = JSON.parse(fs.readFileSync(configfilePath,'utf-8'))
  if (config.telegramBotToken !== undefined){
    console.log("init: config load success")
    bot = new TelegramBot(config.telegramBotToken, {
    polling: true
  });
  lastUpdatedNoticeNumber = config.lastUpdatedNoticeID;
} else {
  throw new Error("config setup error")
}
}
  
async function sendMessage(payload) {
    await bot.sendMessage(config.telegramChannelId, payload,{
      "reply_markup": {
        "inline_keyboard": [
          [{
            text: "지금 바로 주문하기",
            url: "https://www.apple.com/kr/shop/buy-mac/macbook-pro/16%ED%98%95"
          }]
        ]
      }
    });
}


async function crawlAppleStore() {
  // console.log("A")
    const result = await axios.get(`https://www.apple.com/kr/shop/fulfillment-messages?parts.0=MKGQ3KH%2FA&parts.1=MKGT3KH%2FA&parts.2=MK183KH%2FA&mt=regular&_=1635120733943`);
    // const $ = await cheerio.load(result.data)
    // const mbp16SalesStatus = $('#model-selection > bundle-selection > store-provider > div.as-l-container.as-bundleselection-container > div.as-bundleselection-model.as-bundleselection-group3.as-bundleselection-modelactive > div.as-bundleselection-modelvariationsbox.row > div > div:nth-child(2) > div > bundle-selector > div.as-slide-swapper.as-macbtr-details > div.as-macbtr-options.as-bundleselection-modelshown.acc_MK193KH\\/A.rs-noAnimation > div > ul.as-macbundle-modelinfo > li.as-macbundle-deliverydates > div > div > ul > li').text();
    const mbp16SalesStatus = result.data.body.content.deliveryMessage['MKGQ3KH/A'].deliveryOptionMessages[0].displayName
    console.log(mbp16SalesStatus)
    if(mbp16SalesStatus !== "현재 구매 불가")
    sendMessage(`맥북프로 16인치 M1 모델의 판매가 시작되었습니다 🎉🎉🎉🎉`)
    return 0;
}

initConfig();
crawlAppleStore()
schedule.scheduleJob('* * * * *', async function() {
    const a = await crawlAppleStore()
});