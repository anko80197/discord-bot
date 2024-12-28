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

        // 精確選擇器抓取當前Token價格，抓取 "Current:" 旁的價格
        const currentPrice = $('div.text-amber-400')
            .first()  // 選擇第一个 div.text-amber-400
            .find('b') // 找到 b 標籤
            .filter(function() {
                return $(this).text().includes('Current:'); // 篩選包含 "Current:" 的 b 標籤
            })
            .next() // 抓取緊接著的元素，就是當前價格
            .text()
            .trim();

        // 抓取24小時最低和最高價格
        const low24hr = $('div.text-amber-400')
            .first()
            .find('b')
            .filter(function() {
                return $(this).text().includes('24 hour low:');
            })
            .next()
            .text()
            .trim();
        const high24hr = $('div.text-amber-400')
            .first()
            .find('b')
            .filter(function() {
                return $(this).text().includes('24 hour high:');
            })
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
