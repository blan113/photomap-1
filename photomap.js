/** Create a Leaflet map that reads data from Google Sheets. Each row in the
    sheet will appear as a marker on the map. When the marker is clicked, a
    popup will appear showing information about the location, taken from the
    columns of the spreadsheet.  
    
    This script assumes the Google Sheet has the following columns. These match
    the attribute names used for the Story Map Tour template in ArcGIS Online.
    
    Name        A short name for the location, to appear as the popup title.
    Description A sentence or two describing the location in more detail.
    Lat         Latitude in decimal degrees
    Long        Longitude in decimal degrees
    Pic_url     The URL to an image that will be displayed in the popup.
 */
function createPhotoMap () {
  // URL of a Google Sheets spreadsheet output as CSV
  var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTquA7_ZOyca2ZrOz8r6IShyLQWkmPlF7H2Ub8Tw14JmLWAknapYxPgqKB1ajst109IvIsAxRRMVUmm/pub?gid=0&single=true&output=csv';
  
  // create map object with center lat/lon and zoom level
  var map = L.map('map').setView([28.385011167593483, -81.57237660566031], 13);
  
  // create basemap object. See examples at https://leaflet-extras.github.io/leaflet-providers/preview/
 var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  	maxZoom: 16,
  	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }).addTo(map);
  
  // use Papa Parse (papaparse.com) to get the Google Sheets CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true, 
    dynamicTyping: true,
    complete: function(csv) {
      // declare variables
      var place, marker, markersLayer;
      
      // create a layer where marker (point) features will be saved from the CSV
      markersLayer = L.featureGroup().addTo(map);

      // go through each row of the CSV to save the values to a marker
      for (row in csv.data) {
        place = csv.data[row];
        marker = L.marker([place.Lat, place.Long])
          .bindTooltip(place.Name, {permanent: true}) // show labels by default
          .addTo(markersLayer);
        marker.properties = {
          Name: place.Name,
          Description: place.Description,
          Pic_url: place.Pic_url
        };
        
      } // end of for (row in csv.data) {...
      
      // create a function to show CSV values in a popup when a marker is clicked
      markersLayer.on("click", function(event) {
        var place = event.layer.properties;
        $('.modal').modal('show');
        $('.modal-title').html(place.Name)
        $('.modal-body').html(place.Description + '<br><img src="' + place.Pic_url + '">')
      });
      
    } // end of complete: function(csv) {...
      
  }); // end of Papa.parse(csvUrl, {...
  
  // close the popup when x or close button is clicked
  $('.closeButton').on('click', function(e){
    $('.modal').modal('hide');
  })
  
} // end of function createPhotoMap () {...

// create the map after the rest of the page has loaded
window.addEventListener('load', createPhotoMap);
