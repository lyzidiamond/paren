# paren roadmap

('peeks' is what i'm currently calling 'outputs', like those you get from `//=` tags)

* The biggest decision point of paren is whether peeks should work vertically, like they do now, or horizontally,
  like they do in [light table](http://lighttable.com/). Horizontally would give us a little bit more predictability
  in text editing - changing an expression to yield a multiline result wouldn't 'pop' the contents below it
  down. But they're also trickier to implement - CodeMirror doesn't have a great API for checking the absolute position
  of lines, though with getClientBoundingRect we definitely could.
* Then the biggest thing is resolving changes to peeks: ideally if you have a map peek whose contents update
  and the code yields a new value, it smoothly calls `setGeoJSON()` instead of rebuilding it from scratch. This
  means that peeks need to track position, previous content, current content, and preference for formatter.
* For everyday coding, somewhat lightweight but very useful functionality is a jsbin-like ability to require
  external libraries like jQuery. There's also the requirebin()-esque approach of supporting require() statements
  but I've gone down this route and haven't found a way to make it performant.
* The biggest long-term concern is how to alleviate the editor-specificness of professional programmers. I would
  love if something like Atom.io were extensible in the way we need for this editor, but it isn't, and the same
  functionality it lacks (inline HTML annotations) is also lacking from vim and sublime text. That said,
  we don't need to immediately replace editors.
* Finally, a big long-term question is node compatibility: this works in `rpl` but I want to resolve this in a way
  that optimizes both for web distributability (really the only way you can effectively distribute software) but
  also node.
