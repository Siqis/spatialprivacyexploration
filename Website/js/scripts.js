
$(document).ready(function(){/* google maps -----------------------------------------------------*/
google.maps.event.addDomListener(window, 'load', initialize);

function initialize() {

  //Position Melbourne City
  var latlng = new google.maps.LatLng(-37.8131869,144.9629796);

  var mapOptions = {
    center: latlng,
    scrollWheel: true,
    zoom: 13
  };
    
  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  //Draggable bounding box
  var rectangle = new google.maps.Rectangle({
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#000000',
    fillOpacity: 0.35,
    map: map,
    editable: true,
    bounds: new google.maps.LatLngBounds(
        new google.maps.LatLng(-37.8041, 144.960),
        new google.maps.LatLng(-37.8141, 144.970))
  });

  rectangle.setMap(map);

  //Initilize tips and events
  rectangle.addListener('bounds_changed', showNewRect);
  rectangle.setMap(map);

  infoWindow = new google.maps.InfoWindow();
  var ne = rectangle.getBounds().getNorthEast()
  infoWindow.setContent("Drag the rectangle to modify the bounding box");
  infoWindow.setPosition(ne);

  infoWindow.open(map);
  function showNewRect(event) {
    var ne = rectangle.getBounds().getNorthEast()
    var neLat = rectangle.getBounds().getNorthEast().lat()
    var neLng = rectangle.getBounds().getNorthEast().lng()
    var swLat = rectangle.getBounds().getSouthWest().lat()
    var swLng = rectangle.getBounds().getSouthWest().lng()
    neLat = neLat.toFixed(7)
    neLng = neLng.toFixed(7)
    swLat = swLat.toFixed(7)
    swLng = swLng.toFixed(7)
    var contentString = '<b>New Bounding Box</b><br>' +
      'New north-east corner: ' + neLat + ', ' + neLng + '<br>' +
      'New south-west corner: ' + swLat + ', ' + swLng;

    // Set the info window's content and position.
    infoWindow.setContent(contentString);
    infoWindow.setPosition(ne);

    infoWindow.open(map);
  }


  qry = function(){
    var neLat = rectangle.getBounds().getNorthEast().lat()
    var neLng = rectangle.getBounds().getNorthEast().lng()
    var swLat = rectangle.getBounds().getSouthWest().lat()
    var swLng = rectangle.getBounds().getSouthWest().lng()
    neLat = parseFloat(neLat).toFixed(7)
    neLng = parseFloat(neLng).toFixed(7)
    swLat = parseFloat(swLat).toFixed(7)
    swLng = parseFloat(swLng).toFixed(7)
    console.log([neLat,neLng])
    console.log([swLat,swLng])
    query(swLat,neLat,swLng,neLng)
  }

  c_qry = function(){
    var neLat = rectangle.getBounds().getNorthEast().lat()
    var neLng = rectangle.getBounds().getNorthEast().lng()
    var swLat = rectangle.getBounds().getSouthWest().lat()
    var swLng = rectangle.getBounds().getSouthWest().lng()
    neLat = parseFloat(neLat).toFixed(7)
    neLng = parseFloat(neLng).toFixed(7)
    swLat = parseFloat(swLat).toFixed(7)
    swLng = parseFloat(swLng).toFixed(7)
    console.log([neLat,neLng])
    console.log([swLat,swLng])
    chart_query(swLat,neLat,swLng,neLng)
  }

  rawt_qry = function(){
          var neLat = rectangle.getBounds().getNorthEast().lat()
          var neLng = rectangle.getBounds().getNorthEast().lng()
          var swLat = rectangle.getBounds().getSouthWest().lat()
          var swLng = rectangle.getBounds().getSouthWest().lng()
          neLat = parseFloat(neLat).toFixed(7)
          neLng = parseFloat(neLng).toFixed(7)
          swLat = parseFloat(swLat).toFixed(7)
          swLng = parseFloat(swLng).toFixed(7)
          console.log([neLat,neLng])
          console.log([swLat,swLng])
          rawtweets(swLat,neLat,swLng,neLng)
        }


};

});