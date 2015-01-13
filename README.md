## rpl-www

The magic of [rpl](https://github.com/tmcw/rpl), as a JavaScript library that you
can embed in existing pages.

## Usage

Recommended usage is with [browserify](http://browserify.org/): this is a
browser-only library.

    npm install --save rpl-www

See the example `rpl-www.css` file for the necessary CSS, which includes
CSS for [CodeMirror](http://codemirror.net/) and rpl-www's custom line widgets.

## Example

```js
var Rpl = require('rpl-www');
new Rpl(element, {
  sandbox: { /* optional things to give in scope */ }
});
```

### `Rpl`

The main export is a constructor function that takes arguments of

* `element`: a div element on your page
* `options`: optional options. valid choices are:
  * `sandbox`: objects to be passed into Terrarium's sandbox parameter:
  this allows you to provide libraries or data into the Rpl context. Otherwise
  the Rpl context is fresh and does not persist any variables or grab any
  variables from the current context.
