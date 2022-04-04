import requests
from bs4 import BeautifulSoup

url = "http://whereis.yourbus.com/bustime/api/v3/getroutes?key=n3YEcYp545e55YhAVG65m9CKZ"

doc = requests.get(url)

print(doc.text)
