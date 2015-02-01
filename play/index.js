var Rpl = require('../'),
  docs = require('./docs.json');

var rpl = new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf
  },
  tips: docs.functions.map(fToTip)
});



function fToTip(f) {
    return [f.name.replace('/', '.'), f.description];
}
