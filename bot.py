# bot.py

import discord
from discord.ext import commands
import requests
from bs4 import BeautifulSoup

# Discord 機器人設定
TOKEN = '你的 Discord Bot Token'
intents = discord.Intents.default()
intents.messages = True
bot = commands.Bot(command_prefix='!', intents=intents)

# 爬蟲 - 獲取 Token 資料
def get_token_data():
    try:
        url = 'https://wowauction.us/classic/token/tw'
        response = requests.get(url)
        response.raise_for_status()  # 確保請求成功

        # 解析 HTML
        soup = BeautifulSoup(response.text, 'html.parser')

        # 嘗試抓取價格資訊
        current_price = soup.find('b', text='Current:').find_next('span').text.strip()
        low_24hr = soup.find('b', text='24 hour low:').find_next('span').text.strip()
        high_24hr = soup.find('b', text='24 hour high:').find_next('span').text.strip()

        # 返回格式化後的資料
        return f"當前Token價格: {current_price} \n24小時最低: {low_24hr} \n24小時最高: {high_24hr}"
    
    except Exception as e:
        print('Error fetching data:', e)
        return '無法抓取 Token 資料'

# 設置指令處理
@bot.command(name='token')
async def fetch_token(ctx):
    # 爬蟲抓取資料
    token_data = get_token_data()
    # 傳回 Discord 頻道
    await ctx.send(token_data)

# 啟動機器人
bot.run(TOKEN)
