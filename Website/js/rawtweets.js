rawtweets = function(b_lat,u_lat,l_lon,r_lon)
{
  //initializing database
  var pouchDB = new PouchDB(server)
  resultPlace = document.getElementById("rawtweets")
  chartPlace = document.getElementById("rawtweets")
  //resultPlace.innerHTML += "<p>Hi</p>"
  filterStr = document.getElementById("wfilter").value.toString()
  pouchDB.info().then(function (info) {
    //console.log(info)
    resultPlace.innerHTML += "<p>dbinfo get</p>"
  })
  //initializing date variable
  var date = new Date()
  var dateStr = date.toString()
  var day = date.getDate()
  var month = date.getMonth()
  var year = date.getFullYear()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var sec = date.getSeconds()
  var ddstring = year.toString()+month.toString()+day.toString()+hour.toString()+minute.toString()+sec.toString()
  //initializing date filter

  

  mapping_func0 ="function(doc) {\r\nvar left_lon="+l_lon.toString()+"\r\n"
  mapping_func0 += "var right_lon="+r_lon.toString()+"\r\n"
  mapping_func0 += "var top_lat="+u_lat.toString()+"\r\n"
  mapping_func0 += "var bottom_lat="+b_lat.toString()+"\r\n"
  mapping_func0 += "lon = doc.coordinates[1]\r\n"
  mapping_func0 += "lat = doc.coordinates[0]\r\n"
  mapping_func0 += "var date = new Date(doc.created_at)\r\n"
  mapping_func0 += "var year = date.getFullYear()\r\n"
  mapping_func0 += "var month = date.getMonth()\r\n"
  mapping_func1 = "if(lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\nemit(null,doc.text);\r\n}"
  mapping_func2 = "if(doc.text.indexOf(\""+filterStr+"\")>=0&&lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\nemit(null,doc.text);\r\n}"
  if(filterStr=="")
  {
  	mapping_func0 += mapping_func1
  }
  else
  {
  	mapping_func0 += mapping_func2
  }
  var ddoc = {
    _id: '_design/webqueries_rawtweets_',
    views: {
      rawtweets:{
          map:''
                }
    }
  };
  ddoc._id += ddstring
  ddoc.views.rawtweets.map = mapping_func0

  //console.log(ddoc)
  qstring0 = 'webqueries_rawtweets_'+ddstring+'/rawtweets'
  pouchDB.put(ddoc).then(function () {
    // success!
    resultPlace.innerHTML += "<p>Query reached database...</p>"
  }).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
    resultPlace.innerHTML += "<p>design document error</p>" + err
  });
  showresults(qstring0);
}

showresults = function(qstring){
	console.log("I'm called")
    var resultPlace = document.getElementById("rawtweets")
    //var chartPlace = document.getElementById("tcharts")
    var pouchDB = new PouchDB(server)
    pouchDB.query(qstring).then(function (res) 
    {
    	// got the query results
	    for(var i = 0; i < res.rows.length;i++)
	    {
	      //console.log(rows[i])
	      var text = res.rows[i]["value"]
	      console.log(text)
	      console.log(i)
	      resultPlace.innerHTML += text + "<br/>"
	    }
    }).catch(function (err) {
      // some error
      resultPlace = document.getElementById("rawtweets")
      resultPlace.innerHTML = "<p>Query Processing please wait...</p>"
      showresults(qstring)
    });
}

