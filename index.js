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
        const response = await axios.get('https://wowauction.us/classic/token/tw');
        const $ = cheerio.load(response.data);

        // 輸出整個 HTML 結構，來檢查網頁的內容
        console.log(response.data);  // 打印網頁HTML結構，查看是否正確獲取

        // 使用正確的選擇器抓取 Token 資料
        const currentPrice = $('b:contains("Current:")').parent().next().text().trim();
        const low24hr = $('b:contains("24 hour low:")').parent().next().text().trim();
        const high24hr = $('b:contains("24 hour high:")').parent().next().text().trim();

        // 輸出每個價格以進行檢查
        console.log("當前Token價格:", currentPrice);
        console.log("24小時最低:", low24hr);
        console.log("24小時最高:", high24hr);

        // 檢查是否成功抓取價格，並返回格式化的資料
        if (!currentPrice || !low24hr || !high24hr) {
            return '無法抓取 Token 資料';
        }

        return `當前Token價格: ${currentPrice} \n24小時最低: ${low24hr} \n24小時最高: ${high24hr}`;
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
