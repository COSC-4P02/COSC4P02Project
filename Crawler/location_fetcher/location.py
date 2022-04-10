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
api_url = "https://brocku.ca/blogs/campus-map/directions/";

def request_brock_api():
	url = api_url
	r = requests.get(url, verify=False)
	return r.text

def main():
	print("> Fetching Locations...")
	bs_table=BeautifulSoup(request_brock_api(), features="html.parser")
	data = bs_table.select('#selectorigin option')
	all_loc = []

	for item in data:
		name = item.text
		loc = "";
		category = "";
		print(item.text)
		x=json.dumps(item.attrs)
		if x != "{}":
			y=json.loads(x)
			loc = y['value']
		if ("Lot" in name or "Zone" in name) and "Zone Elevator" not in name:
			category = "parking"
		if "Water Bottle Refill Station" in name:
			category = "WaterBottleRefillStation"
			continue
		if "Elevator" in name:
			category = "Elevator"
			continue
		if "Residence" in name:
			category = "Residence"
		if "Gym" in name:
			category = "Gym"

		loc_array = loc.split(",")
		this_loc = {"name":name,
					"loc":loc,
					"category":category,
					"googlemaps":"https://www.google.com/maps/search/?api=1&query="+loc_array[0]+"%2C"+loc_array[1]+""}
		all_loc.append(this_loc)
	print(all_loc);
	print("> Saving Data to files...")
	json_temp = json.dumps(all_loc)
	f = codecs.open(os.path.join(sys.path[0], "all_loc.json"),'w','utf-8')
	f.write(json_temp)
	f.close()

if __name__ == "__main__":
	main()