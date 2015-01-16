/* global L */
require('codemirror/mode/javascript/javascript');
require('mapbox.js');

var debounce = require('debounce'),
  CodeMirror = require('codemirror'),
  Terrarium = require('terrarium').Browser,
  geojsonhint = require('geojsonhint').hint;

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
    this.options.tips = this.options.tips || [];
    this.options.mapid = this.options.mapid || 'tmcw.map-7s15q36b';
    this.options.accessToken = this.options.accessToken || 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ';
    this.widgets = [];
    this.errors = [];
    this.delayedClear = null;
    this.terrarium = null;
    this.inlineStyle = document.body.appendChild(document.createElement('style'));
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
    this.addMarks();
  }

  addMarks() {
    if (!this.options.tips.length) return;
    var cssContent = {};
    this.editor.eachLine(lineHandle => {
      this.options.tips.forEach(tip => {
        var ch = lineHandle.text.indexOf(tip[0]);
        if (ch !== -1) {
          var line = this.editor.getLineNumber(lineHandle);
          var classHash = 'c-' + window.btoa(tip[1]).replace(/(=|\/|\+)/g, '');
          cssContent[classHash] = tip[1];
          this.editor.markText({ line, ch }, { line, ch: ch + tip[0].length }, {
            className: 'has-tip ' + classHash
          });
        }
      });
    });
    var cssString = '';
    for (var k in cssContent) {
      cssString += '.' + k + ':hover:after{content:' + JSON.stringify(cssContent[k]) + ';}';
    }
    this.inlineStyle.innerHTML = cssString;
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
      featureLayer.eachLayer(function(layer) {
        if (Object.keys(layer.feature.properties).length) {
          layer.bindPopup('<pre>' + JSON.stringify(layer.feature.properties, null, 2) + '</pre>');
        }
      });
      container.onadd = function() {
        map.fitBounds(featureLayer.getBounds());
        map.invalidateSize();
      };
    }
    var pre = container.appendChild(
      ce('pre', typeof value === 'object' ? 'json-viewer' : 'json-viewer big',
         JSON.stringify(value, null, 2)));
  }
}

module.exports = Rpl;
