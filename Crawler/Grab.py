
import urllib.request
import requests
import re
from bs4 import BeautifulSoup
import csv


def getInfo():
    url = 'https://brocku.ca/webcal/2021/undergrad/bchm.html'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:72.0) Gecko/20100101 Firefox/72.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    pattern = re.compile('(<a name=")[A-Z][A-Z][A-Z][A-Z].\d[A-Z]\d\d')

    # list = soup.find_all('p', {'class':['calccode','calcname','calnormal','calitalic']})
    list = soup.find_all('p', {'class':['calccode','calcname','calnormal','calitalic']})

    f = open("Bioc.csv",mode='w')
    fields = ['1','2','3','4','5','6','7']
    writer = csv.writer(f)

    c=0
    d=0
    outputList = []

    for tag in soup.find_all('p', {'class':['calccode','calcname']}):
        # c+=1
        # if c > 29:
        # if tag.string:
        #     print(tag.string)
        # print(tag.string)

        # normal_counter = 0
        # if tag['class'] == 'calnormal':
        #     print(tag.string)
        # print(dir(tag))

        if tag.string:
            # print(tag.has_attr('calnormal'))

            if d < 2:
                outputList.append(tag.string)
                d += 1
                print(outputList)
                # print(tag.string)
            else:
                writer.writerow(outputList)
                outputList.clear()
                d=0
                outputList.append(tag.string)
                d += 1




    f.close()


getInfo()


def grabWeb():
    url = 'https://brocku.ca/webcal/2021/undergrad/cosc.html'
    resp = urllib.request.urlopen(url)
    page = resp.read()
    page = str(page, 'utf-8')
    #find course code
    pattern = re.compile('(<a name=")[A-Z][A-Z][A-Z][A-Z].\d[A-Z]\d\d')

    match = re.search(pattern,page)
    newPage = page[match.start():]
    # newPatern = re.compile('<a href=".*MM_returnValue;">')
    # newPage = re.sub(newPatern,"",newPage)

    f = open('asd.html', 'w')
    f.write(newPage)
    f.close()

    #init B4U
    # with open("asd.html") as fp:
    #     soup = BeautifulSoup(fp,"html.parser")
    #
    #
    # list = soup.find_all('a')
    # print(list)
    # c = 0
    # for tag in list:
    #     c+=1
    #     if c==5:
    #         break
    #
    #     print(tag)


    # idx_start = page.find("sp-bid")  # Mining for gold in data
    #
    # newPage = page[idx_start:]
    # end_pos = newPage.find("<")
    # start_pos = newPage.find(">")+1
    # gold_price = newPage[start_pos:end_pos]
    # return gold_price

# grabWeb()