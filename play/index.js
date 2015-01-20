var Rpl = require('../'),
  docs = require('./docs.json');

new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf
  },
  tips: docs.functions.map(fToTip)
});

function fToTip(f) {
    return [f.name.replace('/', '.'), f.description];
}
