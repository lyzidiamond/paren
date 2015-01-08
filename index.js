var debounce = require('debounce'),
  createWidget = require('./create_widget'),
  CodeMirror = require('codemirror'),
  Terrarium = require('terrarium').Browser;

require('codemirror/mode/javascript/javascript');

var pairs = (o) => Object.keys(o).map(k => [k, o[k]]);
var values = (o) => pairs(o).map(k => k[1]);

function $(_) { return document.getElementById(_); }
function ce(_, c) {
  var elem = document.createElement(_);
  elem.className = c || '';
  return elem;
}

/**
 * The Rpl class. This expects to be called with a target of a
 * DOM element (probably a div) with some content, which it will
 * replace with an editable CodeMirror with live annotations.
 */
class Rpl {
  constructor(element) {
    var widgets = [], errors = [], delayedClear, terrarium;

    var editor = this.setupEditor(element);
    editor.on('change', debounce(onchange, 200));
    onchange();

    function onchange() {
      clearTimeout(delayedClear);
      joinWidgets([]);
      if (terrarium) { terrarium.destroy(); }
      terrarium = new Terrarium();
      terrarium
        .on('data', ondata)
        .on('err', onerr)
        .run(editor.getValue());
    }

    function ondata(d) {
      clearTimeout(delayedClear);
      if (d.error) {
        // error.style.display = 'block';
        // error.innerHTML = d.error;
        // delayedClear = setTimeout(joinWidgets, 1000);
      } else {
        // error.style.display = 'none';
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
        // error.style.display = 'block';
        // error.innerHTML = err;
        delayedClear = setTimeout(joinWidgets, 1000);
      }
    }

    function joinWidgets(newData) {
      // remove old widgets
      widgets.forEach(widget => editor.removeLineWidget(widget));
      errors.forEach(e => editor.removeLineWidget(e));
      widgets = pairs(newData).map(p => addWidget(p[1], p[0]));

      function addWidget(val, id) {
        var line = val[val.length - 1].line - 1;
        var widget = editor.addLineWidget(
          line, makeWidget(val), { coverGutter: false, noHScroll: true });
        return widget;
      }
    }
  }

  setupEditor(element) {
    return CodeMirror(function(elt) {
      element.parentNode.replaceChild(elt, element);
    }, {value:element.textContent || element.innerText}, {
      indentUnit: 2, mode: 'text/javascript'
    });
  }
}

function makeWidget(values) {
  var value = values[values.length - 1],
    msg = ce('div'),
    pre = msg.appendChild(ce('pre')),
    n = msg.appendChild(ce('div', 'data-name')),
    name = n.appendChild(ce('span', 'data-var'));
  n.className = 'data-name';
  name.innerHTML = value.name;
  msg.className = 'data';
  try {
    createWidget(pre, value.val);
  } catch(e) { console.error(e); }
  return msg;
}

module.exports = Rpl;
