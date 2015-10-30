function chart_query(b_lat,u_lat,l_lon,r_lon)
{
  //initializing database
  var pouchDB = new PouchDB(server)
  resultPlace = document.getElementById("date")
  chartPlace = document.getElementById("date")
  //resultPlace.innerHTML += "<p>Hi</p>"

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
  yr = document.getElementById("yr")
  mth = document.getElementById("mth")
  yrVal = yr.options[yr.selectedIndex].value
  mthVal = mth.options[mth.selectedIndex].value
  
  

  mapping_func0 ="function(doc) {\r\nvar left_lon="+l_lon.toString()+"\r\n"
  mapping_func0 += "var right_lon="+r_lon.toString()+"\r\n"
  mapping_func0 += "var top_lat="+u_lat.toString()+"\r\n"
  mapping_func0 += "var bottom_lat="+b_lat.toString()+"\r\n"
  mapping_func0 += "lon = doc.coordinates[1]\r\n"
  mapping_func0 += "lat = doc.coordinates[0]\r\n"
  mapping_func0 += "var date = new Date(doc.created_at)\r\n"
  mapping_func1 = "var day = date.getDay()\r\n"
  mapping_func1 += "if(lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\nemit(day,1);\r\n}"

  mapping_func2 = "var hour = date.getHours()\r\n"
  mapping_func2 += "if(lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\nemit(hour,1);\r\n}"

  mapping_func3 = "var year = date.getFullYear()\r\n"
  mapping_func3 += "var month = date.getMonth()\r\n"
  mapping_func3 += "var date = date.getDate()\r\n"
  mapping_func3 += "var yr ="+yrVal+"\r\n"
  mapping_func3 += "var mth ="+mthVal+"\r\n"
  mapping_func3 += "if(year==yr&&month==mth&&lat>bottom_lat&&lat<top_lat&&lon>left_lon&&lon<right_lon)\r\nemit(date,1);\r\n}"
  mapping_func_by_day = mapping_func0 + mapping_func1
  mapping_func_by_hour = mapping_func0 + mapping_func2
  mapping_func_by_month = mapping_func0 + mapping_func3

  var ddoc = {
    _id: '_design/webqueries_charts_',
    views: {
      by_day:{
          map:'',
          reduce:'_sum'
      },
      by_hour:{
          map:'',
          reduce:'_sum'
      },
      by_month:{
          map:'',
          reduce:'_sum'
      }
    }
  };
  ddoc._id += ddstring
  ddoc.views.by_day.map = mapping_func_by_day
  ddoc.views.by_hour.map = mapping_func_by_hour
  ddoc.views.by_month.map = mapping_func_by_month

  console.log(ddoc)
  qstring0 = 'webqueries_charts_'+ddstring+'/by_day'
  qstring1 = 'webqueries_charts_'+ddstring+'/by_hour'
  qstring2 = 'webqueries_charts_'+ddstring+'/by_month'
  pouchDB.put(ddoc).then(function () {
    // success!
    resultPlace.innerHTML += "<p>Query reached database...</p>"
  }).catch(function (err) {
    // some error (maybe a 409, because it already exists?)
    resultPlace.innerHTML += "<p>design document error</p>" + err
  });
  querychart(qstring0,'#day');
  querychart(qstring1,'#hours');
  querychart(qstring2,'#date');
}

querychart = function(qstring0,divid)
{
  var pouchDB = new PouchDB(server)
  //WEEKLY QUERY
  pouchDB.query(qstring0,{reduce: true, group: true}).then(function (res) {
    console.log(res)
    values = []
    keys = []
    for(offs in res.rows)
    {
      console.log(res.rows[offs].value)
      console.log(res.rows[offs])
      values.push(res.rows[offs].value)
      keys.push(res.rows[offs].key)
    }
    $(function () {    
        $(divid).highcharts({
            title: {
                text: 'Average Tweets in this region',
                x: -20 //center
            },
            subtitle: {
                text: 'Source: Twitter',
                x: -20
            },
            xAxis: {
                categories: keys
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{name:'count',data:values}]
        });
    });
  }).catch(function(err){
    querychart(qstring0,divid)
  });
}