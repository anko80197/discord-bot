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

        // 根據網站的結構選擇需要的資料（例如使用class選擇器）
        const currentPrice = $('#price-table .current-price span').text().trim();  // 現在價格
        const low24h = $('#price-table .low-24h span').text().trim();  // 24小時最低價
        const high24h = $('#price-table .high-24h span').text().trim();  // 24小時最高價
        const low7d = $('#price-table .low-7d span').text().trim();  // 7天最低價
        const high7d = $('#price-table .high-7d span').text().trim();  // 7天最高價
        const low30d = $('#price-table .low-30d span').text().trim();  // 30天最低價
        const high30d = $('#price-table .high-30d span').text().trim();  // 30天最高價

        // 返回抓取到的資料
        return `當前Token價格: ${currentPrice}\n24小時最低價: ${low24h}\n24小時最高價: ${high24h}\n7天最低價: ${low7d}\n7天最高價: ${high7d}\n30天最低價: ${low30d}\n30天最高價: ${high30d}`;
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
