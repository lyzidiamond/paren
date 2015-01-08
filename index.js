/* global L */
require('mapbox.js');
var _ = require('lodash');
var Terrarium = require('terrarium').Browser;
var through = require('through');

L.mapbox.accessToken = 'pk.eyJ1IjoidG1jdyIsImEiOiJIZmRUQjRBIn0.lRARalfaGHnPdRcc-7QZYQ';

function $(_) { return document.getElementById(_); }
function ce(_, c) {
    var elem = document.createElement(_);
    elem.className = c || '';
    return elem;
}

var error = $('error');
var widgets = [];
var errors = [];
var delayedClear;
var terrarium;

var CodeMirror = require('codemirror');

var editor = CodeMirror.fromTextArea($('editor'), {
  indentUnit: 2,
  mode: 'text/javascript',
  autofocus: true
});

editor.on('change', _.debounce(onchange, 200));

function onchange() {
  clearTimeout(delayedClear);
  joinWidgets([]);
  if (terrarium) terrarium.destroy();
  terrarium = new Terrarium();
  terrarium
    .on('data', ondata)
    .on('err', onerr)
    .run(editor.getValue());
}

function makeWidget(values) {
  var idx = 0;
  var value;
  var parsed;
  var count;
  var mode = 'json';

  var msg = ce('div');
  var pre = msg.appendChild(ce('pre'));
  var n = msg.appendChild(ce('div', 'data-name'));
  n.className = 'data-name';
  var preTime = n.appendChild(ce('code', 'time'));
  var name = n.appendChild(ce('span', 'data-var'));
  name.innerHTML = values[idx].name;
  var select = n.appendChild(ce('select'));
  ['json', 'chart', 'map'].forEach(function(type) {
      var opt = select.appendChild(ce('option'));
      opt.value = opt.innerHTML = type;
  });
  select.onchange = function(e) {
    mode = e.target.value;
    fillPre();
  };

  msg.className = 'data';

  function fillPre() {
    try {
      parsed = value.val !== undefined ? value.val : value.stringified;

      if (parsed.ELEMENT_NODE) {
        widgetTypes.element(pre, parsed);
      } else if (mode === 'json') {
        widgetTypes.json(pre, parsed);
      } else if (mode === 'chart') {
        widgetTypes.chart(pre, parsed);
      } else if (mode === 'map') {
        widgetTypes.map(pre, parsed);
      }

      if (value.when > 0) {
        preTime.innerHTML = value.when + 'ms';
      } else {
        preTime.innerHTML = '';
      }
    } catch(e) { }
  }

  function setStep(_) {
    _ = Math.min(values.length - 1, Math.max(0, _));
    value = values[_];
    fillPre();
    if (count) count.innerHTML = (_ + 1) + '/' + values.length;
    idx = _;
  }

  function nav(dir) {
    return function() {
      if (values[idx + dir]) setStep(idx + dir);
      return false;
    };
  }

  function showNav() {
    if (values.length > 1) {
      if (n.getElementsByClassName('time-control').length) {
        n.getElementsByClassName('time-control')[0].parentNode.removeChild(n.getElementsByClassName('time-control')[0]);
      }
      var timeControl = n.appendChild(ce('span', 'time-control'));
      timeControl.className = 'time-control';
      var backward = timeControl.appendChild(ce('a'));
      backward.innerHTML = '&larr;';
      backward.href = '#';
      count = timeControl.appendChild(ce('span'));
      var forward = timeControl.appendChild(ce('a'));
      forward.innerHTML = '&rarr;';
      forward.href = '#';
      forward.addEventListener('click', nav(1));
      backward.addEventListener('click', nav(-1));
    }
  }

  showNav();
  setStep(0);

  return {
    element: msg,
    update(_) {
      values = _;
      showNav();
      fillPre();
      setStep(idx);
    }
  };
}

var widgetTypes = {
  json(container, value) {
    var element = container.firstChild;

    if (element && element.mode !== 'json')  container.innerHTML = '';

    if (element && element.mode === 'json') {
      update();
    } else {
      setup(); update();
    }

    function setup() {
      element = container.appendChild(ce('pre'));
      element.mode = 'json';
    }
    function update() {
      element.innerHTML = JSON.stringify(value, null, 2);
    }
  },
  element(container, value) {
    container.innerHTML = '';
    container.appendChild(value);
  },
  map(container, value) {
    var element = container.firstChild;

    if (element && element.mode !== 'map')  container.innerHTML = '';

    if (element && element.mode === 'map') {
      update();
    } else {
      setup();
      update();
    }

    function setup() {
      element = container.appendChild(document.createElement('div'));
      element.mode = 'map';
      element.style.height = '300px';
      element.features = L.mapbox.featureLayer();
      element.map = L.mapbox.map(element, 'tmcw.map-7s15q36b', {
        zoomControl: false })
        .addLayer(element.features);
    }

    function update() {
      element.features.setGeoJSON(value);
    }
  }
};

function joinWidgets(newData) {

  // remove old widgets
  widgets = widgets.filter((widget) => {
    if (!newData[widget.id]) {
      editor.removeLineWidget(widget);
      return false;
    } else {
      return true;
    }
  });

  errors.forEach(e => editor.removeLineWidget(e));

  var widgetsById = widgets.reduce((memo, w) => {
    memo[w.id] = w;
    return memo;
  }, {});

  for (var id in newData) {
    if (widgetsById[id]) {
      // update existing widgets
      widgetsById[id].update(newData[id]);
    } else {
      // create new widgets
      widgets.push(addWidget(newData[id], id));
    }
  }

  function addWidget(val, id) {
    var line = val[val.length - 1].line;
    var w = makeWidget(val);
    var widget = editor.addLineWidget(
      line,
      w.element, {
        coverGutter: false,
        noHScroll: true
      });
    widget.id = id;
    widget.update = w.update;
    return widget;
  }
}

function ondata(d) {
  clearTimeout(delayedClear);
  if (d.error) {
    error.style.display = 'block';
    error.innerHTML = d.error;
    delayedClear = setTimeout(joinWidgets, 1000);
  } else {
    error.style.display = 'none';
    joinWidgets(d);
  }
}

function onerr(err) {
  errors.forEach(e => editor.removeLineWidget(e));
  if (err instanceof Error && err.lineNumber !== undefined) {
      var elem = document.createElement('pre');
      elem.innerHTML = err.message;
      elem.classname = 'error';
      var widget = editor.addLineWidget(
        err.lineNumber,
        elem, { coverGutter: false, noHScroll: true });
      errors.push(widget);
  } else {
      error.style.display = 'block';
      error.innerHTML = err;
      delayedClear = setTimeout(joinWidgets, 1000);
  }
}

var values = (d) => Object.keys(d).map(function(k) { return d[k]; });
