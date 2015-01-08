/* global L */
require('mapbox.js');
var geojsonhint = require('geojsonhint').hint,
  highlight = require('highlight.js');

L.mapbox.accessToken = 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ';

function ce(_, c) {
  var elem = document.createElement(_);
  elem.className = c || '';
  return elem;
}

module.exports = function(container, value) {
  if (!geojsonhint(JSON.stringify(value)).length) {
    var element = container.appendChild(document.createElement('div'));
    element.className = 'map-viewer';
    var featureLayer = L.mapbox.featureLayer(value);
    var map = L.mapbox.map(element, 'tmcw.map-7s15q36b', {
      zoomControl: false, maxZoom: 15
    }).addLayer(featureLayer);
    element.onadd = function() {
      map.fitBounds(featureLayer.getBounds());
      map.invalidateSize();
    };
    return element;
  } else {
    var pre = container.appendChild(document.createElement('pre'));
    pre.className = 'json-viewer';
    pre.innerHTML = JSON.stringify(value, null, 2);
    highlight.highlightBlock(pre);
    element.onadd = function() { };
    return element;
  }
};
