var Rpl = require('../');

new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf
  },
  tips: [
    ['turf.point', 'Create a GeoJSON Point'],
    ['console.log', 'Console log is blah blah blah blah blah blah blah blah blah blah ']
  ]
});
