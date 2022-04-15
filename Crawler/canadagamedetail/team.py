from selenium import webdriver
from threading import Thread, Lock

file = open("result.csv", 'w', encoding='utf_8_sig')
url_lock = Lock()
write_lock = Lock()
count = 0

def thread_func(urls, thread_id):
    global count
    global file
    global url_lock
    global write_lock
    while(True):
        url_lock.acquire()
        if count < len(urls):
            url = urls[count]
            count += 1
        else:
            url_lock.release()
            break
        url_lock.release()

        print(thread_id, "- Opening", count ,": " + url)
        chromeOptions = webdriver.ChromeOptions()
        chromeOptions.add_argument('--log-level=3')
        chromeOptions.add_argument('headless')
        chromeOptions.add_experimental_option('excludeSwitches', ['enable-logging'])
        driver = webdriver.Chrome(chrome_options=chromeOptions)
        driver.get(url)

        line = ""
        data_cell = driver.find_element_by_id('ctl00_tdDataCell')
        
        #get links
        line += '"' + url + '",'

        # get name
        line += '"'
        if 'txtName' in data_cell.get_attribute("innerHTML"):  # check existance before find
            team_element = driver.find_element_by_id('txtName')
            line += team_element.text
        line += '"'
        line += ","

        # get contingent
        line += '"'
        if 'txtContingent' in data_cell.get_attribute("innerHTML"): # check existance before find
            conti_element = driver.find_element_by_id('txtContingent')
            line += conti_element.text
        line += '"'
        line += ","
        
        
        # get sport name
        line += '"'
        if 'txtEventName' in data_cell.get_attribute("innerHTML"): # check existance before find
            sportN_element = driver.find_element_by_id('txtEventName')
            line += sportN_element.text
        line += '"'
        line += ","

        # get position name
        line += '"'
        if 'txtFinalPosition' in data_cell.get_attribute("innerHTML"): # check existance before find
            sportN_element = driver.find_element_by_id('txtFinalPosition')
            line += sportN_element.text
        line += '"'
        line += ","

        line += '\n'
        
        write_lock.acquire()
        file.write(line)
        print(thread_id, ":", line)
        file.flush()
        write_lock.release()
        driver.close()
        print(thread_id, "- Closing browser...")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36'
}

chromeOptions = webdriver.ChromeOptions()
chromeOptions.add_argument('headless')

driver = webdriver.Chrome(chrome_options=chromeOptions)
driver.get("https://cg2019.gems.pro/Result/ShowTeam_List.aspx?SetLanguage=en-CA")

inputs = driver.find_elements_by_tag_name("input")

find_button = None
for n in inputs:
    outerHTML = n.get_attribute('outerHTML')
    if 'value="Find"' in outerHTML:
        find_button = n
        break

# print(find_button.get_attribute('outerHTML'))
if find_button != None:
    find_button.click()

driver.implicitly_wait(10)

table = driver.find_element_by_id('ctl00_tdDataCell')

rows = table.find_elements_by_tag_name('a')

print("Looking for person urls....")
team_url = []
for row in rows:
    href = row.get_attribute('href')
    if "Team_GUID" in href:
        team_url.append(href)
    else:
        print("Error: No GUID found in href")

# team_url = team_url[:20]

print("Total numberof records:", len(team_url))
driver.close()


thread_pool = []
num_threads = 20
for i in range(num_threads):
    p = Thread(target=thread_func, args=(team_url, i))
    p.start()
    thread_pool.append(p)

for i in range(len(thread_pool)):
    thread = thread_pool[i]
    print("Waiting for Thread", i)
    thread.join()
    print("Thread", i,"finished.")

file.close()