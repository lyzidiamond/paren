var Rpl = require('../'),
  docs = require('./docs.json');

var bikeshare = require('./bikeshare_stations.json');
var business = require('./business_district.json');

var rpl = new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf,
    bikeshare: bikeshare,
    business: business
  },
  tips: docs.functions.map(fToTip)
});



function fToTip(f) {
    return [f.name.replace('/', '.'), f.description];
}
