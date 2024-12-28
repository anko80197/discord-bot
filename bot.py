import os
import discord
from discord.ext import commands

# 啟用所有必要的 Intents
intents = discord.Intents.default()
intents.messages = True  # 必須啟用以讀取訊息內容
intents.message_content = True  # 啟用 Message Content Intent

# 初始化 Bot
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

@bot.command()
async def hello(ctx):
    await ctx.send("Hello, World!")

TOKEN = os.getenv("DISCORD_TOKEN")
if TOKEN:
    bot.run(TOKEN)
else:
    print("Error: DISCORD_TOKEN 環境變數未設定")
