querythedb = function(qstring,topics)
{
    var resultPlace = document.getElementById("topics")
    var topicPlace = document.getElementById("topics")
    var usrPlace = document.getElementById("usrs")
    //var chartPlace = document.getElementById("tcharts")
    var pouchDB = new PouchDB(server)
    console.log(qstring)
    pouchDB.query(qstring,{reduce: true, group: true}).then(function (res) {
      // got the query results
      //resultPlace.innerHTML += "<p>See res in console</p>"
      console.log(res)
      freq_users = []
      freq_topics = []
      if(topics==true)
      {
        for(i=0;i<res["rows"].length;i++)
        {
          row = res["rows"][i]
          //console.log(row)
          if(row["key"]=="@")
          {
            continue;
          }
          if(row["key"]=="#")
          {
            continue;
          }
          if(row["key"].indexOf("#")==0)
          {
            new_topic = [row["key"],row["value"]]
            freq_topics.push(new_topic)
          }
          if(row["key"].indexOf("@")==0)
          {
            new_user = [row["key"],row["value"]]
            freq_users.push(new_user)
          }
        }
      }
      else
      {
       stopwords = ["a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at","be","because","been","before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't","doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having","he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor","not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she","she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them","themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too","under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's","where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll","you're","you've","your","yours","yourself","yourselves","good","bad"]
       for(i=0;i<res["rows"].length;i++)
        {

          row = res["rows"][i]
          if(row["key"].indexOf("@")==0)
          {
            new_user = [row["key"],row["value"]]
            freq_users.push(new_user)
          }
          else
          {
            token=row["key"]
            if(stopwords.indexOf(token)>=0)
            {
              continue
            }
              new_topic = [row["key"],row["value"]]
              freq_topics.push(new_topic)

          }
        } 
      }
    
    console.log("Sorting topics")
    freq_topics.sort(function(a,b){return a[1] - b[1]});
    freq_topics.reverse();
    console.log("Sorting users")
    freq_users.sort(function(a,b){return a[1] - b[1]});
    freq_users.reverse();
    if(freq_topics.length<15||freq_users.length<15)
      {topicPlace.innerHTML="Unable to find sufficient tweets to determine the topics/users in this region"}
    else
    {  
      topicPlace.innerHTML = "<p>Identified topics/tokens:</p>"      
      usrPlace.innerHTML = "<p>Identified topics/tokens:</p>"
      for(i=0;i<15;i++)
      {
        topicPlace.innerHTML += "<li><a class=\"tag\" href=\"#\"><span class=\"tag_name\">"
            +freq_topics[i][0] + "</span><span class=\"tag_count\">&nbsp;" + freq_topics[i][1] + "</span></a></li>"
        usrPlace.innerHTML += "<li><a class=\"tag\" href=\"#\"><span class=\"tag_name\">"
            +freq_users[i][0]+ "</span><span class=\"tag_count\">&nbsp;" + freq_users[i][1] + "</span></a></li>"   
      }
    }
    }).catch(function (err) {
      // some error
      var resultplace = document.getElementById("topics")
      var resultPlace = document.getElementById("topics")
      //console.log(err)
      resultPlace.innerHTML = "<p>Query Processing please wait...</p>"
      querythedb(qstring)
    });
}

function query(b_lat,u_lat,l_lon,r_lon)
{
  var resultplace = document.getElementById("topics")
  var topicPlace = document.getElementById("topics")
  var usrPlace = document.getElementById("usrs")
  //var chartPlace = document.getElementById("tcharts")
    
  //initializing database
  var pouchDB = new PouchDB(server)
  //resultPlace.innerHTML += "<p>Hi</p>"

  pouchDB.info().then(function (info) {
    //console.log(info)
    topicPlace.innerHTML += "<p>dbinfo get</p>"
  })
  //initializing date variable
  var date = new Date()
  var dateStr = date.toString()
  var day = date.getUTCDate()
  var month = date.getUTCMonth()
  var year = date.getUTCFullYear()
  var hour = date.getUTCHours()
  var minute = date.getUTCMinutes()
  var sec = date.getUTCSeconds()

  var ddstring = year.toString()+month.toString()+day.toString()+hour.toString()+minute.toString()+sec.toString()
  mapping_func0 ="function(doc) {\r\nvar left_lon="+l_lon.toString()+"\r\n"
  mapping_func0 += "var right_lon="+r_lon.toString()+"\r\n"
  mapping_func0 += "var top_lat="+u_lat.toString()+"\r\n"
  mapping_func0 += "var bottom_lat="+b_lat.toString()+"\r\n"
  mapping_func0 += "lon = doc.coordinates[1]\r\n"
  mapping_func0 += "lat = doc.coordinates[0]\r\n"
  mapping_func0 += "if(lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\n{\r\n"
  mapping_func1 = "tokens=doc.text.split(\" \")\r\n"
  mapping_func1 += "for(i=0;i<tokens.length;i++)\r\n"
  mapping_func1 += "{\r\n"
  mapping_func1 += "if(tokens[i].indexOf(\"#\")==0)\r\n"
  mapping_func1 += "{emit(tokens[i].toLowerCase(),1)}\r\n"
  mapping_func1 += "if(tokens[i].indexOf(\"@\")==0)\r\n"
  mapping_func1 += "{emit(tokens[i].toLowerCase(),1)}\r\n"
  mapping_func1 += "}}}"

  mapping_func2 = "text = doc.text.replace(/[\\n|\\r|\\r\\n|\\t|-|_]/gi, \"\")\r\n"
  mapping_func2 += "tokens= text.split(\" \")\r\n"
  mapping_func2 += "for(i=0;i<tokens.length;i++)\r\n"
  mapping_func2 += "{\r\n"
  mapping_func2 += "token=tokens[i].toLowerCase().trim()\r\n"
  mapping_func2 += "if(token.length>=2)emit(token,1)\r\n"
  mapping_func2 += "}}}"

  topic = document.getElementsByName("wordOrTopics")[0].checked
  if(topic==true){mapping_func0+=mapping_func1}
    else{mapping_func0+=mapping_func2}
  var ddoc = {
    _id: '_design/webqueries_',
    views: {
      by_text:{
          map:'',
          reduce:"_sum"
      }
    }
  };

  ddoc._id += ddstring
  ddoc.views.by_text.map = mapping_func0
  console.log(ddoc)

  qstring = 'webqueries_'+ddstring+'/by_text'
  //console.log(ddoc)
  //end of design document

  pouchDB.put(ddoc).then(function () {
    // success!
    usrPlace.innerHTML = "Processing... Plsase Wait"
    topicPlace.innerHTML += "<p>Query reached database...</p>"
  }).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
    topicPlace.innerHTML += "<p>design document error</p>" + err
  });
  querythedb(qstring,topics)
}