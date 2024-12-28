const { Client, GatewayIntentBits } = require('discord.js');

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

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === '!token') {
        message.channel.send('Hello! Your bot is working!');
    }
});

// 获取环境变量中的 Token
const token = process.env.DISCORD_TOKEN;
if (!token) {
    console.error('Discord token is missing!');
    process.exit(1); // 如果没有获取到 token，退出程序
}

console.log('TOKEN:', token);

// 登录机器人
client.login(token);
