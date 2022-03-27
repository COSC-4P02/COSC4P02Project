from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy, ProxyType

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
}

#file = open("ACTG.csv", "w", encoding="utf-8")

chromeOptions = webdriver.ChromeOptions()
chromeOptions.add_argument('headless')

driver = webdriver.Chrome(chrome_options=chromeOptions)

driver.get('https://brocku.ca/guides-and-timetables/timetables/?session=fw&type=ex&level=all&program=ACTG&academicyear=2021&period=April')

#driver = driver.find_element_by_tag_name('html')
table = driver.find_element_by_xpath("//table[contains(@clsss,'course-table') and contains(@class,'exam-listing')]")

print(table.text)
driver.close()