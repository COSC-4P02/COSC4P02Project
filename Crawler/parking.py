import bs4
from bs4 import BeautifulSoup
import requests
from lxml import etree

import json
import pandas as pd

# keep debugging.......
# try to find another way to crawl the data easily.
# some data are ready for being used by chatbot
#


parking_info = {
    "parking-lot": [],
    "type": [],
    "closest_building": []

}

# https://brocku.ca/blogs/campus-map/category/brock-university/parking-lots/page/2/
f = open("parking_htm.txt", "r")
urlList = f.readlines()
for url in urlList:
    # print(url)
    r = requests.get(url).text
    s = etree.HTML(r)

    # //*[@id="calendarcontent"]/tbody/tr[75]/td[1]/p[62]/a
    # //*[@id="calendarcontent"]/tbody/tr[75]/td[1]/p[3]/a
    # //*[@id="calendarcontent"]/tbody/tr[75]/td[1]/p[10]/a
    # //*[@id="calendarcontent"]/tbody/tr[75]/td[1]/p[17]/a

    #
    #     lotName = s.xpath('//*[@id="post"]/div/h2/a/text()')
    #     lotType = s.xpath('/html/body/div/div[2]/div[1]/div/div[3]/div/div[@class = "entry-summary"]/p[1]/text()')
    #     cb = s.xpath('/html/body/div/div[2]/div[1]/div/div[3]/div[1]/p[2]/a/text()')
    #
    #     ssd = s.xpath('/html/body/div/div[2]/div[1]/div/div[@id = "post"]/div/div[1]/p[2]/a/text()')
    #     print(ssd)
    #     data = zip(lotName,lotType,ssd)
    #     parking_info["parking-lot"].append(lotName)
    #     parking_info["type"].append(lotType)
    #     parking_info["closest_building"].append(ssd)

    lotName = s.xpath('//*[@id="post"]/h1/text()')
    lotType = s.xpath('//*[@id="post"]/div[1]/p[1]/text()')
    cb = s.xpath('//*[@id="post"]/div[1]/p[2]/a/text()')

    parking_info["parking-lot"].append(lotName)
    parking_info["type"].append(lotType)
    parking_info["closest_building"].append(cb)

f1 = open("pk1.txt", "r")
urlList1 = f1.readlines()
for url1 in urlList1:
    # print(url)
    r1 = requests.get(url1).text
    s1 = etree.HTML(r1)

    lotName1 = s1.xpath('//*[@id="post"]/h1/text()')
    lotType1 = s1.xpath('//*[@id="post"]/div[1]/p/text()')
    cb1 = s1.xpath('//*[@id="post"]/div[1]/div/div/div/div/div/p[1]/a/text()')
    #print(lotType1)
    parking_info["parking-lot"].append(lotName1)
    parking_info["type"].append(lotType1)
    parking_info["closest_building"].append(cb1)

    #   /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/p[1]
    #   /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/div/div/div/div/p[1]
    #   /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/div/div/div/div/p[1]
    #   /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/div/div/div/div/p[1]
    #   /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/div/div/div/div/p[1]

f2 = open("pk2.txt", "r")
urlList2 = f2.readlines()
for url2 in urlList2:
        # print(url)
    r2 = requests.get(url2).text
    s2 = etree.HTML(r2)

    lotName2 = s2.xpath('//*[@id="post"]/h1/text()')
    lotType2 = s2.xpath('//*[@id="post"]/div[1]/div/p[1]/text()')
    cb2 = s2.xpath('//*[@id="post"]/div[1]/div/p[2]/a/text()')

        # /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/p[1]
        # /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/p[1]
        # /html/body/div/div[2]/div[1]/div/div[3]/div[1]/div/div/p[1]
    parking_info["parking-lot"].append(lotName2)
    parking_info["type"].append(lotType2)
    parking_info["closest_building"].append(cb2)


    cv = pd.DataFrame(parking_info)

    cv.to_csv("parking_info.csv")
# //*[@id="calendarcontent"]/tbody/tr[75]/td[1]/p[62]/a
# /html/body/div/div[2]/div[1]/div/div[3]/div[4]/div[1]/p[1]
#      //*[@id="post"]/div[1]
# //*[@id="post"]/div[1]/p[2]
#
# /html/body/div/div[2]/div[1]/div/div[3]/div/h2/a
