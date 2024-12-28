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

// 爬蟲 - 獲取 Token 資料 (僅抓取 TW)
async function getTokenData() {
    try {
        const response = await axios.get('https://wowauction.us/classic/token');
        const $ = cheerio.load(response.data);

        // 只抓取 "Classic TW WoW Token Price" 部分的 Current 價格
        const twSection = $('div:contains("Classic TW WoW Token Price")').first();

        const currentPrice = twSection.find('b:contains("Current:")').next().text().trim();

        // 返回格式化後的資料
        return `當前Token價格: ${currentPrice}`;
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
