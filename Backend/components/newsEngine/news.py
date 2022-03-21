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
    path = os.path.dirname(os.path.realpath(__file__)).replace("components/newsEngine","data/nltk")
elif platform == "darwin":
    path = os.path.dirname(os.path.realpath(__file__)).replace("components/newsEngine","data/nltk")
elif platform == "win32":
    path = os.path.dirname(os.path.realpath(__file__)).replace("components\\newsEngine","data\\nltk")

nltk.data.path.append(path)

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.reset()
        self.strict = False
        self.convert_charrefs= True
        self.text = StringIO()
    def handle_data(self, d):
        self.text.write(d)
    def get_data(self):
        return self.text.getvalue()

def get_news(url):
    print("Fetching news: "+url)
    retry = 0
    while retry < 10:
        try:
            r = requests.get(url=url)
            if r.status_code != 500:
                news = json.loads(r.text)
                break
            else:
                retry = retry + 1
                print("Fetching Error: " + r.status_code)
                time.sleep(1)
        except:
            retry = retry + 1
            print("Fetching Error: " + url)
            time.sleep(2)
    if (retry >= 10):
        print("ERR:Fetch Error")
        exit(0)
    all_news = "";
    print("Fetched news: "+news['title'])
    all_news = all_news + news['title']
    for n in news['items']:
        s = MLStripper()
        s.feed(n['content'])
        all_news = all_news + n['title'] + "\n\n" + s.get_data() + "\n" + n['link'] + "\n\n\n\n\n\n"
    return all_news

def get_news_all(url):
    print("Fetching news: "+url)
    retry = 0
    while retry < 10:
        try:
            r = requests.get(url=url)
            if r.status_code != 500:
                news = json.loads(r.text)
                break
            else:
                retry = retry + 1
                print("Fetching Error: " + r.status_code)
                time.sleep(1)
        except:
            retry = retry + 1
            print("Fetching Error: " + url)
            time.sleep(2)
    if (retry >= 10):
        print("ERR:Fetch Error")
        exit(0)
    all_news = "";
    print("Fetched news")
    for n in news:
        all_news = all_news + n['title'] + "\n" + n['href'] + "\n"
    return all_news

def nltk_download(name,find):
    try:
        print(nltk.data.find(find))
    except LookupError:
        nltk.download(name, download_dir = path)

def lemtokens(tokens):
    global lemmer
    return[lemmer.lemmatize(token) for token in tokens]
remove_puct_dict=dict((ord(punct),None) for punct in string.punctuation)
def lemnormalize(text):
    return lemtokens(nltk.word_tokenize(text.lower().translate(remove_puct_dict)))
        
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

#generating responce
def response(user_response,sent_tokens):
    robo_response=''
    tfidfvec=TfidfVectorizer(tokenizer=lemnormalize,stop_words='english')
    tfidf=tfidfvec.fit_transform(sent_tokens)
    vals=cosine_similarity(tfidf[-1],tfidf)
    idx=vals.argsort()[0][-2]
    flat=vals.flatten()
    flat.sort()
    req_tfidf=flat[-2]
    if(req_tfidf==0):
        robo_response=robo_response+"NLTK_NOTFOUND"
        return robo_response
    else:
        #print(req_tfidf)
        robo_response=robo_response+sent_tokens[idx]
        return robo_response

lemmer=nltk.stem.WordNetLemmatizer()

def main():
    global lemmer
    nltk_download('punkt','tokenizers/punkt')
    nltk_download('wordnet','corpora/wordnet')
    nltk_download('omw-1.4','corpora/omw-1.4')
    raw = get_news('http://localhost:3000/data/brock/news')
    raw2 = get_news_all('http://localhost:3000/data/brock/news/all/cache')

    raw = raw + "\n\n" + raw2

    sent_tokens=nltk.sent_tokenize(raw)
    word_tokens=nltk.word_tokenize(raw)
    sent_tokens[:2]
    word_tokens[:10]
    
    print("BOT:Ready")
    while (True):
        try:
            user_response=input()
            user_response=user_response.lower()
            if(user_response!='NLTK_EXIT'.lower()):
                sent_tokens.append(user_response)
                word_tokens=word_tokens+nltk.word_tokenize(user_response)
                final_words=list(set(word_tokens))
                print("BOT:",end="")
                print(response(user_response,sent_tokens))
                sent_tokens.remove(user_response)
                print()
            else:
                exit(0)
        except EOFError:
            print("EOF")
            continue

if __name__ == "__main__":
    main()
