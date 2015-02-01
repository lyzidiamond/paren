var Rpl = require('../'),
  docs = require('./docs.json');

var fs = require('fs');

var template = fs.readFileSync(__dirname + '/template.html', 'utf8');

var rpl = new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf
  },
  exportBrowserTemplate: template,
  tips: docs.functions.map(fToTip)
});

document.getElementById('export-html').onclick = function() {
  document.getElementById('export').className = '';
  document.getElementById('export-content').innerText =
    template.replace('__RPL__', rpl.export('browser-export-fancy'));
};

function fToTip(f) {
    return [f.name.replace('/', '.'), f.description];
}
