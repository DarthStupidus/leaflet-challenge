// Define the URL for the USGS earthquake data
const earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the earthquake data and plot it on the map
d3.json(earthquakeUrl).then(function(data) {
});

// Create a function to get the color based on the depth of the earthquake
function getColor(depth) {
  return depth > 90 ? '#800026' :
         depth > 70 ? '#BD0026' :
         depth > 50 ? '#E31A1C' :
         depth > 30 ? '#FC4E2A' :
         depth > 10 ? '#FD8D3C' :
                      '#FFEDA0';
}

// Define a function to create the radius based on the magnitude of the earthquake
function getRadius(magnitude) {
  return magnitude * 4;
}

// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18,
}).addTo(myMap);

// Get the earthquake data and plot it on the map
d3.json(earthquakeUrl).then(function(data) {
  // Create a GeoJSON layer with the retrieved data
  L.geoJSON(data, {
    // Define a function to run once for each feature in the data
    pointToLayer: function(feature, latlng) {
      // Set the style of the marker based on the magnitude and depth of the earthquake
      return L.circleMarker(latlng, {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    },
    // Create a popup for each marker to display the magnitude, location, and depth
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Location: ${feature.properties.place}<br>Depth: ${feature.geometry.coordinates[2]}`);
    }
  }).addTo(myMap);

  // Create a legend control
  var legend = L.control({ position: "bottomright" });

  // Add details for each color
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [-10, 10, 30, 50, 70, 90];
    var labels = [];
    var legendInfo = "<h5>Depth of Earthquake (km)</h5>";

    div.innerHTML = legendInfo;

    // Go through each depth item to label and color
    for (var i = 0; i < grades.length; i++) {
      labels.push('<ul style="background-color: ' + getColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
    }

    // Add each label list item to the div
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Add the legend to the map
  legend.addTo(myMap);
});
