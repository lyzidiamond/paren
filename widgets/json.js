function ce(_, c, inner) {
  var elem = document.createElement(_);
  elem.className = c || '';
  if (inner) elem.innerHTML = inner;
  return elem;
}

class JsonWidget {

  id: 'json'

  constructor(container, value) {
    container.appendChild(ce('style', '', '@import "css/basscss.css"'));
    this.pre = container.appendChild(ce('div', 'px1 py1 bg-silver'));
    this.update(value);
  }

  static applicable(value) {
    try {
      JSON.stringify(value);
      return true;
    } catch(e) {
      return false;
    }
  }

  update(value) {
    this.pre.innerHTML = JSON.stringify(value, null, 2);
  }

}

module.exports = JsonWidget;
