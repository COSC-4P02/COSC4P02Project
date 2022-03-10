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
#import pandas as pd

# 木有写完
# 未完待续
# 下次一定
# 保佑无Bug
# Krunk写的Bug

# Config
brock_session = ["fw", "sp", "su"]
brock_current_session = "fw".lower()
brock_type = ["ug"]

# Testing Config
fake_program = [{'program': 'COSC', 'session': 'FW', 'type': 'UG', 'level': 'All'}]

# Course Table Api
def request_brock_api(payload):
	url = 'https://brocku.ca/guides-and-timetables/wp-content/plugins/brocku-plugin-course-tables/ajax.php'
	headers = {'content-type': 'application/x-www-form-urlencoded', 'Accept-Charset': 'UTF-8'}
	r = requests.post(url, data=payload, headers=headers, verify=False)
	return r.text

# Get Program Code by parma
def get_programs(brock_session,brock_type):
	program = []
	payload = "action=get_programs_dropdown&session="+brock_session+"&type="+brock_type+"&level=all"
	program_raw = request_brock_api(payload)
	bs_table=BeautifulSoup(program_raw, features="html.parser")
	rows = bs_table.find_all('option')
	for row in rows:
		#print(row.name, row.attrs)
		x=json.dumps(row.attrs)
		if x != "{}":
		    y=json.loads(x)
		    this_program = {
		    	'program':y['data-program'],
		    	'session':y['data-session'],
		    	'type':y['data-type'],
		    	'level':y['data-level']
		    }
		    program.append(this_program)
		    #print (y['data-program'])

	return program

# Get all course codes by session and type
def get_all_program_codes(brock_session,brock_type):
	all_programs = []
	for session in brock_session:
		for btype in brock_type:
			returned_program = get_programs(session,btype)
			all_programs=all_programs+returned_program
	return all_programs

# Get course by program list
def get_courses(all_programs):
	all_courses=[]
	all_labs=[]
	all_sem=[]

	all_courses_temp=[]
	all_labs_temp=[]
	all_sem_temp=[]

	for program in all_programs:
		payload = "action=get_programcourses&session="+program["session"]+"&type="+program["type"]+"&level=all&program="+program["program"]+"&onlineonly="
		program_raw = request_brock_api(payload)
		soup=BeautifulSoup(program_raw, features="html.parser")
		for row in soup.select('tbody tr.course-row'):
			#print(row)
			#print(row.attrs)
			x=json.dumps(row.attrs)
			if x != "{}":
				y=json.loads(x)
				this_program = {
					'title':y['data-cc'],
					'session':[y['data-session']],
					'type':[y['data-class_type']],
					'year':[y['data-year']],
					'section':[y['data-course_section']],
					'location':[(y['data-location']+" "+y['data-location_desc']+" "+y['data-room2']).strip()],
					'professor':y['data-instructor'],
					'department':y['data-faculty_desc'],
					'duration':str(datetime.fromtimestamp(int(y['data-startdate'])))[:10]
					+" to "+str(datetime.fromtimestamp(int(y['data-enddate'])))[:10],
					'lab/tut':[],
					'sem':[]
				}
				#print(this_program)
				if "LAB" in y['data-class_type'] or "TUT" in y['data-class_type']: # Labs
					all_labs_temp.append(this_program)
				elif "SEM" in y['data-class_type']: # Sem
					all_sem_temp.append(this_program)
				else: # LEC PRO SYN ...
					all_courses_temp.append(this_program)
		all_courses=all_courses+all_courses_temp
		all_labs=all_labs+all_labs_temp
		all_sem=all_sem+all_sem_temp
	return all_courses, all_labs, all_sem

# Combine all data
def processing_data(all_courses, all_labs, all_sem):
	precessing_course = {}
	for course in all_courses:
		title_new = (course['title'][:4] + '-' + course['title'][4:]).lower()
		this_course = course.copy()
		this_course.pop('title', None)
		if title_new not in precessing_course: # First one
			if (course['session'][0].lower()!=brock_current_session):
				this_course['location']=[]
			precessing_course[title_new]=this_course
		else: # Merge
			if (course['session'][0] not in precessing_course[title_new]['session']):
				precessing_course[title_new]['session'].append(course['session'][0])
			if (course['type'][0] not in precessing_course[title_new]['type']):
				precessing_course[title_new]['type'].append(course['type'][0])
			if (course['year'][0] not in precessing_course[title_new]['year']):
				precessing_course[title_new]['year'].append(course['year'][0])
			if (course['section'][0] not in precessing_course[title_new]['section']):
				precessing_course[title_new]['section'].append(course['section'][0])
			if (course['location'][0] not in precessing_course[title_new]['location'] and course['session'][0].lower()==brock_current_session):
				precessing_course[title_new]['location'].append(course['location'][0])
	#for lab in all_labs:
	#print(all_labs)
	# 此处 lab tut sem数据还没有处理

	return precessing_course

def main():
	print("> Fetching Programs...")
	all_programs = get_all_program_codes(brock_session,brock_type);
	#all_programs = fake_program #测试用
	print("  Programs: "+str(len(all_programs)))
	print()

	print("> Fetching Courses...")
	all_courses, all_labs, all_sem = get_courses(all_programs)
	print("  all_courses: "+str(len(all_courses)))
	print("  all_labs: "+str(len(all_labs)))
	print("  all_sem: "+str(len(all_sem)))
	print()

	print("> Processing Data...")
	final_data = processing_data(all_courses, all_labs, all_sem)

	#print(precessing_course)
	print("  Programs: "+str(len(final_data)))
	print()

	print("> Saving All Data to files...")
	json_temp = json.dumps(final_data)
	f = codecs.open(os.path.join(sys.path[0], "final_data.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	print("> Completed")

if __name__ == "__main__":
	main()



# 笔记

# all_courses_pd = pd.DataFrame(all_courses)
# all_courses_json = DataFrame.to_json(orient = "records")

# curl 'https://brocku.ca/guides-and-timetables/wp-content/plugins/brocku-plugin-course-tables/ajax.php' \
# -X POST \
# -H 'Host: brocku.ca' \
# -H 'Accept: */*' \
# -H 'X-Requested-With: XMLHttpRequest' \
# -H 'Accept-Language: zh-CN,zh-Hans;q=0.9' \
# -H 'Origin: https://brocku.ca' \
# -H 'Referer: https://brocku.ca/guides-and-timetables/timetables/?session=fw&type=ug&level=all' \
# -H 'Connection: close' \
# -H 'Content-Length: 57' \
# -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15' \
# -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
# --cookie '' \
# -d 'action=get_programs_dropdown&session=fw&type=ug&level=all'

# session=fw|sp|su

# 课程列表
# action=get_programs_dropdown&session=fw&type=ug&level=all

# 课程ABTE
# action=get_programcourses&session=FW&type=UG&level=All&program=ABTE&onlineonly=


