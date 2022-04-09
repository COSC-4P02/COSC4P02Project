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
api_url = "https://brocku.ca/programs/";

def request_brock_api():
	url = api_url
	r = requests.get(url, verify=False)
	return r.text

def main():
	print("> Fetching Programs...")
	bs_table=BeautifulSoup(request_brock_api(), features="html.parser")
	data = bs_table.select('#content #grid .item')
	all_programs = []

	for item in data:
		title = item.div.h3.text
		department = item.div.p.a.text
		href = ""
		x=json.dumps(item.div.h3.a.attrs)
		if x != "{}":
			y=json.loads(x)
			href = y['href']

		print("> Current Program: "+title)
		json_a = {
			"type":"button",
			"text":"The "+title+" program at Brock University is run by the "+department+", for more information, see the "+title+" program webpage here",
			"disableInput":False,
			"options":[{"text":title+" Details","value":href,"action":"url"},
				{"text":"Full Programs List","value":"https://brocku.ca/programs/","action":"url",}]
				}
		item = {"title":title,
				"department":department,
				"href":href,
				"nlp":"!json-"+json.dumps(json_a)}
		all_programs.append(item)

	print("> Saving Data to files...")
	json_temp = json.dumps(all_programs)
	f = codecs.open(os.path.join(sys.path[0], "all_programs.json"),'w','utf-8')
	f.write(json_temp)
	f.close()

if __name__ == "__main__":
	main()