## paren

The magic of [rpl](https://github.com/tmcw/rpl), as a JavaScript library that you
can embed in existing pages.

This adds a textarea into your page, but more importantly a live-coding environment.
It'll surface errors, whether syntax or runtime, and using magic `//=` comments,
lets you display results of your programs in the same place as their code,
dramatically tightening the feedback loop of writing software and enabling
ideas like inline, live code examples.

Under the hood, most of the execution magic is in [Terrarium](https://github.com/tmcw/terrarium),
a library that instruments code with [esprima](http://esprima.org/) and
[escodegen](https://github.com/estools/escodegen) and runs it in `iframe` sandboxes.
The user-facing interface is powered by [CodeMirror](http://codemirror.net/)
and displays detected [GeoJSON](http://geojson.org/) data with
[Mapbox.js](https://www.mapbox.com/mapbox.js/).

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
  sandbox: { /* optional things to give in scope */ },
  tips: ["searchtext", "tipcontent"]
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
  * `tips` is an array of 2-element arrays of strings. It specifies specific
  terms, most likely funciton names, to document inline with CodeMirror's
  markText method.
