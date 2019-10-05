import requests
import os
import urllib.request
import re
from bs4 import BeautifulSoup


response = requests.get('https://dev.heweather.com/docs/refer/condition')
soup = BeautifulSoup(response.text,"lxml")
itemJson = []
file_path="F:\Worker\GCProject孔\V1.0\dataPy\image"

for listTemp in soup.find("tbody").find_all("tr"):
    #是否有这个路径
    if not os.path.exists(file_path):
    #创建路径
        os.makedirs(file_path)
    #获得图片后缀
    file_suffix = os.path.splitext(listTemp.find_all('td')[3].a.get("href"))[1]
    print(file_suffix)
    #拼接图片名（包含路径）
    filename = '{}{}{}{}'.format(file_path,os.sep,re.findall("\d+",listTemp.find_all('td')[3].a.get("href").split("/")[-1])[0] ,file_suffix)
    print(filename)
    #下载图片，并保存到文件夹中
    urllib.request.urlretrieve(listTemp.find_all('td')[3].a.get("href"),filename=filename)    
    item = {
        "name" : listTemp.find_all('td')[1].text,
        "url"  : listTemp.find_all('td')[3].a.get("href").split("/")[-1]
    }
    itemJson.append(item)
print(itemJson)