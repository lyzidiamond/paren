function ce(_, c, inner) {
  var elem = document.createElement(_);
  elem.className = c || '';
  if (inner) elem.innerHTML = inner;
  return elem;
}

class ElementWidget {

  id: 'element'

  constructor(container, value) {
    container.appendChild(ce('style', '', '@import "css/basscss.css"'));
    this.container = container.appendChild(ce('div', 'px1 py1 bg-silver'));
    this.update(value);
  }

  static applicable(value) {
    return value && 'nodeType' in value;
  }

  update(value) {
    this.container.innerHTML = '';
    this.container.appendChild(value);
  }

}

module.exports = ElementWidget;
