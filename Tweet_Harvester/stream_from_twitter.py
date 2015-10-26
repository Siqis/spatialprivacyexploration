#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import httplib as HC
import json

#Variables that contains the user credentials to access Twitter API 
access_token = ""
access_token_secret = ""
consumer_key = ""
consumer_secret = ""



#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):
    

	def on_data(self, data):
	# print data
		
		header = {"Content-Type":"application/json"}
		jdata = json.loads(data)
		if(jdata["coordinates"]!=None):
			to_send = {}
			jdata["_id"]=jdata['id_str']
			jdata["content_type"]="Tweet"
			#print jdata
			to_send["_id"]=jdata["id_str"]
			to_send["text"]=jdata["text"]
			to_send["coordinates"] = [0,0]
			to_send["coordinates"][0]=jdata["geo"]["coordinates"][0]
			to_send["coordinates"][1]=jdata["geo"]["coordinates"][1]
			to_send["created_at"]=jdata["created_at"]
			to_send["user"]={}
			to_send["user"]["id"]=jdata["user"]["id"]
			to_send["user"]["name"]=jdata["user"]["name"]
			print type(to_send)
			payload = json.dumps(to_send)
		
			couchCONN = HC.HTTPConnection('')
			couchCONN.connect()
			couchCONN.request('POST','/',payload,header)
			resStr = couchCONN.getresponse().read().decode("utf-8")
			print resStr
			couchCONN.close()

	def on_error(self, status):
		print "error encounted"
		print status

if __name__ == '__main__':
	l = StdOutListener()
	auth = OAuthHandler(consumer_key, consumer_secret)
	auth.set_access_token(access_token, access_token_secret)
	stream = Stream(auth, l)
	stream.filter(locations=[144.938828,-37.821879,145.00805,-37.804995])#This one works!
