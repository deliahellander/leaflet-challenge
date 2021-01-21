// geojson data linke "All Earthquakes" for the last 30 days
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


// Adding tile layer
var grayscale_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

var earthquakes = L.layerGroup();

// Creating map object
var myMap = L.map("mapid", {
    center: [35, -100],
    zoom: 3,
    layers: [grayscale_map, earthquakes]
});

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
    console.log(data)
    function marker_size(magnitude) {
        return magnitude*2;
    };
    // Determine the marker color by depth
    function color(depth) {
        switch(true) {
          case depth > 90:
            return "darkred";
          case depth > 70:
            return "red";
          case depth > 50:
            return "orange";
          case depth > 30:
            return "yellow";
          case depth > 10:
            return "lime";
          default:
            return "green";
        }
    }
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, 
            // Set the style of the markers based on properties.mag
            {
              radius: marker_size(feature.properties.mag),
              fillColor: color(feature.geometry.coordinates[2]),
              fillOpacity: 0.5,
              color: "black",
              stroke: true,
              weight: 0.5
            }
          );
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Time: "
          + feature.properties.time + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
      }).addTo(earthquakes);
      earthquakes.addTo(myMap);

    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend'),
            depth = [-10, 10, 30, 50, 70, 90];
            div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
      
          // loop through our depth to get colors for earthquakes
          for (var i = 0; i < depth.length; i++) {
              div.innerHTML +=
                  '<i style="background:' + color(depth[i] + 1) + '"></i> ' +
                  depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
            }
            return div;
        };
      
    legend.addTo(myMap);
});
    

