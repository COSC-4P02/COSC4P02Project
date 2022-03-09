import xlrd # xlrd==1.2.0
import codecs
import os
import sys
import json
from datetime import datetime

# Generate Json file based on Excel Worksheet
# Modified From KRUNK.CN 2019 Lottery Project

file = 'brock-data.xlsx'
optfile = 'brock-data.json'

def main():

	data_array_final = {"course":[],
						"program":[],
						"time":str(datetime.now())}

	wb = xlrd.open_workbook(filename=os.path.join(sys.path[0], file))
	sheet1 = wb.sheet_by_index(0)
	sheet2 = wb.sheet_by_index(1)

	data1 = sheet1.col_values(0)
	data2 = sheet1.col_values(1)
	data3 = sheet1.col_values(2)
	data4 = sheet1.col_values(3)
	data5 = sheet1.col_values(4)
	data6 = sheet1.col_values(5)
	data7 = sheet1.col_values(6)
	data8 = sheet1.col_values(7)
	data9 = sheet1.col_values(8)
	data10 = sheet1.col_values(9)
	data11 = sheet1.col_values(10)
	data12 = sheet1.col_values(11)
	data13 = sheet1.col_values(12)
	data14 = sheet1.col_values(13)
	data15 = sheet1.col_values(13)
	data16 = sheet1.col_values(15)
	data17 = sheet1.col_values(16)
	data18 = sheet1.col_values(17)
	data19 = sheet1.col_values(18)

	for i in range(1,len(data1)):
		data_array = {
		  data1[0].lower(): data1[i],
		  data2[0].lower(): data2[i],
		  data3[0].lower(): data3[i],
		  data4[0].lower(): data4[i],
		  data5[0].lower(): data5[i],
		  data6[0].lower(): data6[i],
		  data7[0].lower(): data7[i],
		  data8[0].lower(): data8[i],
		  data9[0].lower(): data9[i],
		  data10[0].lower(): data10[i],
		  data11[0].lower(): data11[i],
		  data12[0].lower(): data12[i],
		  data13[0].lower(): data13[i],
		  data14[0].lower(): data14[i],
		  data15[0].lower(): data15[i],
		  data16[0].lower(): data16[i],
		  data17[0].lower(): data17[i],
		  data18[0].lower(): data18[i],
		  data19[0].lower(): data19[i]
		}
		data_array_final['course'].append(data_array)

	data2_1 = sheet2.col_values(0)
	data2_2 = sheet2.col_values(1)
	data2_3 = sheet2.col_values(2)
	data2_4 = sheet2.col_values(3)

	for i in range(1,len(data2_1)):
		data_array = {
		  data2_1[0].lower(): data2_1[i],
		  data2_2[0].lower(): data2_2[i],
		  data2_3[0].lower(): data2_3[i],
		  data2_4[0].lower(): data2_4[i]
		}
		data_array_final['program'].append(data_array)

	data_array_final_json = json.dumps(data_array_final)
	
	f = codecs.open(os.path.join(sys.path[0], optfile),'w','utf-8')
	f.write(data_array_final_json)
	f.close()

	print("Json Generated Successfully - "+optfile)
    
main()
