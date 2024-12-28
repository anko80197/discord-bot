const { Client, GatewayIntentBits } = require('discord.js');

// 確認 TOKEN 變數是否正確讀取
console.log('TOKEN:', process.env.TOKEN);

// 創建 Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 機器人啟動時的回調
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// 處理訊息
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!token') {
        message.channel.send('Hello! Your bot is working!');
    }
});

// 登錄機器人，確保 TOKEN 是從環境變數獲取
client.login(process.env.TOKEN);
