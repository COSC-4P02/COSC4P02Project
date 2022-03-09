from selenium import webdriver
from bs4 import BeautifulSoup
from test.datetimetester import OTHERSTUFF

def getCourseInfo(s):
    
    course_title = []
    course_info = []
    
    for a in s.findAll('td', attrs = {'colspan' : '2'}):
        if a.find('p',attrs = {'class':'calcname'}) is not None:
            course_title.append(a.text)
        if a.find('p', attrs = {'class':'calitalic'}) is not None:
            course_info.append(a.text)
    return zip(course_title, course_info)

def getText(s):
    
    title_text = []
    text = []
    
    for a in soup.findAll('div', attrs = {'class':'wpb_wrapper'}):
        if a.find('h3') is not None:
            title_text.append(a.text)
        if a.find('p') is not None:
            text.append(a.text)    
            
    result = [(title_text), (text)]      
    
    return zip(title_text, text)

def getPageText(s):
    page_text = []
    for a in s.findAll('div', attrs = {'class':'wpb_wrapper'}):
        
        if a.find('p') is not None:
            aString = str(a.find('p').text)
        
            if aString not in page_text:
                page_text.append(aString)
        
    return page_text

def getVCTABLE(s):
    table1 = []
    
    counter = 1
    
    table1.append(str(counter))
    
    for a in s.findAll('span', attrs = {'class':'vc_table_content'}):
        if a is not None:
            table1.append(a.text)
        if len(table1) == 37:
            table1.append(str(counter + 1))
    return table1

def getMoreText(s):
    page_text = []
    for a in s.findAll('p'):
        
        if a is not None:
            aString = str(a.text)
        if aString not in page_text:
                page_text.append(aString)
                
    return page_text

def getGSHEETS(s):
    listStuff = []
    
    for a in s.findAll('div',attrs = {'class':'gsheets-table-container'}):
        
        page_text = []
        
        for b in a.findAll('th'):
            if b.has_attr('data-sort'):
                
                if b is not None:
                    
                    page_text.append(b.text)
                    
        if len(page_text) > 0:
            listStuff.append(str(len(page_text)))
            
        for b in page_text:
            listStuff.append(b)
        
        for b in a.findAll('td'):
            if b.has_attr('style'):
                listStuff.append(b.text)
                  
    return listStuff
excludeSwitches: ['enable-logging']

options = webdriver.ChromeOptions() 
options.add_experimental_option("excludeSwitches", ["enable-logging"])

driver = webdriver.Chrome(options = options,executable_path='chromedriver_win32/chromedriver')

f = open("scrapestuff4.txt","r")
f1 = open("scrapeInfo4.txt","w+")
count = 1

for x in f:
    driver.get(x)
    content = driver.page_source
    soup = BeautifulSoup(content,'html.parser')
    
    f1.write("\n%d\r\n" % (count))
    
    #stuff = getCourseInfo(soup)
    #stuff = getPageText(soup)
    #stuff = getVCTABLE(soup)
    stuff = getGSHEETS(soup)
    
    for row in stuff:
        f1.write(row)
        f1.write('\n')
               
    count += 1
    #for row in stuff:
        #for val in row:
            #hold = val.split('\n')
           
            #for i in range(len(hold)):
                   
                #if hold[i] != '':
                    #source = hold[i].encode("utf-8").decode("utf-8")
                    #f1.write(str(source))
                    #f1.write('\n') for scrapestuff1
                #f1.write('\n')
            #f1.write('\n')
f.close()
f1.close()
driver.close()