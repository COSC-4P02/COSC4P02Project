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

        # get name
        line += '"'
        if 'txtPersonNameFML' in data_cell.get_attribute("innerHTML"):  # check existance before find
            person_element = driver.find_element_by_id('txtPersonNameFML')
            line += person_element.text
        line += '"'
        line += ","

        # get contingent
        line += '"'
        if 'txtContingent' in data_cell.get_attribute("innerHTML"): # check existance before find
            conti_element = driver.find_element_by_id('txtContingent')
            line += conti_element.text
        line += '"'
        line += ","

        # get hometown
        line += '"'
        if 'txtHomeTown' in data_cell.get_attribute("innerHTML"): # check existance before find
            hometown_element = driver.find_element_by_id('txtHomeTown')
            line += hometown_element.text
        line += '"'
        line += ","

        # get participant type
        line += '"'
        if 'txtParticipantTypeName' in data_cell.get_attribute("innerHTML"): # check existance before find
            tpyeN_element = driver.find_element_by_id('txtParticipantTypeName')
            line += tpyeN_element.text
        line += '"'
        line += ","

        # get sport name
        line += '"'
        if 'txtSportName' in data_cell.get_attribute("innerHTML"): # check existance before find
            sportN_element = driver.find_element_by_id('txtSportName')
            line += sportN_element.text
        line += '"'
        line += ","

        #get the age
        line += ""
        if 'txtAge' in data_cell.get_attribute("innerHTML"): # check existance before find
             agE_element = driver.find_element_by_id('txtAge')
             line += agE_element.text
        line += '"'
        line += ","

         #get the height
        line += ""
        if 'txtHeight' in data_cell.get_attribute("innerHTML"): # check existance before find
             heighT_element = driver.find_element_by_id('txtHeight')
             line += heighT_element.text
        line += '"'
        line += ","

         #get the weight
        line += ""
        if 'txtWeight' in data_cell.get_attribute("innerHTML"): # check existance before find
             weighT_element = driver.find_element_by_id('txtWeight')
             line += weighT_element.text
        line += '"'
        line += ","

        # get previous games
        if 'txtPrevSameGames' in data_cell.get_attribute("innerHTML"): # check existance before find
            preS_element = driver.find_element_by_id('txtPrevSameGames')
            games = preS_element.text.split('\n')
            for game in games:
                line += '"'
                line += game
                line += '"'
                line += ','

         # get previous games
        if 'txtPrevGames' in data_cell.get_attribute("innerHTML"): # check existance before find
            preV_element = driver.find_element_by_id('txtPrevGames')
            games1 = preV_element.text.split('\n')
            for game2 in games1:
                line += '"'
                line += game2
                line += '"'
                line += ','
        



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
driver.get("https://cg2015.gems.pro/Result/ShowPerson_List.aspx?SetLanguage=en-CA")

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

table = driver.find_element_by_id('ctl00_ContentPlaceHolder1_tblParticipant')

rows = table.find_elements_by_tag_name('a')

print("Looking for person urls....")
person_url = []
for row in rows:
    href = row.get_attribute('href')
    if "Person_GUID" in href:
        person_url.append(href)
    else:
        print("Error: No GUID found in href")

# person_url = person_url[:100]

print("Total numberof records:", len(person_url))
driver.close()


thread_pool = []
num_threads = 20
for i in range(num_threads):
    p = Thread(target=thread_func, args=(person_url, i))
    p.start()
    thread_pool.append(p)

for i in range(len(thread_pool)):
    thread = thread_pool[i]
    print("Waiting for Thread", i)
    thread.join()
    print("Thread", i,"finished.")

file.close()