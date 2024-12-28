import os
import discord
from discord.ext import commands

# 從環境變數中讀取 Token
TOKEN = os.getenv("DISCORD_TOKEN")

intents = discord.Intents.default()
bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

@bot.command()
async def hello(ctx):
    await ctx.send("Hello, World!")

# 啟動機器人
if TOKEN:
    bot.run(TOKEN)
else:
    print("Error: DISCORD_TOKEN 環境變數未設定")
