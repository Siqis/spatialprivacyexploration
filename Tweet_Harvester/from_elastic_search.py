import httplib as HC
import json
import sys

ipadd = sys.argv[1]
db = sys.argv[2]
if(len(sys.argv)！=3)
{
	print "usage: python from_elastic_search.py <ip address> <database name>"
	sys.exit(0)
}
header = {"Content-Type":"application/json"}
payload = {
    "fields": [
        "doc.text",
        "doc.place.name",
        "doc.geo.coordinates",
        "doc.created_at",
        "doc.user.id",
        "doc.user.name"
    ],
    "query": {
        "filtered": {
            "filter": {
                "and": [
                    {
                        "fquery": {
                            "query": {
                                "query_string": {
                                    "query": "doc.place.name:\"Melbourne\""
                                }
                            }
                        }
                    },
                    {
                        "term": {
                            "doc.user.geo_enabled": "true"
                        }
                    },
                    {
                        "exists": {
                            "field": "doc.geo.coordinates"
                        }
                    },
                    {
                        "range": {
                            "doc.geo.coordinates": {
                                "gt": 0
                            }
                        }
                    }
                ]
            }
        }
    },
    "from": 0,
    "size": 10
}

for i in range(0,900):
  fm = 20000 + 1000*i
  vfrom = fm
  vsize = 1000


  payload["from"] = vfrom
  payload["size"] = vsize

  print vfrom
  print vsize

  jpayloadstr = json.dumps(payload)

  ecCONN = HC.HTTPConnection('130.56.248.244')
  ecCONN.connect()
  ecCONN.request('GET','/es/_all/_search',jpayloadstr,header)
  resStr = ecCONN.getresponse().read().decode("utf-8")
  strs = resStr.encode("utf-8")
  print strs
  jstrs = json.loads(strs)
  #print jstrs

  #l = jstrs["hits"]["hits"]
  l = jstrs["hits"]["hits"]

  for line in l:
    fields = line["fields"]
    text = fields["doc.text"]
    coordinates = fields["doc.geo.coordinates"]
    created_at = fields["doc.created_at"]
    user_name = fields["doc.user.name"]
    user_id = fields["doc.user.id"]

    jp = {}
    jp["text"] = text[0]
    jp["coordinates"] = coordinates
    jp["created_at"] = created_at[0]
    jp["user"] ={}
    jp["user"]["id"] = user_id[0]
    jp["user"]["name"] = user_name[0]

    jps = json.dumps(jp)
    print jps
    couchCONN = HC.HTTPConnection(ipadd)
    couchCONN.connect()
    couchCONN.request('POST','/'+db,jps,header) #twitter_area2
    resStr = couchCONN.getresponse().read().decode("utf-8")
    print vfrom
    print resStr
    couchCONN.close()

  ecCONN.close()

print "done"
