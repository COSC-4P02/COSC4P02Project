import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
from bs4 import BeautifulSoup
import json
import codecs
import os
import sys
import json
from datetime import datetime
import base64

# Config
api_url = "https://cg2022.gems.pro/Result/Sport_List.aspx?SetLanguage=en-CA&Gems_ScreenWidth=1512&Gems_ScreenHeight=982&Gems_ScreenAvailWidth=1471&Gems_ScreenAvailHeight=944";
time_list = ["Sport","2022/08/06","2022/08/07","2022/08/08","2022/08/09","2022/08/10","2022/08/11","2022/08/12","2022/08/13","2022/08/14","2022/08/15","2022/08/16","2022/08/17","2022/08/18","2022/08/19","2022/08/20","2022/08/21"]

def request_brock_api():
	url = api_url
	r = requests.get(url, verify=False)
	return r.text

def main():
	print("> Fetching...")
	bs_table=BeautifulSoup(request_brock_api(), features="html.parser")
	data = bs_table.select('.SportMatrix tr')
	cg_schedule = []

	for tr in data:
		ifHead = False
		first = True
		count = 0
		cg_schedule_temp = []
		title = ""

		# Table Head
		for th in tr.select('th'):
			# time_list.append(th.text)
			ifHead = True
		if (ifHead):
			continue

		# Timetable
		for td in tr.select('td'):
			if first:
				title = td.select('a')[0].text
				first = False
				count=count+1;
				continue
			if (not str(td.decode_contents()).replace(" ", "").replace("&nbsp;", "") == ""):
				url =  "https://cg2022.gems.pro/Result/"+td.select('a')[0].attrs['href']
				cg_schedule_temp.append([time_list[count],url])
			count=count+1;

		data = {
			"title":title,
			"time":cg_schedule_temp
			}
		cg_schedule.append(data)
	
	print(cg_schedule)

	print("> Saving Data to files...")
	json_temp = json.dumps(cg_schedule)
	f = codecs.open(os.path.join(sys.path[0], "cg_schedule.json"),'w','utf-8')
	f.write(json_temp)
	f.close()

if __name__ == "__main__":
	main()