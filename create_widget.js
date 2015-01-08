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
    element.map = L.mapbox.map(element, 'tmcw.map-7s15q36b', {
      zoomControl: false })
      .addLayer(L.mapbox.featureLayer(value));
  } else {
    var pre = container.appendChild(document.createElement('pre'));
    pre.className = 'json-viewer';
    pre.innerHTML = JSON.stringify(value, null, 2);
    highlight.highlightBlock(pre);
  }
};
