/* global L */
require('mapbox.js');
var geojsonhint = require('geojsonhint').hint;
L.mapbox.accessToken = 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ';

function ce(_, c) {
  var elem = document.createElement(_);
  elem.className = c || '';
  return elem;
}

module.exports = function(container, value) {
  if (!geojsonhint(value).length) {
    var element = container.appendChild(document.createElement('div'));
    element.mode = 'map';
    element.style.height = '300px';
    element.features = L.mapbox.featureLayer();
    element.map = L.mapbox.map(element, 'tmcw.map-7s15q36b', {
      zoomControl: false })
      .addLayer(element.features);
  } else {
    var pre = container.appendChild(document.createElement('pre'));
    pre.innerHTML = JSON.stringify(value, null, 2);
  }
};
