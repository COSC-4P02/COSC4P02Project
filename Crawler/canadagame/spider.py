from selenium import webdriver
from selenium.webdriver.common.proxy import Proxy, ProxyType

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
}

file = open("alumni.csv", "w", encoding="utf-8")

chromeOptions = webdriver.ChromeOptions()
# chromeOptions.add_argument('headless')

driver = webdriver.Chrome(chrome_options=chromeOptions)
driver.get('https://cgc.gems.pro/AlumCgc/Alumni/FindAlumni_List.aspx')

selector = driver.find_element_by_xpath("//h1[@id='lblPageTitle']").find_element_by_xpath("..").find_element_by_tag_name("div")
btns = selector.find_elements_by_tag_name("input")
for i in range(len(btns)):
    btn = btns[i]
    btn.click() 
    driver.implicitly_wait(10)

    if(len(driver.find_elements_by_xpath("//span[contains(@class, 'LargeListMessage')]")) != 0 ):
        driver.get("https://cgc.gems.pro/AlumCgc/Alumni/FindAlumni_List.aspx?UseSessionState=Y&ShowAll=Y")
    driver.implicitly_wait(10)

    alumni_list = driver.find_element_by_xpath("//div[contains(@class, 'FindAlumniList')]").find_elements_by_xpath("//div[contains(@class, 'PersonTile')]")
    for alumni in alumni_list:
        # print(alumni.text)
        items = alumni.text.split("\n")
        out = ""
        for i in range(len(items)):
            item = items[i]
            out += item
            if(i == (len(items)-1)):
                out += "\n"
            else:
                out += ","
        file.write(out)
        file.flush()

    selector = driver.find_element_by_xpath("//h1[@id='lblPageTitle']").find_element_by_xpath("..").find_element_by_tag_name("div")
    btns = selector.find_elements_by_tag_name("input")

file.close()
driver.close()