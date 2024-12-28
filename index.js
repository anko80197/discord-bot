const axios = require('axios');
const cheerio = require('cheerio');
const { Client, GatewayIntentBits } = require('discord.js');

// Discord Bot 設置
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// 爬蟲 - 獲取 Token 資料
async function getTokenData() {
    try {
        const response = await axios.get('https://wowauction.us/classic/token');
        const $ = cheerio.load(response.data);

        // 這裡的選擇器已經根據你的需求進行更新
        // 根據HTML結構選擇包含價格的元素
        const currentPrice = $('div.flex-row div.text-amber-400 b:contains("Current:")').next().text().trim();
        const low24hr = $('div.flex-row div.text-amber-400 b:contains("24 hour low:")').next().text().trim();
        const high24hr = $('div.flex-row div.text-amber-400 b:contains("24 hour high:")').next().text().trim();
        const low7day = $('div.flex-row div.text-amber-400 b:contains("7 day low:")').next().text().trim();
        const high7day = $('div.flex-row div.text-amber-400 b:contains("7 day high:")').next().text().trim();
        const low30day = $('div.flex-row div.text-amber-400 b:contains("30 day low:")').next().text().trim();
        const high30day = $('div.flex-row div.text-amber-400 b:contains("30 day high:")').next().text().trim();

        // 返回格式化後的資料
        return `當前Token價格: ${currentPrice} \n24小時最低: ${low24hr} \n24小時最高: ${high24hr} \n7天最低: ${low7day} \n7天最高: ${high7day} \n30天最低: ${low30day} \n30天最高: ${high30day}`;
    } catch (error) {
        console.error('Error fetching data:', error);
        return '無法抓取 Token 資料';
    }
}

// 發送資料到 Discord 頻道
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!token') {
        const tokenData = await getTokenData();
        message.channel.send(tokenData);
    }
});

// 從環境變數中獲取 token
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('Discord token is missing!');
    process.exit(1); // 如果沒有取得 token，退出程序
}

console.log('TOKEN:', token);

// 登錄機器人
client.login(token);
