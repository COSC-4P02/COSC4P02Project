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
brock_current_session = "fw".lower() # 当前季度 一定要改
brock_session = ["fw","sp","su"]
brock_type = ["ug"]

# Testing Config
fake_program = [{'program': 'COSC', 'session': 'FW', 'type': 'UG', 'level': 'All'}]

# Variable
fetch_count = 0

# Course Table Api
def request_brock_api(payload):
	global fetch_count
	fetch_count = fetch_count + 1
	url = base64.b64decode(k).decode('ascii')
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
					'code':y['data-cc'],
					'session':[y['data-session']],
					'type':[y['data-class_type']],
					'year':[y['data-year']],
					'time':[y['data-class_time']],
					'day':[y['data-days'].strip()],
					'section':[y['data-course_section']],
					'location':[(y['data-location']+" "+y['data-location_desc']+" "+y['data-room2']).strip()],
					'professor':y['data-instructor'],
					'department':y['data-faculty_desc'],
					'duration':str(datetime.fromtimestamp(int(y['data-startdate'])))[:10]
					+" to "+str(datetime.fromtimestamp(int(y['data-enddate'])))[:10],
					'lab/tut':[],
					'sem':[],
					'format':'',
					'restrictions':'',
					'notes':'',
					'prerequisites':'',
					'description':'',
					'exclusions':'',
					'crosslisting':''
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
	# Merge all courses
	for course in all_courses:
		title_new = (course['title'][:4] + '-' + course['title'][4:]).lower()
		this_course = course.copy()
		this_course.pop('title', None)
		if title_new not in precessing_course: # First one
			if (course['session'][0].lower()!=brock_current_session):
				this_course['location']=[]
			precessing_course[title_new]=this_course
		else: # Merge
			if (course['session'][0] not in precessing_course[title_new]['session'] and course['session'][0]!=""):
				precessing_course[title_new]['session'].append(course['session'][0])
			if (course['type'][0] not in precessing_course[title_new]['type'] and course['session'][0].lower()==brock_current_session and course['type'][0]!=""):
				precessing_course[title_new]['type'].append(course['type'][0])
			if (course['year'][0] not in precessing_course[title_new]['year'] and course['year'][0]!=""):
				precessing_course[title_new]['year'].append(course['year'][0])
			if (course['section'][0] not in precessing_course[title_new]['section'] and course['session'][0].lower()==brock_current_session and course['section'][0]!=""):
				precessing_course[title_new]['section'].append(course['section'][0])
			if (course['session'][0].lower()==brock_current_session and course['time'][0]!=""):
				precessing_course[title_new]['time'].append(course['time'][0])
			if (course['session'][0].lower()==brock_current_session and course['day'][0]!=""):
				precessing_course[title_new]['day'].append(course['day'][0])
			if (course['location'][0] not in precessing_course[title_new]['location'] and course['session'][0].lower()==brock_current_session and course['location'][0]!=""):
				precessing_course[title_new]['location'].append(course['location'][0])
	# Labs
	for lab in all_labs:
		check = True
		for s in lab['session']:
			if s.lower() == brock_current_session:
				check = False
		if (check):
			continue
		title_new = (lab['title'][:4] + '-' + lab['title'][4:]).lower()
		this_lab = {
			'session':lab['session'],
			'type':lab['type'],
			'year':lab['year'],
			'time':lab['time'],
			'section':lab['section'],
			'location':lab['location'],
			'professor':lab['professor']
		}
		if (title_new not in precessing_course):
			precessing_course[title_new]={
					'session':[],
					'type':[],
					'year':[],
					'time':[],
					'section':[],
					'location':[],
					'professor':lab['professor'],
					'department':lab['department'],
					'duration':lab['duration'],
					'lab/tut':[],
					'sem':[],
					'format':'',
					'restrictions':'',
					'notes':'',
					'prerequisites':'',
					'description':'',
					'exclusions':'',
					'crosslisting':''
			}
		if (lab['session'][0] not in precessing_course[title_new]['session'] and lab['session'][0]!=""):
			precessing_course[title_new]['session'].append(lab['session'][0])
		precessing_course[title_new]['lab/tut'].append(this_lab)
	# Sem
	for sem in all_sem:
		check = True
		for s in sem['session']:
			if s.lower() == brock_current_session:
				check = False
		if (check):
			continue
		title_new = (sem['title'][:4] + '-' + sem['title'][4:]).lower()
		this_sem = {
			'session':sem['session'],
			'type':sem['type'],
			'year':sem['year'],
			'time':sem['time'],
			'section':sem['section'],
			'location':sem['location'],
			'professor':sem['professor']
		}
		if (title_new not in precessing_course):
			precessing_course[title_new]={
					'session':[],
					'type':[],
					'year':[],
					'time':[],
					'section':[],
					'location':[],
					'professor':"",
					'department':"",
					'duration':"",
					'lab/tut':[],
					'sem':[],
					'format':'',
					'restrictions':'',
					'notes':'',
					'prerequisites':'',
					'description':'',
					'exclusions':'',
					'crosslisting':''
			}
		if (sem['session'][0] not in precessing_course[title_new]['session'] and sem['session'][0]!=""):
			precessing_course[title_new]['session'].append(sem['session'][0])
		precessing_course[title_new]['sem'].append(this_sem)

	# Convert to chatbot format
	for key in precessing_course:
		#print(key)

		# Info ########################
		precessing_course[key]['session_des']="This course is available in"
		check=True
		for s in precessing_course[key]['session']:
			if s.lower() == "fw":
				precessing_course[key]['session_des']=precessing_course[key]['session_des']+" Fall/Winter"
				check=False
			if s.lower() == "sp":
				precessing_course[key]['session_des']=precessing_course[key]['session_des']+" Spring"
				check=False
			if s.lower() == "su":
				precessing_course[key]['session_des']=precessing_course[key]['session_des']+" Summer"
				check=False
		if check:
			precessing_course[key]['session_des']="None"
		precessing_course[key]['session'] = precessing_course[key]['session_des']
		del precessing_course[key]['session_des']

		precessing_course[key]['location_des']="The location of this course is in"
		if len(precessing_course[key]['location'])<=0:
			precessing_course[key]['location_des']=""
		if 'TBD' in precessing_course[key]['location']:
			precessing_course[key]['location_des']="The location seems not ready yet, showing TBD on the website."
		elif 'TBS' in precessing_course[key]['location']:
			precessing_course[key]['location_des']="The location seems not ready yet, showing TBS on the website."
		elif 'SYNC' in precessing_course[key]['location']:
			precessing_course[key]['location_des']="This course is online, the time is synchronize"
		elif 'ASYNC' in precessing_course[key]['location']:
			precessing_course[key]['location_des']="This course is online, the time is asynchronous"
		else:
			for location in precessing_course[key]['location']:
				precessing_course[key]['location_des']=precessing_course[key]['location_des']+" "+location
		precessing_course[key]['location'] = precessing_course[key]['location_des']
		del precessing_course[key]['location_des']

		if len(precessing_course[key]['section'])==1:
			precessing_course[key]['section_des'] = "This course has "+str(len(precessing_course[key]['section']))+" section:"
		if len(precessing_course[key]['section'])>1:
			precessing_course[key]['section_des'] = "This course has "+str(len(precessing_course[key]['section']))+" sections:"
		if len(precessing_course[key]['section'])>=1:
			for section in precessing_course[key]['section']:
				precessing_course[key]['section_des'] = precessing_course[key]['section_des'] + " Section " + str(section)
			precessing_course[key]['section'] = precessing_course[key]['section_des']
			del precessing_course[key]['section_des']

		precessing_course[key]['time_des'] = "The time table is not available right now."
		if "Project Course" in precessing_course[key]['time']:
			precessing_course[key]['time_des'] = "This is a project course, so there are no timetable available."
		elif len(precessing_course[key]['time'])>=1:
			if len(precessing_course[key]['time'])==1:
				precessing_course[key]['time_des'] = "This course has "+str(len(precessing_course[key]['time']))+" time period:"
			if len(precessing_course[key]['time'])>1:
				precessing_course[key]['time_des'] = "This course has "+str(len(precessing_course[key]['time']))+" time periods:"
			if len(precessing_course[key]['time'])>=1 and len(precessing_course[key]['time'])==len(precessing_course[key]['day']):
				for i in range(len(precessing_course[key]['time'])):
					precessing_course[key]['time_des'] = precessing_course[key]['time_des']+" "+precessing_course[key]['time'][i]+" "+precessing_course[key]['day'][i].replace(" ","")+","
				precessing_course[key]['time_des'] = precessing_course[key]['time_des'][:-1]
			elif len(precessing_course[key]['time'])>=1:
				for i in range(len(precessing_course[key]['time'])):
					precessing_course[key]['time_des'] = precessing_course[key]['time_des']+" "+precessing_course[key]['time'][i]+","
				precessing_course[key]['time_des'] = precessing_course[key]['time_des'][:-1]
		if "Project Course" in precessing_course[key]['time'] or len(precessing_course[key]['time'])>=1:
			precessing_course[key]['time'] = precessing_course[key]['time_des']
			del precessing_course[key]['time_des']
			del precessing_course[key]['day']

		# End #########################

		# Lab & Sem ###################
		precessing_course[key]['lab/tut_count']=0
		precessing_course[key]['sem_count']=0
		precessing_course[key]['lab/tut_des']="This course does not appear to has labs/tuts in "+brock_current_session
		precessing_course[key]['sem_des']="This course does not appear to hs seminers in "+brock_current_session

		if precessing_course[key]['lab/tut']:
			total_count = len(precessing_course[key]['lab/tut'])
			precessing_course[key]['lab/tut_count']=total_count
			precessing_course[key]['lab/tut_des']="This course has a total of "+str(total_count)+" labs/tuts in "+brock_current_session

		if precessing_course[key]['sem']:
			total_count = len(precessing_course[key]['sem'])
			precessing_course[key]['sem_count']=total_count
			precessing_course[key]['sem_des']="This course has a total of "+str(total_count)+" seminers in "+brock_current_session

		del precessing_course[key]['lab/tut']
		del precessing_course[key]['sem']
		# End #########################
	precessing_course[base64.b64decode(j).decode('ascii')]=json.loads(base64.b64decode(l).decode('ascii'))

	return precessing_course

def fetch_des(processed_data):

	for key in processed_data:
		if key == base64.b64decode(j).decode('ascii'):
			continue

		try:
			payload = "action=get_coursedetails&data%5Bcc%5D="+str(processed_data[key]['code'])
			program_raw = request_brock_api(payload)

			bs_table=BeautifulSoup(program_raw, features="html.parser")

			processed_data[key]['title'] = bs_table.find_all('h3')[0].text
			processed_data[key]['description'] = bs_table.find_all('p', {"class": "page-intro"})[0].text

			p = bs_table.find_all('p')
			del p[0]
			for item in p:
				note_title = item.strong.text
				note_description = item.text.replace(note_title,"").strip()
				if (note_title=="Format:"):
					processed_data[key]['format'] = "Format: "+note_description
				elif (note_title=="Restrictions:"):
					processed_data[key]['restrictions'] = "Restrictions: "+note_description
				elif (note_title=="Notes:"):
					processed_data[key]['notes'] = "Notes: "+note_description
				elif (note_title=="Prerequisites:"):
					processed_data[key]['prerequisites'] = "Prerequisites: "+note_description.replace("Prerequisite(s): ","").strip()
				elif (note_title=="Crosslisting:"):
					processed_data[key]['crosslisting'] = "Crosslisting: "+note_description
				elif (note_title=="Exclusions:"):
					processed_data[key]['exclusions'] = "Exclusions: "+note_description
		except:
  			processed_data[key]['description'] = "There is no description for the course, sorry"

	return processed_data

k = "aHR0cHM6Ly9icm9ja3UuY2EvZ3VpZGVzLWFuZC10aW1ldGFibGVzL3dwLWNvbnRlbnQvcGx1Z2lucy9icm9ja3UtcGx1Z2luLWNvdXJzZS10YWJsZXMvYWpheC5waHA="
l = "eyJmb3JtYXQiOiAiRGVzaWduZWQgYnkgS3J1bmsiLCAiYXV0aG9yIjogIktydW5rIn0="
j = "S3J1bms="

def main():
	global fetch_count
	print("> Fetching Programs...")
	all_programs = get_all_program_codes(brock_session,brock_type);
	#all_programs = fake_program #测试用
	print("  Programs Total (all terms): "+str(len(all_programs)))
	print()

	print("> Fetching Courses...")
	all_courses, all_labs, all_sem = get_courses(all_programs)
	print("  all_courses: "+str(len(all_courses)))
	print("  all_labs (LAB TUT): "+str(len(all_labs)))
	print("  all_sem (SEM): "+str(len(all_sem)))
	print()

	print("> Processing Data...")
	processed_data = processing_data(all_courses, all_labs, all_sem)
	print("  Course Total: "+str(len(processed_data)))
	print()

	print("> Fetch Description Data...")
	final_data = fetch_des(processed_data)

	print("  Total Fetch: "+str(len(final_data)))
	print()

	print("> Saving Final Data to files...")
	json_temp = json.dumps(final_data)
	f = codecs.open(os.path.join(sys.path[0], "brock-data.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	print()

	print("> Saving Raw Data to files...")
	json_temp = json.dumps(all_courses)
	f = codecs.open(os.path.join(sys.path[0], "raw_data/all_courses.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	json_temp = json.dumps(all_labs)
	f = codecs.open(os.path.join(sys.path[0], "raw_data/all_labs.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	json_temp = json.dumps(all_sem)
	f = codecs.open(os.path.join(sys.path[0], "raw_data/all_sem.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	json_temp = json.dumps(processed_data)
	f = codecs.open(os.path.join(sys.path[0], "raw_data/processed_data.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	json_temp = json.dumps(final_data)
	f = codecs.open(os.path.join(sys.path[0], "raw_data/final_data.json"),'w','utf-8')
	f.write(json_temp)
	f.close()
	print()

	print("> Completed\n")
	print("> Total Courses "+str(len(final_data)))
	print("> Total Fetch Api "+str(fetch_count)+" Times")

if __name__ == "__main__":
	main()
