var Rpl = require('./');

new Rpl(document.getElementById('editor'), {
  sandbox: {
    turf: turf
  }
});
