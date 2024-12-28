const { Client, GatewayIntentBits } = require('discord.js');

// 直接將 Token 寫入程式碼中（雖然這不安全，但符合你的需求）
const token = 'MTMyMjQyNTE3MDYwMTk3MTg3Mg.G-FW28.rdCuY5mp9duVZFlvM9NjsXko_8EESv3sNdoItA';

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

// 登錄機器人
console.log('Bot is logging in...');
client.login(token);
