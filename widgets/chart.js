function ce(_, c, inner) {
  var elem = document.createElement(_);
  elem.className = c || '';
  if (inner) elem.innerHTML = inner;
  return elem;
}

class ChartWidget {

  id: 'chart'

  constructor(container, value) {
    this.div = container.appendChild(ce('div'));
    this.update(value);
  }

  static applicable(value) {
    return Array.isArray(value);
  }

  update(value) {
    vg.parse.spec(spec, chart => {
      try {
        var c = chart({
          el: this.div
        }).update();
      } catch(e) {
        this.div.style.display = 'none';
        console.error(e);
      }
    });
  }

}

module.exports = JsonWidget;
