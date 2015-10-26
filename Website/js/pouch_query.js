querythedb = function(qstring)
{
    var resultPlace = document.getElementById("topics")
    var topicPlace = document.getElementById("topics")
    var usrPlace = document.getElementById("usrs")
    //var chartPlace = document.getElementById("tcharts")
    var pouchDB = new PouchDB('http://115.146.92.225:5984/geocouch_mel')
    pouchDB.query(qstring).then(function (res) {
    // got the query results
    wtkens = {}
    usrs = {}
    //resultPlace.innerHTML += "<p>See res in console</p>"

    for(var i = 0; i < res.rows.length;i++)
    {
      //console.log(rows[i])
      var text = res.rows[i]["value"]["text"]
      var usr = res.rows[i]["value"]["user"]["name"]
      if(usr in usrs)
      {
        usrs[usr] += 1
      }
      else {usrs[usr] = 1}
      var cleanText = text.removeStopWords().toLowerCase()

      //wordOrTopics
      topic = document.getElementsByName("wordOrTopics")[0].checked
      //alert(topic)
      if(topic == true) 
      {
          tk = cleanText.match(/#[A-Za-z0-9]+/ig)
      }
      else
      {
          tk = cleanText.split(" ")
      } 
      console.log(cleanText)
      console.log(tk)
      console.log(i)
      for(var offset in tk)
      {
        //resultPlace.innerHTML += tk[offset] + "<br/>"
        if(tk[offset] in wtkens)
        {
          wtkens[tk[offset]] ++
        }
        else
        {
          wtkens[tk[offset]] = 1
        }
      }
    }
    var topicArr = []
    var usrArr = []

    for(a in wtkens){
      topicArr.push([a,wtkens[a]])
    }
    topicArr.sort(function(a,b){return a[1] - b[1]});
    topicArr.reverse();

    for(a in usrs){
      usrArr.push([a,usrs[a]])
    }
    usrArr.sort(function(a,b){return a[1] - b[1]});
    usrArr.reverse();
    
    if(usrArr.length<15 && topicArr.length<15)
    {
      resultPlace.innerHTML += "Unable to get any tweets from the region so no analysis is possible"
    }
    else
    {
      resultPlace.innerHTML = ""
      usrPlace.innerHTML = ""

      usrPlace.innerHTML = "<ul id=\"u\"></ul>"
      topicPlace.innerHTML= "<ul id=\"t\"></ul>"
      if(usrArr.length<15)
      {
        for(i=0;i<usrArr.length;i++)
        {
          userTag = "@" + usrArr[i][0]
          userCount = usrArr[i][1]
          document.getElementById("u").innerHTML += "<li><a class=\"tag\" href=\"#\"><span class=\"tag_name\">"
          +userTag + "</span><span class=\"tag_count\">" + userCount + "</span></a></li>"
        }
      }
      else
      {
        for(i=0; i < 15 ; i++)
        {
          userTag = "@" + usrArr[i][0]
          userCount = usrArr[i][1]
          document.getElementById("u").innerHTML += "<li><a class=\"tag\" href=\"#\"><span class=\"tag_name\">"
          +userTag + "</span><span class=\"tag_count\">" + userCount + "</span></a></li>"
        }
      }
      if(topicArr.length<15)
      {
        for(i=0;i<topicArr.length;i++)
        {
          tTag = topicArr[i][0]
          tCount = topicArr[i][1]
          document.getElementById("t").innerHTML += "<li><a class=\"tag\" href=\"#\"><span class=\"tag_name\">"
          +tTag + "</span><span class=\"tag_count\">" + tCount + "</span></a></li>"      
        }
      }
      else
      {
        for(i = 0 ; i < 15 ; i++)
        {
          tTag = topicArr[i][0]
          tCount = topicArr[i][1]
          document.getElementById("t").innerHTML += "<li><a class=\"tag\" href=\"#\"><span class=\"tag_name\">"
          +tTag + "</span><span class=\"tag_count\">" + tCount + "</span></a></li>"      
        }
      }
    }
    }).catch(function (err) {
      // some error
      var resultplace = document.getElementById("topics")
      var resultPlace = document.getElementById("topics")
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
  var pouchDB = new PouchDB('http://115.146.92.225:5984/geocouch_mel')
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
  mapping_func0 += "if(lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\nemit(doc[\"coordinates\"],doc);\r\n}"
  var ddoc = {
    _id: '_design/webqueries_',
    views: {
      by_text:{
          map:''
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
  querythedb(qstring)
}