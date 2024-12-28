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

        // 查找 "Current:" 這一行，並確保它是抓取到的
        const currentPrice = $('b:contains("Current:")')
            .first()  // 確保選擇的是 "Current:" 這一行
            .parent()
            .next()
            .text()
            .trim();

        // 如果抓取不到正確的資料，可以進一步調整選擇器
        if (!currentPrice) {
            console.error("Current price not found!");
            return "無法抓取當前價格資料";
        }

        // 這些是 24 小時、7 天、30 天的價格數據
        const low24hr = $('b:contains("24 hour low:")')
            .parent()
            .next()
            .text()
            .trim();
        const high24hr = $('b:contains("24 hour high:")')
            .parent()
            .next()
            .text()
            .trim();

        // 返回格式化後的資料
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
