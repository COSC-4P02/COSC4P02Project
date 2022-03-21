import nltk
import string
import requests
import json
from io import StringIO
from html.parser import HTMLParser
import os
import time
from sys import platform

path = ""
if platform == "linux" or platform == "linux2":
    path = os.path.dirname(os.path.realpath(__file__)).replace("test","data/nltk")
elif platform == "darwin":
    path = os.path.dirname(os.path.realpath(__file__)).replace("test","data/nltk")
elif platform == "win32":
    path = os.path.dirname(os.path.realpath(__file__)).replace("test","data\\nltk")

nltk.data.path.append(path)

def nltk_download(name,find):
    try:
        print(nltk.data.find(find))
    except LookupError:
        nltk.download(name, download_dir = path)

def main():
	nltk_download('punkt','tokenizers/punkt')
	nltk_download('wordnet','corpora/wordnet')
	nltk_download('omw-1.4','corpora/omw-1.4')
	print("Ready")

if __name__ == "__main__":
	main()