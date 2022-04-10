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
api_url = "https://www.canadagames.ca/results";

def request_brock_api():
	url = api_url
	r = requests.get(url, verify=False)
	return r.text

def main():
	print("> Fetching Results...")
	bs_table=BeautifulSoup(request_brock_api(), features="html.parser")
	data = bs_table.select('.cg-container .table-grid .w-dyn-list .w-dyn-items .table-row')
	cg_result = []

	for item in data:
		data = {
			"name":item.select('.name-cell div')[0].text,
			"summergames":{
				"gold":item.select('._3cols div')[4].text,
				"silver":item.select('._3cols div')[5].text,
				"bronze":item.select('._3cols div')[6].text,
			},
			"wintergames":{
				"gold":item.select('._3cols')[1].select('div')[4].text,
				"silver":item.select('._3cols')[1].select('div')[5].text,
				"bronze":item.select('._3cols')[1].select('div')[6].text,
				},
			"total":item.select('.fourth-col div')[1].text,
			"links":"https://www.canadagames.ca/results"
			}
		cg_result.append(data)
	
	print("> Saving Data to files...")
	json_temp = json.dumps(cg_result)
	f = codecs.open(os.path.join(sys.path[0], "cg_result.json"),'w','utf-8')
	f.write(json_temp)
	f.close()

if __name__ == "__main__":
	main()