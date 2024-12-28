import os
import discord
from discord.ext import commands
import requests
from bs4 import BeautifulSoup

# 啟用所有必要的 Intents
intents = discord.Intents.default()
intents.messages = True  # 必須啟用以讀取訊息內容
intents.message_content = True  # 啟用 Message Content Intent

# 初始化 Bot
bot = commands.Bot(command_prefix="!", intents=intents)

# 爬蟲 - 獲取 Token 資料
def get_token_data():
    try:
        url = 'https://wowauction.us/classic/token/tw'
        response = requests.get(url)
        response.raise_for_status()

        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')
        current_price = soup.find('b', text='Current:').find_next('span').text.strip()
        low_24hr = soup.find('b', text='24 hour low:').find_next('span').text.strip()
        high_24hr = soup.find('b', text='24 hour high:').find_next('span').text.strip()

        return f"當前Token價格: {current_price} \n24小時最低: {low_24hr} \n24小時最高: {high_24hr}"
    except Exception as e:
        print(f"Error fetching data: {e}")
        return "無法抓取 Token 資料"

# 機器人啟動事件
@bot.event
async def on_ready():
    print(f"Logged in as {bot.user}")

# 基礎指令
@bot.command()
async def hello(ctx):
    await ctx.send("Hello, World!")

# 爬蟲指令
@bot.command()
async def token(ctx):
    token_data = get_token_data()
    await ctx.send(token_data)

# 全局錯誤處理
@bot.event
async def on_command_error(ctx, error):
    await ctx.send(f"發生錯誤: {error}")

# 從環境變數中讀取 Discord Token
TOKEN = os.getenv("DISCORD_TOKEN")
if TOKEN:
    bot.run(TOKEN)
else:
    print("Error: DISCORD_TOKEN 環境變數未設定")
