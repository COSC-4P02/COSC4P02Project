
import urllib.request
import requests
import re
from bs4 import BeautifulSoup
import csv


content = '''
<div class="value">
<p class="name">Michael Jordan</p>
</div>

<div class="value">
<p class="team">Real Madrid</p>
</div>

<div class="value">
<p class="Sport">Ping Pong</p>
<p class="Sport">ccing Pong</p>
</div>
'''

from bs4 import BeautifulSoup

soup = BeautifulSoup(content,"html.parser")

person = {}

for div in soup.findAll('div', {'class': 'value'}):
    person[div.find('p').attrs['class'][0]] = div.text.strip()

print(person)