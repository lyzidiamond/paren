var Rpl = require('../');

new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf
  },
  tips: [
    ['turf.point', 'Create a GeoJSON Point']
  ]
});
