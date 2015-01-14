/* global L */
require('codemirror/mode/javascript/javascript');
require('mapbox.js');

var debounce = require('debounce'),
  CodeMirror = require('codemirror'),
  Terrarium = require('terrarium').Browser,
  geojsonhint = require('geojsonhint').hint,
  highlight = require('highlight.js');

var pairs = (o) => Object.keys(o).map(k => [k, o[k]]);

function ce(_, c, inner) {
  var elem = document.createElement(_);
  elem.className = c || '';
  if (inner) elem.innerHTML = inner;
  return elem;
}

/**
 * The Rpl class. This expects to be called with a target of a
 * DOM element (probably a div) with some content, which it will
 * replace with an editable CodeMirror with live annotations.
 */
class Rpl {
  constructor(element, options) {
    this.element = element;
    this.options = options || {};
    this.options.mapid = this.options.mapid || 'tmcw.map-7s15q36b';
    this.options.accessToken = this.options.accessToken || 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ';
    this.widgets = [];
    this.errors = [];
    this.delayedClear = null;
    this.terrarium = null;
    this.editor = this.setupEditor(this.element);
    this.editor.on('change', debounce(this.onchange.bind(this), 200));
    this.onchange();
  }

  onchange() {
    clearTimeout(this.delayedClear);
    this.joinWidgets({});
    if (this.terrarium) { this.terrarium.destroy(); }
    this.terrarium = new Terrarium(this.options);
    this.terrarium
      .on('data', this.ondata.bind(this))
      .on('err', this.onerr.bind(this))
      .run(this.editor.getValue());
  }

  onerr(err) {
    this.clearErrors();
    if (err.message) {
      var elem = ce('div', 'rpl-error', err.toString());
      this.errors.push(this.editor.addLineWidget(err.lineNumber || 0,
        elem, { coverGutter: false, noHScroll: true }));
    }
  }

  ondata(d) {
    clearTimeout(this.delayedClear);
    this.joinWidgets(d);
  }

  clearErrors() {
    this.errors.forEach(this.editor.removeLineWidget);
    this.errors = [];
  }

  clearWidgets() {
    this.widgets.forEach(this.editor.removeLineWidget);
    this.widgets = [];
  }

  joinWidgets(newData) {
    this.clearWidgets();
    this.clearErrors();
    this.widgets = pairs(newData || {}).map(p => {
      var [id, val] = p;
      var line = val[val.length - 1].line - 1;
      var el = this.makeWidget(val);
      var widget = this.editor.addLineWidget(
        line, el, { coverGutter: false, noHScroll: true });
      if (el.onadd) el.onadd();
      return widget;
    });
  }

  setupEditor(element) {
    return CodeMirror(function(elt) {
      element.parentNode.replaceChild(elt, element);
    }, {value:element.textContent || element.innerText}, {
      indentUnit: 2, mode: 'text/javascript',
      viewportMargin: Infinity
    });
  }

  makeWidget(values) {
    var value = values[values.length - 1],
      msg = ce('div', 'data'),
      n = msg.appendChild(ce('div', 'data-name', value.name)),
      name = n.appendChild(ce('span', 'data-var'));
    try {
      this.fillWidget(msg, value.val);
      return msg;
    } catch(e) { console.error(e); }
    return msg;
  }

  fillWidget(container, value) {
    L.mapbox.accessToken = this.options.accessToken;
    if (value && !geojsonhint(JSON.stringify(value)).length) {
      var element = container.appendChild(ce('div', 'map-viewer')),
        featureLayer = L.mapbox.featureLayer(value),
        map = L.mapbox.map(element, this.options.mapid, {
        zoomControl: false, maxZoom: 15, scrollWheelZoom: false
      }).addLayer(featureLayer);
      container.onadd = function() {
        map.fitBounds(featureLayer.getBounds());
        map.invalidateSize();
      };
    }
    var pre = container.appendChild(
      ce('pre', 'json-viewer', JSON.stringify(value, null, 2)));
    highlight.highlightBlock(pre);
  }
}

module.exports = Rpl;
