require('codemirror/mode/javascript/javascript');

var debounce = require('debounce'),
  CodeMirror = require('codemirror'),
  Terrarium = require('terrarium');

var pairs = (o) => Object.keys(o).map(k => [k, o[k]]);

function ce(_, c, inner) {
  var elem = document.createElement(_);
  elem.className = c || '';
  if (inner) elem.innerHTML = inner;
  return elem;
}

/**
 * The Paren class. This expects to be called with a target of a
 * DOM element (probably a div) with some content, which it will
 * replace with an editable CodeMirror with live annotations.
 */
class Paren {
  constructor(element, options) {
    this.element = element;
    this.options = options || {};
    this.widgets = [];
    this.errors = [];
    this.delayedClear = null;
    this.terrarium = null;
    this.inlineStyle = document.body.appendChild(document.createElement('style'));
    this.editor = this.setupEditor(this.element);
    this.editor.on('change', debounce(this.onchange.bind(this), 200));
    this.onchange();
  }

  export(type) {
    return Terrarium.instrument(this.editor.getValue(), 0, type).source;
  }

  onchange() {
    clearTimeout(this.delayedClear);
    this.clearErrors();
    if (this.terrarium) { this.terrarium.destroy(); }
    this.editor.eachLine(line => {
      if (line.text.match(/^\s*\/\/\=/)) {
        this.editor.addLineClass(line, 'background', 'bg-light-yellow');
      } else {
        this.editor.removeLineClass(line);
      }
    });

    this.terrarium = new Terrarium.Browser(this.options);
    this.terrarium
      .on('data', this.ondata.bind(this))
      .on('err', this.onerr.bind(this))
      .run(this.editor.getValue());

  }

  onerr(err) {
    this.clearErrors();
    if (err.message) {
      var elem = ce('div', 'px1 py1 red bg-darken-1 rounded', err.toString());
      this.errors.push(this.editor.addLineWidget(err.lineNumber || 0,
        elem, { coverGutter: false, noHScroll: true }));
    }
  }

  ondata(d) {
    clearTimeout(this.delayedClear);
    this.joinWidgets(d);
  }

  clearErrors() {
    this.errors.forEach(this.editor.removeLineWidget.bind(this.editor));
    this.errors = [];
  }

  clearWidgets() {
    this.widgets.forEach(this.editor.removeLineWidget.bind(this.editor));
    this.widgets = [];
  }

  joinWidgets(newData) {
    this.clearWidgets();
    this.clearErrors();
    this.widgets = pairs(newData || {}).map(p => {
      var [id, val] = p;
      var line = val[val.length - 1].line - 1;
      var container = ce('div', 'flex flex-wrap');

      var content = container.appendChild(ce('div', 'flex-auto'));
      var root = content.createShadowRoot();

      var typeToggle = container.appendChild(ce('div', 'pl1', ''));
      var select = typeToggle.appendChild(ce('select', 'py1 block field-light'));
      var json = select.appendChild(ce('option', '', 'json'));
      json.value = 'json';

      this.makeWidget(root, val);
      var widget = this.editor.addLineWidget(
        line, container, { coverGutter: false, noHScroll: true });
      if (container.onadd) container.onadd();
      return widget;
    });
  }

  setupEditor(element) {
    var editor = CodeMirror(function(elt) {
      element.parentNode.replaceChild(elt, element);
    }, { value: element.textContent || element.innerText }, {
      indentUnit: 2,
      mode: 'text/javascript',
      viewportMargin: Infinity,
      theme: 'default big'
    });
    return editor;
  }

  makeWidget(root, values) {
    var value = values[values.length - 1];
    try {
      this.fillWidget(root, value.val);
    } catch(e) { console.error(e); }
  }

  fillWidget(container, value) {
    container.appendChild(ce('style', '', '@import "css/basscss.css"'));
    var pre = container.appendChild(
      ce('pre', 'm0 px1 py1 bg-silver', JSON.stringify(value, null, 2)));
  }
}

module.exports = Paren;
