import httplib as HC
import urllib2
import json
import sys
import re
import operator

print "begin"
header = {"Content-Type":"application/json"}
view = sys.argv[1]
print view

payload = {}
jpayloadstr = json.dumps(payload)

ecCONN = HC.HTTPConnection('115.146.92.225:5984')
ecCONN.connect()
ecCONN.request('GET','/geocouch_mel/_design/'+view+'/_view/by_text?group=true',jpayloadstr,header)
resStr = ecCONN.getresponse().read().decode("utf-8")
strs = resStr.encode("utf-8")
jstrs = json.loads(strs)


rows = jstrs["rows"]
#print len(rows)
result = {}

stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours','yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers','herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves','what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are','was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does','did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until','while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into','through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down','in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here','there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more','most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so','than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'amp', 'good', 'bad']
attributes = [["afl",0],["football",0],["footy",0],["league",0],["cricket",0],["fitness",0],["basketball",0],["workout",0],["bedroom",0],["lease",0],["noise",0],["bed",0],["door",0],["kitchen",0],["network",0],["internet",0],["apec",0],["conference",0],["contract",0],["convention",0],["acel",0],["gcap",0],["talk",0],["speak",0],["session",0],["finals",0],["final",0],["assignment",0],["project",0],["study",0],["lab",0],["tutorial",0],["subject",0],["due",0],["exam",0],["shopping",0],["shop",0],["cheap",0],["club",0],["food",0],["game",0],["fun",0],["night",0],["drunk",0]]
i=0
for row in rows:
  i+=1
  row_key = re.sub(r'\W+','',row["key"].lower())
  row_value = row["value"]
  if((row_key in stopwords) or (row_key == '')):
    continue
  for attr in attributes:
    if row_key in attr:
      attr[1]=row_value
      continue

print attributes


#l = jstrs["hits"]["hits"]
f = open("mydevelset.arff","w+")
f.write("@RELATION location_privacy\n@ATTRIBUTE afl NUMERIC\n@ATTRIBUTE football NUMERIC\n@ATTRIBUTE footy NUMERIC\n@ATTRIBUTE league NUMERIC\n@ATTRIBUTE cricket NUMERIC\n@ATTRIBUTE fitness NUMERIC\n@ATTRIBUTE basketball NUMERIC\n@ATTRIBUTE workout NUMERIC\n@ATTRIBUTE bedroom NUMERIC\n@ATTRIBUTE lease NUMERIC\n@ATTRIBUTE noise NUMERIC\n@ATTRIBUTE bed NUMERIC\n@ATTRIBUTE door NUMERIC\n@ATTRIBUTE kitchen NUMERIC\n@ATTRIBUTE network NUMERIC\n@ATTRIBUTE internet NUMERIC\n@ATTRIBUTE apec NUMERIC\n@ATTRIBUTE conference NUMERIC\n@ATTRIBUTE contract NUMERIC\n@ATTRIBUTE convention NUMERIC\n@ATTRIBUTE acel NUMERIC\n@ATTRIBUTE gcap NUMERIC\n@ATTRIBUTE talk NUMERIC\n@ATTRIBUTE speak NUMERIC\n@ATTRIBUTE session NUMERIC\n@ATTRIBUTE finals NUMERIC\n@ATTRIBUTE final NUMERIC\n@ATTRIBUTE assignment NUMERIC\n@ATTRIBUTE project NUMERIC\n@ATTRIBUTE study NUMERIC\n@ATTRIBUTE lab NUMERIC\n@ATTRIBUTE tutorial NUMERIC\n@ATTRIBUTE subject NUMERIC\n@ATTRIBUTE due NUMERIC\n@ATTRIBUTE exam NUMERIC\n@ATTRIBUTE shopping NUMERIC\n@ATTRIBUTE shop NUMERIC\n@ATTRIBUTE cheap NUMERIC\n@ATTRIBUTE club NUMERIC\n@ATTRIBUTE food NUMERIC\n@ATTRIBUTE game NUMERIC\n@ATTRIBUTE fun NUMERIC\n@ATTRIBUTE night NUMERIC\n@ATTRIBUTE drunk NUMERIC\n@ATTRIBUTE usage {Sports,Business,Study,Entertainment,Apartment}\n@DATA\n")
for attr in attributes:
  f.write(str(attr[1]))
  f.write(",")
f.write("?\n")
f.close()
#couchCONN.close()
