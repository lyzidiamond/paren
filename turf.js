!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.turf=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Turf is a modular GIS engine written in JavaScript. It performs geospatial
 * processing tasks with GeoJSON data and can be run on a server or in a browser.
 *
 * @module turf
 * @summary GIS For Web Maps
 */
module.exports = {
  isClockwise: require('turf-is-clockwise'),
  isolines: require('turf-isolines'),
  isobands: require('turf-isobands'),
  merge: require('turf-merge'),
  convex: require('turf-convex'),
  within: require('turf-within'),
  concave: require('turf-concave'),
  count: require('turf-count'),
  erase: require('turf-erase'),
  variance: require('turf-variance'),
  deviation: require('turf-deviation'),
  median: require('turf-median'),
  min: require('turf-min'),
  max: require('turf-max'),
  aggregate: require('turf-aggregate'),
  flip: require('turf-flip'),
  simplify: require('turf-simplify'),
  sum: require('turf-sum'),
  average: require('turf-average'),
  bezier: require('turf-bezier'),
  tag: require('turf-tag'),
  size: require('turf-size'),
  sample: require('turf-sample'),
  jenks: require('turf-jenks'),
  quantile: require('turf-quantile'),
  envelope: require('turf-envelope'),
  square: require('turf-square'),
  midpoint: require('turf-midpoint'),
  buffer: require('turf-buffer'),
  center: require('turf-center'),
  centroid: require('turf-centroid'),
  combine: require('turf-combine'),
  distance: require('turf-distance'),
  explode: require('turf-explode'),
  extent: require('turf-extent'),
  bboxPolygon: require('turf-bbox-polygon'),
  featurecollection: require('turf-featurecollection'),
  filter: require('turf-filter'),
  grid: require('turf-grid'),
  inside: require('turf-inside'),
  intersect: require('turf-intersect'),
  linestring: require('turf-linestring'),
  nearest: require('turf-nearest'),
  planepoint: require('turf-planepoint'),
  point: require('turf-point'),
  polygon: require('turf-polygon'),
  reclass: require('turf-reclass'),
  remove: require('turf-remove'),
  tin: require('turf-tin'),
  union: require('turf-union'),
  bearing: require('turf-bearing'),
  destination: require('turf-destination'),
  hex: require('turf-hex'),
  kinks: require('turf-kinks'),
  pointOnSurface: require('turf-point-on-surface'),
  area: require('turf-area')
};

},{"turf-aggregate":6,"turf-area":29,"turf-average":32,"turf-bbox-polygon":33,"turf-bearing":35,"turf-bezier":36,"turf-buffer":38,"turf-center":43,"turf-centroid":44,"turf-combine":45,"turf-concave":46,"turf-convex":47,"turf-count":48,"turf-destination":50,"turf-deviation":51,"turf-distance":53,"turf-envelope":54,"turf-erase":59,"turf-explode":64,"turf-extent":68,"turf-featurecollection":70,"turf-filter":71,"turf-flip":72,"turf-grid":73,"turf-hex":74,"turf-inside":76,"turf-intersect":77,"turf-is-clockwise":82,"turf-isobands":83,"turf-isolines":92,"turf-jenks":101,"turf-kinks":103,"turf-linestring":104,"turf-max":105,"turf-median":107,"turf-merge":109,"turf-midpoint":111,"turf-min":112,"turf-nearest":114,"turf-planepoint":115,"turf-point":117,"turf-point-on-surface":116,"turf-polygon":118,"turf-quantile":119,"turf-reclass":121,"turf-remove":122,"turf-sample":123,"turf-simplify":124,"turf-size":126,"turf-square":127,"turf-sum":131,"turf-tag":134,"turf-tin":135,"turf-union":136,"turf-variance":141,"turf-within":143}],2:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Find the length
  var length
  if (type === 'number')
    length = subject > 0 ? subject >>> 0 : 0
  else if (type === 'string') {
    if (encoding === 'base64')
      subject = base64clean(subject)
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) { // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data))
      subject = subject.data
    length = +subject.length > 0 ? Math.floor(+subject.length) : 0
  } else
    throw new TypeError('must start with number, buffer, array or string')

  if (this.length > kMaxLength)
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
      'size: 0x' + kMaxLength.toString(16) + ' bytes')

  var buf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++)
        buf[i] = subject.readUInt8(i)
    } else {
      for (i = 0; i < length; i++)
        buf[i] = ((subject[i] % 256) + 256) % 256
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

Buffer.isBuffer = function (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
    throw new TypeError('Arguments must be Buffers')

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function (list, totalLength) {
  if (!isArray(list)) throw new TypeError('Usage: Buffer.concat(list[, length])')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase)
          throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function (b) {
  if(!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max)
      str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  return Buffer.compare(this, b)
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(byte)) throw new Error('Invalid hex string')
    buf[offset + i] = byte
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string), buf, offset, length, 2)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function binarySlice (buf, start, end) {
  return asciiSlice(buf, start, end)
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len;
    if (start < 0)
      start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0)
      end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start)
    end = start

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0)
    throw new RangeError('offset is not uint')
  if (offset + ext > length)
    throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80))
    return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  if (!noAssert)
    checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else objectWriteUInt16(this, value, offset, true)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else objectWriteUInt16(this, value, offset, false)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else objectWriteUInt32(this, value, offset, true)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert)
    checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else objectWriteUInt32(this, value, offset, false)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new TypeError('value is out of bounds')
  if (offset + ext > buf.length) throw new TypeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert)
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  if (end < start) throw new TypeError('sourceEnd < sourceStart')
  if (target_start < 0 || target_start >= target.length)
    throw new TypeError('targetStart out of bounds')
  if (start < 0 || start >= source.length) throw new TypeError('sourceStart out of bounds')
  if (end < 0 || end > source.length) throw new TypeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new TypeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new TypeError('start out of bounds')
  if (end < 0 || end > this.length) throw new TypeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F) {
      byteArray.push(b)
    } else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++) {
        byteArray.push(parseInt(h[j], 16))
      }
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length, unitSize) {
  if (unitSize) length -= length % unitSize;
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":3,"ieee754":4,"is-array":5}],3:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],4:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],5:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],6:[function(require,module,exports){
var average = require('turf-average');
var sum = require('turf-sum');
var median = require('turf-median');
var min = require('turf-min');
var max = require('turf-max');
var deviation = require('turf-deviation');
var variance = require('turf-variance');
var count = require('turf-count');
var operations = {};
operations.average = average;
operations.sum = sum;
operations.median = median;
operations.min = min;
operations.max = max;
operations.deviation = deviation;
operations.variance = variance;
operations.count = count;

module.exports = function(polygons, points, aggregations){
  for (var i = 0, len = aggregations.length; i < len; i++) {
    var agg = aggregations[i],
      operation = agg.aggregation,
      unrecognizedError;

    if (isAggregationOperation(operation)) {
      if (operation === 'count') {
        polygons = operations[operation](polygons, points, agg.outField);
      } else {
        polygons = operations[operation](polygons, points, agg.inField, agg.outField);
      }
    } else {
      return new Error('"'+ operation +'" is not a recognized aggregation operation.');
    }
  }

  return polygons;
}

function isAggregationOperation(operation) {
  return operation === 'average' ||
    operation === 'sum' ||
    operation === 'median' ||
    operation === 'min' ||
    operation === 'max' ||
    operation === 'deviation' ||
    operation === 'variance' ||
    operation === 'count';
}
},{"turf-average":7,"turf-count":9,"turf-deviation":11,"turf-max":14,"turf-median":17,"turf-min":20,"turf-sum":23,"turf-variance":26}],7:[function(require,module,exports){
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = average(values)
  })

  return polyFC;
}

function average(values) {
  var sum = 0;
  for (var i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
}

},{"turf-inside":8}],8:[function(require,module,exports){
// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

module.exports = function(point, polygon){
  var x = point.geometry.coordinates[0]
  var y = point.geometry.coordinates[1]
  var vs = polygon.geometry.coordinates[0]

  var isInside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    var xi = vs[i][0], yi = vs[i][1];
    var xj = vs[j][0], yj = vs[j][1];
    
    var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside
}


},{}],9:[function(require,module,exports){
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(1)
      }
    })
    poly.properties[outField] = values.length
  })

  return polyFC;
}

},{"turf-inside":10}],10:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],11:[function(require,module,exports){
var ss = require('simple-statistics')
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.standard_deviation(values)
  })

  return polyFC;
}

},{"simple-statistics":12,"turf-inside":13}],12:[function(require,module,exports){
/* global module */
// # simple-statistics
//
// A simple, literate statistics system. The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `simple-statistics` to `ss` in browsers or the
// `exports` object for node.js
(function() {
    var ss = {};

    if (typeof module !== 'undefined') {
        // Assign the `ss` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = ss;
    } else {
        // Otherwise, in a browser, we assign `ss` to the window object,
        // so you can simply refer to it as `ss`.
        this.ss = ss;
    }

    // # [Linear Regression](http://en.wikipedia.org/wiki/Linear_regression)
    //
    // [Simple linear regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
    // is a simple way to find a fitted line
    // between a set of coordinates.
    function linear_regression() {
        var linreg = {},
            data = [];

        // Assign data to the model. Data is assumed to be an array.
        linreg.data = function(x) {
            if (!arguments.length) return data;
            data = x.slice();
            return linreg;
        };

        // Calculate the slope and y-intercept of the regression line
        // by calculating the least sum of squares
        linreg.mb = function() {
            var m, b;

            // Store data length in a local variable to reduce
            // repeated object property lookups
            var data_length = data.length;

            //if there's only one point, arbitrarily choose a slope of 0
            //and a y-intercept of whatever the y of the initial point is
            if (data_length === 1) {
                m = 0;
                b = data[0][1];
            } else {
                // Initialize our sums and scope the `m` and `b`
                // variables that define the line.
                var sum_x = 0, sum_y = 0,
                    sum_xx = 0, sum_xy = 0;

                // Use local variables to grab point values
                // with minimal object property lookups
                var point, x, y;

                // Gather the sum of all x values, the sum of all
                // y values, and the sum of x^2 and (x*y) for each
                // value.
                //
                // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
                for (var i = 0; i < data_length; i++) {
                    point = data[i];
                    x = point[0];
                    y = point[1];

                    sum_x += x;
                    sum_y += y;

                    sum_xx += x * x;
                    sum_xy += x * y;
                }

                // `m` is the slope of the regression line
                m = ((data_length * sum_xy) - (sum_x * sum_y)) /
                    ((data_length * sum_xx) - (sum_x * sum_x));

                // `b` is the y-intercept of the line.
                b = (sum_y / data_length) - ((m * sum_x) / data_length);
            }

            // Return both values as an object.
            return { m: m, b: b };
        };

        // a shortcut for simply getting the slope of the regression line
        linreg.m = function() {
            return linreg.mb().m;
        };

        // a shortcut for simply getting the y-intercept of the regression
        // line.
        linreg.b = function() {
            return linreg.mb().b;
        };

        // ## Fitting The Regression Line
        //
        // This is called after `.data()` and returns the
        // equation `y = f(x)` which gives the position
        // of the regression line at each point in `x`.
        linreg.line = function() {

            // Get the slope, `m`, and y-intercept, `b`, of the line.
            var mb = linreg.mb(),
                m = mb.m,
                b = mb.b;

            // Return a function that computes a `y` value for each
            // x value it is given, based on the values of `b` and `a`
            // that we just computed.
            return function(x) {
                return b + (m * x);
            };
        };

        return linreg;
    }

    // # [R Squared](http://en.wikipedia.org/wiki/Coefficient_of_determination)
    //
    // The r-squared value of data compared with a function `f`
    // is the sum of the squared differences between the prediction
    // and the actual value.
    function r_squared(data, f) {
        if (data.length < 2) return 1;

        // Compute the average y value for the actual
        // data set in order to compute the
        // _total sum of squares_
        var sum = 0, average;
        for (var i = 0; i < data.length; i++) {
            sum += data[i][1];
        }
        average = sum / data.length;

        // Compute the total sum of squares - the
        // squared difference between each point
        // and the average of all points.
        var sum_of_squares = 0;
        for (var j = 0; j < data.length; j++) {
            sum_of_squares += Math.pow(average - data[j][1], 2);
        }

        // Finally estimate the error: the squared
        // difference between the estimate and the actual data
        // value at each point.
        var err = 0;
        for (var k = 0; k < data.length; k++) {
            err += Math.pow(data[k][1] - f(data[k][0]), 2);
        }

        // As the error grows larger, its ratio to the
        // sum of squares increases and the r squared
        // value grows lower.
        return 1 - (err / sum_of_squares);
    }


    // # [Bayesian Classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier)
    //
    // This is a naïve bayesian classifier that takes
    // singly-nested objects.
    function bayesian() {
        // The `bayes_model` object is what will be exposed
        // by this closure, with all of its extended methods, and will
        // have access to all scope variables, like `total_count`.
        var bayes_model = {},
            // The number of items that are currently
            // classified in the model
            total_count = 0,
            // Every item classified in the model
            data = {};

        // ## Train
        // Train the classifier with a new item, which has a single
        // dimension of Javascript literal keys and values.
        bayes_model.train = function(item, category) {
            // If the data object doesn't have any values
            // for this category, create a new object for it.
            if (!data[category]) data[category] = {};

            // Iterate through each key in the item.
            for (var k in item) {
                var v = item[k];
                // Initialize the nested object `data[category][k][item[k]]`
                // with an object of keys that equal 0.
                if (data[category][k] === undefined) data[category][k] = {};
                if (data[category][k][v] === undefined) data[category][k][v] = 0;

                // And increment the key for this key/value combination.
                data[category][k][item[k]]++;
            }
            // Increment the number of items classified
            total_count++;
        };

        // ## Score
        // Generate a score of how well this item matches all
        // possible categories based on its attributes
        bayes_model.score = function(item) {
            // Initialize an empty array of odds per category.
            var odds = {}, category;
            // Iterate through each key in the item,
            // then iterate through each category that has been used
            // in previous calls to `.train()`
            for (var k in item) {
                var v = item[k];
                for (category in data) {
                    // Create an empty object for storing key - value combinations
                    // for this category.
                    if (odds[category] === undefined) odds[category] = {};

                    // If this item doesn't even have a property, it counts for nothing,
                    // but if it does have the property that we're looking for from
                    // the item to categorize, it counts based on how popular it is
                    // versus the whole population.
                    if (data[category][k]) {
                        odds[category][k + '_' + v] = (data[category][k][v] || 0) / total_count;
                    } else {
                        odds[category][k + '_' + v] = 0;
                    }
                }
            }

            // Set up a new object that will contain sums of these odds by category
            var odds_sums = {};

            for (category in odds) {
                // Tally all of the odds for each category-combination pair -
                // the non-existence of a category does not add anything to the
                // score.
                for (var combination in odds[category]) {
                    if (odds_sums[category] === undefined) odds_sums[category] = 0;
                    odds_sums[category] += odds[category][combination];
                }
            }

            return odds_sums;
        };

        // Return the completed model.
        return bayes_model;
    }

    // # sum
    //
    // is simply the result of adding all numbers
    // together, starting from zero.
    //
    // This runs on `O(n)`, linear time in respect to the array
    function sum(x) {
        var value = 0;
        for (var i = 0; i < x.length; i++) {
            value += x[i];
        }
        return value;
    }

    // # mean
    //
    // is the sum over the number of values
    //
    // This runs on `O(n)`, linear time in respect to the array
    function mean(x) {
        // The mean of no numbers is null
        if (x.length === 0) return null;

        return sum(x) / x.length;
    }

    // # geometric mean
    //
    // a mean function that is more useful for numbers in different
    // ranges.
    //
    // this is the nth root of the input numbers multiplied by each other
    //
    // This runs on `O(n)`, linear time in respect to the array
    function geometric_mean(x) {
        // The mean of no numbers is null
        if (x.length === 0) return null;

        // the starting value.
        var value = 1;

        for (var i = 0; i < x.length; i++) {
            // the geometric mean is only valid for positive numbers
            if (x[i] <= 0) return null;

            // repeatedly multiply the value by each number
            value *= x[i];
        }

        return Math.pow(value, 1 / x.length);
    }


    // # harmonic mean
    //
    // a mean function typically used to find the average of rates
    //
    // this is the reciprocal of the arithmetic mean of the reciprocals
    // of the input numbers
    //
    // This runs on `O(n)`, linear time in respect to the array
    function harmonic_mean(x) {
        // The mean of no numbers is null
        if (x.length === 0) return null;

        var reciprocal_sum = 0;

        for (var i = 0; i < x.length; i++) {
            // the harmonic mean is only valid for positive numbers
            if (x[i] <= 0) return null;

            reciprocal_sum += 1 / x[i];
        }

        // divide n by the the reciprocal sum
        return x.length / reciprocal_sum;
    }


    // # min
    //
    // This is simply the minimum number in the set.
    //
    // This runs on `O(n)`, linear time in respect to the array
    function min(x) {
        var value;
        for (var i = 0; i < x.length; i++) {
            // On the first iteration of this loop, min is
            // undefined and is thus made the minimum element in the array
            if (x[i] < value || value === undefined) value = x[i];
        }
        return value;
    }

    // # max
    //
    // This is simply the maximum number in the set.
    //
    // This runs on `O(n)`, linear time in respect to the array
    function max(x) {
        var value;
        for (var i = 0; i < x.length; i++) {
            // On the first iteration of this loop, max is
            // undefined and is thus made the maximum element in the array
            if (x[i] > value || value === undefined) value = x[i];
        }
        return value;
    }

    // # [variance](http://en.wikipedia.org/wiki/Variance)
    //
    // is the sum of squared deviations from the mean
    //
    // depends on `mean()`
    function variance(x) {
        // The variance of no numbers is null
        if (x.length === 0) return null;

        var mean_value = mean(x),
            deviations = [];

        // Make a list of squared deviations from the mean.
        for (var i = 0; i < x.length; i++) {
            deviations.push(Math.pow(x[i] - mean_value, 2));
        }

        // Find the mean value of that list
        return mean(deviations);
    }

    // # [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
    //
    // is just the square root of the variance.
    //
    // depends on `variance()`
    function standard_deviation(x) {
        // The standard deviation of no numbers is null
        if (x.length === 0) return null;

        return Math.sqrt(variance(x));
    }

    // The sum of deviations to the Nth power.
    // When n=2 it's the sum of squared deviations.
    // When n=3 it's the sum of cubed deviations.
    //
    // depends on `mean()`
    function sum_nth_power_deviations(x, n) {
        var mean_value = mean(x),
            sum = 0;

        for (var i = 0; i < x.length; i++) {
            sum += Math.pow(x[i] - mean_value, n);
        }

        return sum;
    }

    // # [variance](http://en.wikipedia.org/wiki/Variance)
    //
    // is the sum of squared deviations from the mean
    //
    // depends on `sum_nth_power_deviations`
    function sample_variance(x) {
        // The variance of no numbers is null
        if (x.length <= 1) return null;

        var sum_squared_deviations_value = sum_nth_power_deviations(x, 2);

        // Find the mean value of that list
        return sum_squared_deviations_value / (x.length - 1);
    }

    // # [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
    //
    // is just the square root of the variance.
    //
    // depends on `sample_variance()`
    function sample_standard_deviation(x) {
        // The standard deviation of no numbers is null
        if (x.length <= 1) return null;

        return Math.sqrt(sample_variance(x));
    }

    // # [covariance](http://en.wikipedia.org/wiki/Covariance)
    //
    // sample covariance of two datasets:
    // how much do the two datasets move together?
    // x and y are two datasets, represented as arrays of numbers.
    //
    // depends on `mean()`
    function sample_covariance(x, y) {

        // The two datasets must have the same length which must be more than 1
        if (x.length <= 1 || x.length != y.length){
            return null;
        }

        // determine the mean of each dataset so that we can judge each
        // value of the dataset fairly as the difference from the mean. this
        // way, if one dataset is [1, 2, 3] and [2, 3, 4], their covariance
        // does not suffer because of the difference in absolute values
        var xmean = mean(x),
            ymean = mean(y),
            sum = 0;

        // for each pair of values, the covariance increases when their
        // difference from the mean is associated - if both are well above
        // or if both are well below
        // the mean, the covariance increases significantly.
        for (var i = 0; i < x.length; i++){
            sum += (x[i] - xmean) * (y[i] - ymean);
        }

        // the covariance is weighted by the length of the datasets.
        return sum / (x.length - 1);
    }

    // # [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence)
    //
    // Gets a measure of how correlated two datasets are, between -1 and 1
    //
    // depends on `sample_standard_deviation()` and `sample_covariance()`
    function sample_correlation(x, y) {
        var cov = sample_covariance(x, y),
            xstd = sample_standard_deviation(x),
            ystd = sample_standard_deviation(y);

        if (cov === null || xstd === null || ystd === null) {
            return null;
        }

        return cov / xstd / ystd;
    }

    // # [median](http://en.wikipedia.org/wiki/Median)
    //
    // The middle number of a list. This is often a good indicator of 'the middle'
    // when there are outliers that skew the `mean()` value.
    function median(x) {
        // The median of an empty list is null
        if (x.length === 0) return null;

        // Sorting the array makes it easy to find the center, but
        // use `.slice()` to ensure the original array `x` is not modified
        var sorted = x.slice().sort(function (a, b) { return a - b; });

        // If the length of the list is odd, it's the central number
        if (sorted.length % 2 === 1) {
            return sorted[(sorted.length - 1) / 2];
        // Otherwise, the median is the average of the two numbers
        // at the center of the list
        } else {
            var a = sorted[(sorted.length / 2) - 1];
            var b = sorted[(sorted.length / 2)];
            return (a + b) / 2;
        }
    }

    // # [mode](http://bit.ly/W5K4Yt)
    //
    // The mode is the number that appears in a list the highest number of times.
    // There can be multiple modes in a list: in the event of a tie, this
    // algorithm will return the most recently seen mode.
    //
    // This implementation is inspired by [science.js](https://github.com/jasondavies/science.js/blob/master/src/stats/mode.js)
    //
    // This runs on `O(n)`, linear time in respect to the array
    function mode(x) {

        // Handle edge cases:
        // The median of an empty list is null
        if (x.length === 0) return null;
        else if (x.length === 1) return x[0];

        // Sorting the array lets us iterate through it below and be sure
        // that every time we see a new number it's new and we'll never
        // see the same number twice
        var sorted = x.slice().sort(function (a, b) { return a - b; });

        // This assumes it is dealing with an array of size > 1, since size
        // 0 and 1 are handled immediately. Hence it starts at index 1 in the
        // array.
        var last = sorted[0],
            // store the mode as we find new modes
            value,
            // store how many times we've seen the mode
            max_seen = 0,
            // how many times the current candidate for the mode
            // has been seen
            seen_this = 1;

        // end at sorted.length + 1 to fix the case in which the mode is
        // the highest number that occurs in the sequence. the last iteration
        // compares sorted[i], which is undefined, to the highest number
        // in the series
        for (var i = 1; i < sorted.length + 1; i++) {
            // we're seeing a new number pass by
            if (sorted[i] !== last) {
                // the last number is the new mode since we saw it more
                // often than the old one
                if (seen_this > max_seen) {
                    max_seen = seen_this;
                    value = last;
                }
                seen_this = 1;
                last = sorted[i];
            // if this isn't a new number, it's one more occurrence of
            // the potential mode
            } else { seen_this++; }
        }
        return value;
    }

    // # [t-test](http://en.wikipedia.org/wiki/Student's_t-test)
    //
    // This is to compute a one-sample t-test, comparing the mean
    // of a sample to a known value, x.
    //
    // in this case, we're trying to determine whether the
    // population mean is equal to the value that we know, which is `x`
    // here. usually the results here are used to look up a
    // [p-value](http://en.wikipedia.org/wiki/P-value), which, for
    // a certain level of significance, will let you determine that the
    // null hypothesis can or cannot be rejected.
    //
    // Depends on `standard_deviation()` and `mean()`
    function t_test(sample, x) {
        // The mean of the sample
        var sample_mean = mean(sample);

        // The standard deviation of the sample
        var sd = standard_deviation(sample);

        // Square root the length of the sample
        var rootN = Math.sqrt(sample.length);

        // Compute the known value against the sample,
        // returning the t value
        return (sample_mean - x) / (sd / rootN);
    }

    // # [2-sample t-test](http://en.wikipedia.org/wiki/Student's_t-test)
    //
    // This is to compute two sample t-test.
    // Tests whether "mean(X)-mean(Y) = difference", (
    // in the most common case, we often have `difference == 0` to test if two samples
    // are likely to be taken from populations with the same mean value) with
    // no prior knowledge on standard deviations of both samples
    // other than the fact that they have the same standard deviation.
    //
    // Usually the results here are used to look up a
    // [p-value](http://en.wikipedia.org/wiki/P-value), which, for
    // a certain level of significance, will let you determine that the
    // null hypothesis can or cannot be rejected.
    //
    // `diff` can be omitted if it equals 0.
    //
    // [This is used to confirm or deny](http://www.monarchlab.org/Lab/Research/Stats/2SampleT.aspx)
    // a null hypothesis that the two populations that have been sampled into
    // `sample_x` and `sample_y` are equal to each other.
    //
    // Depends on `sample_variance()` and `mean()`
    function t_test_two_sample(sample_x, sample_y, difference) {
        var n = sample_x.length,
            m = sample_y.length;

        // If either sample doesn't actually have any values, we can't
        // compute this at all, so we return `null`.
        if (!n || !m) return null ;

        // default difference (mu) is zero
        if (!difference) difference = 0;

        var meanX = mean(sample_x),
            meanY = mean(sample_y);

        var weightedVariance = ((n - 1) * sample_variance(sample_x) +
            (m - 1) * sample_variance(sample_y)) / (n + m - 2);

        return (meanX - meanY - difference) /
            Math.sqrt(weightedVariance * (1 / n + 1 / m));
    }

    // # quantile
    //
    // This is a population quantile, since we assume to know the entire
    // dataset in this library. Thus I'm trying to follow the
    // [Quantiles of a Population](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
    // algorithm from wikipedia.
    //
    // Sample is a one-dimensional array of numbers,
    // and p is either a decimal number from 0 to 1 or an array of decimal
    // numbers from 0 to 1.
    // In terms of a k/q quantile, p = k/q - it's just dealing with fractions or dealing
    // with decimal values.
    // When p is an array, the result of the function is also an array containing the appropriate
    // quantiles in input order
    function quantile(sample, p) {

        // We can't derive quantiles from an empty list
        if (sample.length === 0) return null;

        // Sort a copy of the array. We'll need a sorted array to index
        // the values in sorted order.
        var sorted = sample.slice().sort(function (a, b) { return a - b; });

        if (p.length) {
            // Initialize the result array
            var results = [];
            // For each requested quantile
            for (var i = 0; i < p.length; i++) {
                results[i] = quantile_sorted(sorted, p[i]);
            }
            return results;
        } else {
            return quantile_sorted(sorted, p);
        }
    }

    // # quantile
    //
    // This is the internal implementation of quantiles: when you know
    // that the order is sorted, you don't need to re-sort it, and the computations
    // are much faster.
    function quantile_sorted(sample, p) {
        var idx = (sample.length) * p;
        if (p < 0 || p > 1) {
            return null;
        } else if (p === 1) {
            // If p is 1, directly return the last element
            return sample[sample.length - 1];
        } else if (p === 0) {
            // If p is 0, directly return the first element
            return sample[0];
        } else if (idx % 1 !== 0) {
            // If p is not integer, return the next element in array
            return sample[Math.ceil(idx) - 1];
        } else if (sample.length % 2 === 0) {
            // If the list has even-length, we'll take the average of this number
            // and the next value, if there is one
            return (sample[idx - 1] + sample[idx]) / 2;
        } else {
            // Finally, in the simple case of an integer value
            // with an odd-length list, return the sample value at the index.
            return sample[idx];
        }
    }

    // # [Interquartile range](http://en.wikipedia.org/wiki/Interquartile_range)
    //
    // A measure of statistical dispersion, or how scattered, spread, or
    // concentrated a distribution is. It's computed as the difference between
    // the third quartile and first quartile.
    function iqr(sample) {
        // We can't derive quantiles from an empty list
        if (sample.length === 0) return null;

        // Interquartile range is the span between the upper quartile,
        // at `0.75`, and lower quartile, `0.25`
        return quantile(sample, 0.75) - quantile(sample, 0.25);
    }

    // # [Median Absolute Deviation](http://en.wikipedia.org/wiki/Median_absolute_deviation)
    //
    // The Median Absolute Deviation (MAD) is a robust measure of statistical
    // dispersion. It is more resilient to outliers than the standard deviation.
    function mad(x) {
        // The mad of nothing is null
        if (!x || x.length === 0) return null;

        var median_value = median(x),
            median_absolute_deviations = [];

        // Make a list of absolute deviations from the median
        for (var i = 0; i < x.length; i++) {
            median_absolute_deviations.push(Math.abs(x[i] - median_value));
        }

        // Find the median value of that list
        return median(median_absolute_deviations);
    }

    // ## Compute Matrices for Jenks
    //
    // Compute the matrices required for Jenks breaks. These matrices
    // can be used for any classing of data with `classes <= n_classes`
    function jenksMatrices(data, n_classes) {

        // in the original implementation, these matrices are referred to
        // as `LC` and `OP`
        //
        // * lower_class_limits (LC): optimal lower class limits
        // * variance_combinations (OP): optimal variance combinations for all classes
        var lower_class_limits = [],
            variance_combinations = [],
            // loop counters
            i, j,
            // the variance, as computed at each step in the calculation
            variance = 0;

        // Initialize and fill each matrix with zeroes
        for (i = 0; i < data.length + 1; i++) {
            var tmp1 = [], tmp2 = [];
            // despite these arrays having the same values, we need
            // to keep them separate so that changing one does not change
            // the other
            for (j = 0; j < n_classes + 1; j++) {
                tmp1.push(0);
                tmp2.push(0);
            }
            lower_class_limits.push(tmp1);
            variance_combinations.push(tmp2);
        }

        for (i = 1; i < n_classes + 1; i++) {
            lower_class_limits[1][i] = 1;
            variance_combinations[1][i] = 0;
            // in the original implementation, 9999999 is used but
            // since Javascript has `Infinity`, we use that.
            for (j = 2; j < data.length + 1; j++) {
                variance_combinations[j][i] = Infinity;
            }
        }

        for (var l = 2; l < data.length + 1; l++) {

            // `SZ` originally. this is the sum of the values seen thus
            // far when calculating variance.
            var sum = 0,
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                sum_squares = 0,
                // `WT` originally. This is the number of
                w = 0,
                // `IV` originally
                i4 = 0;

            // in several instances, you could say `Math.pow(x, 2)`
            // instead of `x * x`, but this is slower in some browsers
            // introduces an unnecessary concept.
            for (var m = 1; m < l + 1; m++) {

                // `III` originally
                var lower_class_limit = l - m + 1,
                    val = data[lower_class_limit - 1];

                // here we're estimating variance for each potential classing
                // of the data, for each potential number of classes. `w`
                // is the number of data points considered so far.
                w++;

                // increase the current sum and sum-of-squares
                sum += val;
                sum_squares += val * val;

                // the variance at this point in the sequence is the difference
                // between the sum of squares and the total x 2, over the number
                // of samples.
                variance = sum_squares - (sum * sum) / w;

                i4 = lower_class_limit - 1;

                if (i4 !== 0) {
                    for (j = 2; j < n_classes + 1; j++) {
                        // if adding this element to an existing class
                        // will increase its variance beyond the limit, break
                        // the class at this point, setting the `lower_class_limit`
                        // at this point.
                        if (variance_combinations[l][j] >=
                            (variance + variance_combinations[i4][j - 1])) {
                            lower_class_limits[l][j] = lower_class_limit;
                            variance_combinations[l][j] = variance +
                                variance_combinations[i4][j - 1];
                        }
                    }
                }
            }

            lower_class_limits[l][1] = 1;
            variance_combinations[l][1] = variance;
        }

        // return the two matrices. for just providing breaks, only
        // `lower_class_limits` is needed, but variances can be useful to
        // evaluate goodness of fit.
        return {
            lower_class_limits: lower_class_limits,
            variance_combinations: variance_combinations
        };
    }

    // ## Pull Breaks Values for Jenks
    //
    // the second part of the jenks recipe: take the calculated matrices
    // and derive an array of n breaks.
    function jenksBreaks(data, lower_class_limits, n_classes) {

        var k = data.length - 1,
            kclass = [],
            countNum = n_classes;

        // the calculation of classes will never include the upper and
        // lower bounds, so we need to explicitly set them
        kclass[n_classes] = data[data.length - 1];
        kclass[0] = data[0];

        // the lower_class_limits matrix is used as indices into itself
        // here: the `k` variable is reused in each iteration.
        while (countNum > 1) {
            kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
            k = lower_class_limits[k][countNum] - 1;
            countNum--;
        }

        return kclass;
    }

    // # [Jenks natural breaks optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
    //
    // Implementations: [1](http://danieljlewis.org/files/2010/06/Jenks.pdf) (python),
    // [2](https://github.com/vvoovv/djeo-jenks/blob/master/main.js) (buggy),
    // [3](https://github.com/simogeo/geostats/blob/master/lib/geostats.js#L407) (works)
    //
    // Depends on `jenksBreaks()` and `jenksMatrices()`
    function jenks(data, n_classes) {

        if (n_classes > data.length) return null;

        // sort data in numerical order, since this is expected
        // by the matrices function
        data = data.slice().sort(function (a, b) { return a - b; });

        // get our basic matrices
        var matrices = jenksMatrices(data, n_classes),
            // we only need lower class limits here
            lower_class_limits = matrices.lower_class_limits;

        // extract n_classes out of the computed matrices
        return jenksBreaks(data, lower_class_limits, n_classes);

    }

    // # [Skewness](http://en.wikipedia.org/wiki/Skewness)
    //
    // A measure of the extent to which a probability distribution of a
    // real-valued random variable "leans" to one side of the mean.
    // The skewness value can be positive or negative, or even undefined.
    //
    // Implementation is based on the adjusted Fisher-Pearson standardized
    // moment coefficient, which is the version found in Excel and several
    // statistical packages including Minitab, SAS and SPSS.
    //
    // Depends on `sum_nth_power_deviations()` and `sample_standard_deviation`
    function sample_skewness(x) {
        // The skewness of less than three arguments is null
        if (x.length < 3) return null;

        var n = x.length,
            cubed_s = Math.pow(sample_standard_deviation(x), 3),
            sum_cubed_deviations = sum_nth_power_deviations(x, 3);

        return n * sum_cubed_deviations / ((n - 1) * (n - 2) * cubed_s);
    }

    // # Standard Normal Table
    // A standard normal table, also called the unit normal table or Z table,
    // is a mathematical table for the values of Φ (phi), which are the values of
    // the cumulative distribution function of the normal distribution.
    // It is used to find the probability that a statistic is observed below,
    // above, or between values on the standard normal distribution, and by
    // extension, any normal distribution.
    //
    // The probabilities are taken from http://en.wikipedia.org/wiki/Standard_normal_table
    // The table used is the cumulative, and not cumulative from 0 to mean
    // (even though the latter has 5 digits precision, instead of 4).
    var standard_normal_table = [
        /*  z      0.00    0.01    0.02    0.03    0.04    0.05    0.06    0.07    0.08    0.09 */
        /* 0.0 */
        0.5000, 0.5040, 0.5080, 0.5120, 0.5160, 0.5199, 0.5239, 0.5279, 0.5319, 0.5359,
        /* 0.1 */
        0.5398, 0.5438, 0.5478, 0.5517, 0.5557, 0.5596, 0.5636, 0.5675, 0.5714, 0.5753,
        /* 0.2 */
        0.5793, 0.5832, 0.5871, 0.5910, 0.5948, 0.5987, 0.6026, 0.6064, 0.6103, 0.6141,
        /* 0.3 */
        0.6179, 0.6217, 0.6255, 0.6293, 0.6331, 0.6368, 0.6406, 0.6443, 0.6480, 0.6517,
        /* 0.4 */
        0.6554, 0.6591, 0.6628, 0.6664, 0.6700, 0.6736, 0.6772, 0.6808, 0.6844, 0.6879,
        /* 0.5 */
        0.6915, 0.6950, 0.6985, 0.7019, 0.7054, 0.7088, 0.7123, 0.7157, 0.7190, 0.7224,
        /* 0.6 */
        0.7257, 0.7291, 0.7324, 0.7357, 0.7389, 0.7422, 0.7454, 0.7486, 0.7517, 0.7549,
        /* 0.7 */
        0.7580, 0.7611, 0.7642, 0.7673, 0.7704, 0.7734, 0.7764, 0.7794, 0.7823, 0.7852,
        /* 0.8 */
        0.7881, 0.7910, 0.7939, 0.7967, 0.7995, 0.8023, 0.8051, 0.8078, 0.8106, 0.8133,
        /* 0.9 */
        0.8159, 0.8186, 0.8212, 0.8238, 0.8264, 0.8289, 0.8315, 0.8340, 0.8365, 0.8389,
        /* 1.0 */
        0.8413, 0.8438, 0.8461, 0.8485, 0.8508, 0.8531, 0.8554, 0.8577, 0.8599, 0.8621,
        /* 1.1 */
        0.8643, 0.8665, 0.8686, 0.8708, 0.8729, 0.8749, 0.8770, 0.8790, 0.8810, 0.8830,
        /* 1.2 */
        0.8849, 0.8869, 0.8888, 0.8907, 0.8925, 0.8944, 0.8962, 0.8980, 0.8997, 0.9015,
        /* 1.3 */
        0.9032, 0.9049, 0.9066, 0.9082, 0.9099, 0.9115, 0.9131, 0.9147, 0.9162, 0.9177,
        /* 1.4 */
        0.9192, 0.9207, 0.9222, 0.9236, 0.9251, 0.9265, 0.9279, 0.9292, 0.9306, 0.9319,
        /* 1.5 */
        0.9332, 0.9345, 0.9357, 0.9370, 0.9382, 0.9394, 0.9406, 0.9418, 0.9429, 0.9441,
        /* 1.6 */
        0.9452, 0.9463, 0.9474, 0.9484, 0.9495, 0.9505, 0.9515, 0.9525, 0.9535, 0.9545,
        /* 1.7 */
        0.9554, 0.9564, 0.9573, 0.9582, 0.9591, 0.9599, 0.9608, 0.9616, 0.9625, 0.9633,
        /* 1.8 */
        0.9641, 0.9649, 0.9656, 0.9664, 0.9671, 0.9678, 0.9686, 0.9693, 0.9699, 0.9706,
        /* 1.9 */
        0.9713, 0.9719, 0.9726, 0.9732, 0.9738, 0.9744, 0.9750, 0.9756, 0.9761, 0.9767,
        /* 2.0 */
        0.9772, 0.9778, 0.9783, 0.9788, 0.9793, 0.9798, 0.9803, 0.9808, 0.9812, 0.9817,
        /* 2.1 */
        0.9821, 0.9826, 0.9830, 0.9834, 0.9838, 0.9842, 0.9846, 0.9850, 0.9854, 0.9857,
        /* 2.2 */
        0.9861, 0.9864, 0.9868, 0.9871, 0.9875, 0.9878, 0.9881, 0.9884, 0.9887, 0.9890,
        /* 2.3 */
        0.9893, 0.9896, 0.9898, 0.9901, 0.9904, 0.9906, 0.9909, 0.9911, 0.9913, 0.9916,
        /* 2.4 */
        0.9918, 0.9920, 0.9922, 0.9925, 0.9927, 0.9929, 0.9931, 0.9932, 0.9934, 0.9936,
        /* 2.5 */
        0.9938, 0.9940, 0.9941, 0.9943, 0.9945, 0.9946, 0.9948, 0.9949, 0.9951, 0.9952,
        /* 2.6 */
        0.9953, 0.9955, 0.9956, 0.9957, 0.9959, 0.9960, 0.9961, 0.9962, 0.9963, 0.9964,
        /* 2.7 */
        0.9965, 0.9966, 0.9967, 0.9968, 0.9969, 0.9970, 0.9971, 0.9972, 0.9973, 0.9974,
        /* 2.8 */
        0.9974, 0.9975, 0.9976, 0.9977, 0.9977, 0.9978, 0.9979, 0.9979, 0.9980, 0.9981,
        /* 2.9 */
        0.9981, 0.9982, 0.9982, 0.9983, 0.9984, 0.9984, 0.9985, 0.9985, 0.9986, 0.9986,
        /* 3.0 */
        0.9987, 0.9987, 0.9987, 0.9988, 0.9988, 0.9989, 0.9989, 0.9989, 0.9990, 0.9990
    ];

    // # [Cumulative Standard Normal Probability](http://en.wikipedia.org/wiki/Standard_normal_table)
    //
    // Since probability tables cannot be
    // printed for every normal distribution, as there are an infinite variety
    // of normal distributions, it is common practice to convert a normal to a
    // standard normal and then use the standard normal table to find probabilities
    function cumulative_std_normal_probability(z) {

        // Calculate the position of this value.
        var absZ = Math.abs(z),
            // Each row begins with a different
            // significant digit: 0.5, 0.6, 0.7, and so on. So the row is simply
            // this value's significant digit: 0.567 will be in row 0, so row=0,
            // 0.643 will be in row 1, so row=10.
            row = Math.floor(absZ * 10),
            column = 10 * (Math.floor(absZ * 100) / 10 - Math.floor(absZ * 100 / 10)),
            index = Math.min((row * 10) + column, standard_normal_table.length - 1);

        // The index we calculate must be in the table as a positive value,
        // but we still pay attention to whether the input is positive
        // or negative, and flip the output value as a last step.
        if (z >= 0) {
            return standard_normal_table[index];
        } else {
            // due to floating-point arithmetic, values in the table with
            // 4 significant figures can nevertheless end up as repeating
            // fractions when they're computed here.
            return +(1 - standard_normal_table[index]).toFixed(4);
        }
    }

    // # [Z-Score, or Standard Score](http://en.wikipedia.org/wiki/Standard_score)
    //
    // The standard score is the number of standard deviations an observation
    // or datum is above or below the mean. Thus, a positive standard score
    // represents a datum above the mean, while a negative standard score
    // represents a datum below the mean. It is a dimensionless quantity
    // obtained by subtracting the population mean from an individual raw
    // score and then dividing the difference by the population standard
    // deviation.
    //
    // The z-score is only defined if one knows the population parameters;
    // if one only has a sample set, then the analogous computation with
    // sample mean and sample standard deviation yields the
    // Student's t-statistic.
    function z_score(x, mean, standard_deviation) {
        return (x - mean) / standard_deviation;
    }

    // We use `ε`, epsilon, as a stopping criterion when we want to iterate
    // until we're "close enough".
    var epsilon = 0.0001;

    // # [Factorial](https://en.wikipedia.org/wiki/Factorial)
    //
    // A factorial, usually written n!, is the product of all positive
    // integers less than or equal to n. Often factorial is implemented
    // recursively, but this iterative approach is significantly faster
    // and simpler.
    function factorial(n) {

        // factorial is mathematically undefined for negative numbers
        if (n < 0 ) { return null; }

        // typically you'll expand the factorial function going down, like
        // 5! = 5 * 4 * 3 * 2 * 1. This is going in the opposite direction,
        // counting from 2 up to the number in question, and since anything
        // multiplied by 1 is itself, the loop only needs to start at 2.
        var accumulator = 1;
        for (var i = 2; i <= n; i++) {
            // for each number up to and including the number `n`, multiply
            // the accumulator my that number.
            accumulator *= i;
        }
        return accumulator;
    }

    // # Bernoulli Distribution
    //
    // The [Bernoulli distribution](http://en.wikipedia.org/wiki/Bernoulli_distribution)
    // is the probability discrete
    // distribution of a random variable which takes value 1 with success
    // probability `p` and value 0 with failure
    // probability `q` = 1 - `p`. It can be used, for example, to represent the
    // toss of a coin, where "1" is defined to mean "heads" and "0" is defined
    // to mean "tails" (or vice versa). It is
    // a special case of a Binomial Distribution
    // where `n` = 1.
    function bernoulli_distribution(p) {
        // Check that `p` is a valid probability (0 ≤ p ≤ 1)
        if (p < 0 || p > 1 ) { return null; }

        return binomial_distribution(1, p);
    }

    // # Binomial Distribution
    //
    // The [Binomial Distribution](http://en.wikipedia.org/wiki/Binomial_distribution) is the discrete probability
    // distribution of the number of successes in a sequence of n independent yes/no experiments, each of which yields
    // success with probability `probability`. Such a success/failure experiment is also called a Bernoulli experiment or
    // Bernoulli trial; when trials = 1, the Binomial Distribution is a Bernoulli Distribution.
    function binomial_distribution(trials, probability) {
        // Check that `p` is a valid probability (0 ≤ p ≤ 1),
        // that `n` is an integer, strictly positive.
        if (probability < 0 || probability > 1 ||
            trials <= 0 || trials % 1 !== 0) {
            return null;
        }

        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        function probability_mass(x, trials, probability) {
            return factorial(trials) /
                (factorial(x) * factorial(trials - x)) *
                (Math.pow(probability, x) * Math.pow(1 - probability, trials - x));
        }

        // We initialize `x`, the random variable, and `accumulator`, an accumulator
        // for the cumulative distribution function to 0. `distribution_functions`
        // is the object we'll return with the `probability_of_x` and the
        // `cumulative_probability_of_x`, as well as the calculated mean &
        // variance. We iterate until the `cumulative_probability_of_x` is
        // within `epsilon` of 1.0.
        var x = 0,
            cumulative_probability = 0,
            cells = {};

        // This algorithm iterates through each potential outcome,
        // until the `cumulative_probability` is very close to 1, at
        // which point we've defined the vast majority of outcomes
        do {
            cells[x] = probability_mass(x, trials, probability);
            cumulative_probability += cells[x];
            x++;
        // when the cumulative_probability is nearly 1, we've calculated
        // the useful range of this distribution
        } while (cumulative_probability < 1 - epsilon);

        return cells;
    }

    // # Poisson Distribution
    //
    // The [Poisson Distribution](http://en.wikipedia.org/wiki/Poisson_distribution)
    // is a discrete probability distribution that expresses the probability
    // of a given number of events occurring in a fixed interval of time
    // and/or space if these events occur with a known average rate and
    // independently of the time since the last event.
    //
    // The Poisson Distribution is characterized by the strictly positive
    // mean arrival or occurrence rate, `λ`.
    function poisson_distribution(lambda) {
        // Check that lambda is strictly positive
        if (lambda <= 0) { return null; }

        // our current place in the distribution
        var x = 0,
            // and we keep track of the current cumulative probability, in
            // order to know when to stop calculating chances.
            cumulative_probability = 0,
            // the calculated cells to be returned
            cells = {};

        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        function probability_mass(x, lambda) {
            return (Math.pow(Math.E, -lambda) * Math.pow(lambda, x)) /
                factorial(x);
        }

        // This algorithm iterates through each potential outcome,
        // until the `cumulative_probability` is very close to 1, at
        // which point we've defined the vast majority of outcomes
        do {
            cells[x] = probability_mass(x, lambda);
            cumulative_probability += cells[x];
            x++;
        // when the cumulative_probability is nearly 1, we've calculated
        // the useful range of this distribution
        } while (cumulative_probability < 1 - epsilon);

        return cells;
    }

    // # Percentage Points of the χ2 (Chi-Squared) Distribution
    // The [χ2 (Chi-Squared) Distribution](http://en.wikipedia.org/wiki/Chi-squared_distribution) is used in the common
    // chi-squared tests for goodness of fit of an observed distribution to a theoretical one, the independence of two
    // criteria of classification of qualitative data, and in confidence interval estimation for a population standard
    // deviation of a normal distribution from a sample standard deviation.
    //
    // Values from Appendix 1, Table III of William W. Hines & Douglas C. Montgomery, "Probability and Statistics in
    // Engineering and Management Science", Wiley (1980).
    var chi_squared_distribution_table = {
        1: { 0.995:  0.00, 0.99:  0.00, 0.975:  0.00, 0.95:  0.00, 0.9:  0.02, 0.5:  0.45, 0.1:  2.71, 0.05:  3.84, 0.025:  5.02, 0.01:  6.63, 0.005:  7.88 },
        2: { 0.995:  0.01, 0.99:  0.02, 0.975:  0.05, 0.95:  0.10, 0.9:  0.21, 0.5:  1.39, 0.1:  4.61, 0.05:  5.99, 0.025:  7.38, 0.01:  9.21, 0.005: 10.60 },
        3: { 0.995:  0.07, 0.99:  0.11, 0.975:  0.22, 0.95:  0.35, 0.9:  0.58, 0.5:  2.37, 0.1:  6.25, 0.05:  7.81, 0.025:  9.35, 0.01: 11.34, 0.005: 12.84 },
        4: { 0.995:  0.21, 0.99:  0.30, 0.975:  0.48, 0.95:  0.71, 0.9:  1.06, 0.5:  3.36, 0.1:  7.78, 0.05:  9.49, 0.025: 11.14, 0.01: 13.28, 0.005: 14.86 },
        5: { 0.995:  0.41, 0.99:  0.55, 0.975:  0.83, 0.95:  1.15, 0.9:  1.61, 0.5:  4.35, 0.1:  9.24, 0.05: 11.07, 0.025: 12.83, 0.01: 15.09, 0.005: 16.75 },
        6: { 0.995:  0.68, 0.99:  0.87, 0.975:  1.24, 0.95:  1.64, 0.9:  2.20, 0.5:  5.35, 0.1: 10.65, 0.05: 12.59, 0.025: 14.45, 0.01: 16.81, 0.005: 18.55 },
        7: { 0.995:  0.99, 0.99:  1.25, 0.975:  1.69, 0.95:  2.17, 0.9:  2.83, 0.5:  6.35, 0.1: 12.02, 0.05: 14.07, 0.025: 16.01, 0.01: 18.48, 0.005: 20.28 },
        8: { 0.995:  1.34, 0.99:  1.65, 0.975:  2.18, 0.95:  2.73, 0.9:  3.49, 0.5:  7.34, 0.1: 13.36, 0.05: 15.51, 0.025: 17.53, 0.01: 20.09, 0.005: 21.96 },
        9: { 0.995:  1.73, 0.99:  2.09, 0.975:  2.70, 0.95:  3.33, 0.9:  4.17, 0.5:  8.34, 0.1: 14.68, 0.05: 16.92, 0.025: 19.02, 0.01: 21.67, 0.005: 23.59 },
        10: { 0.995:  2.16, 0.99:  2.56, 0.975:  3.25, 0.95:  3.94, 0.9:  4.87, 0.5:  9.34, 0.1: 15.99, 0.05: 18.31, 0.025: 20.48, 0.01: 23.21, 0.005: 25.19 },
        11: { 0.995:  2.60, 0.99:  3.05, 0.975:  3.82, 0.95:  4.57, 0.9:  5.58, 0.5: 10.34, 0.1: 17.28, 0.05: 19.68, 0.025: 21.92, 0.01: 24.72, 0.005: 26.76 },
        12: { 0.995:  3.07, 0.99:  3.57, 0.975:  4.40, 0.95:  5.23, 0.9:  6.30, 0.5: 11.34, 0.1: 18.55, 0.05: 21.03, 0.025: 23.34, 0.01: 26.22, 0.005: 28.30 },
        13: { 0.995:  3.57, 0.99:  4.11, 0.975:  5.01, 0.95:  5.89, 0.9:  7.04, 0.5: 12.34, 0.1: 19.81, 0.05: 22.36, 0.025: 24.74, 0.01: 27.69, 0.005: 29.82 },
        14: { 0.995:  4.07, 0.99:  4.66, 0.975:  5.63, 0.95:  6.57, 0.9:  7.79, 0.5: 13.34, 0.1: 21.06, 0.05: 23.68, 0.025: 26.12, 0.01: 29.14, 0.005: 31.32 },
        15: { 0.995:  4.60, 0.99:  5.23, 0.975:  6.27, 0.95:  7.26, 0.9:  8.55, 0.5: 14.34, 0.1: 22.31, 0.05: 25.00, 0.025: 27.49, 0.01: 30.58, 0.005: 32.80 },
        16: { 0.995:  5.14, 0.99:  5.81, 0.975:  6.91, 0.95:  7.96, 0.9:  9.31, 0.5: 15.34, 0.1: 23.54, 0.05: 26.30, 0.025: 28.85, 0.01: 32.00, 0.005: 34.27 },
        17: { 0.995:  5.70, 0.99:  6.41, 0.975:  7.56, 0.95:  8.67, 0.9: 10.09, 0.5: 16.34, 0.1: 24.77, 0.05: 27.59, 0.025: 30.19, 0.01: 33.41, 0.005: 35.72 },
        18: { 0.995:  6.26, 0.99:  7.01, 0.975:  8.23, 0.95:  9.39, 0.9: 10.87, 0.5: 17.34, 0.1: 25.99, 0.05: 28.87, 0.025: 31.53, 0.01: 34.81, 0.005: 37.16 },
        19: { 0.995:  6.84, 0.99:  7.63, 0.975:  8.91, 0.95: 10.12, 0.9: 11.65, 0.5: 18.34, 0.1: 27.20, 0.05: 30.14, 0.025: 32.85, 0.01: 36.19, 0.005: 38.58 },
        20: { 0.995:  7.43, 0.99:  8.26, 0.975:  9.59, 0.95: 10.85, 0.9: 12.44, 0.5: 19.34, 0.1: 28.41, 0.05: 31.41, 0.025: 34.17, 0.01: 37.57, 0.005: 40.00 },
        21: { 0.995:  8.03, 0.99:  8.90, 0.975: 10.28, 0.95: 11.59, 0.9: 13.24, 0.5: 20.34, 0.1: 29.62, 0.05: 32.67, 0.025: 35.48, 0.01: 38.93, 0.005: 41.40 },
        22: { 0.995:  8.64, 0.99:  9.54, 0.975: 10.98, 0.95: 12.34, 0.9: 14.04, 0.5: 21.34, 0.1: 30.81, 0.05: 33.92, 0.025: 36.78, 0.01: 40.29, 0.005: 42.80 },
        23: { 0.995:  9.26, 0.99: 10.20, 0.975: 11.69, 0.95: 13.09, 0.9: 14.85, 0.5: 22.34, 0.1: 32.01, 0.05: 35.17, 0.025: 38.08, 0.01: 41.64, 0.005: 44.18 },
        24: { 0.995:  9.89, 0.99: 10.86, 0.975: 12.40, 0.95: 13.85, 0.9: 15.66, 0.5: 23.34, 0.1: 33.20, 0.05: 36.42, 0.025: 39.36, 0.01: 42.98, 0.005: 45.56 },
        25: { 0.995: 10.52, 0.99: 11.52, 0.975: 13.12, 0.95: 14.61, 0.9: 16.47, 0.5: 24.34, 0.1: 34.28, 0.05: 37.65, 0.025: 40.65, 0.01: 44.31, 0.005: 46.93 },
        26: { 0.995: 11.16, 0.99: 12.20, 0.975: 13.84, 0.95: 15.38, 0.9: 17.29, 0.5: 25.34, 0.1: 35.56, 0.05: 38.89, 0.025: 41.92, 0.01: 45.64, 0.005: 48.29 },
        27: { 0.995: 11.81, 0.99: 12.88, 0.975: 14.57, 0.95: 16.15, 0.9: 18.11, 0.5: 26.34, 0.1: 36.74, 0.05: 40.11, 0.025: 43.19, 0.01: 46.96, 0.005: 49.65 },
        28: { 0.995: 12.46, 0.99: 13.57, 0.975: 15.31, 0.95: 16.93, 0.9: 18.94, 0.5: 27.34, 0.1: 37.92, 0.05: 41.34, 0.025: 44.46, 0.01: 48.28, 0.005: 50.99 },
        29: { 0.995: 13.12, 0.99: 14.26, 0.975: 16.05, 0.95: 17.71, 0.9: 19.77, 0.5: 28.34, 0.1: 39.09, 0.05: 42.56, 0.025: 45.72, 0.01: 49.59, 0.005: 52.34 },
        30: { 0.995: 13.79, 0.99: 14.95, 0.975: 16.79, 0.95: 18.49, 0.9: 20.60, 0.5: 29.34, 0.1: 40.26, 0.05: 43.77, 0.025: 46.98, 0.01: 50.89, 0.005: 53.67 },
        40: { 0.995: 20.71, 0.99: 22.16, 0.975: 24.43, 0.95: 26.51, 0.9: 29.05, 0.5: 39.34, 0.1: 51.81, 0.05: 55.76, 0.025: 59.34, 0.01: 63.69, 0.005: 66.77 },
        50: { 0.995: 27.99, 0.99: 29.71, 0.975: 32.36, 0.95: 34.76, 0.9: 37.69, 0.5: 49.33, 0.1: 63.17, 0.05: 67.50, 0.025: 71.42, 0.01: 76.15, 0.005: 79.49 },
        60: { 0.995: 35.53, 0.99: 37.48, 0.975: 40.48, 0.95: 43.19, 0.9: 46.46, 0.5: 59.33, 0.1: 74.40, 0.05: 79.08, 0.025: 83.30, 0.01: 88.38, 0.005: 91.95 },
        70: { 0.995: 43.28, 0.99: 45.44, 0.975: 48.76, 0.95: 51.74, 0.9: 55.33, 0.5: 69.33, 0.1: 85.53, 0.05: 90.53, 0.025: 95.02, 0.01: 100.42, 0.005: 104.22 },
        80: { 0.995: 51.17, 0.99: 53.54, 0.975: 57.15, 0.95: 60.39, 0.9: 64.28, 0.5: 79.33, 0.1: 96.58, 0.05: 101.88, 0.025: 106.63, 0.01: 112.33, 0.005: 116.32 },
        90: { 0.995: 59.20, 0.99: 61.75, 0.975: 65.65, 0.95: 69.13, 0.9: 73.29, 0.5: 89.33, 0.1: 107.57, 0.05: 113.14, 0.025: 118.14, 0.01: 124.12, 0.005: 128.30 },
        100: { 0.995: 67.33, 0.99: 70.06, 0.975: 74.22, 0.95: 77.93, 0.9: 82.36, 0.5: 99.33, 0.1: 118.50, 0.05: 124.34, 0.025: 129.56, 0.01: 135.81, 0.005: 140.17 }
    };

    // # χ2 (Chi-Squared) Goodness-of-Fit Test
    //
    // The [χ2 (Chi-Squared) Goodness-of-Fit Test](http://en.wikipedia.org/wiki/Goodness_of_fit#Pearson.27s_chi-squared_test)
    // uses a measure of goodness of fit which is the sum of differences between observed and expected outcome frequencies
    // (that is, counts of observations), each squared and divided by the number of observations expected given the
    // hypothesized distribution. The resulting χ2 statistic, `chi_squared`, can be compared to the chi-squared distribution
    // to determine the goodness of fit. In order to determine the degrees of freedom of the chi-squared distribution, one
    // takes the total number of observed frequencies and subtracts the number of estimated parameters. The test statistic
    // follows, approximately, a chi-square distribution with (k − c) degrees of freedom where `k` is the number of non-empty
    // cells and `c` is the number of estimated parameters for the distribution.
    function chi_squared_goodness_of_fit(data, distribution_type, significance) {
        // Estimate from the sample data, a weighted mean.
        var input_mean = mean(data),
            // Calculated value of the χ2 statistic.
            chi_squared = 0,
            // Degrees of freedom, calculated as (number of class intervals -
            // number of hypothesized distribution parameters estimated - 1)
            degrees_of_freedom,
            // Number of hypothesized distribution parameters estimated, expected to be supplied in the distribution test.
            // Lose one degree of freedom for estimating `lambda` from the sample data.
            c = 1,
            // The hypothesized distribution.
            // Generate the hypothesized distribution.
            hypothesized_distribution = distribution_type(input_mean),
            observed_frequencies = [],
            expected_frequencies = [],
            k;

        // Create an array holding a histogram from the sample data, of
        // the form `{ value: numberOfOcurrences }`
        for (var i = 0; i < data.length; i++) {
            if (observed_frequencies[data[i]] === undefined) {
                observed_frequencies[data[i]] = 0;
            }
            observed_frequencies[data[i]]++;
        }

        // The histogram we created might be sparse - there might be gaps
        // between values. So we iterate through the histogram, making
        // sure that instead of undefined, gaps have 0 values.
        for (i = 0; i < observed_frequencies.length; i++) {
            if (observed_frequencies[i] === undefined) {
                observed_frequencies[i] = 0;
            }
        }

        // Create an array holding a histogram of expected data given the
        // sample size and hypothesized distribution.
        for (k in hypothesized_distribution) {
            if (k in observed_frequencies) {
                expected_frequencies[k] = hypothesized_distribution[k] * data.length;
            }
        }

        // Working backward through the expected frequencies, collapse classes
        // if less than three observations are expected for a class.
        // This transformation is applied to the observed frequencies as well.
        for (k = expected_frequencies.length - 1; k >= 0; k--) {
            if (expected_frequencies[k] < 3) {
                expected_frequencies[k - 1] += expected_frequencies[k];
                expected_frequencies.pop();

                observed_frequencies[k - 1] += observed_frequencies[k];
                observed_frequencies.pop();
            }
        }

        // Iterate through the squared differences between observed & expected
        // frequencies, accumulating the `chi_squared` statistic.
        for (k = 0; k < observed_frequencies.length; k++) {
            chi_squared += Math.pow(
                observed_frequencies[k] - expected_frequencies[k], 2) /
                expected_frequencies[k];
        }

        // Calculate degrees of freedom for this test and look it up in the
        // `chi_squared_distribution_table` in order to
        // accept or reject the goodness-of-fit of the hypothesized distribution.
        degrees_of_freedom = observed_frequencies.length - c - 1;
        return chi_squared_distribution_table[degrees_of_freedom][significance] < chi_squared;
    }

    // # Mixin
    //
    // Mixin simple_statistics to a single Array instance if provided
    // or the Array native object if not. This is an optional
    // feature that lets you treat simple_statistics as a native feature
    // of Javascript.
    function mixin(array) {
        var support = !!(Object.defineProperty && Object.defineProperties);
        if (!support) throw new Error('without defineProperty, simple-statistics cannot be mixed in');

        // only methods which work on basic arrays in a single step
        // are supported
        var arrayMethods = ['median', 'standard_deviation', 'sum',
            'sample_skewness',
            'mean', 'min', 'max', 'quantile', 'geometric_mean',
            'harmonic_mean'];

        // create a closure with a method name so that a reference
        // like `arrayMethods[i]` doesn't follow the loop increment
        function wrap(method) {
            return function() {
                // cast any arguments into an array, since they're
                // natively objects
                var args = Array.prototype.slice.apply(arguments);
                // make the first argument the array itself
                args.unshift(this);
                // return the result of the ss method
                return ss[method].apply(ss, args);
            };
        }

        // select object to extend
        var extending;
        if (array) {
            // create a shallow copy of the array so that our internal
            // operations do not change it by reference
            extending = array.slice();
        } else {
            extending = Array.prototype;
        }

        // for each array function, define a function that gets
        // the array as the first argument.
        // We use [defineProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty)
        // because it allows these properties to be non-enumerable:
        // `for (var in x)` loops will not run into problems with this
        // implementation.
        for (var i = 0; i < arrayMethods.length; i++) {
            Object.defineProperty(extending, arrayMethods[i], {
                value: wrap(arrayMethods[i]),
                configurable: true,
                enumerable: false,
                writable: true
            });
        }

        return extending;
    }

    ss.linear_regression = linear_regression;
    ss.standard_deviation = standard_deviation;
    ss.r_squared = r_squared;
    ss.median = median;
    ss.mean = mean;
    ss.mode = mode;
    ss.min = min;
    ss.max = max;
    ss.sum = sum;
    ss.quantile = quantile;
    ss.quantile_sorted = quantile_sorted;
    ss.iqr = iqr;
    ss.mad = mad;

    ss.sample_covariance = sample_covariance;
    ss.sample_correlation = sample_correlation;
    ss.sample_variance = sample_variance;
    ss.sample_standard_deviation = sample_standard_deviation;
    ss.sample_skewness = sample_skewness;

    ss.geometric_mean = geometric_mean;
    ss.harmonic_mean = harmonic_mean;
    ss.variance = variance;
    ss.t_test = t_test;
    ss.t_test_two_sample = t_test_two_sample;

    // jenks
    ss.jenksMatrices = jenksMatrices;
    ss.jenksBreaks = jenksBreaks;
    ss.jenks = jenks;

    ss.bayesian = bayesian;

    // Distribution-related methods
    ss.epsilon = epsilon; // We make ε available to the test suite.
    ss.factorial = factorial;
    ss.bernoulli_distribution = bernoulli_distribution;
    ss.binomial_distribution = binomial_distribution;
    ss.poisson_distribution = poisson_distribution;
    ss.chi_squared_goodness_of_fit = chi_squared_goodness_of_fit;

    // Normal distribution
    ss.z_score = z_score;
    ss.cumulative_std_normal_probability = cumulative_std_normal_probability;
    ss.standard_normal_table = standard_normal_table;

    // Alias this into its common name
    ss.average = mean;
    ss.interquartile_range = iqr;
    ss.mixin = mixin;
    ss.median_absolute_deviation = mad;

})(this);

},{}],13:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],14:[function(require,module,exports){
var ss = require('simple-statistics')
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.max(values)
  })

  return polyFC;
}

},{"simple-statistics":15,"turf-inside":16}],15:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],16:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],17:[function(require,module,exports){
var ss = require('simple-statistics')
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.median(values)
  })

  return polyFC;
}

},{"simple-statistics":18,"turf-inside":19}],18:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],19:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],20:[function(require,module,exports){
var ss = require('simple-statistics')
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.min(values)
  })

  return polyFC;
}

},{"simple-statistics":21,"turf-inside":22}],21:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],22:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],23:[function(require,module,exports){
var ss = require('simple-statistics')
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.sum(values)
  })

  return polyFC;
}

},{"simple-statistics":24,"turf-inside":25}],24:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],25:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],26:[function(require,module,exports){
var ss = require('simple-statistics')
var inside = require('turf-inside')

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {}
    }
    var values = []
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.variance(values)
  })

  return polyFC;
}
},{"simple-statistics":27,"turf-inside":28}],27:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],28:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],29:[function(require,module,exports){
var geometryArea = require('geojson-area').geometry;

module.exports = function(_) {
    if (_.type === 'FeatureCollection') {
        for (var i = 0, sum = 0; i < _.features.length; i++) {
            if (_.features[i].geometry) {
                var added = geometryArea(_.features[i].geometry);
                sum += added || 0;
            }
        }
        return sum;
    } else {
        return geometryArea(_);
    }
};

},{"geojson-area":30}],30:[function(require,module,exports){
var wgs84 = require('wgs84');

module.exports.geometry = geometry;
module.exports.ring = ringArea;

function geometry(_) {
    if (_.type === 'Polygon') return polygonArea(_.coordinates);
    else if (_.type === 'MultiPolygon') {
        var area = 0;
        for (var i = 0; i < _.coordinates.length; i++) {
            area += polygonArea(_.coordinates[i]);
        }
        return area;
    } else {
        return null;
    }
}

function polygonArea(coords) {
    var area = 0;
    if (coords && coords.length > 0) {
        area += Math.abs(ringArea(coords[0]));
        for (var i = 1; i < coords.length; i++) {
            area -= Math.abs(ringArea(coords[i]));
        }
    }
    return area;
}

/**
 * Calculate the approximate area of the polygon were it projected onto
 *     the earth.  Note that this area will be positive if ring is oriented
 *     clockwise, otherwise it will be negative.
 *
 * Reference:
 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for
 *     Polygons on a Sphere", JPL Publication 07-03, Jet Propulsion
 *     Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
 *
 * Returns:
 * {float} The approximate signed geodesic area of the polygon in square
 *     meters.
 */

function ringArea(coords) {
    var area = 0;

    if (coords.length > 2) {
        var p1, p2;
        for (var i = 0; i < coords.length - 1; i++) {
            p1 = coords[i];
            p2 = coords[i + 1];
            area += rad(p2[0] - p1[0]) * (2 + Math.sin(rad(p1[1])) + Math.sin(rad(p2[1])));
        }

        area = area * wgs84.RADIUS * wgs84.RADIUS / 2;
    }

    return area;
}

function rad(_) {
    return _ * Math.PI / 180;
}

},{"wgs84":31}],31:[function(require,module,exports){
module.exports.RADIUS = 6378137;
module.exports.FLATTENING = 1/298.257223563;
module.exports.POLAR_RADIUS = 6356752.3142;

},{}],32:[function(require,module,exports){
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties) poly.properties = {};
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) values.push(pt.properties[inField]);
    });
    poly.properties[outField] = average(values);
  });

  return polyFC;
}

function average(values) {
  var sum = 0;
  for (var i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
}

},{"turf-inside":76}],33:[function(require,module,exports){
var polygon = require('turf-polygon');

module.exports = function(bbox){
  var lowLeft = [bbox[0], bbox[1]];
  var topLeft = [bbox[0], bbox[3]];
  var topRight = [bbox[2], bbox[3]];
  var lowRight = [bbox[2], bbox[1]];

  var poly = polygon([[
    lowLeft,
    lowRight,
    topRight,
    topLeft,
    lowLeft
  ]]);
  return poly;
}

},{"turf-polygon":34}],34:[function(require,module,exports){
module.exports = function(coordinates, properties){
  if(coordinates === null) return new Error('No coordinates passed')
  var polygon = { 
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": coordinates
    },
    "properties": properties
  }

  if(!polygon.properties){
    polygon.properties = {}
  }
  
  return polygon
}
},{}],35:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

module.exports = function (point1, point2) {
    var coordinates1 = point1.geometry.coordinates;
    var coordinates2 = point2.geometry.coordinates;

    var lon1 = toRad(coordinates1[0]);
    var lon2 = toRad(coordinates2[0]);
    var lat1 = toRad(coordinates1[1]);
    var lat2 = toRad(coordinates2[1]);
    var a = Math.sin(lon2 - lon1) * Math.cos(lat2);
    var b = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

    var bearing = toDeg(Math.atan2(a, b));

    return bearing;
}

function toRad(degree) {
    return degree * Math.PI / 180;
}

function toDeg(radian) {
    return radian * 180 / Math.PI;
}

},{}],36:[function(require,module,exports){
// code modded from here:
//https://github.com/leszekr/bezier-spline-js/blob/master/bezier-spline.js
var t = {};
t.linestring = require('turf-linestring');

module.exports = function(line, resolution, intensity){
  var lineOut = t.linestring([]);

  lineOut.properties = line.properties;
  pts = [];
  pts = line.geometry.coordinates.map(function(pt){
    return {x: pt[0], y: pt[1]};
  })

  var spline = new Spline({
    points: pts,
    duration: resolution,
    sharpness: intensity,
  });
  for(var i=0; i<spline.duration; i+=10){
    var pos = spline.pos(i); //bezier(i/max,p1, c1, c2, p2);
    if(Math.floor(i/100)%2==0) lineOut.geometry.coordinates.push([pos.x, pos.y]);
  }

  return lineOut;
}


 /**
   * BezierSpline
   * http://leszekr.github.com/
   *
   * @copyright
   * Copyright (C) 2012 Leszek Rybicki.
   *
   * @license
   * This file is part of BezierSpline
   *
   * BezierSpline is free software: you can redistribute it and/or modify
   * it under the terms of the GNU Lesser General Public License as published by
   * the Free Software Foundation, either version 3 of the License, or
   * (at your option) any later version.
   *
   * BezierSpline is distributed in the hope that it will be useful,
   * but WITHOUT ANY WARRANTY; without even the implied warranty of
   * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   * GNU General Public License for more details.
   *
   * You should have received a copy of the GNU General Public License
   * along with BezierSpline.  If not, see <http://www.gnu.org/copyleft/lesser.html>.
   */


  /*
  Usage:

    var spline = new Spline({
      points: array_of_control_points,
      duration: time_in_miliseconds,
      sharpness: how_curvy,
      stepLength: distance_between_points_to_cache
    });

  */
  Spline = function(options){
    this.points = options.points || [];
    this.duration = options.duration || 10000;
    this.sharpness = options.sharpness || 0.85;
    this.centers = [];
    this.controls = [];
    this.stepLength = options.stepLength || 60;
    this.length = this.points.length;
    this.delay = 0;
    // this is to ensure compatibility with the 2d version
    for(var i=0; i<this.length; i++) this.points[i].z = this.points[i].z || 0;
    for(var i=0; i<this.length-1; i++){
      var p1 = this.points[i];
      var p2 = this.points[i+1];
      this.centers.push({x:(p1.x+p2.x)/2, y:(p1.y+p2.y)/2, z:(p1.z+p2.z)/2});
    }
    this.controls.push([this.points[0],this.points[0]]);
    for(var i=0; i<this.centers.length-1; i++){
      var p1 = this.centers[i];
      var p2 = this.centers[i+1];
      var dx = this.points[i+1].x-(this.centers[i].x+this.centers[i+1].x)/2;
      var dy = this.points[i+1].y-(this.centers[i].y+this.centers[i+1].y)/2;
      var dz = this.points[i+1].z-(this.centers[i].y+this.centers[i+1].z)/2;
      this.controls.push([{
        x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i].x+dx),
        y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i].y+dy),
        z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i].z+dz)},
      {
        x:(1.0-this.sharpness)*this.points[i+1].x+this.sharpness*(this.centers[i+1].x+dx),
        y:(1.0-this.sharpness)*this.points[i+1].y+this.sharpness*(this.centers[i+1].y+dy),
        z:(1.0-this.sharpness)*this.points[i+1].z+this.sharpness*(this.centers[i+1].z+dz)}]);
    }
    this.controls.push([this.points[this.length-1],this.points[this.length-1]]);
    this.steps = this.cacheSteps(this.stepLength);
    return this;
  }

  /*
    Caches an array of equidistant (more or less) points on the curve.
  */
  Spline.prototype.cacheSteps = function(mindist){
    var steps = [];
    var laststep = this.pos(0);
    steps.push(0);
    for(var t=0; t<this.duration; t+=10){
      var step = this.pos(t);
      var dist = Math.sqrt((step.x-laststep.x)*(step.x-laststep.x)+(step.y-laststep.y)*(step.y-laststep.y)+(step.z-laststep.z)*(step.z-laststep.z));
      if(dist>mindist){
        steps.push(t);
        laststep = step;
      }
    }
    return steps;
  }

  /*
    returns angle and speed in the given point in the curve
  */
  Spline.prototype.vector = function(t){
    var p1 = this.pos(t+10);
    var p2 = this.pos(t-10);
    return {
      angle:180*Math.atan2(p1.y-p2.y, p1.x-p2.x)/3.14,
      speed:Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)+(p2.z-p1.z)*(p2.z-p1.z))
    }
  }

  /*
    Draws the control points
  */
  Spline.prototype.drawControlPoints = function(ctx, color){
    ctx.fillStyle = color||"#f60";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    for(var i=0; i<this.length; i++){
      var p = this.points[i];
      var c1 = this.controls[i][0];
      var c2 = this.controls[i][1];

      ctx.beginPath();
      ctx.moveTo(c1.x,c1.y);
      ctx.lineTo(p.x,p.y);
      ctx.lineTo(c2.x,c2.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(c1.x, c1.y, 3, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(c2.x, c2.y, 3, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();


      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }
    return this;
  }

  /*
    Gets the position of the point, given time.

    WARNING: The speed is not constant. The time it takes between control points is constant.

    For constant speed, use Spline.steps[i];
  */
  Spline.prototype.pos = function(time){

    function bezier(t, p1, c1, c2, p2){
      var B = function(t) {
        var t2=t*t, t3=t2*t;
        return [(t3),(3*t2*(1-t)),(3*t*(1-t)*(1-t)),((1-t)*(1-t)*(1-t))]
      }
      var b = B(t)
      var pos = {
        x : p2.x * b[0] + c2.x * b[1] +c1.x * b[2] + p1.x * b[3],
        y : p2.y * b[0] + c2.y * b[1] +c1.y * b[2] + p1.y * b[3],
        z : p2.z * b[0] + c2.z * b[1] +c1.z * b[2] + p1.z * b[3]
      }
      return pos;
    }
    var t = time-this.delay;
    if(t<0) t=0;
    if(t>this.duration) t=this.duration-1;
    //t = t-this.delay;
    var t2 = (t)/this.duration;
    if(t2>=1) return this.points[this.length-1];

    var n = Math.floor((this.points.length-1)*t2);
    var t1 = (this.length-1)*t2-n;
    return bezier(t1,this.points[n],this.controls[n][1],this.controls[n+1][0],this.points[n+1]);
  }

  /*
    Draws the line
  */
  Spline.prototype.draw = function(ctx,color){
    ctx.strokeStyle = color || "#7e5e38"; // line color
    ctx.lineWidth = 14;
    ctx.beginPath();
    var pos;
    for(var i=0; i<this.duration; i+=10){
      pos = this.pos(i); //bezier(i/max,p1, c1, c2, p2);
      if(Math.floor(i/100)%2==0) ctx.lineTo(pos.x, pos.y);
      else ctx.moveTo(pos.x, pos.y);
    }
    ctx.stroke();
    return this;
  }

},{"turf-linestring":37}],37:[function(require,module,exports){
module.exports = function(coordinates, properties){
  if(!coordinates) return new Error('No coordinates passed')
  var linestring = { 
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": coordinates
    },
    "properties": properties
  }
  return linestring
}

},{}],38:[function(require,module,exports){
// http://stackoverflow.com/questions/839899/how-do-i-calculate-a-point-on-a-circles-circumference
// radians = degrees * (pi/180)
// https://github.com/bjornharrtell/jsts/blob/master/examples/buffer.html

var featurecollection = require('turf-featurecollection');
var polygon = require('turf-polygon');
var combine = require('turf-combine');
var jsts = require('jsts');

module.exports = function(feature, radius, units, done){
  var buffered;

  done = done || function () {};

  switch(units){
    case 'miles':
      radius = radius / 69.047;
      break
    case 'kilometers':
      radius = radius / 111.12;
      break
    case 'degrees':
      break
  }

  if(feature.type === 'FeatureCollection'){
    var multi = combine(feature);
    multi.properties = {};

    buffered = bufferOp(multi, radius);

    done(null, buffered);
    return buffered;
  }
  else{
    buffered = bufferOp(feature, radius);
    
    done(null, buffered);
    return buffered;
  }
}

var bufferOp = function(feature, radius){
  var reader = new jsts.io.GeoJSONReader();
  var geom = reader.read(JSON.stringify(feature.geometry));
  var buffered = geom.buffer(radius);
  var parser = new jsts.io.GeoJSONParser();
  buffered = parser.write(buffered);

  if(buffered.type === 'MultiPolygon'){
    buffered = {
      type: 'Feature',
      geometry: buffered,
      properties: {}
    };
    buffered = featurecollection([buffered]);
  }
  else{
    buffered = featurecollection([polygon(buffered.coordinates)]);
  }

  return buffered;
}
},{"jsts":39,"turf-combine":45,"turf-featurecollection":70,"turf-polygon":118}],39:[function(require,module,exports){
require('javascript.util');
var jsts = require('./lib/jsts');
module.exports = jsts

},{"./lib/jsts":40,"javascript.util":42}],40:[function(require,module,exports){
/* The JSTS Topology Suite is a collection of JavaScript classes that
implement the fundamental operations required to validate a given
geo-spatial data set to a known topological specification.

Copyright (C) 2011 The Authors

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA */
jsts={version:'0.15.0',algorithm:{distance:{},locate:{}},error:{},geom:{util:{}},geomgraph:{index:{}},index:{bintree:{},chain:{},kdtree:{},quadtree:{},strtree:{}},io:{},noding:{snapround:{}},operation:{buffer:{},distance:{},overlay:{snap:{}},polygonize:{},predicate:{},relate:{},union:{},valid:{}},planargraph:{},simplify:{},triangulate:{quadedge:{}},util:{}};if(typeof String.prototype.trim!=='function'){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,'');};}
jsts.abstractFunc=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.error={};jsts.error.IllegalArgumentError=function(message){this.name='IllegalArgumentError';this.message=message;};jsts.error.IllegalArgumentError.prototype=new Error();jsts.error.TopologyError=function(message,pt){this.name='TopologyError';this.message=pt?message+' [ '+pt+' ]':message;};jsts.error.TopologyError.prototype=new Error();jsts.error.AbstractMethodInvocationError=function(){this.name='AbstractMethodInvocationError';this.message='Abstract method called, should be implemented in subclass.';};jsts.error.AbstractMethodInvocationError.prototype=new Error();jsts.error.NotImplementedError=function(){this.name='NotImplementedError';this.message='This method has not yet been implemented.';};jsts.error.NotImplementedError.prototype=new Error();jsts.error.NotRepresentableError=function(message){this.name='NotRepresentableError';this.message=message;};jsts.error.NotRepresentableError.prototype=new Error();jsts.error.LocateFailureError=function(message){this.name='LocateFailureError';this.message=message;};jsts.error.LocateFailureError.prototype=new Error();if(typeof module!=="undefined")module.exports=jsts;jsts.geom.GeometryFilter=function(){};jsts.geom.GeometryFilter.prototype.filter=function(geom){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.util.PolygonExtracter=function(comps){this.comps=comps;};jsts.geom.util.PolygonExtracter.prototype=new jsts.geom.GeometryFilter();jsts.geom.util.PolygonExtracter.prototype.comps=null;jsts.geom.util.PolygonExtracter.getPolygons=function(geom,list){if(list===undefined){list=[];}
if(geom instanceof jsts.geom.Polygon){list.push(geom);}else if(geom instanceof jsts.geom.GeometryCollection){geom.apply(new jsts.geom.util.PolygonExtracter(list));}
return list;};jsts.geom.util.PolygonExtracter.prototype.filter=function(geom){if(geom instanceof jsts.geom.Polygon)
this.comps.push(geom);};jsts.io.WKTParser=function(geometryFactory){this.geometryFactory=geometryFactory||new jsts.geom.GeometryFactory();this.regExes={'typeStr':/^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,'emptyTypeStr':/^\s*(\w+)\s*EMPTY\s*$/,'spaces':/\s+/,'parenComma':/\)\s*,\s*\(/,'doubleParenComma':/\)\s*\)\s*,\s*\(\s*\(/,'trimParens':/^\s*\(?(.*?)\)?\s*$/};};jsts.io.WKTParser.prototype.read=function(wkt){var geometry,type,str;wkt=wkt.replace(/[\n\r]/g,' ');var matches=this.regExes.typeStr.exec(wkt);if(wkt.search('EMPTY')!==-1){matches=this.regExes.emptyTypeStr.exec(wkt);matches[2]=undefined;}
if(matches){type=matches[1].toLowerCase();str=matches[2];if(this.parse[type]){geometry=this.parse[type].apply(this,[str]);}}
if(geometry===undefined)
throw new Error('Could not parse WKT '+wkt);return geometry;};jsts.io.WKTParser.prototype.write=function(geometry){return this.extractGeometry(geometry);};jsts.io.WKTParser.prototype.extractGeometry=function(geometry){var type=geometry.CLASS_NAME.split('.')[2].toLowerCase();if(!this.extract[type]){return null;}
var wktType=type.toUpperCase();var data;if(geometry.isEmpty()){data=wktType+' EMPTY';}else{data=wktType+'('+this.extract[type].apply(this,[geometry])+')';}
return data;};jsts.io.WKTParser.prototype.extract={'coordinate':function(coordinate){return coordinate.x+' '+coordinate.y;},'point':function(point){return point.coordinate.x+' '+point.coordinate.y;},'multipoint':function(multipoint){var array=[];for(var i=0,len=multipoint.geometries.length;i<len;++i){array.push('('+
this.extract.point.apply(this,[multipoint.geometries[i]])+')');}
return array.join(',');},'linestring':function(linestring){var array=[];for(var i=0,len=linestring.points.length;i<len;++i){array.push(this.extract.coordinate.apply(this,[linestring.points[i]]));}
return array.join(',');},'multilinestring':function(multilinestring){var array=[];for(var i=0,len=multilinestring.geometries.length;i<len;++i){array.push('('+
this.extract.linestring.apply(this,[multilinestring.geometries[i]])+')');}
return array.join(',');},'polygon':function(polygon){var array=[];array.push('('+this.extract.linestring.apply(this,[polygon.shell])+')');for(var i=0,len=polygon.holes.length;i<len;++i){array.push('('+this.extract.linestring.apply(this,[polygon.holes[i]])+')');}
return array.join(',');},'multipolygon':function(multipolygon){var array=[];for(var i=0,len=multipolygon.geometries.length;i<len;++i){array.push('('+this.extract.polygon.apply(this,[multipolygon.geometries[i]])+')');}
return array.join(',');},'geometrycollection':function(collection){var array=[];for(var i=0,len=collection.geometries.length;i<len;++i){array.push(this.extractGeometry.apply(this,[collection.geometries[i]]));}
return array.join(',');}};jsts.io.WKTParser.prototype.parse={'point':function(str){if(str===undefined){return this.geometryFactory.createPoint(null);}
var coords=str.trim().split(this.regExes.spaces);return this.geometryFactory.createPoint(new jsts.geom.Coordinate(coords[0],coords[1]));},'multipoint':function(str){if(str===undefined){return this.geometryFactory.createMultiPoint(null);}
var point;var points=str.trim().split(',');var components=[];for(var i=0,len=points.length;i<len;++i){point=points[i].replace(this.regExes.trimParens,'$1');components.push(this.parse.point.apply(this,[point]));}
return this.geometryFactory.createMultiPoint(components);},'linestring':function(str){if(str===undefined){return this.geometryFactory.createLineString(null);}
var points=str.trim().split(',');var components=[];var coords;for(var i=0,len=points.length;i<len;++i){coords=points[i].trim().split(this.regExes.spaces);components.push(new jsts.geom.Coordinate(coords[0],coords[1]));}
return this.geometryFactory.createLineString(components);},'linearring':function(str){if(str===undefined){return this.geometryFactory.createLinearRing(null);}
var points=str.trim().split(',');var components=[];var coords;for(var i=0,len=points.length;i<len;++i){coords=points[i].trim().split(this.regExes.spaces);components.push(new jsts.geom.Coordinate(coords[0],coords[1]));}
return this.geometryFactory.createLinearRing(components);},'multilinestring':function(str){if(str===undefined){return this.geometryFactory.createMultiLineString(null);}
var line;var lines=str.trim().split(this.regExes.parenComma);var components=[];for(var i=0,len=lines.length;i<len;++i){line=lines[i].replace(this.regExes.trimParens,'$1');components.push(this.parse.linestring.apply(this,[line]));}
return this.geometryFactory.createMultiLineString(components);},'polygon':function(str){if(str===undefined){return this.geometryFactory.createPolygon(null);}
var ring,linestring,linearring;var rings=str.trim().split(this.regExes.parenComma);var shell;var holes=[];for(var i=0,len=rings.length;i<len;++i){ring=rings[i].replace(this.regExes.trimParens,'$1');linestring=this.parse.linestring.apply(this,[ring]);linearring=this.geometryFactory.createLinearRing(linestring.points);if(i===0){shell=linearring;}else{holes.push(linearring);}}
return this.geometryFactory.createPolygon(shell,holes);},'multipolygon':function(str){if(str===undefined){return this.geometryFactory.createMultiPolygon(null);}
var polygon;var polygons=str.trim().split(this.regExes.doubleParenComma);var components=[];for(var i=0,len=polygons.length;i<len;++i){polygon=polygons[i].replace(this.regExes.trimParens,'$1');components.push(this.parse.polygon.apply(this,[polygon]));}
return this.geometryFactory.createMultiPolygon(components);},'geometrycollection':function(str){if(str===undefined){return this.geometryFactory.createGeometryCollection(null);}
str=str.replace(/,\s*([A-Za-z])/g,'|$1');var wktArray=str.trim().split('|');var components=[];for(var i=0,len=wktArray.length;i<len;++i){components.push(jsts.io.WKTParser.prototype.read.apply(this,[wktArray[i]]));}
return this.geometryFactory.createGeometryCollection(components);}};jsts.index.ItemVisitor=function(){};jsts.index.ItemVisitor.prototype.visitItem=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.algorithm.CGAlgorithms=function(){};jsts.algorithm.CGAlgorithms.CLOCKWISE=-1;jsts.algorithm.CGAlgorithms.RIGHT=jsts.algorithm.CGAlgorithms.CLOCKWISE;jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE=1;jsts.algorithm.CGAlgorithms.LEFT=jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;jsts.algorithm.CGAlgorithms.COLLINEAR=0;jsts.algorithm.CGAlgorithms.STRAIGHT=jsts.algorithm.CGAlgorithms.COLLINEAR;jsts.algorithm.CGAlgorithms.orientationIndex=function(p1,p2,q){var dx1,dy1,dx2,dy2;dx1=p2.x-p1.x;dy1=p2.y-p1.y;dx2=q.x-p2.x;dy2=q.y-p2.y;return jsts.algorithm.RobustDeterminant.signOfDet2x2(dx1,dy1,dx2,dy2);};jsts.algorithm.CGAlgorithms.isPointInRing=function(p,ring){return jsts.algorithm.CGAlgorithms.locatePointInRing(p,ring)!==jsts.geom.Location.EXTERIOR;};jsts.algorithm.CGAlgorithms.locatePointInRing=function(p,ring){return jsts.algorithm.RayCrossingCounter.locatePointInRing(p,ring);};jsts.algorithm.CGAlgorithms.isOnLine=function(p,pt){var lineIntersector,i,il,p0,p1;lineIntersector=new jsts.algorithm.RobustLineIntersector();for(i=1,il=pt.length;i<il;i++){p0=pt[i-1];p1=pt[i];lineIntersector.computeIntersection(p,p0,p1);if(lineIntersector.hasIntersection()){return true;}}
return false;};jsts.algorithm.CGAlgorithms.isCCW=function(ring){var nPts,hiPt,hiIndex,p,iPrev,iNext,prev,next,i,disc,isCCW;nPts=ring.length-1;if(nPts<3){throw new jsts.IllegalArgumentError('Ring has fewer than 3 points, so orientation cannot be determined');}
hiPt=ring[0];hiIndex=0;i=1;for(i;i<=nPts;i++){p=ring[i];if(p.y>hiPt.y){hiPt=p;hiIndex=i;}}
iPrev=hiIndex;do{iPrev=iPrev-1;if(iPrev<0){iPrev=nPts;}}while(ring[iPrev].equals2D(hiPt)&&iPrev!==hiIndex);iNext=hiIndex;do{iNext=(iNext+1)%nPts;}while(ring[iNext].equals2D(hiPt)&&iNext!==hiIndex);prev=ring[iPrev];next=ring[iNext];if(prev.equals2D(hiPt)||next.equals2D(hiPt)||prev.equals2D(next)){return false;}
disc=jsts.algorithm.CGAlgorithms.computeOrientation(prev,hiPt,next);isCCW=false;if(disc===0){isCCW=(prev.x>next.x);}else{isCCW=(disc>0);}
return isCCW;};jsts.algorithm.CGAlgorithms.computeOrientation=function(p1,p2,q){return jsts.algorithm.CGAlgorithms.orientationIndex(p1,p2,q);};jsts.algorithm.CGAlgorithms.distancePointLine=function(p,A,B){if(!(A instanceof jsts.geom.Coordinate)){jsts.algorithm.CGAlgorithms.distancePointLine2.apply(this,arguments);}
if(A.x===B.x&&A.y===B.y){return p.distance(A);}
var r,s;r=((p.x-A.x)*(B.x-A.x)+(p.y-A.y)*(B.y-A.y))/((B.x-A.x)*(B.x-A.x)+(B.y-A.y)*(B.y-A.y));if(r<=0.0){return p.distance(A);}
if(r>=1.0){return p.distance(B);}
s=((A.y-p.y)*(B.x-A.x)-(A.x-p.x)*(B.y-A.y))/((B.x-A.x)*(B.x-A.x)+(B.y-A.y)*(B.y-A.y));return Math.abs(s)*Math.sqrt(((B.x-A.x)*(B.x-A.x)+(B.y-A.y)*(B.y-A.y)));};jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular=function(p,A,B){var s=((A.y-p.y)*(B.x-A.x)-(A.x-p.x)*(B.y-A.y))/((B.x-A.x)*(B.x-A.x)+(B.y-A.y)*(B.y-A.y));return Math.abs(s)*Math.sqrt(((B.x-A.x)*(B.x-A.x)+(B.y-A.y)*(B.y-A.y)));};jsts.algorithm.CGAlgorithms.distancePointLine2=function(p,line){var minDistance,i,il,dist;if(line.length===0){throw new jsts.error.IllegalArgumentError('Line array must contain at least one vertex');}
minDistance=p.distance(line[0]);for(i=0,il=line.length-1;i<il;i++){dist=jsts.algorithm.CGAlgorithms.distancePointLine(p,line[i],line[i+1]);if(dist<minDistance){minDistance=dist;}}
return minDistance;};jsts.algorithm.CGAlgorithms.distanceLineLine=function(A,B,C,D){if(A.equals(B)){return jsts.algorithm.CGAlgorithms.distancePointLine(A,C,D);}
if(C.equals(D)){return jsts.algorithm.CGAlgorithms.distancePointLine(D,A,B);}
var r_top,r_bot,s_top,s_bot,s,r;r_top=(A.y-C.y)*(D.x-C.x)-(A.x-C.x)*(D.y-C.y);r_bot=(B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x);s_top=(A.y-C.y)*(B.x-A.x)-(A.x-C.x)*(B.y-A.y);s_bot=(B.x-A.x)*(D.y-C.y)-(B.y-A.y)*(D.x-C.x);if((r_bot===0)||(s_bot===0)){return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A,C,D),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B,C,D),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(C,A,B),jsts.algorithm.CGAlgorithms.distancePointLine(D,A,B))));}
s=s_top/s_bot;r=r_top/r_bot;if((r<0)||(r>1)||(s<0)||(s>1)){return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A,C,D),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B,C,D),Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(C,A,B),jsts.algorithm.CGAlgorithms.distancePointLine(D,A,B))));}
return 0.0;};jsts.algorithm.CGAlgorithms.signedArea=function(ring){if(ring.length<3){return 0.0;}
var sum,i,il,bx,by,cx,cy;sum=0.0;for(i=0,il=ring.length-1;i<il;i++){bx=ring[i].x;by=ring[i].y;cx=ring[i+1].x;cy=ring[i+1].y;sum+=(bx+cx)*(cy-by);}
return-sum/2.0;};jsts.algorithm.CGAlgorithms.signedArea=function(ring){var n,sum,p,bx,by,i,cx,cy;n=ring.length;if(n<3){return 0.0;}
sum=0.0;p=ring[0];bx=p.x;by=p.y;for(i=1;i<n;i++){p=ring[i];cx=p.x;cy=p.y;sum+=(bx+cx)*(cy-by);bx=cx;by=cy;}
return-sum/2.0;};jsts.algorithm.CGAlgorithms.computeLength=function(pts){var n=pts.length,len,x0,y0,x1,y1,dx,dy,p,i,il;if(n<=1){return 0.0;}
len=0.0;p=pts[0];x0=p.x;y0=p.y;i=1,il=n;for(i;i<n;i++){p=pts[i];x1=p.x;y1=p.y;dx=x1-x0;dy=y1-y0;len+=Math.sqrt(dx*dx+dy*dy);x0=x1;y0=y1;}
return len;};jsts.algorithm.CGAlgorithms.length=function(){};jsts.algorithm.Angle=function(){};jsts.algorithm.Angle.PI_TIMES_2=2.0*Math.PI;jsts.algorithm.Angle.PI_OVER_2=Math.PI/2.0;jsts.algorithm.Angle.PI_OVER_4=Math.PI/4.0;jsts.algorithm.Angle.COUNTERCLOCKWISE=jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;jsts.algorithm.Angle.CLOCKWISE=jsts.algorithm.CGAlgorithms.CLOCKWISE;jsts.algorithm.Angle.NONE=jsts.algorithm.CGAlgorithms.COLLINEAR;jsts.algorithm.Angle.toDegrees=function(radians){return(radians*180)/Math.PI;};jsts.algorithm.Angle.toRadians=function(angleDegrees){return(angleDegrees*Math.PI)/180.0;};jsts.algorithm.Angle.angle=function(){if(arguments.length===1){return jsts.algorithm.Angle.angleFromOrigo(arguments[0]);}else{return jsts.algorithm.Angle.angleBetweenCoords(arguments[0],arguments[1]);}};jsts.algorithm.Angle.angleBetweenCoords=function(p0,p1){var dx,dy;dx=p1.x-p0.x;dy=p1.y-p0.y;return Math.atan2(dy,dx);};jsts.algorithm.Angle.angleFromOrigo=function(p){return Math.atan2(p.y,p.x);};jsts.algorithm.Angle.isAcute=function(p0,p1,p2){var dx0,dy0,dx1,dy1,dotprod;dx0=p0.x-p1.x;dy0=p0.y-p1.y;dx1=p2.x-p1.x;dy1=p2.y-p1.y;dotprod=dx0*dx1+dy0*dy1;return dotprod>0;};jsts.algorithm.Angle.isObtuse=function(p0,p1,p2){var dx0,dy0,dx1,dy1,dotprod;dx0=p0.x-p1.x;dy0=p0.y-p1.y;dx1=p2.x-p1.x;dy1=p2.y-p1.y;dotprod=dx0*dx1+dy0*dy1;return dotprod<0;};jsts.algorithm.Angle.angleBetween=function(tip1,tail,tip2){var a1,a2;a1=jsts.algorithm.Angle.angle(tail,tip1);a2=jsts.algorithm.Angle.angle(tail,tip2);return jsts.algorithm.Angle.diff(a1,a2);};jsts.algorithm.Angle.angleBetweenOriented=function(tip1,tail,tip2){var a1,a2,angDel;a1=jsts.algorithm.Angle.angle(tail,tip1);a2=jsts.algorithm.Angle.angle(tail,tip2);angDel=a2-a1;if(angDel<=-Math.PI){return angDel+jsts.algorithm.Angle.PI_TIMES_2;}
if(angDel>Math.PI){return angDel-jsts.algorithm.Angle.PI_TIMES_2;}
return angDel;};jsts.algorithm.Angle.interiorAngle=function(p0,p1,p2){var anglePrev,angleNext;anglePrev=jsts.algorithm.Angle.angle(p1,p0);angleNext=jsts.algorithm.Angle.angle(p1,p2);return Math.abs(angleNext-anglePrev);};jsts.algorithm.Angle.getTurn=function(ang1,ang2){var crossproduct=Math.sin(ang2-ang1);if(crossproduct>0){return jsts.algorithm.Angle.COUNTERCLOCKWISE;}
if(crossproduct<0){return jsts.algorithm.Angle.CLOCKWISE;}
return jsts.algorithm.Angle.NONE;};jsts.algorithm.Angle.normalize=function(angle){while(angle>Math.PI){angle-=jsts.algorithm.Angle.PI_TIMES_2;}
while(angle<=-Math.PI){angle+=jsts.algorithm.Angle.PI_TIMES_2;}
return angle;};jsts.algorithm.Angle.normalizePositive=function(angle){if(angle<0.0){while(angle<0.0){angle+=jsts.algorithm.Angle.PI_TIMES_2;}
if(angle>=jsts.algorithm.Angle.PI_TIMES_2){angle=0.0;}}
else{while(angle>=jsts.algorithm.Angle.PI_TIMES_2){angle-=jsts.algorithm.Angle.PI_TIMES_2;}
if(angle<0.0){angle=0.0;}}
return angle;};jsts.algorithm.Angle.diff=function(ang1,ang2){var delAngle;if(ang1<ang2){delAngle=ang2-ang1;}else{delAngle=ang1-ang2;}
if(delAngle>Math.PI){delAngle=(2*Math.PI)-delAngle;}
return delAngle;};jsts.geom.GeometryComponentFilter=function(){};jsts.geom.GeometryComponentFilter.prototype.filter=function(geom){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.util.LinearComponentExtracter=function(lines,isForcedToLineString){this.lines=lines;this.isForcedToLineString=isForcedToLineString;};jsts.geom.util.LinearComponentExtracter.prototype=new jsts.geom.GeometryComponentFilter();jsts.geom.util.LinearComponentExtracter.prototype.lines=null;jsts.geom.util.LinearComponentExtracter.prototype.isForcedToLineString=false;jsts.geom.util.LinearComponentExtracter.getLines=function(geoms,lines){if(arguments.length==1){return jsts.geom.util.LinearComponentExtracter.getLines5.apply(this,arguments);}
else if(arguments.length==2&&typeof lines==='boolean'){return jsts.geom.util.LinearComponentExtracter.getLines6.apply(this,arguments);}
else if(arguments.length==2&&geoms instanceof jsts.geom.Geometry){return jsts.geom.util.LinearComponentExtracter.getLines3.apply(this,arguments);}
else if(arguments.length==3&&geoms instanceof jsts.geom.Geometry){return jsts.geom.util.LinearComponentExtracter.getLines4.apply(this,arguments);}
else if(arguments.length==3){return jsts.geom.util.LinearComponentExtracter.getLines2.apply(this,arguments);}
for(var i=0;i<geoms.length;i++){var g=geoms[i];jsts.geom.util.LinearComponentExtracter.getLines3(g,lines);}
return lines;};jsts.geom.util.LinearComponentExtracter.getLines2=function(geoms,lines,forceToLineString){for(var i=0;i<geoms.length;i++){var g=geoms[i];jsts.geom.util.LinearComponentExtracter.getLines4(g,lines,forceToLineString);}
return lines;};jsts.geom.util.LinearComponentExtracter.getLines3=function(geom,lines){if(geom instanceof LineString){lines.add(geom);}else{geom.apply(new jsts.geom.util.LinearComponentExtracter(lines));}
return lines;};jsts.geom.util.LinearComponentExtracter.getLines4=function(geom,lines,forceToLineString){geom.apply(new jsts.geom.util.LinearComponentExtracter(lines,forceToLineString));return lines;};jsts.geom.util.LinearComponentExtracter.getLines5=function(geom){return jsts.geom.util.LinearComponentExtracter.getLines6(geom,false);};jsts.geom.util.LinearComponentExtracter.getLines6=function(geom,forceToLineString){var lines=[];geom.apply(new jsts.geom.util.LinearComponentExtracter(lines,forceToLineString));return lines;};jsts.geom.util.LinearComponentExtracter.prototype.setForceToLineString=function(isForcedToLineString){this.isForcedToLineString=isForcedToLineString;};jsts.geom.util.LinearComponentExtracter.prototype.filter=function(geom){if(this.isForcedToLineString&&geom instanceof jsts.geom.LinearRing){var line=geom.getFactory().createLineString(geom.getCoordinateSequence());this.lines.push(line);return;}
if(geom instanceof jsts.geom.LineString||geom instanceof jsts.geom.LinearRing)
this.lines.push(geom);};jsts.geom.Location=function(){};jsts.geom.Location.INTERIOR=0;jsts.geom.Location.BOUNDARY=1;jsts.geom.Location.EXTERIOR=2;jsts.geom.Location.NONE=-1;jsts.geom.Location.toLocationSymbol=function(locationValue){switch(locationValue){case jsts.geom.Location.EXTERIOR:return'e';case jsts.geom.Location.BOUNDARY:return'b';case jsts.geom.Location.INTERIOR:return'i';case jsts.geom.Location.NONE:return'-';}
throw new jsts.IllegalArgumentError('Unknown location value: '+
locationValue);};(function(){jsts.io.GeoJSONReader=function(geometryFactory){this.geometryFactory=geometryFactory||new jsts.geom.GeometryFactory();this.precisionModel=this.geometryFactory.getPrecisionModel();this.parser=new jsts.io.GeoJSONParser(this.geometryFactory);};jsts.io.GeoJSONReader.prototype.read=function(geoJson){var geometry=this.parser.read(geoJson);if(this.precisionModel.getType()===jsts.geom.PrecisionModel.FIXED){this.reducePrecision(geometry);}
return geometry;};jsts.io.GeoJSONReader.prototype.reducePrecision=function(geometry){var i,len;if(geometry.coordinate){this.precisionModel.makePrecise(geometry.coordinate);}else if(geometry.points){for(i=0,len=geometry.points.length;i<len;i++){this.precisionModel.makePrecise(geometry.points[i]);}}else if(geometry.geometries){for(i=0,len=geometry.geometries.length;i<len;i++){this.reducePrecision(geometry.geometries[i]);}}};})();jsts.geom.Geometry=function(factory){this.factory=factory;};jsts.geom.Geometry.prototype.envelope=null;jsts.geom.Geometry.prototype.factory=null;jsts.geom.Geometry.prototype.getGeometryType=function(){return'Geometry';};jsts.geom.Geometry.hasNonEmptyElements=function(geometries){var i;for(i=0;i<geometries.length;i++){if(!geometries[i].isEmpty()){return true;}}
return false;};jsts.geom.Geometry.hasNullElements=function(array){var i;for(i=0;i<array.length;i++){if(array[i]===null){return true;}}
return false;};jsts.geom.Geometry.prototype.getFactory=function(){if(this.factory===null||this.factory===undefined){this.factory=new jsts.geom.GeometryFactory();}
return this.factory;};jsts.geom.Geometry.prototype.getNumGeometries=function(){return 1;};jsts.geom.Geometry.prototype.getGeometryN=function(n){return this;};jsts.geom.Geometry.prototype.getPrecisionModel=function(){return this.getFactory().getPrecisionModel();};jsts.geom.Geometry.prototype.getCoordinate=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.getCoordinates=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.getNumPoints=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.isSimple=function(){this.checkNotGeometryCollection(this);var op=new jsts.operation.IsSimpleOp(this);return op.isSimple();};jsts.geom.Geometry.prototype.isValid=function(){var isValidOp=new jsts.operation.valid.IsValidOp(this);return isValidOp.isValid();};jsts.geom.Geometry.prototype.isEmpty=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.distance=function(g){return jsts.operation.distance.DistanceOp.distance(this,g);};jsts.geom.Geometry.prototype.isWithinDistance=function(geom,distance){var envDist=this.getEnvelopeInternal().distance(geom.getEnvelopeInternal());if(envDist>distance){return false;}
return DistanceOp.isWithinDistance(this,geom,distance);};jsts.geom.Geometry.prototype.isRectangle=function(){return false;};jsts.geom.Geometry.prototype.getArea=function(){return 0.0;};jsts.geom.Geometry.prototype.getLength=function(){return 0.0;};jsts.geom.Geometry.prototype.getCentroid=function(){if(this.isEmpty()){return null;}
var cent;var centPt=null;var dim=this.getDimension();if(dim===0){cent=new jsts.algorithm.CentroidPoint();cent.add(this);centPt=cent.getCentroid();}else if(dim===1){cent=new jsts.algorithm.CentroidLine();cent.add(this);centPt=cent.getCentroid();}else{cent=new jsts.algorithm.CentroidArea();cent.add(this);centPt=cent.getCentroid();}
return this.createPointFromInternalCoord(centPt,this);};jsts.geom.Geometry.prototype.getInteriorPoint=function(){var intPt;var interiorPt=null;var dim=this.getDimension();if(dim===0){intPt=new jsts.algorithm.InteriorPointPoint(this);interiorPt=intPt.getInteriorPoint();}else if(dim===1){intPt=new jsts.algorithm.InteriorPointLine(this);interiorPt=intPt.getInteriorPoint();}else{intPt=new jsts.algorithm.InteriorPointArea(this);interiorPt=intPt.getInteriorPoint();}
return this.createPointFromInternalCoord(interiorPt,this);};jsts.geom.Geometry.prototype.getDimension=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.getBoundary=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.getBoundaryDimension=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.getEnvelope=function(){return this.getFactory().toGeometry(this.getEnvelopeInternal());};jsts.geom.Geometry.prototype.getEnvelopeInternal=function(){if(this.envelope===null){this.envelope=this.computeEnvelopeInternal();}
return this.envelope;};jsts.geom.Geometry.prototype.disjoint=function(g){return!this.intersects(g);};jsts.geom.Geometry.prototype.touches=function(g){if(!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())){return false;}
return this.relate(g).isTouches(this.getDimension(),g.getDimension());};jsts.geom.Geometry.prototype.intersects=function(g){if(!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())){return false;}
if(this.isRectangle()){return jsts.operation.predicate.RectangleIntersects.intersects(this,g);}
if(g.isRectangle()){return jsts.operation.predicate.RectangleIntersects.intersects(g,this);}
return this.relate(g).isIntersects();};jsts.geom.Geometry.prototype.crosses=function(g){if(!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())){return false;}
return this.relate(g).isCrosses(this.getDimension(),g.getDimension());};jsts.geom.Geometry.prototype.within=function(g){return g.contains(this);};jsts.geom.Geometry.prototype.contains=function(g){if(!this.getEnvelopeInternal().contains(g.getEnvelopeInternal())){return false;}
if(this.isRectangle()){return jsts.operation.predicate.RectangleContains.contains(this,g);}
return this.relate(g).isContains();};jsts.geom.Geometry.prototype.overlaps=function(g){if(!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())){return false;}
return this.relate(g).isOverlaps(this.getDimension(),g.getDimension());};jsts.geom.Geometry.prototype.covers=function(g){if(!this.getEnvelopeInternal().covers(g.getEnvelopeInternal())){return false;}
if(this.isRectangle()){return true;}
return this.relate(g).isCovers();};jsts.geom.Geometry.prototype.coveredBy=function(g){return g.covers(this);};jsts.geom.Geometry.prototype.relate=function(g,intersectionPattern){if(arguments.length===1){return this.relate2.apply(this,arguments);}
return this.relate2(g).matches(intersectionPattern);};jsts.geom.Geometry.prototype.relate2=function(g){this.checkNotGeometryCollection(this);this.checkNotGeometryCollection(g);return jsts.operation.relate.RelateOp.relate(this,g);};jsts.geom.Geometry.prototype.equalsTopo=function(g){if(!this.getEnvelopeInternal().equals(g.getEnvelopeInternal())){return false;}
return this.relate(g).isEquals(this.getDimension(),g.getDimension());};jsts.geom.Geometry.prototype.equals=function(o){if(o instanceof jsts.geom.Geometry||o instanceof jsts.geom.LinearRing||o instanceof jsts.geom.Polygon||o instanceof jsts.geom.GeometryCollection||o instanceof jsts.geom.MultiPoint||o instanceof jsts.geom.MultiLineString||o instanceof jsts.geom.MultiPolygon){return this.equalsExact(o);}
return false;};jsts.geom.Geometry.prototype.buffer=function(distance,quadrantSegments,endCapStyle){var params=new jsts.operation.buffer.BufferParameters(quadrantSegments,endCapStyle)
return jsts.operation.buffer.BufferOp.bufferOp2(this,distance,params);};jsts.geom.Geometry.prototype.convexHull=function(){return new jsts.algorithm.ConvexHull(this).getConvexHull();};jsts.geom.Geometry.prototype.intersection=function(other){if(this.isEmpty()){return this.getFactory().createGeometryCollection(null);}
if(other.isEmpty()){return this.getFactory().createGeometryCollection(null);}
if(this.isGeometryCollection(this)){var g2=other;}
this.checkNotGeometryCollection(this);this.checkNotGeometryCollection(other);return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,other,jsts.operation.overlay.OverlayOp.INTERSECTION);};jsts.geom.Geometry.prototype.union=function(other){if(arguments.length===0){return jsts.operation.union.UnaryUnionOp.union(this);}
if(this.isEmpty()){return other.clone();}
if(other.isEmpty()){return this.clone();}
this.checkNotGeometryCollection(this);this.checkNotGeometryCollection(other);return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,other,jsts.operation.overlay.OverlayOp.UNION);};jsts.geom.Geometry.prototype.difference=function(other){if(this.isEmpty()){return this.getFactory().createGeometryCollection(null);}
if(other.isEmpty()){return this.clone();}
this.checkNotGeometryCollection(this);this.checkNotGeometryCollection(other);return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,other,jsts.operation.overlay.OverlayOp.DIFFERENCE);};jsts.geom.Geometry.prototype.symDifference=function(other){if(this.isEmpty()){return other.clone();}
if(other.isEmpty()){return this.clone();}
this.checkNotGeometryCollection(this);this.checkNotGeometryCollection(other);return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,other,jsts.operation.overlay.OverlayOp.SYMDIFFERENCE);};jsts.geom.Geometry.prototype.equalsExact=function(other,tolerance){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.equalsNorm=function(g){if(g===null||g===undefined)
return false;return this.norm().equalsExact(g.norm());};jsts.geom.Geometry.prototype.apply=function(filter){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.clone=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.normalize=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.norm=function(){var copy=this.clone();copy.normalize();return copy;};jsts.geom.Geometry.prototype.compareTo=function(o){var other=o;if(this.getClassSortIndex()!==other.getClassSortIndex()){return this.getClassSortIndex()-other.getClassSortIndex();}
if(this.isEmpty()&&other.isEmpty()){return 0;}
if(this.isEmpty()){return-1;}
if(other.isEmpty()){return 1;}
return this.compareToSameClass(o);};jsts.geom.Geometry.prototype.isEquivalentClass=function(other){if(this instanceof jsts.geom.Point&&other instanceof jsts.geom.Point){return true;}else if(this instanceof jsts.geom.LineString&&(other instanceof jsts.geom.LineString|other instanceof jsts.geom.LinearRing)){return true;}else if(this instanceof jsts.geom.LinearRing&&(other instanceof jsts.geom.LineString|other instanceof jsts.geom.LinearRing)){return true;}else if(this instanceof jsts.geom.Polygon&&(other instanceof jsts.geom.Polygon)){return true;}else if(this instanceof jsts.geom.MultiPoint&&(other instanceof jsts.geom.MultiPoint)){return true;}else if(this instanceof jsts.geom.MultiLineString&&(other instanceof jsts.geom.MultiLineString)){return true;}else if(this instanceof jsts.geom.MultiPolygon&&(other instanceof jsts.geom.MultiPolygon)){return true;}else if(this instanceof jsts.geom.GeometryCollection&&(other instanceof jsts.geom.GeometryCollection)){return true;}
return false;};jsts.geom.Geometry.prototype.checkNotGeometryCollection=function(g){if(g.isGeometryCollectionBase()){throw new jsts.error.IllegalArgumentError('This method does not support GeometryCollection');}};jsts.geom.Geometry.prototype.isGeometryCollection=function(){return(this instanceof jsts.geom.GeometryCollection);};jsts.geom.Geometry.prototype.isGeometryCollectionBase=function(){return(this.CLASS_NAME==='jsts.geom.GeometryCollection');};jsts.geom.Geometry.prototype.computeEnvelopeInternal=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.compareToSameClass=function(o){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.Geometry.prototype.compare=function(a,b){var i=a.iterator();var j=b.iterator();while(i.hasNext()&&j.hasNext()){var aElement=i.next();var bElement=j.next();var comparison=aElement.compareTo(bElement);if(comparison!==0){return comparison;}}
if(i.hasNext()){return 1;}
if(j.hasNext()){return-1;}
return 0;};jsts.geom.Geometry.prototype.equal=function(a,b,tolerance){if(tolerance===undefined||tolerance===null||tolerance===0){return a.equals(b);}
return a.distance(b)<=tolerance;};jsts.geom.Geometry.prototype.getClassSortIndex=function(){var sortedClasses=[jsts.geom.Point,jsts.geom.MultiPoint,jsts.geom.LineString,jsts.geom.LinearRing,jsts.geom.MultiLineString,jsts.geom.Polygon,jsts.geom.MultiPolygon,jsts.geom.GeometryCollection];for(var i=0;i<sortedClasses.length;i++){if(this instanceof sortedClasses[i])
return i;}
jsts.util.Assert.shouldNeverReachHere('Class not supported: '+this);return-1;};jsts.geom.Geometry.prototype.toString=function(){return new jsts.io.WKTWriter().write(this);};jsts.geom.Geometry.prototype.createPointFromInternalCoord=function(coord,exemplar){exemplar.getPrecisionModel().makePrecise(coord);return exemplar.getFactory().createPoint(coord);};(function(){jsts.geom.Coordinate=function(x,y){if(typeof x==='number'){this.x=x;this.y=y;}else if(x instanceof jsts.geom.Coordinate){this.x=parseFloat(x.x);this.y=parseFloat(x.y);}else if(x===undefined||x===null){this.x=0;this.y=0;}else if(typeof x==='string'){this.x=parseFloat(x);this.y=parseFloat(y);}};jsts.geom.Coordinate.prototype.setCoordinate=function(other){this.x=other.x;this.y=other.y;};jsts.geom.Coordinate.prototype.clone=function(){return new jsts.geom.Coordinate(this.x,this.y);};jsts.geom.Coordinate.prototype.distance=function(p){var dx=this.x-p.x;var dy=this.y-p.y;return Math.sqrt(dx*dx+dy*dy);};jsts.geom.Coordinate.prototype.equals2D=function(other){if(this.x!==other.x){return false;}
if(this.y!==other.y){return false;}
return true;};jsts.geom.Coordinate.prototype.equals=function(other){if(!other instanceof jsts.geom.Coordinate||other===undefined){return false;}
return this.equals2D(other);};jsts.geom.Coordinate.prototype.compareTo=function(other){if(this.x<other.x){return-1;}
if(this.x>other.x){return 1;}
if(this.y<other.y){return-1;}
if(this.y>other.y){return 1;}
return 0;};jsts.geom.Coordinate.prototype.toString=function(){return'('+this.x+', '+this.y+')';};})();jsts.geom.Envelope=function(){jsts.geom.Envelope.prototype.init.apply(this,arguments);};jsts.geom.Envelope.prototype.minx=null;jsts.geom.Envelope.prototype.maxx=null;jsts.geom.Envelope.prototype.miny=null;jsts.geom.Envelope.prototype.maxy=null;jsts.geom.Envelope.prototype.init=function(){if(typeof arguments[0]==='number'&&arguments.length===4){this.initFromValues(arguments[0],arguments[1],arguments[2],arguments[3]);}else if(arguments[0]instanceof jsts.geom.Coordinate&&arguments.length===1){this.initFromCoordinate(arguments[0]);}else if(arguments[0]instanceof jsts.geom.Coordinate&&arguments.length===2){this.initFromCoordinates(arguments[0],arguments[1]);}else if(arguments[0]instanceof jsts.geom.Envelope&&arguments.length===1){this.initFromEnvelope(arguments[0]);}else{this.setToNull();}};jsts.geom.Envelope.prototype.initFromValues=function(x1,x2,y1,y2){if(x1<x2){this.minx=x1;this.maxx=x2;}else{this.minx=x2;this.maxx=x1;}
if(y1<y2){this.miny=y1;this.maxy=y2;}else{this.miny=y2;this.maxy=y1;}};jsts.geom.Envelope.prototype.initFromCoordinates=function(p1,p2){this.initFromValues(p1.x,p2.x,p1.y,p2.y);};jsts.geom.Envelope.prototype.initFromCoordinate=function(p){this.initFromValues(p.x,p.x,p.y,p.y);};jsts.geom.Envelope.prototype.initFromEnvelope=function(env){this.minx=env.minx;this.maxx=env.maxx;this.miny=env.miny;this.maxy=env.maxy;};jsts.geom.Envelope.prototype.setToNull=function(){this.minx=0;this.maxx=-1;this.miny=0;this.maxy=-1;};jsts.geom.Envelope.prototype.isNull=function(){return this.maxx<this.minx;};jsts.geom.Envelope.prototype.getHeight=function(){if(this.isNull()){return 0;}
return this.maxy-this.miny;};jsts.geom.Envelope.prototype.getWidth=function(){if(this.isNull()){return 0;}
return this.maxx-this.minx;};jsts.geom.Envelope.prototype.getMinX=function(){return this.minx;};jsts.geom.Envelope.prototype.getMaxX=function(){return this.maxx;};jsts.geom.Envelope.prototype.getMinY=function(){return this.miny;};jsts.geom.Envelope.prototype.getMaxY=function(){return this.maxy;};jsts.geom.Envelope.prototype.getArea=function(){return this.getWidth()*this.getHeight();};jsts.geom.Envelope.prototype.expandToInclude=function(){if(arguments[0]instanceof jsts.geom.Coordinate){this.expandToIncludeCoordinate(arguments[0]);}else if(arguments[0]instanceof jsts.geom.Envelope){this.expandToIncludeEnvelope(arguments[0]);}else{this.expandToIncludeValues(arguments[0],arguments[1]);}};jsts.geom.Envelope.prototype.expandToIncludeCoordinate=function(p){this.expandToIncludeValues(p.x,p.y);};jsts.geom.Envelope.prototype.expandToIncludeValues=function(x,y){if(this.isNull()){this.minx=x;this.maxx=x;this.miny=y;this.maxy=y;}else{if(x<this.minx){this.minx=x;}
if(x>this.maxx){this.maxx=x;}
if(y<this.miny){this.miny=y;}
if(y>this.maxy){this.maxy=y;}}};jsts.geom.Envelope.prototype.expandToIncludeEnvelope=function(other){if(other.isNull()){return;}
if(this.isNull()){this.minx=other.getMinX();this.maxx=other.getMaxX();this.miny=other.getMinY();this.maxy=other.getMaxY();}else{if(other.minx<this.minx){this.minx=other.minx;}
if(other.maxx>this.maxx){this.maxx=other.maxx;}
if(other.miny<this.miny){this.miny=other.miny;}
if(other.maxy>this.maxy){this.maxy=other.maxy;}}};jsts.geom.Envelope.prototype.expandBy=function(){if(arguments.length===1){this.expandByDistance(arguments[0]);}else{this.expandByDistances(arguments[0],arguments[1]);}};jsts.geom.Envelope.prototype.expandByDistance=function(distance){this.expandByDistances(distance,distance);};jsts.geom.Envelope.prototype.expandByDistances=function(deltaX,deltaY){if(this.isNull()){return;}
this.minx-=deltaX;this.maxx+=deltaX;this.miny-=deltaY;this.maxy+=deltaY;if(this.minx>this.maxx||this.miny>this.maxy){this.setToNull();}};jsts.geom.Envelope.prototype.translate=function(transX,transY){if(this.isNull()){return;}
this.init(this.minx+transX,this.maxx+transX,this.miny+transY,this.maxy+transY);};jsts.geom.Envelope.prototype.centre=function(){if(this.isNull()){return null;}
return new jsts.geom.Coordinate((this.minx+this.maxx)/2.0,(this.miny+this.maxy)/2.0);};jsts.geom.Envelope.prototype.intersection=function(env){if(this.isNull()||env.isNull()||!this.intersects(env)){return new jsts.geom.Envelope();}
var intMinX=this.minx>env.minx?this.minx:env.minx;var intMinY=this.miny>env.miny?this.miny:env.miny;var intMaxX=this.maxx<env.maxx?this.maxx:env.maxx;var intMaxY=this.maxy<env.maxy?this.maxy:env.maxy;return new jsts.geom.Envelope(intMinX,intMaxX,intMinY,intMaxY);};jsts.geom.Envelope.prototype.intersects=function(){if(arguments[0]instanceof jsts.geom.Envelope){return this.intersectsEnvelope(arguments[0]);}else if(arguments[0]instanceof jsts.geom.Coordinate){return this.intersectsCoordinate(arguments[0]);}else{return this.intersectsValues(arguments[0],arguments[1]);}};jsts.geom.Envelope.prototype.intersectsEnvelope=function(other){if(this.isNull()||other.isNull()){return false;}
var result=!(other.minx>this.maxx||other.maxx<this.minx||other.miny>this.maxy||other.maxy<this.miny);return result;};jsts.geom.Envelope.prototype.intersectsCoordinate=function(p){return this.intersectsValues(p.x,p.y);};jsts.geom.Envelope.prototype.intersectsValues=function(x,y){if(this.isNull()){return false;}
return!(x>this.maxx||x<this.minx||y>this.maxy||y<this.miny);};jsts.geom.Envelope.prototype.contains=function(){if(arguments[0]instanceof jsts.geom.Envelope){return this.containsEnvelope(arguments[0]);}else if(arguments[0]instanceof jsts.geom.Coordinate){return this.containsCoordinate(arguments[0]);}else{return this.containsValues(arguments[0],arguments[1]);}};jsts.geom.Envelope.prototype.containsEnvelope=function(other){return this.coversEnvelope(other);};jsts.geom.Envelope.prototype.containsCoordinate=function(p){return this.coversCoordinate(p);};jsts.geom.Envelope.prototype.containsValues=function(x,y){return this.coversValues(x,y);};jsts.geom.Envelope.prototype.covers=function(){if(arguments[0]instanceof jsts.geom.Envelope){return this.coversEnvelope(arguments[0]);}else if(arguments[0]instanceof jsts.geom.Coordinate){return this.coversCoordinate(arguments[0]);}else{return this.coversValues(arguments[0],arguments[1]);}};jsts.geom.Envelope.prototype.coversValues=function(x,y){if(this.isNull()){return false;}
return x>=this.minx&&x<=this.maxx&&y>=this.miny&&y<=this.maxy;};jsts.geom.Envelope.prototype.coversCoordinate=function(p){return this.coversValues(p.x,p.y);};jsts.geom.Envelope.prototype.coversEnvelope=function(other){if(this.isNull()||other.isNull()){return false;}
return other.minx>=this.minx&&other.maxx<=this.maxx&&other.miny>=this.miny&&other.maxy<=this.maxy;};jsts.geom.Envelope.prototype.distance=function(env){if(this.intersects(env)){return 0;}
var dx=0.0;if(this.maxx<env.minx){dx=env.minx-this.maxx;}
if(this.minx>env.maxx){dx=this.minx-env.maxx;}
var dy=0.0;if(this.maxy<env.miny){dy=env.miny-this.maxy;}
if(this.miny>env.maxy){dy=this.miny-env.maxy;}
if(dx===0.0){return dy;}
if(dy===0.0){return dx;}
return Math.sqrt(dx*dx+dy*dy);};jsts.geom.Envelope.prototype.equals=function(other){if(this.isNull()){return other.isNull();}
return this.maxx===other.maxx&&this.maxy===other.maxy&&this.minx===other.minx&&this.miny===other.miny;};jsts.geom.Envelope.prototype.toString=function(){return'Env['+this.minx+' : '+this.maxx+', '+this.miny+' : '+
this.maxy+']';};jsts.geom.Envelope.intersects=function(p1,p2,q){if(arguments.length===4){return jsts.geom.Envelope.intersectsEnvelope(arguments[0],arguments[1],arguments[2],arguments[3]);}
var xc1=p1.x<p2.x?p1.x:p2.x;var xc2=p1.x>p2.x?p1.x:p2.x;var yc1=p1.y<p2.y?p1.y:p2.y;var yc2=p1.y>p2.y?p1.y:p2.y;if(((q.x>=xc1)&&(q.x<=xc2))&&((q.y>=yc1)&&(q.y<=yc2))){return true;}
return false;};jsts.geom.Envelope.intersectsEnvelope=function(p1,p2,q1,q2){var minq=Math.min(q1.x,q2.x);var maxq=Math.max(q1.x,q2.x);var minp=Math.min(p1.x,p2.x);var maxp=Math.max(p1.x,p2.x);if(minp>maxq){return false;}
if(maxp<minq){return false;}
minq=Math.min(q1.y,q2.y);maxq=Math.max(q1.y,q2.y);minp=Math.min(p1.y,p2.y);maxp=Math.max(p1.y,p2.y);if(minp>maxq){return false;}
if(maxp<minq){return false;}
return true;};jsts.geom.Envelope.prototype.clone=function(){return new jsts.geom.Envelope(this.minx,this.maxx,this.miny,this.maxy);};jsts.geom.util.GeometryCombiner=function(geoms){this.geomFactory=jsts.geom.util.GeometryCombiner.extractFactory(geoms);this.inputGeoms=geoms;};jsts.geom.util.GeometryCombiner.combine=function(geoms){if(arguments.length>1)return this.combine2.apply(this,arguments);var combiner=new jsts.geom.util.GeometryCombiner(geoms);return combiner.combine();};jsts.geom.util.GeometryCombiner.combine2=function(){var arrayList=new javascript.util.ArrayList();Array.prototype.slice.call(arguments).forEach(function(a){arrayList.add(a);});var combiner=new jsts.geom.util.GeometryCombiner(arrayList);return combiner.combine();};jsts.geom.util.GeometryCombiner.prototype.geomFactory=null;jsts.geom.util.GeometryCombiner.prototype.skipEmpty=false;jsts.geom.util.GeometryCombiner.prototype.inputGeoms;jsts.geom.util.GeometryCombiner.extractFactory=function(geoms){if(geoms.isEmpty())return null;return geoms.iterator().next().getFactory();};jsts.geom.util.GeometryCombiner.prototype.combine=function(){var elems=new javascript.util.ArrayList(),i;for(i=this.inputGeoms.iterator();i.hasNext();){var g=i.next();this.extractElements(g,elems);}
if(elems.size()===0){if(this.geomFactory!==null){return this.geomFactory.createGeometryCollection(null);}
return null;}
return this.geomFactory.buildGeometry(elems);};jsts.geom.util.GeometryCombiner.prototype.extractElements=function(geom,elems){if(geom===null){return;}
for(var i=0;i<geom.getNumGeometries();i++){var elemGeom=geom.getGeometryN(i);if(this.skipEmpty&&elemGeom.isEmpty()){continue;}
elems.add(elemGeom);}};jsts.geom.PrecisionModel=function(modelType){if(typeof modelType==='number'){this.modelType=jsts.geom.PrecisionModel.FIXED;this.scale=modelType;return;}
this.modelType=modelType||jsts.geom.PrecisionModel.FLOATING;if(this.modelType===jsts.geom.PrecisionModel.FIXED){this.scale=1.0;}};jsts.geom.PrecisionModel.FLOATING='FLOATING';jsts.geom.PrecisionModel.FIXED='FIXED';jsts.geom.PrecisionModel.FLOATING_SINGLE='FLOATING_SINGLE';jsts.geom.PrecisionModel.prototype.scale=null;jsts.geom.PrecisionModel.prototype.modelType=null;jsts.geom.PrecisionModel.prototype.isFloating=function(){return this.modelType===jsts.geom.PrecisionModel.FLOATING||this.modelType===jsts.geom.PrecisionModel.FLOATING_SINLGE;};jsts.geom.PrecisionModel.prototype.getScale=function(){return this.scale;};jsts.geom.PrecisionModel.prototype.getType=function(){return this.modelType;};jsts.geom.PrecisionModel.prototype.equals=function(other){return true;if(!(other instanceof jsts.geom.PrecisionModel)){return false;}
var otherPrecisionModel=other;return this.modelType===otherPrecisionModel.modelType&&this.scale===otherPrecisionModel.scale;};jsts.geom.PrecisionModel.prototype.makePrecise=function(val){if(val instanceof jsts.geom.Coordinate){this.makePrecise2(val);return;}
if(isNaN(val))
return val;if(this.modelType===jsts.geom.PrecisionModel.FIXED){return Math.round(val*this.scale)/this.scale;}
return val;};jsts.geom.PrecisionModel.prototype.makePrecise2=function(coord){if(this.modelType===jsts.geom.PrecisionModel.FLOATING)
return;coord.x=this.makePrecise(coord.x);coord.y=this.makePrecise(coord.y);};jsts.geom.PrecisionModel.prototype.compareTo=function(o){var other=o;return 0;};jsts.geom.CoordinateFilter=function(){};jsts.geom.CoordinateFilter.prototype.filter=function(coord){throw new jsts.error.AbstractMethodInvocationError();};jsts.simplify.DouglasPeuckerLineSimplifier=function(pts){this.pts=pts;this.seg=new jsts.geom.LineSegment();};jsts.simplify.DouglasPeuckerLineSimplifier.prototype.pts=null;jsts.simplify.DouglasPeuckerLineSimplifier.prototype.usePt=null;jsts.simplify.DouglasPeuckerLineSimplifier.prototype.distanceTolerance=null;jsts.simplify.DouglasPeuckerLineSimplifier.simplify=function(pts,distanceTolerance){var simp=new jsts.simplify.DouglasPeuckerLineSimplifier(pts);simp.setDistanceTolerance(distanceTolerance);return simp.simplify();};jsts.simplify.DouglasPeuckerLineSimplifier.prototype.setDistanceTolerance=function(distanceTolerance){this.distanceTolerance=distanceTolerance;};jsts.simplify.DouglasPeuckerLineSimplifier.prototype.simplify=function(){this.usePt=[];for(var i=0;i<this.pts.length;i++){this.usePt[i]=true;}
this.simplifySection(0,this.pts.length-1);var coordList=new jsts.geom.CoordinateList();for(var j=0;j<this.pts.length;j++){if(this.usePt[j]){coordList.add(new jsts.geom.Coordinate(this.pts[j]));}}
return coordList.toCoordinateArray();};jsts.simplify.DouglasPeuckerLineSimplifier.prototype.seg=null;jsts.simplify.DouglasPeuckerLineSimplifier.prototype.simplifySection=function(i,j){if(i+1==j){return;}
this.seg.p0=this.pts[i];this.seg.p1=this.pts[j];var maxDistance=-1.0;var maxIndex=i;for(var k=i+1;k<j;k++){var distance=this.seg.distance(this.pts[k]);if(distance>maxDistance){maxDistance=distance;maxIndex=k;}}
if(maxDistance<=this.distanceTolerance){for(var l=i+1;l<j;l++){this.usePt[l]=false;}}else{this.simplifySection(i,maxIndex);this.simplifySection(maxIndex,j);}};jsts.geomgraph.EdgeIntersection=function(coord,segmentIndex,dist){this.coord=new jsts.geom.Coordinate(coord);this.segmentIndex=segmentIndex;this.dist=dist;};jsts.geomgraph.EdgeIntersection.prototype.coord=null;jsts.geomgraph.EdgeIntersection.prototype.segmentIndex=null;jsts.geomgraph.EdgeIntersection.prototype.dist=null;jsts.geomgraph.EdgeIntersection.prototype.getCoordinate=function(){return this.coord;};jsts.geomgraph.EdgeIntersection.prototype.getSegmentIndex=function(){return this.segmentIndex;};jsts.geomgraph.EdgeIntersection.prototype.getDistance=function(){return this.dist;};jsts.geomgraph.EdgeIntersection.prototype.compareTo=function(other){return this.compare(other.segmentIndex,other.dist);};jsts.geomgraph.EdgeIntersection.prototype.compare=function(segmentIndex,dist){if(this.segmentIndex<segmentIndex)
return-1;if(this.segmentIndex>segmentIndex)
return 1;if(this.dist<dist)
return-1;if(this.dist>dist)
return 1;return 0;};jsts.geomgraph.EdgeIntersection.prototype.isEndPoint=function(maxSegmentIndex){if(this.segmentIndex===0&&this.dist===0.0)
return true;if(this.segmentIndex===maxSegmentIndex)
return true;return false;};jsts.geomgraph.EdgeIntersection.prototype.toString=function(){return''+this.segmentIndex+this.dist;};(function(){var EdgeIntersection=jsts.geomgraph.EdgeIntersection;var TreeMap=javascript.util.TreeMap;jsts.geomgraph.EdgeIntersectionList=function(edge){this.nodeMap=new TreeMap();this.edge=edge;};jsts.geomgraph.EdgeIntersectionList.prototype.nodeMap=null;jsts.geomgraph.EdgeIntersectionList.prototype.edge=null;jsts.geomgraph.EdgeIntersectionList.prototype.isIntersection=function(pt){for(var it=this.iterator();it.hasNext();){var ei=it.next();if(ei.coord.equals(pt)){return true;}}
return false;};jsts.geomgraph.EdgeIntersectionList.prototype.add=function(intPt,segmentIndex,dist){var eiNew=new EdgeIntersection(intPt,segmentIndex,dist);var ei=this.nodeMap.get(eiNew);if(ei!==null){return ei;}
this.nodeMap.put(eiNew,eiNew);return eiNew;};jsts.geomgraph.EdgeIntersectionList.prototype.iterator=function(){return this.nodeMap.values().iterator();};jsts.geomgraph.EdgeIntersectionList.prototype.addEndpoints=function(){var maxSegIndex=this.edge.pts.length-1;this.add(this.edge.pts[0],0,0.0);this.add(this.edge.pts[maxSegIndex],maxSegIndex,0.0);};jsts.geomgraph.EdgeIntersectionList.prototype.addSplitEdges=function(edgeList)
{this.addEndpoints();var it=this.iterator();var eiPrev=it.next();while(it.hasNext()){var ei=it.next();var newEdge=this.createSplitEdge(eiPrev,ei);edgeList.add(newEdge);eiPrev=ei;}};jsts.geomgraph.EdgeIntersectionList.prototype.createSplitEdge=function(ei0,ei1){var npts=ei1.segmentIndex-ei0.segmentIndex+2;var lastSegStartPt=this.edge.pts[ei1.segmentIndex];var useIntPt1=ei1.dist>0.0||!ei1.coord.equals2D(lastSegStartPt);if(!useIntPt1){npts--;}
var pts=[];var ipt=0;pts[ipt++]=new jsts.geom.Coordinate(ei0.coord);for(var i=ei0.segmentIndex+1;i<=ei1.segmentIndex;i++){pts[ipt++]=this.edge.pts[i];}
if(useIntPt1)pts[ipt]=ei1.coord;return new jsts.geomgraph.Edge(pts,new jsts.geomgraph.Label(this.edge.label));};})();(function(){var AssertionFailedException=function(message){this.message=message;};AssertionFailedException.prototype=new Error();AssertionFailedException.prototype.name='AssertionFailedException';jsts.util.AssertionFailedException=AssertionFailedException;})();(function(){var AssertionFailedException=jsts.util.AssertionFailedException;jsts.util.Assert=function(){};jsts.util.Assert.isTrue=function(assertion,message){if(!assertion){if(message===null){throw new AssertionFailedException();}else{throw new AssertionFailedException(message);}}};jsts.util.Assert.equals=function(expectedValue,actualValue,message){if(!actualValue.equals(expectedValue)){throw new AssertionFailedException('Expected '+expectedValue+' but encountered '+actualValue+
(message!=null?': '+message:''));}};jsts.util.Assert.shouldNeverReachHere=function(message){throw new AssertionFailedException('Should never reach here'+
(message!=null?': '+message:''));};})();(function(){var Location=jsts.geom.Location;var Assert=jsts.util.Assert;var ArrayList=javascript.util.ArrayList;jsts.operation.relate.RelateComputer=function(arg){this.li=new jsts.algorithm.RobustLineIntersector();this.ptLocator=new jsts.algorithm.PointLocator();this.nodes=new jsts.geomgraph.NodeMap(new jsts.operation.relate.RelateNodeFactory());this.isolatedEdges=new ArrayList();this.arg=arg;};jsts.operation.relate.RelateComputer.prototype.li=null;jsts.operation.relate.RelateComputer.prototype.ptLocator=null;jsts.operation.relate.RelateComputer.prototype.arg=null;jsts.operation.relate.RelateComputer.prototype.nodes=null;jsts.operation.relate.RelateComputer.prototype.im=null;jsts.operation.relate.RelateComputer.prototype.isolatedEdges=null;jsts.operation.relate.RelateComputer.prototype.invalidPoint=null;jsts.operation.relate.RelateComputer.prototype.computeIM=function(){var im=new jsts.geom.IntersectionMatrix();im.set(Location.EXTERIOR,Location.EXTERIOR,2);if(!this.arg[0].getGeometry().getEnvelopeInternal().intersects(this.arg[1].getGeometry().getEnvelopeInternal())){this.computeDisjointIM(im);return im;}
this.arg[0].computeSelfNodes(this.li,false);this.arg[1].computeSelfNodes(this.li,false);var intersector=this.arg[0].computeEdgeIntersections(this.arg[1],this.li,false);this.computeIntersectionNodes(0);this.computeIntersectionNodes(1);this.copyNodesAndLabels(0);this.copyNodesAndLabels(1);this.labelIsolatedNodes();this.computeProperIntersectionIM(intersector,im);var eeBuilder=new jsts.operation.relate.EdgeEndBuilder();var ee0=eeBuilder.computeEdgeEnds(this.arg[0].getEdgeIterator());this.insertEdgeEnds(ee0);var ee1=eeBuilder.computeEdgeEnds(this.arg[1].getEdgeIterator());this.insertEdgeEnds(ee1);this.labelNodeEdges();this.labelIsolatedEdges(0,1);this.labelIsolatedEdges(1,0);this.updateIM(im);return im;};jsts.operation.relate.RelateComputer.prototype.insertEdgeEnds=function(ee){for(var i=ee.iterator();i.hasNext();){var e=i.next();this.nodes.add(e);}};jsts.operation.relate.RelateComputer.prototype.computeProperIntersectionIM=function(intersector,im){var dimA=this.arg[0].getGeometry().getDimension();var dimB=this.arg[1].getGeometry().getDimension();var hasProper=intersector.hasProperIntersection();var hasProperInterior=intersector.hasProperInteriorIntersection();if(dimA===2&&dimB===2){if(hasProper)
im.setAtLeast('212101212');}
else if(dimA===2&&dimB===1){if(hasProper)
im.setAtLeast('FFF0FFFF2');if(hasProperInterior)
im.setAtLeast('1FFFFF1FF');}else if(dimA===1&&dimB===2){if(hasProper)
im.setAtLeast('F0FFFFFF2');if(hasProperInterior)
im.setAtLeast('1F1FFFFFF');}
else if(dimA===1&&dimB===1){if(hasProperInterior)
im.setAtLeast('0FFFFFFFF');}};jsts.operation.relate.RelateComputer.prototype.copyNodesAndLabels=function(argIndex){for(var i=this.arg[argIndex].getNodeIterator();i.hasNext();){var graphNode=i.next();var newNode=this.nodes.addNode(graphNode.getCoordinate());newNode.setLabel(argIndex,graphNode.getLabel().getLocation(argIndex));}};jsts.operation.relate.RelateComputer.prototype.computeIntersectionNodes=function(argIndex){for(var i=this.arg[argIndex].getEdgeIterator();i.hasNext();){var e=i.next();var eLoc=e.getLabel().getLocation(argIndex);for(var eiIt=e.getEdgeIntersectionList().iterator();eiIt.hasNext();){var ei=eiIt.next();var n=this.nodes.addNode(ei.coord);if(eLoc===Location.BOUNDARY)
n.setLabelBoundary(argIndex);else{if(n.getLabel().isNull(argIndex))
n.setLabel(argIndex,Location.INTERIOR);}}}};jsts.operation.relate.RelateComputer.prototype.labelIntersectionNodes=function(argIndex){for(var i=this.arg[argIndex].getEdgeIterator();i.hasNext();){var e=i.next();var eLoc=e.getLabel().getLocation(argIndex);for(var eiIt=e.getEdgeIntersectionList().iterator();eiIt.hasNext();){var ei=eiIt.next();var n=this.nodes.find(ei.coord);if(n.getLabel().isNull(argIndex)){if(eLoc===Location.BOUNDARY)
n.setLabelBoundary(argIndex);else
n.setLabel(argIndex,Location.INTERIOR);}}}};jsts.operation.relate.RelateComputer.prototype.computeDisjointIM=function(im){var ga=this.arg[0].getGeometry();if(!ga.isEmpty()){im.set(Location.INTERIOR,Location.EXTERIOR,ga.getDimension());im.set(Location.BOUNDARY,Location.EXTERIOR,ga.getBoundaryDimension());}
var gb=this.arg[1].getGeometry();if(!gb.isEmpty()){im.set(Location.EXTERIOR,Location.INTERIOR,gb.getDimension());im.set(Location.EXTERIOR,Location.BOUNDARY,gb.getBoundaryDimension());}};jsts.operation.relate.RelateComputer.prototype.labelNodeEdges=function(){for(var ni=this.nodes.iterator();ni.hasNext();){var node=ni.next();node.getEdges().computeLabelling(this.arg);}};jsts.operation.relate.RelateComputer.prototype.updateIM=function(im){for(var ei=this.isolatedEdges.iterator();ei.hasNext();){var e=ei.next();e.updateIM(im);}
for(var ni=this.nodes.iterator();ni.hasNext();){var node=ni.next();node.updateIM(im);node.updateIMFromEdges(im);}};jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdges=function(thisIndex,targetIndex){for(var ei=this.arg[thisIndex].getEdgeIterator();ei.hasNext();){var e=ei.next();if(e.isIsolated()){this.labelIsolatedEdge(e,targetIndex,this.arg[targetIndex].getGeometry());this.isolatedEdges.add(e);}}};jsts.operation.relate.RelateComputer.prototype.labelIsolatedEdge=function(e,targetIndex,target){if(target.getDimension()>0){var loc=this.ptLocator.locate(e.getCoordinate(),target);e.getLabel().setAllLocations(targetIndex,loc);}else{e.getLabel().setAllLocations(targetIndex,Location.EXTERIOR);}};jsts.operation.relate.RelateComputer.prototype.labelIsolatedNodes=function(){for(var ni=this.nodes.iterator();ni.hasNext();){var n=ni.next();var label=n.getLabel();Assert.isTrue(label.getGeometryCount()>0,'node with empty label found');if(n.isIsolated()){if(label.isNull(0))
this.labelIsolatedNode(n,0);else
this.labelIsolatedNode(n,1);}}};jsts.operation.relate.RelateComputer.prototype.labelIsolatedNode=function(n,targetIndex){var loc=this.ptLocator.locate(n.getCoordinate(),this.arg[targetIndex].getGeometry());n.getLabel().setAllLocations(targetIndex,loc);};})();(function(){var Assert=jsts.util.Assert;jsts.geomgraph.GraphComponent=function(label){this.label=label;};jsts.geomgraph.GraphComponent.prototype.label=null;jsts.geomgraph.GraphComponent.prototype._isInResult=false;jsts.geomgraph.GraphComponent.prototype._isCovered=false;jsts.geomgraph.GraphComponent.prototype._isCoveredSet=false;jsts.geomgraph.GraphComponent.prototype._isVisited=false;jsts.geomgraph.GraphComponent.prototype.getLabel=function(){return this.label;};jsts.geomgraph.GraphComponent.prototype.setLabel=function(label){if(arguments.length===2){this.setLabel2.apply(this,arguments);return;}
this.label=label;};jsts.geomgraph.GraphComponent.prototype.setInResult=function(isInResult){this._isInResult=isInResult;};jsts.geomgraph.GraphComponent.prototype.isInResult=function(){return this._isInResult;};jsts.geomgraph.GraphComponent.prototype.setCovered=function(isCovered){this._isCovered=isCovered;this._isCoveredSet=true;};jsts.geomgraph.GraphComponent.prototype.isCovered=function(){return this._isCovered;};jsts.geomgraph.GraphComponent.prototype.isCoveredSet=function(){return this._isCoveredSet;};jsts.geomgraph.GraphComponent.prototype.isVisited=function(){return this._isVisited;};jsts.geomgraph.GraphComponent.prototype.setVisited=function(isVisited){this._isVisited=isVisited;};jsts.geomgraph.GraphComponent.prototype.getCoordinate=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geomgraph.GraphComponent.prototype.computeIM=function(im){throw new jsts.error.AbstractMethodInvocationError();};jsts.geomgraph.GraphComponent.prototype.isIsolated=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geomgraph.GraphComponent.prototype.updateIM=function(im){Assert.isTrue(this.label.getGeometryCount()>=2,'found partial label');this.computeIM(im);};})();jsts.geomgraph.Node=function(coord,edges){this.coord=coord;this.edges=edges;this.label=new jsts.geomgraph.Label(0,jsts.geom.Location.NONE);};jsts.geomgraph.Node.prototype=new jsts.geomgraph.GraphComponent();jsts.geomgraph.Node.prototype.coord=null;jsts.geomgraph.Node.prototype.edges=null;jsts.geomgraph.Node.prototype.isIsolated=function(){return(this.label.getGeometryCount()==1);};jsts.geomgraph.Node.prototype.setLabel2=function(argIndex,onLocation){if(this.label===null){this.label=new jsts.geomgraph.Label(argIndex,onLocation);}else
this.label.setLocation(argIndex,onLocation);};jsts.geomgraph.Node.prototype.setLabelBoundary=function(argIndex){var loc=jsts.geom.Location.NONE;if(this.label!==null)
loc=this.label.getLocation(argIndex);var newLoc;switch(loc){case jsts.geom.Location.BOUNDARY:newLoc=jsts.geom.Location.INTERIOR;break;case jsts.geom.Location.INTERIOR:newLoc=jsts.geom.Location.BOUNDARY;break;default:newLoc=jsts.geom.Location.BOUNDARY;break;}
this.label.setLocation(argIndex,newLoc);};jsts.geomgraph.Node.prototype.add=function(e){this.edges.insert(e);e.setNode(this);};jsts.geomgraph.Node.prototype.getCoordinate=function(){return this.coord;};jsts.geomgraph.Node.prototype.getEdges=function(){return this.edges;};jsts.geomgraph.Node.prototype.isIncidentEdgeInResult=function(){for(var it=this.getEdges().getEdges().iterator();it.hasNext();){var de=it.next();if(de.getEdge().isInResult())
return true;}
return false;};jsts.geom.Point=function(coordinate,factory){this.factory=factory;if(coordinate===undefined)
return;this.coordinate=coordinate;};jsts.geom.Point.prototype=new jsts.geom.Geometry();jsts.geom.Point.constructor=jsts.geom.Point;jsts.geom.Point.CLASS_NAME='jsts.geom.Point';jsts.geom.Point.prototype.coordinate=null;jsts.geom.Point.prototype.getX=function(){return this.coordinate.x;};jsts.geom.Point.prototype.getY=function(){return this.coordinate.y;};jsts.geom.Point.prototype.getCoordinate=function(){return this.coordinate;};jsts.geom.Point.prototype.getCoordinates=function(){return this.isEmpty()?[]:[this.coordinate];};jsts.geom.Point.prototype.getCoordinateSequence=function(){return this.isEmpty()?[]:[this.coordinate];};jsts.geom.Point.prototype.isEmpty=function(){return this.coordinate===null;};jsts.geom.Point.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
if(this.isEmpty()&&other.isEmpty()){return true;}
return this.equal(other.getCoordinate(),this.getCoordinate(),tolerance);};jsts.geom.Point.prototype.getNumPoints=function(){return this.isEmpty()?0:1;};jsts.geom.Point.prototype.isSimple=function(){return true;};jsts.geom.Point.prototype.getBoundary=function(){return new jsts.geom.GeometryCollection(null);};jsts.geom.Point.prototype.computeEnvelopeInternal=function(){if(this.isEmpty()){return new jsts.geom.Envelope();}
return new jsts.geom.Envelope(this.coordinate);};jsts.geom.Point.prototype.apply=function(filter){if(filter instanceof jsts.geom.GeometryFilter||filter instanceof jsts.geom.GeometryComponentFilter){filter.filter(this);}else if(filter instanceof jsts.geom.CoordinateFilter){if(this.isEmpty()){return;}
filter.filter(this.getCoordinate());}};jsts.geom.Point.prototype.clone=function(){return new jsts.geom.Point(this.coordinate.clone(),this.factory);};jsts.geom.Point.prototype.getDimension=function(){return 0;};jsts.geom.Point.prototype.getBoundaryDimension=function(){return jsts.geom.Dimension.FALSE;};jsts.geom.Point.prototype.reverse=function(){return this.clone();};jsts.geom.Point.prototype.isValid=function(){if(!jsts.operation.valid.IsValidOp.isValid(this.getCoordinate())){return false;}
return true;};jsts.geom.Point.prototype.normalize=function(){};jsts.geom.Point.prototype.compareToSameClass=function(other){var point=other;return this.getCoordinate().compareTo(point.getCoordinate());};jsts.geom.Point.prototype.getGeometryType=function(){return'Point';};jsts.geom.Point.prototype.hashCode=function(){return'Point_'+this.coordinate.hashCode();};jsts.geom.Point.prototype.CLASS_NAME='jsts.geom.Point';jsts.geom.Dimension=function(){};jsts.geom.Dimension.P=0;jsts.geom.Dimension.L=1;jsts.geom.Dimension.A=2;jsts.geom.Dimension.FALSE=-1;jsts.geom.Dimension.TRUE=-2;jsts.geom.Dimension.DONTCARE=-3;jsts.geom.Dimension.toDimensionSymbol=function(dimensionValue){switch(dimensionValue){case jsts.geom.Dimension.FALSE:return'F';case jsts.geom.Dimension.TRUE:return'T';case jsts.geom.Dimension.DONTCARE:return'*';case jsts.geom.Dimension.P:return'0';case jsts.geom.Dimension.L:return'1';case jsts.geom.Dimension.A:return'2';}
throw new jsts.IllegalArgumentError('Unknown dimension value: '+
dimensionValue);};jsts.geom.Dimension.toDimensionValue=function(dimensionSymbol){switch(dimensionSymbol.toUpperCase()){case'F':return jsts.geom.Dimension.FALSE;case'T':return jsts.geom.Dimension.TRUE;case'*':return jsts.geom.Dimension.DONTCARE;case'0':return jsts.geom.Dimension.P;case'1':return jsts.geom.Dimension.L;case'2':return jsts.geom.Dimension.A;}
throw new jsts.error.IllegalArgumentError('Unknown dimension symbol: '+
dimensionSymbol);};(function(){var Dimension=jsts.geom.Dimension;jsts.geom.LineString=function(points,factory){this.factory=factory;this.points=points||[];};jsts.geom.LineString.prototype=new jsts.geom.Geometry();jsts.geom.LineString.constructor=jsts.geom.LineString;jsts.geom.LineString.prototype.points=null;jsts.geom.LineString.prototype.getCoordinates=function(){return this.points;};jsts.geom.LineString.prototype.getCoordinateSequence=function(){return this.points;};jsts.geom.LineString.prototype.getCoordinateN=function(n){return this.points[n];};jsts.geom.LineString.prototype.getCoordinate=function(){if(this.isEmpty()){return null;}
return this.getCoordinateN(0);};jsts.geom.LineString.prototype.getDimension=function(){return 1;};jsts.geom.LineString.prototype.getBoundaryDimension=function(){if(this.isClosed()){return Dimension.FALSE;}
return 0;};jsts.geom.LineString.prototype.isEmpty=function(){return this.points.length===0;};jsts.geom.LineString.prototype.getNumPoints=function(){return this.points.length;};jsts.geom.LineString.prototype.getPointN=function(n){return this.getFactory().createPoint(this.points[n]);};jsts.geom.LineString.prototype.getStartPoint=function(){if(this.isEmpty()){return null;}
return this.getPointN(0);};jsts.geom.LineString.prototype.getEndPoint=function(){if(this.isEmpty()){return null;}
return this.getPointN(this.getNumPoints()-1);};jsts.geom.LineString.prototype.isClosed=function(){if(this.isEmpty()){return false;}
return this.getCoordinateN(0).equals2D(this.getCoordinateN(this.points.length-1));};jsts.geom.LineString.prototype.isRing=function(){return this.isClosed()&&this.isSimple();};jsts.geom.LineString.prototype.getGeometryType=function(){return'LineString';};jsts.geom.LineString.prototype.getLength=function(){return jsts.algorithm.CGAlgorithms.computeLength(this.points);};jsts.geom.LineString.prototype.getBoundary=function(){return(new jsts.operation.BoundaryOp(this)).getBoundary();};jsts.geom.LineString.prototype.computeEnvelopeInternal=function(){if(this.isEmpty()){return new jsts.geom.Envelope();}
var env=new jsts.geom.Envelope();this.points.forEach(function(component){env.expandToInclude(component);});return env;};jsts.geom.LineString.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
if(this.points.length!==other.points.length){return false;}
if(this.isEmpty()&&other.isEmpty()){return true;}
return this.points.reduce(function(equal,point,i){return equal&&jsts.geom.Geometry.prototype.equal(point,other.points[i],tolerance);});};jsts.geom.LineString.prototype.isEquivalentClass=function(other){return other instanceof jsts.geom.LineString;};jsts.geom.LineString.prototype.compareToSameClass=function(o){var line=o;var i=0,il=this.points.length;var j=0,jl=line.points.length;while(i<il&&j<jl){var comparison=this.points[i].compareTo(line.points[j]);if(comparison!==0){return comparison;}
i++;j++;}
if(i<il){return 1;}
if(j<jl){return-1;}
return 0;};jsts.geom.LineString.prototype.apply=function(filter){if(filter instanceof jsts.geom.GeometryFilter||filter instanceof jsts.geom.GeometryComponentFilter){filter.filter(this);}else if(filter instanceof jsts.geom.CoordinateFilter){for(var i=0,len=this.points.length;i<len;i++){filter.filter(this.points[i]);}}else if(filter instanceof jsts.geom.CoordinateSequenceFilter){this.apply2.apply(this,arguments);}};jsts.geom.LineString.prototype.apply2=function(filter){if(this.points.length===0)
return;for(var i=0;i<this.points.length;i++){filter.filter(this.points,i);if(filter.isDone())
break;}
if(filter.isGeometryChanged()){}};jsts.geom.LineString.prototype.clone=function(){var points=[];for(var i=0,len=this.points.length;i<len;i++){points.push(this.points[i].clone());}
return this.factory.createLineString(points);};jsts.geom.LineString.prototype.normalize=function(){var i,il,j,ci,cj,len;len=this.points.length;il=parseInt(len/2);for(i=0;i<il;i++){j=len-1-i;ci=this.points[i];cj=this.points[j];if(!ci.equals(cj)){if(ci.compareTo(cj)>0){this.points.reverse();}
return;}}};jsts.geom.LineString.prototype.CLASS_NAME='jsts.geom.LineString';})();(function(){jsts.geom.Polygon=function(shell,holes,factory){this.shell=shell||factory.createLinearRing(null);this.holes=holes||[];this.factory=factory;};jsts.geom.Polygon.prototype=new jsts.geom.Geometry();jsts.geom.Polygon.constructor=jsts.geom.Polygon;jsts.geom.Polygon.prototype.getCoordinate=function(){return this.shell.getCoordinate();};jsts.geom.Polygon.prototype.getCoordinates=function(){if(this.isEmpty()){return[];}
var coordinates=[];var k=-1;var shellCoordinates=this.shell.getCoordinates();for(var x=0;x<shellCoordinates.length;x++){k++;coordinates[k]=shellCoordinates[x];}
for(var i=0;i<this.holes.length;i++){var childCoordinates=this.holes[i].getCoordinates();for(var j=0;j<childCoordinates.length;j++){k++;coordinates[k]=childCoordinates[j];}}
return coordinates;};jsts.geom.Polygon.prototype.getNumPoints=function(){var numPoints=this.shell.getNumPoints();for(var i=0;i<this.holes.length;i++){numPoints+=this.holes[i].getNumPoints();}
return numPoints;};jsts.geom.Polygon.prototype.isEmpty=function(){return this.shell.isEmpty();};jsts.geom.Polygon.prototype.isRectangle=function(){if(this.getNumInteriorRing()!=0)return false;if(this.shell==null)return false;if(this.shell.getNumPoints()!=5)return false;var seq=this.shell.getCoordinateSequence();var env=this.getEnvelopeInternal();for(var i=0;i<5;i++){var x=seq[i].x;if(!(x==env.getMinX()||x==env.getMaxX()))return false;var y=seq[i].y;if(!(y==env.getMinY()||y==env.getMaxY()))return false;}
var prevX=seq[0].x;var prevY=seq[0].y;for(var i=1;i<=4;i++){var x=seq[i].x;var y=seq[i].y;var xChanged=x!=prevX;var yChanged=y!=prevY;if(xChanged==yChanged)
return false;prevX=x;prevY=y;}
return true;};jsts.geom.Polygon.prototype.getExteriorRing=function(){return this.shell;};jsts.geom.Polygon.prototype.getInteriorRingN=function(n){return this.holes[n];};jsts.geom.Polygon.prototype.getNumInteriorRing=function(){return this.holes.length;};jsts.geom.Polygon.prototype.getArea=function(){var area=0.0;area+=Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.shell.getCoordinateSequence()));for(var i=0;i<this.holes.length;i++){area-=Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.holes[i].getCoordinateSequence()));}
return area;};jsts.geom.Polygon.prototype.getLength=function(){var len=0.0;len+=this.shell.getLength();for(var i=0;i<this.holes.length;i++){len+=this.holes[i].getLength();}
return len;};jsts.geom.Polygon.prototype.getBoundary=function(){if(this.isEmpty()){return this.getFactory().createMultiLineString(null);}
var rings=[];rings[0]=this.shell.clone();for(var i=0,len=this.holes.length;i<len;i++){rings[i+1]=this.holes[i].clone();}
if(rings.length<=1)
return rings[0];return this.getFactory().createMultiLineString(rings);};jsts.geom.Polygon.prototype.computeEnvelopeInternal=function(){return this.shell.getEnvelopeInternal();};jsts.geom.Polygon.prototype.getDimension=function(){return 2;};jsts.geom.Polygon.prototype.getBoundaryDimension=function(){return 1;};jsts.geom.Polygon.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
if(this.isEmpty()&&other.isEmpty()){return true;}
if(this.isEmpty()!==other.isEmpty()){return false;}
if(!this.shell.equalsExact(other.shell,tolerance)){return false;}
if(this.holes.length!==other.holes.length){return false;}
if(this.holes.length!==other.holes.length){return false;}
for(var i=0;i<this.holes.length;i++){if(!(this.holes[i]).equalsExact(other.holes[i],tolerance)){return false;}}
return true;};jsts.geom.Polygon.prototype.compareToSameClass=function(o){return this.shell.compareToSameClass(o.shell);};jsts.geom.Polygon.prototype.apply=function(filter){if(filter instanceof jsts.geom.GeometryComponentFilter){filter.filter(this);this.shell.apply(filter);for(var i=0,len=this.holes.length;i<len;i++){this.holes[i].apply(filter);}}else if(filter instanceof jsts.geom.GeometryFilter){filter.filter(this);}else if(filter instanceof jsts.geom.CoordinateFilter){this.shell.apply(filter);for(var i=0,len=this.holes.length;i<len;i++){this.holes[i].apply(filter);}}else if(filter instanceof jsts.geom.CoordinateSequenceFilter){this.apply2.apply(this,arguments);}};jsts.geom.Polygon.prototype.apply2=function(filter){this.shell.apply(filter);if(!filter.isDone()){for(var i=0;i<this.holes.length;i++){this.holes[i].apply(filter);if(filter.isDone())
break;}}
if(filter.isGeometryChanged()){}};jsts.geom.Polygon.prototype.clone=function(){var holes=[];for(var i=0,len=this.holes.length;i<len;i++){holes.push(this.holes[i].clone());}
return this.factory.createPolygon(this.shell.clone(),holes);};jsts.geom.Polygon.prototype.normalize=function(){this.normalize2(this.shell,true);for(var i=0,len=this.holes.length;i<len;i++){this.normalize2(this.holes[i],false);}
this.holes.sort();};jsts.geom.Polygon.prototype.normalize2=function(ring,clockwise){if(ring.isEmpty()){return;}
var uniqueCoordinates=ring.points.slice(0,ring.points.length-1);var minCoordinate=jsts.geom.CoordinateArrays.minCoordinate(ring.points);jsts.geom.CoordinateArrays.scroll(uniqueCoordinates,minCoordinate);ring.points=uniqueCoordinates.concat();ring.points[uniqueCoordinates.length]=uniqueCoordinates[0];if(jsts.algorithm.CGAlgorithms.isCCW(ring.points)===clockwise){ring.points.reverse();}};jsts.geom.Polygon.prototype.getGeometryType=function(){return'Polygon';};jsts.geom.Polygon.prototype.CLASS_NAME='jsts.geom.Polygon';})();(function(){var Geometry=jsts.geom.Geometry;var TreeSet=javascript.util.TreeSet;var Arrays=javascript.util.Arrays;jsts.geom.GeometryCollection=function(geometries,factory){this.geometries=geometries||[];this.factory=factory;};jsts.geom.GeometryCollection.prototype=new Geometry();jsts.geom.GeometryCollection.constructor=jsts.geom.GeometryCollection;jsts.geom.GeometryCollection.prototype.isEmpty=function(){for(var i=0,len=this.geometries.length;i<len;i++){var geometry=this.getGeometryN(i);if(!geometry.isEmpty()){return false;}}
return true;};jsts.geom.GeometryCollection.prototype.getArea=function(){var area=0.0;for(var i=0,len=this.geometries.length;i<len;i++){area+=this.getGeometryN(i).getArea();}
return area;};jsts.geom.GeometryCollection.prototype.getLength=function(){var length=0.0;for(var i=0,len=this.geometries.length;i<len;i++){length+=this.getGeometryN(i).getLength();}
return length;};jsts.geom.GeometryCollection.prototype.getCoordinate=function(){if(this.isEmpty())
return null;return this.getGeometryN(0).getCoordinate();};jsts.geom.GeometryCollection.prototype.getCoordinates=function(){var coordinates=[];var k=-1;for(var i=0,len=this.geometries.length;i<len;i++){var geometry=this.getGeometryN(i);var childCoordinates=geometry.getCoordinates();for(var j=0;j<childCoordinates.length;j++){k++;coordinates[k]=childCoordinates[j];}}
return coordinates;};jsts.geom.GeometryCollection.prototype.getNumGeometries=function(){return this.geometries.length;};jsts.geom.GeometryCollection.prototype.getGeometryN=function(n){var geometry=this.geometries[n];if(geometry instanceof jsts.geom.Coordinate){geometry=new jsts.geom.Point(geometry);}
return geometry;};jsts.geom.GeometryCollection.prototype.getNumPoints=function(n){var numPoints=0;for(var i=0;i<this.geometries.length;i++){numPoints+=this.geometries[i].getNumPoints();}
return numPoints;}
jsts.geom.GeometryCollection.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
if(this.geometries.length!==other.geometries.length){return false;}
for(var i=0,len=this.geometries.length;i<len;i++){var geometry=this.getGeometryN(i);if(!geometry.equalsExact(other.getGeometryN(i),tolerance)){return false;}}
return true;};jsts.geom.GeometryCollection.prototype.clone=function(){var geometries=[];for(var i=0,len=this.geometries.length;i<len;i++){geometries.push(this.geometries[i].clone());}
return this.factory.createGeometryCollection(geometries);};jsts.geom.GeometryCollection.prototype.normalize=function(){for(var i=0,len=this.geometries.length;i<len;i++){this.getGeometryN(i).normalize();}
this.geometries.sort();};jsts.geom.GeometryCollection.prototype.compareToSameClass=function(o){var theseElements=new TreeSet(Arrays.asList(this.geometries));var otherElements=new TreeSet(Arrays.asList(o.geometries));return this.compare(theseElements,otherElements);};jsts.geom.GeometryCollection.prototype.apply=function(filter){if(filter instanceof jsts.geom.GeometryFilter||filter instanceof jsts.geom.GeometryComponentFilter){filter.filter(this);for(var i=0,len=this.geometries.length;i<len;i++){this.getGeometryN(i).apply(filter);}}else if(filter instanceof jsts.geom.CoordinateFilter){for(var i=0,len=this.geometries.length;i<len;i++){this.getGeometryN(i).apply(filter);}}else if(filter instanceof jsts.geom.CoordinateSequenceFilter){this.apply2.apply(this,arguments);}};jsts.geom.GeometryCollection.prototype.apply2=function(filter){if(this.geometries.length==0)
return;for(var i=0;i<this.geometries.length;i++){this.geometries[i].apply(filter);if(filter.isDone()){break;}}
if(filter.isGeometryChanged()){}};jsts.geom.GeometryCollection.prototype.getDimension=function(){var dimension=jsts.geom.Dimension.FALSE;for(var i=0,len=this.geometries.length;i<len;i++){var geometry=this.getGeometryN(i);dimension=Math.max(dimension,geometry.getDimension());}
return dimension;};jsts.geom.GeometryCollection.prototype.computeEnvelopeInternal=function(){var envelope=new jsts.geom.Envelope();for(var i=0,len=this.geometries.length;i<len;i++){var geometry=this.getGeometryN(i);envelope.expandToInclude(geometry.getEnvelopeInternal());}
return envelope;};jsts.geom.GeometryCollection.prototype.CLASS_NAME='jsts.geom.GeometryCollection';})();jsts.algorithm.Centroid=function(geometry){this.areaBasePt=null;this.triangleCent3=new jsts.geom.Coordinate();this.areasum2=0;this.cg3=new jsts.geom.Coordinate();this.lineCentSum=new jsts.geom.Coordinate();this.totalLength=0;this.ptCount=0;this.ptCentSum=new jsts.geom.Coordinate();this.add(geometry);};jsts.algorithm.Centroid.getCentroid=function(geometry){var cent=new jsts.algorithm.Centroid(geometry);return cent.getCentroid();};jsts.algorithm.Centroid.centroid3=function(p1,p2,p3,c){c.x=p1.x+p2.x+p3.x;c.y=p1.y+p2.y+p3.y;};jsts.algorithm.Centroid.area2=function(p1,p2,p3){return(p2.x-p1.x)*(p3.y-p1.y)-(p3.x-p1.x)*(p2.y-p1.y);};jsts.algorithm.Centroid.prototype.add=function(geom){if(geom.isEmpty()){return;}
if(geom instanceof jsts.geom.Point){this.addPoint(geom.getCoordinate());}else if(geom instanceof jsts.geom.LineString){this.addLineSegments(geom.getCoordinates());}else if(geom instanceof jsts.geom.Polygon){this.addPolygon(geom);}else if(geom instanceof jsts.geom.GeometryCollection){for(var i=0;i<geom.getNumGeometries();i++){this.add(geom.getGeometryN(i));}}};jsts.algorithm.Centroid.prototype.getCentroid=function(){var cent=new jsts.geom.Coordinate();if(Math.abs(this.areasum2)>0){cent.x=this.cg3.x/3/this.areasum2;cent.y=this.cg3.y/3/this.areasum2;}else if(this.totalLength>0){cent.x=this.lineCentSum.x/this.totalLength;cent.y=this.lineCentSum.y/this.totalLength;}else if(this.ptCount>0){cent.x=this.ptCentSum.x/this.ptCount;cent.y=this.ptCentSum.y/this.ptCount;}else{return null;}
return cent;};jsts.algorithm.Centroid.prototype.setBasePoint=function(basePt){if(this.areaBasePt===null){this.areaBasePt=basePt;}};jsts.algorithm.Centroid.prototype.addPolygon=function(poly){this.addShell(poly.getExteriorRing().getCoordinates());for(var i=0;i<poly.getNumInteriorRing();i++){this.addHole(poly.getInteriorRingN(i).getCoordinates());}};jsts.algorithm.Centroid.prototype.addShell=function(pts){if(pts.length>0){this.setBasePoint(pts[0]);}
var isPositiveArea=!jsts.algorithm.CGAlgorithms.isCCW(pts);for(var i=0;i<pts.length-1;i++){this.addTriangle(this.areaBasePt,pts[i],pts[i+1],isPositiveArea);}
this.addLineSegments(pts);};jsts.algorithm.Centroid.prototype.addHole=function(pts){var isPositiveArea=jsts.algorithm.CGAlgorithms.isCCW(pts);for(var i=0;i<pts.length-1;i++){this.addTriangle(this.areaBasePt,pts[i],pts[i+1],isPositiveArea);}
this.addLineSegments(pts);};jsts.algorithm.Centroid.prototype.addTriangle=function(p0,p1,p2,isPositiveArea){var sign=(isPositiveArea)?1:-1;jsts.algorithm.Centroid.centroid3(p0,p1,p2,this.triangleCent3);var area2=jsts.algorithm.Centroid.area2(p0,p1,p2);this.cg3.x+=sign*area2*this.triangleCent3.x;this.cg3.y+=sign*area2*this.triangleCent3.y;this.areasum2+=sign*area2;};jsts.algorithm.Centroid.prototype.addLineSegments=function(pts){var lineLen=0;for(var i=0;i<pts.length-1;i++){var segmentLen=pts[i].distance(pts[i+1]);if(segmentLen===0){continue;}
lineLen+=segmentLen;var midx=(pts[i].x+pts[i+1].x)/2;this.lineCentSum.x+=segmentLen*midx;var midy=(pts[i].y+pts[i+1].y)/2;this.lineCentSum.y+=segmentLen*midy;}
this.totalLength+=lineLen;if(lineLen===0&&pts.length>0){this.addPoint(pts[0]);}};jsts.algorithm.Centroid.prototype.addPoint=function(pt){this.ptCount+=1;this.ptCentSum.x+=pt.x;this.ptCentSum.y+=pt.y;};(function(){var EdgeRing=function(factory){this.deList=new javascript.util.ArrayList();this.factory=factory;};EdgeRing.findEdgeRingContaining=function(testEr,shellList){var testRing=testEr.getRing();var testEnv=testRing.getEnvelopeInternal();var testPt=testRing.getCoordinateN(0);var minShell=null;var minEnv=null;for(var it=shellList.iterator();it.hasNext();){var tryShell=it.next();var tryRing=tryShell.getRing();var tryEnv=tryRing.getEnvelopeInternal();if(minShell!=null)
minEnv=minShell.getRing().getEnvelopeInternal();var isContained=false;if(tryEnv.equals(testEnv))
continue;testPt=jsts.geom.CoordinateArrays.ptNotInList(testRing.getCoordinates(),tryRing.getCoordinates());if(tryEnv.contains(testEnv)&&jsts.algorithm.CGAlgorithms.isPointInRing(testPt,tryRing.getCoordinates()))
isContained=true;if(isContained){if(minShell==null||minEnv.contains(tryEnv)){minShell=tryShell;}}}
return minShell;};EdgeRing.ptNotInList=function(testPts,pts){for(var i=0;i<testPts.length;i++){var testPt=testPts[i];if(!isInList(testPt,pts))
return testPt;}
return null;};EdgeRing.isInList=function(pt,pts){for(var i=0;i<pts.length;i++){if(pt.equals(pts[i]))
return true;}
return false;}
EdgeRing.prototype.factory=null;EdgeRing.prototype.deList=null;EdgeRing.prototype.ring=null;EdgeRing.prototype.ringPts=null;EdgeRing.prototype.holes=null;EdgeRing.prototype.add=function(de){this.deList.add(de);};EdgeRing.prototype.isHole=function(){var ring=this.getRing();return jsts.algorithm.CGAlgorithms.isCCW(ring.getCoordinates());};EdgeRing.prototype.addHole=function(hole){if(this.holes==null)
this.holes=new javascript.util.ArrayList();this.holes.add(hole);};EdgeRing.prototype.getPolygon=function(){var holeLR=null;if(this.holes!=null){holeLR=[];for(var i=0;i<this.holes.size();i++){holeLR[i]=this.holes.get(i);}}
var poly=this.factory.createPolygon(this.ring,holeLR);return poly;};EdgeRing.prototype.isValid=function(){this.getCoordinates();if(this.ringPts.length<=3)
return false;this.getRing();return this.ring.isValid();};EdgeRing.prototype.getCoordinates=function(){if(this.ringPts==null){var coordList=new jsts.geom.CoordinateList();for(var i=this.deList.iterator();i.hasNext();){var de=i.next();var edge=de.getEdge();EdgeRing.addEdge(edge.getLine().getCoordinates(),de.getEdgeDirection(),coordList);}
this.ringPts=coordList.toCoordinateArray();}
return this.ringPts;};EdgeRing.prototype.getLineString=function(){this.getCoordinates();return this.factory.createLineString(this.ringPts);};EdgeRing.prototype.getRing=function(){if(this.ring!=null)
return this.ring;this.getCoordinates();if(this.ringPts.length<3)
console.log(this.ringPts);try{this.ring=this.factory.createLinearRing(this.ringPts);}catch(ex){console.log(this.ringPts);}
return this.ring;};EdgeRing.addEdge=function(coords,isForward,coordList){if(isForward){for(var i=0;i<coords.length;i++){coordList.add(coords[i],false);}}else{for(var i=coords.length-1;i>=0;i--){coordList.add(coords[i],false);}}};jsts.operation.polygonize.EdgeRing=EdgeRing;})();(function(){var GraphComponent=function(){};GraphComponent.setVisited=function(i,visited){while(i.hasNext()){var comp=i.next();comp.setVisited(visited);}};GraphComponent.setMarked=function(i,marked){while(i.hasNext()){var comp=i.next();comp.setMarked(marked);}};GraphComponent.getComponentWithVisitedState=function(i,visitedState){while(i.hasNext()){var comp=i.next();if(comp.isVisited()==visitedState)
return comp;}
return null;};GraphComponent.prototype._isMarked=false;GraphComponent.prototype._isVisited=false;GraphComponent.prototype.data;GraphComponent.prototype.isVisited=function(){return this._isVisited;};GraphComponent.prototype.setVisited=function(isVisited){this._isVisited=isVisited;};GraphComponent.prototype.isMarked=function(){return this._isMarked;};GraphComponent.prototype.setMarked=function(isMarked){this._isMarked=isMarked;};GraphComponent.prototype.setContext=function(data){this.data=data;};GraphComponent.prototype.getContext=function(){return data;};GraphComponent.prototype.setData=function(data){this.data=data;};GraphComponent.prototype.getData=function(){return data;};GraphComponent.prototype.isRemoved=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.planargraph.GraphComponent=GraphComponent;})();(function(){var GraphComponent=jsts.planargraph.GraphComponent;var Edge=function(de0,de1){if(de0===undefined){return;}
this.setDirectedEdges(de0,de1);};Edge.prototype=new GraphComponent();Edge.prototype.dirEdge=null;Edge.prototype.setDirectedEdges=function(de0,de1){this.dirEdge=[de0,de1];de0.setEdge(this);de1.setEdge(this);de0.setSym(de1);de1.setSym(de0);de0.getFromNode().addOutEdge(de0);de1.getFromNode().addOutEdge(de1);};Edge.prototype.getDirEdge=function(i){if(i instanceof jsts.planargraph.Node){this.getDirEdge2(i);}
return this.dirEdge[i];};Edge.prototype.getDirEdge2=function(fromNode){if(this.dirEdge[0].getFromNode()==fromNode)
return this.dirEdge[0];if(this.dirEdge[1].getFromNode()==fromNode)
return this.dirEdge[1];return null;};Edge.prototype.getOppositeNode=function(node){if(this.dirEdge[0].getFromNode()==node)
return this.dirEdge[0].getToNode();if(this.dirEdge[1].getFromNode()==node)
return this.dirEdge[1].getToNode();return null;};Edge.prototype.remove=function(){this.dirEdge=null;};Edge.prototype.isRemoved=function(){return dirEdge==null;};jsts.planargraph.Edge=Edge;})();jsts.operation.polygonize.PolygonizeEdge=function(line){this.line=line;};jsts.operation.polygonize.PolygonizeEdge.prototype=new jsts.planargraph.Edge();jsts.operation.polygonize.PolygonizeEdge.prototype.line=null;jsts.operation.polygonize.PolygonizeEdge.prototype.getLine=function(){return this.line;};(function(){var ArrayList=javascript.util.ArrayList;var GraphComponent=jsts.planargraph.GraphComponent;var DirectedEdge=function(from,to,directionPt,edgeDirection){if(from===undefined){return;}
this.from=from;this.to=to;this.edgeDirection=edgeDirection;this.p0=from.getCoordinate();this.p1=directionPt;var dx=this.p1.x-this.p0.x;var dy=this.p1.y-this.p0.y;this.quadrant=jsts.geomgraph.Quadrant.quadrant(dx,dy);this.angle=Math.atan2(dy,dx);};DirectedEdge.prototype=new GraphComponent();DirectedEdge.toEdges=function(dirEdges){var edges=new ArrayList();for(var i=dirEdges.iterator();i.hasNext();){edges.add((i.next()).parentEdge);}
return edges;};DirectedEdge.prototype.parentEdge=null;DirectedEdge.prototype.from=null;DirectedEdge.prototype.to=null;DirectedEdge.prototype.p0=null;DirectedEdge.prototype.p1=null;DirectedEdge.prototype.sym=null;DirectedEdge.prototype.edgeDirection=null;DirectedEdge.prototype.quadrant=null;DirectedEdge.prototype.angle=null;DirectedEdge.prototype.getEdge=function(){return this.parentEdge;};DirectedEdge.prototype.setEdge=function(parentEdge){this.parentEdge=parentEdge;};DirectedEdge.prototype.getQuadrant=function(){return this.quadrant;};DirectedEdge.prototype.getDirectionPt=function(){return this.p1;};DirectedEdge.prototype.getEdgeDirection=function(){return this.edgeDirection;};DirectedEdge.prototype.getFromNode=function(){return this.from;};DirectedEdge.prototype.getToNode=function(){return this.to;};DirectedEdge.prototype.getCoordinate=function(){return this.from.getCoordinate();};DirectedEdge.prototype.getAngle=function(){return this.angle;};DirectedEdge.prototype.getSym=function(){return this.sym;};DirectedEdge.prototype.setSym=function(sym){this.sym=sym;};DirectedEdge.prototype.remove=function(){this.sym=null;this.parentEdge=null;};DirectedEdge.prototype.isRemoved=function(){return this.parentEdge==null;};DirectedEdge.prototype.compareTo=function(obj){var de=obj;return this.compareDirection(de);};DirectedEdge.prototype.compareDirection=function(e){if(this.quadrant>e.quadrant)
return 1;if(this.quadrant<e.quadrant)
return-1;return jsts.algorithm.CGAlgorithms.computeOrientation(e.p0,e.p1,this.p1);};jsts.planargraph.DirectedEdge=DirectedEdge;})();(function(){var DirectedEdge=jsts.planargraph.DirectedEdge;var PolygonizeDirectedEdge=function(from,to,directionPt,edgeDirection){DirectedEdge.apply(this,arguments);};PolygonizeDirectedEdge.prototype=new DirectedEdge();PolygonizeDirectedEdge.prototype.edgeRing=null;PolygonizeDirectedEdge.prototype.next=null;PolygonizeDirectedEdge.prototype.label=-1;PolygonizeDirectedEdge.prototype.getLabel=function(){return this.label;};PolygonizeDirectedEdge.prototype.setLabel=function(label){this.label=label;};PolygonizeDirectedEdge.prototype.getNext=function(){return this.next;};PolygonizeDirectedEdge.prototype.setNext=function(next){this.next=next;};PolygonizeDirectedEdge.prototype.isInRing=function(){return this.edgeRing!=null;};PolygonizeDirectedEdge.prototype.setRing=function(edgeRing){this.edgeRing=edgeRing;};jsts.operation.polygonize.PolygonizeDirectedEdge=PolygonizeDirectedEdge;})();(function(){var ArrayList=javascript.util.ArrayList;var DirectedEdgeStar=function(){this.outEdges=new ArrayList();};DirectedEdgeStar.prototype.outEdges=null;DirectedEdgeStar.prototype.sorted=false;DirectedEdgeStar.prototype.add=function(de){this.outEdges.add(de);this.sorted=false;};DirectedEdgeStar.prototype.remove=function(de){this.outEdges.remove(de);};DirectedEdgeStar.prototype.iterator=function(){this.sortEdges();return this.outEdges.iterator();};DirectedEdgeStar.prototype.getDegree=function(){return this.outEdges.size();};DirectedEdgeStar.prototype.getCoordinate=function(){var it=iterator();if(!it.hasNext())
return null;var e=it.next();return e.getCoordinate();};DirectedEdgeStar.prototype.getEdges=function(){this.sortEdges();return this.outEdges;};DirectedEdgeStar.prototype.sortEdges=function(){if(!this.sorted){var array=this.outEdges.toArray();array.sort(function(a,b){return a.compareTo(b);});this.outEdges=javascript.util.Arrays.asList(array);this.sorted=true;}};DirectedEdgeStar.prototype.getIndex=function(edge){if(edge instanceof jsts.planargraph.DirectedEdge){return this.getIndex2(edge);}else if(typeof(edge)==='number'){return this.getIndex3(edge);}
this.sortEdges();for(var i=0;i<this.outEdges.size();i++){var de=this.outEdges.get(i);if(de.getEdge()==edge)
return i;}
return-1;};DirectedEdgeStar.prototype.getIndex2=function(dirEdge){this.sortEdges();for(var i=0;i<this.outEdges.size();i++){var de=this.outEdges.get(i);if(de==dirEdge)
return i;}
return-1;};DirectedEdgeStar.prototype.getIndex3=function(i){var modi=toInt(i%this.outEdges.size());if(modi<0)
modi+=this.outEdges.size();return modi;};DirectedEdgeStar.prototype.getNextEdge=function(dirEdge){var i=this.getIndex(dirEdge);return this.outEdges.get(getIndex(i+1));};DirectedEdgeStar.prototype.getNextCWEdge=function(dirEdge){var i=this.getIndex(dirEdge);return this.outEdges.get(getIndex(i-1));};jsts.planargraph.DirectedEdgeStar=DirectedEdgeStar;})();(function(){var GraphComponent=jsts.planargraph.GraphComponent;var DirectedEdgeStar=jsts.planargraph.DirectedEdgeStar;var Node=function(pt,deStar){this.pt=pt;this.deStar=deStar||new DirectedEdgeStar();};Node.prototype=new GraphComponent();Node.getEdgesBetween=function(node0,node1){var edges0=DirectedEdge.toEdges(node0.getOutEdges().getEdges());var commonEdges=new javascript.util.HashSet(edges0);var edges1=DirectedEdge.toEdges(node1.getOutEdges().getEdges());commonEdges.retainAll(edges1);return commonEdges;};Node.prototype.pt=null;Node.prototype.deStar=null;Node.prototype.getCoordinate=function(){return this.pt;};Node.prototype.addOutEdge=function(de){this.deStar.add(de);};Node.prototype.getOutEdges=function(){return this.deStar;};Node.prototype.getDegree=function(){return this.deStar.getDegree();};Node.prototype.getIndex=function(edge){return this.deStar.getIndex(edge);};Node.prototype.remove=function(de){if(de===undefined){return this.remove2();}
this.deStar.remove(de);};Node.prototype.remove2=function(){this.pt=null;};Node.prototype.isRemoved=function(){return this.pt==null;};jsts.planargraph.Node=Node;})();(function(){var NodeMap=function(){this.nodeMap=new javascript.util.TreeMap();};NodeMap.prototype.nodeMap=null;NodeMap.prototype.add=function(n){this.nodeMap.put(n.getCoordinate(),n);return n;};NodeMap.prototype.remove=function(pt){return this.nodeMap.remove(pt);};NodeMap.prototype.find=function(coord){return this.nodeMap.get(coord);};NodeMap.prototype.iterator=function(){return this.nodeMap.values().iterator();};NodeMap.prototype.values=function(){return this.nodeMap.values();};jsts.planargraph.NodeMap=NodeMap;})();(function(){var ArrayList=javascript.util.ArrayList;var PlanarGraph=function(){this.edges=new javascript.util.HashSet();this.dirEdges=new javascript.util.HashSet();this.nodeMap=new jsts.planargraph.NodeMap();};PlanarGraph.prototype.edges=null;PlanarGraph.prototype.dirEdges=null;PlanarGraph.prototype.nodeMap=null;PlanarGraph.prototype.findNode=function(pt){return this.nodeMap.find(pt);};PlanarGraph.prototype.add=function(node){if(node instanceof jsts.planargraph.Edge){return this.add2(node);}else if(node instanceof jsts.planargraph.DirectedEdge){return this.add3(node);}
this.nodeMap.add(node);};PlanarGraph.prototype.add2=function(edge){this.edges.add(edge);this.add(edge.getDirEdge(0));this.add(edge.getDirEdge(1));};PlanarGraph.prototype.add3=function(dirEdge){this.dirEdges.add(dirEdge);};PlanarGraph.prototype.nodeIterator=function(){return this.nodeMap.iterator();};PlanarGraph.prototype.contains=function(e){if(e instanceof jsts.planargraph.DirectedEdge){return this.contains2(e);}
return this.edges.contains(e);};PlanarGraph.prototype.contains2=function(de){return this.dirEdges.contains(de);};PlanarGraph.prototype.getNodes=function(){return this.nodeMap.values();};PlanarGraph.prototype.dirEdgeIterator=function(){return this.dirEdges.iterator();};PlanarGraph.prototype.edgeIterator=function(){return this.edges.iterator();};PlanarGraph.prototype.getEdges=function(){return this.edges;};PlanarGraph.prototype.remove=function(edge){if(edge instanceof jsts.planargraph.DirectedEdge){return this.remove2(edge);}
this.remove(edge.getDirEdge(0));this.remove(edge.getDirEdge(1));this.edges.remove(edge);this.edge.remove();};PlanarGraph.prototype.remove2=function(de){if(de instanceof jsts.planargraph.Node){return this.remove3(de);}
var sym=de.getSym();if(sym!=null)
sym.setSym(null);de.getFromNode().remove(de);de.remove();this.dirEdges.remove(de);};PlanarGraph.prototype.remove3=function(node){var outEdges=node.getOutEdges().getEdges();for(var i=outEdges.iterator();i.hasNext();){var de=i.next();var sym=de.getSym();if(sym!=null)
this.remove(sym);this.dirEdges.remove(de);var edge=de.getEdge();if(edge!=null){this.edges.remove(edge);}}
this.nodeMap.remove(node.getCoordinate());node.remove();};PlanarGraph.prototype.findNodesOfDegree=function(degree){var nodesFound=new ArrayList();for(var i=this.nodeIterator();i.hasNext();){var node=i.next();if(node.getDegree()==degree)
nodesFound.add(node);}
return nodesFound;};jsts.planargraph.PlanarGraph=PlanarGraph;})();(function(){var ArrayList=javascript.util.ArrayList;var Stack=javascript.util.Stack;var HashSet=javascript.util.HashSet;var Assert=jsts.util.Assert;var EdgeRing=jsts.operation.polygonize.EdgeRing;var PolygonizeEdge=jsts.operation.polygonize.PolygonizeEdge;var PolygonizeDirectedEdge=jsts.operation.polygonize.PolygonizeDirectedEdge;var PlanarGraph=jsts.planargraph.PlanarGraph;var Node=jsts.planargraph.Node;var PolygonizeGraph=function(factory){PlanarGraph.apply(this);this.factory=factory;};PolygonizeGraph.prototype=new PlanarGraph();PolygonizeGraph.getDegreeNonDeleted=function(node){var edges=node.getOutEdges().getEdges();var degree=0;for(var i=edges.iterator();i.hasNext();){var de=i.next();if(!de.isMarked())
degree++;}
return degree;};PolygonizeGraph.getDegree=function(node,label){var edges=node.getOutEdges().getEdges();var degree=0;for(var i=edges.iterator();i.hasNext();){var de=i.next();if(de.getLabel()==label)
degree++;}
return degree;};PolygonizeGraph.deleteAllEdges=function(node){var edges=node.getOutEdges().getEdges();for(var i=edges.iterator();i.hasNext();){var de=i.next();de.setMarked(true);var sym=de.getSym();if(sym!=null)
sym.setMarked(true);}};PolygonizeGraph.prototype.factory=null;PolygonizeGraph.prototype.addEdge=function(line){if(line.isEmpty()){return;}
var linePts=jsts.geom.CoordinateArrays.removeRepeatedPoints(line.getCoordinates());if(linePts.length<2){return;}
var startPt=linePts[0];var endPt=linePts[linePts.length-1];var nStart=this.getNode(startPt);var nEnd=this.getNode(endPt);var de0=new PolygonizeDirectedEdge(nStart,nEnd,linePts[1],true);var de1=new PolygonizeDirectedEdge(nEnd,nStart,linePts[linePts.length-2],false);var edge=new PolygonizeEdge(line);edge.setDirectedEdges(de0,de1);this.add(edge);};PolygonizeGraph.prototype.getNode=function(pt){var node=this.findNode(pt);if(node==null){node=new Node(pt);this.add(node);}
return node;};PolygonizeGraph.prototype.computeNextCWEdges=function(){for(var iNode=this.nodeIterator();iNode.hasNext();){var node=iNode.next();PolygonizeGraph.computeNextCWEdges(node);}};PolygonizeGraph.prototype.convertMaximalToMinimalEdgeRings=function(ringEdges){for(var i=ringEdges.iterator();i.hasNext();){var de=i.next();var label=de.getLabel();var intNodes=PolygonizeGraph.findIntersectionNodes(de,label);if(intNodes==null)
continue;for(var iNode=intNodes.iterator();iNode.hasNext();){var node=iNode.next();PolygonizeGraph.computeNextCCWEdges(node,label);}}};PolygonizeGraph.findIntersectionNodes=function(startDE,label){var de=startDE;var intNodes=null;do{var node=de.getFromNode();if(PolygonizeGraph.getDegree(node,label)>1){if(intNodes==null)
intNodes=new ArrayList();intNodes.add(node);}
de=de.getNext();Assert.isTrue(de!=null,'found null DE in ring');Assert.isTrue(de==startDE||!de.isInRing(),'found DE already in ring');}while(de!=startDE);return intNodes;};PolygonizeGraph.prototype.getEdgeRings=function(){this.computeNextCWEdges();PolygonizeGraph.label(this.dirEdges,-1);var maximalRings=PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);this.convertMaximalToMinimalEdgeRings(maximalRings);var edgeRingList=new ArrayList();for(var i=this.dirEdges.iterator();i.hasNext();){var de=i.next();if(de.isMarked())
continue;if(de.isInRing())
continue;var er=this.findEdgeRing(de);edgeRingList.add(er);}
return edgeRingList;};PolygonizeGraph.findLabeledEdgeRings=function(dirEdges){var edgeRingStarts=new ArrayList();var currLabel=1;for(var i=dirEdges.iterator();i.hasNext();){var de=i.next();if(de.isMarked())
continue;if(de.getLabel()>=0)
continue;edgeRingStarts.add(de);var edges=PolygonizeGraph.findDirEdgesInRing(de);PolygonizeGraph.label(edges,currLabel);currLabel++;}
return edgeRingStarts;};PolygonizeGraph.prototype.deleteCutEdges=function(){this.computeNextCWEdges();PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);var cutLines=new ArrayList();for(var i=this.dirEdges.iterator();i.hasNext();){var de=i.next();if(de.isMarked())
continue;var sym=de.getSym();if(de.getLabel()==sym.getLabel()){de.setMarked(true);sym.setMarked(true);var e=de.getEdge();cutLines.add(e.getLine());}}
return cutLines;};PolygonizeGraph.label=function(dirEdges,label){for(var i=dirEdges.iterator();i.hasNext();){var de=i.next();de.setLabel(label);}};PolygonizeGraph.computeNextCWEdges=function(node){var deStar=node.getOutEdges();var startDE=null;var prevDE=null;for(var i=deStar.getEdges().iterator();i.hasNext();){var outDE=i.next();if(outDE.isMarked())
continue;if(startDE==null)
startDE=outDE;if(prevDE!=null){var sym=prevDE.getSym();sym.setNext(outDE);}
prevDE=outDE;}
if(prevDE!=null){var sym=prevDE.getSym();sym.setNext(startDE);}};PolygonizeGraph.computeNextCCWEdges=function(node,label){var deStar=node.getOutEdges();var firstOutDE=null;var prevInDE=null;var edges=deStar.getEdges();for(var i=edges.size()-1;i>=0;i--){var de=edges.get(i);var sym=de.getSym();var outDE=null;if(de.getLabel()==label)
outDE=de;var inDE=null;if(sym.getLabel()==label)
inDE=sym;if(outDE==null&&inDE==null)
continue;if(inDE!=null){prevInDE=inDE;}
if(outDE!=null){if(prevInDE!=null){prevInDE.setNext(outDE);prevInDE=null;}
if(firstOutDE==null)
firstOutDE=outDE;}}
if(prevInDE!=null){Assert.isTrue(firstOutDE!=null);prevInDE.setNext(firstOutDE);}};PolygonizeGraph.findDirEdgesInRing=function(startDE){var de=startDE;var edges=new ArrayList();do{edges.add(de);de=de.getNext();Assert.isTrue(de!=null,'found null DE in ring');Assert.isTrue(de==startDE||!de.isInRing(),'found DE already in ring');}while(de!=startDE);return edges;};PolygonizeGraph.prototype.findEdgeRing=function(startDE){var de=startDE;var er=new EdgeRing(this.factory);do{er.add(de);de.setRing(er);de=de.getNext();Assert.isTrue(de!=null,'found null DE in ring');Assert.isTrue(de==startDE||!de.isInRing(),'found DE already in ring');}while(de!=startDE);return er;};PolygonizeGraph.prototype.deleteDangles=function(){var nodesToRemove=this.findNodesOfDegree(1);var dangleLines=new HashSet();var nodeStack=new Stack();for(var i=nodesToRemove.iterator();i.hasNext();){nodeStack.push(i.next());}
while(!nodeStack.isEmpty()){var node=nodeStack.pop();PolygonizeGraph.deleteAllEdges(node);var nodeOutEdges=node.getOutEdges().getEdges();for(var i=nodeOutEdges.iterator();i.hasNext();){var de=i.next();de.setMarked(true);var sym=de.getSym();if(sym!=null)
sym.setMarked(true);var e=de.getEdge();dangleLines.add(e.getLine());var toNode=de.getToNode();if(PolygonizeGraph.getDegreeNonDeleted(toNode)==1)
nodeStack.push(toNode);}}
return dangleLines;};PolygonizeGraph.prototype.computeDepthParity=function(){while(true){var de=null;if(de==null)
return;this.computeDepthParity(de);}};PolygonizeGraph.prototype.computeDepthParity=function(de){};jsts.operation.polygonize.PolygonizeGraph=PolygonizeGraph;})();jsts.index.strtree.Interval=function(){var other;if(arguments.length===1){other=arguments[0];return jsts.index.strtree.Interval(other.min,other.max);}else if(arguments.length===2){jsts.util.Assert.isTrue(this.min<=this.max);this.min=arguments[0];this.max=arguments[1];}};jsts.index.strtree.Interval.prototype.min=null;jsts.index.strtree.Interval.prototype.max=null;jsts.index.strtree.Interval.prototype.getCentre=function(){return(this.min+this.max)/2;};jsts.index.strtree.Interval.prototype.expandToInclude=function(other){this.max=Math.max(this.max,other.max);this.min=Math.min(this.min,other.min);return this;};jsts.index.strtree.Interval.prototype.intersects=function(other){return!(other.min>this.max||other.max<this.min);};jsts.index.strtree.Interval.prototype.equals=function(o){if(!(o instanceof jsts.index.strtree.Interval)){return false;}
other=o;return this.min===other.min&&this.max===other.max;};jsts.geom.GeometryFactory=function(precisionModel){this.precisionModel=precisionModel||new jsts.geom.PrecisionModel();};jsts.geom.GeometryFactory.prototype.precisionModel=null;jsts.geom.GeometryFactory.prototype.getPrecisionModel=function(){return this.precisionModel;};jsts.geom.GeometryFactory.prototype.createPoint=function(coordinate){var point=new jsts.geom.Point(coordinate,this);return point;};jsts.geom.GeometryFactory.prototype.createLineString=function(coordinates){var lineString=new jsts.geom.LineString(coordinates,this);return lineString;};jsts.geom.GeometryFactory.prototype.createLinearRing=function(coordinates){var linearRing=new jsts.geom.LinearRing(coordinates,this);return linearRing;};jsts.geom.GeometryFactory.prototype.createPolygon=function(shell,holes){var polygon=new jsts.geom.Polygon(shell,holes,this);return polygon;};jsts.geom.GeometryFactory.prototype.createMultiPoint=function(points){if(points&&points[0]instanceof jsts.geom.Coordinate){var converted=[];var i;for(i=0;i<points.length;i++){converted.push(this.createPoint(points[i]));}
points=converted;}
return new jsts.geom.MultiPoint(points,this);};jsts.geom.GeometryFactory.prototype.createMultiLineString=function(lineStrings){return new jsts.geom.MultiLineString(lineStrings,this);};jsts.geom.GeometryFactory.prototype.createMultiPolygon=function(polygons){return new jsts.geom.MultiPolygon(polygons,this);};jsts.geom.GeometryFactory.prototype.buildGeometry=function(geomList){var geomClass=null;var isHeterogeneous=false;var hasGeometryCollection=false;for(var i=geomList.iterator();i.hasNext();){var geom=i.next();var partClass=geom.CLASS_NAME;if(geomClass===null){geomClass=partClass;}
if(!(partClass===geomClass)){isHeterogeneous=true;}
if(geom.isGeometryCollectionBase())
hasGeometryCollection=true;}
if(geomClass===null){return this.createGeometryCollection(null);}
if(isHeterogeneous||hasGeometryCollection){return this.createGeometryCollection(geomList.toArray());}
var geom0=geomList.get(0);var isCollection=geomList.size()>1;if(isCollection){if(geom0 instanceof jsts.geom.Polygon){return this.createMultiPolygon(geomList.toArray());}else if(geom0 instanceof jsts.geom.LineString){return this.createMultiLineString(geomList.toArray());}else if(geom0 instanceof jsts.geom.Point){return this.createMultiPoint(geomList.toArray());}
jsts.util.Assert.shouldNeverReachHere('Unhandled class: '+geom0);}
return geom0;};jsts.geom.GeometryFactory.prototype.createGeometryCollection=function(geometries){return new jsts.geom.GeometryCollection(geometries,this);};jsts.geom.GeometryFactory.prototype.toGeometry=function(envelope){if(envelope.isNull()){return this.createPoint(null);}
if(envelope.getMinX()===envelope.getMaxX()&&envelope.getMinY()===envelope.getMaxY()){return this.createPoint(new jsts.geom.Coordinate(envelope.getMinX(),envelope.getMinY()));}
if(envelope.getMinX()===envelope.getMaxX()||envelope.getMinY()===envelope.getMaxY()){return this.createLineString([new jsts.geom.Coordinate(envelope.getMinX(),envelope.getMinY()),new jsts.geom.Coordinate(envelope.getMaxX(),envelope.getMaxY())]);}
return this.createPolygon(this.createLinearRing([new jsts.geom.Coordinate(envelope.getMinX(),envelope.getMinY()),new jsts.geom.Coordinate(envelope.getMinX(),envelope.getMaxY()),new jsts.geom.Coordinate(envelope.getMaxX(),envelope.getMaxY()),new jsts.geom.Coordinate(envelope.getMaxX(),envelope.getMinY()),new jsts.geom.Coordinate(envelope.getMinX(),envelope.getMinY())]),null);};jsts.geomgraph.NodeFactory=function(){};jsts.geomgraph.NodeFactory.prototype.createNode=function(coord){return new jsts.geomgraph.Node(coord,null);};(function(){jsts.geomgraph.Position=function(){};jsts.geomgraph.Position.ON=0;jsts.geomgraph.Position.LEFT=1;jsts.geomgraph.Position.RIGHT=2;jsts.geomgraph.Position.opposite=function(position){if(position===jsts.geomgraph.Position.LEFT){return jsts.geomgraph.Position.RIGHT;}
if(position===jsts.geomgraph.Position.RIGHT){return jsts.geomgraph.Position.LEFT;}
return position;};})();jsts.geomgraph.TopologyLocation=function(){this.location=[];if(arguments.length===3){var on=arguments[0];var left=arguments[1];var right=arguments[2];this.init(3);this.location[jsts.geomgraph.Position.ON]=on;this.location[jsts.geomgraph.Position.LEFT]=left;this.location[jsts.geomgraph.Position.RIGHT]=right;}else if(arguments[0]instanceof jsts.geomgraph.TopologyLocation){var gl=arguments[0];this.init(gl.location.length);if(gl!=null){for(var i=0;i<this.location.length;i++){this.location[i]=gl.location[i];}}}else if(typeof arguments[0]==='number'){var on=arguments[0];this.init(1);this.location[jsts.geomgraph.Position.ON]=on;}else if(arguments[0]instanceof Array){var location=arguments[0];this.init(location.length);}};jsts.geomgraph.TopologyLocation.prototype.location=null;jsts.geomgraph.TopologyLocation.prototype.init=function(size){this.location[size-1]=null;this.setAllLocations(jsts.geom.Location.NONE);};jsts.geomgraph.TopologyLocation.prototype.get=function(posIndex){if(posIndex<this.location.length)
return this.location[posIndex];return jsts.geom.Location.NONE;};jsts.geomgraph.TopologyLocation.prototype.isNull=function(){for(var i=0;i<this.location.length;i++){if(this.location[i]!==jsts.geom.Location.NONE)
return false;}
return true;};jsts.geomgraph.TopologyLocation.prototype.isAnyNull=function(){for(var i=0;i<this.location.length;i++){if(this.location[i]===jsts.geom.Location.NONE)
return true;}
return false;};jsts.geomgraph.TopologyLocation.prototype.isEqualOnSide=function(le,locIndex){return this.location[locIndex]==le.location[locIndex];};jsts.geomgraph.TopologyLocation.prototype.isArea=function(){return this.location.length>1;};jsts.geomgraph.TopologyLocation.prototype.isLine=function(){return this.location.length===1;};jsts.geomgraph.TopologyLocation.prototype.flip=function(){if(this.location.length<=1)
return;var temp=this.location[jsts.geomgraph.Position.LEFT];this.location[jsts.geomgraph.Position.LEFT]=this.location[jsts.geomgraph.Position.RIGHT];this.location[jsts.geomgraph.Position.RIGHT]=temp;};jsts.geomgraph.TopologyLocation.prototype.setAllLocations=function(locValue){for(var i=0;i<this.location.length;i++){this.location[i]=locValue;}};jsts.geomgraph.TopologyLocation.prototype.setAllLocationsIfNull=function(locValue){for(var i=0;i<this.location.length;i++){if(this.location[i]===jsts.geom.Location.NONE)
this.location[i]=locValue;}};jsts.geomgraph.TopologyLocation.prototype.setLocation=function(locIndex,locValue){if(locValue!==undefined){this.location[locIndex]=locValue;}else{this.setLocation(jsts.geomgraph.Position.ON,locIndex);}};jsts.geomgraph.TopologyLocation.prototype.getLocations=function(){return location;};jsts.geomgraph.TopologyLocation.prototype.setLocations=function(on,left,right){this.location[jsts.geomgraph.Position.ON]=on;this.location[jsts.geomgraph.Position.LEFT]=left;this.location[jsts.geomgraph.Position.RIGHT]=right;};jsts.geomgraph.TopologyLocation.prototype.allPositionsEqual=function(loc){for(var i=0;i<this.location.length;i++){if(this.location[i]!==loc)
return false;}
return true;};jsts.geomgraph.TopologyLocation.prototype.merge=function(gl){if(gl.location.length>this.location.length){var newLoc=[];newLoc[jsts.geomgraph.Position.ON]=this.location[jsts.geomgraph.Position.ON];newLoc[jsts.geomgraph.Position.LEFT]=jsts.geom.Location.NONE;newLoc[jsts.geomgraph.Position.RIGHT]=jsts.geom.Location.NONE;this.location=newLoc;}
for(var i=0;i<this.location.length;i++){if(this.location[i]===jsts.geom.Location.NONE&&i<gl.location.length)
this.location[i]=gl.location[i];}};jsts.geomgraph.Label=function(){this.elt=[];var geomIndex,onLoc,leftLoc,lbl,rightLoc;if(arguments.length===4){geomIndex=arguments[0];onLoc=arguments[1];leftLoc=arguments[2];rightLoc=arguments[3];this.elt[0]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,jsts.geom.Location.NONE,jsts.geom.Location.NONE);this.elt[1]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,jsts.geom.Location.NONE,jsts.geom.Location.NONE);this.elt[geomIndex].setLocations(onLoc,leftLoc,rightLoc);}else if(arguments.length===3){onLoc=arguments[0];leftLoc=arguments[1];rightLoc=arguments[2];this.elt[0]=new jsts.geomgraph.TopologyLocation(onLoc,leftLoc,rightLoc);this.elt[1]=new jsts.geomgraph.TopologyLocation(onLoc,leftLoc,rightLoc);}else if(arguments.length===2){geomIndex=arguments[0];onLoc=arguments[1];this.elt[0]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);this.elt[1]=new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);this.elt[geomIndex].setLocation(onLoc);}else if(arguments[0]instanceof jsts.geomgraph.Label){lbl=arguments[0];this.elt[0]=new jsts.geomgraph.TopologyLocation(lbl.elt[0]);this.elt[1]=new jsts.geomgraph.TopologyLocation(lbl.elt[1]);}else if(typeof arguments[0]==='number'){onLoc=arguments[0];this.elt[0]=new jsts.geomgraph.TopologyLocation(onLoc);this.elt[1]=new jsts.geomgraph.TopologyLocation(onLoc);}};jsts.geomgraph.Label.toLineLabel=function(label){var i,lineLabel=new jsts.geomgraph.Label(jsts.geom.Location.NONE);for(i=0;i<2;i++){lineLabel.setLocation(i,label.getLocation(i));}
return lineLabel;};jsts.geomgraph.Label.prototype.elt=null;jsts.geomgraph.Label.prototype.flip=function(){this.elt[0].flip();this.elt[1].flip();};jsts.geomgraph.Label.prototype.getLocation=function(geomIndex,posIndex){if(arguments.length==1){return this.getLocation2.apply(this,arguments);}
return this.elt[geomIndex].get(posIndex);};jsts.geomgraph.Label.prototype.getLocation2=function(geomIndex){return this.elt[geomIndex].get(jsts.geomgraph.Position.ON);};jsts.geomgraph.Label.prototype.setLocation=function(geomIndex,posIndex,location){if(arguments.length==2){this.setLocation2.apply(this,arguments);return;}
this.elt[geomIndex].setLocation(posIndex,location);};jsts.geomgraph.Label.prototype.setLocation2=function(geomIndex,location){this.elt[geomIndex].setLocation(jsts.geomgraph.Position.ON,location);};jsts.geomgraph.Label.prototype.setAllLocations=function(geomIndex,location){this.elt[geomIndex].setAllLocations(location);};jsts.geomgraph.Label.prototype.setAllLocationsIfNull=function(geomIndex,location){if(arguments.length==1){this.setAllLocationsIfNull2.apply(this,arguments);return;}
this.elt[geomIndex].setAllLocationsIfNull(location);};jsts.geomgraph.Label.prototype.setAllLocationsIfNull2=function(location){this.setAllLocationsIfNull(0,location);this.setAllLocationsIfNull(1,location);};jsts.geomgraph.Label.prototype.merge=function(lbl){var i;for(i=0;i<2;i++){if(this.elt[i]===null&&lbl.elt[i]!==null){this.elt[i]=new jsts.geomgraph.TopologyLocation(lbl.elt[i]);}else{this.elt[i].merge(lbl.elt[i]);}}};jsts.geomgraph.Label.prototype.getGeometryCount=function(){var count=0;if(!this.elt[0].isNull()){count++;}
if(!this.elt[1].isNull()){count++;}
return count;};jsts.geomgraph.Label.prototype.isNull=function(geomIndex){return this.elt[geomIndex].isNull();};jsts.geomgraph.Label.prototype.isAnyNull=function(geomIndex){return this.elt[geomIndex].isAnyNull();};jsts.geomgraph.Label.prototype.isArea=function(){if(arguments.length==1){return this.isArea2(arguments[0]);}
return this.elt[0].isArea()||this.elt[1].isArea();};jsts.geomgraph.Label.prototype.isArea2=function(geomIndex){return this.elt[geomIndex].isArea();};jsts.geomgraph.Label.prototype.isLine=function(geomIndex){return this.elt[geomIndex].isLine();};jsts.geomgraph.Label.prototype.isEqualOnSide=function(lbl,side){return this.elt[0].isEqualOnSide(lbl.elt[0],side)&&this.elt[1].isEqualOnSide(lbl.elt[1],side);};jsts.geomgraph.Label.prototype.allPositionsEqual=function(geomIndex,loc){return this.elt[geomIndex].allPositionsEqual(loc);};jsts.geomgraph.Label.prototype.toLine=function(geomIndex){if(this.elt[geomIndex].isArea()){this.elt[geomIndex]=new jsts.geomgraph.TopologyLocation(this.elt[geomIndex].location[0]);}};jsts.geomgraph.EdgeRing=function(start,geometryFactory){this.edges=[];this.pts=[];this.holes=[];this.label=new jsts.geomgraph.Label(jsts.geom.Location.NONE);this.geometryFactory=geometryFactory;if(start){this.computePoints(start);this.computeRing();}};jsts.geomgraph.EdgeRing.prototype.startDe=null;jsts.geomgraph.EdgeRing.prototype.maxNodeDegree=-1;jsts.geomgraph.EdgeRing.prototype.edges=null;jsts.geomgraph.EdgeRing.prototype.pts=null;jsts.geomgraph.EdgeRing.prototype.label=null;jsts.geomgraph.EdgeRing.prototype.ring=null;jsts.geomgraph.EdgeRing.prototype._isHole=null;jsts.geomgraph.EdgeRing.prototype.shell=null;jsts.geomgraph.EdgeRing.prototype.holes=null;jsts.geomgraph.EdgeRing.prototype.geometryFactory=null;jsts.geomgraph.EdgeRing.prototype.isIsolated=function(){return(this.label.getGeometryCount()==1);};jsts.geomgraph.EdgeRing.prototype.isHole=function(){return this._isHole;};jsts.geomgraph.EdgeRing.prototype.getCoordinate=function(i){return this.pts[i];};jsts.geomgraph.EdgeRing.prototype.getLinearRing=function(){return this.ring;};jsts.geomgraph.EdgeRing.prototype.getLabel=function(){return this.label;};jsts.geomgraph.EdgeRing.prototype.isShell=function(){return this.shell===null;};jsts.geomgraph.EdgeRing.prototype.getShell=function(){return this.shell;};jsts.geomgraph.EdgeRing.prototype.setShell=function(shell){this.shell=shell;if(shell!==null)
shell.addHole(this);};jsts.geomgraph.EdgeRing.prototype.addHole=function(ring){this.holes.push(ring);};jsts.geomgraph.EdgeRing.prototype.toPolygon=function(geometryFactory){var holeLR=[];for(var i=0;i<this.holes.length;i++){holeLR[i]=this.holes[i].getLinearRing();}
var poly=this.geometryFactory.createPolygon(this.getLinearRing(),holeLR);return poly;};jsts.geomgraph.EdgeRing.prototype.computeRing=function(){if(this.ring!==null)
return;var coord=[];for(var i=0;i<this.pts.length;i++){coord[i]=this.pts[i];}
this.ring=this.geometryFactory.createLinearRing(coord);this._isHole=jsts.algorithm.CGAlgorithms.isCCW(this.ring.getCoordinates());};jsts.geomgraph.EdgeRing.prototype.getNext=function(de){throw new jsts.error.AbstractInvocationError();};jsts.geomgraph.EdgeRing.prototype.setEdgeRing=function(de,er){throw new jsts.error.AbstractInvocationError();};jsts.geomgraph.EdgeRing.prototype.getEdges=function(){return this.edges;};jsts.geomgraph.EdgeRing.prototype.computePoints=function(start){this.startDe=start;var de=start;var isFirstEdge=true;do{if(de===null)
throw new jsts.error.TopologyError('Found null DirectedEdge');if(de.getEdgeRing()===this)
throw new jsts.error.TopologyError('Directed Edge visited twice during ring-building at '+
de.getCoordinate());this.edges.push(de);var label=de.getLabel();jsts.util.Assert.isTrue(label.isArea());this.mergeLabel(label);this.addPoints(de.getEdge(),de.isForward(),isFirstEdge);isFirstEdge=false;this.setEdgeRing(de,this);de=this.getNext(de);}while(de!==this.startDe);};jsts.geomgraph.EdgeRing.prototype.getMaxNodeDegree=function(){if(this.maxNodeDegree<0)
this.computeMaxNodeDegree();return this.maxNodeDegree;};jsts.geomgraph.EdgeRing.prototype.computeMaxNodeDegree=function(){this.maxNodeDegree=0;var de=this.startDe;do{var node=de.getNode();var degree=node.getEdges().getOutgoingDegree(this);if(degree>this.maxNodeDegree)
this.maxNodeDegree=degree;de=this.getNext(de);}while(de!==this.startDe);this.maxNodeDegree*=2;};jsts.geomgraph.EdgeRing.prototype.setInResult=function(){var de=this.startDe;do{de.getEdge().setInResult(true);de=de.getNext();}while(de!=this.startDe);};jsts.geomgraph.EdgeRing.prototype.mergeLabel=function(deLabel){this.mergeLabel2(deLabel,0);this.mergeLabel2(deLabel,1);};jsts.geomgraph.EdgeRing.prototype.mergeLabel2=function(deLabel,geomIndex){var loc=deLabel.getLocation(geomIndex,jsts.geomgraph.Position.RIGHT);if(loc==jsts.geom.Location.NONE)
return;if(this.label.getLocation(geomIndex)===jsts.geom.Location.NONE){this.label.setLocation(geomIndex,loc);return;}};jsts.geomgraph.EdgeRing.prototype.addPoints=function(edge,isForward,isFirstEdge){var edgePts=edge.getCoordinates();if(isForward){var startIndex=1;if(isFirstEdge)
startIndex=0;for(var i=startIndex;i<edgePts.length;i++){this.pts.push(edgePts[i]);}}else{var startIndex=edgePts.length-2;if(isFirstEdge)
startIndex=edgePts.length-1;for(var i=startIndex;i>=0;i--){this.pts.push(edgePts[i]);}}};jsts.geomgraph.EdgeRing.prototype.containsPoint=function(p){var shell=this.getLinearRing();var env=shell.getEnvelopeInternal();if(!env.contains(p))
return false;if(!jsts.algorithm.CGAlgorithms.isPointInRing(p,shell.getCoordinates()))
return false;for(var i=0;i<this.holes.length;i++){var hole=this.holes[i];if(hole.containsPoint(p))
return false;}
return true;};(function(){jsts.geom.LinearRing=function(points,factory){jsts.geom.LineString.apply(this,arguments);};jsts.geom.LinearRing.prototype=new jsts.geom.LineString();jsts.geom.LinearRing.constructor=jsts.geom.LinearRing;jsts.geom.LinearRing.prototype.getBoundaryDimension=function(){return jsts.geom.Dimension.FALSE;};jsts.geom.LinearRing.prototype.isSimple=function(){return true;};jsts.geom.LinearRing.prototype.getGeometryType=function(){return'LinearRing';};jsts.geom.LinearRing.MINIMUM_VALID_SIZE=4;jsts.geom.LinearRing.prototype.CLASS_NAME='jsts.geom.LinearRing';})();jsts.index.strtree.Boundable=function(){};jsts.index.strtree.Boundable.prototype.getBounds=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.AbstractNode=function(level){this.level=level;this.childBoundables=[];};jsts.index.strtree.AbstractNode.prototype=new jsts.index.strtree.Boundable();jsts.index.strtree.AbstractNode.constructor=jsts.index.strtree.AbstractNode;jsts.index.strtree.AbstractNode.prototype.childBoundables=null;jsts.index.strtree.AbstractNode.prototype.bounds=null;jsts.index.strtree.AbstractNode.prototype.level=null;jsts.index.strtree.AbstractNode.prototype.getChildBoundables=function(){return this.childBoundables;};jsts.index.strtree.AbstractNode.prototype.computeBounds=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.AbstractNode.prototype.getBounds=function(){if(this.bounds===null){this.bounds=this.computeBounds();}
return this.bounds;};jsts.index.strtree.AbstractNode.prototype.getLevel=function(){return this.level;};jsts.index.strtree.AbstractNode.prototype.addChildBoundable=function(childBoundable){this.childBoundables.push(childBoundable);};(function(){jsts.noding.Noder=function(){};jsts.noding.Noder.prototype.computeNodes=jsts.abstractFunc;jsts.noding.Noder.prototype.getNodedSubstrings=jsts.abstractFunc;})();(function(){var Noder=jsts.noding.Noder;jsts.noding.SinglePassNoder=function(){};jsts.noding.SinglePassNoder.prototype=new Noder();jsts.noding.SinglePassNoder.constructor=jsts.noding.SinglePassNoder;jsts.noding.SinglePassNoder.prototype.segInt=null;jsts.noding.SinglePassNoder.prototype.setSegmentIntersector=function(segInt){this.segInt=segInt;};})();jsts.index.SpatialIndex=function(){};jsts.index.SpatialIndex.prototype.insert=function(itemEnv,item){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.SpatialIndex.prototype.query=function(searchEnv,visitor){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.SpatialIndex.prototype.remove=function(itemEnv,item){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.AbstractSTRtree=function(nodeCapacity){if(nodeCapacity===undefined)
return;this.itemBoundables=[];jsts.util.Assert.isTrue(nodeCapacity>1,'Node capacity must be greater than 1');this.nodeCapacity=nodeCapacity;};jsts.index.strtree.AbstractSTRtree.IntersectsOp=function(){};jsts.index.strtree.AbstractSTRtree.IntersectsOp.prototype.intersects=function(aBounds,bBounds){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.AbstractSTRtree.prototype.root=null;jsts.index.strtree.AbstractSTRtree.prototype.built=false;jsts.index.strtree.AbstractSTRtree.prototype.itemBoundables=null;jsts.index.strtree.AbstractSTRtree.prototype.nodeCapacity=null;jsts.index.strtree.AbstractSTRtree.prototype.build=function(){jsts.util.Assert.isTrue(!this.built);this.root=this.itemBoundables.length===0?this.createNode(0):this.createHigherLevels(this.itemBoundables,-1);this.built=true;};jsts.index.strtree.AbstractSTRtree.prototype.createNode=function(level){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables=function(childBoundables,newLevel){jsts.util.Assert.isTrue(!(childBoundables.length===0));var parentBoundables=[];parentBoundables.push(this.createNode(newLevel));var sortedChildBoundables=[];for(var i=0;i<childBoundables.length;i++){sortedChildBoundables.push(childBoundables[i]);}
sortedChildBoundables.sort(this.getComparator());for(var i=0;i<sortedChildBoundables.length;i++){var childBoundable=sortedChildBoundables[i];if(this.lastNode(parentBoundables).getChildBoundables().length===this.getNodeCapacity()){parentBoundables.push(this.createNode(newLevel));}
this.lastNode(parentBoundables).addChildBoundable(childBoundable);}
return parentBoundables;};jsts.index.strtree.AbstractSTRtree.prototype.lastNode=function(nodes){return nodes[nodes.length-1];};jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles=function(a,b){return a>b?1:a<b?-1:0;};jsts.index.strtree.AbstractSTRtree.prototype.createHigherLevels=function(boundablesOfALevel,level){jsts.util.Assert.isTrue(!(boundablesOfALevel.length===0));var parentBoundables=this.createParentBoundables(boundablesOfALevel,level+1);if(parentBoundables.length===1){return parentBoundables[0];}
return this.createHigherLevels(parentBoundables,level+1);};jsts.index.strtree.AbstractSTRtree.prototype.getRoot=function(){if(!this.built)
this.build();return this.root;};jsts.index.strtree.AbstractSTRtree.prototype.getNodeCapacity=function(){return this.nodeCapacity;};jsts.index.strtree.AbstractSTRtree.prototype.size=function(){if(arguments.length===1){return this.size2(arguments[0]);}
if(!this.built){this.build();}
if(this.itemBoundables.length===0){return 0;}
return this.size2(root);};jsts.index.strtree.AbstractSTRtree.prototype.size2=function(node){var size=0;var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(childBoundable instanceof jsts.index.strtree.AbstractNode){size+=this.size(childBoundable);}else if(childBoundable instanceof jsts.index.strtree.ItemBoundable){size+=1;}}
return size;};jsts.index.strtree.AbstractSTRtree.prototype.depth=function(){if(arguments.length===1){return this.depth2(arguments[0]);}
if(!this.built){this.build();}
if(this.itemBoundables.length===0){return 0;}
return this.depth2(root);};jsts.index.strtree.AbstractSTRtree.prototype.depth2=function(){var maxChildDepth=0;var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(childBoundable instanceof jsts.index.strtree.AbstractNode){var childDepth=this.depth(childBoundable);if(childDepth>maxChildDepth)
maxChildDepth=childDepth;}}
return maxChildDepth+1;};jsts.index.strtree.AbstractSTRtree.prototype.insert=function(bounds,item){jsts.util.Assert.isTrue(!this.built,'Cannot insert items into an STR packed R-tree after it has been built.');this.itemBoundables.push(new jsts.index.strtree.ItemBoundable(bounds,item));};jsts.index.strtree.AbstractSTRtree.prototype.query=function(searchBounds){if(arguments.length>1){this.query2.apply(this,arguments);}
if(!this.built){this.build();}
var matches=[];if(this.itemBoundables.length===0){jsts.util.Assert.isTrue(this.root.getBounds()===null);return matches;}
if(this.getIntersectsOp().intersects(this.root.getBounds(),searchBounds)){this.query3(searchBounds,this.root,matches);}
return matches;};jsts.index.strtree.AbstractSTRtree.prototype.query2=function(searchBounds,visitor){if(arguments.length>2){this.query3.apply(this,arguments);}
if(!this.built){this.build();}
if(this.itemBoundables.length===0){jsts.util.Assert.isTrue(this.root.getBounds()===null);}
if(this.getIntersectsOp().intersects(this.root.getBounds(),searchBounds)){this.query4(searchBounds,this.root,visitor);}};jsts.index.strtree.AbstractSTRtree.prototype.query3=function(searchBounds,node,matches){if(!(arguments[2]instanceof Array)){this.query4.apply(this,arguments);}
var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(!this.getIntersectsOp().intersects(childBoundable.getBounds(),searchBounds)){continue;}
if(childBoundable instanceof jsts.index.strtree.AbstractNode){this.query3(searchBounds,childBoundable,matches);}else if(childBoundable instanceof jsts.index.strtree.ItemBoundable){matches.push(childBoundable.getItem());}else{jsts.util.Assert.shouldNeverReachHere();}}};jsts.index.strtree.AbstractSTRtree.prototype.query4=function(searchBounds,node,visitor){var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(!this.getIntersectsOp().intersects(childBoundable.getBounds(),searchBounds)){continue;}
if(childBoundable instanceof jsts.index.strtree.AbstractNode){this.query4(searchBounds,childBoundable,visitor);}else if(childBoundable instanceof jsts.index.strtree.ItemBoundable){visitor.visitItem(childBoundable.getItem());}else{jsts.util.Assert.shouldNeverReachHere();}}};jsts.index.strtree.AbstractSTRtree.prototype.getIntersectsOp=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.AbstractSTRtree.prototype.itemsTree=function(){if(arguments.length===1){return this.itemsTree2.apply(this,arguments);}
if(!this.built){this.build();}
var valuesTree=this.itemsTree2(this.root);if(valuesTree===null)
return[];return valuesTree;};jsts.index.strtree.AbstractSTRtree.prototype.itemsTree2=function(node){var valuesTreeForNode=[];var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(childBoundable instanceof jsts.index.strtree.AbstractNode){var valuesTreeForChild=this.itemsTree(childBoundable);if(valuesTreeForChild!=null)
valuesTreeForNode.push(valuesTreeForChild);}else if(childBoundable instanceof jsts.index.strtree.ItemBoundable){valuesTreeForNode.push(childBoundable.getItem());}else{jsts.util.Assert.shouldNeverReachHere();}}
if(valuesTreeForNode.length<=0)
return null;return valuesTreeForNode;};jsts.index.strtree.AbstractSTRtree.prototype.remove=function(searchBounds,item){if(!this.built){this.build();}
if(this.itemBoundables.length===0){jsts.util.Assert.isTrue(this.root.getBounds()==null);}
if(this.getIntersectsOp().intersects(this.root.getBounds(),searchBounds)){return this.remove2(searchBounds,this.root,item);}
return false;};jsts.index.strtree.AbstractSTRtree.prototype.remove2=function(searchBounds,node,item){var found=this.removeItem(node,item);if(found)
return true;var childToPrune=null;var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(!this.getIntersectsOp().intersects(childBoundable.getBounds(),searchBounds)){continue;}
if(childBoundable instanceof jsts.index.strtree.AbstractNode){found=this.remove(searchBounds,childBoundable,item);if(found){childToPrune=childBoundable;break;}}}
if(childToPrune!=null){if(childToPrune.getChildBoundables().length===0){childBoundables.splice(childBoundables.indexOf(childToPrune),1);}}
return found;};jsts.index.strtree.AbstractSTRtree.prototype.removeItem=function(node,item){var childToRemove=null;var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(childBoundable instanceof jsts.index.strtree.ItemBoundable){if(childBoundable.getItem()===item)
childToRemove=childBoundable;}}
if(childToRemove!==null){childBoundables.splice(childBoundables.indexOf(childToRemove),1);return true;}
return false;};jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel=function(level){if(arguments.length>1){this.boundablesAtLevel2.apply(this,arguments);return;}
var boundables=[];this.boundablesAtLevel2(level,this.root,boundables);return boundables;};jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel2=function(level,top,boundables){jsts.util.Assert.isTrue(level>-2);if(top.getLevel()===level){boundables.add(top);return;}
var childBoundables=node.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var boundable=childBoundables[i];if(boundable instanceof jsts.index.strtree.AbstractNode){this.boundablesAtLevel(level,boundable,boundables);}else{jsts.util.Assert.isTrue(boundable instanceof jsts.index.strtree.ItemBoundable);if(level===-1){boundables.add(boundable);}}}
return;};jsts.index.strtree.AbstractSTRtree.prototype.getComparator=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.index.strtree.STRtree=function(nodeCapacity){nodeCapacity=nodeCapacity||jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY;jsts.index.strtree.AbstractSTRtree.call(this,nodeCapacity);};jsts.index.strtree.STRtree.prototype=new jsts.index.strtree.AbstractSTRtree();jsts.index.strtree.STRtree.constructor=jsts.index.strtree.STRtree;jsts.index.strtree.STRtree.prototype.xComparator=function(o1,o2){return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(jsts.index.strtree.STRtree.prototype.centreX(o1.getBounds()),jsts.index.strtree.STRtree.prototype.centreX(o2.getBounds()));};jsts.index.strtree.STRtree.prototype.yComparator=function(o1,o2){return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(jsts.index.strtree.STRtree.prototype.centreY(o1.getBounds()),jsts.index.strtree.STRtree.prototype.centreY(o2.getBounds()));};jsts.index.strtree.STRtree.prototype.centreX=function(e){return jsts.index.strtree.STRtree.prototype.avg(e.getMinX(),e.getMaxX());};jsts.index.strtree.STRtree.prototype.centreY=function(e){return jsts.index.strtree.STRtree.prototype.avg(e.getMinY(),e.getMaxY());};jsts.index.strtree.STRtree.prototype.avg=function(a,b){return(a+b)/2.0;};jsts.index.strtree.STRtree.prototype.intersectsOp={intersects:function(aBounds,bBounds){return aBounds.intersects(bBounds);}};jsts.index.strtree.STRtree.prototype.createParentBoundables=function(childBoundables,newLevel){jsts.util.Assert.isTrue(!(childBoundables.length===0));var minLeafCount=Math.ceil(childBoundables.length/this.getNodeCapacity());var sortedChildBoundables=[];for(var i=0;i<childBoundables.length;i++){sortedChildBoundables.push(childBoundables[i]);}
sortedChildBoundables.sort(this.xComparator);var verticalSlices=this.verticalSlices(sortedChildBoundables,Math.ceil(Math.sqrt(minLeafCount)));return this.createParentBoundablesFromVerticalSlices(verticalSlices,newLevel);};jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlices=function(verticalSlices,newLevel){jsts.util.Assert.isTrue(verticalSlices.length>0);var parentBoundables=[];for(var i=0;i<verticalSlices.length;i++){parentBoundables=parentBoundables.concat(this.createParentBoundablesFromVerticalSlice(verticalSlices[i],newLevel));}
return parentBoundables;};jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlice=function(childBoundables,newLevel){return jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables.call(this,childBoundables,newLevel);};jsts.index.strtree.STRtree.prototype.verticalSlices=function(childBoundables,sliceCount){var sliceCapacity=Math.ceil(childBoundables.length/sliceCount);var slices=[];var i=0,boundablesAddedToSlice,childBoundable;for(var j=0;j<sliceCount;j++){slices[j]=[];boundablesAddedToSlice=0;while(i<childBoundables.length&&boundablesAddedToSlice<sliceCapacity){childBoundable=childBoundables[i++];slices[j].push(childBoundable);boundablesAddedToSlice++;}}
return slices;};jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY=10;jsts.index.strtree.STRtree.prototype.createNode=function(level){var abstractNode=new jsts.index.strtree.AbstractNode(level);abstractNode.computeBounds=function(){var bounds=null;var childBoundables=this.getChildBoundables();for(var i=0;i<childBoundables.length;i++){var childBoundable=childBoundables[i];if(bounds===null){bounds=new jsts.geom.Envelope(childBoundable.getBounds());}else{bounds.expandToInclude(childBoundable.getBounds());}}
return bounds;};return abstractNode;};jsts.index.strtree.STRtree.prototype.getIntersectsOp=function(){return this.intersectsOp;};jsts.index.strtree.STRtree.prototype.insert=function(itemEnv,item){if(itemEnv.isNull()){return;}
jsts.index.strtree.AbstractSTRtree.prototype.insert.call(this,itemEnv,item);};jsts.index.strtree.STRtree.prototype.query=function(searchEnv,visitor){return jsts.index.strtree.AbstractSTRtree.prototype.query.apply(this,arguments);};jsts.index.strtree.STRtree.prototype.remove=function(itemEnv,item){return jsts.index.strtree.AbstractSTRtree.prototype.remove.call(this,itemEnv,item);};jsts.index.strtree.STRtree.prototype.size=function(){return jsts.index.strtree.AbstractSTRtree.prototype.size.call(this);};jsts.index.strtree.STRtree.prototype.depth=function(){return jsts.index.strtree.AbstractSTRtree.prototype.depth.call(this);};jsts.index.strtree.STRtree.prototype.getComparator=function(){return this.yComparator;};jsts.index.strtree.STRtree.prototype.nearestNeighbour=function(itemDist){var bp=new jsts.index.strtree.BoundablePair(this.getRoot(),this.getRoot(),itemDist);return this.nearestNeighbour4(bp);};jsts.index.strtree.STRtree.prototype.nearestNeighbour2=function(env,item,itemDist){var bnd=new jsts.index.strtree.ItemBoundable(env,item);var bp=new jsts.index.strtree.BoundablePair(this.getRoot(),bnd,itemDist);return this.nearestNeighbour4(bp)[0];};jsts.index.strtree.STRtree.prototype.nearestNeighbour3=function(tree,itemDist){var bp=new jsts.index.strtree.BoundablePair(this.getRoot(),tree.getRoot(),itemDist);return this.nearestNeighbour4(bp);};jsts.index.strtree.STRtree.prototype.nearestNeighbour4=function(initBndPair){return this.nearestNeighbour5(initBndPair,Double.POSITIVE_INFINITY);};jsts.index.strtree.STRtree.prototype.nearestNeighbour5=function(initBndPair,maxDistance){var distanceLowerBound=maxDistance;var minPair=null;var priQ=[];priQ.push(initBndPair);while(!priQ.isEmpty()&&distanceLowerBound>0.0){var bndPair=priQ.pop();var currentDistance=bndPair.getDistance();if(currentDistance>=distanceLowerBound)
break;if(bndPair.isLeaves()){distanceLowerBound=currentDistance;minPair=bndPair;}else{bndPair.expandToQueue(priQ,distanceLowerBound);}}
return[minPair.getBoundable(0).getItem(),minPair.getBoundable(1).getItem()];};jsts.noding.SegmentString=function(){};jsts.noding.SegmentString.prototype.getData=jsts.abstractFunc;jsts.noding.SegmentString.prototype.setData=jsts.abstractFunc;jsts.noding.SegmentString.prototype.size=jsts.abstractFunc;jsts.noding.SegmentString.prototype.getCoordinate=jsts.abstractFunc;jsts.noding.SegmentString.prototype.getCoordinates=jsts.abstractFunc;jsts.noding.SegmentString.prototype.isClosed=jsts.abstractFunc;jsts.noding.NodableSegmentString=function(){};jsts.noding.NodableSegmentString.prototype=new jsts.noding.SegmentString();jsts.noding.NodableSegmentString.prototype.addIntersection=jsts.abstractFunc;jsts.noding.NodedSegmentString=function(pts,data){this.nodeList=new jsts.noding.SegmentNodeList(this);this.pts=pts;this.data=data;};jsts.noding.NodedSegmentString.prototype=new jsts.noding.NodableSegmentString();jsts.noding.NodedSegmentString.constructor=jsts.noding.NodedSegmentString;jsts.noding.NodedSegmentString.getNodedSubstrings=function(segStrings){if(arguments.length===2){jsts.noding.NodedSegmentString.getNodedSubstrings2.apply(this,arguments);return;}
var resultEdgelist=new javascript.util.ArrayList();jsts.noding.NodedSegmentString.getNodedSubstrings2(segStrings,resultEdgelist);return resultEdgelist;};jsts.noding.NodedSegmentString.getNodedSubstrings2=function(segStrings,resultEdgelist){for(var i=segStrings.iterator();i.hasNext();){var ss=i.next();ss.getNodeList().addSplitEdges(resultEdgelist);}};jsts.noding.NodedSegmentString.prototype.nodeList=null;jsts.noding.NodedSegmentString.prototype.pts=null;jsts.noding.NodedSegmentString.prototype.data=null;jsts.noding.NodedSegmentString.prototype.getData=function(){return this.data;};jsts.noding.NodedSegmentString.prototype.setData=function(data){this.data=data;};jsts.noding.NodedSegmentString.prototype.getNodeList=function(){return this.nodeList;};jsts.noding.NodedSegmentString.prototype.size=function(){return this.pts.length;};jsts.noding.NodedSegmentString.prototype.getCoordinate=function(i){return this.pts[i];};jsts.noding.NodedSegmentString.prototype.getCoordinates=function(){return this.pts;};jsts.noding.NodedSegmentString.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1]);};jsts.noding.NodedSegmentString.prototype.getSegmentOctant=function(index){if(index===this.pts.length-1)
return-1;return this.safeOctant(this.getCoordinate(index),this.getCoordinate(index+1));};jsts.noding.NodedSegmentString.prototype.safeOctant=function(p0,p1){if(p0.equals2D(p1))
return 0;return jsts.noding.Octant.octant(p0,p1);};jsts.noding.NodedSegmentString.prototype.addIntersections=function(li,segmentIndex,geomIndex){for(var i=0;i<li.getIntersectionNum();i++){this.addIntersection(li,segmentIndex,geomIndex,i);}};jsts.noding.NodedSegmentString.prototype.addIntersection=function(li,segmentIndex,geomIndex,intIndex){if(li instanceof jsts.geom.Coordinate){this.addIntersection2.apply(this,arguments);return;}
var intPt=new jsts.geom.Coordinate(li.getIntersection(intIndex));this.addIntersection2(intPt,segmentIndex);};jsts.noding.NodedSegmentString.prototype.addIntersection2=function(intPt,segmentIndex){this.addIntersectionNode(intPt,segmentIndex);};jsts.noding.NodedSegmentString.prototype.addIntersectionNode=function(intPt,segmentIndex){var normalizedSegmentIndex=segmentIndex;var nextSegIndex=normalizedSegmentIndex+1;if(nextSegIndex<this.pts.length){var nextPt=this.pts[nextSegIndex];if(intPt.equals2D(nextPt)){normalizedSegmentIndex=nextSegIndex;}}
var ei=this.nodeList.add(intPt,normalizedSegmentIndex);return ei;};jsts.noding.NodedSegmentString.prototype.toString=function(){var geometryFactory=new jsts.geom.GeometryFactory();return new jsts.io.WKTWriter().write(geometryFactory.createLineString(this.pts));};jsts.index.chain.MonotoneChainBuilder=function(){};jsts.index.chain.MonotoneChainBuilder.toIntArray=function(list){var array=[];for(var i=0;i<list.length;i++){array[i]=list[i];}
return array;};jsts.index.chain.MonotoneChainBuilder.getChains=function(pts){if(arguments.length===2){return jsts.index.chain.MonotoneChainBuilder.getChains2.apply(this,arguments);}
return jsts.index.chain.MonotoneChainBuilder.getChains2(pts,null);};jsts.index.chain.MonotoneChainBuilder.getChains2=function(pts,context){var mcList=[];var startIndex=jsts.index.chain.MonotoneChainBuilder.getChainStartIndices(pts);for(var i=0;i<startIndex.length-1;i++){var mc=new jsts.index.chain.MonotoneChain(pts,startIndex[i],startIndex[i+1],context);mcList.push(mc);}
return mcList;};jsts.index.chain.MonotoneChainBuilder.getChainStartIndices=function(pts){var start=0;var startIndexList=[];startIndexList.push(start);do{var last=jsts.index.chain.MonotoneChainBuilder.findChainEnd(pts,start);startIndexList.push(last);start=last;}while(start<pts.length-1);var startIndex=jsts.index.chain.MonotoneChainBuilder.toIntArray(startIndexList);return startIndex;};jsts.index.chain.MonotoneChainBuilder.findChainEnd=function(pts,start){var safeStart=start;while(safeStart<pts.length-1&&pts[safeStart].equals2D(pts[safeStart+1])){safeStart++;}
if(safeStart>=pts.length-1){return pts.length-1;}
var chainQuad=jsts.geomgraph.Quadrant.quadrant(pts[safeStart],pts[safeStart+1]);var last=start+1;while(last<pts.length){if(!pts[last-1].equals2D(pts[last])){var quad=jsts.geomgraph.Quadrant.quadrant(pts[last-1],pts[last]);if(quad!==chainQuad)
break;}
last++;}
return last-1;};jsts.algorithm.LineIntersector=function(){this.inputLines=[[],[]];this.intPt=[null,null];this.pa=this.intPt[0];this.pb=this.intPt[1];this.result=jsts.algorithm.LineIntersector.NO_INTERSECTION;};jsts.algorithm.LineIntersector.NO_INTERSECTION=0;jsts.algorithm.LineIntersector.POINT_INTERSECTION=1;jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION=2;jsts.algorithm.LineIntersector.prototype.setPrecisionModel=function(precisionModel){this.precisionModel=precisionModel;};jsts.algorithm.LineIntersector.prototype.getEndpoint=function(segmentIndex,ptIndex){return this.inputLines[segmentIndex][ptIndex];};jsts.algorithm.LineIntersector.computeEdgeDistance=function(p,p0,p1){var dx=Math.abs(p1.x-p0.x);var dy=Math.abs(p1.y-p0.y);var dist=-1.0;if(p.equals(p0)){dist=0.0;}else if(p.equals(p1)){if(dx>dy){dist=dx;}else{dist=dy;}}else{var pdx=Math.abs(p.x-p0.x);var pdy=Math.abs(p.y-p0.y);if(dx>dy){dist=pdx;}else{dist=pdy;}
if(dist===0.0&&!p.equals(p0)){dist=Math.max(pdx,pdy);}}
if(dist===0.0&&!p.equals(p0)){throw new jsts.error.IllegalArgumentError('Bad distance calculation');}
return dist;};jsts.algorithm.LineIntersector.nonRobustComputeEdgeDistance=function(p,p1,p2){var dx=p.x-p1.x;var dy=p.y-p1.y;var dist=Math.sqrt(dx*dx+dy*dy);if(!(dist===0.0&&!p.equals(p1))){throw new jsts.error.IllegalArgumentError('Invalid distance calculation');}
return dist;};jsts.algorithm.LineIntersector.prototype.result=null;jsts.algorithm.LineIntersector.prototype.inputLines=null;jsts.algorithm.LineIntersector.prototype.intPt=null;jsts.algorithm.LineIntersector.prototype.intLineIndex=null;jsts.algorithm.LineIntersector.prototype._isProper=null;jsts.algorithm.LineIntersector.prototype.pa=null;jsts.algorithm.LineIntersector.prototype.pb=null;jsts.algorithm.LineIntersector.prototype.precisionModel=null;jsts.algorithm.LineIntersector.prototype.computeIntersection=function(p,p1,p2){throw new jsts.error.AbstractMethodInvocationError();};jsts.algorithm.LineIntersector.prototype.isCollinear=function(){return this.result===jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;};jsts.algorithm.LineIntersector.prototype.computeIntersection=function(p1,p2,p3,p4){this.inputLines[0][0]=p1;this.inputLines[0][1]=p2;this.inputLines[1][0]=p3;this.inputLines[1][1]=p4;this.result=this.computeIntersect(p1,p2,p3,p4);};jsts.algorithm.LineIntersector.prototype.computeIntersect=function(p1,p2,q1,q2){throw new jsts.error.AbstractMethodInvocationError();};jsts.algorithm.LineIntersector.prototype.isEndPoint=function(){return this.hasIntersection()&&!this._isProper;};jsts.algorithm.LineIntersector.prototype.hasIntersection=function(){return this.result!==jsts.algorithm.LineIntersector.NO_INTERSECTION;};jsts.algorithm.LineIntersector.prototype.getIntersectionNum=function(){return this.result;};jsts.algorithm.LineIntersector.prototype.getIntersection=function(intIndex){return this.intPt[intIndex];};jsts.algorithm.LineIntersector.prototype.computeIntLineIndex=function(){if(this.intLineIndex===null){this.intLineIndex=[[],[]];this.computeIntLineIndex(0);this.computeIntLineIndex(1);}};jsts.algorithm.LineIntersector.prototype.isIntersection=function(pt){var i;for(i=0;i<this.result;i++){if(this.intPt[i].equals2D(pt)){return true;}}
return false;};jsts.algorithm.LineIntersector.prototype.isInteriorIntersection=function(){if(arguments.length===1){return this.isInteriorIntersection2.apply(this,arguments);}
if(this.isInteriorIntersection(0)){return true;}
if(this.isInteriorIntersection(1)){return true;}
return false;};jsts.algorithm.LineIntersector.prototype.isInteriorIntersection2=function(inputLineIndex){var i;for(i=0;i<this.result;i++){if(!(this.intPt[i].equals2D(this.inputLines[inputLineIndex][0])||this.intPt[i].equals2D(this.inputLines[inputLineIndex][1]))){return true;}}
return false;};jsts.algorithm.LineIntersector.prototype.isProper=function(){return this.hasIntersection()&&this._isProper;};jsts.algorithm.LineIntersector.prototype.getIntersectionAlongSegment=function(segmentIndex,intIndex){this.computeIntLineIndex();return this.intPt[intLineIndex[segmentIndex][intIndex]];};jsts.algorithm.LineIntersector.prototype.getIndexAlongSegment=function(segmentIndex,intIndex){this.computeIntLineIndex();return this.intLineIndex[segmentIndex][intIndex];};jsts.algorithm.LineIntersector.prototype.computeIntLineIndex=function(segmentIndex){var dist0=this.getEdgeDistance(segmentIndex,0);var dist1=this.getEdgeDistance(segmentIndex,1);if(dist0>dist1){this.intLineIndex[segmentIndex][0]=0;this.intLineIndex[segmentIndex][1]=1;}else{this.intLineIndex[segmentIndex][0]=1;this.intLineIndex[segmentIndex][1]=0;}};jsts.algorithm.LineIntersector.prototype.getEdgeDistance=function(segmentIndex,intIndex){var dist=jsts.algorithm.LineIntersector.computeEdgeDistance(this.intPt[intIndex],this.inputLines[segmentIndex][0],this.inputLines[segmentIndex][1]);return dist;};jsts.algorithm.RobustLineIntersector=function(){jsts.algorithm.RobustLineIntersector.prototype.constructor.call(this);};jsts.algorithm.RobustLineIntersector.prototype=new jsts.algorithm.LineIntersector();jsts.algorithm.RobustLineIntersector.prototype.computeIntersection=function(p,p1,p2){if(arguments.length===4){jsts.algorithm.LineIntersector.prototype.computeIntersection.apply(this,arguments);return;}
this._isProper=false;if(jsts.geom.Envelope.intersects(p1,p2,p)){if((jsts.algorithm.CGAlgorithms.orientationIndex(p1,p2,p)===0)&&(jsts.algorithm.CGAlgorithms.orientationIndex(p2,p1,p)===0)){this._isProper=true;if(p.equals(p1)||p.equals(p2)){this._isProper=false;}
this.result=jsts.algorithm.LineIntersector.POINT_INTERSECTION;return;}}
this.result=jsts.algorithm.LineIntersector.NO_INTERSECTION;};jsts.algorithm.RobustLineIntersector.prototype.computeIntersect=function(p1,p2,q1,q2){this._isProper=false;if(!jsts.geom.Envelope.intersects(p1,p2,q1,q2)){return jsts.algorithm.LineIntersector.NO_INTERSECTION;}
var Pq1=jsts.algorithm.CGAlgorithms.orientationIndex(p1,p2,q1);var Pq2=jsts.algorithm.CGAlgorithms.orientationIndex(p1,p2,q2);if((Pq1>0&&Pq2>0)||(Pq1<0&&Pq2<0)){return jsts.algorithm.LineIntersector.NO_INTERSECTION;}
var Qp1=jsts.algorithm.CGAlgorithms.orientationIndex(q1,q2,p1);var Qp2=jsts.algorithm.CGAlgorithms.orientationIndex(q1,q2,p2);if((Qp1>0&&Qp2>0)||(Qp1<0&&Qp2<0)){return jsts.algorithm.LineIntersector.NO_INTERSECTION;}
var collinear=Pq1===0&&Pq2===0&&Qp1===0&&Qp2===0;if(collinear){return this.computeCollinearIntersection(p1,p2,q1,q2);}
if(Pq1===0||Pq2===0||Qp1===0||Qp2===0){this._isProper=false;if(p1.equals2D(q1)||p1.equals2D(q2)){this.intPt[0]=p1;}else if(p2.equals2D(q1)||p2.equals2D(q2)){this.intPt[0]=p2;}
else if(Pq1===0){this.intPt[0]=new jsts.geom.Coordinate(q1);}else if(Pq2===0){this.intPt[0]=new jsts.geom.Coordinate(q2);}else if(Qp1===0){this.intPt[0]=new jsts.geom.Coordinate(p1);}else if(Qp2===0){this.intPt[0]=new jsts.geom.Coordinate(p2);}}else{this._isProper=true;this.intPt[0]=this.intersection(p1,p2,q1,q2);}
return jsts.algorithm.LineIntersector.POINT_INTERSECTION;};jsts.algorithm.RobustLineIntersector.prototype.computeCollinearIntersection=function(p1,p2,q1,q2){var p1q1p2=jsts.geom.Envelope.intersects(p1,p2,q1);var p1q2p2=jsts.geom.Envelope.intersects(p1,p2,q2);var q1p1q2=jsts.geom.Envelope.intersects(q1,q2,p1);var q1p2q2=jsts.geom.Envelope.intersects(q1,q2,p2);if(p1q1p2&&p1q2p2){this.intPt[0]=q1;this.intPt[1]=q2;return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;}
if(q1p1q2&&q1p2q2){this.intPt[0]=p1;this.intPt[1]=p2;return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;}
if(p1q1p2&&q1p1q2){this.intPt[0]=q1;this.intPt[1]=p1;return q1.equals(p1)&&!p1q2p2&&!q1p2q2?jsts.algorithm.LineIntersector.POINT_INTERSECTION:jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;}
if(p1q1p2&&q1p2q2){this.intPt[0]=q1;this.intPt[1]=p2;return q1.equals(p2)&&!p1q2p2&&!q1p1q2?jsts.algorithm.LineIntersector.POINT_INTERSECTION:jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;}
if(p1q2p2&&q1p1q2){this.intPt[0]=q2;this.intPt[1]=p1;return q2.equals(p1)&&!p1q1p2&&!q1p2q2?jsts.algorithm.LineIntersector.POINT_INTERSECTION:jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;}
if(p1q2p2&&q1p2q2){this.intPt[0]=q2;this.intPt[1]=p2;return q2.equals(p2)&&!p1q1p2&&!q1p1q2?jsts.algorithm.LineIntersector.POINT_INTERSECTION:jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;}
return jsts.algorithm.LineIntersector.NO_INTERSECTION;};jsts.algorithm.RobustLineIntersector.prototype.intersection=function(p1,p2,q1,q2){var intPt=this.intersectionWithNormalization(p1,p2,q1,q2);if(!this.isInSegmentEnvelopes(intPt)){intPt=jsts.algorithm.CentralEndpointIntersector.getIntersection(p1,p2,q1,q2);}
if(this.precisionModel!==null){this.precisionModel.makePrecise(intPt);}
return intPt;};jsts.algorithm.RobustLineIntersector.prototype.intersectionWithNormalization=function(p1,p2,q1,q2){var n1=new jsts.geom.Coordinate(p1);var n2=new jsts.geom.Coordinate(p2);var n3=new jsts.geom.Coordinate(q1);var n4=new jsts.geom.Coordinate(q2);var normPt=new jsts.geom.Coordinate();this.normalizeToEnvCentre(n1,n2,n3,n4,normPt);var intPt=this.safeHCoordinateIntersection(n1,n2,n3,n4);intPt.x+=normPt.x;intPt.y+=normPt.y;return intPt;};jsts.algorithm.RobustLineIntersector.prototype.safeHCoordinateIntersection=function(p1,p2,q1,q2){var intPt=null;try{intPt=jsts.algorithm.HCoordinate.intersection(p1,p2,q1,q2);}catch(e){if(e instanceof jsts.error.NotRepresentableError){intPt=jsts.algorithm.CentralEndpointIntersector.getIntersection(p1,p2,q1,q2);}else{throw e;}}
return intPt;};jsts.algorithm.RobustLineIntersector.prototype.normalizeToMinimum=function(n1,n2,n3,n4,normPt){normPt.x=this.smallestInAbsValue(n1.x,n2.x,n3.x,n4.x);normPt.y=this.smallestInAbsValue(n1.y,n2.y,n3.y,n4.y);n1.x-=normPt.x;n1.y-=normPt.y;n2.x-=normPt.x;n2.y-=normPt.y;n3.x-=normPt.x;n3.y-=normPt.y;n4.x-=normPt.x;n4.y-=normPt.y;};jsts.algorithm.RobustLineIntersector.prototype.normalizeToEnvCentre=function(n00,n01,n10,n11,normPt){var minX0=n00.x<n01.x?n00.x:n01.x;var minY0=n00.y<n01.y?n00.y:n01.y;var maxX0=n00.x>n01.x?n00.x:n01.x;var maxY0=n00.y>n01.y?n00.y:n01.y;var minX1=n10.x<n11.x?n10.x:n11.x;var minY1=n10.y<n11.y?n10.y:n11.y;var maxX1=n10.x>n11.x?n10.x:n11.x;var maxY1=n10.y>n11.y?n10.y:n11.y;var intMinX=minX0>minX1?minX0:minX1;var intMaxX=maxX0<maxX1?maxX0:maxX1;var intMinY=minY0>minY1?minY0:minY1;var intMaxY=maxY0<maxY1?maxY0:maxY1;var intMidX=(intMinX+intMaxX)/2.0;var intMidY=(intMinY+intMaxY)/2.0;normPt.x=intMidX;normPt.y=intMidY;n00.x-=normPt.x;n00.y-=normPt.y;n01.x-=normPt.x;n01.y-=normPt.y;n10.x-=normPt.x;n10.y-=normPt.y;n11.x-=normPt.x;n11.y-=normPt.y;};jsts.algorithm.RobustLineIntersector.prototype.smallestInAbsValue=function(x1,x2,x3,x4){var x=x1;var xabs=Math.abs(x);if(Math.abs(x2)<xabs){x=x2;xabs=Math.abs(x2);}
if(Math.abs(x3)<xabs){x=x3;xabs=Math.abs(x3);}
if(Math.abs(x4)<xabs){x=x4;}
return x;};jsts.algorithm.RobustLineIntersector.prototype.isInSegmentEnvelopes=function(intPt){var env0=new jsts.geom.Envelope(this.inputLines[0][0],this.inputLines[0][1]);var env1=new jsts.geom.Envelope(this.inputLines[1][0],this.inputLines[1][1]);return env0.contains(intPt)&&env1.contains(intPt);};jsts.algorithm.HCoordinate=function(){this.x=0.0;this.y=0.0;this.w=1.0;if(arguments.length===1){this.initFrom1Coordinate(arguments[0]);}else if(arguments.length===2&&arguments[0]instanceof jsts.geom.Coordinate){this.initFrom2Coordinates(arguments[0],arguments[1]);}else if(arguments.length===2&&arguments[0]instanceof jsts.algorithm.HCoordinate){this.initFrom2HCoordinates(arguments[0],arguments[1]);}else if(arguments.length===2){this.initFromXY(arguments[0],arguments[1]);}else if(arguments.length===3){this.initFromXYW(arguments[0],arguments[1],arguments[2]);}else if(arguments.length===4){this.initFromXYW(arguments[0],arguments[1],arguments[2],arguments[3]);}};jsts.algorithm.HCoordinate.intersection=function(p1,p2,q1,q2){var px,py,pw,qx,qy,qw,x,y,w,xInt,yInt;px=p1.y-p2.y;py=p2.x-p1.x;pw=p1.x*p2.y-p2.x*p1.y;qx=q1.y-q2.y;qy=q2.x-q1.x;qw=q1.x*q2.y-q2.x*q1.y;x=py*qw-qy*pw;y=qx*pw-px*qw;w=px*qy-qx*py;xInt=x/w;yInt=y/w;if(!isFinite(xInt)||!isFinite(yInt)){throw new jsts.error.NotRepresentableError();}
return new jsts.geom.Coordinate(xInt,yInt);};jsts.algorithm.HCoordinate.prototype.initFrom1Coordinate=function(p){this.x=p.x;this.y=p.y;this.w=1.0;};jsts.algorithm.HCoordinate.prototype.initFrom2Coordinates=function(p1,p2){this.x=p1.y-p2.y;this.y=p2.x-p1.x;this.w=p1.x*p2.y-p2.x*p1.y;};jsts.algorithm.HCoordinate.prototype.initFrom2HCoordinates=function(p1,p2){this.x=p1.y*p2.w-p2.y*p1.w;this.y=p2.x*p1.w-p1.x*p2.w;this.w=p1.x*p2.y-p2.x*p1.y;};jsts.algorithm.HCoordinate.prototype.initFromXYW=function(x,y,w){this.x=x;this.y=y;this.w=w;};jsts.algorithm.HCoordinate.prototype.initFromXY=function(x,y){this.x=x;this.y=y;this.w=1.0;};jsts.algorithm.HCoordinate.prototype.initFrom4Coordinates=function(p1,p2,q1,q2){var px,py,pw,qx,qy,qw;px=p1.y-p2.y;py=p2.x-p1.x;pw=p1.x*p2.y-p2.x*p1.y;qx=q1.y-q2.y;qy=q2.x-q1.x;qw=q1.x*q2.y-q2.x*q1.y;this.x=py*qw-qy*pw;this.y=qx*pw-px*qw;this.w=px*qy-qx*py;};jsts.algorithm.HCoordinate.prototype.getX=function(){var a=this.x/this.w;if(!isFinite(a)){throw new jsts.error.NotRepresentableError();}
return a;};jsts.algorithm.HCoordinate.prototype.getY=function(){var a=this.y/this.w;if(!isFinite(a)){throw new jsts.error.NotRepresentableError();}
return a;};jsts.algorithm.HCoordinate.prototype.getCoordinate=function(){var p=new jsts.geom.Coordinate();p.x=this.getX();p.y=this.getY();return p;};jsts.geom.LineSegment=function(){if(arguments.length===0){this.p0=new jsts.geom.Coordinate();this.p1=new jsts.geom.Coordinate();}else if(arguments.length===1){this.p0=arguments[0].p0;this.p1=arguments[0].p1;}else if(arguments.length===2){this.p0=arguments[0];this.p1=arguments[1];}else if(arguments.length===4){this.p0=new jsts.geom.Coordinate(arguments[0],arguments[1]);this.p1=new jsts.geom.Coordinate(arguments[2],arguments[3]);}};jsts.geom.LineSegment.prototype.p0=null;jsts.geom.LineSegment.prototype.p1=null;jsts.geom.LineSegment.midPoint=function(p0,p1){return new jsts.geom.Coordinate((p0.x+p1.x)/2,(p0.y+p1.y)/2);};jsts.geom.LineSegment.prototype.getCoordinate=function(i){if(i===0)return this.p0;return this.p1;};jsts.geom.LineSegment.prototype.getLength=function(){return this.p0.distance(this.p1);};jsts.geom.LineSegment.prototype.isHorizontal=function(){return this.p0.y===this.p1.y;};jsts.geom.LineSegment.prototype.isVertical=function(){return this.p0.x===this.p1.x;};jsts.geom.LineSegment.prototype.orientationIndex=function(arg){if(arg instanceof jsts.geom.LineSegment){return this.orientationIndex1(arg);}else if(arg instanceof jsts.geom.Coordinate){return this.orientationIndex2(arg);}};jsts.geom.LineSegment.prototype.orientationIndex1=function(seg){var orient0=jsts.algorithm.CGAlgorithms.orientationIndex(this.p0,this.p1,seg.p0);var orient1=jsts.algorithm.CGAlgorithms.orientationIndex(this.p0,this.p1,seg.p1);if(orient0>=0&&orient1>=0){return Math.max(orient0,orient1);}
if(orient0<=0&&orient1<=0){return Math.max(orient0,orient1);}
return 0;};jsts.geom.LineSegment.prototype.orientationIndex2=function(p){return jsts.algorithm.CGAlgorithms.orientationIndex(this.p0,this.p1,p);};jsts.geom.LineSegment.prototype.reverse=function(){var temp=this.p0;this.p0=this.p1;this.p1=temp;};jsts.geom.LineSegment.prototype.normalize=function(){if(this.p1.compareTo(this.p0)<0)this.reverse();};jsts.geom.LineSegment.prototype.angle=function(){return Math.atan2(this.p1.y-this.p0.y,this.p1.x-this.p0.x);};jsts.geom.LineSegment.prototype.midPoint=function(){return jsts.geom.LineSegment.midPoint(this.p0,this.p1);};jsts.geom.LineSegment.prototype.distance=function(arg){if(arg instanceof jsts.geom.LineSegment){return this.distance1(arg);}else if(arg instanceof jsts.geom.Coordinate){return this.distance2(arg);}};jsts.geom.LineSegment.prototype.distance1=function(ls){return jsts.algorithm.CGAlgorithms.distanceLineLine(this.p0,this.p1,ls.p0,ls.p1);};jsts.geom.LineSegment.prototype.distance2=function(p){return jsts.algorithm.CGAlgorithms.distancePointLine(p,this.p0,this.p1);};jsts.geom.LineSegment.prototype.pointAlong=function(segmentLengthFraction){var coord=new jsts.geom.Coordinate();coord.x=this.p0.x+segmentLengthFraction*(this.p1.x-this.p0.x);coord.y=this.p0.y+segmentLengthFraction*(this.p1.y-this.p0.y);return coord;};jsts.geom.LineSegment.prototype.pointAlongOffset=function(segmentLengthFraction,offsetDistance){var segx=this.p0.x+segmentLengthFraction*(this.p1.x-this.p0.x);var segy=this.p0.y+segmentLengthFraction*(this.p1.y-this.p0.y);var dx=this.p1.x-this.p0.x;var dy=this.p1.y-this.p0.y;var len=Math.sqrt(dx*dx+dy*dy);var ux=0;var uy=0;if(offsetDistance!==0){if(len<=0){throw"Cannot compute offset from zero-length line segment";}
ux=offsetDistance*dx/len;uy=offsetDistance*dy/len;}
var offsetx=segx-uy;var offsety=segy+ux;var coord=new jsts.geom.Coordinate(offsetx,offsety);return coord;};jsts.geom.LineSegment.prototype.projectionFactor=function(p){if(p.equals(this.p0))
return 0.0;if(p.equals(this.p1))
return 1.0;var dx=this.p1.x-this.p0.x;var dy=this.p1.y-this.p0.y;var len2=dx*dx+dy*dy;var r=((p.x-this.p0.x)*dx+(p.y-this.p0.y)*dy)/len2;return r;};jsts.geom.LineSegment.prototype.segmentFraction=function(inputPt){var segFrac=this.projectionFactor(inputPt);if(segFrac<0){segFrac=0;}else if(segFrac>1||isNaN(segFrac)){segFrac=1;}
return segFrac;};jsts.geom.LineSegment.prototype.project=function(arg){if(arg instanceof jsts.geom.Coordinate){return this.project1(arg);}else if(arg instanceof jsts.geom.LineSegment){return this.project2(arg);}};jsts.geom.LineSegment.prototype.project1=function(p){if(p.equals(this.p0)||p.equals(this.p1)){return new jsts.geom.Coordinate(p);}
var r=this.projectionFactor(p);var coord=new jsts.geom.Coordinate();coord.x=this.p0.x+r*(this.p1.x-this.p0.x);coord.y=this.p0.y+r*(this.p1.y-this.p0.y);return coord;};jsts.geom.LineSegment.prototype.project2=function(seg){var pf0=this.projectionFactor(seg.p0);var pf1=this.projectionFactor(seg.p1);if(pf0>=1&&pf1>=1)return null;if(pf0<=0&&pf1<=0)return null;var newp0=this.project(seg.p0);if(pf0<0)newp0=p0;if(pf0>1)newp0=p1;var newp1=this.project(seg.p1);if(pf1<0.0)newp1=p0;if(pf1>1.0)newp1=p1;return new jsts.geom.LineSegment(newp0,newp1);};jsts.geom.LineSegment.prototype.closestPoint=function(p){var factor=this.projectionFactor(p);if(factor>0&&factor<1){return this.project(p);}
var dist0=this.p0.distance(p);var dist1=this.p1.distance(p);if(dist0<dist1)
return this.p0;return this.p1;};jsts.geom.LineSegment.prototype.closestPoints=function(line){var intPt=this.intersection(line);if(intPt!==null){return[intPt,intPt];}
var closestPt=[];var minDistance=Number.MAX_VALUE;var dist;var close00=this.closestPoint(line.p0);minDistance=close00.distance(line.p0);closestPt[0]=close00;closestPt[1]=line.p0;var close01=this.closestPoint(line.p1);dist=close01.distance(line.p1);if(dist<minDistance){minDistance=dist;closestPt[0]=close01;closestPt[1]=line.p1;}
var close10=line.closestPoint(this.p0);dist=close10.distance(this.p0);if(dist<minDistance){minDistance=dist;closestPt[0]=this.p0;closestPt[1]=close10;}
var close11=line.closestPoint(this.p1);dist=close11.distance(this.p1);if(dist<minDistance){minDistance=dist;closestPt[0]=this.p1;closestPt[1]=close11;}
return closestPt;};jsts.geom.LineSegment.prototype.intersection=function(line){var li=new jsts.algorithm.RobustLineIntersector();li.computeIntersection(this.p0,this.p1,line.p0,line.p1);if(li.hasIntersection())
return li.getIntersection(0);return null;};jsts.geom.LineSegment.prototype.setCoordinates=function(ls){if(ls instanceof jsts.geom.Coordinate){this.setCoordinates2.apply(this,arguments);return;}
this.setCoordinates2(ls.p0,ls.p1);};jsts.geom.LineSegment.prototype.setCoordinates2=function(p0,p1){this.p0.x=p0.x;this.p0.y=p0.y;this.p1.x=p1.x;this.p1.y=p1.y;};jsts.geom.LineSegment.prototype.distancePerpendicular=function(p){return jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular(p,this.p0,this.p1);};jsts.geom.LineSegment.prototype.lineIntersection=function(line){try{var intPt=jsts.algorithm.HCoordinate.intersection(this.p0,this.p1,line.p0,line.p1);return intPt;}catch(ex){}
return null;};jsts.geom.LineSegment.prototype.toGeometry=function(geomFactory){return geomFactory.createLineString([this.p0,this.p1]);};jsts.geom.LineSegment.prototype.equals=function(o){if(!(o instanceof jsts.geom.LineSegment)){return false;}
return this.p0.equals(o.p0)&&this.p1.equals(o.p1);};jsts.geom.LineSegment.prototype.compareTo=function(o){var comp0=this.p0.compareTo(o.p0);if(comp0!==0)return comp0;return this.p1.compareTo(o.p1);};jsts.geom.LineSegment.prototype.equalsTopo=function(other){return this.p0.equals(other.p0)&&this.p1.equals(other.p1)||this.p0.equals(other.p1)&&this.p1.equals(other.p0);};jsts.geom.LineSegment.prototype.toString=function(){return"LINESTRING("+
this.p0.x+" "+this.p0.y
+", "+
this.p1.x+" "+this.p1.y+")";};jsts.index.chain.MonotoneChainOverlapAction=function(){this.tempEnv1=new jsts.geom.Envelope();this.tempEnv2=new jsts.geom.Envelope();this.overlapSeg1=new jsts.geom.LineSegment();this.overlapSeg2=new jsts.geom.LineSegment();};jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv1=null;jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv2=null;jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg1=null;jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg2=null;jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap=function(mc1,start1,mc2,start2){this.mc1.getLineSegment(start1,this.overlapSeg1);this.mc2.getLineSegment(start2,this.overlapSeg2);this.overlap2(this.overlapSeg1,this.overlapSeg2);};jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap2=function(seg1,seg2){};(function(){var MonotoneChainOverlapAction=jsts.index.chain.MonotoneChainOverlapAction;var SinglePassNoder=jsts.noding.SinglePassNoder;var STRtree=jsts.index.strtree.STRtree;var NodedSegmentString=jsts.noding.NodedSegmentString;var MonotoneChainBuilder=jsts.index.chain.MonotoneChainBuilder;var SegmentOverlapAction=function(si){this.si=si;};SegmentOverlapAction.prototype=new MonotoneChainOverlapAction();SegmentOverlapAction.constructor=SegmentOverlapAction;SegmentOverlapAction.prototype.si=null;SegmentOverlapAction.prototype.overlap=function(mc1,start1,mc2,start2){var ss1=mc1.getContext();var ss2=mc2.getContext();this.si.processIntersections(ss1,start1,ss2,start2);};jsts.noding.MCIndexNoder=function(){this.monoChains=[];this.index=new STRtree();};jsts.noding.MCIndexNoder.prototype=new SinglePassNoder();jsts.noding.MCIndexNoder.constructor=jsts.noding.MCIndexNoder;jsts.noding.MCIndexNoder.prototype.monoChains=null;jsts.noding.MCIndexNoder.prototype.index=null;jsts.noding.MCIndexNoder.prototype.idCounter=0;jsts.noding.MCIndexNoder.prototype.nodedSegStrings=null;jsts.noding.MCIndexNoder.prototype.nOverlaps=0;jsts.noding.MCIndexNoder.prototype.getMonotoneChains=function(){return this.monoChains;};jsts.noding.MCIndexNoder.prototype.getIndex=function(){return this.index;};jsts.noding.MCIndexNoder.prototype.getNodedSubstrings=function(){return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);};jsts.noding.MCIndexNoder.prototype.computeNodes=function(inputSegStrings){this.nodedSegStrings=inputSegStrings;for(var i=inputSegStrings.iterator();i.hasNext();){this.add(i.next());}
this.intersectChains();};jsts.noding.MCIndexNoder.prototype.intersectChains=function(){var overlapAction=new SegmentOverlapAction(this.segInt);for(var i=0;i<this.monoChains.length;i++){var queryChain=this.monoChains[i];var overlapChains=this.index.query(queryChain.getEnvelope());for(var j=0;j<overlapChains.length;j++){var testChain=overlapChains[j];if(testChain.getId()>queryChain.getId()){queryChain.computeOverlaps(testChain,overlapAction);this.nOverlaps++;}
if(this.segInt.isDone())
return;}}};jsts.noding.MCIndexNoder.prototype.add=function(segStr){var segChains=MonotoneChainBuilder.getChains(segStr.getCoordinates(),segStr);for(var i=0;i<segChains.length;i++){var mc=segChains[i];mc.setId(this.idCounter++);this.index.insert(mc.getEnvelope(),mc);this.monoChains.push(mc);}};})();jsts.simplify.LineSegmentIndex=function(){this.index=new jsts.index.quadtree.Quadtree();};jsts.simplify.LineSegmentIndex.prototype.index=null;jsts.simplify.LineSegmentIndex.prototype.add=function(line){if(line instanceof jsts.geom.LineSegment){this.add2(line);return;}
var segs=line.getSegments();for(var i=0;i<segs.length;i++){var seg=segs[i];this.add2(seg);}};jsts.simplify.LineSegmentIndex.prototype.add2=function(seg){this.index.insert(new jsts.geom.Envelope(seg.p0,seg.p1),seg);};jsts.simplify.LineSegmentIndex.prototype.remove=function(seg){this.index.remove(new jsts.geom.Envelope(seg.p0,seg.p1),seg);};jsts.simplify.LineSegmentIndex.prototype.query=function(querySeg){var env=new jsts.geom.Envelope(querySeg.p0,querySeg.p1);var visitor=new jsts.simplify.LineSegmentIndex.LineSegmentVisitor(querySeg);this.index.query(env,visitor);var itemsFound=visitor.getItems();return itemsFound;};jsts.simplify.LineSegmentIndex.LineSegmentVisitor=function(querySeg){this.items=[];this.querySeg=querySeg;};jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype=new jsts.index.ItemVisitor();jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.querySeg=null;jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.items=null;jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.visitItem=function(item){var seg=item;if(jsts.geom.Envelope.intersects(seg.p0,seg.p1,this.querySeg.p0,this.querySeg.p1))
this.items.push(item);};jsts.simplify.LineSegmentIndex.LineSegmentVisitor.prototype.getItems=function(){return this.items;};jsts.geomgraph.EdgeEndStar=function(){this.edgeMap=new javascript.util.TreeMap();this.edgeList=null;this.ptInAreaLocation=[jsts.geom.Location.NONE,jsts.geom.Location.NONE];};jsts.geomgraph.EdgeEndStar.prototype.edgeMap=null;jsts.geomgraph.EdgeEndStar.prototype.edgeList=null;jsts.geomgraph.EdgeEndStar.prototype.ptInAreaLocation=null;jsts.geomgraph.EdgeEndStar.prototype.insert=function(e){throw new jsts.error.AbstractMethodInvocationError();};jsts.geomgraph.EdgeEndStar.prototype.insertEdgeEnd=function(e,obj){this.edgeMap.put(e,obj);this.edgeList=null;};jsts.geomgraph.EdgeEndStar.prototype.getCoordinate=function(){var it=this.iterator();if(!it.hasNext())
return null;var e=it.next();return e.getCoordinate();};jsts.geomgraph.EdgeEndStar.prototype.getDegree=function(){return this.edgeMap.size();};jsts.geomgraph.EdgeEndStar.prototype.iterator=function(){return this.getEdges().iterator();};jsts.geomgraph.EdgeEndStar.prototype.getEdges=function(){if(this.edgeList===null){this.edgeList=new javascript.util.ArrayList(this.edgeMap.values());}
return this.edgeList;};jsts.geomgraph.EdgeEndStar.prototype.getNextCW=function(ee){this.getEdges();var i=this.edgeList.indexOf(ee);var iNextCW=i-1;if(i===0)
iNextCW=this.edgeList.length-1;return this.edgeList[iNextCW];};jsts.geomgraph.EdgeEndStar.prototype.computeLabelling=function(geomGraph){this.computeEdgeEndLabels(geomGraph[0].getBoundaryNodeRule());this.propagateSideLabels(0);this.propagateSideLabels(1);var hasDimensionalCollapseEdge=[false,false];for(var it=this.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();for(var geomi=0;geomi<2;geomi++){if(label.isLine(geomi)&&label.getLocation(geomi)===jsts.geom.Location.BOUNDARY)
hasDimensionalCollapseEdge[geomi]=true;}}
for(var it=this.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();for(var geomi=0;geomi<2;geomi++){if(label.isAnyNull(geomi)){var loc=jsts.geom.Location.NONE;if(hasDimensionalCollapseEdge[geomi]){loc=jsts.geom.Location.EXTERIOR;}else{var p=e.getCoordinate();loc=this.getLocation(geomi,p,geomGraph);}
label.setAllLocationsIfNull(geomi,loc);}}}};jsts.geomgraph.EdgeEndStar.prototype.computeEdgeEndLabels=function(boundaryNodeRule){for(var it=this.iterator();it.hasNext();){var ee=it.next();ee.computeLabel(boundaryNodeRule);}};jsts.geomgraph.EdgeEndStar.prototype.getLocation=function(geomIndex,p,geom){if(this.ptInAreaLocation[geomIndex]===jsts.geom.Location.NONE){this.ptInAreaLocation[geomIndex]=jsts.algorithm.locate.SimplePointInAreaLocator.locate(p,geom[geomIndex].getGeometry());}
return this.ptInAreaLocation[geomIndex];};jsts.geomgraph.EdgeEndStar.prototype.isAreaLabelsConsistent=function(geomGraph){this.computeEdgeEndLabels(geomGraph.getBoundaryNodeRule());return this.checkAreaLabelsConsistent(0);};jsts.geomgraph.EdgeEndStar.prototype.checkAreaLabelsConsistent=function(geomIndex){var edges=this.getEdges();if(edges.size()<=0)
return true;var lastEdgeIndex=edges.size()-1;var startLabel=edges.get(lastEdgeIndex).getLabel();var startLoc=startLabel.getLocation(geomIndex,jsts.geomgraph.Position.LEFT);jsts.util.Assert.isTrue(startLoc!=jsts.geom.Location.NONE,'Found unlabelled area edge');var currLoc=startLoc;for(var it=this.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();jsts.util.Assert.isTrue(label.isArea(geomIndex),'Found non-area edge');var leftLoc=label.getLocation(geomIndex,jsts.geomgraph.Position.LEFT);var rightLoc=label.getLocation(geomIndex,jsts.geomgraph.Position.RIGHT);if(leftLoc===rightLoc){return false;}
if(rightLoc!==currLoc){return false;}
currLoc=leftLoc;}
return true;};jsts.geomgraph.EdgeEndStar.prototype.propagateSideLabels=function(geomIndex){var startLoc=jsts.geom.Location.NONE;for(var it=this.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();if(label.isArea(geomIndex)&&label.getLocation(geomIndex,jsts.geomgraph.Position.LEFT)!==jsts.geom.Location.NONE)
startLoc=label.getLocation(geomIndex,jsts.geomgraph.Position.LEFT);}
if(startLoc===jsts.geom.Location.NONE)
return;var currLoc=startLoc;for(var it=this.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();if(label.getLocation(geomIndex,jsts.geomgraph.Position.ON)===jsts.geom.Location.NONE)
label.setLocation(geomIndex,jsts.geomgraph.Position.ON,currLoc);if(label.isArea(geomIndex)){var leftLoc=label.getLocation(geomIndex,jsts.geomgraph.Position.LEFT);var rightLoc=label.getLocation(geomIndex,jsts.geomgraph.Position.RIGHT);if(rightLoc!==jsts.geom.Location.NONE){if(rightLoc!==currLoc)
throw new jsts.error.TopologyError('side location conflict',e.getCoordinate());if(leftLoc===jsts.geom.Location.NONE){jsts.util.Assert.shouldNeverReachHere('found single null side (at '+
e.getCoordinate()+')');}
currLoc=leftLoc;}else{jsts.util.Assert.isTrue(label.getLocation(geomIndex,jsts.geomgraph.Position.LEFT)===jsts.geom.Location.NONE,'found single null side');label.setLocation(geomIndex,jsts.geomgraph.Position.RIGHT,currLoc);label.setLocation(geomIndex,jsts.geomgraph.Position.LEFT,currLoc);}}}};jsts.geomgraph.EdgeEndStar.prototype.findIndex=function(eSearch){this.iterator();for(var i=0;i<this.edgeList.size();i++){var e=this.edgeList.get(i);if(e===eSearch)
return i;}
return-1;};jsts.operation.relate.EdgeEndBundleStar=function(){jsts.geomgraph.EdgeEndStar.apply(this,arguments);};jsts.operation.relate.EdgeEndBundleStar.prototype=new jsts.geomgraph.EdgeEndStar();jsts.operation.relate.EdgeEndBundleStar.prototype.insert=function(e){var eb=this.edgeMap.get(e);if(eb===null){eb=new jsts.operation.relate.EdgeEndBundle(e);this.insertEdgeEnd(e,eb);}
else{eb.insert(e);}};jsts.operation.relate.EdgeEndBundleStar.prototype.updateIM=function(im){for(var it=this.iterator();it.hasNext();){var esb=it.next();esb.updateIM(im);}};jsts.index.ArrayListVisitor=function(){this.items=[];};jsts.index.ArrayListVisitor.prototype.visitItem=function(item){this.items.push(item);};jsts.index.ArrayListVisitor.prototype.getItems=function(){return this.items;};jsts.algorithm.distance.DistanceToPoint=function(){};jsts.algorithm.distance.DistanceToPoint.computeDistance=function(geom,pt,ptDist){if(geom instanceof jsts.geom.LineString){jsts.algorithm.distance.DistanceToPoint.computeDistance2(geom,pt,ptDist);}else if(geom instanceof jsts.geom.Polygon){jsts.algorithm.distance.DistanceToPoint.computeDistance4(geom,pt,ptDist);}else if(geom instanceof jsts.geom.GeometryCollection){var gc=geom;for(var i=0;i<gc.getNumGeometries();i++){var g=gc.getGeometryN(i);jsts.algorithm.distance.DistanceToPoint.computeDistance(g,pt,ptDist);}}else{ptDist.setMinimum(geom.getCoordinate(),pt);}};jsts.algorithm.distance.DistanceToPoint.computeDistance2=function(line,pt,ptDist){var tempSegment=new jsts.geom.LineSegment();var coords=line.getCoordinates();for(var i=0;i<coords.length-1;i++){tempSegment.setCoordinates(coords[i],coords[i+1]);var closestPt=tempSegment.closestPoint(pt);ptDist.setMinimum(closestPt,pt);}};jsts.algorithm.distance.DistanceToPoint.computeDistance3=function(segment,pt,ptDist){var closestPt=segment.closestPoint(pt);ptDist.setMinimum(closestPt,pt);};jsts.algorithm.distance.DistanceToPoint.computeDistance4=function(poly,pt,ptDist){jsts.algorithm.distance.DistanceToPoint.computeDistance2(poly.getExteriorRing(),pt,ptDist);for(var i=0;i<poly.getNumInteriorRing();i++){jsts.algorithm.distance.DistanceToPoint.computeDistance2(poly.getInteriorRingN(i),pt,ptDist);}};jsts.index.strtree.ItemBoundable=function(bounds,item){this.bounds=bounds;this.item=item;};jsts.index.strtree.ItemBoundable.prototype=new jsts.index.strtree.Boundable();jsts.index.strtree.ItemBoundable.constructor=jsts.index.strtree.ItemBoundable;jsts.index.strtree.ItemBoundable.prototype.bounds=null;jsts.index.strtree.ItemBoundable.prototype.item=null;jsts.index.strtree.ItemBoundable.prototype.getBounds=function(){return this.bounds;};jsts.index.strtree.ItemBoundable.prototype.getItem=function(){return this.item;};(function(){var ArrayList=javascript.util.ArrayList;var TreeMap=javascript.util.TreeMap;jsts.geomgraph.EdgeList=function(){this.edges=new ArrayList();this.ocaMap=new TreeMap();};jsts.geomgraph.EdgeList.prototype.edges=null;jsts.geomgraph.EdgeList.prototype.ocaMap=null;jsts.geomgraph.EdgeList.prototype.add=function(e){this.edges.add(e);var oca=new jsts.noding.OrientedCoordinateArray(e.getCoordinates());this.ocaMap.put(oca,e);};jsts.geomgraph.EdgeList.prototype.addAll=function(edgeColl){for(var i=edgeColl.iterator();i.hasNext();){this.add(i.next());}};jsts.geomgraph.EdgeList.prototype.getEdges=function(){return this.edges;};jsts.geomgraph.EdgeList.prototype.findEqualEdge=function(e){var oca=new jsts.noding.OrientedCoordinateArray(e.getCoordinates());var matchEdge=this.ocaMap.get(oca);return matchEdge;};jsts.geomgraph.EdgeList.prototype.getEdges=function(){return this.edges;};jsts.geomgraph.EdgeList.prototype.iterator=function(){return this.edges.iterator();};jsts.geomgraph.EdgeList.prototype.get=function(i){return this.edges.get(i);};jsts.geomgraph.EdgeList.prototype.findEdgeIndex=function(e){for(var i=0;i<this.edges.size();i++){if(this.edges.get(i).equals(e))
return i;}
return-1;};})();jsts.operation.IsSimpleOp=function(geom){this.geom=geom;};jsts.operation.IsSimpleOp.prototype.geom=null;jsts.operation.IsSimpleOp.prototype.isClosedEndpointsInInterior=true;jsts.operation.IsSimpleOp.prototype.nonSimpleLocation=null;jsts.operation.IsSimpleOp.prototype.IsSimpleOp=function(geom){this.geom=geom;};jsts.operation.IsSimpleOp.prototype.isSimple=function(){this.nonSimpleLocation=null;if(this.geom instanceof jsts.geom.LineString){return this.isSimpleLinearGeometry(this.geom);}
if(this.geom instanceof jsts.geom.MultiLineString){return this.isSimpleLinearGeometry(this.geom);}
if(this.geom instanceof jsts.geom.MultiPoint){return this.isSimpleMultiPoint(this.geom);}
return true;};jsts.operation.IsSimpleOp.prototype.isSimpleMultiPoint=function(mp){if(mp.isEmpty())
return true;var points=[];for(var i=0;i<mp.getNumGeometries();i++){var pt=mp.getGeometryN(i);var p=pt.getCoordinate();for(var j=0;j<points.length;j++){var point=points[j];if(p.equals2D(point)){this.nonSimpleLocation=p;return false;}}
points.push(p);}
return true;};jsts.operation.IsSimpleOp.prototype.isSimpleLinearGeometry=function(geom){if(geom.isEmpty())
return true;var graph=new jsts.geomgraph.GeometryGraph(0,geom);var li=new jsts.algorithm.RobustLineIntersector();var si=graph.computeSelfNodes(li,true);if(!si.hasIntersection())
return true;if(si.hasProperIntersection()){this.nonSimpleLocation=si.getProperIntersectionPoint();return false;}
if(this.hasNonEndpointIntersection(graph))
return false;if(this.isClosedEndpointsInInterior){if(this.hasClosedEndpointIntersection(graph))
return false;}
return true;};jsts.operation.IsSimpleOp.prototype.hasNonEndpointIntersection=function(graph){for(var i=graph.getEdgeIterator();i.hasNext();){var e=i.next();var maxSegmentIndex=e.getMaximumSegmentIndex();for(var eiIt=e.getEdgeIntersectionList().iterator();eiIt.hasNext();){var ei=eiIt.next();if(!ei.isEndPoint(maxSegmentIndex)){this.nonSimpleLocation=ei.getCoordinate();return true;}}}
return false;};jsts.operation.IsSimpleOp.prototype.hasClosedEndpointIntersection=function(graph){var endPoints=new javascript.util.TreeMap();for(var i=graph.getEdgeIterator();i.hasNext();){var e=i.next();var maxSegmentIndex=e.getMaximumSegmentIndex();var isClosed=e.isClosed();var p0=e.getCoordinate(0);this.addEndpoint(endPoints,p0,isClosed);var p1=e.getCoordinate(e.getNumPoints()-1);this.addEndpoint(endPoints,p1,isClosed);}
for(var i=endPoints.values().iterator();i.hasNext();){var eiInfo=i.next();if(eiInfo.isClosed&&eiInfo.degree!=2){this.nonSimpleLocation=eiInfo.getCoordinate();return true;}}
return false;};jsts.operation.IsSimpleOp.EndpointInfo=function(pt){this.pt=pt;this.isClosed=false;this.degree=0;};jsts.operation.IsSimpleOp.EndpointInfo.prototype.pt=null;jsts.operation.IsSimpleOp.EndpointInfo.prototype.isClosed=null;jsts.operation.IsSimpleOp.EndpointInfo.prototype.degree=null;jsts.operation.IsSimpleOp.EndpointInfo.prototype.getCoordinate=function(){return this.pt;};jsts.operation.IsSimpleOp.EndpointInfo.prototype.addEndpoint=function(isClosed){this.degree++;this.isClosed=this.isClosed||isClosed;};jsts.operation.IsSimpleOp.prototype.addEndpoint=function(endPoints,p,isClosed){var eiInfo=endPoints.get(p);if(eiInfo===null){eiInfo=new jsts.operation.IsSimpleOp.EndpointInfo(p);endPoints.put(p,eiInfo);}
eiInfo.addEndpoint(isClosed);};(function(){var LineStringSnapper=function(){this.snapTolerance=0.0;this.seg=new jsts.geom.LineSegment();this.allowSnappingToSourceVertices=false;this.isClosed=false;this.srcPts=[];if(arguments[0]instanceof jsts.geom.LineString){this.initFromLine.apply(this,arguments);}else{this.initFromPoints.apply(this,arguments);}};LineStringSnapper.prototype.initFromLine=function(srcLine,snapTolerance){this.initFromPoints(srcLine.getCoordinates(),snapTolerance);};LineStringSnapper.prototype.initFromPoints=function(srcPts,snapTolerance){this.srcPts=srcPts;this.isClosed=this.calcIsClosed(srcPts);this.snapTolerance=snapTolerance;};LineStringSnapper.prototype.setAllowSnappingToSourceVertices=function(allowSnappingToSourceVertices){this.allowSnappingToSourceVertices=allowSnappingToSourceVertices;};LineStringSnapper.prototype.calcIsClosed=function(pts){if(pts.length<=1){return false;}
return pts[0].equals(pts[pts.length-1]);};LineStringSnapper.prototype.snapTo=function(snapPts){var coordList=new jsts.geom.CoordinateList(this.srcPts);this.snapVertices(coordList,snapPts);this.snapSegments(coordList,snapPts);return coordList.toCoordinateArray();};LineStringSnapper.prototype.snapVertices=function(srcCoords,snapPts){var end=this.isClosed?srcCoords.size()-1:srcCoords.size(),i=0,srcPt,snapVert;for(i;i<end;i++){srcPt=srcCoords.get(i);snapVert=this.findSnapForVertex(srcPt,snapPts);if(snapVert!==null){srcCoords.set(i,new jsts.geom.Coordinate(snapVert));if(i===0&&this.isClosed)
srcCoords.set(srcCoords.size()-1,new jsts.geom.Coordinate(snapVert));}}};LineStringSnapper.prototype.findSnapForVertex=function(pt,snapPts){var i=0,il=snapPts.length;for(i=0;i<il;i++){if(pt.equals(snapPts[i])){return null;}
if(pt.distance(snapPts[i])<this.snapTolerance){return snapPts[i];}}
return null;};LineStringSnapper.prototype.snapSegments=function(srcCoords,snapPts){if(snapPts.length===0){return;}
var distinctPtCount=snapPts.length,i,snapPt,index;if(snapPts.length>1&&snapPts[0].equals2D(snapPts[snapPts.length-1])){distinctPtCount=snapPts.length-1;}
i=0;for(i;i<distinctPtCount;i++){snapPt=snapPts[i];index=this.findSegmentIndexToSnap(snapPt,srcCoords);if(index>=0){srcCoords.add(index+1,new jsts.geom.Coordinate(snapPt),false);}}};LineStringSnapper.prototype.findSegmentIndexToSnap=function(snapPt,srcCoords){var minDist=Number.MAX_VALUE,snapIndex=-1,i=0,dist;for(i;i<srcCoords.size()-1;i++){this.seg.p0=srcCoords.get(i);this.seg.p1=srcCoords.get(i+1);if(this.seg.p0.equals(snapPt)||this.seg.p1.equals(snapPt)){if(this.allowSnappingToSourceVertices){continue;}else{return-1;}}
dist=this.seg.distance(snapPt);if(dist<this.snapTolerance&&dist<minDist){minDist=dist;snapIndex=i;}}
return snapIndex;};jsts.operation.overlay.snap.LineStringSnapper=LineStringSnapper;})();(function(){var ArrayList=javascript.util.ArrayList;var GeometryComponentFilter=jsts.geom.GeometryComponentFilter;var LineString=jsts.geom.LineString;var EdgeRing=jsts.operation.polygonize.EdgeRing;var PolygonizeGraph=jsts.operation.polygonize.PolygonizeGraph;var Polygonizer=function(){var that=this;var LineStringAdder=function(){};LineStringAdder.prototype=new GeometryComponentFilter();LineStringAdder.prototype.filter=function(g){if(g instanceof LineString)
that.add(g);};this.lineStringAdder=new LineStringAdder();this.dangles=new ArrayList();this.cutEdges=new ArrayList();this.invalidRingLines=new ArrayList();};Polygonizer.prototype.lineStringAdder=null;Polygonizer.prototype.graph=null;Polygonizer.prototype.dangles=null;Polygonizer.prototype.cutEdges=null;Polygonizer.prototype.invalidRingLines=null;Polygonizer.prototype.holeList=null;Polygonizer.prototype.shellList=null;Polygonizer.prototype.polyList=null;Polygonizer.prototype.add=function(geomList){if(geomList instanceof jsts.geom.LineString){return this.add3(geomList);}else if(geomList instanceof jsts.geom.Geometry){return this.add2(geomList);}
for(var i=geomList.iterator();i.hasNext();){var geometry=i.next();this.add2(geometry);}};Polygonizer.prototype.add2=function(g){g.apply(this.lineStringAdder);};Polygonizer.prototype.add3=function(line){if(this.graph==null)
this.graph=new PolygonizeGraph(line.getFactory());this.graph.addEdge(line);};Polygonizer.prototype.getPolygons=function(){this.polygonize();return this.polyList;};Polygonizer.prototype.getDangles=function(){this.polygonize();return this.dangles;};Polygonizer.prototype.getCutEdges=function(){this.polygonize();return this.cutEdges;};Polygonizer.prototype.getInvalidRingLines=function(){this.polygonize();return this.invalidRingLines;};Polygonizer.prototype.polygonize=function(){if(this.polyList!=null)
return;this.polyList=new ArrayList();if(this.graph==null)
return;this.dangles=this.graph.deleteDangles();this.cutEdges=this.graph.deleteCutEdges();var edgeRingList=this.graph.getEdgeRings();var validEdgeRingList=new ArrayList();this.invalidRingLines=new ArrayList();this.findValidRings(edgeRingList,validEdgeRingList,this.invalidRingLines);this.findShellsAndHoles(validEdgeRingList);Polygonizer.assignHolesToShells(this.holeList,this.shellList);this.polyList=new ArrayList();for(var i=this.shellList.iterator();i.hasNext();){var er=i.next();this.polyList.add(er.getPolygon());}};Polygonizer.prototype.findValidRings=function(edgeRingList,validEdgeRingList,invalidRingList){for(var i=edgeRingList.iterator();i.hasNext();){var er=i.next();if(er.isValid())
validEdgeRingList.add(er);else
invalidRingList.add(er.getLineString());}};Polygonizer.prototype.findShellsAndHoles=function(edgeRingList){this.holeList=new ArrayList();this.shellList=new ArrayList();for(var i=edgeRingList.iterator();i.hasNext();){var er=i.next();if(er.isHole())
this.holeList.add(er);else
this.shellList.add(er);}};Polygonizer.assignHolesToShells=function(holeList,shellList){for(var i=holeList.iterator();i.hasNext();){var holeER=i.next();Polygonizer.assignHoleToShell(holeER,shellList);}};Polygonizer.assignHoleToShell=function(holeER,shellList){var shell=EdgeRing.findEdgeRingContaining(holeER,shellList);if(shell!=null)
shell.addHole(holeER.getRing());};jsts.operation.polygonize.Polygonizer=Polygonizer;})();(function(){var ArrayList=javascript.util.ArrayList;var GeometryTransformer=function(){};GeometryTransformer.prototype.inputGeom=null;GeometryTransformer.prototype.factory=null;GeometryTransformer.prototype.pruneEmptyGeometry=true;GeometryTransformer.prototype.preserveGeometryCollectionType=true;GeometryTransformer.prototype.preserveCollections=false;GeometryTransformer.prototype.reserveType=false;GeometryTransformer.prototype.getInputGeometry=function(){return this.inputGeom;};GeometryTransformer.prototype.transform=function(inputGeom){this.inputGeom=inputGeom;this.factory=inputGeom.getFactory();if(inputGeom instanceof jsts.geom.Point)
return this.transformPoint(inputGeom,null);if(inputGeom instanceof jsts.geom.MultiPoint)
return this.transformMultiPoint(inputGeom,null);if(inputGeom instanceof jsts.geom.LinearRing)
return this.transformLinearRing(inputGeom,null);if(inputGeom instanceof jsts.geom.LineString)
return this.transformLineString(inputGeom,null);if(inputGeom instanceof jsts.geom.MultiLineString)
return this.transformMultiLineString(inputGeom,null);if(inputGeom instanceof jsts.geom.Polygon)
return this.transformPolygon(inputGeom,null);if(inputGeom instanceof jsts.geom.MultiPolygon)
return this.transformMultiPolygon(inputGeom,null);if(inputGeom instanceof jsts.geom.GeometryCollection)
return this.transformGeometryCollection(inputGeom,null);throw new jsts.error.IllegalArgumentException('Unknown Geometry subtype: '+
inputGeom.getClass().getName());};GeometryTransformer.prototype.createCoordinateSequence=function(coords){return this.factory.getCoordinateSequenceFactory().create(coords);};GeometryTransformer.prototype.copy=function(seq){return seq.clone();};GeometryTransformer.prototype.transformCoordinates=function(coords,parent){return this.copy(coords);};GeometryTransformer.prototype.transformPoint=function(geom,parent){return this.factory.createPoint(this.transformCoordinates(geom.getCoordinateSequence(),geom));};GeometryTransformer.prototype.transformMultiPoint=function(geom,parent){var transGeomList=new ArrayList();for(var i=0;i<geom.getNumGeometries();i++){var transformGeom=this.transformPoint(geom.getGeometryN(i),geom);if(transformGeom==null)
continue;if(transformGeom.isEmpty())
continue;transGeomList.add(transformGeom);}
return this.factory.buildGeometry(transGeomList);};GeometryTransformer.prototype.transformLinearRing=function(geom,parent){var seq=this.transformCoordinates(geom.getCoordinateSequence(),geom);var seqSize=seq.length;if(seqSize>0&&seqSize<4&&!this.preserveType)
return this.factory.createLineString(seq);return this.factory.createLinearRing(seq);};GeometryTransformer.prototype.transformLineString=function(geom,parent){return this.factory.createLineString(this.transformCoordinates(geom.getCoordinateSequence(),geom));};GeometryTransformer.prototype.transformMultiLineString=function(geom,parent){var transGeomList=new ArrayList();for(var i=0;i<geom.getNumGeometries();i++){var transformGeom=this.transformLineString(geom.getGeometryN(i),geom);if(transformGeom==null)
continue;if(transformGeom.isEmpty())
continue;transGeomList.add(transformGeom);}
return this.factory.buildGeometry(transGeomList);};GeometryTransformer.prototype.transformPolygon=function(geom,parent){var isAllValidLinearRings=true;var shell=this.transformLinearRing(geom.getExteriorRing(),geom);if(shell==null||!(shell instanceof jsts.geom.LinearRing)||shell.isEmpty())
isAllValidLinearRings=false;var holes=new ArrayList();for(var i=0;i<geom.getNumInteriorRing();i++){var hole=this.transformLinearRing(geom.getInteriorRingN(i),geom);if(hole==null||hole.isEmpty()){continue;}
if(!(hole instanceof jsts.geom.LinearRing))
isAllValidLinearRings=false;holes.add(hole);}
if(isAllValidLinearRings)
return this.factory.createPolygon(shell,holes.toArray());else{var components=new ArrayList();if(shell!=null)
components.add(shell);components.addAll(holes);return this.factory.buildGeometry(components);}};GeometryTransformer.prototype.transformMultiPolygon=function(geom,parent){var transGeomList=new ArrayList();for(var i=0;i<geom.getNumGeometries();i++){var transformGeom=this.transformPolygon(geom.getGeometryN(i),geom);if(transformGeom==null)
continue;if(transformGeom.isEmpty())
continue;transGeomList.add(transformGeom);}
return this.factory.buildGeometry(transGeomList);};GeometryTransformer.prototype.transformGeometryCollection=function(geom,parent){var transGeomList=new ArrayList();for(var i=0;i<geom.getNumGeometries();i++){var transformGeom=this.transform(geom.getGeometryN(i));if(transformGeom==null)
continue;if(this.pruneEmptyGeometry&&transformGeom.isEmpty())
continue;transGeomList.add(transformGeom);}
if(this.preserveGeometryCollectionType)
return this.factory.createGeometryCollection(GeometryFactory.toGeometryArray(transGeomList));return this.factory.buildGeometry(transGeomList);};jsts.geom.util.GeometryTransformer=GeometryTransformer;})();(function(){var LineStringSnapper=jsts.operation.overlay.snap.LineStringSnapper;var PrecisionModel=jsts.geom.PrecisionModel;var TreeSet=javascript.util.TreeSet;var SnapTransformer=function(snapTolerance,snapPts,isSelfSnap){this.snapTolerance=snapTolerance;this.snapPts=snapPts;this.isSelfSnap=isSelfSnap||false;};SnapTransformer.prototype=new jsts.geom.util.GeometryTransformer();SnapTransformer.prototype.snapTolerance=null;SnapTransformer.prototype.snapPts=null;SnapTransformer.prototype.isSelfSnap=false;SnapTransformer.prototype.transformCoordinates=function(coords,parent){var srcPts=coords;var newPts=this.snapLine(srcPts,this.snapPts);return newPts;};SnapTransformer.prototype.snapLine=function(srcPts,snapPts){var snapper=new LineStringSnapper(srcPts,this.snapTolerance);snapper.setAllowSnappingToSourceVertices(this.isSelfSnap);return snapper.snapTo(snapPts);};var GeometrySnapper=function(srcGeom){this.srcGeom=srcGeom;};GeometrySnapper.SNAP_PRECISION_FACTOR=1e-9;GeometrySnapper.computeOverlaySnapTolerance=function(g){if(arguments.length===2){return GeometrySnapper.computeOverlaySnapTolerance2.apply(this,arguments);}
var snapTolerance=this.computeSizeBasedSnapTolerance(g);var pm=g.getPrecisionModel();if(pm.getType()==PrecisionModel.FIXED){var fixedSnapTol=(1/pm.getScale())*2/1.415;if(fixedSnapTol>snapTolerance)
snapTolerance=fixedSnapTol;}
return snapTolerance;};GeometrySnapper.computeSizeBasedSnapTolerance=function(g){var env=g.getEnvelopeInternal();var minDimension=Math.min(env.getHeight(),env.getWidth());var snapTol=minDimension*GeometrySnapper.SNAP_PRECISION_FACTOR;return snapTol;};GeometrySnapper.computeOverlaySnapTolerance2=function(g0,g1){return Math.min(this.computeOverlaySnapTolerance(g0),this.computeOverlaySnapTolerance(g1));};GeometrySnapper.snap=function(g0,g1,snapTolerance){var snapGeom=[];var snapper0=new GeometrySnapper(g0);snapGeom[0]=snapper0.snapTo(g1,snapTolerance);var snapper1=new GeometrySnapper(g1);snapGeom[1]=snapper1.snapTo(snapGeom[0],snapTolerance);return snapGeom;};GeometrySnapper.snapToSelf=function(g0,snapTolerance,cleanResult){var snapper0=new GeometrySnapper(g0);return snapper0.snapToSelf(snapTolerance,cleanResult);};GeometrySnapper.prototype.srcGeom=null;GeometrySnapper.prototype.snapTo=function(snapGeom,snapTolerance){var snapPts=this.extractTargetCoordinates(snapGeom);var snapTrans=new SnapTransformer(snapTolerance,snapPts);return snapTrans.transform(this.srcGeom);};GeometrySnapper.prototype.snapToSelf=function(snapTolerance,cleanResult){var snapPts=this.extractTargetCoordinates(srcGeom);var snapTrans=new SnapTransformer(snapTolerance,snapPts,true);var snappedGeom=snapTrans.transform(srcGeom);var result=snappedGeom;if(cleanResult&&result instanceof Polygonal){result=snappedGeom.buffer(0);}
return result;};GeometrySnapper.prototype.extractTargetCoordinates=function(g){var ptSet=new TreeSet();var pts=g.getCoordinates();for(var i=0;i<pts.length;i++){ptSet.add(pts[i]);}
return ptSet.toArray();};GeometrySnapper.prototype.computeSnapTolerance=function(ringPts){var minSegLen=this.computeMinimumSegmentLength(ringPts);var snapTol=minSegLen/10;return snapTol;};GeometrySnapper.prototype.computeMinimumSegmentLength=function(pts){var minSegLen=Number.MAX_VALUE;for(var i=0;i<pts.length-1;i++){var segLen=pts[i].distance(pts[i+1]);if(segLen<minSegLen)
minSegLen=segLen;}
return minSegLen;};jsts.operation.overlay.snap.GeometrySnapper=GeometrySnapper;})();jsts.algorithm.PointLocator=function(boundaryRule){this.boundaryRule=boundaryRule?boundaryRule:jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;};jsts.algorithm.PointLocator.prototype.boundaryRule=null;jsts.algorithm.PointLocator.prototype.isIn=null;jsts.algorithm.PointLocator.prototype.numBoundaries=null;jsts.algorithm.PointLocator.prototype.intersects=function(p,geom){return this.locate(p,geom)!==jsts.geom.Location.EXTERIOR;};jsts.algorithm.PointLocator.prototype.locate=function(p,geom){if(geom.isEmpty())
return jsts.geom.Location.EXTERIOR;if(geom instanceof jsts.geom.Point){return this.locate2(p,geom);}else if(geom instanceof jsts.geom.LineString){return this.locate3(p,geom);}else if(geom instanceof jsts.geom.Polygon){return this.locate4(p,geom);}
this.isIn=false;this.numBoundaries=0;this.computeLocation(p,geom);if(this.boundaryRule.isInBoundary(this.numBoundaries))
return jsts.geom.Location.BOUNDARY;if(this.numBoundaries>0||this.isIn)
return jsts.geom.Location.INTERIOR;return jsts.geom.Location.EXTERIOR;};jsts.algorithm.PointLocator.prototype.computeLocation=function(p,geom){if(geom instanceof jsts.geom.Point||geom instanceof jsts.geom.LineString||geom instanceof jsts.geom.Polygon){this.updateLocationInfo(this.locate(p,geom));}else if(geom instanceof jsts.geom.MultiLineString){var ml=geom;for(var i=0;i<ml.getNumGeometries();i++){var l=ml.getGeometryN(i);this.updateLocationInfo(this.locate(p,l));}}else if(geom instanceof jsts.geom.MultiPolygon){var mpoly=geom;for(var i=0;i<mpoly.getNumGeometries();i++){var poly=mpoly.getGeometryN(i);this.updateLocationInfo(this.locate(p,poly));}}else if(geom instanceof jsts.geom.MultiPoint||geom instanceof jsts.geom.GeometryCollection){for(var i=0;i<geom.getNumGeometries();i++){var part=geom.getGeometryN(i);if(part!==geom){this.computeLocation(p,part);}}}};jsts.algorithm.PointLocator.prototype.updateLocationInfo=function(loc){if(loc===jsts.geom.Location.INTERIOR)
this.isIn=true;if(loc===jsts.geom.Location.BOUNDARY)
this.numBoundaries++;};jsts.algorithm.PointLocator.prototype.locate2=function(p,pt){var ptCoord=pt.getCoordinate();if(ptCoord.equals2D(p))
return jsts.geom.Location.INTERIOR;return jsts.geom.Location.EXTERIOR;};jsts.algorithm.PointLocator.prototype.locate3=function(p,l){if(!l.getEnvelopeInternal().intersects(p))
return jsts.geom.Location.EXTERIOR;var pt=l.getCoordinates();if(!l.isClosed()){if(p.equals(pt[0])||p.equals(pt[pt.length-1])){return jsts.geom.Location.BOUNDARY;}}
if(jsts.algorithm.CGAlgorithms.isOnLine(p,pt))
return jsts.geom.Location.INTERIOR;return jsts.geom.Location.EXTERIOR;};jsts.algorithm.PointLocator.prototype.locateInPolygonRing=function(p,ring){if(!ring.getEnvelopeInternal().intersects(p))
return jsts.geom.Location.EXTERIOR;return jsts.algorithm.CGAlgorithms.locatePointInRing(p,ring.getCoordinates());};jsts.algorithm.PointLocator.prototype.locate4=function(p,poly){if(poly.isEmpty())
return jsts.geom.Location.EXTERIOR;var shell=poly.getExteriorRing();var shellLoc=this.locateInPolygonRing(p,shell);if(shellLoc===jsts.geom.Location.EXTERIOR)
return jsts.geom.Location.EXTERIOR;if(shellLoc===jsts.geom.Location.BOUNDARY)
return jsts.geom.Location.BOUNDARY;for(var i=0;i<poly.getNumInteriorRing();i++){var hole=poly.getInteriorRingN(i);var holeLoc=this.locateInPolygonRing(p,hole);if(holeLoc===jsts.geom.Location.INTERIOR)
return jsts.geom.Location.EXTERIOR;if(holeLoc===jsts.geom.Location.BOUNDARY)
return jsts.geom.Location.BOUNDARY;}
return jsts.geom.Location.INTERIOR;};(function(){var Location=jsts.geom.Location;var ArrayList=javascript.util.ArrayList;var TreeMap=javascript.util.TreeMap;jsts.geomgraph.NodeMap=function(nodeFactory){this.nodeMap=new TreeMap();this.nodeFact=nodeFactory;};jsts.geomgraph.NodeMap.prototype.nodeMap=null;jsts.geomgraph.NodeMap.prototype.nodeFact=null;jsts.geomgraph.NodeMap.prototype.addNode=function(arg){var node,coord;if(arg instanceof jsts.geom.Coordinate){coord=arg;node=this.nodeMap.get(coord);if(node===null){node=this.nodeFact.createNode(coord);this.nodeMap.put(coord,node);}
return node;}else if(arg instanceof jsts.geomgraph.Node){var n=arg;coord=n.getCoordinate();node=this.nodeMap.get(coord);if(node===null){this.nodeMap.put(coord,n);return n;}
node.mergeLabel(n);return node;}};jsts.geomgraph.NodeMap.prototype.add=function(e){var p=e.getCoordinate();var n=this.addNode(p);n.add(e);};jsts.geomgraph.NodeMap.prototype.find=function(coord){return this.nodeMap.get(coord);};jsts.geomgraph.NodeMap.prototype.values=function(){return this.nodeMap.values();};jsts.geomgraph.NodeMap.prototype.iterator=function(){return this.values().iterator();};jsts.geomgraph.NodeMap.prototype.getBoundaryNodes=function(geomIndex){var bdyNodes=new ArrayList();for(var i=this.iterator();i.hasNext();){var node=i.next();if(node.getLabel().getLocation(geomIndex)===Location.BOUNDARY){bdyNodes.add(node);}}
return bdyNodes;};})();(function(){var ArrayList=javascript.util.ArrayList;jsts.geomgraph.PlanarGraph=function(nodeFactory){this.edges=new ArrayList();this.edgeEndList=new ArrayList();this.nodes=new jsts.geomgraph.NodeMap(nodeFactory||new jsts.geomgraph.NodeFactory());};jsts.geomgraph.PlanarGraph.prototype.edges=null;jsts.geomgraph.PlanarGraph.prototype.nodes=null;jsts.geomgraph.PlanarGraph.prototype.edgeEndList=null;jsts.geomgraph.PlanarGraph.linkResultDirectedEdges=function(nodes){for(var nodeit=nodes.iterator();nodeit.hasNext();){var node=nodeit.next();node.getEdges().linkResultDirectedEdges();}};jsts.geomgraph.PlanarGraph.prototype.getEdgeIterator=function(){return this.edges.iterator();};jsts.geomgraph.PlanarGraph.prototype.getEdgeEnds=function(){return this.edgeEndList;};jsts.geomgraph.PlanarGraph.prototype.isBoundaryNode=function(geomIndex,coord){var node=this.nodes.find(coord);if(node===null)
return false;var label=node.getLabel();if(label!==null&&label.getLocation(geomIndex)===jsts.geom.Location.BOUNDARY)
return true;return false;};jsts.geomgraph.PlanarGraph.prototype.insertEdge=function(e){this.edges.add(e);};jsts.geomgraph.PlanarGraph.prototype.add=function(e){this.nodes.add(e);this.edgeEndList.add(e);};jsts.geomgraph.PlanarGraph.prototype.getNodeIterator=function(){return this.nodes.iterator();};jsts.geomgraph.PlanarGraph.prototype.getNodes=function(){return this.nodes.values();};jsts.geomgraph.PlanarGraph.prototype.addNode=function(node){return this.nodes.addNode(node);};jsts.geomgraph.PlanarGraph.prototype.addEdges=function(edgesToAdd){for(var it=edgesToAdd.iterator();it.hasNext();){var e=it.next();this.edges.add(e);var de1=new jsts.geomgraph.DirectedEdge(e,true);var de2=new jsts.geomgraph.DirectedEdge(e,false);de1.setSym(de2);de2.setSym(de1);this.add(de1);this.add(de2);}};jsts.geomgraph.PlanarGraph.prototype.linkResultDirectedEdges=function(){for(var nodeit=this.nodes.iterator();nodeit.hasNext();){var node=nodeit.next();node.getEdges().linkResultDirectedEdges();}};jsts.geomgraph.PlanarGraph.prototype.findEdgeInSameDirection=function(p0,p1){var i=0,il=this.edges.size(),e,eCoord;for(i;i<il;i++){e=this.edges.get(i);eCoord=e.getCoordinates();if(this.matchInSameDirection(p0,p1,eCoord[0],eCoord[1])){return e;}
if(this.matchInSameDirection(p0,p1,eCoord[eCoord.length-1],eCoord[eCoord.length-2])){return e;}}
return null;};jsts.geomgraph.PlanarGraph.prototype.matchInSameDirection=function(p0,p1,ep0,ep1){if(!p0.equals(ep0)){return false;}
if(jsts.algorithm.CGAlgorithms.computeOrientation(p0,p1,ep1)===jsts.algorithm.CGAlgorithms.COLLINEAR&&jsts.geomgraph.Quadrant.quadrant(p0,p1)===jsts.geomgraph.Quadrant.quadrant(ep0,ep1)){return true;}
return false;};jsts.geomgraph.PlanarGraph.prototype.findEdgeEnd=function(e){for(var i=this.getEdgeEnds().iterator();i.hasNext();){var ee=i.next();if(ee.getEdge()===e){return ee;}}
return null;};})();jsts.noding.SegmentIntersector=function(){};jsts.noding.SegmentIntersector.prototype.processIntersections=jsts.abstractFunc;jsts.noding.SegmentIntersector.prototype.isDone=jsts.abstractFunc;(function(){var SegmentIntersector=jsts.noding.SegmentIntersector;var ArrayList=javascript.util.ArrayList;jsts.noding.InteriorIntersectionFinder=function(li){this.li=li;this.intersections=new ArrayList();this.interiorIntersection=null;};jsts.noding.InteriorIntersectionFinder.prototype=new SegmentIntersector();jsts.noding.InteriorIntersectionFinder.constructor=jsts.noding.InteriorIntersectionFinder;jsts.noding.InteriorIntersectionFinder.prototype.findAllIntersections=false;jsts.noding.InteriorIntersectionFinder.prototype.isCheckEndSegmentsOnly=false;jsts.noding.InteriorIntersectionFinder.prototype.li=null;jsts.noding.InteriorIntersectionFinder.prototype.interiorIntersection=null;jsts.noding.InteriorIntersectionFinder.prototype.intSegments=null;jsts.noding.InteriorIntersectionFinder.prototype.intersections=null;jsts.noding.InteriorIntersectionFinder.prototype.setFindAllIntersections=function(findAllIntersections){this.findAllIntersections=findAllIntersections;};jsts.noding.InteriorIntersectionFinder.prototype.getIntersections=function(){return intersections;};jsts.noding.InteriorIntersectionFinder.prototype.setCheckEndSegmentsOnly=function(isCheckEndSegmentsOnly){this.isCheckEndSegmentsOnly=isCheckEndSegmentsOnly;}
jsts.noding.InteriorIntersectionFinder.prototype.hasIntersection=function(){return this.interiorIntersection!=null;};jsts.noding.InteriorIntersectionFinder.prototype.getInteriorIntersection=function(){return this.interiorIntersection;};jsts.noding.InteriorIntersectionFinder.prototype.getIntersectionSegments=function(){return this.intSegments;};jsts.noding.InteriorIntersectionFinder.prototype.processIntersections=function(e0,segIndex0,e1,segIndex1){if(this.hasIntersection())
return;if(e0==e1&&segIndex0==segIndex1)
return;if(this.isCheckEndSegmentsOnly){var isEndSegPresent=this.isEndSegment(e0,segIndex0)||isEndSegment(e1,segIndex1);if(!isEndSegPresent)
return;}
var p00=e0.getCoordinates()[segIndex0];var p01=e0.getCoordinates()[segIndex0+1];var p10=e1.getCoordinates()[segIndex1];var p11=e1.getCoordinates()[segIndex1+1];this.li.computeIntersection(p00,p01,p10,p11);if(this.li.hasIntersection()){if(this.li.isInteriorIntersection()){this.intSegments=[];this.intSegments[0]=p00;this.intSegments[1]=p01;this.intSegments[2]=p10;this.intSegments[3]=p11;this.interiorIntersection=this.li.getIntersection(0);this.intersections.add(this.interiorIntersection);}}};jsts.noding.InteriorIntersectionFinder.prototype.isEndSegment=function(segStr,index){if(index==0)
return true;if(index>=segStr.size()-2)
return true;return false;};jsts.noding.InteriorIntersectionFinder.prototype.isDone=function(){if(this.findAllIntersections)
return false;return this.interiorIntersection!=null;};})();(function(){var RobustLineIntersector=jsts.algorithm.RobustLineIntersector;var InteriorIntersectionFinder=jsts.noding.InteriorIntersectionFinder;var MCIndexNoder=jsts.noding.MCIndexNoder;jsts.noding.FastNodingValidator=function(segStrings){this.li=new RobustLineIntersector();this.segStrings=segStrings;};jsts.noding.FastNodingValidator.prototype.li=null;jsts.noding.FastNodingValidator.prototype.segStrings=null;jsts.noding.FastNodingValidator.prototype.findAllIntersections=false;jsts.noding.FastNodingValidator.prototype.segInt=null;jsts.noding.FastNodingValidator.prototype._isValid=true;jsts.noding.FastNodingValidator.prototype.setFindAllIntersections=function(findAllIntersections){this.findAllIntersections=findAllIntersections;};jsts.noding.FastNodingValidator.prototype.getIntersections=function(){return segInt.getIntersections();};jsts.noding.FastNodingValidator.prototype.isValid=function(){this.execute();return this._isValid;};jsts.noding.FastNodingValidator.prototype.getErrorMessage=function(){if(this._isValid)
return'no intersections found';var intSegs=this.segInt.getIntersectionSegments();return'found non-noded intersection between '+
jsts.io.WKTWriter.toLineString(intSegs[0],intSegs[1])+' and '+
jsts.io.WKTWriter.toLineString(intSegs[2],intSegs[3]);};jsts.noding.FastNodingValidator.prototype.checkValid=function(){this.execute();if(!this._isValid)
throw new jsts.error.TopologyError(this.getErrorMessage(),this.segInt.getInteriorIntersection());};jsts.noding.FastNodingValidator.prototype.execute=function(){if(this.segInt!=null)
return;this.checkInteriorIntersections();};jsts.noding.FastNodingValidator.prototype.checkInteriorIntersections=function(){this._isValid=true;this.segInt=new InteriorIntersectionFinder(this.li);this.segInt.setFindAllIntersections(this.findAllIntersections);var noder=new MCIndexNoder();noder.setSegmentIntersector(this.segInt);noder.computeNodes(this.segStrings);if(this.segInt.hasIntersection()){this._isValid=false;return;}};})();(function(){jsts.noding.BasicSegmentString=function(pts,data){this.pts=pts;this.data=data;};jsts.noding.BasicSegmentString.prototype=new jsts.noding.SegmentString();jsts.noding.BasicSegmentString.prototype.pts=null;jsts.noding.BasicSegmentString.prototype.data=null;jsts.noding.BasicSegmentString.prototype.getData=function(){return this.data;}
jsts.noding.BasicSegmentString.prototype.setData=function(data){this.data=data;};jsts.noding.BasicSegmentString.prototype.size=function(){return this.pts.length;};jsts.noding.BasicSegmentString.prototype.getCoordinate=function(i){return this.pts[i];};jsts.noding.BasicSegmentString.prototype.getCoordinates=function(){return this.pts;};jsts.noding.BasicSegmentString.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1]);};jsts.noding.BasicSegmentString.prototype.getSegmentOctant=function(index){if(index==this.pts.length-1)
return-1;return jsts.noding.Octant.octant(this.getCoordinate(index),this.getCoordinate(index+1));};})();(function(){var FastNodingValidator=jsts.noding.FastNodingValidator;var BasicSegmentString=jsts.noding.BasicSegmentString;var ArrayList=javascript.util.ArrayList;jsts.geomgraph.EdgeNodingValidator=function(edges){this.nv=new FastNodingValidator(jsts.geomgraph.EdgeNodingValidator.toSegmentStrings(edges));};jsts.geomgraph.EdgeNodingValidator.checkValid=function(edges){var validator=new jsts.geomgraph.EdgeNodingValidator(edges);validator.checkValid();};jsts.geomgraph.EdgeNodingValidator.toSegmentStrings=function(edges){var segStrings=new ArrayList();for(var i=edges.iterator();i.hasNext();){var e=i.next();segStrings.add(new BasicSegmentString(e.getCoordinates(),e));}
return segStrings;};jsts.geomgraph.EdgeNodingValidator.prototype.nv=null;jsts.geomgraph.EdgeNodingValidator.prototype.checkValid=function(){this.nv.checkValid();};})();jsts.operation.GeometryGraphOperation=function(g0,g1,boundaryNodeRule){this.li=new jsts.algorithm.RobustLineIntersector();this.arg=[];if(g0===undefined){return;}
if(g1===undefined){this.setComputationPrecision(g0.getPrecisionModel());this.arg[0]=new jsts.geomgraph.GeometryGraph(0,g0);return;}
boundaryNodeRule=boundaryNodeRule||jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;if(g0.getPrecisionModel().compareTo(g1.getPrecisionModel())>=0)
this.setComputationPrecision(g0.getPrecisionModel());else
this.setComputationPrecision(g1.getPrecisionModel());this.arg[0]=new jsts.geomgraph.GeometryGraph(0,g0,boundaryNodeRule);this.arg[1]=new jsts.geomgraph.GeometryGraph(1,g1,boundaryNodeRule);};jsts.operation.GeometryGraphOperation.prototype.li=null;jsts.operation.GeometryGraphOperation.prototype.resultPrecisionModel=null;jsts.operation.GeometryGraphOperation.prototype.arg=null;jsts.operation.GeometryGraphOperation.prototype.getArgGeometry=function(i){return arg[i].getGeometry();};jsts.operation.GeometryGraphOperation.prototype.setComputationPrecision=function(pm){this.resultPrecisionModel=pm;this.li.setPrecisionModel(this.resultPrecisionModel);};jsts.operation.overlay.OverlayNodeFactory=function(){};jsts.operation.overlay.OverlayNodeFactory.prototype=new jsts.geomgraph.NodeFactory();jsts.operation.overlay.OverlayNodeFactory.constructor=jsts.operation.overlay.OverlayNodeFactory;jsts.operation.overlay.OverlayNodeFactory.prototype.createNode=function(coord){return new jsts.geomgraph.Node(coord,new jsts.geomgraph.DirectedEdgeStar());};jsts.operation.overlay.PolygonBuilder=function(geometryFactory){this.shellList=[];this.geometryFactory=geometryFactory;};jsts.operation.overlay.PolygonBuilder.prototype.geometryFactory=null;jsts.operation.overlay.PolygonBuilder.prototype.shellList=null;jsts.operation.overlay.PolygonBuilder.prototype.add=function(graph){if(arguments.length===2){this.add2.apply(this,arguments);return;}
this.add2(graph.getEdgeEnds(),graph.getNodes());};jsts.operation.overlay.PolygonBuilder.prototype.add2=function(dirEdges,nodes){jsts.geomgraph.PlanarGraph.linkResultDirectedEdges(nodes);var maxEdgeRings=this.buildMaximalEdgeRings(dirEdges);var freeHoleList=[];var edgeRings=this.buildMinimalEdgeRings(maxEdgeRings,this.shellList,freeHoleList);this.sortShellsAndHoles(edgeRings,this.shellList,freeHoleList);this.placeFreeHoles(this.shellList,freeHoleList);};jsts.operation.overlay.PolygonBuilder.prototype.getPolygons=function(){var resultPolyList=this.computePolygons(this.shellList);return resultPolyList;};jsts.operation.overlay.PolygonBuilder.prototype.buildMaximalEdgeRings=function(dirEdges){var maxEdgeRings=[];for(var it=dirEdges.iterator();it.hasNext();){var de=it.next();if(de.isInResult()&&de.getLabel().isArea()){if(de.getEdgeRing()==null){var er=new jsts.operation.overlay.MaximalEdgeRing(de,this.geometryFactory);maxEdgeRings.push(er);er.setInResult();}}}
return maxEdgeRings;};jsts.operation.overlay.PolygonBuilder.prototype.buildMinimalEdgeRings=function(maxEdgeRings,shellList,freeHoleList){var edgeRings=[];for(var i=0;i<maxEdgeRings.length;i++){var er=maxEdgeRings[i];if(er.getMaxNodeDegree()>2){er.linkDirectedEdgesForMinimalEdgeRings();var minEdgeRings=er.buildMinimalRings();var shell=this.findShell(minEdgeRings);if(shell!==null){this.placePolygonHoles(shell,minEdgeRings);shellList.push(shell);}else{freeHoleList=freeHoleList.concat(minEdgeRings);}}else{edgeRings.push(er);}}
return edgeRings;};jsts.operation.overlay.PolygonBuilder.prototype.findShell=function(minEdgeRings){var shellCount=0;var shell=null;for(var i=0;i<minEdgeRings.length;i++){var er=minEdgeRings[i];if(!er.isHole()){shell=er;shellCount++;}}
jsts.util.Assert.isTrue(shellCount<=1,'found two shells in MinimalEdgeRing list');return shell;};jsts.operation.overlay.PolygonBuilder.prototype.placePolygonHoles=function(shell,minEdgeRings){for(var i=0;i<minEdgeRings.length;i++){var er=minEdgeRings[i];if(er.isHole()){er.setShell(shell);}}};jsts.operation.overlay.PolygonBuilder.prototype.sortShellsAndHoles=function(edgeRings,shellList,freeHoleList){for(var i=0;i<edgeRings.length;i++){var er=edgeRings[i];if(er.isHole()){freeHoleList.push(er);}else{shellList.push(er);}}};jsts.operation.overlay.PolygonBuilder.prototype.placeFreeHoles=function(shellList,freeHoleList){for(var i=0;i<freeHoleList.length;i++){var hole=freeHoleList[i];if(hole.getShell()==null){var shell=this.findEdgeRingContaining(hole,shellList);if(shell===null)
throw new jsts.error.TopologyError('unable to assign hole to a shell',hole.getCoordinate(0));hole.setShell(shell);}}};jsts.operation.overlay.PolygonBuilder.prototype.findEdgeRingContaining=function(testEr,shellList){var testRing=testEr.getLinearRing();var testEnv=testRing.getEnvelopeInternal();var testPt=testRing.getCoordinateN(0);var minShell=null;var minEnv=null;for(var i=0;i<shellList.length;i++){var tryShell=shellList[i];var tryRing=tryShell.getLinearRing();var tryEnv=tryRing.getEnvelopeInternal();if(minShell!==null)
minEnv=minShell.getLinearRing().getEnvelopeInternal();var isContained=false;if(tryEnv.contains(testEnv)&&jsts.algorithm.CGAlgorithms.isPointInRing(testPt,tryRing.getCoordinates()))
isContained=true;if(isContained){if(minShell==null||minEnv.contains(tryEnv)){minShell=tryShell;}}}
return minShell;};jsts.operation.overlay.PolygonBuilder.prototype.computePolygons=function(shellList){var resultPolyList=new javascript.util.ArrayList();for(var i=0;i<shellList.length;i++){var er=shellList[i];var poly=er.toPolygon(this.geometryFactory);resultPolyList.add(poly);}
return resultPolyList;};jsts.operation.overlay.PolygonBuilder.prototype.containsPoint=function(p){for(var i=0;i<this.shellList.length;i++){var er=this.shellList[i];if(er.containsPoint(p))
return true;}
return false;};(function(){var Assert=jsts.util.Assert;var ArrayList=javascript.util.ArrayList;var LineBuilder=function(op,geometryFactory,ptLocator){this.lineEdgesList=new ArrayList();this.resultLineList=new ArrayList();this.op=op;this.geometryFactory=geometryFactory;this.ptLocator=ptLocator;};LineBuilder.prototype.op=null;LineBuilder.prototype.geometryFactory=null;LineBuilder.prototype.ptLocator=null;LineBuilder.prototype.lineEdgesList=null;LineBuilder.prototype.resultLineList=null;LineBuilder.prototype.build=function(opCode){this.findCoveredLineEdges();this.collectLines(opCode);this.buildLines(opCode);return this.resultLineList;};LineBuilder.prototype.findCoveredLineEdges=function(){for(var nodeit=this.op.getGraph().getNodes().iterator();nodeit.hasNext();){var node=nodeit.next();node.getEdges().findCoveredLineEdges();}
for(var it=this.op.getGraph().getEdgeEnds().iterator();it.hasNext();){var de=it.next();var e=de.getEdge();if(de.isLineEdge()&&!e.isCoveredSet()){var isCovered=this.op.isCoveredByA(de.getCoordinate());e.setCovered(isCovered);}}};LineBuilder.prototype.collectLines=function(opCode){for(var it=this.op.getGraph().getEdgeEnds().iterator();it.hasNext();){var de=it.next();this.collectLineEdge(de,opCode,this.lineEdgesList);this.collectBoundaryTouchEdge(de,opCode,this.lineEdgesList);}};LineBuilder.prototype.collectLineEdge=function(de,opCode,edges){var label=de.getLabel();var e=de.getEdge();if(de.isLineEdge()){if(!de.isVisited()&&jsts.operation.overlay.OverlayOp.isResultOfOp(label,opCode)&&!e.isCovered()){edges.add(e);de.setVisitedEdge(true);}}};LineBuilder.prototype.collectBoundaryTouchEdge=function(de,opCode,edges){var label=de.getLabel();if(de.isLineEdge())
return;if(de.isVisited())
return;if(de.isInteriorAreaEdge())
return;if(de.getEdge().isInResult())
return;Assert.isTrue(!(de.isInResult()||de.getSym().isInResult())||!de.getEdge().isInResult());if(jsts.operation.overlay.OverlayOp.isResultOfOp(label,opCode)&&opCode===jsts.operation.overlay.OverlayOp.INTERSECTION){edges.add(de.getEdge());de.setVisitedEdge(true);}};LineBuilder.prototype.buildLines=function(opCode){for(var it=this.lineEdgesList.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();var line=this.geometryFactory.createLineString(e.getCoordinates());this.resultLineList.add(line);e.setInResult(true);}};LineBuilder.prototype.labelIsolatedLines=function(edgesList){for(var it=edgesList.iterator();it.hasNext();){var e=it.next();var label=e.getLabel();if(e.isIsolated()){if(label.isNull(0))
this.labelIsolatedLine(e,0);else
this.labelIsolatedLine(e,1);}}};LineBuilder.prototype.labelIsolatedLine=function(e,targetIndex){var loc=ptLocator.locate(e.getCoordinate(),op.getArgGeometry(targetIndex));e.getLabel().setLocation(targetIndex,loc);};jsts.operation.overlay.LineBuilder=LineBuilder;})();(function(){var ArrayList=javascript.util.ArrayList;var PointBuilder=function(op,geometryFactory,ptLocator){this.resultPointList=new ArrayList();this.op=op;this.geometryFactory=geometryFactory;};PointBuilder.prototype.op=null;PointBuilder.prototype.geometryFactory=null;PointBuilder.prototype.resultPointList=null;PointBuilder.prototype.build=function(opCode){this.extractNonCoveredResultNodes(opCode);return this.resultPointList;};PointBuilder.prototype.extractNonCoveredResultNodes=function(opCode){for(var nodeit=this.op.getGraph().getNodes().iterator();nodeit.hasNext();){var n=nodeit.next();if(n.isInResult())
continue;if(n.isIncidentEdgeInResult())
continue;if(n.getEdges().getDegree()===0||opCode===jsts.operation.overlay.OverlayOp.INTERSECTION){var label=n.getLabel();if(jsts.operation.overlay.OverlayOp.isResultOfOp(label,opCode)){this.filterCoveredNodeToPoint(n);}}}};PointBuilder.prototype.filterCoveredNodeToPoint=function(n){var coord=n.getCoordinate();if(!this.op.isCoveredByLA(coord)){var pt=this.geometryFactory.createPoint(coord);this.resultPointList.add(pt);}};jsts.operation.overlay.PointBuilder=PointBuilder;})();(function(){var PointLocator=jsts.algorithm.PointLocator;var Location=jsts.geom.Location;var EdgeList=jsts.geomgraph.EdgeList;var Label=jsts.geomgraph.Label;var PlanarGraph=jsts.geomgraph.PlanarGraph;var Position=jsts.geomgraph.Position;var EdgeNodingValidator=jsts.geomgraph.EdgeNodingValidator;var GeometryGraphOperation=jsts.operation.GeometryGraphOperation;var OverlayNodeFactory=jsts.operation.overlay.OverlayNodeFactory;var PolygonBuilder=jsts.operation.overlay.PolygonBuilder;var LineBuilder=jsts.operation.overlay.LineBuilder;var PointBuilder=jsts.operation.overlay.PointBuilder;var Assert=jsts.util.Assert;var ArrayList=javascript.util.ArrayList;jsts.operation.overlay.OverlayOp=function(g0,g1){this.ptLocator=new PointLocator();this.edgeList=new EdgeList();this.resultPolyList=new ArrayList();this.resultLineList=new ArrayList();this.resultPointList=new ArrayList();GeometryGraphOperation.call(this,g0,g1);this.graph=new PlanarGraph(new OverlayNodeFactory());this.geomFact=g0.getFactory();};jsts.operation.overlay.OverlayOp.prototype=new GeometryGraphOperation();jsts.operation.overlay.OverlayOp.constructor=jsts.operation.overlay.OverlayOp;jsts.operation.overlay.OverlayOp.INTERSECTION=1;jsts.operation.overlay.OverlayOp.UNION=2;jsts.operation.overlay.OverlayOp.DIFFERENCE=3;jsts.operation.overlay.OverlayOp.SYMDIFFERENCE=4;jsts.operation.overlay.OverlayOp.overlayOp=function(geom0,geom1,opCode){var gov=new jsts.operation.overlay.OverlayOp(geom0,geom1);var geomOv=gov.getResultGeometry(opCode);return geomOv;}
jsts.operation.overlay.OverlayOp.isResultOfOp=function(label,opCode){if(arguments.length===3){return jsts.operation.overlay.OverlayOp.isResultOfOp2.apply(this,arguments);}
var loc0=label.getLocation(0);var loc1=label.getLocation(1);return jsts.operation.overlay.OverlayOp.isResultOfOp2(loc0,loc1,opCode);}
jsts.operation.overlay.OverlayOp.isResultOfOp2=function(loc0,loc1,opCode){if(loc0==Location.BOUNDARY)
loc0=Location.INTERIOR;if(loc1==Location.BOUNDARY)
loc1=Location.INTERIOR;switch(opCode){case jsts.operation.overlay.OverlayOp.INTERSECTION:return loc0==Location.INTERIOR&&loc1==Location.INTERIOR;case jsts.operation.overlay.OverlayOp.UNION:return loc0==Location.INTERIOR||loc1==Location.INTERIOR;case jsts.operation.overlay.OverlayOp.DIFFERENCE:return loc0==Location.INTERIOR&&loc1!=Location.INTERIOR;case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:return(loc0==Location.INTERIOR&&loc1!=Location.INTERIOR)||(loc0!=Location.INTERIOR&&loc1==Location.INTERIOR);}
return false;}
jsts.operation.overlay.OverlayOp.prototype.ptLocator=null;jsts.operation.overlay.OverlayOp.prototype.geomFact=null;jsts.operation.overlay.OverlayOp.prototype.resultGeom=null;jsts.operation.overlay.OverlayOp.prototype.graph=null;jsts.operation.overlay.OverlayOp.prototype.edgeList=null;jsts.operation.overlay.OverlayOp.prototype.resultPolyList=null;jsts.operation.overlay.OverlayOp.prototype.resultLineList=null;jsts.operation.overlay.OverlayOp.prototype.resultPointList=null;jsts.operation.overlay.OverlayOp.prototype.getResultGeometry=function(funcCode){this.computeOverlay(funcCode);return this.resultGeom;}
jsts.operation.overlay.OverlayOp.prototype.getGraph=function(){return this.graph;}
jsts.operation.overlay.OverlayOp.prototype.computeOverlay=function(opCode){this.copyPoints(0);this.copyPoints(1);this.arg[0].computeSelfNodes(this.li,false);this.arg[1].computeSelfNodes(this.li,false);this.arg[0].computeEdgeIntersections(this.arg[1],this.li,true);var baseSplitEdges=new ArrayList();this.arg[0].computeSplitEdges(baseSplitEdges);this.arg[1].computeSplitEdges(baseSplitEdges);var splitEdges=baseSplitEdges;this.insertUniqueEdges(baseSplitEdges);this.computeLabelsFromDepths();this.replaceCollapsedEdges();EdgeNodingValidator.checkValid(this.edgeList.getEdges());this.graph.addEdges(this.edgeList.getEdges());this.computeLabelling();this.labelIncompleteNodes();this.findResultAreaEdges(opCode);this.cancelDuplicateResultEdges();var polyBuilder=new PolygonBuilder(this.geomFact);polyBuilder.add(this.graph);this.resultPolyList=polyBuilder.getPolygons();var lineBuilder=new LineBuilder(this,this.geomFact,this.ptLocator);this.resultLineList=lineBuilder.build(opCode);var pointBuilder=new PointBuilder(this,this.geomFact,this.ptLocator);this.resultPointList=pointBuilder.build(opCode);this.resultGeom=this.computeGeometry(this.resultPointList,this.resultLineList,this.resultPolyList,opCode);}
jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdges=function(edges){for(var i=edges.iterator();i.hasNext();){var e=i.next();this.insertUniqueEdge(e);}}
jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdge=function(e){var existingEdge=this.edgeList.findEqualEdge(e);if(existingEdge!==null){var existingLabel=existingEdge.getLabel();var labelToMerge=e.getLabel();if(!existingEdge.isPointwiseEqual(e)){labelToMerge=new Label(e.getLabel());labelToMerge.flip();}
var depth=existingEdge.getDepth();if(depth.isNull()){depth.add(existingLabel);}
depth.add(labelToMerge);existingLabel.merge(labelToMerge);}else{this.edgeList.add(e);}};jsts.operation.overlay.OverlayOp.prototype.computeLabelsFromDepths=function(){for(var it=this.edgeList.iterator();it.hasNext();){var e=it.next();var lbl=e.getLabel();var depth=e.getDepth();if(!depth.isNull()){depth.normalize();for(var i=0;i<2;i++){if(!lbl.isNull(i)&&lbl.isArea()&&!depth.isNull(i)){if(depth.getDelta(i)==0){lbl.toLine(i);}else{Assert.isTrue(!depth.isNull(i,Position.LEFT),'depth of LEFT side has not been initialized');lbl.setLocation(i,Position.LEFT,depth.getLocation(i,Position.LEFT));Assert.isTrue(!depth.isNull(i,Position.RIGHT),'depth of RIGHT side has not been initialized');lbl.setLocation(i,Position.RIGHT,depth.getLocation(i,Position.RIGHT));}}}}}}
jsts.operation.overlay.OverlayOp.prototype.replaceCollapsedEdges=function(){var newEdges=new ArrayList();for(var it=this.edgeList.iterator();it.hasNext();){var e=it.next();if(e.isCollapsed()){it.remove();newEdges.add(e.getCollapsedEdge());}}
this.edgeList.addAll(newEdges);}
jsts.operation.overlay.OverlayOp.prototype.copyPoints=function(argIndex){for(var i=this.arg[argIndex].getNodeIterator();i.hasNext();){var graphNode=i.next();var newNode=this.graph.addNode(graphNode.getCoordinate());newNode.setLabel(argIndex,graphNode.getLabel().getLocation(argIndex));}}
jsts.operation.overlay.OverlayOp.prototype.computeLabelling=function(){for(var nodeit=this.graph.getNodes().iterator();nodeit.hasNext();){var node=nodeit.next();node.getEdges().computeLabelling(this.arg);}
this.mergeSymLabels();this.updateNodeLabelling();}
jsts.operation.overlay.OverlayOp.prototype.mergeSymLabels=function(){for(var nodeit=this.graph.getNodes().iterator();nodeit.hasNext();){var node=nodeit.next();node.getEdges().mergeSymLabels();}}
jsts.operation.overlay.OverlayOp.prototype.updateNodeLabelling=function(){for(var nodeit=this.graph.getNodes().iterator();nodeit.hasNext();){var node=nodeit.next();var lbl=node.getEdges().getLabel();node.getLabel().merge(lbl);}}
jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNodes=function(){var nodeCount=0;for(var ni=this.graph.getNodes().iterator();ni.hasNext();){var n=ni.next();var label=n.getLabel();if(n.isIsolated()){nodeCount++;if(label.isNull(0))
this.labelIncompleteNode(n,0);else
this.labelIncompleteNode(n,1);}
n.getEdges().updateLabelling(label);}};jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNode=function(n,targetIndex){var loc=this.ptLocator.locate(n.getCoordinate(),this.arg[targetIndex].getGeometry());n.getLabel().setLocation(targetIndex,loc);};jsts.operation.overlay.OverlayOp.prototype.findResultAreaEdges=function(opCode){for(var it=this.graph.getEdgeEnds().iterator();it.hasNext();){var de=it.next();var label=de.getLabel();if(label.isArea()&&!de.isInteriorAreaEdge()&&jsts.operation.overlay.OverlayOp.isResultOfOp(label.getLocation(0,Position.RIGHT),label.getLocation(1,Position.RIGHT),opCode)){de.setInResult(true);}}};jsts.operation.overlay.OverlayOp.prototype.cancelDuplicateResultEdges=function(){for(var it=this.graph.getEdgeEnds().iterator();it.hasNext();){var de=it.next();var sym=de.getSym();if(de.isInResult()&&sym.isInResult()){de.setInResult(false);sym.setInResult(false);}}};jsts.operation.overlay.OverlayOp.prototype.isCoveredByLA=function(coord){if(this.isCovered(coord,this.resultLineList))
return true;if(this.isCovered(coord,this.resultPolyList))
return true;return false;};jsts.operation.overlay.OverlayOp.prototype.isCoveredByA=function(coord){if(this.isCovered(coord,this.resultPolyList))
return true;return false;};jsts.operation.overlay.OverlayOp.prototype.isCovered=function(coord,geomList){for(var it=geomList.iterator();it.hasNext();){var geom=it.next();var loc=this.ptLocator.locate(coord,geom);if(loc!=Location.EXTERIOR)
return true;}
return false;};jsts.operation.overlay.OverlayOp.prototype.computeGeometry=function(resultPointList,resultLineList,resultPolyList,opcode){var geomList=new ArrayList();geomList.addAll(resultPointList);geomList.addAll(resultLineList);geomList.addAll(resultPolyList);return this.geomFact.buildGeometry(geomList);};jsts.operation.overlay.OverlayOp.prototype.createEmptyResult=function(opCode){var result=null;switch(resultDimension(opCode,this.arg[0].getGeometry(),this.arg[1].getGeometry())){case-1:result=geomFact.createGeometryCollection();break;case 0:result=geomFact.createPoint(null);break;case 1:result=geomFact.createLineString(null);break;case 2:result=geomFact.createPolygon(null,null);break;}
return result;};jsts.operation.overlay.OverlayOp.prototype.resultDimension=function(opCode,g0,g1){var dim0=g0.getDimension();var dim1=g1.getDimension();var resultDimension=-1;switch(opCode){case jsts.operation.overlay.OverlayOp.INTERSECTION:resultDimension=Math.min(dim0,dim1);break;case jsts.operation.overlay.OverlayOp.UNION:resultDimension=Math.max(dim0,dim1);break;case jsts.operation.overlay.OverlayOp.DIFFERENCE:resultDimension=dim0;break;case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:resultDimension=Math.max(dim0,dim1);break;}
return resultDimension;};})();(function(){var OverlayOp=jsts.operation.overlay.OverlayOp;var GeometrySnapper=jsts.operation.overlay.snap.GeometrySnapper;var SnapOverlayOp=function(g1,g2){this.geom=[];this.geom[0]=g1;this.geom[1]=g2;this.computeSnapTolerance();};SnapOverlayOp.overlayOp=function(g0,g1,opCode){var op=new SnapOverlayOp(g0,g1);return op.getResultGeometry(opCode);};SnapOverlayOp.intersection=function(g0,g1){return this.overlayOp(g0,g1,OverlayOp.INTERSECTION);};SnapOverlayOp.union=function(g0,g1){return this.overlayOp(g0,g1,OverlayOp.UNION);};SnapOverlayOp.difference=function(g0,g1){return overlayOp(g0,g1,OverlayOp.DIFFERENCE);};SnapOverlayOp.symDifference=function(g0,g1){return overlayOp(g0,g1,OverlayOp.SYMDIFFERENCE);};SnapOverlayOp.prototype.geom=null;SnapOverlayOp.prototype.snapTolerance=null;SnapOverlayOp.prototype.computeSnapTolerance=function(){this.snapTolerance=GeometrySnapper.computeOverlaySnapTolerance(this.geom[0],this.geom[1]);};SnapOverlayOp.prototype.getResultGeometry=function(opCode){var prepGeom=this.snap(this.geom);var result=OverlayOp.overlayOp(prepGeom[0],prepGeom[1],opCode);return this.prepareResult(result);};SnapOverlayOp.prototype.selfSnap=function(geom){var snapper0=new GeometrySnapper(geom);var snapGeom=snapper0.snapTo(geom,this.snapTolerance);return snapGeom;};SnapOverlayOp.prototype.snap=function(geom){var remGeom=geom;var snapGeom=GeometrySnapper.snap(remGeom[0],remGeom[1],this.snapTolerance);return snapGeom;};SnapOverlayOp.prototype.prepareResult=function(geom){return geom;};SnapOverlayOp.prototype.cbr=null;SnapOverlayOp.prototype.removeCommonBits=function(geom){this.cbr=new jsts.precision.CommonBitsRemover();this.cbr.add(this.geom[0]);this.cbr.add(this.geom[1]);var remGeom=[];remGeom[0]=cbr.removeCommonBits(this.geom[0].clone());remGeom[1]=cbr.removeCommonBits(this.geom[1].clone());return remGeom;};jsts.operation.overlay.snap.SnapOverlayOp=SnapOverlayOp;})();jsts.geomgraph.index.EdgeSetIntersector=function(){};jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections=function(edges,si,testAllSegments){throw new jsts.error.AbstractMethodInvocationError();};jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections2=function(edges0,edges1,si){throw new jsts.error.AbstractMethodInvocationError();};jsts.geomgraph.index.SimpleMCSweepLineIntersector=function(){this.events=[];};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype=new jsts.geomgraph.index.EdgeSetIntersector();jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.events=null;jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.nOverlaps=0;jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections=function(edges,si,testAllSegments){if(si instanceof javascript.util.List){this.computeIntersections2.apply(this,arguments);return;}
if(testAllSegments){this.addList2(edges,null);}else{this.addList(edges);}
this.computeIntersections3(si);};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections2=function(edges0,edges1,si){this.addList2(edges0,edges0);this.addList2(edges1,edges1);this.computeIntersections3(si);};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.add=function(edge,edgeSet){if(edge instanceof javascript.util.List){this.addList.apply(this,arguments);return;}
var mce=edge.getMonotoneChainEdge();var startIndex=mce.getStartIndexes();for(var i=0;i<startIndex.length-1;i++){var mc=new jsts.geomgraph.index.MonotoneChain(mce,i);var insertEvent=new jsts.geomgraph.index.SweepLineEvent(mce.getMinX(i),mc,edgeSet);this.events.push(insertEvent);this.events.push(new jsts.geomgraph.index.SweepLineEvent(mce.getMaxX(i),insertEvent));}};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.addList=function(edges){for(var i=edges.iterator();i.hasNext();){var edge=i.next();this.add(edge,edge);}};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.addList2=function(edges,edgeSet){for(var i=edges.iterator();i.hasNext();){var edge=i.next();this.add(edge,edgeSet);}};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.prepareEvents=function(){this.events.sort(function(a,b){return a.compareTo(b);});for(var i=0;i<this.events.length;i++){var ev=this.events[i];if(ev.isDelete()){ev.getInsertEvent().setDeleteEventIndex(i);}}};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections3=function(si){this.nOverlaps=0;this.prepareEvents();for(var i=0;i<this.events.length;i++){var ev=this.events[i];if(ev.isInsert()){this.processOverlaps(i,ev.getDeleteEventIndex(),ev,si);}}};jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.processOverlaps=function(start,end,ev0,si){var mc0=ev0.getObject();for(var i=start;i<end;i++){var ev1=this.events[i];if(ev1.isInsert()){var mc1=ev1.getObject();if(!ev0.isSameLabel(ev1)){mc0.computeIntersections(mc1,si);this.nOverlaps++;}}}};jsts.algorithm.locate.SimplePointInAreaLocator=function(geom){this.geom=geom;};jsts.algorithm.locate.SimplePointInAreaLocator.locate=function(p,geom){if(geom.isEmpty())
return jsts.geom.Location.EXTERIOR;if(jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p,geom))
return jsts.geom.Location.INTERIOR;return jsts.geom.Location.EXTERIOR;};jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint=function(p,geom){if(geom instanceof jsts.geom.Polygon){return jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon(p,geom);}else if(geom instanceof jsts.geom.GeometryCollection||geom instanceof jsts.geom.MultiPoint||geom instanceof jsts.geom.MultiLineString||geom instanceof jsts.geom.MultiPolygon){for(var i=0;i<geom.geometries.length;i++){var g2=geom.geometries[i];if(g2!==geom)
if(jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p,g2))
return true;}}
return false;};jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon=function(p,poly){if(poly.isEmpty())
return false;var shell=poly.getExteriorRing();if(!jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p,shell))
return false;for(var i=0;i<poly.getNumInteriorRing();i++){var hole=poly.getInteriorRingN(i);if(jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p,hole))
return false;}
return true;};jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing=function(p,ring){if(!ring.getEnvelopeInternal().intersects(p))
return false;return jsts.algorithm.CGAlgorithms.isPointInRing(p,ring.getCoordinates());};jsts.algorithm.locate.SimplePointInAreaLocator.prototype.geom=null;jsts.algorithm.locate.SimplePointInAreaLocator.prototype.locate=function(p){return jsts.algorithm.locate.SimplePointInAreaLocator.locate(p,geom);};(function(){var Location=jsts.geom.Location;var Position=jsts.geomgraph.Position;var EdgeEndStar=jsts.geomgraph.EdgeEndStar;var Assert=jsts.util.Assert;jsts.geomgraph.DirectedEdgeStar=function(){jsts.geomgraph.EdgeEndStar.call(this);};jsts.geomgraph.DirectedEdgeStar.prototype=new EdgeEndStar();jsts.geomgraph.DirectedEdgeStar.constructor=jsts.geomgraph.DirectedEdgeStar;jsts.geomgraph.DirectedEdgeStar.prototype.resultAreaEdgeList=null;jsts.geomgraph.DirectedEdgeStar.prototype.label=null;jsts.geomgraph.DirectedEdgeStar.prototype.insert=function(ee){var de=ee;this.insertEdgeEnd(de,de);};jsts.geomgraph.DirectedEdgeStar.prototype.getLabel=function(){return this.label;};jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree=function(){var degree=0;for(var it=this.iterator();it.hasNext();){var de=it.next();if(de.isInResult())
degree++;}
return degree;};jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree=function(er){var degree=0;for(var it=this.iterator();it.hasNext();){var de=it.next();if(de.getEdgeRing()===er)
degree++;}
return degree;};jsts.geomgraph.DirectedEdgeStar.prototype.getRightmostEdge=function(){var edges=this.getEdges();var size=edges.size();if(size<1)
return null;var de0=edges.get(0);if(size==1)
return de0;var deLast=edges.get(size-1);var quad0=de0.getQuadrant();var quad1=deLast.getQuadrant();if(jsts.geomgraph.Quadrant.isNorthern(quad0)&&jsts.geomgraph.Quadrant.isNorthern(quad1))
return de0;else if(!jsts.geomgraph.Quadrant.isNorthern(quad0)&&!jsts.geomgraph.Quadrant.isNorthern(quad1))
return deLast;else{var nonHorizontalEdge=null;if(de0.getDy()!=0)
return de0;else if(deLast.getDy()!=0)
return deLast;}
Assert.shouldNeverReachHere('found two horizontal edges incident on node');return null;};jsts.geomgraph.DirectedEdgeStar.prototype.computeLabelling=function(geom){EdgeEndStar.prototype.computeLabelling.call(this,geom);this.label=new jsts.geomgraph.Label(Location.NONE);for(var it=this.iterator();it.hasNext();){var ee=it.next();var e=ee.getEdge();var eLabel=e.getLabel();for(var i=0;i<2;i++){var eLoc=eLabel.getLocation(i);if(eLoc===Location.INTERIOR||eLoc===Location.BOUNDARY)
this.label.setLocation(i,Location.INTERIOR);}}};jsts.geomgraph.DirectedEdgeStar.prototype.mergeSymLabels=function(){for(var it=this.iterator();it.hasNext();){var de=it.next();var label=de.getLabel();label.merge(de.getSym().getLabel());}};jsts.geomgraph.DirectedEdgeStar.prototype.updateLabelling=function(nodeLabel){for(var it=this.iterator();it.hasNext();){var de=it.next();var label=de.getLabel();label.setAllLocationsIfNull(0,nodeLabel.getLocation(0));label.setAllLocationsIfNull(1,nodeLabel.getLocation(1));}};jsts.geomgraph.DirectedEdgeStar.prototype.getResultAreaEdges=function(){if(this.resultAreaEdgeList!==null)
return this.resultAreaEdgeList;this.resultAreaEdgeList=new javascript.util.ArrayList();for(var it=this.iterator();it.hasNext();){var de=it.next();if(de.isInResult()||de.getSym().isInResult())
this.resultAreaEdgeList.add(de);}
return this.resultAreaEdgeList;};jsts.geomgraph.DirectedEdgeStar.prototype.SCANNING_FOR_INCOMING=1;jsts.geomgraph.DirectedEdgeStar.prototype.LINKING_TO_OUTGOING=2;jsts.geomgraph.DirectedEdgeStar.prototype.linkResultDirectedEdges=function(){this.getResultAreaEdges();var firstOut=null;var incoming=null;var state=this.SCANNING_FOR_INCOMING;for(var i=0;i<this.resultAreaEdgeList.size();i++){var nextOut=this.resultAreaEdgeList.get(i);var nextIn=nextOut.getSym();if(!nextOut.getLabel().isArea())
continue;if(firstOut===null&&nextOut.isInResult())
firstOut=nextOut;switch(state){case this.SCANNING_FOR_INCOMING:if(!nextIn.isInResult())
continue;incoming=nextIn;state=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(!nextOut.isInResult())
continue;incoming.setNext(nextOut);state=this.SCANNING_FOR_INCOMING;break;}}
if(state===this.LINKING_TO_OUTGOING){if(firstOut===null)
throw new jsts.error.TopologyError('no outgoing dirEdge found',this.getCoordinate());Assert.isTrue(firstOut.isInResult(),'unable to link last incoming dirEdge');incoming.setNext(firstOut);}};jsts.geomgraph.DirectedEdgeStar.prototype.linkMinimalDirectedEdges=function(er){var firstOut=null;var incoming=null;var state=this.SCANNING_FOR_INCOMING;for(var i=this.resultAreaEdgeList.size()-1;i>=0;i--){var nextOut=this.resultAreaEdgeList.get(i);var nextIn=nextOut.getSym();if(firstOut===null&&nextOut.getEdgeRing()===er)
firstOut=nextOut;switch(state){case this.SCANNING_FOR_INCOMING:if(nextIn.getEdgeRing()!=er)
continue;incoming=nextIn;state=this.LINKING_TO_OUTGOING;break;case this.LINKING_TO_OUTGOING:if(nextOut.getEdgeRing()!==er)
continue;incoming.setNextMin(nextOut);state=this.SCANNING_FOR_INCOMING;break;}}
if(state===this.LINKING_TO_OUTGOING){Assert.isTrue(firstOut!==null,'found null for first outgoing dirEdge');Assert.isTrue(firstOut.getEdgeRing()===er,'unable to link last incoming dirEdge');incoming.setNextMin(firstOut);}};jsts.geomgraph.DirectedEdgeStar.prototype.linkAllDirectedEdges=function(){this.getEdges();var prevOut=null;var firstIn=null;for(var i=this.edgeList.size()-1;i>=0;i--){var nextOut=this.edgeList.get(i);var nextIn=nextOut.getSym();if(firstIn===null)
firstIn=nextIn;if(prevOut!==null)
nextIn.setNext(prevOut);prevOut=nextOut;}
firstIn.setNext(prevOut);};jsts.geomgraph.DirectedEdgeStar.prototype.findCoveredLineEdges=function(){var startLoc=Location.NONE;for(var it=this.iterator();it.hasNext();){var nextOut=it.next();var nextIn=nextOut.getSym();if(!nextOut.isLineEdge()){if(nextOut.isInResult()){startLoc=Location.INTERIOR;break;}
if(nextIn.isInResult()){startLoc=Location.EXTERIOR;break;}}}
if(startLoc===Location.NONE)
return;var currLoc=startLoc;for(var it=this.iterator();it.hasNext();){var nextOut=it.next();var nextIn=nextOut.getSym();if(nextOut.isLineEdge()){nextOut.getEdge().setCovered(currLoc===Location.INTERIOR);}else{if(nextOut.isInResult())
currLoc=Location.EXTERIOR;if(nextIn.isInResult())
currLoc=Location.INTERIOR;}}};jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths=function(de){if(arguments.length===2){this.computeDepths2.apply(this,arguments);return;}
var edgeIndex=this.findIndex(de);var label=de.getLabel();var startDepth=de.getDepth(Position.LEFT);var targetLastDepth=de.getDepth(Position.RIGHT);var nextDepth=this.computeDepths2(edgeIndex+1,this.edgeList.size(),startDepth);var lastDepth=this.computeDepths2(0,edgeIndex,nextDepth);if(lastDepth!=targetLastDepth)
throw new jsts.error.TopologyError('depth mismatch at '+
de.getCoordinate());};jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths2=function(startIndex,endIndex,startDepth){var currDepth=startDepth;for(var i=startIndex;i<endIndex;i++){var nextDe=this.edgeList.get(i);var label=nextDe.getLabel();nextDe.setEdgeDepths(Position.RIGHT,currDepth);currDepth=nextDe.getDepth(Position.LEFT);}
return currDepth;};})();jsts.algorithm.CentroidLine=function(){this.centSum=new jsts.geom.Coordinate();};jsts.algorithm.CentroidLine.prototype.centSum=null;jsts.algorithm.CentroidLine.prototype.totalLength=0.0;jsts.algorithm.CentroidLine.prototype.add=function(geom){if(geom instanceof Array){this.add2.apply(this,arguments);return;}
if(geom instanceof jsts.geom.LineString){this.add(geom.getCoordinates());}else if(geom instanceof jsts.geom.Polygon){var poly=geom;this.add(poly.getExteriorRing().getCoordinates());for(var i=0;i<poly.getNumInteriorRing();i++){this.add(poly.getInteriorRingN(i).getCoordinates());}}else if(geom instanceof jsts.geom.GeometryCollection||geom instanceof jsts.geom.MultiPoint||geom instanceof jsts.geom.MultiLineString||geom instanceof jsts.geom.MultiPolygon){var gc=geom;for(var i=0;i<gc.getNumGeometries();i++){this.add(gc.getGeometryN(i));}}};jsts.algorithm.CentroidLine.prototype.getCentroid=function(){var cent=new jsts.geom.Coordinate();cent.x=this.centSum.x/this.totalLength;cent.y=this.centSum.y/this.totalLength;return cent;};jsts.algorithm.CentroidLine.prototype.add2=function(pts){for(var i=0;i<pts.length-1;i++){var segmentLen=pts[i].distance(pts[i+1]);this.totalLength+=segmentLen;var midx=(pts[i].x+pts[i+1].x)/2;this.centSum.x+=segmentLen*midx;var midy=(pts[i].y+pts[i+1].y)/2;this.centSum.y+=segmentLen*midy;}};jsts.index.IntervalSize=function(){};jsts.index.IntervalSize.MIN_BINARY_EXPONENT=-50;jsts.index.IntervalSize.isZeroWidth=function(min,max){var width=max-min;if(width===0.0){return true;}
var maxAbs,scaledInterval,level;maxAbs=Math.max(Math.abs(min),Math.abs(max));scaledInterval=width/maxAbs;level=jsts.index.DoubleBits.exponent(scaledInterval);return level<=jsts.index.IntervalSize.MIN_BINARY_EXPONENT;};jsts.geomgraph.index.SimpleEdgeSetIntersector=function(){};jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype=new jsts.geomgraph.index.EdgeSetIntersector();jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.nOverlaps=0;jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersections=function(edges,si,testAllSegments){if(si instanceof javascript.util.List){this.computeIntersections2.apply(this,arguments);return;}
this.nOverlaps=0;for(var i0=edges.iterator();i0.hasNext();){var edge0=i0.next();for(var i1=edges.iterator();i1.hasNext();){var edge1=i1.next();if(testAllSegments||edge0!=edge1)
this.computeIntersects(edge0,edge1,si);}}};jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersections2=function(edges0,edges1,si){this.nOverlaps=0;for(var i0=edges0.iterator();i0.hasNext();){var edge0=i0.next();for(var i1=edges1.iterator();i1.hasNext();){var edge1=i1.next();this.computeIntersects(edge0,edge1,si);}}};jsts.geomgraph.index.SimpleEdgeSetIntersector.prototype.computeIntersects=function(e0,e1,si){var pts0=e0.getCoordinates();var pts1=e1.getCoordinates();var i0,i1;for(i0=0;i0<pts0.length-1;i0++){for(i1=0;i1<pts1.length-1;i1++){si.addIntersections(e0,i0,e1,i1);}}};jsts.geomgraph.Edge=function(pts,label){this.pts=pts;this.label=label;this.eiList=new jsts.geomgraph.EdgeIntersectionList(this);this.depth=new jsts.geomgraph.Depth();};jsts.geomgraph.Edge.prototype=new jsts.geomgraph.GraphComponent();jsts.geomgraph.Edge.constructor=jsts.geomgraph.Edge;jsts.geomgraph.Edge.updateIM=function(label,im){im.setAtLeastIfValid(label.getLocation(0,jsts.geomgraph.Position.ON),label.getLocation(1,jsts.geomgraph.Position.ON),1);if(label.isArea()){im.setAtLeastIfValid(label.getLocation(0,jsts.geomgraph.Position.LEFT),label.getLocation(1,jsts.geomgraph.Position.LEFT),2);im.setAtLeastIfValid(label.getLocation(0,jsts.geomgraph.Position.RIGHT),label.getLocation(1,jsts.geomgraph.Position.RIGHT),2);}};jsts.geomgraph.Edge.prototype.pts=null;jsts.geomgraph.Edge.prototype.env=null;jsts.geomgraph.Edge.prototype.name=null;jsts.geomgraph.Edge.prototype.mce=null;jsts.geomgraph.Edge.prototype._isIsolated=true;jsts.geomgraph.Edge.prototype.depth=null;jsts.geomgraph.Edge.prototype.depthDelta=0;jsts.geomgraph.Edge.prototype.eiList=null;jsts.geomgraph.Edge.prototype.getNumPoints=function(){return this.pts.length;};jsts.geomgraph.Edge.prototype.getEnvelope=function(){if(this.env===null){this.env=new jsts.geom.Envelope();for(var i=0;i<this.pts.length;i++){this.env.expandToInclude(pts[i]);}}
return env;};jsts.geomgraph.Edge.prototype.getDepth=function(){return this.depth;};jsts.geomgraph.Edge.prototype.getDepthDelta=function(){return this.depthDelta;};jsts.geomgraph.Edge.prototype.setDepthDelta=function(depthDelta){this.depthDelta=depthDelta;};jsts.geomgraph.Edge.prototype.getCoordinates=function(){return this.pts;};jsts.geomgraph.Edge.prototype.getCoordinate=function(i){if(i===undefined){if(this.pts.length>0){return this.pts[0];}else{return null;}}
return this.pts[i];};jsts.geomgraph.Edge.prototype.isClosed=function(){return this.pts[0].equals(this.pts[this.pts.length-1]);};jsts.geomgraph.Edge.prototype.setIsolated=function(isIsolated){this._isIsolated=isIsolated;};jsts.geomgraph.Edge.prototype.isIsolated=function(){return this._isIsolated;};jsts.geomgraph.Edge.prototype.addIntersections=function(li,segmentIndex,geomIndex){for(var i=0;i<li.getIntersectionNum();i++){this.addIntersection(li,segmentIndex,geomIndex,i);}};jsts.geomgraph.Edge.prototype.addIntersection=function(li,segmentIndex,geomIndex,intIndex){var intPt=new jsts.geom.Coordinate(li.getIntersection(intIndex));var normalizedSegmentIndex=segmentIndex;var dist=li.getEdgeDistance(geomIndex,intIndex);var nextSegIndex=normalizedSegmentIndex+1;if(nextSegIndex<this.pts.length){var nextPt=this.pts[nextSegIndex];if(intPt.equals2D(nextPt)){normalizedSegmentIndex=nextSegIndex;dist=0.0;}}
var ei=this.eiList.add(intPt,normalizedSegmentIndex,dist);};jsts.geomgraph.Edge.prototype.getMaximumSegmentIndex=function(){return this.pts.length-1;};jsts.geomgraph.Edge.prototype.getEdgeIntersectionList=function(){return this.eiList;};jsts.geomgraph.Edge.prototype.getMonotoneChainEdge=function(){if(this.mce==null){this.mce=new jsts.geomgraph.index.MonotoneChainEdge(this);}
return this.mce;};jsts.geomgraph.Edge.prototype.isClosed=function()
{return this.pts[0].equals(this.pts[this.pts.length-1]);};jsts.geomgraph.Edge.prototype.isCollapsed=function()
{if(!this.label.isArea())return false;if(this.pts.length!=3)return false;if(this.pts[0].equals(this.pts[2]))return true;return false;};jsts.geomgraph.Edge.prototype.getCollapsedEdge=function()
{var newPts=[];newPts[0]=this.pts[0];newPts[1]=this.pts[1];var newe=new jsts.geomgraph.Edge(newPts,jsts.geomgraph.Label.toLineLabel(this.label));return newe;};jsts.geomgraph.Edge.prototype.computeIM=function(im){jsts.geomgraph.Edge.updateIM(this.label,im);};jsts.geomgraph.Edge.prototype.isPointwiseEqual=function(e)
{if(this.pts.length!=e.pts.length)return false;for(var i=0;i<this.pts.length;i++){if(!this.pts[i].equals2D(e.pts[i])){return false;}}
return true;};jsts.noding.Octant=function(){throw jsts.error.AbstractMethodInvocationError();};jsts.noding.Octant.octant=function(dx,dy){if(dx instanceof jsts.geom.Coordinate){return jsts.noding.Octant.octant2.apply(this,arguments);}
if(dx===0.0&&dy===0.0)
throw new jsts.error.IllegalArgumentError('Cannot compute the octant for point ( '+dx+', '+dy+' )');var adx=Math.abs(dx);var ady=Math.abs(dy);if(dx>=0){if(dy>=0){if(adx>=ady)
return 0;else
return 1;}
else{if(adx>=ady)
return 7;else
return 6;}}
else{if(dy>=0){if(adx>=ady)
return 3;else
return 2;}
else{if(adx>=ady)
return 4;else
return 5;}}};jsts.noding.Octant.octant2=function(p0,p1){var dx=p1.x-p0.x;var dy=p1.y-p0.y;if(dx===0.0&&dy===0.0)
throw new jsts.error.IllegalArgumentError('Cannot compute the octant for two identical points '+p0);return jsts.noding.Octant.octant(dx,dy);};jsts.operation.union.UnionInteracting=function(g0,g1){this.g0=g0;this.g1=g1;this.geomFactory=g0.getFactory();this.interacts0=[];this.interacts1=[];};jsts.operation.union.UnionInteracting.union=function(g0,g1){var uue=new jsts.operation.union.UnionInteracting(g0,g1);return uue.union();};jsts.operation.union.UnionInteracting.prototype.geomFactory=null;jsts.operation.union.UnionInteracting.prototype.g0=null;jsts.operation.union.UnionInteracting.prototype.g1=null;jsts.operation.union.UnionInteracting.prototype.interacts0=null;jsts.operation.union.UnionInteracting.prototype.interacts1=null;jsts.operation.union.UnionInteracting.prototype.union=function(){this.computeInteracting();var int0=this.extractElements(this.g0,this.interacts0,true);var int1=this.extractElements(this.g1,this.interacts1,true);if(int0.isEmpty()||int1.isEmpty()){}
var union=in0.union(int1);var disjoint0=this.extractElements(this.g0,this.interacts0,false);var disjoint1=this.extractElements(this.g1,this.interacts1,false);var overallUnion=jsts.geom.util.GeometryCombiner.combine(union,disjoint0,disjoint1);return overallUnion;};jsts.operation.union.UnionInteracting.prototype.bufferUnion=function(g0,g1){var factory=g0.getFactory();var gColl=factory.createGeometryCollection([g0,g1]);var unionAll=gColl.buffer(0.0);return unionAll;};jsts.operation.union.UnionInteracting.prototype.computeInteracting=function(elem0){if(!elem0){for(var i=0,l=this.g0.getNumGeometries();i<l;i++){var elem=this.g0.getGeometryN(i);this.interacts0[i]=this.computeInteracting(elem);}}
else{var interactsWithAny=false;for(var i=0,l=g1.getNumGeometries();i<l;i++){var elem1=this.g1.getGeometryN(i);var interacts=elem1.getEnvelopeInternal().intersects(elem0.getEnvelopeInternal());if(interacts){this.interacts1[i]=true;interactsWithAny=true;}}
return interactsWithAny;}};jsts.operation.union.UnionInteracting.prototype.extractElements=function(geom,interacts,isInteracting){var extractedGeoms=[];for(var i=0,l=geom.getNumGeometries();i<l;i++){var elem=geom.getGeometryN(i);if(interacts[i]===isInteracting){extractedGeoms.push(elem);}}
return this.geomFactory.buildGeometry(extractedGeoms);};jsts.triangulate.quadedge.TrianglePredicate=function(){};jsts.triangulate.quadedge.TrianglePredicate.isInCircleNonRobust=function(a,b,c,p){var isInCircle=(a.x*a.x+a.y*a.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(b,c,p)-
(b.x*b.x+b.y*b.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(a,c,p)+
(c.x*c.x+c.y*c.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(a,b,p)-
(p.x*p.x+p.y*p.y)*jsts.triangulate.quadedge.TrianglePredicate.triArea(a,b,c)>0;return isInCircle;};jsts.triangulate.quadedge.TrianglePredicate.isInCircleNormalized=function(a,b,c,p){var adx,ady,bdx,bdy,cdx,cdy,abdet,bcdet,cadet,alift,blift,clift,disc;adx=a.x-p.x;ady=a.y-p.y;bdx=b.x-p.x;bdy=b.y-p.y;cdx=c.x-p.x;cdy=c.y-p.y;abdet=adx*bdy-bdx*ady;bcdet=bdx*cdy-cdx*bdy;cadet=cdx*ady-adx*cdy;alift=adx*adx+ady*ady;blift=bdx*bdx+bdy*bdy;clift=cdx*cdx+cdy*cdy;disc=alift*bcdet+blift*cadet+clift*abdet;return disc>0;};jsts.triangulate.quadedge.TrianglePredicate.triArea=function(a,b,c){return(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);};jsts.triangulate.quadedge.TrianglePredicate.isInCircleRobust=function(a,b,c,p){return jsts.triangulate.quadedge.TrianglePredicate.isInCircleNormalized(a,b,c,p);};jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDSlow=function(a,b,c,p){var px,py,ax,ay,bx,by,cx,cy,aTerm,bTerm,cTerm,pTerm,sum,isInCircle;px=jsts.math.DD.valueOf(p.x);py=jsts.math.DD.valueOf(p.y);ax=jsts.math.DD.valueOf(a.x);ay=jsts.math.DD.valueOf(a.y);bx=jsts.math.DD.valueOf(b.x);by=jsts.math.DD.valueOf(b.y);cx=jsts.math.DD.valueOf(c.x);cy=jsts.math.DD.valueOf(c.y);aTerm=(ax.multiply(ax).add(ay.multiply(ay))).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(bx,by,cx,cy,px,py));bTerm=(bx.multiply(bx).add(by.multiply(by))).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(ax,ay,cx,cy,px,py));cTerm=(cx.multiply(cx).add(cy.multiply(cy))).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(ax,ay,bx,by,px,py));pTerm=(px.multiply(px).add(py.multiply(py))).multiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow(ax,ay,bx,by,cx,cy));sum=aTerm.subtract(bTerm).add(cTerm).subtract(pTerm);isInCircle=sum.doubleValue()>0;return isInCircle;};jsts.triangulate.quadedge.TrianglePredicate.triAreaDDSlow=function(ax,ay,bx,by,cx,cy){return(bx.subtract(ax).multiply(cy.subtract(ay)).subtract(by.subtract(ay).multiply(cx.subtract(ax))));};jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDFast=function(a,b,c,p){var aTerm,bTerm,cTerm,pTerm,sum,isInCircle;aTerm=(jsts.math.DD.sqr(a.x).selfAdd(jsts.math.DD.sqr(a.y))).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(b,c,p));bTerm=(jsts.math.DD.sqr(b.x).selfAdd(jsts.math.DD.sqr(b.y))).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(a,c,p));cTerm=(jsts.math.DD.sqr(c.x).selfAdd(jsts.math.DD.sqr(c.y))).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(a,b,p));pTerm=(jsts.math.DD.sqr(p.x).selfAdd(jsts.math.DD.sqr(p.y))).selfMultiply(jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast(a,b,c));sum=aTerm.selfSubtract(bTerm).selfAdd(cTerm).selfSubtract(pTerm);isInCircle=sum.doubleValue()>0;return isInCircle;};jsts.triangulate.quadedge.TrianglePredicate.triAreaDDFast=function(a,b,c){var t1,t2;t1=jsts.math.DD.valueOf(b.x).selfSubtract(a.x).selfMultiply(jsts.math.DD.valueOf(c.y).selfSubtract(a.y));t2=jsts.math.DD.valueOf(b.y).selSubtract(a.y).selfMultiply(jsts.math.DD.valueOf(c.x).selfSubtract(a.x));return t1.selfSubtract(t2);};jsts.triangulate.quadedge.TrianglePredicate.isInCircleDDNormalized=function(a,b,c,p){var adx,ady,bdx,bdy,cdx,cdy,abdet,bcdet,cadet,alift,blift,clift,sum,isInCircle;adx=jsts.math.DD.valueOf(a.x).selfSubtract(p.x);ady=jsts.math.DD.valueOf(a.y).selfSubtract(p.y);bdx=jsts.math.DD.valueOf(b.x).selfSubtract(p.x);bdx=jsts.math.DD.valueOf(b.y).selfSubtract(p.y);cdx=jsts.math.DD.valueOf(c.x).selfSubtract(p.x);cdx=jsts.math.DD.valueOf(c.y).selfSubtract(p.y);abdet=adx.multiply(bdy).selfSubtract(bdx.multiply(ady));bcdet=bdx.multiply(cdy).selfSubtract(cdx.multiply(bdy));cadet=cdx.multiply(ady).selfSubtract(adx.multiply(cdy));alift=adx.multiply(adx).selfAdd(ady.multiply(ady));blift=bdx.multiply(bdx).selfAdd(bdy.multiply(bdy));clift=cdx.multiply(cdx).selfAdd(cdy.multiply(cdy));sum=alift.selfMultiply(bcdet).selfAdd(blift.selfMultiply(cadet)).selfAdd(clift.selfMultiply(abdet));isInCircle=sum.doubleValue()>0;return isInCircle;};jsts.triangulate.quadedge.TrianglePredicate.isInCircleCC=function(a,b,c,p){var cc,ccRadius,pRadiusDiff;cc=jsts.geom.Triangle.circumcentre(a,b,c);ccRadius=a.distance(cc);pRadiusDiff=p.distance(cc)-ccRadius;return pRadiusDiff<=0;};jsts.operation.union.PointGeometryUnion=function(pointGeom,otherGeom){this.pointGeom=pointGeom;this.otherGeom=otherGeom;this.geomFact=otherGeom.getFactory();};jsts.operation.union.PointGeometryUnion.union=function(pointGeom,otherGeom){var unioner=new jsts.operation.union.PointGeometryUnion(pointGeom,otherGeom);return unioner.union();};jsts.operation.union.PointGeometryUnion.prototype.pointGeom=null;jsts.operation.union.PointGeometryUnion.prototype.otherGeom=null;jsts.operation.union.PointGeometryUnion.prototype.geomFact=null;jsts.operation.union.PointGeometryUnion.prototype.union=function(){var locator=new jsts.algorithm.PointLocator();var exteriorCoords=[];for(var i=0,l=this.pointGeom.getNumGeometries();i<l;i++){var point=this.pointGeom.getGeometryN(i);var coord=point.getCoordinate();var loc=locator.locate(coord,this.otherGeom);if(loc===jsts.geom.Location.EXTERIOR){var include=true;for(var j=exteriorCoords.length;i--;){if(exteriorCoords[j].equals(coord)){include=false;break;}}
if(include){exteriorCoords.push(coord);}}}
exteriorCoords.sort(function(x,y){return x.compareTo(y);});if(exteriorCoords.length===0){return this.otherGeom;}
var ptComp=null;var coords=jsts.geom.CoordinateArrays.toCoordinateArray(exteriorCoords);if(coords.length===1){ptComp=this.geomFact.createPoint(coords[0]);}
else{ptComp=this.geomFact.createMultiPoint(coords);}
return jsts.geom.util.GeometryCombiner.combine(ptComp,this.otherGeom);};jsts.noding.IntersectionFinderAdder=function(li){this.li=li;this.interiorIntersections=new javascript.util.ArrayList();};jsts.noding.IntersectionFinderAdder.prototype=new jsts.noding.SegmentIntersector();jsts.noding.IntersectionFinderAdder.constructor=jsts.noding.IntersectionFinderAdder;jsts.noding.IntersectionFinderAdder.prototype.li=null;jsts.noding.IntersectionFinderAdder.prototype.interiorIntersections=null;jsts.noding.IntersectionFinderAdder.prototype.getInteriorIntersections=function(){return this.interiorIntersections;};jsts.noding.IntersectionFinderAdder.prototype.processIntersections=function(e0,segIndex0,e1,segIndex1){if(e0===e1&&segIndex0===segIndex1)
return;var p00=e0.getCoordinates()[segIndex0];var p01=e0.getCoordinates()[segIndex0+1];var p10=e1.getCoordinates()[segIndex1];var p11=e1.getCoordinates()[segIndex1+1];this.li.computeIntersection(p00,p01,p10,p11);if(this.li.hasIntersection()){if(this.li.isInteriorIntersection()){for(var intIndex=0;intIndex<this.li.getIntersectionNum();intIndex++){this.interiorIntersections.add(this.li.getIntersection(intIndex));}
e0.addIntersections(this.li,segIndex0,0);e1.addIntersections(this.li,segIndex1,1);}}};jsts.noding.IntersectionFinderAdder.prototype.isDone=function(){return false;};jsts.noding.snapround.MCIndexSnapRounder=function(pm){this.pm=pm;this.li=new jsts.algorithm.RobustLineIntersector();this.li.setPrecisionModel(pm);this.scaleFactor=pm.getScale();};jsts.noding.snapround.MCIndexSnapRounder.prototype=new jsts.noding.Noder();jsts.noding.snapround.MCIndexSnapRounder.constructor=jsts.noding.snapround.MCIndexSnapRounder;jsts.noding.snapround.MCIndexSnapRounder.prototype.pm=null;jsts.noding.snapround.MCIndexSnapRounder.prototype.li=null;jsts.noding.snapround.MCIndexSnapRounder.prototype.scaleFactor=null;jsts.noding.snapround.MCIndexSnapRounder.prototype.noder=null;jsts.noding.snapround.MCIndexSnapRounder.prototype.pointSnapper=null;jsts.noding.snapround.MCIndexSnapRounder.prototype.nodedSegStrings=null;jsts.noding.snapround.MCIndexSnapRounder.prototype.getNodedSubstrings=function(){return jsts.noding.NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);};jsts.noding.snapround.MCIndexSnapRounder.prototype.computeNodes=function(inputSegmentStrings){this.nodedSegStrings=inputSegmentStrings;this.noder=new jsts.noding.MCIndexNoder();this.pointSnapper=new jsts.noding.snapround.MCIndexPointSnapper(this.noder.getIndex());this.snapRound(inputSegmentStrings,this.li);};jsts.noding.snapround.MCIndexSnapRounder.prototype.snapRound=function(segStrings,li){var intersections=this.findInteriorIntersections(segStrings,li);this.computeIntersectionSnaps(intersections);this.computeVertexSnaps(segStrings);};jsts.noding.snapround.MCIndexSnapRounder.prototype.findInteriorIntersections=function(segStrings,li){var intFinderAdder=new jsts.noding.IntersectionFinderAdder(li);this.noder.setSegmentIntersector(intFinderAdder);this.noder.computeNodes(segStrings);return intFinderAdder.getInteriorIntersections();};jsts.noding.snapround.MCIndexSnapRounder.prototype.computeIntersectionSnaps=function(snapPts){for(var it=snapPts.iterator();it.hasNext();){var snapPt=it.next();var hotPixel=new jsts.noding.snapround.HotPixel(snapPt,this.scaleFactor,this.li);this.pointSnapper.snap(hotPixel);}};jsts.noding.snapround.MCIndexSnapRounder.prototype.computeVertexSnaps=function(edges){if(edges instanceof jsts.noding.NodedSegmentString){this.computeVertexSnaps2.apply(this,arguments);return;}
for(var i0=edges.iterator();i0.hasNext();){var edge0=i0.next();this.computeVertexSnaps(edge0);}};jsts.noding.snapround.MCIndexSnapRounder.prototype.computeVertexSnaps2=function(e){var pts0=e.getCoordinates();for(var i=0;i<pts0.length-1;i++){var hotPixel=new jsts.noding.snapround.HotPixel(pts0[i],this.scaleFactor,this.li);var isNodeAdded=this.pointSnapper.snap(hotPixel,e,i);if(isNodeAdded){e.addIntersection(pts0[i],i);}}};jsts.operation.valid.ConnectedInteriorTester=function(geomGraph){this.geomGraph=geomGraph;this.geometryFactory=new jsts.geom.GeometryFactory();this.disconnectedRingcoord=null;};jsts.operation.valid.ConnectedInteriorTester.findDifferentPoint=function(coord,pt){var i=0,il=coord.length;for(i;i<il;i++){if(!coord[i].equals(pt))
return coord[i];}
return null;};jsts.operation.valid.ConnectedInteriorTester.prototype.getCoordinate=function(){return this.disconnectedRingcoord;};jsts.operation.valid.ConnectedInteriorTester.prototype.isInteriorsConnected=function(){var splitEdges=new javascript.util.ArrayList();this.geomGraph.computeSplitEdges(splitEdges);var graph=new jsts.geomgraph.PlanarGraph(new jsts.operation.overlay.OverlayNodeFactory());graph.addEdges(splitEdges);this.setInteriorEdgesInResult(graph);graph.linkResultDirectedEdges();var edgeRings=this.buildEdgeRings(graph.getEdgeEnds());this.visitShellInteriors(this.geomGraph.getGeometry(),graph);return!this.hasUnvisitedShellEdge(edgeRings);};jsts.operation.valid.ConnectedInteriorTester.prototype.setInteriorEdgesInResult=function(graph){var it=graph.getEdgeEnds().iterator(),de;while(it.hasNext()){de=it.next();if(de.getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR){de.setInResult(true);}}};jsts.operation.valid.ConnectedInteriorTester.prototype.buildEdgeRings=function(dirEdges){var edgeRings=new javascript.util.ArrayList();for(var it=dirEdges.iterator();it.hasNext();){var de=it.next();if(de.isInResult()&&de.getEdgeRing()==null){var er=new jsts.operation.overlay.MaximalEdgeRing(de,this.geometryFactory);er.linkDirectedEdgesForMinimalEdgeRings();var minEdgeRings=er.buildMinimalRings();var i=0,il=minEdgeRings.length;for(i;i<il;i++){edgeRings.add(minEdgeRings[i]);}}}
return edgeRings;};jsts.operation.valid.ConnectedInteriorTester.prototype.visitShellInteriors=function(g,graph){if(g instanceof jsts.geom.Polygon){var p=g;this.visitInteriorRing(p.getExteriorRing(),graph);}
if(g instanceof jsts.geom.MultiPolygon){var mp=g;for(var i=0;i<mp.getNumGeometries();i++){var p=mp.getGeometryN(i);this.visitInteriorRing(p.getExteriorRing(),graph);}}};jsts.operation.valid.ConnectedInteriorTester.prototype.visitInteriorRing=function(ring,graph){var pts=ring.getCoordinates();var pt0=pts[0];var pt1=jsts.operation.valid.ConnectedInteriorTester.findDifferentPoint(pts,pt0);var e=graph.findEdgeInSameDirection(pt0,pt1);var de=graph.findEdgeEnd(e);var intDe=null;if(de.getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR){intDe=de;}else if(de.getSym().getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)==jsts.geom.Location.INTERIOR){intDe=de.getSym();}
this.visitLinkedDirectedEdges(intDe);};jsts.operation.valid.ConnectedInteriorTester.prototype.visitLinkedDirectedEdges=function(start){var startDe=start;var de=start;do{de.setVisited(true);de=de.getNext();}while(de!=startDe);};jsts.operation.valid.ConnectedInteriorTester.prototype.hasUnvisitedShellEdge=function(edgeRings){for(var i=0;i<edgeRings.size();i++){var er=edgeRings.get(i);if(er.isHole()){continue;}
var edges=er.getEdges();var de=edges[0];if(de.getLabel().getLocation(0,jsts.geomgraph.Position.RIGHT)!=jsts.geom.Location.INTERIOR){continue;}
for(var j=0;j<edges.length;j++){de=edges[j];if(!de.isVisited()){disconnectedRingcoord=de.getCoordinate();return true;}}}
return false;};jsts.algorithm.InteriorPointLine=function(geometry){this.centroid;this.minDistance=Number.MAX_VALUE;this.interiorPoint=null;this.centroid=geometry.getCentroid().getCoordinate();this.addInterior(geometry);if(this.interiorPoint==null){this.addEndpoints(geometry);}};jsts.algorithm.InteriorPointLine.prototype.getInteriorPoint=function(){return this.interiorPoint;};jsts.algorithm.InteriorPointLine.prototype.addInterior=function(geometry){if(geometry instanceof jsts.geom.LineString){this.addInteriorCoord(geometry.getCoordinates());}else if(geometry instanceof jsts.geom.GeometryCollection){for(var i=0;i<geometry.getNumGeometries();i++){this.addInterior(geometry.getGeometryN(i));}}};jsts.algorithm.InteriorPointLine.prototype.addInteriorCoord=function(pts){for(var i=1;i<pts.length-1;i++){this.add(pts[i]);}};jsts.algorithm.InteriorPointLine.prototype.addEndpoints=function(geometry){if(geometry instanceof jsts.geom.LineString){this.addEndpointsCoord(geometry.getCoordinates());}else if(geometry instanceof jsts.geom.GeometryCollection){for(var i=0;i<geometry.getNumGeometries();i++){this.addEndpoints(geometry.getGeometryN(i));}}};jsts.algorithm.InteriorPointLine.prototype.addEndpointsCoord=function(pts){this.add(pts[0]);this.add(pts[pts.length-1]);};jsts.algorithm.InteriorPointLine.prototype.add=function(point){var dist=point.distance(this.centroid);if(dist<this.minDistance){this.interiorPoint=new jsts.geom.Coordinate(point);this.minDistance=dist;}};jsts.index.chain.MonotoneChainSelectAction=function(){this.tempEnv1=new jsts.geom.Envelope();this.selectedSegment=new jsts.geom.LineSegment();};jsts.index.chain.MonotoneChainSelectAction.prototype.tempEnv1=null;jsts.index.chain.MonotoneChainSelectAction.prototype.selectedSegment=null;jsts.index.chain.MonotoneChainSelectAction.prototype.select=function(mc,start){mc.getLineSegment(start,this.selectedSegment);this.select2(this.selectedSegment);};jsts.index.chain.MonotoneChainSelectAction.prototype.select2=function(seg){};jsts.algorithm.MCPointInRing=function(ring){this.ring=ring;this.tree=null;this.crossings=0;this.interval=new jsts.index.bintree.Interval();this.buildIndex();};jsts.algorithm.MCPointInRing.MCSelecter=function(p,parent){this.parent=parent;this.p=p;};jsts.algorithm.MCPointInRing.MCSelecter.prototype=new jsts.index.chain.MonotoneChainSelectAction;jsts.algorithm.MCPointInRing.MCSelecter.prototype.constructor=jsts.algorithm.MCPointInRing.MCSelecter;jsts.algorithm.MCPointInRing.MCSelecter.prototype.select2=function(ls){this.parent.testLineSegment.apply(this.parent,[this.p,ls]);};jsts.algorithm.MCPointInRing.prototype.buildIndex=function(){this.tree=new jsts.index.bintree.Bintree();var pts=jsts.geom.CoordinateArrays.removeRepeatedPoints(this.ring.getCoordinates());var mcList=jsts.index.chain.MonotoneChainBuilder.getChains(pts);for(var i=0;i<mcList.length;i++){var mc=mcList[i];var mcEnv=mc.getEnvelope();this.interval.min=mcEnv.getMinY();this.interval.max=mcEnv.getMaxY();this.tree.insert(this.interval,mc);}};jsts.algorithm.MCPointInRing.prototype.isInside=function(pt){this.crossings=0;var rayEnv=new jsts.geom.Envelope(-Number.MAX_VALUE,Number.MAX_VALUE,pt.y,pt.y);this.interval.min=pt.y;this.interval.max=pt.y;var segs=this.tree.query(this.interval);var mcSelecter=new jsts.algorithm.MCPointInRing.MCSelecter(pt,this);for(var i=segs.iterator();i.hasNext();){var mc=i.next();this.testMonotoneChain(rayEnv,mcSelecter,mc);}
if((this.crossings%2)==1){return true;}
return false;};jsts.algorithm.MCPointInRing.prototype.testMonotoneChain=function(rayEnv,mcSelecter,mc){mc.select(rayEnv,mcSelecter);};jsts.algorithm.MCPointInRing.prototype.testLineSegment=function(p,seg){var xInt,x1,y1,x2,y2,p1,p2;p1=seg.p0;p2=seg.p1;x1=p1.x-p.x;y1=p1.y-p.y;x2=p2.x-p.x;y2=p2.y-p.y;if(((y1>0)&&(y2<=0))||((y2>0)&&(y1<=0))){xInt=jsts.algorithm.RobustDeterminant.signOfDet2x2(x1,y1,x2,y2)/(y2-y1);if(0.0<xInt){this.crossings++;}}};jsts.operation.valid.TopologyValidationError=function(errorType,pt){this.errorType=errorType;this.pt=null;if(pt!=null){this.pt=pt.clone();}};jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL=2;jsts.operation.valid.TopologyValidationError.NESTED_HOLES=3;jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR=4;jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION=5;jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION=6;jsts.operation.valid.TopologyValidationError.NESTED_SHELLS=7;jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS=8;jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS=9;jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE=10;jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED=11;jsts.operation.valid.TopologyValidationError.prototype.errMsg=['Topology Validation Error','Repeated Point','Hole lies outside shell','Holes are nested','Interior is disconnected','Self-intersection','Ring Self-intersection','Nested shells','Duplicate Rings','Too few distinct points in geometry component','Invalid Coordinate','Ring is not closed'];jsts.operation.valid.TopologyValidationError.prototype.getCoordinate=function(){return this.pt;};jsts.operation.valid.TopologyValidationError.prototype.getErrorType=function(){return this.errorType;};jsts.operation.valid.TopologyValidationError.prototype.getMessage=function(){return this.errMsg[this.errorType];};jsts.operation.valid.TopologyValidationError.prototype.toString=function(){var locStr='';if(this.pt!=null){locStr=' at or near point '+this.pt;return this.getMessage()+locStr;}
return locStr;};(function(){jsts.geom.MultiPolygon=function(geometries,factory){this.geometries=geometries||[];this.factory=factory;};jsts.geom.MultiPolygon.prototype=new jsts.geom.GeometryCollection();jsts.geom.MultiPolygon.constructor=jsts.geom.MultiPolygon;jsts.geom.MultiPolygon.prototype.getBoundary=function(){if(this.isEmpty()){return this.getFactory().createMultiLineString(null);}
var allRings=[];for(var i=0;i<this.geometries.length;i++){var polygon=this.geometries[i];var rings=polygon.getBoundary();for(var j=0;j<rings.getNumGeometries();j++){allRings.push(rings.getGeometryN(j));}}
return this.getFactory().createMultiLineString(allRings);};jsts.geom.MultiPolygon.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
return jsts.geom.GeometryCollection.prototype.equalsExact.call(this,other,tolerance);};jsts.geom.MultiPolygon.prototype.CLASS_NAME='jsts.geom.MultiPolygon';})();jsts.geom.CoordinateSequenceFilter=function(){};jsts.geom.CoordinateSequenceFilter.prototype.filter=jsts.abstractFunc;jsts.geom.CoordinateSequenceFilter.prototype.isDone=jsts.abstractFunc;jsts.geom.CoordinateSequenceFilter.prototype.isGeometryChanged=jsts.abstractFunc;(function(){var Interval=function(){this.min=0.0;this.max=0.0;if(arguments.length===1){var interval=arguments[0];this.init(interval.min,interval.max);}else if(arguments.length===2){this.init(arguments[0],arguments[1]);}};Interval.prototype.init=function(min,max){this.min=min;this.max=max;if(min>max){this.min=max;this.max=min;}};Interval.prototype.getMin=function(){return this.min;};Interval.prototype.getMax=function(){return this.max;};Interval.prototype.getWidth=function(){return(this.max-this.min);};Interval.prototype.expandToInclude=function(interval){if(interval.max>this.max){this.max=interval.max;}
if(interval.min<this.min){this.min=interval.min;}};Interval.prototype.overlaps=function(){if(arguments.length===1){return this.overlapsInterval.apply(this,arguments);}else{return this.overlapsMinMax.apply(this,arguments);}};Interval.prototype.overlapsInterval=function(interval){return this.overlaps(interval.min,interval.max);};Interval.prototype.overlapsMinMax=function(min,max){if(this.min>max||this.max<min){return false;}
return true;};Interval.prototype.contains=function(){var interval;if(arguments[0]instanceof jsts.index.bintree.Interval){interval=arguments[0];return this.containsMinMax(interval.min,interval.max);}else if(arguments.length===1){return this.containsPoint(arguments[0]);}else{return this.containsMinMax(arguments[0],arguments[1]);}};Interval.prototype.containsMinMax=function(min,max){return(min>=this.min&&max<=this.max);};Interval.prototype.containsPoint=function(p){return(p>=this.min&&p<=this.max);};jsts.index.bintree.Interval=Interval;})();jsts.index.DoubleBits=function(){};jsts.index.DoubleBits.powerOf2=function(exp){return Math.pow(2,exp);};jsts.index.DoubleBits.exponent=function(d){return jsts.index.DoubleBits.CVTFWD(64,d)-1023;};jsts.index.DoubleBits.CVTFWD=function(NumW,Qty){var Sign,Expo,Mant,Bin,nb01='';var Inf={32:{d:0x7F,c:0x80,b:0,a:0},64:{d:0x7FF0,c:0,b:0,a:0}};var ExW={32:8,64:11}[NumW],MtW=NumW-ExW-1;if(!Bin){Sign=Qty<0||1/Qty<0;if(!isFinite(Qty)){Bin=Inf[NumW];if(Sign){Bin.d+=1<<(NumW/4-1);}
Expo=Math.pow(2,ExW)-1;Mant=0;}}
if(!Bin){Expo={32:127,64:1023}[NumW];Mant=Math.abs(Qty);while(Mant>=2){Expo++;Mant/=2;}
while(Mant<1&&Expo>0){Expo--;Mant*=2;}
if(Expo<=0){Mant/=2;nb01='Zero or Denormal';}
if(NumW===32&&Expo>254){nb01='Too big for Single';Bin={d:Sign?0xFF:0x7F,c:0x80,b:0,a:0};Expo=Math.pow(2,ExW)-1;Mant=0;}}
return Expo;};(function(){var DoubleBits=jsts.index.DoubleBits;var Interval=jsts.index.bintree.Interval;var Key=function(interval){this.pt=0.0;this.level=0;this.computeKey(interval);};Key.computeLevel=function(interval){var dx=interval.getWidth(),level;level=DoubleBits.exponent(dx)+1;return level;};Key.prototype.getPoint=function(){return this.pt;};Key.prototype.getLevel=function(){return this.level;};Key.prototype.getInterval=function(){return this.interval;};Key.prototype.computeKey=function(itemInterval){this.level=Key.computeLevel(itemInterval);this.interval=new Interval();this.computeInterval(this.level,itemInterval);while(!this.interval.contains(itemInterval)){this.level+=1;this.computeInterval(this.level,itemInterval);}};Key.prototype.computeInterval=function(level,itemInterval){var size=DoubleBits.powerOf2(level);this.pt=Math.floor(itemInterval.getMin()/size)*size;this.interval.init(this.pt,this.pt+size);};jsts.index.bintree.Key=Key;})();jsts.operation.buffer.SubgraphDepthLocater=function(subgraphs){this.subgraphs=[];this.seg=new jsts.geom.LineSegment();this.subgraphs=subgraphs;};jsts.operation.buffer.SubgraphDepthLocater.prototype.subgraphs=null;jsts.operation.buffer.SubgraphDepthLocater.prototype.seg=null;jsts.operation.buffer.SubgraphDepthLocater.prototype.getDepth=function(p){var stabbedSegments=this.findStabbedSegments(p);if(stabbedSegments.length===0)
return 0;stabbedSegments.sort();var ds=stabbedSegments[0];return ds.leftDepth;};jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments=function(stabbingRayLeftPt){if(arguments.length===3){this.findStabbedSegments2.apply(this,arguments);return;}
var stabbedSegments=[];for(var i=0;i<this.subgraphs.length;i++){var bsg=this.subgraphs[i];var env=bsg.getEnvelope();if(stabbingRayLeftPt.y<env.getMinY()||stabbingRayLeftPt.y>env.getMaxY())
continue;this.findStabbedSegments2(stabbingRayLeftPt,bsg.getDirectedEdges(),stabbedSegments);}
return stabbedSegments;};jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments2=function(stabbingRayLeftPt,dirEdges,stabbedSegments){if(arguments[1]instanceof jsts.geomgraph.DirectedEdge){this.findStabbedSegments3(stabbingRayLeftPt,dirEdges,stabbedSegments);return;}
for(var i=dirEdges.iterator();i.hasNext();){var de=i.next();if(!de.isForward())
continue;this.findStabbedSegments3(stabbingRayLeftPt,de,stabbedSegments);}};jsts.operation.buffer.SubgraphDepthLocater.prototype.findStabbedSegments3=function(stabbingRayLeftPt,dirEdge,stabbedSegments){var pts=dirEdge.getEdge().getCoordinates();for(var i=0;i<pts.length-1;i++){this.seg.p0=pts[i];this.seg.p1=pts[i+1];if(this.seg.p0.y>this.seg.p1.y)
this.seg.reverse();var maxx=Math.max(this.seg.p0.x,this.seg.p1.x);if(maxx<stabbingRayLeftPt.x)
continue;if(this.seg.isHorizontal())
continue;if(stabbingRayLeftPt.y<this.seg.p0.y||stabbingRayLeftPt.y>this.seg.p1.y)
continue;if(jsts.algorithm.CGAlgorithms.computeOrientation(this.seg.p0,this.seg.p1,stabbingRayLeftPt)===jsts.algorithm.CGAlgorithms.RIGHT)
continue;var depth=dirEdge.getDepth(jsts.geomgraph.Position.LEFT);if(!this.seg.p0.equals(pts[i]))
depth=dirEdge.getDepth(jsts.geomgraph.Position.RIGHT);var ds=new jsts.operation.buffer.SubgraphDepthLocater.DepthSegment(this.seg,depth);stabbedSegments.push(ds);}};jsts.operation.buffer.SubgraphDepthLocater.DepthSegment=function(seg,depth){this.upwardSeg=new jsts.geom.LineSegment(seg);this.leftDepth=depth;};jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.upwardSeg=null;jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.leftDepth=null;jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.compareTo=function(obj){var other=obj;var orientIndex=this.upwardSeg.orientationIndex(other.upwardSeg);if(orientIndex===0)
orientIndex=-1*other.upwardSeg.orientationIndex(upwardSeg);if(orientIndex!==0)
return orientIndex;return this.compareX(this.upwardSeg,other.upwardSeg);};jsts.operation.buffer.SubgraphDepthLocater.DepthSegment.prototype.compareX=function(seg0,seg1){var compare0=seg0.p0.compareTo(seg1.p0);if(compare0!==0)
return compare0;return seg0.p1.compareTo(seg1.p1);};jsts.noding.snapround.HotPixel=function(pt,scaleFactor,li){this.corner=[];this.originalPt=pt;this.pt=pt;this.scaleFactor=scaleFactor;this.li=li;if(this.scaleFactor!==1.0){this.pt=new jsts.geom.Coordinate(this.scale(pt.x),this.scale(pt.y));this.p0Scaled=new jsts.geom.Coordinate();this.p1Scaled=new jsts.geom.Coordinate();}
this.initCorners(this.pt);};jsts.noding.snapround.HotPixel.prototype.li=null;jsts.noding.snapround.HotPixel.prototype.pt=null;jsts.noding.snapround.HotPixel.prototype.originalPt=null;jsts.noding.snapround.HotPixel.prototype.ptScaled=null;jsts.noding.snapround.HotPixel.prototype.p0Scaled=null;jsts.noding.snapround.HotPixel.prototype.p1Scaled=null;jsts.noding.snapround.HotPixel.prototype.scaleFactor=undefined;jsts.noding.snapround.HotPixel.prototype.minx=undefined;jsts.noding.snapround.HotPixel.prototype.maxx=undefined;jsts.noding.snapround.HotPixel.prototype.miny=undefined;jsts.noding.snapround.HotPixel.prototype.maxy=undefined;jsts.noding.snapround.HotPixel.prototype.corner=null;jsts.noding.snapround.HotPixel.prototype.safeEnv=null;jsts.noding.snapround.HotPixel.prototype.getCoordinate=function(){return this.originalPt;};jsts.noding.snapround.HotPixel.SAFE_ENV_EXPANSION_FACTOR=0.75;jsts.noding.snapround.HotPixel.prototype.getSafeEnvelope=function(){if(this.safeEnv===null){var safeTolerance=jsts.noding.snapround.HotPixel.SAFE_ENV_EXPANSION_FACTOR/this.scaleFactor;this.safeEnv=new jsts.geom.Envelope(this.originalPt.x-safeTolerance,this.originalPt.x+safeTolerance,this.originalPt.y-safeTolerance,this.originalPt.y+safeTolerance);}
return this.safeEnv;};jsts.noding.snapround.HotPixel.prototype.initCorners=function(pt){var tolerance=0.5;this.minx=pt.x-tolerance;this.maxx=pt.x+tolerance;this.miny=pt.y-tolerance;this.maxy=pt.y+tolerance;this.corner[0]=new jsts.geom.Coordinate(this.maxx,this.maxy);this.corner[1]=new jsts.geom.Coordinate(this.minx,this.maxy);this.corner[2]=new jsts.geom.Coordinate(this.minx,this.miny);this.corner[3]=new jsts.geom.Coordinate(this.maxx,this.miny);};jsts.noding.snapround.HotPixel.prototype.scale=function(val){return Math.round(val*this.scaleFactor);};jsts.noding.snapround.HotPixel.prototype.intersects=function(p0,p1){if(this.scaleFactor===1.0)
return this.intersectsScaled(p0,p1);this.copyScaled(p0,this.p0Scaled);this.copyScaled(p1,this.p1Scaled);return this.intersectsScaled(this.p0Scaled,this.p1Scaled);};jsts.noding.snapround.HotPixel.prototype.copyScaled=function(p,pScaled){pScaled.x=this.scale(p.x);pScaled.y=this.scale(p.y);};jsts.noding.snapround.HotPixel.prototype.intersectsScaled=function(p0,p1){var segMinx=Math.min(p0.x,p1.x);var segMaxx=Math.max(p0.x,p1.x);var segMiny=Math.min(p0.y,p1.y);var segMaxy=Math.max(p0.y,p1.y);var isOutsidePixelEnv=this.maxx<segMinx||this.minx>segMaxx||this.maxy<segMiny||this.miny>segMaxy;if(isOutsidePixelEnv)
return false;var intersects=this.intersectsToleranceSquare(p0,p1);jsts.util.Assert.isTrue(!(isOutsidePixelEnv&&intersects),'Found bad envelope test');return intersects;};jsts.noding.snapround.HotPixel.prototype.intersectsToleranceSquare=function(p0,p1){var intersectsLeft=false;var intersectsBottom=false;this.li.computeIntersection(p0,p1,this.corner[0],this.corner[1]);if(this.li.isProper())
return true;this.li.computeIntersection(p0,p1,this.corner[1],this.corner[2]);if(this.li.isProper())
return true;if(this.li.hasIntersection())
intersectsLeft=true;this.li.computeIntersection(p0,p1,this.corner[2],this.corner[3]);if(this.li.isProper())
return true;if(this.li.hasIntersection())
intersectsBottom=true;this.li.computeIntersection(p0,p1,this.corner[3],this.corner[0]);if(this.li.isProper())
return true;if(intersectsLeft&&intersectsBottom)
return true;if(p0.equals(this.pt))
return true;if(p1.equals(this.pt))
return true;return false;};jsts.noding.snapround.HotPixel.prototype.intersectsPixelClosure=function(p0,p1){this.li.computeIntersection(p0,p1,this.corner[0],this.corner[1]);if(this.li.hasIntersection())
return true;this.li.computeIntersection(p0,p1,this.corner[1],this.corner[2]);if(this.li.hasIntersection())
return true;this.li.computeIntersection(p0,p1,this.corner[2],this.corner[3]);if(this.li.hasIntersection())
return true;this.li.computeIntersection(p0,p1,this.corner[3],this.corner[0]);if(this.li.hasIntersection())
return true;return false;};jsts.noding.snapround.HotPixel.prototype.addSnappedNode=function(segStr,segIndex){var p0=segStr.getCoordinate(segIndex);var p1=segStr.getCoordinate(segIndex+1);if(this.intersects(p0,p1)){segStr.addIntersection(this.getCoordinate(),segIndex);return true;}
return false;};jsts.operation.buffer.BufferInputLineSimplifier=function(inputLine){this.inputLine=inputLine;};jsts.operation.buffer.BufferInputLineSimplifier.simplify=function(inputLine,distanceTol){var simp=new jsts.operation.buffer.BufferInputLineSimplifier(inputLine);return simp.simplify(distanceTol);};jsts.operation.buffer.BufferInputLineSimplifier.INIT=0;jsts.operation.buffer.BufferInputLineSimplifier.DELETE=1;jsts.operation.buffer.BufferInputLineSimplifier.KEEP=1;jsts.operation.buffer.BufferInputLineSimplifier.prototype.inputLine=null;jsts.operation.buffer.BufferInputLineSimplifier.prototype.distanceTol=null;jsts.operation.buffer.BufferInputLineSimplifier.prototype.isDeleted=null;jsts.operation.buffer.BufferInputLineSimplifier.prototype.angleOrientation=jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;jsts.operation.buffer.BufferInputLineSimplifier.prototype.simplify=function(distanceTol){this.distanceTol=Math.abs(distanceTol);if(distanceTol<0)
this.angleOrientation=jsts.algorithm.CGAlgorithms.CLOCKWISE;this.isDeleted=[];this.isDeleted.length=this.inputLine.length;var isChanged=false;do{isChanged=this.deleteShallowConcavities();}while(isChanged);return this.collapseLine();};jsts.operation.buffer.BufferInputLineSimplifier.prototype.deleteShallowConcavities=function(){var index=1;var maxIndex=this.inputLine.length-1;var midIndex=this.findNextNonDeletedIndex(index);var lastIndex=this.findNextNonDeletedIndex(midIndex);var isChanged=false;while(lastIndex<this.inputLine.length){var isMiddleVertexDeleted=false;if(this.isDeletable(index,midIndex,lastIndex,this.distanceTol)){this.isDeleted[midIndex]=jsts.operation.buffer.BufferInputLineSimplifier.DELETE;isMiddleVertexDeleted=true;isChanged=true;}
if(isMiddleVertexDeleted)
index=lastIndex;else
index=midIndex;midIndex=this.findNextNonDeletedIndex(index);lastIndex=this.findNextNonDeletedIndex(midIndex);}
return isChanged;};jsts.operation.buffer.BufferInputLineSimplifier.prototype.findNextNonDeletedIndex=function(index){var next=index+1;while(next<this.inputLine.length&&this.isDeleted[next]===jsts.operation.buffer.BufferInputLineSimplifier.DELETE)
next++;return next;};jsts.operation.buffer.BufferInputLineSimplifier.prototype.collapseLine=function(){var coordList=[];for(var i=0;i<this.inputLine.length;i++){if(this.isDeleted[i]!==jsts.operation.buffer.BufferInputLineSimplifier.DELETE)
coordList.push(this.inputLine[i]);}
return coordList;};jsts.operation.buffer.BufferInputLineSimplifier.prototype.isDeletable=function(i0,i1,i2,distanceTol){var p0=this.inputLine[i0];var p1=this.inputLine[i1];var p2=this.inputLine[i2];if(!this.isConcave(p0,p1,p2))
return false;if(!this.isShallow(p0,p1,p2,distanceTol))
return false;return this.isShallowSampled(p0,p1,i0,i2,distanceTol);};jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallowConcavity=function(p0,p1,p2,distanceTol){var orientation=jsts.algorithm.CGAlgorithms.computeOrientation(p0,p1,p2);var isAngleToSimplify=(orientation===this.angleOrientation);if(!isAngleToSimplify)
return false;var dist=jsts.algorithm.CGAlgorithms.distancePointLine(p1,p0,p2);return dist<distanceTol;};jsts.operation.buffer.BufferInputLineSimplifier.NUM_PTS_TO_CHECK=10;jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallowSampled=function(p0,p2,i0,i2,distanceTol){var inc=parseInt((i2-i0)/jsts.operation.buffer.BufferInputLineSimplifier.NUM_PTS_TO_CHECK);if(inc<=0)
inc=1;for(var i=i0;i<i2;i+=inc){if(!this.isShallow(p0,p2,this.inputLine[i],distanceTol))
return false;}
return true;};jsts.operation.buffer.BufferInputLineSimplifier.prototype.isShallow=function(p0,p1,p2,distanceTol){var dist=jsts.algorithm.CGAlgorithms.distancePointLine(p1,p0,p2);return dist<distanceTol;};jsts.operation.buffer.BufferInputLineSimplifier.prototype.isConcave=function(p0,p1,p2){var orientation=jsts.algorithm.CGAlgorithms.computeOrientation(p0,p1,p2);var isConcave=(orientation===this.angleOrientation);return isConcave;};jsts.geomgraph.index.SweepLineEvent=function(x,obj,label){if(!(obj instanceof jsts.geomgraph.index.SweepLineEvent)){this.eventType=jsts.geomgraph.index.SweepLineEvent.INSERT;this.label=label;this.xValue=x;this.obj=obj;return;}
this.eventType=jsts.geomgraph.index.SweepLineEvent.DELETE;this.xValue=x;this.insertEvent=obj;};jsts.geomgraph.index.SweepLineEvent.INSERT=1;jsts.geomgraph.index.SweepLineEvent.DELETE=2;jsts.geomgraph.index.SweepLineEvent.prototype.label=null;jsts.geomgraph.index.SweepLineEvent.prototype.xValue=null;jsts.geomgraph.index.SweepLineEvent.prototype.eventType=null;jsts.geomgraph.index.SweepLineEvent.prototype.insertEvent=null;jsts.geomgraph.index.SweepLineEvent.prototype.deleteEventIndex=null;jsts.geomgraph.index.SweepLineEvent.prototype.obj=null;jsts.geomgraph.index.SweepLineEvent.prototype.isInsert=function(){return this.eventType==jsts.geomgraph.index.SweepLineEvent.INSERT;};jsts.geomgraph.index.SweepLineEvent.prototype.isDelete=function(){return this.eventType==jsts.geomgraph.index.SweepLineEvent.DELETE;};jsts.geomgraph.index.SweepLineEvent.prototype.getInsertEvent=function(){return this.insertEvent;};jsts.geomgraph.index.SweepLineEvent.prototype.getDeleteEventIndex=function(){return this.deleteEventIndex;};jsts.geomgraph.index.SweepLineEvent.prototype.setDeleteEventIndex=function(deleteEventIndex){this.deleteEventIndex=deleteEventIndex;};jsts.geomgraph.index.SweepLineEvent.prototype.getObject=function(){return this.obj;};jsts.geomgraph.index.SweepLineEvent.prototype.isSameLabel=function(ev){if(this.label==null){return false;}
return this.label==ev.label;};jsts.geomgraph.index.SweepLineEvent.prototype.compareTo=function(pe){if(this.xValue<pe.xValue){return-1;}
if(this.xValue>pe.xValue){return 1;}
if(this.eventType<pe.eventType){return-1;}
if(this.eventType>pe.eventType){return 1;}
return 0;};jsts.geom.CoordinateList=function(coord,allowRepeated){this.array=[];allowRepeated=(allowRepeated===undefined)?true:allowRepeated;if(coord!==undefined){this.add(coord,allowRepeated);}};jsts.geom.CoordinateList.prototype=new javascript.util.ArrayList();jsts.geom.CoordinateList.prototype.iterator=null;jsts.geom.CoordinateList.prototype.remove=null;jsts.geom.CoordinateList.prototype.get=function(i){return this.array[i];};jsts.geom.CoordinateList.prototype.set=function(i,e){var o=this.array[i];this.array[i]=e;return o;};jsts.geom.CoordinateList.prototype.size=function(){return this.array.length;};jsts.geom.CoordinateList.prototype.add=function(){if(arguments.length>1){return this.addCoordinates.apply(this,arguments);}else{return this.array.push(arguments[0]);}};jsts.geom.CoordinateList.prototype.addCoordinates=function(coord,allowRepeated,direction){if(coord instanceof jsts.geom.Coordinate){return this.addCoordinate.apply(this,arguments);}else if(typeof coord==='number'){return this.insertCoordinate.apply(this,arguments);}
direction=direction||true;if(direction){for(var i=0;i<coord.length;i++){this.addCoordinate(coord[i],allowRepeated);}}else{for(var i=coord.length-1;i>=0;i--){this.addCoordinate(coord[i],allowRepeated);}}
return true;};jsts.geom.CoordinateList.prototype.addCoordinate=function(coord,allowRepeated){if(!allowRepeated){if(this.size()>=1){var last=this.get(this.size()-1);if(last.equals2D(coord))return;}}
this.add(coord);};jsts.geom.CoordinateList.prototype.insertCoordinate=function(index,coord,allowRepeated){if(!allowRepeated){var before=index>0?index-1:-1;if(before!==-1&&this.get(before).equals2D(coord)){return;}
var after=index<this.size()-1?index+1:-1;if(after!==-1&&this.get(after).equals2D(coord)){return;}}
this.array.splice(index,0,coord);};jsts.geom.CoordinateList.prototype.closeRing=function(){if(this.size()>0){this.addCoordinate(new jsts.geom.Coordinate(this.get(0)),false);}};jsts.geom.CoordinateList.prototype.toArray=function(){return this.array;};jsts.geom.CoordinateList.prototype.toCoordinateArray=function(){return this.array;};jsts.operation.buffer.OffsetSegmentGenerator=function(precisionModel,bufParams,distance){this.seg0=new jsts.geom.LineSegment();this.seg1=new jsts.geom.LineSegment();this.offset0=new jsts.geom.LineSegment();this.offset1=new jsts.geom.LineSegment();this.precisionModel=precisionModel;this.bufParams=bufParams;this.li=new jsts.algorithm.RobustLineIntersector();this.filletAngleQuantum=Math.PI/2.0/bufParams.getQuadrantSegments();if(this.bufParams.getQuadrantSegments()>=8&&this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_ROUND){this.closingSegLengthFactor=jsts.operation.buffer.OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR;}
this.init(distance);};jsts.operation.buffer.OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR=1.0E-3;jsts.operation.buffer.OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR=1.0E-3;jsts.operation.buffer.OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR=1.0E-6;jsts.operation.buffer.OffsetSegmentGenerator.MAX_CLOSING_SEG_LEN_FACTOR=80;jsts.operation.buffer.OffsetSegmentGenerator.prototype.maxCurveSegmentError=0.0;jsts.operation.buffer.OffsetSegmentGenerator.prototype.filletAngleQuantum=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.closingSegLengthFactor=1;jsts.operation.buffer.OffsetSegmentGenerator.prototype.segList=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.distance=0.0;jsts.operation.buffer.OffsetSegmentGenerator.prototype.precisionModel=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.bufParams=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.li=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.s0=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.s1=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.s2=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.seg0=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.seg1=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.offset0=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.offset1=null;jsts.operation.buffer.OffsetSegmentGenerator.prototype.side=0;jsts.operation.buffer.OffsetSegmentGenerator.prototype.hasNarrowConcaveAngle=false;jsts.operation.buffer.OffsetSegmentGenerator.prototype.hasNarrowConcaveAngle=function(){return this.hasNarrowConcaveAngle;};jsts.operation.buffer.OffsetSegmentGenerator.prototype.init=function(distance){this.distance=distance;this.maxCurveSegmentError=this.distance*(1-Math.cos(this.filletAngleQuantum/2.0));this.segList=new jsts.operation.buffer.OffsetSegmentString();this.segList.setPrecisionModel(this.precisionModel);this.segList.setMinimumVertexDistance(this.distance*jsts.operation.buffer.OffsetSegmentGenerator.CURVE_VERTEX_SNAP_DISTANCE_FACTOR);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.initSideSegments=function(s1,s2,side){this.s1=s1;this.s2=s2;this.side=side;this.seg1.setCoordinates(this.s1,this.s2);this.computeOffsetSegment(this.seg1,this.side,this.distance,this.offset1);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.getCoordinates=function(){return this.segList.getCoordinates();};jsts.operation.buffer.OffsetSegmentGenerator.prototype.closeRing=function(){this.segList.closeRing();};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addSegments=function(pt,isForward){this.segList.addPts(pt,isForward);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFirstSegment=function(){this.segList.addPt(this.offset1.p0);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLastSegment=function(){this.segList.addPt(this.offset1.p1);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addNextSegment=function(p,addStartPoint){this.s0=this.s1;this.s1=this.s2;this.s2=p;this.seg0.setCoordinates(this.s0,this.s1);this.computeOffsetSegment(this.seg0,this.side,this.distance,this.offset0);this.seg1.setCoordinates(this.s1,this.s2);this.computeOffsetSegment(this.seg1,this.side,this.distance,this.offset1);if(this.s1.equals(this.s2))
return;var orientation=jsts.algorithm.CGAlgorithms.computeOrientation(this.s0,this.s1,this.s2);var outsideTurn=(orientation===jsts.algorithm.CGAlgorithms.CLOCKWISE&&this.side===jsts.geomgraph.Position.LEFT)||(orientation===jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE&&this.side===jsts.geomgraph.Position.RIGHT);if(orientation==0){this.addCollinear(addStartPoint);}else if(outsideTurn){this.addOutsideTurn(orientation,addStartPoint);}else{this.addInsideTurn(orientation,addStartPoint);}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addCollinear=function(addStartPoint){this.li.computeIntersection(this.s0,this.s1,this.s1,this.s2);var numInt=this.li.getIntersectionNum();if(numInt>=2){if(this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_BEVEL||this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_MITRE){if(addStartPoint)
this.segList.addPt(this.offset0.p1);this.segList.addPt(this.offset1.p0);}else{this.addFillet(this.s1,this.offset0.p1,this.offset1.p0,jsts.algorithm.CGAlgorithms.CLOCKWISE,this.distance);}}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addOutsideTurn=function(orientation,addStartPoint){if(this.offset0.p1.distance(this.offset1.p0)<this.distance*jsts.operation.buffer.OffsetSegmentGenerator.OFFSET_SEGMENT_SEPARATION_FACTOR){this.segList.addPt(this.offset0.p1);return;}
if(this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_MITRE){this.addMitreJoin(this.s1,this.offset0,this.offset1,this.distance);}else if(this.bufParams.getJoinStyle()===jsts.operation.buffer.BufferParameters.JOIN_BEVEL){this.addBevelJoin(this.offset0,this.offset1);}else{if(addStartPoint)
this.segList.addPt(this.offset0.p1);this.addFillet(this.s1,this.offset0.p1,this.offset1.p0,orientation,this.distance);this.segList.addPt(this.offset1.p0);}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addInsideTurn=function(orientation,addStartPoint){this.li.computeIntersection(this.offset0.p0,this.offset0.p1,this.offset1.p0,this.offset1.p1);if(this.li.hasIntersection()){this.segList.addPt(this.li.getIntersection(0));}else{this.hasNarrowConcaveAngle=true;if(this.offset0.p1.distance(this.offset1.p0)<this.distance*jsts.operation.buffer.OffsetSegmentGenerator.INSIDE_TURN_VERTEX_SNAP_DISTANCE_FACTOR){this.segList.addPt(this.offset0.p1);}else{this.segList.addPt(this.offset0.p1);if(this.closingSegLengthFactor>0){var mid0=new jsts.geom.Coordinate((this.closingSegLengthFactor*this.offset0.p1.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset0.p1.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(mid0);var mid1=new jsts.geom.Coordinate((this.closingSegLengthFactor*this.offset1.p0.x+this.s1.x)/(this.closingSegLengthFactor+1),(this.closingSegLengthFactor*this.offset1.p0.y+this.s1.y)/(this.closingSegLengthFactor+1));this.segList.addPt(mid1);}else{this.segList.addPt(this.s1);}
this.segList.addPt(this.offset1.p0);}}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.computeOffsetSegment=function(seg,side,distance,offset){var sideSign=side===jsts.geomgraph.Position.LEFT?1:-1;var dx=seg.p1.x-seg.p0.x;var dy=seg.p1.y-seg.p0.y;var len=Math.sqrt(dx*dx+dy*dy);var ux=sideSign*distance*dx/len;var uy=sideSign*distance*dy/len;offset.p0.x=seg.p0.x-uy;offset.p0.y=seg.p0.y+ux;offset.p1.x=seg.p1.x-uy;offset.p1.y=seg.p1.y+ux;};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLineEndCap=function(p0,p1){var seg=new jsts.geom.LineSegment(p0,p1);var offsetL=new jsts.geom.LineSegment();this.computeOffsetSegment(seg,jsts.geomgraph.Position.LEFT,this.distance,offsetL);var offsetR=new jsts.geom.LineSegment();this.computeOffsetSegment(seg,jsts.geomgraph.Position.RIGHT,this.distance,offsetR);var dx=p1.x-p0.x;var dy=p1.y-p0.y;var angle=Math.atan2(dy,dx);switch(this.bufParams.getEndCapStyle()){case jsts.operation.buffer.BufferParameters.CAP_ROUND:this.segList.addPt(offsetL.p1);this.addFillet(p1,angle+Math.PI/2,angle-Math.PI/2,jsts.algorithm.CGAlgorithms.CLOCKWISE,this.distance);this.segList.addPt(offsetR.p1);break;case jsts.operation.buffer.BufferParameters.CAP_FLAT:this.segList.addPt(offsetL.p1);this.segList.addPt(offsetR.p1);break;case jsts.operation.buffer.BufferParameters.CAP_SQUARE:var squareCapSideOffset=new jsts.geom.Coordinate();squareCapSideOffset.x=Math.abs(this.distance)*Math.cos(angle);squareCapSideOffset.y=Math.abs(this.distance)*Math.sin(angle);var squareCapLOffset=new jsts.geom.Coordinate(offsetL.p1.x+
squareCapSideOffset.x,offsetL.p1.y+squareCapSideOffset.y);var squareCapROffset=new jsts.geom.Coordinate(offsetR.p1.x+
squareCapSideOffset.x,offsetR.p1.y+squareCapSideOffset.y);this.segList.addPt(squareCapLOffset);this.segList.addPt(squareCapROffset);break;}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addMitreJoin=function(p,offset0,offset1,distance){var isMitreWithinLimit=true;var intPt=null;try{intPt=jsts.algorithm.HCoordinate.intersection(offset0.p0,offset0.p1,offset1.p0,offset1.p1);var mitreRatio=distance<=0.0?1.0:intPt.distance(p)/Math.abs(distance);if(mitreRatio>this.bufParams.getMitreLimit())
this.isMitreWithinLimit=false;}catch(e){if(e instanceof jsts.error.NotRepresentableError){intPt=new jsts.geom.Coordinate(0,0);this.isMitreWithinLimit=false;}}
if(isMitreWithinLimit){this.segList.addPt(intPt);}else{this.addLimitedMitreJoin(offset0,offset1,distance,bufParams.getMitreLimit());}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addLimitedMitreJoin=function(offset0,offset1,distance,mitreLimit){var basePt=this.seg0.p1;var ang0=jsts.algorithm.Angle.angle(basePt,this.seg0.p0);var ang1=jsts.algorithm.Angle.angle(basePt,this.seg1.p1);var angDiff=jsts.algorithm.Angle.angleBetweenOriented(this.seg0.p0,basePt,this.seg1.p1);var angDiffHalf=angDiff/2;var midAng=jsts.algorithm.Angle.normalize(ang0+angDiffHalf);var mitreMidAng=jsts.algorithm.Angle.normalize(midAng+Math.PI);var mitreDist=mitreLimit*distance;var bevelDelta=mitreDist*Math.abs(Math.sin(angDiffHalf));var bevelHalfLen=distance-bevelDelta;var bevelMidX=basePt.x+mitreDist*Math.cos(mitreMidAng);var bevelMidY=basePt.y+mitreDist*Math.sin(mitreMidAng);var bevelMidPt=new jsts.geom.Coordinate(bevelMidX,bevelMidY);var mitreMidLine=new jsts.geom.LineSegment(basePt,bevelMidPt);var bevelEndLeft=mitreMidLine.pointAlongOffset(1.0,bevelHalfLen);var bevelEndRight=mitreMidLine.pointAlongOffset(1.0,-bevelHalfLen);if(this.side==jsts.geomgraph.Position.LEFT){this.segList.addPt(bevelEndLeft);this.segList.addPt(bevelEndRight);}else{this.segList.addPt(bevelEndRight);this.segList.addPt(bevelEndLeft);}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addBevelJoin=function(offset0,offset1){this.segList.addPt(offset0.p1);this.segList.addPt(offset1.p0);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFillet=function(p,p0,p1,direction,radius){if(!(p1 instanceof jsts.geom.Coordinate)){this.addFillet2.apply(this,arguments);return;}
var dx0=p0.x-p.x;var dy0=p0.y-p.y;var startAngle=Math.atan2(dy0,dx0);var dx1=p1.x-p.x;var dy1=p1.y-p.y;var endAngle=Math.atan2(dy1,dx1);if(direction===jsts.algorithm.CGAlgorithms.CLOCKWISE){if(startAngle<=endAngle)
startAngle+=2.0*Math.PI;}else{if(startAngle>=endAngle)
startAngle-=2.0*Math.PI;}
this.segList.addPt(p0);this.addFillet(p,startAngle,endAngle,direction,radius);this.segList.addPt(p1);};jsts.operation.buffer.OffsetSegmentGenerator.prototype.addFillet2=function(p,startAngle,endAngle,direction,radius){var directionFactor=direction===jsts.algorithm.CGAlgorithms.CLOCKWISE?-1:1;var totalAngle=Math.abs(startAngle-endAngle);var nSegs=parseInt((totalAngle/this.filletAngleQuantum+0.5));if(nSegs<1)
return;var initAngle,currAngleInc;initAngle=0.0;currAngleInc=totalAngle/nSegs;var currAngle=initAngle;var pt=new jsts.geom.Coordinate();while(currAngle<totalAngle){var angle=startAngle+directionFactor*currAngle;pt.x=p.x+radius*Math.cos(angle);pt.y=p.y+radius*Math.sin(angle);this.segList.addPt(pt);currAngle+=currAngleInc;}};jsts.operation.buffer.OffsetSegmentGenerator.prototype.createCircle=function(p){var pt=new jsts.geom.Coordinate(p.x+this.distance,p.y);this.segList.addPt(pt);this.addFillet(p,0.0,2.0*Math.PI,-1,this.distance);this.segList.closeRing();};jsts.operation.buffer.OffsetSegmentGenerator.prototype.createSquare=function(p){this.segList.addPt(new jsts.geom.Coordinate(p.x+distance,p.y+distance));this.segList.addPt(new jsts.geom.Coordinate(p.x+distance,p.y-distance));this.segList.addPt(new jsts.geom.Coordinate(p.x-distance,p.y-distance));this.segList.addPt(new jsts.geom.Coordinate(p.x-distance,p.y+distance));this.segList.closeRing();};jsts.operation.overlay.MaximalEdgeRing=function(start,geometryFactory){jsts.geomgraph.EdgeRing.call(this,start,geometryFactory);};jsts.operation.overlay.MaximalEdgeRing.prototype=new jsts.geomgraph.EdgeRing();jsts.operation.overlay.MaximalEdgeRing.constructor=jsts.operation.overlay.MaximalEdgeRing;jsts.operation.overlay.MaximalEdgeRing.prototype.getNext=function(de)
{return de.getNext();};jsts.operation.overlay.MaximalEdgeRing.prototype.setEdgeRing=function(de,er)
{de.setEdgeRing(er);};jsts.operation.overlay.MaximalEdgeRing.prototype.linkDirectedEdgesForMinimalEdgeRings=function()
{var de=this.startDe;do{var node=de.getNode();node.getEdges().linkMinimalDirectedEdges(this);de=de.getNext();}while(de!=this.startDe);};jsts.operation.overlay.MaximalEdgeRing.prototype.buildMinimalRings=function()
{var minEdgeRings=[];var de=this.startDe;do{if(de.getMinEdgeRing()===null){var minEr=new jsts.operation.overlay.MinimalEdgeRing(de,this.geometryFactory);minEdgeRings.push(minEr);}
de=de.getNext();}while(de!=this.startDe);return minEdgeRings;};jsts.algorithm.CentroidPoint=function(){this.centSum=new jsts.geom.Coordinate();};jsts.algorithm.CentroidPoint.prototype.ptCount=0;jsts.algorithm.CentroidPoint.prototype.centSum=null;jsts.algorithm.CentroidPoint.prototype.add=function(geom){if(geom instanceof jsts.geom.Point){this.add2(geom.getCoordinate());}else if(geom instanceof jsts.geom.GeometryCollection||geom instanceof jsts.geom.MultiPoint||geom instanceof jsts.geom.MultiLineString||geom instanceof jsts.geom.MultiPolygon){var gc=geom;for(var i=0;i<gc.getNumGeometries();i++){this.add(gc.getGeometryN(i));}}};jsts.algorithm.CentroidPoint.prototype.add2=function(pt){this.ptCount+=1;this.centSum.x+=pt.x;this.centSum.y+=pt.y;};jsts.algorithm.CentroidPoint.prototype.getCentroid=function(){var cent=new jsts.geom.Coordinate();cent.x=this.centSum.x/this.ptCount;cent.y=this.centSum.y/this.ptCount;return cent;};jsts.operation.distance.ConnectedElementLocationFilter=function(locations){this.locations=locations;};jsts.operation.distance.ConnectedElementLocationFilter.prototype=new jsts.geom.GeometryFilter();jsts.operation.distance.ConnectedElementLocationFilter.prototype.locations=null;jsts.operation.distance.ConnectedElementLocationFilter.getLocations=function(geom){var locations=[];geom.apply(new jsts.operation.distance.ConnectedElementLocationFilter(locations));return locations;};jsts.operation.distance.ConnectedElementLocationFilter.prototype.filter=function(geom){if(geom instanceof jsts.geom.Point||geom instanceof jsts.geom.LineString||geom instanceof jsts.geom.Polygon)
this.locations.push(new jsts.operation.distance.GeometryLocation(geom,0,geom.getCoordinate()));};jsts.geomgraph.index.MonotoneChainEdge=function(e){this.e=e;this.pts=e.getCoordinates();var mcb=new jsts.geomgraph.index.MonotoneChainIndexer();this.startIndex=mcb.getChainStartIndices(this.pts);};jsts.geomgraph.index.MonotoneChainEdge.prototype.e=null;jsts.geomgraph.index.MonotoneChainEdge.prototype.pts=null;jsts.geomgraph.index.MonotoneChainEdge.prototype.startIndex=null;jsts.geomgraph.index.MonotoneChainEdge.prototype.env1=new jsts.geom.Envelope();jsts.geomgraph.index.MonotoneChainEdge.prototype.env2=new jsts.geom.Envelope();jsts.geomgraph.index.MonotoneChainEdge.prototype.getCoordinates=function(){return this.pts;};jsts.geomgraph.index.MonotoneChainEdge.prototype.getStartIndexes=function(){return this.startIndex;};jsts.geomgraph.index.MonotoneChainEdge.prototype.getMinX=function(chainIndex){var x1=this.pts[this.startIndex[chainIndex]].x;var x2=this.pts[this.startIndex[chainIndex+1]].x;if(x1<x2){return x1;}
return x2;};jsts.geomgraph.index.MonotoneChainEdge.prototype.getMaxX=function(chainIndex){var x1=this.pts[this.startIndex[chainIndex]].x;var x2=this.pts[this.startIndex[chainIndex+1]].x;if(x1>x2){return x1;}
return x2;};jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersects=function(mce,si){for(var i=0;i<this.startIndex.length-1;i++){for(var j=0;j<mce.startIndex.length-1;j++){this.computeIntersectsForChain(i,mce,j,si);}}};jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersectsForChain=function(chainIndex0,mce,chainIndex1,si){this.computeIntersectsForChain2(this.startIndex[chainIndex0],this.startIndex[chainIndex0+1],mce,mce.startIndex[chainIndex1],mce.startIndex[chainIndex1+1],si);};jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersectsForChain2=function(start0,end0,mce,start1,end1,ei){var p00=this.pts[start0];var p01=this.pts[end0];var p10=mce.pts[start1];var p11=mce.pts[end1];if(end0-start0==1&&end1-start1==1){ei.addIntersections(this.e,start0,mce.e,start1);return;}
this.env1.init(p00,p01);this.env2.init(p10,p11);if(!this.env1.intersects(this.env2)){return;}
var mid0=Math.floor((start0+end0)/2);var mid1=Math.floor((start1+end1)/2);if(start0<mid0){if(start1<mid1){this.computeIntersectsForChain2(start0,mid0,mce,start1,mid1,ei);}
if(mid1<end1){this.computeIntersectsForChain2(start0,mid0,mce,mid1,end1,ei);}}
if(mid0<end0){if(start1<mid1){this.computeIntersectsForChain2(mid0,end0,mce,start1,mid1,ei);}
if(mid1<end1){this.computeIntersectsForChain2(mid0,end0,mce,mid1,end1,ei);}}};(function(){var ArrayList=javascript.util.ArrayList;jsts.operation.relate.EdgeEndBuilder=function(){};jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds=function(edges){if(arguments.length==2){this.computeEdgeEnds2.apply(this,arguments);return;}
var l=new ArrayList();for(var i=edges;i.hasNext();){var e=i.next();this.computeEdgeEnds2(e,l);}
return l;};jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds2=function(edge,l){var eiList=edge.getEdgeIntersectionList();eiList.addEndpoints();var it=eiList.iterator();var eiPrev=null;var eiCurr=null;if(!it.hasNext())
return;var eiNext=it.next();do{eiPrev=eiCurr;eiCurr=eiNext;eiNext=null;if(it.hasNext())
eiNext=it.next();if(eiCurr!==null){this.createEdgeEndForPrev(edge,l,eiCurr,eiPrev);this.createEdgeEndForNext(edge,l,eiCurr,eiNext);}}while(eiCurr!==null);};jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForPrev=function(edge,l,eiCurr,eiPrev){var iPrev=eiCurr.segmentIndex;if(eiCurr.dist===0.0){if(iPrev===0)
return;iPrev--;}
var pPrev=edge.getCoordinate(iPrev);if(eiPrev!==null&&eiPrev.segmentIndex>=iPrev)
pPrev=eiPrev.coord;var label=new jsts.geomgraph.Label(edge.getLabel());label.flip();var e=new jsts.geomgraph.EdgeEnd(edge,eiCurr.coord,pPrev,label);l.add(e);};jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForNext=function(edge,l,eiCurr,eiNext){var iNext=eiCurr.segmentIndex+1;if(iNext>=edge.getNumPoints()&&eiNext===null)
return;var pNext=edge.getCoordinate(iNext);if(eiNext!==null&&eiNext.segmentIndex===eiCurr.segmentIndex)
pNext=eiNext.coord;var e=new jsts.geomgraph.EdgeEnd(edge,eiCurr.coord,pNext,new jsts.geomgraph.Label(edge.getLabel()));l.add(e);};})();(function(){var ArrayList=javascript.util.ArrayList;var TreeSet=javascript.util.TreeSet;var CoordinateFilter=jsts.geom.CoordinateFilter;jsts.util.UniqueCoordinateArrayFilter=function(){this.treeSet=new TreeSet();this.list=new ArrayList();};jsts.util.UniqueCoordinateArrayFilter.prototype=new CoordinateFilter();jsts.util.UniqueCoordinateArrayFilter.prototype.treeSet=null;jsts.util.UniqueCoordinateArrayFilter.prototype.list=null;jsts.util.UniqueCoordinateArrayFilter.prototype.getCoordinates=function(){return this.list.toArray();};jsts.util.UniqueCoordinateArrayFilter.prototype.filter=function(coord){if(!this.treeSet.contains(coord)){this.list.add(coord);this.treeSet.add(coord);}};})();(function(){var CGAlgorithms=jsts.algorithm.CGAlgorithms;var UniqueCoordinateArrayFilter=jsts.util.UniqueCoordinateArrayFilter;var Assert=jsts.util.Assert;var Stack=javascript.util.Stack;var ArrayList=javascript.util.ArrayList;var Arrays=javascript.util.Arrays;var RadialComparator=function(origin){this.origin=origin;};RadialComparator.prototype.origin=null;RadialComparator.prototype.compare=function(o1,o2){var p1=o1;var p2=o2;return RadialComparator.polarCompare(this.origin,p1,p2);};RadialComparator.polarCompare=function(o,p,q){var dxp=p.x-o.x;var dyp=p.y-o.y;var dxq=q.x-o.x;var dyq=q.y-o.y;var orient=CGAlgorithms.computeOrientation(o,p,q);if(orient==CGAlgorithms.COUNTERCLOCKWISE)
return 1;if(orient==CGAlgorithms.CLOCKWISE)
return-1;var op=dxp*dxp+dyp*dyp;var oq=dxq*dxq+dyq*dyq;if(op<oq){return-1;}
if(op>oq){return 1;}
return 0;};jsts.algorithm.ConvexHull=function(){if(arguments.length===1){var geometry=arguments[0];this.inputPts=jsts.algorithm.ConvexHull.extractCoordinates(geometry);this.geomFactory=geometry.getFactory();}else{this.pts=arguments[0];this.geomFactory=arguments[1];}};jsts.algorithm.ConvexHull.prototype.geomFactory=null;jsts.algorithm.ConvexHull.prototype.inputPts=null;jsts.algorithm.ConvexHull.extractCoordinates=function(geom){var filter=new UniqueCoordinateArrayFilter();geom.apply(filter);return filter.getCoordinates();};jsts.algorithm.ConvexHull.prototype.getConvexHull=function(){if(this.inputPts.length==0){return this.geomFactory.createGeometryCollection(null);}
if(this.inputPts.length==1){return this.geomFactory.createPoint(this.inputPts[0]);}
if(this.inputPts.length==2){return this.geomFactory.createLineString(this.inputPts);}
var reducedPts=this.inputPts;if(this.inputPts.length>50){reducedPts=this.reduce(this.inputPts);}
var sortedPts=this.preSort(reducedPts);var cHS=this.grahamScan(sortedPts);var cH=cHS.toArray();return this.lineOrPolygon(cH);};jsts.algorithm.ConvexHull.prototype.reduce=function(inputPts){var polyPts=this.computeOctRing(inputPts);if(polyPts==null)
return this.inputPts;var reducedSet=new javascript.util.TreeSet();for(var i=0;i<polyPts.length;i++){reducedSet.add(polyPts[i]);}
for(var i=0;i<inputPts.length;i++){if(!CGAlgorithms.isPointInRing(inputPts[i],polyPts)){reducedSet.add(inputPts[i]);}}
var reducedPts=reducedSet.toArray();if(reducedPts.length<3)
return this.padArray3(reducedPts);return reducedPts;};jsts.algorithm.ConvexHull.prototype.padArray3=function(pts){var pad=[];for(var i=0;i<pad.length;i++){if(i<pts.length){pad[i]=pts[i];}else
pad[i]=pts[0];}
return pad;};jsts.algorithm.ConvexHull.prototype.preSort=function(pts){var t;for(var i=1;i<pts.length;i++){if((pts[i].y<pts[0].y)||((pts[i].y==pts[0].y)&&(pts[i].x<pts[0].x))){t=pts[0];pts[0]=pts[i];pts[i]=t;}}
Arrays.sort(pts,1,pts.length,new RadialComparator(pts[0]));return pts;};jsts.algorithm.ConvexHull.prototype.grahamScan=function(c){var p;var ps=new Stack();p=ps.push(c[0]);p=ps.push(c[1]);p=ps.push(c[2]);for(var i=3;i<c.length;i++){p=ps.pop();while(!ps.empty()&&CGAlgorithms.computeOrientation(ps.peek(),p,c[i])>0){p=ps.pop();}
p=ps.push(p);p=ps.push(c[i]);}
p=ps.push(c[0]);return ps;};jsts.algorithm.ConvexHull.prototype.isBetween=function(c1,c2,c3){if(CGAlgorithms.computeOrientation(c1,c2,c3)!==0){return false;}
if(c1.x!=c3.x){if(c1.x<=c2.x&&c2.x<=c3.x){return true;}
if(c3.x<=c2.x&&c2.x<=c1.x){return true;}}
if(c1.y!=c3.y){if(c1.y<=c2.y&&c2.y<=c3.y){return true;}
if(c3.y<=c2.y&&c2.y<=c1.y){return true;}}
return false;};jsts.algorithm.ConvexHull.prototype.computeOctRing=function(inputPts){var octPts=this.computeOctPts(inputPts);var coordList=new jsts.geom.CoordinateList();coordList.add(octPts,false);if(coordList.size()<3){return null;}
coordList.closeRing();return coordList.toCoordinateArray();};jsts.algorithm.ConvexHull.prototype.computeOctPts=function(inputPts){var pts=[];for(var j=0;j<8;j++){pts[j]=inputPts[0];}
for(var i=1;i<inputPts.length;i++){if(inputPts[i].x<pts[0].x){pts[0]=inputPts[i];}
if(inputPts[i].x-inputPts[i].y<pts[1].x-pts[1].y){pts[1]=inputPts[i];}
if(inputPts[i].y>pts[2].y){pts[2]=inputPts[i];}
if(inputPts[i].x+inputPts[i].y>pts[3].x+pts[3].y){pts[3]=inputPts[i];}
if(inputPts[i].x>pts[4].x){pts[4]=inputPts[i];}
if(inputPts[i].x-inputPts[i].y>pts[5].x-pts[5].y){pts[5]=inputPts[i];}
if(inputPts[i].y<pts[6].y){pts[6]=inputPts[i];}
if(inputPts[i].x+inputPts[i].y<pts[7].x+pts[7].y){pts[7]=inputPts[i];}}
return pts;};jsts.algorithm.ConvexHull.prototype.lineOrPolygon=function(coordinates){coordinates=this.cleanRing(coordinates);if(coordinates.length==3){return this.geomFactory.createLineString([coordinates[0],coordinates[1]]);}
var linearRing=this.geomFactory.createLinearRing(coordinates);return this.geomFactory.createPolygon(linearRing,null);};jsts.algorithm.ConvexHull.prototype.cleanRing=function(original){Assert.equals(original[0],original[original.length-1]);var cleanedRing=new ArrayList();var previousDistinctCoordinate=null;for(var i=0;i<=original.length-2;i++){var currentCoordinate=original[i];var nextCoordinate=original[i+1];if(currentCoordinate.equals(nextCoordinate)){continue;}
if(previousDistinctCoordinate!=null&&this.isBetween(previousDistinctCoordinate,currentCoordinate,nextCoordinate)){continue;}
cleanedRing.add(currentCoordinate);previousDistinctCoordinate=currentCoordinate;}
cleanedRing.add(original[original.length-1]);var cleanedRingCoordinates=[];return cleanedRing.toArray(cleanedRingCoordinates);};})();jsts.algorithm.MinimumDiameter=function(inputGeom,isConvex){this.convexHullPts=null;this.minBaseSeg=new jsts.geom.LineSegment();this.minWidthPt=null;this.minPtIndex=0;this.minWidth=0;jsts.algorithm.MinimumDiameter.inputGeom=inputGeom;jsts.algorithm.MinimumDiameter.isConvex=isConvex||false;};jsts.algorithm.MinimumDiameter.inputGeom=null;jsts.algorithm.MinimumDiameter.isConvex=false;jsts.algorithm.MinimumDiameter.nextIndex=function(pts,index){index++;if(index>=pts.length){index=0;}
return index;};jsts.algorithm.MinimumDiameter.computeC=function(a,b,p){return a*p.y-b*p.x;};jsts.algorithm.MinimumDiameter.computeSegmentForLine=function(a,b,c){var p0;var p1;if(Math.abs(b)>Math.abs(a)){p0=new jsts.geom.Coordinate(0,c/b);p1=new jsts.geom.Coordinate(1,c/b-a/b);}
else{p0=new jsts.geom.Coordinate(c/a,0);p1=new jsts.geom.Coordinate(c/a-b/a,1);}
return new jsts.geom.LineSegment(p0,p1);};jsts.algorithm.MinimumDiameter.prototype.getLength=function(){this.computeMinimumDiameter();return this.minWidth;};jsts.algorithm.MinimumDiameter.prototype.getWidthCoordinate=function(){this.computeMinimumDiameter();return this.minWidthPt;};jsts.algorithm.MinimumDiameter.prototype.getSupportingSegment=function(){this.computeMinimumDiameter();var coord=[this.minBaseSeg.p0,this.minBaseSeg.p1];return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLineString(coord);};jsts.algorithm.MinimumDiameter.prototype.getDiameter=function(){this.computeMinimumDiameter();if(this.minWidthPt===null){return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLineString(null);}
var basePt=this.minBaseSeg.project(this.minWidthPt);return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLineString([basePt,this.minWidthPt]);};jsts.algorithm.MinimumDiameter.prototype.computeMinimumDiameter=function(){if(this.minWidthPt!==null){return;}
if(jsts.algorithm.MinimumDiameter.isConvex)
this.computeWidthConvex(jsts.algorithm.MinimumDiameter.inputGeom);else{var convexGeom=new jsts.algorithm.ConvexHull(jsts.algorithm.MinimumDiameter.inputGeom).getConvexHull();this.computeWidthConvex(convexGeom);}};jsts.algorithm.MinimumDiameter.prototype.computeWidthConvex=function(convexGeom){if(convexGeom instanceof jsts.geom.Polygon){this.convexHullPts=convexGeom.getExteriorRing().getCoordinates();}else{this.convexHullPts=convexGeom.getCoordinates();}
if(this.convexHullPts.length===0){this.minWidth=0;this.minWidthPt=null;this.minBaseSeg=null;}else if(this.convexHullPts.length===1){this.minWidth=0;this.minWidthPt=this.convexHullPts[0];this.minBaseSeg.p0=this.convexHullPts[0];this.minBaseSeg.p1=this.convexHullPts[0];}else if(this.convexHullPts.length===2||this.convexHullPts.length===3){this.minWidth=0;this.minWidthPt=this.convexHullPts[0];this.minBaseSeg.p0=this.convexHullPts[0];this.minBaseSeg.p1=this.convexHullPts[1];}else{this.computeConvexRingMinDiameter(this.convexHullPts);}};jsts.algorithm.MinimumDiameter.prototype.computeConvexRingMinDiameter=function(pts){this.minWidth=Number.MAX_VALUE;var currMaxIndex=1;var seg=new jsts.geom.LineSegment();for(var i=0;i<pts.length-1;i++){seg.p0=pts[i];seg.p1=pts[i+1];currMaxIndex=this.findMaxPerpDistance(pts,seg,currMaxIndex);}};jsts.algorithm.MinimumDiameter.prototype.findMaxPerpDistance=function(pts,seg,startIndex){var maxPerpDistance=seg.distancePerpendicular(pts[startIndex]);var nextPerpDistance=maxPerpDistance;var maxIndex=startIndex;var nextIndex=maxIndex;while(nextPerpDistance>=maxPerpDistance){maxPerpDistance=nextPerpDistance;maxIndex=nextIndex;nextIndex=jsts.algorithm.MinimumDiameter.nextIndex(pts,maxIndex);nextPerpDistance=seg.distancePerpendicular(pts[nextIndex]);}
if(maxPerpDistance<this.minWidth){this.minPtIndex=maxIndex;this.minWidth=maxPerpDistance;this.minWidthPt=pts[this.minPtIndex];this.minBaseSeg=new jsts.geom.LineSegment(seg);}
return maxIndex;};jsts.algorithm.MinimumDiameter.prototype.getMinimumRectangle=function(){this.computeMinimumDiameter();if(this.minWidth===0){if(this.minBaseSeg.p0.equals2D(this.minBaseSeg.p1)){return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createPoint(this.minBaseSeg.p0);}
return this.minBaseSeg.toGeometry(jsts.algorithm.MinimumDiameter.inputGeom.getFactory());}
var dx=this.minBaseSeg.p1.x-this.minBaseSeg.p0.x;var dy=this.minBaseSeg.p1.y-this.minBaseSeg.p0.y;var minPara=Number.MAX_VALUE;var maxPara=-Number.MAX_VALUE;var minPerp=Number.MAX_VALUE;var maxPerp=-Number.MAX_VALUE;for(var i=0;i<this.convexHullPts.length;i++){var paraC=jsts.algorithm.MinimumDiameter.computeC(dx,dy,this.convexHullPts[i]);if(paraC>maxPara)maxPara=paraC;if(paraC<minPara)minPara=paraC;var perpC=jsts.algorithm.MinimumDiameter.computeC(-dy,dx,this.convexHullPts[i]);if(perpC>maxPerp)maxPerp=perpC;if(perpC<minPerp)minPerp=perpC;}
var maxPerpLine=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-dx,-dy,maxPerp);var minPerpLine=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-dx,-dy,minPerp);var maxParaLine=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-dy,dx,maxPara);var minParaLine=jsts.algorithm.MinimumDiameter.computeSegmentForLine(-dy,dx,minPara);var p0=maxParaLine.lineIntersection(maxPerpLine);var p1=minParaLine.lineIntersection(maxPerpLine);var p2=minParaLine.lineIntersection(minPerpLine);var p3=maxParaLine.lineIntersection(minPerpLine);var shell=jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createLinearRing([p0,p1,p2,p3,p0]);return jsts.algorithm.MinimumDiameter.inputGeom.getFactory().createPolygon(shell,null);};(function(){jsts.io.GeoJSONParser=function(geometryFactory){this.geometryFactory=geometryFactory||new jsts.geom.GeometryFactory();this.geometryTypes=['Point','MultiPoint','LineString','MultiLineString','Polygon','MultiPolygon'];};jsts.io.GeoJSONParser.prototype.read=function(json){var obj;if(typeof json==='string'){obj=JSON.parse(json);}else{obj=json;}
var type=obj.type;if(!this.parse[type]){throw new Error('Unknown GeoJSON type: '+obj.type);}
if(this.geometryTypes.indexOf(type)!=-1){return this.parse[type].apply(this,[obj.coordinates]);}else if(type==='GeometryCollection'){return this.parse[type].apply(this,[obj.geometries]);}
return this.parse[type].apply(this,[obj]);};jsts.io.GeoJSONParser.prototype.parse={'Feature':function(obj){var feature={};for(var key in obj){feature[key]=obj[key];}
if(obj.geometry){var type=obj.geometry.type;if(!this.parse[type]){throw new Error('Unknown GeoJSON type: '+obj.type);}
feature.geometry=this.read(obj.geometry);}
if(obj.bbox){feature.bbox=this.parse.bbox.apply(this,[obj.bbox]);}
return feature;},'FeatureCollection':function(obj){var featureCollection={};if(obj.features){featureCollection.features=[];for(var i=0;i<obj.features.length;++i){featureCollection.features.push(this.read(obj.features[i]));}}
if(obj.bbox){featureCollection.bbox=this.parse.bbox.apply(this,[obj.bbox]);}
return featureCollection;},'coordinates':function(array){var coordinates=[];for(var i=0;i<array.length;++i){var sub=array[i];coordinates.push(new jsts.geom.Coordinate(sub[0],sub[1]));}
return coordinates;},'bbox':function(array){return this.geometryFactory.createLinearRing([new jsts.geom.Coordinate(array[0],array[1]),new jsts.geom.Coordinate(array[2],array[1]),new jsts.geom.Coordinate(array[2],array[3]),new jsts.geom.Coordinate(array[0],array[3]),new jsts.geom.Coordinate(array[0],array[1])]);},'Point':function(array){var coordinate=new jsts.geom.Coordinate(array[0],array[1]);return this.geometryFactory.createPoint(coordinate);},'MultiPoint':function(array){var points=[];for(var i=0;i<array.length;++i){points.push(this.parse.Point.apply(this,[array[i]]));}
return this.geometryFactory.createMultiPoint(points);},'LineString':function(array){var coordinates=this.parse.coordinates.apply(this,[array]);return this.geometryFactory.createLineString(coordinates);},'MultiLineString':function(array){var lineStrings=[];for(var i=0;i<array.length;++i){lineStrings.push(this.parse.LineString.apply(this,[array[i]]));}
return this.geometryFactory.createMultiLineString(lineStrings);},'Polygon':function(array){var shellCoordinates=this.parse.coordinates.apply(this,[array[0]]);var shell=this.geometryFactory.createLinearRing(shellCoordinates);var holes=[];for(var i=1;i<array.length;++i){var hole=array[i];var coordinates=this.parse.coordinates.apply(this,[hole]);var linearRing=this.geometryFactory.createLinearRing(coordinates);holes.push(linearRing);}
return this.geometryFactory.createPolygon(shell,holes);},'MultiPolygon':function(array){var polygons=[];for(var i=0;i<array.length;++i){var polygon=array[i];polygons.push(this.parse.Polygon.apply(this,[polygon]));}
return this.geometryFactory.createMultiPolygon(polygons);},'GeometryCollection':function(array){var geometries=[];for(var i=0;i<array.length;++i){var geometry=array[i];geometries.push(this.read(geometry));}
return this.geometryFactory.createGeometryCollection(geometries);}};jsts.io.GeoJSONParser.prototype.write=function(geometry){var type=geometry.CLASS_NAME.slice(10);if(!this.extract[type]){throw new Error('Geometry is not supported');}
return this.extract[type].apply(this,[geometry]);};jsts.io.GeoJSONParser.prototype.extract={'coordinate':function(coordinate){return[coordinate.x,coordinate.y];},'Point':function(point){var array=this.extract.coordinate.apply(this,[point.coordinate]);return{type:'Point',coordinates:array};},'MultiPoint':function(multipoint){var array=[];for(var i=0;i<multipoint.geometries.length;++i){var point=multipoint.geometries[i];var geoJson=this.extract.Point.apply(this,[point]);array.push(geoJson.coordinates);}
return{type:'MultiPoint',coordinates:array};},'LineString':function(linestring){var array=[];for(var i=0;i<linestring.points.length;++i){var coordinate=linestring.points[i];array.push(this.extract.coordinate.apply(this,[coordinate]));}
return{type:'LineString',coordinates:array};},'MultiLineString':function(multilinestring){var array=[];for(var i=0;i<multilinestring.geometries.length;++i){var linestring=multilinestring.geometries[i];var geoJson=this.extract.LineString.apply(this,[linestring]);array.push(geoJson.coordinates);}
return{type:'MultiLineString',coordinates:array};},'Polygon':function(polygon){var array=[];var shellGeoJson=this.extract.LineString.apply(this,[polygon.shell]);array.push(shellGeoJson.coordinates);for(var i=0;i<polygon.holes.length;++i){var hole=polygon.holes[i];var holeGeoJson=this.extract.LineString.apply(this,[hole]);array.push(holeGeoJson.coordinates);}
return{type:'Polygon',coordinates:array};},'MultiPolygon':function(multipolygon){var array=[];for(var i=0;i<multipolygon.geometries.length;++i){var polygon=multipolygon.geometries[i];var geoJson=this.extract.Polygon.apply(this,[polygon]);array.push(geoJson.coordinates);}
return{type:'MultiPolygon',coordinates:array};},'GeometryCollection':function(collection){var array=[];for(var i=0;i<collection.geometries.length;++i){var geometry=collection.geometries[i];var type=geometry.CLASS_NAME.slice(10);array.push(this.extract[type].apply(this,[geometry]));}
return{type:'GeometryCollection',geometries:array};}};})();jsts.triangulate.quadedge.Vertex=function(){if(arguments.length===1){this.initFromCoordinate(arguments[0]);}else{this.initFromXY(arguments[0],arguments[1]);}};jsts.triangulate.quadedge.Vertex.LEFT=0;jsts.triangulate.quadedge.Vertex.RIGHT=1;jsts.triangulate.quadedge.Vertex.BEYOND=2;jsts.triangulate.quadedge.Vertex.BEHIND=3;jsts.triangulate.quadedge.Vertex.BETWEEN=4;jsts.triangulate.quadedge.Vertex.ORIGIN=5;jsts.triangulate.quadedge.Vertex.DESTINATION=6;jsts.triangulate.quadedge.Vertex.prototype.initFromXY=function(x,y){this.p=new jsts.geom.Coordinate(x,y);};jsts.triangulate.quadedge.Vertex.prototype.initFromCoordinate=function(_p){this.p=new jsts.geom.Coordinate(_p);};jsts.triangulate.quadedge.Vertex.prototype.getX=function(){return this.p.x;};jsts.triangulate.quadedge.Vertex.prototype.getY=function(){return this.p.y;};jsts.triangulate.quadedge.Vertex.prototype.getZ=function(){return this.p.z;};jsts.triangulate.quadedge.Vertex.prototype.setZ=function(z){this.p.z=z;};jsts.triangulate.quadedge.Vertex.prototype.getCoordinate=function(){return this.p;};jsts.triangulate.quadedge.Vertex.prototype.toString=function(){return'POINT ('+this.p.x+' '+this.p.y+')';};jsts.triangulate.quadedge.Vertex.prototype.equals=function(){if(arguments.length===1){return this.equalsExact(arguments[0]);}else{return this.equalsWithTolerance(arguments[0],arguments[1]);}};jsts.triangulate.quadedge.Vertex.prototype.equalsExact=function(other){return(this.p.x===other.getX()&&this.p.y===other.getY());};jsts.triangulate.quadedge.Vertex.prototype.equalsWithTolerance=function(other,tolerance){return(this.p.distance(other.getCoordinate())<tolerance);};jsts.triangulate.quadedge.Vertex.prototype.classify=function(p0,p1){var p2,a,b,sa;p2=this;a=p1.sub(p0);b=p2.sub(p0);sa=a.crossProduct(b);if(sa>0.0){return jsts.triangulate.quadedge.Vertex.LEFT;}
if(sa<0.0){return jsts.triangulate.quadedge.Vertex.RIGHT;}
if((a.getX()*b.getX()<0.0)||(a.getY()*b.getY()<0.0)){return jsts.triangulate.quadedge.Vertex.BEHIND;}
if(a.magn()<b.magn()){return jsts.triangulate.quadedge.Vertex.BEYOND;}
if(p0.equals(p2)){return jsts.triangulate.quadedge.Vertex.ORIGIN;}
if(p1.equals(p2)){return jsts.triangulate.quadedge.Vertex.DESTINATION;}
return jsts.triangulate.quadedge.Vertex.BETWEEN;};jsts.triangulate.quadedge.Vertex.prototype.crossProduct=function(v){return((this.p.x*v.getY())-(this.p.y*v.getX()));};jsts.triangulate.quadedge.Vertex.prototype.dot=function(v){return((this.p.x*v.getX())+(this.p.y*v.getY()));};jsts.triangulate.quadedge.Vertex.prototype.times=function(c){return new jsts.triangulate.quadedge.Vertex(c*this.p.x,c*this.p.y);};jsts.triangulate.quadedge.Vertex.prototype.sum=function(v){return new jsts.triangulate.quadedge.Vertex(this.p.x+v.getX(),this.p.y+
v.getY());};jsts.triangulate.quadedge.Vertex.prototype.sub=function(v){return new jsts.triangulate.quadedge.Vertex(this.p.x-v.getX(),this.p.y-
v.getY());};jsts.triangulate.quadedge.Vertex.prototype.magn=function(){return(Math.sqrt((this.p.x*this.p.x)+(this.p.y*this.p.y)));};jsts.triangulate.quadedge.Vertex.prototype.cross=function(){return new Vertex(this.p.y,-this.p.x);};jsts.triangulate.quadedge.Vertex.prototype.isInCircle=function(a,b,c){return jsts.triangulate.quadedge.TrianglePredicate.isInCircleRobust(a.p,b.p,c.p,this.p);};jsts.triangulate.quadedge.Vertex.prototype.isCCW=function(b,c){return((b.p.x-this.p.x)*(c.p.y-this.p.y)-(b.p.y-this.p.y)*(c.p.x-this.p.x)>0);};jsts.triangulate.quadedge.Vertex.prototype.rightOf=function(e){return this.isCCW(e.dest(),e.orig());};jsts.triangulate.quadedge.Vertex.prototype.leftOf=function(e){return this.isCCW(e.orig(),e.dest());};jsts.triangulate.quadedge.Vertex.prototype.bisector=function(a,b){var dx,dy,l1,l2;dx=b.getX()-a.getX();dy=b.getY()-a.getY();l1=new jsts.algorithm.HCoordinate(a.getX()+(dx/2.0),a.getY()+
(dy/2.0),1.0);l2=new jsts.algorithm.HCoordinate(a.getX()-dy+(dx/2.0),a.getY()+
dx+(dy/2.0),1.0);return new jsts.algorithm.HCoordinate(l1,l2);};jsts.triangulate.quadedge.Vertex.prototype.distance=function(v1,v2){return v1.p.distance(v2.p);};jsts.triangulate.quadedge.Vertex.prototype.circumRadiusRatio=function(b,c){var x,radius,edgeLength,el;x=this.circleCenter(b,c);radius=this.distance(x,b);edgeLength=this.distance(this,b);el=this.distance(b,c);if(el<edgeLength){edgeLength=el;}
el=this.distance(c,this);if(el<edgeLength){edgeLength=el;}
return radius/edgeLength;};jsts.triangulate.quadedge.Vertex.prototype.midPoint=function(a){var xm,ym;xm=(this.p.x+a.getX())/2.0;ym=(this.p.y+a.getY())/2.0;return new jsts.triangulate.quadedge.Vertex(xm,ym);};jsts.triangulate.quadedge.Vertex.prototype.circleCenter=function(b,c){var a,cab,cbc,hcc,cc;a=new jsts.triangulate.quadedge.Vertex(this.getX(),this.getY());cab=this.bisector(a,b);cbc=this.bisector(b,c);hcc=new jsts.algorithm.HCoordinate(cab,cbc);cc=null;try{cc=new jsts.triangulate.quadedge.Vertex(hcc.getX(),hcc.getY());}catch(err){}
return cc;};jsts.operation.valid.IsValidOp=function(parentGeometry){this.parentGeometry=parentGeometry;this.isSelfTouchingRingFormingHoleValid=false;this.validErr=null;};jsts.operation.valid.IsValidOp.isValid=function(arg){if(arguments[0]instanceof jsts.geom.Coordinate){if(isNaN(arg.x)){return false;}
if(!isFinite(arg.x)&&!isNaN(arg.x)){return false;}
if(isNaN(arg.y)){return false;}
if(!isFinite(arg.y)&&!isNaN(arg.y)){return false;}
return true;}else{var isValidOp=new jsts.operation.valid.IsValidOp(arg);return isValidOp.isValid();}};jsts.operation.valid.IsValidOp.findPtNotNode=function(testCoords,searchRing,graph){var searchEdge=graph.findEdge(searchRing);var eiList=searchEdge.getEdgeIntersectionList();for(var i=0;i<testCoords.length;i++){var pt=testCoords[i];if(!eiList.isIntersection(pt)){return pt;}}
return null;};jsts.operation.valid.IsValidOp.prototype.setSelfTouchingRingFormingHoleValid=function(isValid){this.isSelfTouchingRingFormingHoleValid=isValid;};jsts.operation.valid.IsValidOp.prototype.isValid=function(){this.checkValid(this.parentGeometry);return this.validErr==null;};jsts.operation.valid.IsValidOp.prototype.getValidationError=function(){this.checkValid(this.parentGeometry);return this.validErr;};jsts.operation.valid.IsValidOp.prototype.checkValid=function(g){this.validErr=null;if(g.isEmpty()){return;}
if(g instanceof jsts.geom.Point){this.checkValidPoint(g);}else if(g instanceof jsts.geom.MultiPoint){this.checkValidMultiPoint(g);}else if(g instanceof jsts.geom.LinearRing){this.checkValidLinearRing(g);}else if(g instanceof jsts.geom.LineString){this.checkValidLineString(g);}else if(g instanceof jsts.geom.Polygon){this.checkValidPolygon(g);}else if(g instanceof jsts.geom.MultiPolygon){this.checkValidMultiPolygon(g);}else if(g instanceof jsts.geom.GeometryCollection){this.checkValidGeometryCollection(g);}else{throw g.constructor;}};jsts.operation.valid.IsValidOp.prototype.checkValidPoint=function(g){this.checkInvalidCoordinates(g.getCoordinates());};jsts.operation.valid.IsValidOp.prototype.checkValidMultiPoint=function(g){this.checkInvalidCoordinates(g.getCoordinates());};jsts.operation.valid.IsValidOp.prototype.checkValidLineString=function(g){this.checkInvalidCoordinates(g.getCoordinates());if(this.validErr!=null){return;}
var graph=new jsts.geomgraph.GeometryGraph(0,g);this.checkTooFewPoints(graph);};jsts.operation.valid.IsValidOp.prototype.checkValidLinearRing=function(g){this.checkInvalidCoordinates(g.getCoordinates());if(this.validErr!=null){return;}
this.checkClosedRing(g);if(this.validErr!=null){return;}
var graph=new jsts.geomgraph.GeometryGraph(0,g);this.checkTooFewPoints(graph);if(this.validErr!=null){return;}
var li=new jsts.algorithm.RobustLineIntersector();graph.computeSelfNodes(li,true);this.checkNoSelfIntersectingRings(graph);};jsts.operation.valid.IsValidOp.prototype.checkValidPolygon=function(g){this.checkInvalidCoordinates(g);if(this.validErr!=null){return;}
this.checkClosedRings(g);if(this.validErr!=null){return;}
var graph=new jsts.geomgraph.GeometryGraph(0,g);this.checkTooFewPoints(graph);if(this.validErr!=null){return;}
this.checkConsistentArea(graph);if(this.validErr!=null){return;}
if(!this.isSelfTouchingRingFormingHoleValid){this.checkNoSelfIntersectingRings(graph);if(this.validErr!=null){return;}}
this.checkHolesInShell(g,graph);if(this.validErr!=null){return;}
this.checkHolesNotNested(g,graph);if(this.validErr!=null){return;}
this.checkConnectedInteriors(graph);};jsts.operation.valid.IsValidOp.prototype.checkValidMultiPolygon=function(g){var il=g.getNumGeometries();for(var i=0;i<il;i++){var p=g.getGeometryN(i);this.checkInvalidCoordinates(p);if(this.validErr!=null){return;}
this.checkClosedRings(p);if(this.validErr!=null){return;}}
var graph=new jsts.geomgraph.GeometryGraph(0,g);this.checkTooFewPoints(graph);if(this.validErr!=null){return;}
this.checkConsistentArea(graph);if(this.validErr!=null){return;}
if(!this.isSelfTouchingRingFormingHoleValid){this.checkNoSelfIntersectingRings(graph);if(this.validErr!=null){return;}}
for(var i=0;i<g.getNumGeometries();i++){var p=g.getGeometryN(i);this.checkHolesInShell(p,graph);if(this.validErr!=null){return;}}
for(var i=0;i<g.getNumGeometries();i++){var p=g.getGeometryN(i);this.checkHolesNotNested(p,graph);if(this.validErr!=null){return;}}
this.checkShellsNotNested(g,graph);if(this.validErr!=null){return;}
this.checkConnectedInteriors(graph);};jsts.operation.valid.IsValidOp.prototype.checkValidGeometryCollection=function(gc){for(var i=0;i<gc.getNumGeometries();i++){var g=gc.getGeometryN(i);this.checkValid(g);if(this.validErr!=null){return;}}};jsts.operation.valid.IsValidOp.prototype.checkInvalidCoordinates=function(arg){if(arg instanceof jsts.geom.Polygon){var poly=arg;this.checkInvalidCoordinates(poly.getExteriorRing().getCoordinates());if(this.validErr!=null){return;}
for(var i=0;i<poly.getNumInteriorRing();i++){this.checkInvalidCoordinates(poly.getInteriorRingN(i).getCoordinates());if(this.validErr!=null){return;}}}else{var coords=arg;for(var i=0;i<coords.length;i++){if(!jsts.operation.valid.IsValidOp.isValid(coords[i])){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE,coords[i]);return;}}}};jsts.operation.valid.IsValidOp.prototype.checkClosedRings=function(poly){this.checkClosedRing(poly.getExteriorRing());if(this.validErr!=null){return;}
for(var i=0;i<poly.getNumInteriorRing();i++){this.checkClosedRing(poly.getInteriorRingN(i));if(this.validErr!=null){return;}}};jsts.operation.valid.IsValidOp.prototype.checkClosedRing=function(ring){if(!ring.isClosed()){var pt=null;if(ring.getNumPoints()>=1){pt=ring.getCoordinateN(0);}
this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED,pt);}};jsts.operation.valid.IsValidOp.prototype.checkTooFewPoints=function(graph){if(graph.hasTooFewPoints){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS,graph.getInvalidPoint());return;}};jsts.operation.valid.IsValidOp.prototype.checkConsistentArea=function(graph){var cat=new jsts.operation.valid.ConsistentAreaTester(graph);var isValidArea=cat.isNodeConsistentArea();if(!isValidArea){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION,cat.getInvalidPoint());return;}
if(cat.hasDuplicateRings()){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS,cat.getInvalidPoint());}};jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRings=function(graph){for(var i=graph.getEdgeIterator();i.hasNext();){var e=i.next();this.checkNoSelfIntersectingRing(e.getEdgeIntersectionList());if(this.validErr!=null){return;}}};jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRing=function(eiList){var nodeSet=[];var isFirst=true;for(var i=eiList.iterator();i.hasNext();){var ei=i.next();if(isFirst){isFirst=false;continue;}
if(nodeSet.indexOf(ei.coord)>=0){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION,ei.coord);return;}else{nodeSet.push(ei.coord);}}};jsts.operation.valid.IsValidOp.prototype.checkHolesInShell=function(p,graph){var shell=p.getExteriorRing();var pir=new jsts.algorithm.MCPointInRing(shell);for(var i=0;i<p.getNumInteriorRing();i++){var hole=p.getInteriorRingN(i);var holePt=jsts.operation.valid.IsValidOp.findPtNotNode(hole.getCoordinates(),shell,graph);if(holePt==null){return;}
var outside=!pir.isInside(holePt);if(outside){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL,holePt);return;}}};jsts.operation.valid.IsValidOp.prototype.checkHolesNotNested=function(p,graph){var nestedTester=new jsts.operation.valid.IndexedNestedRingTester(graph);for(var i=0;i<p.getNumInteriorRing();i++){var innerHole=p.getInteriorRingN(i);nestedTester.add(innerHole);}
var isNonNested=nestedTester.isNonNested();if(!isNonNested){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.NESTED_HOLES,nestedTester.getNestedPoint());}};jsts.operation.valid.IsValidOp.prototype.checkShellsNotNested=function(mp,graph){for(var i=0;i<mp.getNumGeometries();i++){var p=mp.getGeometryN(i);var shell=p.getExteriorRing();for(var j=0;j<mp.getNumGeometries();j++){if(i==j){continue;}
var p2=mp.getGeometryN(j);this.checkShellNotNested(shell,p2,graph);if(this.validErr!=null){return;}}}};jsts.operation.valid.IsValidOp.prototype.checkShellNotNested=function(shell,p,graph){var shellPts=shell.getCoordinates();var polyShell=p.getExteriorRing();var polyPts=polyShell.getCoordinates();var shellPt=jsts.operation.valid.IsValidOp.findPtNotNode(shellPts,polyShell,graph);if(shellPt==null){return;}
var insidePolyShell=jsts.algorithm.CGAlgorithms.isPointInRing(shellPt,polyPts);if(!insidePolyShell){return;}
if(p.getNumInteriorRing()<=0){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.NESTED_SHELLS,shellPt);return;}
var badNestedPt=null;for(var i=0;i<p.getNumInteriorRing();i++){var hole=p.getInteriorRingN(i);badNestedPt=this.checkShellInsideHole(shell,hole,graph);if(badNestedPt==null){return;}}
this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.NESTED_SHELLS,badNestedPt);};jsts.operation.valid.IsValidOp.prototype.checkShellInsideHole=function(shell,hole,graph){var shellPts=shell.getCoordinates();var holePts=hole.getCoordinates();var shellPt=jsts.operation.valid.IsValidOp.findPtNotNode(shellPts,hole,graph);if(shellPt!=null){var insideHole=jsts.algorithm.CGAlgorithms.isPointInRing(shellPt,holePts);if(!insideHole){return shellPt;}}
var holePt=jsts.operation.valid.IsValidOp.findPtNotNode(holePts,shell,graph);if(holePt!=null){var insideShell=jsts.algorithm.CGAlgorithms.isPointInRing(holePt,shellPts);if(insideShell){return holePt;}
return null;}
jsts.util.Assert.shouldNeverReachHere('points in shell and hole appear to be equal');return null;};jsts.operation.valid.IsValidOp.prototype.checkConnectedInteriors=function(graph){var cit=new jsts.operation.valid.ConnectedInteriorTester(graph);if(!cit.isInteriorsConnected()){this.validErr=new jsts.operation.valid.TopologyValidationError(jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR,cit.getCoordinate());}};jsts.algorithm.RobustDeterminant=function(){};jsts.algorithm.RobustDeterminant.signOfDet2x2=function(x1,y1,x2,y2){var sign,swap,k,count;count=0;sign=1;if((x1===0.0)||(y2===0.0)){if((y1===0.0)||(x2===0.0)){return 0;}
else if(y1>0){if(x2>0){return-sign;}
else{return sign;}}
else{if(x2>0){return sign;}
else{return-sign;}}}
if((y1===0.0)||(x2===0.0)){if(y2>0){if(x1>0){return sign;}
else{return-sign;}}
else{if(x1>0){return-sign;}
else{return sign;}}}
if(0.0<y1){if(0.0<y2){if(y1>y2){sign=-sign;swap=x1;x1=x2;x2=swap;swap=y1;y1=y2;y2=swap;}}
else{if(y1<=-y2){sign=-sign;x2=-x2;y2=-y2;}
else{swap=x1;x1=-x2;x2=swap;swap=y1;y1=-y2;y2=swap;}}}
else{if(0.0<y2){if(-y1<=y2){sign=-sign;x1=-x1;y1=-y1;}
else{swap=-x1;x1=x2;x2=swap;swap=-y1;y1=y2;y2=swap;}}
else{if(y1>=y2){x1=-x1;y1=-y1;x2=-x2;y2=-y2;}
else{sign=-sign;swap=-x1;x1=-x2;x2=swap;swap=-y1;y1=-y2;y2=swap;}}}
if(0.0<x1){if(0.0<x2){if(x1>x2){return sign;}}
else{return sign;}}
else{if(0.0<x2){return-sign;}
else{if(x1>=x2){sign=-sign;x1=-x1;x2=-x2;}
else{return-sign;}}}
while(true){count=count+1;k=Math.floor(x2/x1);x2=x2-k*x1;y2=y2-k*y1;if(y2<0.0){return-sign;}
if(y2>y1){return sign;}
if(x1>x2+x2){if(y1<y2+y2){return sign;}}
else{if(y1>y2+y2){return-sign;}
else{x2=x1-x2;y2=y1-y2;sign=-sign;}}
if(y2===0.0){if(x2===0.0){return 0;}
else{return-sign;}}
if(x2===0.0){return sign;}
k=Math.floor(x1/x2);x1=x1-k*x2;y1=y1-k*y2;if(y1<0.0){return sign;}
if(y1>y2){return-sign;}
if(x2>x1+x1){if(y2<y1+y1){return-sign;}}
else{if(y2>y1+y1){return sign;}
else{x1=x2-x1;y1=y2-y1;sign=-sign;}}
if(y1===0.0){if(x1===0.0){return 0;}
else{return sign;}}
if(x1===0.0){return-sign;}}};jsts.algorithm.RobustDeterminant.orientationIndex=function(p1,p2,q){var dx1=p2.x-p1.x;var dy1=p2.y-p1.y;var dx2=q.x-p2.x;var dy2=q.y-p2.y;return jsts.algorithm.RobustDeterminant.signOfDet2x2(dx1,dy1,dx2,dy2);};jsts.index.quadtree.NodeBase=function(){this.subnode=new Array(4);this.subnode[0]=null;this.subnode[1]=null;this.subnode[2]=null;this.subnode[3]=null;this.items=[];};jsts.index.quadtree.NodeBase.prototype.getSubnodeIndex=function(env,centre){var subnodeIndex=-1;if(env.getMinX()>=centre.x){if(env.getMinY()>=centre.y){subnodeIndex=3;}
if(env.getMaxY()<=centre.y){subnodeIndex=1;}}
if(env.getMaxX()<=centre.x){if(env.getMinY()>=centre.y){subnodeIndex=2;}
if(env.getMaxY()<=centre.y){subnodeIndex=0;}}
return subnodeIndex;};jsts.index.quadtree.NodeBase.prototype.getItems=function(){return this.items;};jsts.index.quadtree.NodeBase.prototype.hasItems=function(){return(this.items.length>0);};jsts.index.quadtree.NodeBase.prototype.add=function(item){this.items.push(item);};jsts.index.quadtree.NodeBase.prototype.remove=function(itemEnv,item){if(!this.isSearchMatch(itemEnv)){return false;}
var found=false,i=0;for(i;i<4;i++){if(this.subnode[i]!==null){found=this.subnode[i].remove(itemEnv,item);if(found){if(this.subnode[i].isPrunable()){this.subnode[i]=null;}
break;}}}
if(found){return found;}
if(this.items.indexOf(item)!==-1){for(var i=this.items.length-1;i>=0;i--){if(this.items[i]===item){this.items.splice(i,1);}}
found=true;}
return found;};jsts.index.quadtree.NodeBase.prototype.isPrunable=function(){return!(this.hasChildren()||this.hasItems());};jsts.index.quadtree.NodeBase.prototype.hasChildren=function(){var i=0;for(i;i<4;i++){if(this.subnode[i]!==null){return true;}}
return false;};jsts.index.quadtree.NodeBase.prototype.isEmpty=function(){var isEmpty=true;if(this.items.length>0){isEmpty=false;}
var i=0;for(i;i<4;i++){if(this.subnode[i]!==null){if(!this.subnode[i].isEmpty()){isEmpty=false;}}}
return isEmpty;};jsts.index.quadtree.NodeBase.prototype.addAllItems=function(resultItems){resultItems=resultItems.concat(this.items);var i=0;for(i;i<4;i++){if(this.subnode[i]!==null){resultItems=this.subnode[i].addAllItems(resultItems);}}
return resultItems;};jsts.index.quadtree.NodeBase.prototype.addAllItemsFromOverlapping=function(searchEnv,resultItems){if(!this.isSearchMatch(searchEnv)){return;}
resultItems=resultItems.concat(this.items);var i=0;for(i;i<4;i++){if(this.subnode[i]!==null){resultItems=this.subnode[i].addAllItemsFromOverlapping(searchEnv,resultItems);}}};jsts.index.quadtree.NodeBase.prototype.visit=function(searchEnv,visitor){if(!this.isSearchMatch(searchEnv)){return;}
this.visitItems(searchEnv,visitor);var i=0;for(i;i<4;i++){if(this.subnode[i]!==null){this.subnode[i].visit(searchEnv,visitor);}}};jsts.index.quadtree.NodeBase.prototype.visitItems=function(env,visitor){var i=0,il=this.items.length;for(i;i<il;i++){visitor.visitItem(this.items[i]);}};jsts.index.quadtree.NodeBase.prototype.depth=function(){var maxSubDepth=0,i=0,sqd;for(i;i<4;i++){if(this.subnode[i]!==null){sqd=this.subnode[i].depth();if(sqd>maxSubDepth){maxSubDepth=sqd;}}}
return maxSubDepth+1;};jsts.index.quadtree.NodeBase.prototype.size=function(){var subSize=0,i=0;for(i;i<4;i++){if(this.subnode[i]!==null){subSize+=this.subnode[i].size();}}
return subSize+this.items.length;};jsts.index.quadtree.NodeBase.prototype.getNodeCount=function(){var subSize=0,i=0;for(i;i<4;i++){if(this.subnode[i]!==null){subSize+=this.subnode[i].size();}}
return subSize+1;};jsts.index.quadtree.Node=function(env,level){jsts.index.quadtree.NodeBase.prototype.constructor.apply(this,arguments);this.env=env;this.level=level;this.centre=new jsts.geom.Coordinate();this.centre.x=(env.getMinX()+env.getMaxX())/2;this.centre.y=(env.getMinY()+env.getMaxY())/2;};jsts.index.quadtree.Node.prototype=new jsts.index.quadtree.NodeBase();jsts.index.quadtree.Node.createNode=function(env){var key,node;key=new jsts.index.quadtree.Key(env);node=new jsts.index.quadtree.Node(key.getEnvelope(),key.getLevel());return node;};jsts.index.quadtree.Node.createExpanded=function(node,addEnv){var expandEnv=new jsts.geom.Envelope(addEnv),largerNode;if(node!==null){expandEnv.expandToInclude(node.env);}
largerNode=jsts.index.quadtree.Node.createNode(expandEnv);if(node!==null){largerNode.insertNode(node);}
return largerNode;};jsts.index.quadtree.Node.prototype.getEnvelope=function(){return this.env;};jsts.index.quadtree.Node.prototype.isSearchMatch=function(searchEnv){return this.env.intersects(searchEnv);};jsts.index.quadtree.Node.prototype.getNode=function(searchEnv){var subnodeIndex=this.getSubnodeIndex(searchEnv,this.centre),node;if(subnodeIndex!==-1){node=this.getSubnode(subnodeIndex);return node.getNode(searchEnv);}else{return this;}};jsts.index.quadtree.Node.prototype.find=function(searchEnv){var subnodeIndex=this.getSubnodeIndex(searchEnv,this.centre),node;if(subnodeIndex===-1){return this;}
if(this.subnode[subnodeIndex]!==null){node=this.subnode[subnodeIndex];return node.find(searchEnv);}
return this;};jsts.index.quadtree.Node.prototype.insertNode=function(node){var index=this.getSubnodeIndex(node.env,this.centre),childNode;if(node.level===this.level-1){this.subnode[index]=node;}else{childNode=this.createSubnode(index);childNode.insertNode(node);this.subnode[index]=childNode;}};jsts.index.quadtree.Node.prototype.getSubnode=function(index){if(this.subnode[index]===null){this.subnode[index]=this.createSubnode(index);}
return this.subnode[index];};jsts.index.quadtree.Node.prototype.createSubnode=function(index){var minx=0.0,maxx=0.0,miny=0.0,maxy=0.0,sqEnv,node;switch(index){case 0:minx=this.env.getMinX();maxx=this.centre.x;miny=this.env.getMinY();maxy=this.centre.y;break;case 1:minx=this.centre.x;maxx=this.env.getMaxX();miny=this.env.getMinY();maxy=this.centre.y;break;case 2:minx=this.env.getMinX();maxx=this.centre.x;miny=this.centre.y;maxy=this.env.getMaxY();break;case 3:minx=this.centre.x;maxx=this.env.getMaxX();miny=this.centre.y;maxy=this.env.getMaxY();break;}
sqEnv=new jsts.geom.Envelope(minx,maxx,miny,maxy);node=new jsts.index.quadtree.Node(sqEnv,this.level-1);return node;};(function(){jsts.triangulate.quadedge.QuadEdge=function(){this.rot=null;this.vertex=null;this.next=null;this.data=null;};var QuadEdge=jsts.triangulate.quadedge.QuadEdge;jsts.triangulate.quadedge.QuadEdge.makeEdge=function(o,d){var q0,q1,q2,q3,base;q0=new QuadEdge();q1=new QuadEdge();q2=new QuadEdge();q3=new QuadEdge();q0.rot=q1;q1.rot=q2;q2.rot=q3;q3.rot=q0;q0.setNext(q0);q1.setNext(q3);q2.setNext(q2);q3.setNext(q1);base=q0;base.setOrig(o);base.setDest(d);return base;};jsts.triangulate.quadedge.QuadEdge.connect=function(a,b){var e=QuadEdge.makeEdge(a.dest(),b.orig());QuadEdge.splice(e,a.lNext());QuadEdge.splice(e.sym(),b);return e;};jsts.triangulate.quadedge.QuadEdge.splice=function(a,b){var alpha,beta,t1,t2,t3,t4;alpha=a.oNext().rot;beta=b.oNext().rot;t1=b.oNext();t2=a.oNext();t3=beta.oNext();t4=alpha.oNext();a.setNext(t1);b.setNext(t2);alpha.setNext(t3);beta.setNext(t4);};jsts.triangulate.quadedge.QuadEdge.swap=function(e){var a,b;a=e.oPrev();b=e.sym().oPrev();QuadEdge.splice(e,a);QuadEdge.splice(e.sym(),b);QuadEdge.splice(e,a.lNext());QuadEdge.splice(e.sym(),b.lNext());e.setOrig(a.dest());e.setDest(b.dest());};jsts.triangulate.quadedge.QuadEdge.prototype.getPrimary=function(){if(this.orig().getCoordinate().compareTo(this.dest().getCoordinate())<=0){return this;}
else{return this.sym();}};jsts.triangulate.quadedge.QuadEdge.prototype.setData=function(data){this.data=data;};jsts.triangulate.quadedge.QuadEdge.prototype.getData=function(){return this.data;};jsts.triangulate.quadedge.QuadEdge.prototype.delete_jsts=function(){this.rot=null;};jsts.triangulate.quadedge.QuadEdge.prototype.isLive=function(){return this.rot!==null;};jsts.triangulate.quadedge.QuadEdge.prototype.setNext=function(next){this.next=next;};jsts.triangulate.quadedge.QuadEdge.prototype.invRot=function(){return this.rot.sym();};jsts.triangulate.quadedge.QuadEdge.prototype.sym=function(){return this.rot.rot;};jsts.triangulate.quadedge.QuadEdge.prototype.oNext=function(){return this.next;};jsts.triangulate.quadedge.QuadEdge.prototype.oPrev=function(){return this.rot.next.rot;};jsts.triangulate.quadedge.QuadEdge.prototype.dNext=function(){return this.sym().oNext().sym();};jsts.triangulate.quadedge.QuadEdge.prototype.dPrev=function(){return this.invRot().oNext().invRot();};jsts.triangulate.quadedge.QuadEdge.prototype.lNext=function(){return this.invRot().oNext().rot;};jsts.triangulate.quadedge.QuadEdge.prototype.lPrev=function(){return this.next.sym();};jsts.triangulate.quadedge.QuadEdge.prototype.rNext=function(){return this.rot.next.invRot();};jsts.triangulate.quadedge.QuadEdge.prototype.rPrev=function(){return this.sym().oNext();};jsts.triangulate.quadedge.QuadEdge.prototype.setOrig=function(o){this.vertex=o;};jsts.triangulate.quadedge.QuadEdge.prototype.setDest=function(d){this.sym().setOrig(d);};jsts.triangulate.quadedge.QuadEdge.prototype.orig=function(){return this.vertex;};jsts.triangulate.quadedge.QuadEdge.prototype.dest=function(){return this.sym().orig();};jsts.triangulate.quadedge.QuadEdge.prototype.getLength=function(){return this.orig().getCoordinate().distance(dest().getCoordinate());};jsts.triangulate.quadedge.QuadEdge.prototype.equalsNonOriented=function(qe){if(this.equalsOriented(qe)){return true;}
if(this.equalsOriented(qe.sym())){return true;}
return false;};jsts.triangulate.quadedge.QuadEdge.prototype.equalsOriented=function(qe){if(this.orig().getCoordinate().equals2D(qe.orig().getCoordinate())&&this.dest().getCoordinate().equals2D(qe.dest().getCoordinate())){return true;}
return false;};jsts.triangulate.quadedge.QuadEdge.prototype.toLineSegment=function()
{return new jsts.geom.LineSegment(this.vertex.getCoordinate(),this.dest().getCoordinate());};jsts.triangulate.quadedge.QuadEdge.prototype.toString=function(){var p0,p1;p0=this.vertex.getCoordinate();p1=this.dest().getCoordinate();return jsts.io.WKTWriter.toLineString(p0,p1);};})();(function(){var Assert=jsts.util.Assert;jsts.geomgraph.EdgeEnd=function(edge,p0,p1,label){this.edge=edge;if(p0&&p1){this.init(p0,p1);}
if(label){this.label=label||null;}};jsts.geomgraph.EdgeEnd.prototype.edge=null;jsts.geomgraph.EdgeEnd.prototype.label=null;jsts.geomgraph.EdgeEnd.prototype.node=null;jsts.geomgraph.EdgeEnd.prototype.p0=null;jsts.geomgraph.EdgeEnd.prototype.p1=null;jsts.geomgraph.EdgeEnd.prototype.dx=null;jsts.geomgraph.EdgeEnd.prototype.dy=null;jsts.geomgraph.EdgeEnd.prototype.quadrant=null;jsts.geomgraph.EdgeEnd.prototype.init=function(p0,p1){this.p0=p0;this.p1=p1;this.dx=p1.x-p0.x;this.dy=p1.y-p0.y;this.quadrant=jsts.geomgraph.Quadrant.quadrant(this.dx,this.dy);Assert.isTrue(!(this.dx===0&&this.dy===0),'EdgeEnd with identical endpoints found');};jsts.geomgraph.EdgeEnd.prototype.getEdge=function(){return this.edge;};jsts.geomgraph.EdgeEnd.prototype.getLabel=function(){return this.label;};jsts.geomgraph.EdgeEnd.prototype.getCoordinate=function(){return this.p0;};jsts.geomgraph.EdgeEnd.prototype.getDirectedCoordinate=function(){return this.p1;};jsts.geomgraph.EdgeEnd.prototype.getQuadrant=function(){return this.quadrant;};jsts.geomgraph.EdgeEnd.prototype.getDx=function(){return this.dx;};jsts.geomgraph.EdgeEnd.prototype.getDy=function(){return this.dy;};jsts.geomgraph.EdgeEnd.prototype.setNode=function(node){this.node=node;};jsts.geomgraph.EdgeEnd.prototype.getNode=function(){return this.node;};jsts.geomgraph.EdgeEnd.prototype.compareTo=function(e){return this.compareDirection(e);};jsts.geomgraph.EdgeEnd.prototype.compareDirection=function(e){if(this.dx===e.dx&&this.dy===e.dy)
return 0;if(this.quadrant>e.quadrant)
return 1;if(this.quadrant<e.quadrant)
return-1;return jsts.algorithm.CGAlgorithms.computeOrientation(e.p0,e.p1,this.p1);};jsts.geomgraph.EdgeEnd.prototype.computeLabel=function(boundaryNodeRule){};})();jsts.operation.buffer.RightmostEdgeFinder=function(){};jsts.operation.buffer.RightmostEdgeFinder.prototype.minIndex=-1;jsts.operation.buffer.RightmostEdgeFinder.prototype.minCoord=null;jsts.operation.buffer.RightmostEdgeFinder.prototype.minDe=null;jsts.operation.buffer.RightmostEdgeFinder.prototype.orientedDe=null;jsts.operation.buffer.RightmostEdgeFinder.prototype.getEdge=function(){return this.orientedDe;};jsts.operation.buffer.RightmostEdgeFinder.prototype.getCoordinate=function(){return this.minCoord;};jsts.operation.buffer.RightmostEdgeFinder.prototype.findEdge=function(dirEdgeList){for(var i=dirEdgeList.iterator();i.hasNext();){var de=i.next();if(!de.isForward())
continue;this.checkForRightmostCoordinate(de);}
jsts.util.Assert.isTrue(this.minIndex!==0||this.minCoord.equals(this.minDe.getCoordinate()),'inconsistency in rightmost processing');if(this.minIndex===0){this.findRightmostEdgeAtNode();}else{this.findRightmostEdgeAtVertex();}
this.orientedDe=this.minDe;var rightmostSide=this.getRightmostSide(this.minDe,this.minIndex);if(rightmostSide==jsts.geomgraph.Position.LEFT){this.orientedDe=this.minDe.getSym();}};jsts.operation.buffer.RightmostEdgeFinder.prototype.findRightmostEdgeAtNode=function(){var node=this.minDe.getNode();var star=node.getEdges();this.minDe=star.getRightmostEdge();if(!this.minDe.isForward()){this.minDe=this.minDe.getSym();this.minIndex=this.minDe.getEdge().getCoordinates().length-1;}};jsts.operation.buffer.RightmostEdgeFinder.prototype.findRightmostEdgeAtVertex=function(){var pts=this.minDe.getEdge().getCoordinates();jsts.util.Assert.isTrue(this.minIndex>0&&this.minIndex<pts.length,'rightmost point expected to be interior vertex of edge');var pPrev=pts[this.minIndex-1];var pNext=pts[this.minIndex+1];var orientation=jsts.algorithm.CGAlgorithms.computeOrientation(this.minCoord,pNext,pPrev);var usePrev=false;if(pPrev.y<this.minCoord.y&&pNext.y<this.minCoord.y&&orientation===jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE){usePrev=true;}else if(pPrev.y>this.minCoord.y&&pNext.y>this.minCoord.y&&orientation===jsts.algorithm.CGAlgorithms.CLOCKWISE){usePrev=true;}
if(usePrev){this.minIndex=this.minIndex-1;}};jsts.operation.buffer.RightmostEdgeFinder.prototype.checkForRightmostCoordinate=function(de){var coord=de.getEdge().getCoordinates();for(var i=0;i<coord.length-1;i++){if(this.minCoord===null||coord[i].x>this.minCoord.x){this.minDe=de;this.minIndex=i;this.minCoord=coord[i];}}};jsts.operation.buffer.RightmostEdgeFinder.prototype.getRightmostSide=function(de,index){var side=this.getRightmostSideOfSegment(de,index);if(side<0)
side=this.getRightmostSideOfSegment(de,index-1);if(side<0){this.minCoord=null;this.checkForRightmostCoordinate(de);}
return side;};jsts.operation.buffer.RightmostEdgeFinder.prototype.getRightmostSideOfSegment=function(de,i){var e=de.getEdge();var coord=e.getCoordinates();if(i<0||i+1>=coord.length)
return-1;if(coord[i].y==coord[i+1].y)
return-1;var pos=jsts.geomgraph.Position.LEFT;if(coord[i].y<coord[i+1].y)
pos=jsts.geomgraph.Position.RIGHT;return pos;};(function(){jsts.triangulate.IncrementalDelaunayTriangulator=function(subdiv){this.subdiv=subdiv;this.isUsingTolerance=subdiv.getTolerance()>0.0;};jsts.triangulate.IncrementalDelaunayTriangulator.prototype.insertSites=function(vertices){var i=0,il=vertices.length,v;for(i;i<il;i++){v=vertices[i];this.insertSite(v);}};jsts.triangulate.IncrementalDelaunayTriangulator.prototype.insertSite=function(v){var e,base,startEdge,t;e=this.subdiv.locate(v);if(this.subdiv.isVertexOfEdge(e,v)){return e;}
else if(this.subdiv.isOnEdge(e,v.getCoordinate())){e=e.oPrev();this.subdiv.delete_jsts(e.oNext());}
base=this.subdiv.makeEdge(e.orig(),v);jsts.triangulate.quadedge.QuadEdge.splice(base,e);startEdge=base;do{base=this.subdiv.connect(e,base.sym());e=base.oPrev();}while(e.lNext()!=startEdge);do{t=e.oPrev();if(t.dest().rightOf(e)&&v.isInCircle(e.orig(),t.dest(),e.dest())){jsts.triangulate.quadedge.QuadEdge.swap(e);e=e.oPrev();}else if(e.oNext()==startEdge){return base;}else{e=e.oNext().lPrev();}}while(true);};}());jsts.algorithm.CentroidArea=function(){this.basePt=null;this.triangleCent3=new jsts.geom.Coordinate();this.centSum=new jsts.geom.Coordinate();this.cg3=new jsts.geom.Coordinate();};jsts.algorithm.CentroidArea.prototype.basePt=null;jsts.algorithm.CentroidArea.prototype.triangleCent3=null;jsts.algorithm.CentroidArea.prototype.areasum2=0;jsts.algorithm.CentroidArea.prototype.cg3=null;jsts.algorithm.CentroidArea.prototype.centSum=null;jsts.algorithm.CentroidArea.prototype.totalLength=0.0;jsts.algorithm.CentroidArea.prototype.add=function(geom){if(geom instanceof jsts.geom.Polygon){var poly=geom;this.setBasePoint(poly.getExteriorRing().getCoordinateN(0));this.add3(poly);}else if(geom instanceof jsts.geom.GeometryCollection||geom instanceof jsts.geom.MultiPolygon){var gc=geom;for(var i=0;i<gc.getNumGeometries();i++){this.add(gc.getGeometryN(i));}}else if(geom instanceof Array){this.add2(geom);}};jsts.algorithm.CentroidArea.prototype.add2=function(ring){this.setBasePoint(ring[0]);this.addShell(ring);};jsts.algorithm.CentroidArea.prototype.getCentroid=function(){var cent=new jsts.geom.Coordinate();if(Math.abs(this.areasum2)>0.0){cent.x=this.cg3.x/3/this.areasum2;cent.y=this.cg3.y/3/this.areasum2;}else{cent.x=this.centSum.x/this.totalLength;cent.y=this.centSum.y/this.totalLength;}
return cent;};jsts.algorithm.CentroidArea.prototype.setBasePoint=function(basePt){if(this.basePt==null)
this.basePt=basePt;};jsts.algorithm.CentroidArea.prototype.add3=function(poly){this.addShell(poly.getExteriorRing().getCoordinates());for(var i=0;i<poly.getNumInteriorRing();i++){this.addHole(poly.getInteriorRingN(i).getCoordinates());}};jsts.algorithm.CentroidArea.prototype.addShell=function(pts){var isPositiveArea=!jsts.algorithm.CGAlgorithms.isCCW(pts);for(var i=0;i<pts.length-1;i++){this.addTriangle(this.basePt,pts[i],pts[i+1],isPositiveArea);}
this.addLinearSegments(pts);};jsts.algorithm.CentroidArea.prototype.addHole=function(pts){var isPositiveArea=jsts.algorithm.CGAlgorithms.isCCW(pts);for(var i=0;i<pts.length-1;i++){this.addTriangle(this.basePt,pts[i],pts[i+1],isPositiveArea);}
this.addLinearSegments(pts);};jsts.algorithm.CentroidArea.prototype.addTriangle=function(p0,p1,p2,isPositiveArea){var sign=(isPositiveArea)?1.0:-1.0;jsts.algorithm.CentroidArea.centroid3(p0,p1,p2,this.triangleCent3);var area2=jsts.algorithm.CentroidArea.area2(p0,p1,p2);this.cg3.x+=sign*area2*this.triangleCent3.x;this.cg3.y+=sign*area2*this.triangleCent3.y;this.areasum2+=sign*area2;};jsts.algorithm.CentroidArea.centroid3=function(p1,p2,p3,c){c.x=p1.x+p2.x+p3.x;c.y=p1.y+p2.y+p3.y;return;};jsts.algorithm.CentroidArea.area2=function(p1,p2,p3){return(p2.x-p1.x)*(p3.y-p1.y)-(p3.x-p1.x)*(p2.y-p1.y);};jsts.algorithm.CentroidArea.prototype.addLinearSegments=function(pts){for(var i=0;i<pts.length-1;i++){var segmentLen=pts[i].distance(pts[i+1]);this.totalLength+=segmentLen;var midx=(pts[i].x+pts[i+1].x)/2;this.centSum.x+=segmentLen*midx;var midy=(pts[i].y+pts[i+1].y)/2;this.centSum.y+=segmentLen*midy;}};jsts.geomgraph.index.SweepLineSegment=function(edge,ptIndex){this.edge=edge;this.ptIndex=ptIndex;this.pts=edge.getCoordinates();};jsts.geomgraph.index.SweepLineSegment.prototype.edge=null;jsts.geomgraph.index.SweepLineSegment.prototype.pts=null;jsts.geomgraph.index.SweepLineSegment.prototype.ptIndex=null;jsts.geomgraph.index.SweepLineSegment.prototype.getMinX=function(){var x1=this.pts[this.ptIndex].x;var x2=this.pts[this.ptIndex+1].x;if(x1<x2){return x1;}
return x2;};jsts.geomgraph.index.SweepLineSegment.prototype.getMaxX=function(){var x1=this.pts[this.ptIndex].x;var x2=this.pts[this.ptIndex+1].x;if(x1>x2){return x1;}
return x2;};jsts.geomgraph.index.SweepLineSegment.prototype.computeIntersections=function(ss,si){si.addIntersections(this.edge,this.ptIndex,ss.edge,ss.ptIndex);};jsts.index.quadtree.Root=function(){jsts.index.quadtree.NodeBase.prototype.constructor.apply(this,arguments);this.origin=new jsts.geom.Coordinate(0.0,0.0);};jsts.index.quadtree.Root.prototype=new jsts.index.quadtree.NodeBase();jsts.index.quadtree.Root.prototype.insert=function(itemEnv,item){var index=this.getSubnodeIndex(itemEnv,this.origin);if(index===-1){this.add(item);return;}
var node=this.subnode[index];if(node===null||!node.getEnvelope().contains(itemEnv)){var largerNode=jsts.index.quadtree.Node.createExpanded(node,itemEnv);this.subnode[index]=largerNode;}
this.insertContained(this.subnode[index],itemEnv,item);};jsts.index.quadtree.Root.prototype.insertContained=function(tree,itemEnv,item){var isZeroX,isZeroY,node;isZeroX=jsts.index.IntervalSize.isZeroWidth(itemEnv.getMinX(),itemEnv.getMaxX());isZeroY=jsts.index.IntervalSize.isZeroWidth(itemEnv.getMinY(),itemEnv.getMaxY());if(isZeroX||isZeroY){node=tree.find(itemEnv);}else{node=tree.getNode(itemEnv);}
node.add(item);};jsts.index.quadtree.Root.prototype.isSearchMatch=function(searchEnv){return true;};jsts.geomgraph.index.MonotoneChainIndexer=function(){};jsts.geomgraph.index.MonotoneChainIndexer.toIntArray=function(list){var array=[];for(var i=list.iterator();i.hasNext();){var element=i.next();array.push(element);}
return array;};jsts.geomgraph.index.MonotoneChainIndexer.prototype.getChainStartIndices=function(pts){var start=0;var startIndexList=new javascript.util.ArrayList();startIndexList.add(start);do{var last=this.findChainEnd(pts,start);startIndexList.add(last);start=last;}while(start<pts.length-1);var startIndex=jsts.geomgraph.index.MonotoneChainIndexer.toIntArray(startIndexList);return startIndex;};jsts.geomgraph.index.MonotoneChainIndexer.prototype.findChainEnd=function(pts,start){var chainQuad=jsts.geomgraph.Quadrant.quadrant(pts[start],pts[start+1]);var last=start+1;while(last<pts.length){var quad=jsts.geomgraph.Quadrant.quadrant(pts[last-1],pts[last]);if(quad!=chainQuad){break;}
last++;}
return last-1;};jsts.noding.IntersectionAdder=function(li){this.li=li;};jsts.noding.IntersectionAdder.prototype=new jsts.noding.SegmentIntersector();jsts.noding.IntersectionAdder.constructor=jsts.noding.IntersectionAdder;jsts.noding.IntersectionAdder.isAdjacentSegments=function(i1,i2){return Math.abs(i1-i2)===1;};jsts.noding.IntersectionAdder.prototype._hasIntersection=false;jsts.noding.IntersectionAdder.prototype.hasProper=false;jsts.noding.IntersectionAdder.prototype.hasProperInterior=false;jsts.noding.IntersectionAdder.prototype.hasInterior=false;jsts.noding.IntersectionAdder.prototype.properIntersectionPoint=null;jsts.noding.IntersectionAdder.prototype.li=null;jsts.noding.IntersectionAdder.prototype.isSelfIntersection=null;jsts.noding.IntersectionAdder.prototype.numIntersections=0;jsts.noding.IntersectionAdder.prototype.numInteriorIntersections=0;jsts.noding.IntersectionAdder.prototype.numProperIntersections=0;jsts.noding.IntersectionAdder.prototype.numTests=0;jsts.noding.IntersectionAdder.prototype.getLineIntersector=function(){return this.li;};jsts.noding.IntersectionAdder.prototype.getProperIntersectionPoint=function(){return this.properIntersectionPoint;};jsts.noding.IntersectionAdder.prototype.hasIntersection=function(){return this._hasIntersection;};jsts.noding.IntersectionAdder.prototype.hasProperIntersection=function(){return this.hasProper;};jsts.noding.IntersectionAdder.prototype.hasProperInteriorIntersection=function(){return this.hasProperInterior;};jsts.noding.IntersectionAdder.prototype.hasInteriorIntersection=function(){return this.hasInterior;};jsts.noding.IntersectionAdder.prototype.isTrivialIntersection=function(e0,segIndex0,e1,segIndex1){if(e0==e1){if(this.li.getIntersectionNum()==1){if(jsts.noding.IntersectionAdder.isAdjacentSegments(segIndex0,segIndex1))
return true;if(e0.isClosed()){var maxSegIndex=e0.size()-1;if((segIndex0===0&&segIndex1===maxSegIndex)||(segIndex1===0&&segIndex0===maxSegIndex)){return true;}}}}
return false;};jsts.noding.IntersectionAdder.prototype.processIntersections=function(e0,segIndex0,e1,segIndex1){if(e0===e1&&segIndex0===segIndex1)
return;this.numTests++;var p00=e0.getCoordinates()[segIndex0];var p01=e0.getCoordinates()[segIndex0+1];var p10=e1.getCoordinates()[segIndex1];var p11=e1.getCoordinates()[segIndex1+1];this.li.computeIntersection(p00,p01,p10,p11);if(this.li.hasIntersection()){this.numIntersections++;if(this.li.isInteriorIntersection()){this.numInteriorIntersections++;this.hasInterior=true;}
if(!this.isTrivialIntersection(e0,segIndex0,e1,segIndex1)){this._hasIntersection=true;e0.addIntersections(this.li,segIndex0,0);e1.addIntersections(this.li,segIndex1,1);if(this.li.isProper()){this.numProperIntersections++;this.hasProper=true;this.hasProperInterior=true;}}}};jsts.noding.IntersectionAdder.prototype.isDone=function(){return false;};jsts.operation.union.CascadedPolygonUnion=function(polys){this.inputPolys=polys;};jsts.operation.union.CascadedPolygonUnion.union=function(polys){var op=new jsts.operation.union.CascadedPolygonUnion(polys);return op.union();};jsts.operation.union.CascadedPolygonUnion.prototype.inputPolys;jsts.operation.union.CascadedPolygonUnion.prototype.geomFactory=null;jsts.operation.union.CascadedPolygonUnion.prototype.STRTREE_NODE_CAPACITY=4;jsts.operation.union.CascadedPolygonUnion.prototype.union=function(){if(this.inputPolys.length===0){return null;}
this.geomFactory=this.inputPolys[0].getFactory();var index=new jsts.index.strtree.STRtree(this.STRTREE_NODE_CAPACITY);for(var i=0,l=this.inputPolys.length;i<l;i++){var item=this.inputPolys[i];index.insert(item.getEnvelopeInternal(),item);}
var itemTree=index.itemsTree();var unionAll=this.unionTree(itemTree);return unionAll;};jsts.operation.union.CascadedPolygonUnion.prototype.unionTree=function(geomTree){var geoms=this.reduceToGeometries(geomTree);var union=this.binaryUnion(geoms);return union;};jsts.operation.union.CascadedPolygonUnion.prototype.binaryUnion=function(geoms,start,end){start=start||0;end=end||geoms.length;if(end-start<=1){var g0=this.getGeometry(geoms,start);return this.unionSafe(g0,null);}
else if(end-start===2){return this.unionSafe(this.getGeometry(geoms,start),this.getGeometry(geoms,start+1));}
else{var mid=parseInt((end+start)/2);var g0=this.binaryUnion(geoms,start,mid);var g1=this.binaryUnion(geoms,mid,end);return this.unionSafe(g0,g1);}};jsts.operation.union.CascadedPolygonUnion.prototype.getGeometry=function(list,index){if(index>=list.length){return null;}
return list[index];};jsts.operation.union.CascadedPolygonUnion.prototype.reduceToGeometries=function(geomTree){var geoms=[];for(var i=0,l=geomTree.length;i<l;i++){var o=geomTree[i],geom=null;if(o instanceof Array){geom=this.unionTree(o);}
else if(o instanceof jsts.geom.Geometry){geom=o;}
geoms.push(geom);}
return geoms;};jsts.operation.union.CascadedPolygonUnion.prototype.unionSafe=function(g0,g1){if(g0===null&&g1===null){return null;}
if(g0===null){return g1.clone();}
if(g1===null){return g0.clone();}
return this.unionOptimized(g0,g1);};jsts.operation.union.CascadedPolygonUnion.prototype.unionOptimized=function(g0,g1){var g0Env=g0.getEnvelopeInternal(),g1Env=g1.getEnvelopeInternal();if(!g0Env.intersects(g1Env)){var combo=jsts.geom.util.GeometryCombiner.combine(g0,g1);return combo;}
if(g0.getNumGeometries<=1&&g1.getNumGeometries<=1){return this.unionActual(g0,g1);}
var commonEnv=g0Env.intersection(g1Env);return this.unionUsingEnvelopeIntersection(g0,g1,commonEnv);};jsts.operation.union.CascadedPolygonUnion.prototype.unionUsingEnvelopeIntersection=function(g0,g1,common){var disjointPolys=new javascript.util.ArrayList();var g0Int=this.extractByEnvelope(common,g0,disjointPolys);var g1Int=this.extractByEnvelope(common,g1,disjointPolys);var union=this.unionActual(g0Int,g1Int);disjointPolys.add(union);var overallUnion=jsts.geom.util.GeometryCombiner.combine(disjointPolys);return overallUnion;};jsts.operation.union.CascadedPolygonUnion.prototype.extractByEnvelope=function(env,geom,disjointGeoms){var intersectingGeoms=new javascript.util.ArrayList();for(var i=0;i<geom.getNumGeometries();i++){var elem=geom.getGeometryN(i);if(elem.getEnvelopeInternal().intersects(env)){intersectingGeoms.add(elem);}
else{disjointGeoms.add(elem);}}
return this.geomFactory.buildGeometry(intersectingGeoms);};jsts.operation.union.CascadedPolygonUnion.prototype.unionActual=function(g0,g1){return g0.union(g1);};(function(){jsts.geom.MultiPoint=function(points,factory){this.geometries=points||[];this.factory=factory;};jsts.geom.MultiPoint.prototype=new jsts.geom.GeometryCollection();jsts.geom.MultiPoint.constructor=jsts.geom.MultiPoint;jsts.geom.MultiPoint.prototype.getBoundary=function(){return this.getFactory().createGeometryCollection(null);};jsts.geom.MultiPoint.prototype.getGeometryN=function(n){return this.geometries[n];};jsts.geom.MultiPoint.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
return jsts.geom.GeometryCollection.prototype.equalsExact.call(this,other,tolerance);};jsts.geom.MultiPoint.prototype.CLASS_NAME='jsts.geom.MultiPoint';})();jsts.operation.buffer.OffsetCurveBuilder=function(precisionModel,bufParams){this.precisionModel=precisionModel;this.bufParams=bufParams;};jsts.operation.buffer.OffsetCurveBuilder.prototype.distance=0.0;jsts.operation.buffer.OffsetCurveBuilder.prototype.precisionModel=null;jsts.operation.buffer.OffsetCurveBuilder.prototype.bufParams=null;jsts.operation.buffer.OffsetCurveBuilder.prototype.getBufferParameters=function(){return this.bufParams;};jsts.operation.buffer.OffsetCurveBuilder.prototype.getLineCurve=function(inputPts,distance){this.distance=distance;if(this.distance<0.0&&!this.bufParams.isSingleSided())
return null;if(this.distance==0.0)
return null;var posDistance=Math.abs(this.distance);var segGen=this.getSegGen(posDistance);if(inputPts.length<=1){this.computePointCurve(inputPts[0],segGen);}else{if(this.bufParams.isSingleSided()){var isRightSide=distance<0.0;this.computeSingleSidedBufferCurve(inputPts,isRightSide,segGen);}else
this.computeLineBufferCurve(inputPts,segGen);}
var lineCoord=segGen.getCoordinates();return lineCoord;};jsts.operation.buffer.OffsetCurveBuilder.prototype.getRingCurve=function(inputPts,side,distance){this.distance=distance;if(inputPts.length<=2)
return this.getLineCurve(inputPts,distance);if(this.distance==0.0){return jsts.operation.buffer.OffsetCurveBuilder.copyCoordinates(inputPts);}
var segGen=this.getSegGen(this.distance);this.computeRingBufferCurve(inputPts,side,segGen);return segGen.getCoordinates();};jsts.operation.buffer.OffsetCurveBuilder.prototype.getOffsetCurve=function(inputPts,distance){this.distance=distance;if(this.distance===0.0)
return null;var isRightSide=this.distance<0.0;var posDistance=Math.abs(this.distance);var segGen=this.getSegGen(posDistance);if(inputPts.length<=1){this.computePointCurve(inputPts[0],segGen);}else{this.computeOffsetCurve(inputPts,isRightSide,segGen);}
var curvePts=segGen.getCoordinates();if(isRightSide)
curvePts.reverse();return curvePts;};jsts.operation.buffer.OffsetCurveBuilder.copyCoordinates=function(pts){var copy=[];for(var i=0;i<pts.length;i++){copy.push(pts[i].clone());}
return copy;};jsts.operation.buffer.OffsetCurveBuilder.prototype.getSegGen=function(distance){return new jsts.operation.buffer.OffsetSegmentGenerator(this.precisionModel,this.bufParams,distance);};jsts.operation.buffer.OffsetCurveBuilder.SIMPLIFY_FACTOR=100.0;jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance=function(bufDistance){return bufDistance/jsts.operation.buffer.OffsetCurveBuilder.SIMPLIFY_FACTOR;};jsts.operation.buffer.OffsetCurveBuilder.prototype.computePointCurve=function(pt,segGen){switch(this.bufParams.getEndCapStyle()){case jsts.operation.buffer.BufferParameters.CAP_ROUND:segGen.createCircle(pt);break;case jsts.operation.buffer.BufferParameters.CAP_SQUARE:segGen.createSquare(pt);break;}};jsts.operation.buffer.OffsetCurveBuilder.prototype.computeLineBufferCurve=function(inputPts,segGen){var distTol=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);var simp1=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,distTol);var n1=simp1.length-1;segGen.initSideSegments(simp1[0],simp1[1],jsts.geomgraph.Position.LEFT);for(var i=2;i<=n1;i++){segGen.addNextSegment(simp1[i],true);}
segGen.addLastSegment();segGen.addLineEndCap(simp1[n1-1],simp1[n1]);var simp2=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,-distTol);var n2=simp2.length-1;segGen.initSideSegments(simp2[n2],simp2[n2-1],jsts.geomgraph.Position.LEFT);for(var i=n2-2;i>=0;i--){segGen.addNextSegment(simp2[i],true);}
segGen.addLastSegment();segGen.addLineEndCap(simp2[1],simp2[0]);segGen.closeRing();};jsts.operation.buffer.OffsetCurveBuilder.prototype.computeSingleSidedBufferCurve=function(inputPts,isRightSide,segGen){var distTol=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);if(isRightSide){segGen.addSegments(inputPts,true);var simp2=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,-distTol);var n2=simp2.length-1;segGen.initSideSegments(simp2[n2],simp2[n2-1],jsts.geomgraph.Position.LEFT);segGen.addFirstSegment();for(var i=n2-2;i>=0;i--){segGen.addNextSegment(simp2[i],true);}}else{segGen.addSegments(inputPts,false);var simp1=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,distTol);var n1=simp1.length-1;segGen.initSideSegments(simp1[0],simp1[1],jsts.geomgraph.Position.LEFT);segGen.addFirstSegment();for(var i=2;i<=n1;i++){segGen.addNextSegment(simp1[i],true);}}
segGen.addLastSegment();segGen.closeRing();};jsts.operation.buffer.OffsetCurveBuilder.prototype.computeOffsetCurve=function(inputPts,isRightSide,segGen){var distTol=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);if(isRightSide){var simp2=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,-distTol);var n2=simp2.length-1;segGen.initSideSegments(simp2[n2],simp2[n2-1],jsts.geomgraph.Position.LEFT);segGen.addFirstSegment();for(var i=n2-2;i>=0;i--){segGen.addNextSegment(simp2[i],true);}}else{var simp1=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,distTol);var n1=simp1.length-1;segGen.initSideSegments(simp1[0],simp1[1],jsts.geomgraph.Position.LEFT);segGen.addFirstSegment();for(var i=2;i<=n1;i++){segGen.addNextSegment(simp1[i],true);}}
segGen.addLastSegment();};jsts.operation.buffer.OffsetCurveBuilder.prototype.computeRingBufferCurve=function(inputPts,side,segGen){var distTol=jsts.operation.buffer.OffsetCurveBuilder.simplifyTolerance(this.distance);if(side===jsts.geomgraph.Position.RIGHT)
distTol=-distTol;var simp=jsts.operation.buffer.BufferInputLineSimplifier.simplify(inputPts,distTol);var n=simp.length-1;segGen.initSideSegments(simp[n-1],simp[0],side);for(var i=1;i<=n;i++){var addStartPoint=i!==1;segGen.addNextSegment(simp[i],addStartPoint);}
segGen.closeRing();};(function(){var HotPixelSnapAction=function(hotPixel,parentEdge,vertexIndex){this.hotPixel=hotPixel;this.parentEdge=parentEdge;this.vertexIndex=vertexIndex;};HotPixelSnapAction.prototype=new jsts.index.chain.MonotoneChainSelectAction();HotPixelSnapAction.constructor=HotPixelSnapAction;HotPixelSnapAction.prototype.hotPixel=null;HotPixelSnapAction.prototype.parentEdge=null;HotPixelSnapAction.prototype.vertexIndex=null;HotPixelSnapAction.prototype._isNodeAdded=false;HotPixelSnapAction.prototype.isNodeAdded=function(){return this._isNodeAdded;};HotPixelSnapAction.prototype.select=function(mc,startIndex){var ss=mc.getContext();if(this.parentEdge!==null){if(ss===this.parentEdge&&startIndex===this.vertexIndex)
return;}
this._isNodeAdded=this.hotPixel.addSnappedNode(ss,startIndex);};jsts.noding.snapround.MCIndexPointSnapper=function(index){this.index=index;};jsts.noding.snapround.MCIndexPointSnapper.prototype.index=null;jsts.noding.snapround.MCIndexPointSnapper.prototype.snap=function(hotPixel,parentEdge,vertexIndex){if(arguments.length===1){this.snap2.apply(this,arguments);return;}
var pixelEnv=hotPixel.getSafeEnvelope();var hotPixelSnapAction=new HotPixelSnapAction(hotPixel,parentEdge,vertexIndex);this.index.query(pixelEnv,{visitItem:function(testChain){testChain.select(pixelEnv,hotPixelSnapAction);}});return hotPixelSnapAction.isNodeAdded();};jsts.noding.snapround.MCIndexPointSnapper.prototype.snap2=function(hotPixel){return this.snap(hotPixel,null,-1);};})();(function(){var NodeBase=function(){this.items=new javascript.util.ArrayList();this.subnode=[null,null];};NodeBase.getSubnodeIndex=function(interval,centre){var subnodeIndex=-1;if(interval.min>=centre){subnodeIndex=1;}
if(interval.max<=centre){subnodeIndex=0;}
return subnodeIndex;};NodeBase.prototype.getItems=function(){return this.items;};NodeBase.prototype.add=function(item){this.items.add(item);};NodeBase.prototype.addAllItems=function(items){items.addAll(this.items);var i=0,il=2;for(i;i<il;i++){if(this.subnode[i]!==null){this.subnode[i].addAllItems(items);}}
return items;};NodeBase.prototype.addAllItemsFromOverlapping=function(interval,resultItems){if(interval!==null&&!this.isSearchMatch(interval)){return;}
resultItems.addAll(this.items);if(this.subnode[0]!==null){this.subnode[0].addAllItemsFromOverlapping(interval,resultItems);}
if(this.subnode[1]!==null){this.subnode[1].addAllItemsFromOverlapping(interval,resultItems);}};NodeBase.prototype.remove=function(itemInterval,item){if(!this.isSearchMatch(itemInterval)){return false;}
var found=false,i=0,il=2;for(i;i<il;i++){if(this.subnode[i]!==null){found=this.subnode[i].remove(itemInterval,item);if(found){if(this.subnode[i].isPrunable()){this.subnode[i]=null;}
break;}}}
if(found){return found;}
found=this.items.remove(item);return found;};NodeBase.prototype.isPrunable=function(){return!(this.hasChildren()||this.hasItems());};NodeBase.prototype.hasChildren=function(){var i=0,il=2;for(i;i<il;i++){if(this.subnode[i]!==null){return true;}}
return false;};NodeBase.prototype.hasItems=function(){return!this.items.isEmpty();};NodeBase.prototype.depth=function(){var maxSubDepth=0,i=0,il=2,sqd;for(i;i<il;i++){if(this.subnode[i]!==null){sqd=this.subnode[i].depth();if(sqd>maxSubDepth){maxSubDepth=sqd;}}}
return maxSubDepth+1;};NodeBase.prototype.size=function(){var subSize=0,i=0,il=2;for(i;i<il;i++){if(this.subnode[i]!==null){subSize+=this.subnode[i].size();}}
return subSize+this.items.size();};NodeBase.prototype.nodeSize=function(){var subSize=0,i=0,il=2;for(i;i<il;i++){if(this.subnode[i]!==null){subSize+=this.subnode[i].nodeSize();}}
return subSize+1;};jsts.index.bintree.NodeBase=NodeBase;})();(function(){var NodeBase=jsts.index.bintree.NodeBase;var Key=jsts.index.bintree.Key;var Interval=jsts.index.bintree.Interval;var Node=function(interval,level){this.items=new javascript.util.ArrayList();this.subnode=[null,null];this.interval=interval;this.level=level;this.centre=(interval.getMin()+interval.getMax())/2;};Node.prototype=new NodeBase();Node.constructor=Node;Node.createNode=function(itemInterval){var key,node;key=new Key(itemInterval);node=new Node(key.getInterval(),key.getLevel());return node;};Node.createExpanded=function(node,addInterval){var expandInt,largerNode;expandInt=new Interval(addInterval);if(node!==null){expandInt.expandToInclude(node.interval);}
largerNode=Node.createNode(expandInt);if(node!==null){largerNode.insert(node);}
return largerNode;};Node.prototype.getInterval=function(){return this.interval;};Node.prototype.isSearchMatch=function(itemInterval){return itemInterval.overlaps(this.interval);};Node.prototype.getNode=function(searchInterval){var subnodeIndex=NodeBase.getSubnodeIndex(searchInterval,this.centre),node;if(subnodeIndex!=-1){node=this.getSubnode(subnodeIndex);return node.getNode(searchInterval);}else{return this;}};Node.prototype.find=function(searchInterval){var subnodeIndex=NodeBase.getSubnodeIndex(searchInterval,this.centre),node;if(subnodeIndex===-1){return this;}
if(this.subnode[subnodeIndex]!==null){node=this.subnode[subnodeIndex];return node.find(searchInterval);}
return this;};Node.prototype.insert=function(node){var index=NodeBase.getSubnodeIndex(node.interval,this.centre),childNode;if(node.level===this.level-1){this.subnode[index]=node;}else{childNode=this.createSubnode(index);childNode.insert(node);this.subnode[index]=childNode;}};Node.prototype.getSubnode=function(index){if(this.subnode[index]===null){this.subnode[index]=this.createSubnode(index);}
return this.subnode[index];};Node.prototype.createSubnode=function(index){var min,max,subInt,node;min=0.0;max=0.0;switch(index){case 0:min=this.interval.getMin();max=this.centre;break;case 1:min=this.centre;max=this.interval.getMax();break;}
subInt=new Interval(min,max);node=new Node(subInt,this.level-1);return node;};jsts.index.bintree.Node=Node;})();(function(){var Node=jsts.index.bintree.Node;var NodeBase=jsts.index.bintree.NodeBase;var Root=function(){this.subnode=[null,null];this.items=new javascript.util.ArrayList();};Root.prototype=new jsts.index.bintree.NodeBase();Root.constructor=Root;Root.origin=0.0;Root.prototype.insert=function(itemInterval,item){var index=NodeBase.getSubnodeIndex(itemInterval,Root.origin),node,largerNode;if(index===-1){this.add(item);return;}
node=this.subnode[index];if(node===null||!node.getInterval().contains(itemInterval)){largerNode=Node.createExpanded(node,itemInterval);this.subnode[index]=largerNode;}
this.insertContained(this.subnode[index],itemInterval,item);};Root.prototype.insertContained=function(tree,itemInterval,item){var isZeroArea,node;isZeroArea=jsts.index.IntervalSize.isZeroWidth(itemInterval.getMin(),itemInterval.getMax());node=isZeroArea?tree.find(itemInterval):tree.getNode(itemInterval);node.add(item);};Root.prototype.isSearchMatch=function(interval){return true;};jsts.index.bintree.Root=Root;})();jsts.geomgraph.Quadrant=function(){};jsts.geomgraph.Quadrant.NE=0;jsts.geomgraph.Quadrant.NW=1;jsts.geomgraph.Quadrant.SW=2;jsts.geomgraph.Quadrant.SE=3;jsts.geomgraph.Quadrant.quadrant=function(dx,dy){if(dx instanceof jsts.geom.Coordinate){return jsts.geomgraph.Quadrant.quadrant2.apply(this,arguments);}
if(dx===0.0&&dy===0.0)
throw new jsts.error.IllegalArgumentError('Cannot compute the quadrant for point ( '+dx+', '+dy+' )');if(dx>=0.0){if(dy>=0.0)
return jsts.geomgraph.Quadrant.NE;else
return jsts.geomgraph.Quadrant.SE;}else{if(dy>=0.0)
return jsts.geomgraph.Quadrant.NW;else
return jsts.geomgraph.Quadrant.SW;}};jsts.geomgraph.Quadrant.quadrant2=function(p0,p1){if(p1.x===p0.x&&p1.y===p0.y)
throw new jsts.error.IllegalArgumentError('Cannot compute the quadrant for two identical points '+p0);if(p1.x>=p0.x){if(p1.y>=p0.y)
return jsts.geomgraph.Quadrant.NE;else
return jsts.geomgraph.Quadrant.SE;}else{if(p1.y>=p0.y)
return jsts.geomgraph.Quadrant.NW;else
return jsts.geomgraph.Quadrant.SW;}};jsts.geomgraph.Quadrant.isOpposite=function(quad1,quad2){if(quad1===quad2)
return false;var diff=(quad1-quad2+4)%4;if(diff===2)
return true;return false;};jsts.geomgraph.Quadrant.commonHalfPlane=function(quad1,quad2){if(quad1===quad2)
return quad1;var diff=(quad1-quad2+4)%4;if(diff===2)
return-1;var min=(quad1<quad2)?quad1:quad2;var max=(quad1>quad2)?quad1:quad2;if(min===0&&max===3)
return 3;return min;};jsts.geomgraph.Quadrant.isInHalfPlane=function(quad,halfPlane){if(halfPlane===jsts.geomgraph.Quadrant.SE){return quad===jsts.geomgraph.Quadrant.SE||quad===jsts.geomgraph.Quadrant.SW;}
return quad===halfPlane||quad===halfPlane+1;};jsts.geomgraph.Quadrant.isNorthern=function(quad){return quad===jsts.geomgraph.Quadrant.NE||quad===jsts.geomgraph.Quadrant.NW;};jsts.operation.valid.ConsistentAreaTester=function(geomGraph){this.geomGraph=geomGraph;this.li=new jsts.algorithm.RobustLineIntersector();this.nodeGraph=new jsts.operation.relate.RelateNodeGraph();this.invalidPoint=null;};jsts.operation.valid.ConsistentAreaTester.prototype.getInvalidPoint=function(){return this.invalidPoint;};jsts.operation.valid.ConsistentAreaTester.prototype.isNodeConsistentArea=function(){var intersector=this.geomGraph.computeSelfNodes(this.li,true);if(intersector.hasProperIntersection()){this.invalidPoint=intersector.getProperIntersectionPoint();return false;}
this.nodeGraph.build(this.geomGraph);return this.isNodeEdgeAreaLabelsConsistent();};jsts.operation.valid.ConsistentAreaTester.prototype.isNodeEdgeAreaLabelsConsistent=function(){for(var nodeIt=this.nodeGraph.getNodeIterator();nodeIt.hasNext();){var node=nodeIt.next();if(!node.getEdges().isAreaLabelsConsistent(this.geomGraph)){this.invalidPoint=node.getCoordinate().clone();return false;}}
return true;};jsts.operation.valid.ConsistentAreaTester.prototype.hasDuplicateRings=function(){for(var nodeIt=this.nodeGraph.getNodeIterator();nodeIt.hasNext();){var node=nodeIt.next();for(var i=node.getEdges().iterator();i.hasNext();){var eeb=i.next();if(eeb.getEdgeEnds().length>1){invalidPoint=eeb.getEdge().getCoordinate(0);return true;}}}
return false;};jsts.operation.relate.RelateNode=function(coord,edges){jsts.geomgraph.Node.apply(this,arguments);};jsts.operation.relate.RelateNode.prototype=new jsts.geomgraph.Node();jsts.operation.relate.RelateNode.prototype.computeIM=function(im){im.setAtLeastIfValid(this.label.getLocation(0),this.label.getLocation(1),0);};jsts.operation.relate.RelateNode.prototype.updateIMFromEdges=function(im){this.edges.updateIM(im);};(function(){var Location=jsts.geom.Location;var Position=jsts.geomgraph.Position;var EdgeEnd=jsts.geomgraph.EdgeEnd;jsts.geomgraph.DirectedEdge=function(edge,isForward){EdgeEnd.call(this,edge);this.depth=[0,-999,-999];this._isForward=isForward;if(isForward){this.init(edge.getCoordinate(0),edge.getCoordinate(1));}else{var n=edge.getNumPoints()-1;this.init(edge.getCoordinate(n),edge.getCoordinate(n-1));}
this.computeDirectedLabel();};jsts.geomgraph.DirectedEdge.prototype=new EdgeEnd();jsts.geomgraph.DirectedEdge.constructor=jsts.geomgraph.DirectedEdge;jsts.geomgraph.DirectedEdge.depthFactor=function(currLocation,nextLocation){if(currLocation===Location.EXTERIOR&&nextLocation===Location.INTERIOR)
return 1;else if(currLocation===Location.INTERIOR&&nextLocation===Location.EXTERIOR)
return-1;return 0;};jsts.geomgraph.DirectedEdge.prototype._isForward=null;jsts.geomgraph.DirectedEdge.prototype._isInResult=false;jsts.geomgraph.DirectedEdge.prototype._isVisited=false;jsts.geomgraph.DirectedEdge.prototype.sym=null;jsts.geomgraph.DirectedEdge.prototype.next=null;jsts.geomgraph.DirectedEdge.prototype.nextMin=null;jsts.geomgraph.DirectedEdge.prototype.edgeRing=null;jsts.geomgraph.DirectedEdge.prototype.minEdgeRing=null;jsts.geomgraph.DirectedEdge.prototype.depth=null;jsts.geomgraph.DirectedEdge.prototype.getEdge=function(){return this.edge;};jsts.geomgraph.DirectedEdge.prototype.setInResult=function(isInResult){this._isInResult=isInResult;};jsts.geomgraph.DirectedEdge.prototype.isInResult=function(){return this._isInResult;};jsts.geomgraph.DirectedEdge.prototype.isVisited=function(){return this._isVisited;};jsts.geomgraph.DirectedEdge.prototype.setVisited=function(isVisited){this._isVisited=isVisited;};jsts.geomgraph.DirectedEdge.prototype.setEdgeRing=function(edgeRing){this.edgeRing=edgeRing;};jsts.geomgraph.DirectedEdge.prototype.getEdgeRing=function(){return this.edgeRing;};jsts.geomgraph.DirectedEdge.prototype.setMinEdgeRing=function(minEdgeRing){this.minEdgeRing=minEdgeRing;};jsts.geomgraph.DirectedEdge.prototype.getMinEdgeRing=function(){return this.minEdgeRing;};jsts.geomgraph.DirectedEdge.prototype.getDepth=function(position){return this.depth[position];};jsts.geomgraph.DirectedEdge.prototype.setDepth=function(position,depthVal){if(this.depth[position]!==-999){if(this.depth[position]!==depthVal)
throw new jsts.error.TopologyError('assigned depths do not match',this.getCoordinate());}
this.depth[position]=depthVal;};jsts.geomgraph.DirectedEdge.prototype.getDepthDelta=function(){var depthDelta=this.edge.getDepthDelta();if(!this._isForward)
depthDelta=-depthDelta;return depthDelta;};jsts.geomgraph.DirectedEdge.prototype.setVisitedEdge=function(isVisited){this.setVisited(isVisited);this.sym.setVisited(isVisited);};jsts.geomgraph.DirectedEdge.prototype.getSym=function(){return this.sym;};jsts.geomgraph.DirectedEdge.prototype.isForward=function(){return this._isForward;};jsts.geomgraph.DirectedEdge.prototype.setSym=function(de){this.sym=de;};jsts.geomgraph.DirectedEdge.prototype.getNext=function(){return this.next;};jsts.geomgraph.DirectedEdge.prototype.setNext=function(next){this.next=next;};jsts.geomgraph.DirectedEdge.prototype.getNextMin=function(){return this.nextMin;};jsts.geomgraph.DirectedEdge.prototype.setNextMin=function(nextMin){this.nextMin=nextMin;};jsts.geomgraph.DirectedEdge.prototype.isLineEdge=function(){var isLine=this.label.isLine(0)||this.label.isLine(1);var isExteriorIfArea0=!this.label.isArea(0)||this.label.allPositionsEqual(0,Location.EXTERIOR);var isExteriorIfArea1=!this.label.isArea(1)||this.label.allPositionsEqual(1,Location.EXTERIOR);return isLine&&isExteriorIfArea0&&isExteriorIfArea1;};jsts.geomgraph.DirectedEdge.prototype.isInteriorAreaEdge=function(){var isInteriorAreaEdge=true;for(var i=0;i<2;i++){if(!(this.label.isArea(i)&&this.label.getLocation(i,Position.LEFT)===Location.INTERIOR&&this.label.getLocation(i,Position.RIGHT)===Location.INTERIOR)){isInteriorAreaEdge=false;}}
return isInteriorAreaEdge;};jsts.geomgraph.DirectedEdge.prototype.computeDirectedLabel=function(){this.label=new jsts.geomgraph.Label(this.edge.getLabel());if(!this._isForward)
this.label.flip();};jsts.geomgraph.DirectedEdge.prototype.setEdgeDepths=function(position,depth){var depthDelta=this.getEdge().getDepthDelta();if(!this._isForward)
depthDelta=-depthDelta;var directionFactor=1;if(position===Position.LEFT)
directionFactor=-1;var oppositePos=Position.opposite(position);var delta=depthDelta*directionFactor;var oppositeDepth=depth+delta;this.setDepth(position,depth);this.setDepth(oppositePos,oppositeDepth);};})();jsts.operation.distance.DistanceOp=function(g0,g1,terminateDistance){this.ptLocator=new jsts.algorithm.PointLocator();this.geom=[];this.geom[0]=g0;this.geom[1]=g1;this.terminateDistance=terminateDistance;};jsts.operation.distance.DistanceOp.prototype.geom=null;jsts.operation.distance.DistanceOp.prototype.terminateDistance=0.0;jsts.operation.distance.DistanceOp.prototype.ptLocator=null;jsts.operation.distance.DistanceOp.prototype.minDistanceLocation=null;jsts.operation.distance.DistanceOp.prototype.minDistance=Number.MAX_VALUE;jsts.operation.distance.DistanceOp.distance=function(g0,g1){var distOp=new jsts.operation.distance.DistanceOp(g0,g1,0.0);return distOp.distance();};jsts.operation.distance.DistanceOp.isWithinDistance=function(g0,g1,distance){var distOp=new jsts.operation.distance.DistanceOp(g0,g1,distance);return distOp.distance()<=distance;};jsts.operation.distance.DistanceOp.nearestPoints=function(g0,g1){var distOp=new jsts.operation.distance.DistanceOp(g0,g1,0.0);return distOp.nearestPoints();};jsts.operation.distance.DistanceOp.prototype.distance=function(){if(this.geom[0]===null||this.geom[1]===null)
throw new jsts.error.IllegalArgumentError('null geometries are not supported');if(this.geom[0].isEmpty()||this.geom[1].isEmpty())
return 0.0;this.computeMinDistance();return this.minDistance;};jsts.operation.distance.DistanceOp.prototype.nearestPoints=function(){this.computeMinDistance();var nearestPts=[this.minDistanceLocation[0].getCoordinate(),this.minDistanceLocation[1].getCoordinate()];return nearestPts;};jsts.operation.distance.DistanceOp.prototype.nearestLocations=function(){this.computeMinDistance();return this.minDistanceLocation;};jsts.operation.distance.DistanceOp.prototype.updateMinDistance=function(locGeom,flip){if(locGeom[0]===null)
return;if(flip){this.minDistanceLocation[0]=locGeom[1];this.minDistanceLocation[1]=locGeom[0];}else{this.minDistanceLocation[0]=locGeom[0];this.minDistanceLocation[1]=locGeom[1];}};jsts.operation.distance.DistanceOp.prototype.computeMinDistance=function(){if(arguments.length>0){this.computeMinDistance2.apply(this,arguments);return;}
if(this.minDistanceLocation!==null)
return;this.minDistanceLocation=[];this.computeContainmentDistance();if(this.minDistance<=this.terminateDistance)
return;this.computeFacetDistance();};jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance=function(){if(arguments.length===2){this.computeContainmentDistance2.apply(this,arguments);return;}else if(arguments.length===3&&(!arguments[0]instanceof jsts.operation.distance.GeometryLocation)){this.computeContainmentDistance3.apply(this,arguments);return;}else if(arguments.length===3){this.computeContainmentDistance4.apply(this,arguments);return;}
var locPtPoly=[];this.computeContainmentDistance2(0,locPtPoly);if(this.minDistance<=this.terminateDistance)
return;this.computeContainmentDistance2(1,locPtPoly);};jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance2=function(polyGeomIndex,locPtPoly){var locationsIndex=1-polyGeomIndex;var polys=jsts.geom.util.PolygonExtracter.getPolygons(this.geom[polyGeomIndex]);if(polys.length>0){var insideLocs=jsts.operation.distance.ConnectedElementLocationFilter.getLocations(this.geom[locationsIndex]);this.computeContainmentDistance3(insideLocs,polys,locPtPoly);if(this.minDistance<=this.terminateDistance){this.minDistanceLocation[locationsIndex]=locPtPoly[0];this.minDistanceLocation[polyGeomIndex]=locPtPoly[1];return;}}};jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance3=function(locs,polys,locPtPoly){for(var i=0;i<locs.length;i++){var loc=locs[i];for(var j=0;j<polys.length;j++){this.computeContainmentDistance4(loc,polys[j],locPtPoly);if(this.minDistance<=this.terminateDistance)
return;}}};jsts.operation.distance.DistanceOp.prototype.computeContainmentDistance4=function(ptLoc,poly,locPtPoly){var pt=ptLoc.getCoordinate();if(jsts.geom.Location.EXTERIOR!==this.ptLocator.locate(pt,poly)){this.minDistance=0.0;locPtPoly[0]=ptLoc;locPtPoly[1]=new jsts.operation.distance.GeometryLocation(poly,pt);return;}};jsts.operation.distance.DistanceOp.prototype.computeFacetDistance=function(){var locGeom=[];var lines0=jsts.geom.util.LinearComponentExtracter.getLines(this.geom[0]);var lines1=jsts.geom.util.LinearComponentExtracter.getLines(this.geom[1]);var pts0=jsts.geom.util.PointExtracter.getPoints(this.geom[0]);var pts1=jsts.geom.util.PointExtracter.getPoints(this.geom[1]);this.computeMinDistanceLines(lines0,lines1,locGeom);this.updateMinDistance(locGeom,false);if(this.minDistance<=this.terminateDistance)
return;locGeom[0]=null;locGeom[1]=null;this.computeMinDistanceLinesPoints(lines0,pts1,locGeom);this.updateMinDistance(locGeom,false);if(this.minDistance<=this.terminateDistance)
return;locGeom[0]=null;locGeom[1]=null;this.computeMinDistanceLinesPoints(lines1,pts0,locGeom);this.updateMinDistance(locGeom,true);if(this.minDistance<=this.terminateDistance)
return;locGeom[0]=null;locGeom[1]=null;this.computeMinDistancePoints(pts0,pts1,locGeom);this.updateMinDistance(locGeom,false);};jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLines=function(lines0,lines1,locGeom){for(var i=0;i<lines0.length;i++){var line0=lines0[i];for(var j=0;j<lines1.length;j++){var line1=lines1[j];this.computeMinDistance(line0,line1,locGeom);if(this.minDistance<=this.terminateDistance)
return;}}};jsts.operation.distance.DistanceOp.prototype.computeMinDistancePoints=function(points0,points1,locGeom){for(var i=0;i<points0.length;i++){var pt0=points0[i];for(var j=0;j<points1.length;j++){var pt1=points1[j];var dist=pt0.getCoordinate().distance(pt1.getCoordinate());if(dist<this.minDistance){this.minDistance=dist;locGeom[0]=new jsts.operation.distance.GeometryLocation(pt0,0,pt0.getCoordinate());locGeom[1]=new jsts.operation.distance.GeometryLocation(pt1,0,pt1.getCoordinate());}
if(this.minDistance<=this.terminateDistance)
return;}}};jsts.operation.distance.DistanceOp.prototype.computeMinDistanceLinesPoints=function(lines,points,locGeom){for(var i=0;i<lines.length;i++){var line=lines[i];for(var j=0;j<points.length;j++){var pt=points[j];this.computeMinDistance(line,pt,locGeom);if(this.minDistance<=this.terminateDistance)
return;}}};jsts.operation.distance.DistanceOp.prototype.computeMinDistance2=function(line0,line1,locGeom){if(line1 instanceof jsts.geom.Point){this.computeMinDistance3(line0,line1,locGeom);return;}
if(line0.getEnvelopeInternal().distance(line1.getEnvelopeInternal())>this.minDistance){return;}
var coord0=line0.getCoordinates();var coord1=line1.getCoordinates();for(var i=0;i<coord0.length-1;i++){for(var j=0;j<coord1.length-1;j++){var dist=jsts.algorithm.CGAlgorithms.distanceLineLine(coord0[i],coord0[i+1],coord1[j],coord1[j+1]);if(dist<this.minDistance){this.minDistance=dist;var seg0=new jsts.geom.LineSegment(coord0[i],coord0[i+1]);var seg1=new jsts.geom.LineSegment(coord1[j],coord1[j+1]);var closestPt=seg0.closestPoints(seg1);locGeom[0]=new jsts.operation.distance.GeometryLocation(line0,i,closestPt[0]);locGeom[1]=new jsts.operation.distance.GeometryLocation(line1,j,closestPt[1]);}
if(this.minDistance<=this.terminateDistance){return;}}}};jsts.operation.distance.DistanceOp.prototype.computeMinDistance3=function(line,pt,locGeom){if(line.getEnvelopeInternal().distance(pt.getEnvelopeInternal())>this.minDistance){return;}
var coord0=line.getCoordinates();var coord=pt.getCoordinate();for(var i=0;i<coord0.length-1;i++){var dist=jsts.algorithm.CGAlgorithms.distancePointLine(coord,coord0[i],coord0[i+1]);if(dist<this.minDistance){this.minDistance=dist;var seg=new jsts.geom.LineSegment(coord0[i],coord0[i+1]);var segClosestPoint=seg.closestPoint(coord);locGeom[0]=new jsts.operation.distance.GeometryLocation(line,i,segClosestPoint);locGeom[1]=new jsts.operation.distance.GeometryLocation(pt,0,coord);}
if(this.minDistance<=this.terminateDistance){return;}}};jsts.index.strtree.SIRtree=function(nodeCapacity){nodeCapacity=nodeCapacity||10;jsts.index.strtree.AbstractSTRtree.call(this,nodeCapacity);};jsts.index.strtree.SIRtree.prototype=new jsts.index.strtree.AbstractSTRtree();jsts.index.strtree.SIRtree.constructor=jsts.index.strtree.SIRtree;jsts.index.strtree.SIRtree.prototype.comperator={compare:function(o1,o2){return o1.getBounds().getCentre()-o2.getBounds().getCentre();}};jsts.index.strtree.SIRtree.prototype.intersectionOp={intersects:function(aBounds,bBounds){return aBounds.intersects(bBounds);}};jsts.index.strtree.SIRtree.prototype.createNode=function(level){var AbstractNode=function(level){jsts.index.strtree.AbstractNode.apply(this,arguments);};AbstractNode.prototype=new jsts.index.strtree.AbstractNode();AbstractNode.constructor=AbstractNode;AbstractNode.prototype.computeBounds=function(){var bounds=null,childBoundables=this.getChildBoundables(),childBoundable;for(var i=0,l=childBoundables.length;i<l;i++){childBoundable=childBoundables[i];if(bounds===null){bounds=new jsts.index.strtree.Interval(childBoundable.getBounds());}
else{bounds.expandToInclude(childBoundable.getBounds());}}
return bounds;};return AbstractNode;};jsts.index.strtree.SIRtree.prototype.insert=function(x1,x2,item){jsts.index.strtree.AbstractSTRtree.prototype.insert(new jsts.index.strtree.Interval(Math.min(x1,x2),Math.max(x1,x2)),item);};jsts.index.strtree.SIRtree.prototype.query=function(x1,x2){x2=x2||x1;jsts.index.strtree.AbstractSTRtree.prototype.query(new jsts.index.strtree.Interval(Math.min(x1,x2),Math.max(x1,x2)));};jsts.index.strtree.SIRtree.prototype.getIntersectsOp=function(){return this.intersectionOp;};jsts.index.strtree.SIRtree.prototype.getComparator=function(){return this.comperator;};jsts.simplify.DouglasPeuckerSimplifier=function(inputGeom){this.inputGeom=inputGeom;this.isEnsureValidTopology=true;};jsts.simplify.DouglasPeuckerSimplifier.prototype.inputGeom=null;jsts.simplify.DouglasPeuckerSimplifier.prototype.distanceTolerance=null;jsts.simplify.DouglasPeuckerSimplifier.prototype.isEnsureValidTopology=null;jsts.simplify.DouglasPeuckerSimplifier.simplify=function(geom,distanceTolerance){var tss=new jsts.simplify.DouglasPeuckerSimplifier(geom);tss.setDistanceTolerance(distanceTolerance);return tss.getResultGeometry();};jsts.simplify.DouglasPeuckerSimplifier.prototype.setDistanceTolerance=function(distanceTolerance){if(distanceTolerance<0.0){throw"Tolerance must be non-negative";}
this.distanceTolerance=distanceTolerance;};jsts.simplify.DouglasPeuckerSimplifier.prototype.setEnsureValid=function(isEnsureValidTopology){this.isEnsureValidTopology=isEnsureValidTopology;};jsts.simplify.DouglasPeuckerSimplifier.prototype.getResultGeometry=function(){if(this.inputGeom.isEmpty()){return this.inputGeom.clone();}
return(new jsts.simplify.DPTransformer(this.distanceTolerance,this.isEnsureValidTopology)).transform(this.inputGeom);};(function(){jsts.operation.predicate.RectangleContains=function(rectangle){this.rectEnv=rectangle.getEnvelopeInternal();}
jsts.operation.predicate.RectangleContains.contains=function(rectangle,b){var rc=new jsts.operation.predicate.RectangleContains(rectangle);return rc.contains(b);}
jsts.operation.predicate.RectangleContains.prototype.rectEnv=null;jsts.operation.predicate.RectangleContains.prototype.contains=function(geom){if(!this.rectEnv.contains(geom.getEnvelopeInternal()))
return false;if(this.isContainedInBoundary(geom))
return false;return true;}
jsts.operation.predicate.RectangleContains.prototype.isContainedInBoundary=function(geom){if(geom instanceof jsts.geom.Polygon)return false;if(geom instanceof jsts.geom.Point)return this.isPointContainedInBoundary(geom.getCoordinate());if(geom instanceof jsts.geom.LineString)return this.isLineStringContainedInBoundary(geom);for(var i=0;i<geom.getNumGeometries();i++){var comp=geom.getGeometryN(i);if(!this.isContainedInBoundary(comp))
return false;}
return true;}
jsts.operation.predicate.RectangleContains.prototype.isPointContainedInBoundary=function(pt){return pt.x==this.rectEnv.getMinX()||pt.x==this.rectEnv.getMaxX()||pt.y==this.rectEnv.getMinY()||pt.y==this.rectEnv.getMaxY();}
jsts.operation.predicate.RectangleContains.prototype.isLineStringContainedInBoundary=function(line){var seq=line.getCoordinateSequence();for(var i=0;i<seq.length-1;i++){var p0=seq[i];var p1=seq[i+1];if(!this.isLineSegmentContainedInBoundary(p0,p1))
return false;}
return true;}
jsts.operation.predicate.RectangleContains.prototype.isLineSegmentContainedInBoundary=function(p0,p1){if(p0.equals(p1))
return this.isPointContainedInBoundary(p0);if(p0.x==p1.x){if(p0.x==this.rectEnv.getMinX()||p0.x==this.rectEnv.getMaxX())
return true;}
else if(p0.y==p1.y){if(p0.y==this.rectEnv.getMinY()||p0.y==this.rectEnv.getMaxY())
return true;}
return false;}})();(function(){var Location=jsts.geom.Location;var Position=jsts.geomgraph.Position;jsts.geomgraph.Depth=function(){this.depth=[[],[]];for(var i=0;i<2;i++){for(var j=0;j<3;j++){this.depth[i][j]=jsts.geomgraph.Depth.NULL_VALUE;}}};jsts.geomgraph.Depth.NULL_VALUE=-1;jsts.geomgraph.Depth.depthAtLocation=function(location){if(location===Location.EXTERIOR)
return 0;if(location===Location.INTERIOR)
return 1;return jsts.geomgraph.Depth.NULL_VALUE;};jsts.geomgraph.Depth.prototype.depth=null;jsts.geomgraph.Depth.prototype.getDepth=function(geomIndex,posIndex){return this.depth[geomIndex][posIndex];};jsts.geomgraph.Depth.prototype.setDepth=function(geomIndex,posIndex,depthValue){this.depth[geomIndex][posIndex]=depthValue;};jsts.geomgraph.Depth.prototype.getLocation=function(geomIndex,posIndex){if(this.depth[geomIndex][posIndex]<=0)
return Location.EXTERIOR;return Location.INTERIOR;};jsts.geomgraph.Depth.prototype.add=function(geomIndex,posIndex,location){if(location===Location.INTERIOR)
this.depth[geomIndex][posIndex]++;};jsts.geomgraph.Depth.prototype.isNull=function(){if(arguments.length>0){return this.isNull2.apply(this,arguments);}
for(var i=0;i<2;i++){for(var j=0;j<3;j++){if(this.depth[i][j]!==jsts.geomgraph.Depth.NULL_VALUE)
return false;}}
return true;};jsts.geomgraph.Depth.prototype.isNull2=function(geomIndex){if(arguments.length>1){return this.isNull3.apply(this,arguments);}
return this.depth[geomIndex][1]==jsts.geomgraph.Depth.NULL_VALUE;};jsts.geomgraph.Depth.prototype.isNull3=function(geomIndex,posIndex){return this.depth[geomIndex][posIndex]==jsts.geomgraph.Depth.NULL_VALUE;};jsts.geomgraph.Depth.prototype.add=function(lbl){for(var i=0;i<2;i++){for(var j=1;j<3;j++){var loc=lbl.getLocation(i,j);if(loc===Location.EXTERIOR||loc===Location.INTERIOR){if(this.isNull(i,j)){this.depth[i][j]=jsts.geomgraph.Depth.depthAtLocation(loc);}else
this.depth[i][j]+=jsts.geomgraph.Depth.depthAtLocation(loc);}}}};jsts.geomgraph.Depth.prototype.getDelta=function(geomIndex){return this.depth[geomIndex][Position.RIGHT]-
this.depth[geomIndex][Position.LEFT];};jsts.geomgraph.Depth.prototype.normalize=function(){for(var i=0;i<2;i++){if(!this.isNull(i)){var minDepth=this.depth[i][1];if(this.depth[i][2]<minDepth)
minDepth=this.depth[i][2];if(minDepth<0)
minDepth=0;for(var j=1;j<3;j++){var newValue=0;if(this.depth[i][j]>minDepth)
newValue=1;this.depth[i][j]=newValue;}}}};jsts.geomgraph.Depth.prototype.toString=function(){return'A: '+this.depth[0][1]+','+this.depth[0][2]+' B: '+
this.depth[1][1]+','+this.depth[1][2];};})();jsts.algorithm.BoundaryNodeRule=function(){};jsts.algorithm.BoundaryNodeRule.prototype.isInBoundary=function(boundaryCount){throw new jsts.error.AbstractMethodInvocationError();};jsts.algorithm.Mod2BoundaryNodeRule=function(){};jsts.algorithm.Mod2BoundaryNodeRule.prototype=new jsts.algorithm.BoundaryNodeRule();jsts.algorithm.Mod2BoundaryNodeRule.prototype.isInBoundary=function(boundaryCount){return boundaryCount%2===1;};jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE=new jsts.algorithm.Mod2BoundaryNodeRule();jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE=jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE;jsts.operation.distance.GeometryLocation=function(component,segIndex,pt){this.component=component;this.segIndex=segIndex;this.pt=pt;};jsts.operation.distance.GeometryLocation.INSIDE_AREA=-1;jsts.operation.distance.GeometryLocation.prototype.component=null;jsts.operation.distance.GeometryLocation.prototype.segIndex=null;jsts.operation.distance.GeometryLocation.prototype.pt=null;jsts.operation.distance.GeometryLocation.prototype.getGeometryComponent=function(){return this.component;};jsts.operation.distance.GeometryLocation.prototype.getSegmentIndex=function(){return this.segIndex;};jsts.operation.distance.GeometryLocation.prototype.getCoordinate=function(){return this.pt;};jsts.operation.distance.GeometryLocation.prototype.isInsideArea=function(){return this.segIndex===jsts.operation.distance.GeometryLocation.INSIDE_AREA;};jsts.geom.util.PointExtracter=function(pts){this.pts=pts;};jsts.geom.util.PointExtracter.prototype=new jsts.geom.GeometryFilter();jsts.geom.util.PointExtracter.prototype.pts=null;jsts.geom.util.PointExtracter.getPoints=function(geom,list){if(list===undefined){list=[];}
if(geom instanceof jsts.geom.Point){list.push(geom);}else if(geom instanceof jsts.geom.GeometryCollection||geom instanceof jsts.geom.MultiPoint||geom instanceof jsts.geom.MultiLineString||geom instanceof jsts.geom.MultiPolygon){geom.apply(new jsts.geom.util.PointExtracter(list));}
return list;};jsts.geom.util.PointExtracter.prototype.filter=function(geom){if(geom instanceof jsts.geom.Point)
this.pts.push(geom);};(function(){var Location=jsts.geom.Location;jsts.operation.relate.RelateNodeGraph=function(){this.nodes=new jsts.geomgraph.NodeMap(new jsts.operation.relate.RelateNodeFactory());};jsts.operation.relate.RelateNodeGraph.prototype.nodes=null;jsts.operation.relate.RelateNodeGraph.prototype.build=function(geomGraph){this.computeIntersectionNodes(geomGraph,0);this.copyNodesAndLabels(geomGraph,0);var eeBuilder=new jsts.operation.relate.EdgeEndBuilder();var eeList=eeBuilder.computeEdgeEnds(geomGraph.getEdgeIterator());this.insertEdgeEnds(eeList);};jsts.operation.relate.RelateNodeGraph.prototype.computeIntersectionNodes=function(geomGraph,argIndex){for(var edgeIt=geomGraph.getEdgeIterator();edgeIt.hasNext();){var e=edgeIt.next();var eLoc=e.getLabel().getLocation(argIndex);for(var eiIt=e.getEdgeIntersectionList().iterator();eiIt.hasNext();){var ei=eiIt.next();var n=this.nodes.addNode(ei.coord);if(eLoc===Location.BOUNDARY)
n.setLabelBoundary(argIndex);else{if(n.getLabel().isNull(argIndex))
n.setLabel(argIndex,Location.INTERIOR);}}}};jsts.operation.relate.RelateNodeGraph.prototype.copyNodesAndLabels=function(geomGraph,argIndex){for(var nodeIt=geomGraph.getNodeIterator();nodeIt.hasNext();){var graphNode=nodeIt.next();var newNode=this.nodes.addNode(graphNode.getCoordinate());newNode.setLabel(argIndex,graphNode.getLabel().getLocation(argIndex));}};jsts.operation.relate.RelateNodeGraph.prototype.insertEdgeEnds=function(ee){for(var i=ee.iterator();i.hasNext();){var e=i.next();this.nodes.add(e);}};jsts.operation.relate.RelateNodeGraph.prototype.getNodeIterator=function(){return this.nodes.iterator();};})();jsts.geomgraph.index.SimpleSweepLineIntersector=function(){};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype=new jsts.geomgraph.index.EdgeSetIntersector();jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.events=[];jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.nOverlaps=null;jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.computeIntersections=function(edges,si,testAllSegments){if(si instanceof javascript.util.List){this.computeIntersections2.apply(this,arguments);return;}
if(testAllSegments){this.add(edges,null);}else{this.add(edges);}
this.computeIntersections3(si);};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.computeIntersections2=function(edges0,edges1,si){this.add(edges0,edges0);this.add(edges1,edges1);this.computeIntersections3(si);};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.add=function(edge,edgeSet){if(edge instanceof javascript.util.List){this.add2.apply(this,arguments);return;}
var pts=edge.getCoordinates();for(var i=0;i<pts.length-1;i++){var ss=new jsts.geomgraph.index.SweepLineSegment(edge,i);var insertEvent=new jsts.geomgraph.index.SweepLineEvent(ss.getMinX(),ss,edgeSet);this.events.push(insertEvent);this.events.push(new jsts.geomgraph.index.SweepLineEvent(ss.getMaxX(),insertEvent));}};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.add2=function(edges,edgeSet){for(var i=edges.iterator();i.hasNext();){var edge=i.next();if(edgeSet){this.add(edge,edgeSet);}else{this.add(edge,edge);}}};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.prepareEvents=function(){this.events.sort(function(a,b){return a.compareTo(b);});for(var i=0;i<this.events.length;i++){var ev=this.events[i];if(ev.isDelete()){ev.getInsertEvent().setDeleteEventIndex(i);}}};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.computeIntersections3=function(si){this.nOverlaps=0;this.prepareEvents();for(var i=0;i<this.events.length;i++){var ev=this.events[i];if(ev.isInsert()){this.processOverlaps(i,ev.getDeleteEventIndex(),ev,si);}}};jsts.geomgraph.index.SimpleSweepLineIntersector.prototype.processOverlaps=function(start,end,ev0,si){var ss0=ev0.getObject();for(var i=start;i<end;i++){var ev1=this.events[i];if(ev1.isInsert()){var ss1=ev1.getObject();if(!ev0.isSameLabel(ev1)){ss0.computeIntersections(ss1,si);this.nOverlaps++;}}}}
jsts.triangulate.VoronoiDiagramBuilder=function(){this.siteCoords=null;this.tolerance=0.0;this.subdiv=null;this.clipEnv=null;this.diagramEnv=null;};jsts.triangulate.VoronoiDiagramBuilder.prototype.setSites=function(){var arg=arguments[0];if(arg instanceof jsts.geom.Geometry||arg instanceof jsts.geom.Coordinate||arg instanceof jsts.geom.Point||arg instanceof jsts.geom.MultiPoint||arg instanceof jsts.geom.LineString||arg instanceof jsts.geom.MultiLineString||arg instanceof jsts.geom.LinearRing||arg instanceof jsts.geom.Polygon||arg instanceof jsts.geom.MultiPolygon){this.setSitesByGeometry(arg);}else{this.setSitesByArray(arg);}};jsts.triangulate.VoronoiDiagramBuilder.prototype.setSitesByGeometry=function(geom){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates(geom);};jsts.triangulate.VoronoiDiagramBuilder.prototype.setSitesByArray=function(coords){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.unique(coords);};jsts.triangulate.VoronoiDiagramBuilder.prototype.setClipEnvelope=function(clipEnv){this.clipEnv=clipEnv;};jsts.triangulate.VoronoiDiagramBuilder.prototype.setTolerance=function(tolerance)
{this.tolerance=tolerance;};jsts.triangulate.VoronoiDiagramBuilder.prototype.create=function(){if(this.subdiv!==null){return;}
var siteEnv,expandBy,vertices,triangulator;siteEnv=jsts.triangulate.DelaunayTriangulationBuilder.envelope(this.siteCoords);this.diagramEnv=siteEnv;expandBy=Math.max(this.diagramEnv.getWidth(),this.diagramEnv.getHeight());this.diagramEnv.expandBy(expandBy);if(this.clipEnv!==null){this.diagramEnv.expandToInclude(this.clipEnv);}
vertices=jsts.triangulate.DelaunayTriangulationBuilder.toVertices(this.siteCoords);this.subdiv=new jsts.triangulate.quadedge.QuadEdgeSubdivision(siteEnv,this.tolerance);triangulator=new jsts.triangulate.IncrementalDelaunayTriangulator(this.subdiv);triangulator.insertSites(vertices);};jsts.triangulate.VoronoiDiagramBuilder.prototype.getSubdivision=function(){this.create();return this.subdiv;};jsts.triangulate.VoronoiDiagramBuilder.prototype.getDiagram=function(geomFact){this.create();var polys=this.subdiv.getVoronoiDiagram(geomFact);return this.clipGeometryCollection(polys,this.diagramEnv);};jsts.triangulate.VoronoiDiagramBuilder.prototype.clipGeometryCollection=function(geom,clipEnv){var clipPoly,clipped,i,il,g,result;clipPoly=geom.getFactory().toGeometry(clipEnv);clipped=[];i=0,il=geom.getNumGeometries();for(i;i<il;i++){g=geom.getGeometryN(i);result=null;if(clipEnv.contains(g.getEnvelopeInternal())){result=g;}
else if(clipEnv.intersects(g.getEnvelopeInternal())){result=clipPoly.intersection(g);}
if(result!==null&&!result.isEmpty()){clipped.push(result);}}
return geom.getFactory().createGeometryCollection(clipped);};jsts.operation.valid.IndexedNestedRingTester=function(graph){this.graph=graph;this.rings=new javascript.util.ArrayList();this.totalEnv=new jsts.geom.Envelope();this.index=null;this.nestedPt=null;};jsts.operation.valid.IndexedNestedRingTester.prototype.getNestedPoint=function(){return this.nestedPt;};jsts.operation.valid.IndexedNestedRingTester.prototype.add=function(ring){this.rings.add(ring);this.totalEnv.expandToInclude(ring.getEnvelopeInternal());};jsts.operation.valid.IndexedNestedRingTester.prototype.isNonNested=function(){this.buildIndex();for(var i=0;i<this.rings.size();i++){var innerRing=this.rings.get(i);var innerRingPts=innerRing.getCoordinates();var results=this.index.query(innerRing.getEnvelopeInternal());for(var j=0;j<results.length;j++){var searchRing=results[j];var searchRingPts=searchRing.getCoordinates();if(innerRing==searchRing){continue;}
if(!innerRing.getEnvelopeInternal().intersects(searchRing.getEnvelopeInternal())){continue;}
var innerRingPt=jsts.operation.valid.IsValidOp.findPtNotNode(innerRingPts,searchRing,this.graph);if(innerRingPt==null){continue;}
var isInside=jsts.algorithm.CGAlgorithms.isPointInRing(innerRingPt,searchRingPts);if(isInside){this.nestedPt=innerRingPt;return false;}}}
return true;};jsts.operation.valid.IndexedNestedRingTester.prototype.buildIndex=function(){this.index=new jsts.index.strtree.STRtree();for(var i=0;i<this.rings.size();i++){var ring=this.rings.get(i);var env=ring.getEnvelopeInternal();this.index.insert(env,ring);}};jsts.geomgraph.index.MonotoneChain=function(mce,chainIndex){this.mce=mce;this.chainIndex=chainIndex;};jsts.geomgraph.index.MonotoneChain.prototype.mce=null;jsts.geomgraph.index.MonotoneChain.prototype.chainIndex=null;jsts.geomgraph.index.MonotoneChain.prototype.computeIntersections=function(mc,si){this.mce.computeIntersectsForChain(this.chainIndex,mc.mce,mc.chainIndex,si);};jsts.noding.SegmentNode=function(segString,coord,segmentIndex,segmentOctant){this.segString=segString;this.coord=new jsts.geom.Coordinate(coord);this.segmentIndex=segmentIndex;this.segmentOctant=segmentOctant;this._isInterior=!coord.equals2D(segString.getCoordinate(segmentIndex));};jsts.noding.SegmentNode.prototype.segString=null;jsts.noding.SegmentNode.prototype.coord=null;jsts.noding.SegmentNode.prototype.segmentIndex=null;jsts.noding.SegmentNode.prototype.segmentOctant=null;jsts.noding.SegmentNode.prototype._isInterior=null;jsts.noding.SegmentNode.prototype.getCoordinate=function(){return this.coord;};jsts.noding.SegmentNode.prototype.isInterior=function(){return this._isInterior;};jsts.noding.SegmentNode.prototype.isEndPoint=function(maxSegmentIndex){if(this.segmentIndex===0&&!this._isInterior)return true;if(this.segmentIndex===this.maxSegmentIndex)return true;return false;};jsts.noding.SegmentNode.prototype.compareTo=function(obj){var other=obj;if(this.segmentIndex<other.segmentIndex)return-1;if(this.segmentIndex>other.segmentIndex)return 1;if(this.coord.equals2D(other.coord))return 0;return jsts.noding.SegmentPointComparator.compare(this.segmentOctant,this.coord,other.coord);};(function(){jsts.io.GeoJSONWriter=function(){this.parser=new jsts.io.GeoJSONParser(this.geometryFactory);};jsts.io.GeoJSONWriter.prototype.write=function(geometry){var geoJson=this.parser.write(geometry);return geoJson;};})();jsts.io.OpenLayersParser=function(geometryFactory){this.geometryFactory=geometryFactory||new jsts.geom.GeometryFactory();};jsts.io.OpenLayersParser.prototype.read=function(geometry){if(geometry.CLASS_NAME==='OpenLayers.Geometry.Point'){return this.convertFromPoint(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.LineString'){return this.convertFromLineString(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.LinearRing'){return this.convertFromLinearRing(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.Polygon'){return this.convertFromPolygon(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.MultiPoint'){return this.convertFromMultiPoint(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.MultiLineString'){return this.convertFromMultiLineString(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.MultiPolygon'){return this.convertFromMultiPolygon(geometry);}else if(geometry.CLASS_NAME==='OpenLayers.Geometry.Collection'){return this.convertFromCollection(geometry);}};jsts.io.OpenLayersParser.prototype.convertFromPoint=function(point){return this.geometryFactory.createPoint(new jsts.geom.Coordinate(point.x,point.y));};jsts.io.OpenLayersParser.prototype.convertFromLineString=function(lineString){var i;var coordinates=[];for(i=0;i<lineString.components.length;i++){coordinates.push(new jsts.geom.Coordinate(lineString.components[i].x,lineString.components[i].y));}
return this.geometryFactory.createLineString(coordinates);};jsts.io.OpenLayersParser.prototype.convertFromLinearRing=function(linearRing){var i;var coordinates=[];for(i=0;i<linearRing.components.length;i++){coordinates.push(new jsts.geom.Coordinate(linearRing.components[i].x,linearRing.components[i].y));}
return this.geometryFactory.createLinearRing(coordinates);};jsts.io.OpenLayersParser.prototype.convertFromPolygon=function(polygon){var i;var shell=null;var holes=[];for(i=0;i<polygon.components.length;i++){var linearRing=this.convertFromLinearRing(polygon.components[i]);if(i===0){shell=linearRing;}else{holes.push(linearRing);}}
return this.geometryFactory.createPolygon(shell,holes);};jsts.io.OpenLayersParser.prototype.convertFromMultiPoint=function(multiPoint){var i;var points=[];for(i=0;i<multiPoint.components.length;i++){points.push(this.convertFromPoint(multiPoint.components[i]));}
return this.geometryFactory.createMultiPoint(points);};jsts.io.OpenLayersParser.prototype.convertFromMultiLineString=function(multiLineString){var i;var lineStrings=[];for(i=0;i<multiLineString.components.length;i++){lineStrings.push(this.convertFromLineString(multiLineString.components[i]));}
return this.geometryFactory.createMultiLineString(lineStrings);};jsts.io.OpenLayersParser.prototype.convertFromMultiPolygon=function(multiPolygon){var i;var polygons=[];for(i=0;i<multiPolygon.components.length;i++){polygons.push(this.convertFromPolygon(multiPolygon.components[i]));}
return this.geometryFactory.createMultiPolygon(polygons);};jsts.io.OpenLayersParser.prototype.convertFromCollection=function(collection){var i;var geometries=[];for(i=0;i<collection.components.length;i++){geometries.push(this.read(collection.components[i]));}
return this.geometryFactory.createGeometryCollection(geometries);};jsts.io.OpenLayersParser.prototype.write=function(geometry){if(geometry.CLASS_NAME==='jsts.geom.Point'){return this.convertToPoint(geometry.coordinate);}else if(geometry.CLASS_NAME==='jsts.geom.LineString'){return this.convertToLineString(geometry);}else if(geometry.CLASS_NAME==='jsts.geom.LinearRing'){return this.convertToLinearRing(geometry);}else if(geometry.CLASS_NAME==='jsts.geom.Polygon'){return this.convertToPolygon(geometry);}else if(geometry.CLASS_NAME==='jsts.geom.MultiPoint'){return this.convertToMultiPoint(geometry);}else if(geometry.CLASS_NAME==='jsts.geom.MultiLineString'){return this.convertToMultiLineString(geometry);}else if(geometry.CLASS_NAME==='jsts.geom.MultiPolygon'){return this.convertToMultiPolygon(geometry);}else if(geometry.CLASS_NAME==='jsts.geom.GeometryCollection'){return this.convertToCollection(geometry);}};jsts.io.OpenLayersParser.prototype.convertToPoint=function(coordinate){return new OpenLayers.Geometry.Point(coordinate.x,coordinate.y);};jsts.io.OpenLayersParser.prototype.convertToLineString=function(lineString){var i;var points=[];for(i=0;i<lineString.points.length;i++){var coordinate=lineString.points[i];points.push(this.convertToPoint(coordinate));}
return new OpenLayers.Geometry.LineString(points);};jsts.io.OpenLayersParser.prototype.convertToLinearRing=function(linearRing){var i;var points=[];for(i=0;i<linearRing.points.length;i++){var coordinate=linearRing.points[i];points.push(this.convertToPoint(coordinate));}
return new OpenLayers.Geometry.LinearRing(points);};jsts.io.OpenLayersParser.prototype.convertToPolygon=function(polygon){var i;var rings=[];rings.push(this.convertToLinearRing(polygon.shell));for(i=0;i<polygon.holes.length;i++){var ring=polygon.holes[i];rings.push(this.convertToLinearRing(ring));}
return new OpenLayers.Geometry.Polygon(rings);};jsts.io.OpenLayersParser.prototype.convertToMultiPoint=function(multiPoint){var i;var points=[];for(i=0;i<multiPoint.geometries.length;i++){var coordinate=multiPoint.geometries[i].coordinate;points.push(new OpenLayers.Geometry.Point(coordinate.x,coordinate.y));}
return new OpenLayers.Geometry.MultiPoint(points);};jsts.io.OpenLayersParser.prototype.convertToMultiLineString=function(multiLineString){var i;var lineStrings=[];for(i=0;i<multiLineString.geometries.length;i++){lineStrings.push(this.convertToLineString(multiLineString.geometries[i]));}
return new OpenLayers.Geometry.MultiLineString(lineStrings);};jsts.io.OpenLayersParser.prototype.convertToMultiPolygon=function(multiPolygon){var i;var polygons=[];for(i=0;i<multiPolygon.geometries.length;i++){polygons.push(this.convertToPolygon(multiPolygon.geometries[i]));}
return new OpenLayers.Geometry.MultiPolygon(polygons);};jsts.io.OpenLayersParser.prototype.convertToCollection=function(geometryCollection){var i;var geometries=[];for(i=0;i<geometryCollection.geometries.length;i++){var geometry=geometryCollection.geometries[i];var geometryOpenLayers=this.write(geometry);geometries.push(geometryOpenLayers);}
return new OpenLayers.Geometry.Collection(geometries);};jsts.index.quadtree.Quadtree=function(){this.root=new jsts.index.quadtree.Root();this.minExtent=1.0;};jsts.index.quadtree.Quadtree.ensureExtent=function(itemEnv,minExtent){var minx,maxx,miny,maxy;minx=itemEnv.getMinX();maxx=itemEnv.getMaxX();miny=itemEnv.getMinY();maxy=itemEnv.getMaxY();if(minx!==maxx&&miny!==maxy){return itemEnv;}
if(minx===maxx){minx=minx-(minExtent/2.0);maxx=minx+(minExtent/2.0);}
if(miny===maxy){miny=miny-(minExtent/2.0);maxy=miny+(minExtent/2.0);}
return new jsts.geom.Envelope(minx,maxx,miny,maxy);};jsts.index.quadtree.Quadtree.prototype.depth=function(){return this.root.depth();};jsts.index.quadtree.Quadtree.prototype.size=function(){return this.root.size();};jsts.index.quadtree.Quadtree.prototype.insert=function(itemEnv,item){this.collectStats(itemEnv);var insertEnv=jsts.index.quadtree.Quadtree.ensureExtent(itemEnv,this.minExtent);this.root.insert(insertEnv,item);};jsts.index.quadtree.Quadtree.prototype.remove=function(itemEnv,item){var posEnv=jsts.index.quadtree.Quadtree.ensureExtent(itemEnv,this.minExtent);return this.root.remove(posEnv,item);};jsts.index.quadtree.Quadtree.prototype.query=function(){if(arguments.length===1){return jsts.index.quadtree.Quadtree.prototype.queryByEnvelope.apply(this,arguments);}else{jsts.index.quadtree.Quadtree.prototype.queryWithVisitor.apply(this,arguments);}};jsts.index.quadtree.Quadtree.prototype.queryByEnvelope=function(searchEnv){var visitor=new jsts.index.ArrayListVisitor();this.query(searchEnv,visitor);return visitor.getItems();};jsts.index.quadtree.Quadtree.prototype.queryWithVisitor=function(searchEnv,visitor){this.root.visit(searchEnv,visitor);};jsts.index.quadtree.Quadtree.prototype.queryAll=function(){var foundItems=[];foundItems=this.root.addAllItems(foundItems);return foundItems;};jsts.index.quadtree.Quadtree.prototype.collectStats=function(itemEnv){var delX=itemEnv.getWidth();if(delX<this.minExtent&&delX>0.0){this.minExtent=delX;}
var delY=itemEnv.getHeight();if(delY<this.minExtent&&delY>0.0){this.minExtent=delY;}};jsts.operation.relate.RelateNodeFactory=function(){};jsts.operation.relate.RelateNodeFactory.prototype=new jsts.geomgraph.NodeFactory();jsts.operation.relate.RelateNodeFactory.prototype.createNode=function(coord){return new jsts.operation.relate.RelateNode(coord,new jsts.operation.relate.EdgeEndBundleStar());};jsts.index.quadtree.Key=function(itemEnv){this.pt=new jsts.geom.Coordinate();this.level=0;this.env=null;this.computeKey(itemEnv);};jsts.index.quadtree.Key.computeQuadLevel=function(env){var dx,dy,dMax,level;dx=env.getWidth();dy=env.getHeight();dMax=dx>dy?dx:dy;level=jsts.index.DoubleBits.exponent(dMax)+1;return level;};jsts.index.quadtree.Key.prototype.getPoint=function(){return this.pt;};jsts.index.quadtree.Key.prototype.getLevel=function(){return this.level;};jsts.index.quadtree.Key.prototype.getEnvelope=function(){return this.env;};jsts.index.quadtree.Key.prototype.getCentre=function(){var x,y;x=(this.env.getMinX()+this.env.getMaxX())/2;y=(this.env.getMinY()+this.env.getMaxY())/2;return new jsts.geom.Coordinate(x,y);};jsts.index.quadtree.Key.prototype.computeKey=function(){if(arguments[0]instanceof jsts.geom.Envelope){this.computeKeyFromEnvelope(arguments[0]);}else{this.computeKeyFromLevel(arguments[0],arguments[1]);}};jsts.index.quadtree.Key.prototype.computeKeyFromEnvelope=function(env){this.level=jsts.index.quadtree.Key.computeQuadLevel(env);this.env=new jsts.geom.Envelope();this.computeKey(this.level,env);while(!this.env.contains(env)){this.level+=1;this.computeKey(this.level,env);}};jsts.index.quadtree.Key.prototype.computeKeyFromLevel=function(level,env){var quadSize=jsts.index.DoubleBits.powerOf2(level);this.pt.x=Math.floor(env.getMinX()/quadSize)*quadSize;this.pt.y=Math.floor(env.getMinY()/quadSize)*quadSize;this.env.init(this.pt.x,this.pt.x+quadSize,this.pt.y,this.pt.y+
quadSize);};jsts.geom.CoordinateArrays=function(){throw new jsts.error.AbstractMethodInvocationError();};jsts.geom.CoordinateArrays.copyDeep=function(){if(arguments.length===1){return jsts.geom.CoordinateArrays.copyDeep1(arguments[0]);}else if(arguments.length===5){jsts.geom.CoordinateArrays.copyDeep2(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);}};jsts.geom.CoordinateArrays.copyDeep1=function(coordinates){var copy=[];for(var i=0;i<coordinates.length;i++){copy[i]=new jsts.geom.Coordinate(coordinates[i]);}
return copy;};jsts.geom.CoordinateArrays.copyDeep2=function(src,srcStart,dest,destStart,length){for(var i=0;i<length;i++){dest[destStart+i]=new jsts.geom.Coordinate(src[srcStart+i]);}};jsts.geom.CoordinateArrays.removeRepeatedPoints=function(coord){var coordList;if(!this.hasRepeatedPoints(coord)){return coord;}
coordList=new jsts.geom.CoordinateList(coord,false);return coordList.toCoordinateArray();};jsts.geom.CoordinateArrays.hasRepeatedPoints=function(coord){var i;for(i=1;i<coord.length;i++){if(coord[i-1].equals(coord[i])){return true;}}
return false;};jsts.geom.CoordinateArrays.ptNotInList=function(testPts,pts){for(var i=0;i<testPts.length;i++){var testPt=testPts[i];if(jsts.geom.CoordinateArrays.indexOf(testPt,pts)<0)
return testPt;}
return null;};jsts.geom.CoordinateArrays.increasingDirection=function(pts){for(var i=0;i<parseInt(pts.length/2);i++){var j=pts.length-1-i;var comp=pts[i].compareTo(pts[j]);if(comp!=0)
return comp;}
return 1;};jsts.geom.CoordinateArrays.minCoordinate=function(coordinates){var minCoord=null;for(var i=0;i<coordinates.length;i++){if(minCoord===null||minCoord.compareTo(coordinates[i])>0){minCoord=coordinates[i];}}
return minCoord;};jsts.geom.CoordinateArrays.scroll=function(coordinates,firstCoordinate){var i=jsts.geom.CoordinateArrays.indexOf(firstCoordinate,coordinates);if(i<0)
return;var newCoordinates=coordinates.slice(i).concat(coordinates.slice(0,i));for(i=0;i<newCoordinates.length;i++){coordinates[i]=newCoordinates[i];}};jsts.geom.CoordinateArrays.indexOf=function(coordinate,coordinates){for(var i=0;i<coordinates.length;i++){if(coordinate.equals(coordinates[i])){return i;}}
return-1;};jsts.operation.overlay.MinimalEdgeRing=function(start,geometryFactory){jsts.geomgraph.EdgeRing.call(this,start,geometryFactory);};jsts.operation.overlay.MinimalEdgeRing.prototype=new jsts.geomgraph.EdgeRing();jsts.operation.overlay.MinimalEdgeRing.constructor=jsts.operation.overlay.MinimalEdgeRing;jsts.operation.overlay.MinimalEdgeRing.prototype.getNext=function(de){return de.getNextMin();};jsts.operation.overlay.MinimalEdgeRing.prototype.setEdgeRing=function(de,er){de.setMinEdgeRing(er);};jsts.triangulate.DelaunayTriangulationBuilder=function(){this.siteCoords=null;this.tolerance=0.0;this.subdiv=null;};jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates=function(geom){if(geom===undefined||geom===null){return new jsts.geom.CoordinateList([],false).toArray();}
var coords=geom.getCoordinates();return jsts.triangulate.DelaunayTriangulationBuilder.unique(coords);};jsts.triangulate.DelaunayTriangulationBuilder.unique=function(coords){coords.sort(function(a,b){return a.compareTo(b);});var coordList=new jsts.geom.CoordinateList(coords,false);return coordList.toArray();};jsts.triangulate.DelaunayTriangulationBuilder.toVertices=function(coords){var verts=new Array(coords.length),i=0,il=coords.length,coord;for(i;i<il;i++){coord=coords[i];verts[i]=new jsts.triangulate.quadedge.Vertex(coord);}
return verts;};jsts.triangulate.DelaunayTriangulationBuilder.envelope=function(coords){var env=new jsts.geom.Envelope(),i=0,il=coords.length;for(i;i<il;i++){env.expandToInclude(coords[i]);}
return env;};jsts.triangulate.DelaunayTriangulationBuilder.prototype.setSites=function(){var arg=arguments[0];if(arg instanceof jsts.geom.Geometry||arg instanceof jsts.geom.Coordinate||arg instanceof jsts.geom.Point||arg instanceof jsts.geom.MultiPoint||arg instanceof jsts.geom.LineString||arg instanceof jsts.geom.MultiLineString||arg instanceof jsts.geom.LinearRing||arg instanceof jsts.geom.Polygon||arg instanceof jsts.geom.MultiPolygon){this.setSitesFromGeometry(arg);}else{this.setSitesFromCollection(arg);}};jsts.triangulate.DelaunayTriangulationBuilder.prototype.setSitesFromGeometry=function(geom){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.extractUniqueCoordinates(geom);};jsts.triangulate.DelaunayTriangulationBuilder.prototype.setSitesFromCollection=function(coords){this.siteCoords=jsts.triangulate.DelaunayTriangulationBuilder.unique(coords);};jsts.triangulate.DelaunayTriangulationBuilder.prototype.setTolerance=function(tolerance){this.tolerance=tolerance;};jsts.triangulate.DelaunayTriangulationBuilder.prototype.create=function(){if(this.subdiv===null){var siteEnv,vertices,triangulator;siteEnv=jsts.triangulate.DelaunayTriangulationBuilder.envelope(this.siteCoords);vertices=jsts.triangulate.DelaunayTriangulationBuilder.toVertices(this.siteCoords);this.subdiv=new jsts.triangulate.quadedge.QuadEdgeSubdivision(siteEnv,this.tolerance);triangulator=new jsts.triangulate.IncrementalDelaunayTriangulator(this.subdiv);triangulator.insertSites(vertices);}};jsts.triangulate.DelaunayTriangulationBuilder.prototype.getSubdivision=function(){this.create();return this.subdiv;};jsts.triangulate.DelaunayTriangulationBuilder.prototype.getEdges=function(geomFact){this.create();return this.subdiv.getEdges(geomFact);};jsts.triangulate.DelaunayTriangulationBuilder.prototype.getTriangles=function(geomFact){this.create();return this.subdiv.getTriangles(geomFact);};jsts.algorithm.RayCrossingCounter=function(p){this.p=p;};jsts.algorithm.RayCrossingCounter.locatePointInRing=function(p,ring){var counter=new jsts.algorithm.RayCrossingCounter(p);for(var i=1;i<ring.length;i++){var p1=ring[i];var p2=ring[i-1];counter.countSegment(p1,p2);if(counter.isOnSegment())
return counter.getLocation();}
return counter.getLocation();};jsts.algorithm.RayCrossingCounter.prototype.p=null;jsts.algorithm.RayCrossingCounter.prototype.crossingCount=0;jsts.algorithm.RayCrossingCounter.prototype.isPointOnSegment=false;jsts.algorithm.RayCrossingCounter.prototype.countSegment=function(p1,p2){if(p1.x<this.p.x&&p2.x<this.p.x)
return;if(this.p.x==p2.x&&this.p.y===p2.y){this.isPointOnSegment=true;return;}
if(p1.y===this.p.y&&p2.y===this.p.y){var minx=p1.x;var maxx=p2.x;if(minx>maxx){minx=p2.x;maxx=p1.x;}
if(this.p.x>=minx&&this.p.x<=maxx){this.isPointOnSegment=true;}
return;}
if(((p1.y>this.p.y)&&(p2.y<=this.p.y))||((p2.y>this.p.y)&&(p1.y<=this.p.y))){var x1=p1.x-this.p.x;var y1=p1.y-this.p.y;var x2=p2.x-this.p.x;var y2=p2.y-this.p.y;var xIntSign=jsts.algorithm.RobustDeterminant.signOfDet2x2(x1,y1,x2,y2);if(xIntSign===0.0){this.isPointOnSegment=true;return;}
if(y2<y1)
xIntSign=-xIntSign;if(xIntSign>0.0){this.crossingCount++;}}};jsts.algorithm.RayCrossingCounter.prototype.isOnSegment=function(){return jsts.geom.isPointOnSegment;};jsts.algorithm.RayCrossingCounter.prototype.getLocation=function(){if(this.isPointOnSegment)
return jsts.geom.Location.BOUNDARY;if((this.crossingCount%2)===1){return jsts.geom.Location.INTERIOR;}
return jsts.geom.Location.EXTERIOR;};jsts.algorithm.RayCrossingCounter.prototype.isPointInPolygon=function(){return this.getLocation()!==jsts.geom.Location.EXTERIOR;};jsts.operation.BoundaryOp=function(geom,bnRule){this.geom=geom;this.geomFact=geom.getFactory();this.bnRule=bnRule||jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE;};jsts.operation.BoundaryOp.prototype.geom=null;jsts.operation.BoundaryOp.prototype.geomFact=null;jsts.operation.BoundaryOp.prototype.bnRule=null;jsts.operation.BoundaryOp.prototype.getBoundary=function(){if(this.geom instanceof jsts.geom.LineString)return this.boundaryLineString(this.geom);if(this.geom instanceof jsts.geom.MultiLineString)return this.boundaryMultiLineString(this.geom);return this.geom.getBoundary();};jsts.operation.BoundaryOp.prototype.getEmptyMultiPoint=function(){return this.geomFact.createMultiPoint(null);};jsts.operation.BoundaryOp.prototype.boundaryMultiLineString=function(mLine){if(this.geom.isEmpty()){return this.getEmptyMultiPoint();}
var bdyPts=this.computeBoundaryCoordinates(mLine);if(bdyPts.length==1){return this.geomFact.createPoint(bdyPts[0]);}
return this.geomFact.createMultiPoint(bdyPts);};jsts.operation.BoundaryOp.prototype.endpoints=null;jsts.operation.BoundaryOp.prototype.computeBoundaryCoordinates=function(mLine){var i,line,endpoint,bdyPts=[];this.endpoints=[];for(i=0;i<mLine.getNumGeometries();i++){line=mLine.getGeometryN(i);if(line.getNumPoints()==0)
continue;this.addEndpoint(line.getCoordinateN(0));this.addEndpoint(line.getCoordinateN(line.getNumPoints()-1));}
for(i=0;i<this.endpoints.length;i++){endpoint=this.endpoints[i];if(this.bnRule.isInBoundary(endpoint.count)){bdyPts.push(endpoint.coordinate);}}
return bdyPts;};jsts.operation.BoundaryOp.prototype.addEndpoint=function(pt){var i,endpoint,found=false;for(i=0;i<this.endpoints.length;i++){endpoint=this.endpoints[i];if(endpoint.coordinate.equals(pt)){found=true;break;}}
if(!found){endpoint={};endpoint.coordinate=pt;endpoint.count=0;this.endpoints.push(endpoint);}
endpoint.count++;};jsts.operation.BoundaryOp.prototype.boundaryLineString=function(line){if(this.geom.isEmpty()){return this.getEmptyMultiPoint();}
if(line.isClosed()){var closedEndpointOnBoundary=this.bnRule.isInBoundary(2);if(closedEndpointOnBoundary){return line.getStartPoint();}
else{return this.geomFact.createMultiPoint(null);}}
return this.geomFact.createMultiPoint([line.getStartPoint(),line.getEndPoint()]);};jsts.operation.buffer.OffsetCurveSetBuilder=function(inputGeom,distance,curveBuilder){this.inputGeom=inputGeom;this.distance=distance;this.curveBuilder=curveBuilder;this.curveList=new javascript.util.ArrayList();};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.inputGeom=null;jsts.operation.buffer.OffsetCurveSetBuilder.prototype.distance=null;jsts.operation.buffer.OffsetCurveSetBuilder.prototype.curveBuilder=null;jsts.operation.buffer.OffsetCurveSetBuilder.prototype.curveList=null;jsts.operation.buffer.OffsetCurveSetBuilder.prototype.getCurves=function(){this.add(this.inputGeom);return this.curveList;};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addCurve=function(coord,leftLoc,rightLoc){if(coord==null||coord.length<2)
return;var e=new jsts.noding.NodedSegmentString(coord,new jsts.geomgraph.Label(0,jsts.geom.Location.BOUNDARY,leftLoc,rightLoc));this.curveList.add(e);};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.add=function(g){if(g.isEmpty())
return;if(g instanceof jsts.geom.Polygon)
this.addPolygon(g);else if(g instanceof jsts.geom.LineString)
this.addLineString(g);else if(g instanceof jsts.geom.Point)
this.addPoint(g);else if(g instanceof jsts.geom.MultiPoint)
this.addCollection(g);else if(g instanceof jsts.geom.MultiLineString)
this.addCollection(g);else if(g instanceof jsts.geom.MultiPolygon)
this.addCollection(g);else if(g instanceof jsts.geom.GeometryCollection)
this.addCollection(g);else
throw new jsts.error.IllegalArgumentError();};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addCollection=function(gc){for(var i=0;i<gc.getNumGeometries();i++){var g=gc.getGeometryN(i);this.add(g);}};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPoint=function(p){if(this.distance<=0.0)
return;var coord=p.getCoordinates();var curve=this.curveBuilder.getLineCurve(coord,this.distance);this.addCurve(curve,jsts.geom.Location.EXTERIOR,jsts.geom.Location.INTERIOR);};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addLineString=function(line){if(this.distance<=0.0&&!this.curveBuilder.getBufferParameters().isSingleSided())
return;var coord=jsts.geom.CoordinateArrays.removeRepeatedPoints(line.getCoordinates());var curve=this.curveBuilder.getLineCurve(coord,this.distance);this.addCurve(curve,jsts.geom.Location.EXTERIOR,jsts.geom.Location.INTERIOR);};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPolygon=function(p){var offsetDistance=this.distance;var offsetSide=jsts.geomgraph.Position.LEFT;if(this.distance<0.0){offsetDistance=-this.distance;offsetSide=jsts.geomgraph.Position.RIGHT;}
var shell=p.getExteriorRing();var shellCoord=jsts.geom.CoordinateArrays.removeRepeatedPoints(shell.getCoordinates());if(this.distance<0.0&&this.isErodedCompletely(shell,this.distance))
return;if(this.distance<=0.0&&shellCoord.length<3)
return;this.addPolygonRing(shellCoord,offsetDistance,offsetSide,jsts.geom.Location.EXTERIOR,jsts.geom.Location.INTERIOR);for(var i=0;i<p.getNumInteriorRing();i++){var hole=p.getInteriorRingN(i);var holeCoord=jsts.geom.CoordinateArrays.removeRepeatedPoints(hole.getCoordinates());if(this.distance>0.0&&this.isErodedCompletely(hole,-this.distance))
continue;this.addPolygonRing(holeCoord,offsetDistance,jsts.geomgraph.Position.opposite(offsetSide),jsts.geom.Location.INTERIOR,jsts.geom.Location.EXTERIOR);}};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.addPolygonRing=function(coord,offsetDistance,side,cwLeftLoc,cwRightLoc){if(offsetDistance==0.0&&coord.length<jsts.geom.LinearRing.MINIMUM_VALID_SIZE)
return;var leftLoc=cwLeftLoc;var rightLoc=cwRightLoc;if(coord.length>=jsts.geom.LinearRing.MINIMUM_VALID_SIZE&&jsts.algorithm.CGAlgorithms.isCCW(coord)){leftLoc=cwRightLoc;rightLoc=cwLeftLoc;side=jsts.geomgraph.Position.opposite(side);}
var curve=this.curveBuilder.getRingCurve(coord,side,offsetDistance);this.addCurve(curve,leftLoc,rightLoc);};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.isErodedCompletely=function(ring,bufferDistance){var ringCoord=ring.getCoordinates();var minDiam=0.0;if(ringCoord.length<4)
return bufferDistance<0;if(ringCoord.length==4)
return this.isTriangleErodedCompletely(ringCoord,bufferDistance);var env=ring.getEnvelopeInternal();var envMinDimension=Math.min(env.getHeight(),env.getWidth());if(bufferDistance<0.0&&2*Math.abs(bufferDistance)>envMinDimension)
return true;return false;};jsts.operation.buffer.OffsetCurveSetBuilder.prototype.isTriangleErodedCompletely=function(triangleCoord,bufferDistance){var tri=new jsts.geom.Triangle(triangleCoord[0],triangleCoord[1],triangleCoord[2]);var inCentre=tri.inCentre();var distToCentre=jsts.algorithm.CGAlgorithms.distancePointLine(inCentre,tri.p0,tri.p1);return distToCentre<Math.abs(bufferDistance);};jsts.operation.buffer.BufferSubgraph=function(){this.dirEdgeList=new javascript.util.ArrayList();this.nodes=new javascript.util.ArrayList();this.finder=new jsts.operation.buffer.RightmostEdgeFinder();};jsts.operation.buffer.BufferSubgraph.prototype.finder=null;jsts.operation.buffer.BufferSubgraph.prototype.dirEdgeList=null;jsts.operation.buffer.BufferSubgraph.prototype.nodes=null;jsts.operation.buffer.BufferSubgraph.prototype.rightMostCoord=null;jsts.operation.buffer.BufferSubgraph.prototype.env=null;jsts.operation.buffer.BufferSubgraph.prototype.getDirectedEdges=function(){return this.dirEdgeList;};jsts.operation.buffer.BufferSubgraph.prototype.getNodes=function(){return this.nodes;};jsts.operation.buffer.BufferSubgraph.prototype.getEnvelope=function(){if(this.env===null){var edgeEnv=new jsts.geom.Envelope();for(var it=this.dirEdgeList.iterator();it.hasNext();){var dirEdge=it.next();var pts=dirEdge.getEdge().getCoordinates();for(var j=0;j<pts.length-1;j++){edgeEnv.expandToInclude(pts[j]);}}
this.env=edgeEnv;}
return this.env;};jsts.operation.buffer.BufferSubgraph.prototype.getRightmostCoordinate=function(){return this.rightMostCoord;};jsts.operation.buffer.BufferSubgraph.prototype.create=function(node){this.addReachable(node);this.finder.findEdge(this.dirEdgeList);this.rightMostCoord=this.finder.getCoordinate();};jsts.operation.buffer.BufferSubgraph.prototype.addReachable=function(startNode){var nodeStack=[];nodeStack.push(startNode);while(nodeStack.length!==0){var node=nodeStack.pop();this.add(node,nodeStack);}};jsts.operation.buffer.BufferSubgraph.prototype.add=function(node,nodeStack){node.setVisited(true);this.nodes.add(node);for(var i=node.getEdges().iterator();i.hasNext();){var de=i.next();this.dirEdgeList.add(de);var sym=de.getSym();var symNode=sym.getNode();if(!symNode.isVisited())
nodeStack.push(symNode);}};jsts.operation.buffer.BufferSubgraph.prototype.clearVisitedEdges=function(){for(var it=this.dirEdgeList.iterator();it.hasNext();){var de=it.next();de.setVisited(false);}};jsts.operation.buffer.BufferSubgraph.prototype.computeDepth=function(outsideDepth){this.clearVisitedEdges();var de=this.finder.getEdge();var n=de.getNode();var label=de.getLabel();de.setEdgeDepths(jsts.geomgraph.Position.RIGHT,outsideDepth);this.copySymDepths(de);this.computeDepths(de);};jsts.operation.buffer.BufferSubgraph.prototype.computeDepths=function(startEdge){var nodesVisited=[];var nodeQueue=[];var startNode=startEdge.getNode();nodeQueue.push(startNode);nodesVisited.push(startNode);startEdge.setVisited(true);while(nodeQueue.length!==0){var n=nodeQueue.shift();nodesVisited.push(n);this.computeNodeDepth(n);for(var i=n.getEdges().iterator();i.hasNext();){var de=i.next();var sym=de.getSym();if(sym.isVisited())
continue;var adjNode=sym.getNode();if(nodesVisited.indexOf(adjNode)===-1){nodeQueue.push(adjNode);nodesVisited.push(adjNode);}}}};jsts.operation.buffer.BufferSubgraph.prototype.computeNodeDepth=function(n){var startEdge=null;for(var i=n.getEdges().iterator();i.hasNext();){var de=i.next();if(de.isVisited()||de.getSym().isVisited()){startEdge=de;break;}}
if(startEdge==null)
throw new jsts.error.TopologyError('unable to find edge to compute depths at '+n.getCoordinate());n.getEdges().computeDepths(startEdge);for(var i=n.getEdges().iterator();i.hasNext();){var de=i.next();de.setVisited(true);this.copySymDepths(de);}};jsts.operation.buffer.BufferSubgraph.prototype.copySymDepths=function(de){var sym=de.getSym();sym.setDepth(jsts.geomgraph.Position.LEFT,de.getDepth(jsts.geomgraph.Position.RIGHT));sym.setDepth(jsts.geomgraph.Position.RIGHT,de.getDepth(jsts.geomgraph.Position.LEFT));};jsts.operation.buffer.BufferSubgraph.prototype.findResultEdges=function(){for(var it=this.dirEdgeList.iterator();it.hasNext();){var de=it.next();if(de.getDepth(jsts.geomgraph.Position.RIGHT)>=1&&de.getDepth(jsts.geomgraph.Position.LEFT)<=0&&!de.isInteriorAreaEdge()){de.setInResult(true);}}};jsts.operation.buffer.BufferSubgraph.prototype.compareTo=function(o){var graph=o;if(this.rightMostCoord.x<graph.rightMostCoord.x){return-1;}
if(this.rightMostCoord.x>graph.rightMostCoord.x){return 1;}
return 0;};jsts.simplify.DPTransformer=function(distanceTolerance,isEnsureValidTopology){this.distanceTolerance=distanceTolerance;this.isEnsureValidTopology=isEnsureValidTopology;};jsts.simplify.DPTransformer.prototype=new jsts.geom.util.GeometryTransformer();jsts.simplify.DPTransformer.prototype.distanceTolerance=null;jsts.simplify.DPTransformer.prototype.isEnsureValidTopology=null;jsts.simplify.DPTransformer.prototype.transformCoordinates=function(coords,parent){var inputPts=coords;var newPts=null;if(inputPts.length==0){newPts=[];}else{newPts=jsts.simplify.DouglasPeuckerLineSimplifier.simplify(inputPts,this.distanceTolerance);}
return newPts;};jsts.simplify.DPTransformer.prototype.transformPolygon=function(geom,parent){if(geom.isEmpty()){return null;}
var rawGeom=jsts.geom.util.GeometryTransformer.prototype.transformPolygon.apply(this,arguments);if(parent instanceof jsts.geom.MultiPolygon){return rawGeom;}
return this.createValidArea(rawGeom);};jsts.simplify.DPTransformer.prototype.transformLinearRing=function(geom,parent){var removeDegenerateRings=parent instanceof jsts.geom.Polygon;var simpResult=jsts.geom.util.GeometryTransformer.prototype.transformLinearRing.apply(this,arguments);if(removeDegenerateRings&&!(simpResult instanceof jsts.geom.LinearRing)){return null;}
return simpResult;};jsts.simplify.DPTransformer.prototype.transformMultiPolygon=function(geom,parent){var rawGeom=jsts.geom.util.GeometryTransformer.prototype.transformMultiPolygon.apply(this,arguments);return this.createValidArea(rawGeom);};jsts.simplify.DPTransformer.prototype.createValidArea=function(rawAreaGeom){if(this.isEnsureValidTopology){return rawAreaGeom.buffer(0.0);}
return rawAreaGeom;};jsts.geom.util.GeometryExtracter=function(clz,comps){this.clz=clz;this.comps=comps;};jsts.geom.util.GeometryExtracter.prototype=new jsts.geom.GeometryFilter();jsts.geom.util.GeometryExtracter.prototype.clz=null;jsts.geom.util.GeometryExtracter.prototype.comps=null;jsts.geom.util.GeometryExtracter.extract=function(geom,clz,list){list=list||new javascript.util.ArrayList();if(geom instanceof clz){list.add(geom);}
else if(geom instanceof jsts.geom.GeometryCollection||geom instanceof jsts.geom.MultiPoint||geom instanceof jsts.geom.MultiLineString||geom instanceof jsts.geom.MultiPolygon){geom.apply(new jsts.geom.util.GeometryExtracter(clz,list));}
return list;};jsts.geom.util.GeometryExtracter.prototype.filter=function(geom){if(this.clz===null||geom instanceof this.clz){this.comps.add(geom);}};(function(){var OverlayOp=jsts.operation.overlay.OverlayOp;var SnapOverlayOp=jsts.operation.overlay.snap.SnapOverlayOp;var SnapIfNeededOverlayOp=function(g1,g2){this.geom=[];this.geom[0]=g1;this.geom[1]=g2;};SnapIfNeededOverlayOp.overlayOp=function(g0,g1,opCode){var op=new SnapIfNeededOverlayOp(g0,g1);return op.getResultGeometry(opCode);};SnapIfNeededOverlayOp.intersection=function(g0,g1){return overlayOp(g0,g1,OverlayOp.INTERSECTION);};SnapIfNeededOverlayOp.union=function(g0,g1){return overlayOp(g0,g1,OverlayOp.UNION);};SnapIfNeededOverlayOp.difference=function(g0,g1){return overlayOp(g0,g1,OverlayOp.DIFFERENCE);};SnapIfNeededOverlayOp.symDifference=function(g0,g1){return overlayOp(g0,g1,OverlayOp.SYMDIFFERENCE);};SnapIfNeededOverlayOp.prototype.geom=null;SnapIfNeededOverlayOp.prototype.getResultGeometry=function(opCode){var result=null;var isSuccess=false;var savedException=null;try{result=OverlayOp.overlayOp(this.geom[0],this.geom[1],opCode);var isValid=true;if(isValid)
isSuccess=true;}catch(ex){savedException=ex;}
if(!isSuccess){try{result=SnapOverlayOp.overlayOp(this.geom[0],this.geom[1],opCode);}catch(ex){throw savedException;}}
return result;};jsts.operation.overlay.snap.SnapIfNeededOverlayOp=SnapIfNeededOverlayOp;})();(function(){var GeometryExtracter=jsts.geom.util.GeometryExtracter;var CascadedPolygonUnion=jsts.operation.union.CascadedPolygonUnion;var PointGeometryUnion=jsts.operation.union.PointGeometryUnion;var OverlayOp=jsts.operation.overlay.OverlayOp;var SnapIfNeededOverlayOp=jsts.operation.overlay.snap.SnapIfNeededOverlayOp;var ArrayList=javascript.util.ArrayList;jsts.operation.union.UnaryUnionOp=function(geoms,geomFact){this.polygons=new ArrayList();this.lines=new ArrayList();this.points=new ArrayList();if(geomFact){this.geomFact=geomFact;}
this.extract(geoms);};jsts.operation.union.UnaryUnionOp.union=function(geoms,geomFact){var op=new jsts.operation.union.UnaryUnionOp(geoms,geomFact);return op.union();};jsts.operation.union.UnaryUnionOp.prototype.polygons=null;jsts.operation.union.UnaryUnionOp.prototype.lines=null;jsts.operation.union.UnaryUnionOp.prototype.points=null;jsts.operation.union.UnaryUnionOp.prototype.geomFact=null;jsts.operation.union.UnaryUnionOp.prototype.extract=function(geoms){if(geoms instanceof ArrayList){for(var i=geoms.iterator();i.hasNext();){var geom=i.next();this.extract(geom);}}else{if(this.geomFact===null){this.geomFact=geoms.getFactory();}
GeometryExtracter.extract(geoms,jsts.geom.Polygon,this.polygons);GeometryExtracter.extract(geoms,jsts.geom.LineString,this.lines);GeometryExtracter.extract(geoms,jsts.geom.Point,this.points);}};jsts.operation.union.UnaryUnionOp.prototype.union=function(){if(this.geomFact===null){return null;}
var unionPoints=null;if(this.points.size()>0){var ptGeom=this.geomFact.buildGeometry(this.points);unionPoints=this.unionNoOpt(ptGeom);}
var unionLines=null;if(this.lines.size()>0){var lineGeom=this.geomFact.buildGeometry(this.lines);unionLines=this.unionNoOpt(lineGeom);}
var unionPolygons=null;if(this.polygons.size()>0){unionPolygons=CascadedPolygonUnion.union(this.polygons);}
var unionLA=this.unionWithNull(unionLines,unionPolygons);var union=null;if(unionPoints===null){union=unionLA;}else if(unionLA===null){union=unionPoints;}else{union=PointGeometryUnion(unionPoints,unionLA);}
if(union===null){return this.geomFact.createGeometryCollection(null);}
return union;};jsts.operation.union.UnaryUnionOp.prototype.unionWithNull=function(g0,g1){if(g0===null&&g1===null){return null;}
if(g1===null){return g0;}
if(g0===null){return g1;}
return g0.union(g1);};jsts.operation.union.UnaryUnionOp.prototype.unionNoOpt=function(g0){var empty=this.geomFact.createPoint(null);return SnapIfNeededOverlayOp.overlayOp(g0,empty,OverlayOp.UNION);};}());jsts.index.kdtree.KdNode=function(){this.left=null;this.right=null;this.count=1;if(arguments.length===2){this.initializeFromCoordinate.apply(this,arguments[0],arguments[1]);}else if(arguments.length===3){this.initializeFromXY.apply(this,arguments[0],arguments[1],arguments[2]);}};jsts.index.kdtree.KdNode.prototype.initializeFromXY=function(x,y,data){this.p=new jsts.geom.Coordinate(x,y);this.data=data;};jsts.index.kdtree.KdNode.prototype.initializeFromCoordinate=function(p,data){this.p=p;this.data=data;};jsts.index.kdtree.KdNode.prototype.getX=function(){return this.p.x;};jsts.index.kdtree.KdNode.prototype.getY=function(){return this.p.y;};jsts.index.kdtree.KdNode.prototype.getCoordinate=function(){return this.p;};jsts.index.kdtree.KdNode.prototype.getData=function(){return this.data;};jsts.index.kdtree.KdNode.prototype.getLeft=function(){return this.left;};jsts.index.kdtree.KdNode.prototype.getRight=function(){return this.right;};jsts.index.kdtree.KdNode.prototype.increment=function(){this.count+=1;};jsts.index.kdtree.KdNode.prototype.getCount=function(){return this.count;};jsts.index.kdtree.KdNode.prototype.isRepeated=function(){return count>1;};jsts.index.kdtree.KdNode.prototype.setLeft=function(left){this.left=left;};jsts.index.kdtree.KdNode.prototype.setRight=function(right){this.right=right;};jsts.algorithm.InteriorPointPoint=function(geometry){this.minDistance=Number.MAX_VALUE;this.interiorPoint=null;this.centroid=geometry.getCentroid().getCoordinate();this.add(geometry);};jsts.algorithm.InteriorPointPoint.prototype.add=function(geometry){if(geometry instanceof jsts.geom.Point){this.addPoint(geometry.getCoordinate());}else if(geometry instanceof jsts.geom.GeometryCollection){for(var i=0;i<geometry.getNumGeometries();i++){this.add(geometry.getGeometryN(i));}}};jsts.algorithm.InteriorPointPoint.prototype.addPoint=function(point){var dist=point.distance(this.centroid);if(dist<this.minDistance){this.interiorPoint=new jsts.geom.Coordinate(point);this.minDistance=dist;}};jsts.algorithm.InteriorPointPoint.prototype.getInteriorPoint=function(){return this.interiorPoint;};(function(){jsts.geom.MultiLineString=function(geometries,factory){this.geometries=geometries||[];this.factory=factory;};jsts.geom.MultiLineString.prototype=new jsts.geom.GeometryCollection();jsts.geom.MultiLineString.constructor=jsts.geom.MultiLineString;jsts.geom.MultiLineString.prototype.getBoundary=function(){return(new jsts.operation.BoundaryOp(this)).getBoundary();};jsts.geom.MultiLineString.prototype.equalsExact=function(other,tolerance){if(!this.isEquivalentClass(other)){return false;}
return jsts.geom.GeometryCollection.prototype.equalsExact.call(this,other,tolerance);};jsts.geom.MultiLineString.prototype.CLASS_NAME='jsts.geom.MultiLineString';})();(function(){var Interval=jsts.index.bintree.Interval;var Root=jsts.index.bintree.Root;var Bintree=function(){this.root=new Root();this.minExtent=1.0;};Bintree.ensureExtent=function(itemInterval,minExtent){var min,max;min=itemInterval.getMin();max=itemInterval.getMax();if(min!==max){return itemInterval;}
if(min===max){min=min-(minExtent/2.0);max=min+(minExtent/2.0);}
return new Interval(min,max);};Bintree.prototype.depth=function(){if(this.root!==null){return this.root.depth();}
return 0;};Bintree.prototype.size=function(){if(this.root!==null){return this.root.size();}
return 0;};Bintree.prototype.nodeSize=function(){if(this.root!==null){return this.root.nodeSize();}
return 0;};Bintree.prototype.insert=function(itemInterval,item){this.collectStats(itemInterval);var insertInterval=Bintree.ensureExtent(itemInterval,this.minExtent);this.root.insert(insertInterval,item);};Bintree.prototype.remove=function(itemInterval,item){var insertInterval=Bintree.ensureExtent(itemInterval,this.minExtent);return this.root.remove(insertInterval,item);};Bintree.prototype.iterator=function(){var foundItems=new javascript.util.ArrayList();this.root.addAllItems(foundItems);return foundItems.iterator();};Bintree.prototype.query=function(){if(arguments.length===2){this.queryAndAdd(arguments[0],arguments[1]);}else{var x=arguments[0];if(!x instanceof Interval){x=new Interval(x,x);}
return this.queryInterval(x);}};Bintree.prototype.queryInterval=function(interval){var foundItems=new javascript.util.ArrayList();this.query(interval,foundItems);return foundItems;};Bintree.prototype.queryAndAdd=function(interval,foundItems){this.root.addAllItemsFromOverlapping(interval,foundItems);};Bintree.prototype.collectStats=function(interval){var del=interval.getWidth();if(del<this.minExtent&&del>0.0){this.minExtent=del;}};jsts.index.bintree.Bintree=Bintree;})();jsts.algorithm.InteriorPointArea=function(geometry){this.factory;this.interiorPoint=null;this.maxWidth=0;this.factory=geometry.getFactory();this.add(geometry);};jsts.algorithm.InteriorPointArea.avg=function(a,b){return(a+b)/2;};jsts.algorithm.InteriorPointArea.prototype.getInteriorPoint=function(){return this.interiorPoint;};jsts.algorithm.InteriorPointArea.prototype.add=function(geometry){if(geometry instanceof jsts.geom.Polygon){this.addPolygon(geometry);}else if(geometry instanceof jsts.geom.GeometryCollection){for(var i=0;i<geometry.getNumGeometries();i++){this.add(geometry.getGeometryN(i));}}};jsts.algorithm.InteriorPointArea.prototype.addPolygon=function(geometry){if(geometry.isEmpty()){return;}
var intPt;var width=0;var bisector=this.horizontalBisector(geometry);if(bisector.getLength()==0.0){width=0;intPt=bisector.getCoordinate();}else{var intersections=bisector.intersection(geometry);var widestIntersection=this.widestGeometry(intersections);width=widestIntersection.getEnvelopeInternal().getWidth();intPt=this.centre(widestIntersection.getEnvelopeInternal());}
if(this.interiorPoint==null||width>this.maxWidth){this.interiorPoint=intPt;this.maxWidth=width;}};jsts.algorithm.InteriorPointArea.prototype.widestGeometry=function(obj){if(obj instanceof jsts.geom.GeometryCollection){var gc=obj;if(gc.isEmpty()){return gc;}
var widestGeometry=gc.getGeometryN(0);for(var i=1;i<gc.getNumGeometries();i++){if(gc.getGeometryN(i).getEnvelopeInternal().getWidth()>widestGeometry.getEnvelopeInternal().getWidth()){widestGeometry=gc.getGeometryN(i);}}
return widestGeometry;}else if(obj instanceof jsts.geom.Geometry){return obj;}};jsts.algorithm.InteriorPointArea.prototype.horizontalBisector=function(geometry){var envelope=geometry.getEnvelopeInternal();var bisectY=jsts.algorithm.SafeBisectorFinder.getBisectorY(geometry);return this.factory.createLineString([new jsts.geom.Coordinate(envelope.getMinX(),bisectY),new jsts.geom.Coordinate(envelope.getMaxX(),bisectY)]);};jsts.algorithm.InteriorPointArea.prototype.centre=function(envelope){return new jsts.geom.Coordinate(jsts.algorithm.InteriorPointArea.avg(envelope.getMinX(),envelope.getMaxX()),jsts.algorithm.InteriorPointArea.avg(envelope.getMinY(),envelope.getMaxY()));};jsts.algorithm.SafeBisectorFinder=function(poly){this.poly;this.centreY;this.hiY=Number.MAX_VALUE;this.loY=-Number.MAX_VALUE;this.poly=poly;this.hiY=poly.getEnvelopeInternal().getMaxY();this.loY=poly.getEnvelopeInternal().getMinY();this.centreY=jsts.algorithm.InteriorPointArea.avg(this.loY,this.hiY);};jsts.algorithm.SafeBisectorFinder.getBisectorY=function(poly){var finder=new jsts.algorithm.SafeBisectorFinder(poly);return finder.getBisectorY();};jsts.algorithm.SafeBisectorFinder.prototype.getBisectorY=function(){this.process(this.poly.getExteriorRing());for(var i=0;i<this.poly.getNumInteriorRing();i++){this.process(this.poly.getInteriorRingN(i));}
var bisectY=jsts.algorithm.InteriorPointArea.avg(this.hiY,this.loY);return bisectY;};jsts.algorithm.SafeBisectorFinder.prototype.process=function(line){var seq=line.getCoordinateSequence();for(var i=0;i<seq.length;i++){var y=seq[i].y;this.updateInterval(y);}};jsts.algorithm.SafeBisectorFinder.prototype.updateInterval=function(y){if(y<=this.centreY){if(y>this.loY){this.loY=y;}}else if(y>this.centreY){if(y<this.hiY){this.hiY=y;}}};jsts.operation.buffer.BufferParameters=function(quadrantSegments,endCapStyle,joinStyle,mitreLimit){if(quadrantSegments)
this.setQuadrantSegments(quadrantSegments);if(endCapStyle)
this.setEndCapStyle(endCapStyle);if(joinStyle)
this.setJoinStyle(joinStyle);if(mitreLimit)
this.setMitreLimit(mitreLimit);};jsts.operation.buffer.BufferParameters.CAP_ROUND=1;jsts.operation.buffer.BufferParameters.CAP_FLAT=2;jsts.operation.buffer.BufferParameters.CAP_SQUARE=3;jsts.operation.buffer.BufferParameters.JOIN_ROUND=1;jsts.operation.buffer.BufferParameters.JOIN_MITRE=2;jsts.operation.buffer.BufferParameters.JOIN_BEVEL=3;jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS=8;jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT=5.0;jsts.operation.buffer.BufferParameters.prototype.quadrantSegments=jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS;jsts.operation.buffer.BufferParameters.prototype.endCapStyle=jsts.operation.buffer.BufferParameters.CAP_ROUND;jsts.operation.buffer.BufferParameters.prototype.joinStyle=jsts.operation.buffer.BufferParameters.JOIN_ROUND;jsts.operation.buffer.BufferParameters.prototype.mitreLimit=jsts.operation.buffer.BufferParameters.DEFAULT_MITRE_LIMIT;jsts.operation.buffer.BufferParameters.prototype._isSingleSided=false;jsts.operation.buffer.BufferParameters.prototype.getQuadrantSegments=function(){return this.quadrantSegments;};jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments=function(quadrantSegments){this.quadrantSegments=quadrantSegments;};jsts.operation.buffer.BufferParameters.prototype.setQuadrantSegments=function(quadSegs){this.quadrantSegments=quadSegs;if(this.quadrantSegments===0)
this.joinStyle=jsts.operation.buffer.BufferParameters.JOIN_BEVEL;if(this.quadrantSegments<0){this.joinStyle=jsts.operation.buffer.BufferParameters.JOIN_MITRE;this.mitreLimit=Math.abs(this.quadrantSegments);}
if(quadSegs<=0){this.quadrantSegments=1;}
if(this.joinStyle!==jsts.operation.buffer.BufferParameters.JOIN_ROUND){this.quadrantSegments=jsts.operation.buffer.BufferParameters.DEFAULT_QUADRANT_SEGMENTS;}};jsts.operation.buffer.BufferParameters.bufferDistanceError=function(quadSegs){var alpha=Math.PI/2.0/quadSegs;return 1-Math.cos(alpha/2.0);};jsts.operation.buffer.BufferParameters.prototype.getEndCapStyle=function(){return this.endCapStyle;};jsts.operation.buffer.BufferParameters.prototype.setEndCapStyle=function(endCapStyle){this.endCapStyle=endCapStyle;};jsts.operation.buffer.BufferParameters.prototype.getJoinStyle=function(){return this.joinStyle;};jsts.operation.buffer.BufferParameters.prototype.setJoinStyle=function(joinStyle){this.joinStyle=joinStyle;};jsts.operation.buffer.BufferParameters.prototype.getMitreLimit=function(){return this.mitreLimit;};jsts.operation.buffer.BufferParameters.prototype.setMitreLimit=function(mitreLimit){this.mitreLimit=mitreLimit;};jsts.operation.buffer.BufferParameters.prototype.setSingleSided=function(isSingleSided){this._isSingleSided=isSingleSided;};jsts.operation.buffer.BufferParameters.prototype.isSingleSided=function(){return this._isSingleSided;};(function(){jsts.geom.util.ShortCircuitedGeometryVisitor=function(){};jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.isDone=false;jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.applyTo=function(geom){for(var i=0;i<geom.getNumGeometries()&&!this.isDone;i++){var element=geom.getGeometryN(i);if(!(element instanceof jsts.geom.GeometryCollection)){this.visit(element);if(this.isDone()){this.isDone=true;return;}}
else
this.applyTo(element);}}
jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.visit=function(element){};jsts.geom.util.ShortCircuitedGeometryVisitor.prototype.isDone=function(){};})();(function(){var EnvelopeIntersectsVisitor=function(rectEnv){this.rectEnv=rectEnv;};EnvelopeIntersectsVisitor.prototype=new jsts.geom.util.ShortCircuitedGeometryVisitor();EnvelopeIntersectsVisitor.constructor=EnvelopeIntersectsVisitor;EnvelopeIntersectsVisitor.prototype.rectEnv=null;EnvelopeIntersectsVisitor.prototype.intersects=false;EnvelopeIntersectsVisitor.prototype.intersects=function(){return this.intersects;}
EnvelopeIntersectsVisitor.prototype.visit=function(element){var elementEnv=element.getEnvelopeInternal();if(!this.rectEnv.intersects(elementEnv)){return;}
if(this.rectEnv.contains(elementEnv)){this.intersects=true;return;}
if(elementEnv.getMinX()>=rectEnv.getMinX()&&elementEnv.getMaxX()<=rectEnv.getMaxX()){this.intersects=true;return;}
if(elementEnv.getMinY()>=rectEnv.getMinY()&&elementEnv.getMaxY()<=rectEnv.getMaxY()){this.intersects=true;return;}}
EnvelopeIntersectsVisitor.prototype.isDone=function(){return this.intersects==true;}
var GeometryContainsPointVisitor=function(rectangle){this.rectSeq=rectangle.getExteriorRing().getCoordinateSequence();this.rectEnv=rectangle.getEnvelopeInternal();};GeometryContainsPointVisitor.prototype=new jsts.geom.util.ShortCircuitedGeometryVisitor();GeometryContainsPointVisitor.constructor=GeometryContainsPointVisitor;GeometryContainsPointVisitor.prototype.rectSeq=null;GeometryContainsPointVisitor.prototype.rectEnv=null;GeometryContainsPointVisitor.prototype.containsPoint=false;GeometryContainsPointVisitor.prototype.containsPoint=function(){return this.containsPoint;}
GeometryContainsPointVisitor.prototype.visit=function(geom){if(!(geom instanceof jsts.geom.Polygon))
return;var elementEnv=geom.getEnvelopeInternal();if(!this.rectEnv.intersects(elementEnv))
return;var rectPt=new jsts.geom.Coordinate();for(var i=0;i<4;i++){this.rectSeq.getCoordinate(i,rectPt);if(!elementEnv.contains(rectPt))
continue;if(SimplePointInAreaLocator.containsPointInPolygon(rectPt,geom)){this.containsPoint=true;return;}}}
GeometryContainsPointVisitor.prototype.isDone=function(){return this.containsPoint==true;}
var RectangleIntersectsSegmentVisitor=function(rectangle){this.rectEnv=rectangle.getEnvelopeInternal();this.rectIntersector=new RectangleLineIntersector(rectEnv);};RectangleIntersectsSegmentVisitor.prototype=new jsts.geom.util.ShortCircuitedGeometryVisitor();RectangleIntersectsSegmentVisitor.constructor=RectangleIntersectsSegmentVisitor;RectangleIntersectsSegmentVisitor.prototype.rectEnv=null;RectangleIntersectsSegmentVisitor.prototype.rectIntersector=null;RectangleIntersectsSegmentVisitor.prototype.hasIntersection=false;RectangleIntersectsSegmentVisitor.prototype.p0=null;RectangleIntersectsSegmentVisitor.prototype.p1=null;RectangleIntersectsSegmentVisitor.prototype.intersects=function(){return this.hasIntersection;}
RectangleIntersectsSegmentVisitor.prototype.visit=function(geom){var elementEnv=geom.getEnvelopeInternal();if(!this.rectEnv.intersects(elementEnv))
return;var lines=LinearComponentExtracter.getLines(geom);this.checkIntersectionWithLineStrings(lines);}
RectangleIntersectsSegmentVisitor.prototype.checkIntersectionWithLineStrings=function(lines){for(var i=lines.iterator();i.hasNext();){var testLine=i.next();this.checkIntersectionWithSegments(testLine);if(this.hasIntersection)
return;}}
RectangleIntersectsSegmentVisitor.prototype.checkIntersectionWithSegments=function(testLine){var seq1=testLine.getCoordinateSequence();for(var j=1;j<seq1.length;j++){this.p0=seq1[j-1];this.p1=seq1[j];if(rectIntersector.intersects(p0,p1)){this.hasIntersection=true;return;}}}
RectangleIntersectsSegmentVisitor.prototype.isDone=function(){return this.hasIntersection==true;}
jsts.operation.predicate.RectangleIntersects=function(rectangle){this.rectangle=rectangle;this.rectEnv=rectangle.getEnvelopeInternal();}
jsts.operation.predicate.RectangleIntersects.intersects=function(rectangle,b){var rp=new jsts.operation.predicate.RectangleIntersects(rectangle);return rp.intersects(b);}
jsts.operation.predicate.RectangleIntersects.prototype.rectangle=null;jsts.operation.predicate.RectangleIntersects.prototype.rectEnv=null;jsts.operation.predicate.RectangleIntersects.prototype.intersects=function(geom){if(!this.rectEnv.intersects(geom.getEnvelopeInternal()))
return false;var visitor=new EnvelopeIntersectsVisitor(this.rectEnv);visitor.applyTo(geom);if(visitor.intersects())
return true;var ecpVisitor=new GeometryContainsPointVisitor(rectangle);ecpVisitor.applyTo(geom);if(ecpVisitor.containsPoint())
return true;var riVisitor=new RectangleIntersectsSegmentVisitor(rectangle);riVisitor.applyTo(geom);if(riVisitor.intersects())
return true;return false;}})();jsts.operation.buffer.BufferBuilder=function(bufParams){this.bufParams=bufParams;this.edgeList=new jsts.geomgraph.EdgeList();};jsts.operation.buffer.BufferBuilder.depthDelta=function(label){var lLoc=label.getLocation(0,jsts.geomgraph.Position.LEFT);var rLoc=label.getLocation(0,jsts.geomgraph.Position.RIGHT);if(lLoc===jsts.geom.Location.INTERIOR&&rLoc===jsts.geom.Location.EXTERIOR)
return 1;else if(lLoc===jsts.geom.Location.EXTERIOR&&rLoc===jsts.geom.Location.INTERIOR)
return-1;return 0;};jsts.operation.buffer.BufferBuilder.prototype.bufParams=null;jsts.operation.buffer.BufferBuilder.prototype.workingPrecisionModel=null;jsts.operation.buffer.BufferBuilder.prototype.workingNoder=null;jsts.operation.buffer.BufferBuilder.prototype.geomFact=null;jsts.operation.buffer.BufferBuilder.prototype.graph=null;jsts.operation.buffer.BufferBuilder.prototype.edgeList=null;jsts.operation.buffer.BufferBuilder.prototype.setWorkingPrecisionModel=function(pm){this.workingPrecisionModel=pm;};jsts.operation.buffer.BufferBuilder.prototype.setNoder=function(noder){this.workingNoder=noder;};jsts.operation.buffer.BufferBuilder.prototype.buffer=function(g,distance){var precisionModel=this.workingPrecisionModel;if(precisionModel===null)
precisionModel=g.getPrecisionModel();this.geomFact=g.getFactory();var curveBuilder=new jsts.operation.buffer.OffsetCurveBuilder(precisionModel,this.bufParams);var curveSetBuilder=new jsts.operation.buffer.OffsetCurveSetBuilder(g,distance,curveBuilder);var bufferSegStrList=curveSetBuilder.getCurves();if(bufferSegStrList.size()<=0){return this.createEmptyResultGeometry();}
this.computeNodedEdges(bufferSegStrList,precisionModel);this.graph=new jsts.geomgraph.PlanarGraph(new jsts.operation.overlay.OverlayNodeFactory());this.graph.addEdges(this.edgeList.getEdges());var subgraphList=this.createSubgraphs(this.graph);var polyBuilder=new jsts.operation.overlay.PolygonBuilder(this.geomFact);this.buildSubgraphs(subgraphList,polyBuilder);var resultPolyList=polyBuilder.getPolygons();if(resultPolyList.size()<=0){return this.createEmptyResultGeometry();}
var resultGeom=this.geomFact.buildGeometry(resultPolyList);return resultGeom;};jsts.operation.buffer.BufferBuilder.prototype.getNoder=function(precisionModel){if(this.workingNoder!==null)
return this.workingNoder;var noder=new jsts.noding.MCIndexNoder();var li=new jsts.algorithm.RobustLineIntersector();li.setPrecisionModel(precisionModel);noder.setSegmentIntersector(new jsts.noding.IntersectionAdder(li));return noder;};jsts.operation.buffer.BufferBuilder.prototype.computeNodedEdges=function(bufferSegStrList,precisionModel){var noder=this.getNoder(precisionModel);noder.computeNodes(bufferSegStrList);var nodedSegStrings=noder.getNodedSubstrings();for(var i=nodedSegStrings.iterator();i.hasNext();){var segStr=i.next();var oldLabel=segStr.getData();var edge=new jsts.geomgraph.Edge(segStr.getCoordinates(),new jsts.geomgraph.Label(oldLabel));this.insertUniqueEdge(edge);}};jsts.operation.buffer.BufferBuilder.prototype.insertUniqueEdge=function(e){var existingEdge=this.edgeList.findEqualEdge(e);if(existingEdge!=null){var existingLabel=existingEdge.getLabel();var labelToMerge=e.getLabel();if(!existingEdge.isPointwiseEqual(e)){labelToMerge=new jsts.geomgraph.Label(e.getLabel());labelToMerge.flip();}
existingLabel.merge(labelToMerge);var mergeDelta=jsts.operation.buffer.BufferBuilder.depthDelta(labelToMerge);var existingDelta=existingEdge.getDepthDelta();var newDelta=existingDelta+mergeDelta;existingEdge.setDepthDelta(newDelta);}else{this.edgeList.add(e);e.setDepthDelta(jsts.operation.buffer.BufferBuilder.depthDelta(e.getLabel()));}};jsts.operation.buffer.BufferBuilder.prototype.createSubgraphs=function(graph){var subgraphList=[];for(var i=graph.getNodes().iterator();i.hasNext();){var node=i.next();if(!node.isVisited()){var subgraph=new jsts.operation.buffer.BufferSubgraph();subgraph.create(node);subgraphList.push(subgraph);}}
var compare=function(a,b){return a.compareTo(b);};subgraphList.sort(compare);subgraphList.reverse();return subgraphList;};jsts.operation.buffer.BufferBuilder.prototype.buildSubgraphs=function(subgraphList,polyBuilder){var processedGraphs=[];for(var i=0;i<subgraphList.length;i++){var subgraph=subgraphList[i];var p=subgraph.getRightmostCoordinate();var locater=new jsts.operation.buffer.SubgraphDepthLocater(processedGraphs);var outsideDepth=locater.getDepth(p);subgraph.computeDepth(outsideDepth);subgraph.findResultEdges();processedGraphs.push(subgraph);polyBuilder.add(subgraph.getDirectedEdges(),subgraph.getNodes());}};jsts.operation.buffer.BufferBuilder.convertSegStrings=function(it){var fact=new jsts.geom.GeometryFactory();var lines=new javascript.util.ArrayList();while(it.hasNext()){var ss=it.next();var line=fact.createLineString(ss.getCoordinates());lines.add(line);}
return fact.buildGeometry(lines);};jsts.operation.buffer.BufferBuilder.prototype.createEmptyResultGeometry=function(){var emptyGeom=this.geomFact.createPolygon(null,null);return emptyGeom;};jsts.noding.SegmentPointComparator=function(){};jsts.noding.SegmentPointComparator.compare=function(octant,p0,p1){if(p0.equals2D(p1))
return 0;var xSign=jsts.noding.SegmentPointComparator.relativeSign(p0.x,p1.x);var ySign=jsts.noding.SegmentPointComparator.relativeSign(p0.y,p1.y);switch(octant){case 0:return jsts.noding.SegmentPointComparator.compareValue(xSign,ySign);case 1:return jsts.noding.SegmentPointComparator.compareValue(ySign,xSign);case 2:return jsts.noding.SegmentPointComparator.compareValue(ySign,-xSign);case 3:return jsts.noding.SegmentPointComparator.compareValue(-xSign,ySign);case 4:return jsts.noding.SegmentPointComparator.compareValue(-xSign,-ySign);case 5:return jsts.noding.SegmentPointComparator.compareValue(-ySign,-xSign);case 6:return jsts.noding.SegmentPointComparator.compareValue(-ySign,xSign);case 7:return jsts.noding.SegmentPointComparator.compareValue(xSign,-ySign);}
return 0;};jsts.noding.SegmentPointComparator.relativeSign=function(x0,x1){if(x0<x1)
return-1;if(x0>x1)
return 1;return 0;};jsts.noding.SegmentPointComparator.compareValue=function(compareSign0,compareSign1){if(compareSign0<0)
return-1;if(compareSign0>0)
return 1;if(compareSign1<0)
return-1;if(compareSign1>0)
return 1;return 0;};jsts.operation.relate.RelateOp=function(){jsts.operation.GeometryGraphOperation.apply(this,arguments);this._relate=new jsts.operation.relate.RelateComputer(this.arg);};jsts.operation.relate.RelateOp.prototype=new jsts.operation.GeometryGraphOperation();jsts.operation.relate.RelateOp.relate=function(a,b,boundaryNodeRule){var relOp=new jsts.operation.relate.RelateOp(a,b,boundaryNodeRule);var im=relOp.getIntersectionMatrix();return im;};jsts.operation.relate.RelateOp.prototype._relate=null;jsts.operation.relate.RelateOp.prototype.getIntersectionMatrix=function(){return this._relate.computeIM();};jsts.index.chain.MonotoneChain=function(pts,start,end,context){this.pts=pts;this.start=start;this.end=end;this.context=context;};jsts.index.chain.MonotoneChain.prototype.pts=null;jsts.index.chain.MonotoneChain.prototype.start=null;jsts.index.chain.MonotoneChain.prototype.end=null;jsts.index.chain.MonotoneChain.prototype.env=null;jsts.index.chain.MonotoneChain.prototype.context=null;jsts.index.chain.MonotoneChain.prototype.id=null;jsts.index.chain.MonotoneChain.prototype.setId=function(id){this.id=id;};jsts.index.chain.MonotoneChain.prototype.getId=function(){return this.id;};jsts.index.chain.MonotoneChain.prototype.getContext=function(){return this.context;};jsts.index.chain.MonotoneChain.prototype.getEnvelope=function(){if(this.env==null){var p0=this.pts[this.start];var p1=this.pts[this.end];this.env=new jsts.geom.Envelope(p0,p1);}
return this.env;};jsts.index.chain.MonotoneChain.prototype.getStartIndex=function(){return this.start;};jsts.index.chain.MonotoneChain.prototype.getEndIndex=function(){return this.end;};jsts.index.chain.MonotoneChain.prototype.getLineSegment=function(index,ls){ls.p0=this.pts[index];ls.p1=this.pts[index+1];};jsts.index.chain.MonotoneChain.prototype.getCoordinates=function(){var coord=[];var index=0;for(var i=this.start;i<=this.end;i++){coord[index++]=this.pts[i];}
return coord;};jsts.index.chain.MonotoneChain.prototype.select=function(searchEnv,mcs){this.computeSelect2(searchEnv,this.start,this.end,mcs);};jsts.index.chain.MonotoneChain.prototype.computeSelect2=function(searchEnv,start0,end0,mcs){var p0=this.pts[start0];var p1=this.pts[end0];mcs.tempEnv1.init(p0,p1);if(end0-start0===1){mcs.select(this,start0);return;}
if(!searchEnv.intersects(mcs.tempEnv1))
return;var mid=parseInt((start0+end0)/2);if(start0<mid){this.computeSelect2(searchEnv,start0,mid,mcs);}
if(mid<end0){this.computeSelect2(searchEnv,mid,end0,mcs);}};jsts.index.chain.MonotoneChain.prototype.computeOverlaps=function(mc,mco){if(arguments.length===6){return this.computeOverlaps2.apply(this,arguments);}
this.computeOverlaps2(this.start,this.end,mc,mc.start,mc.end,mco);};jsts.index.chain.MonotoneChain.prototype.computeOverlaps2=function(start0,end0,mc,start1,end1,mco){var p00=this.pts[start0];var p01=this.pts[end0];var p10=mc.pts[start1];var p11=mc.pts[end1];if(end0-start0===1&&end1-start1===1){mco.overlap(this,start0,mc,start1);return;}
mco.tempEnv1.init(p00,p01);mco.tempEnv2.init(p10,p11);if(!mco.tempEnv1.intersects(mco.tempEnv2))
return;var mid0=parseInt((start0+end0)/2);var mid1=parseInt((start1+end1)/2);if(start0<mid0){if(start1<mid1)
this.computeOverlaps2(start0,mid0,mc,start1,mid1,mco);if(mid1<end1)
this.computeOverlaps2(start0,mid0,mc,mid1,end1,mco);}
if(mid0<end0){if(start1<mid1)
this.computeOverlaps2(mid0,end0,mc,start1,mid1,mco);if(mid1<end1)
this.computeOverlaps2(mid0,end0,mc,mid1,end1,mco);}};(function(){var Location=jsts.geom.Location;var Dimension=jsts.geom.Dimension;jsts.geom.IntersectionMatrix=function(elements){var other=elements;if(elements===undefined||elements===null){this.matrix=[[],[],[]];this.setAll(Dimension.FALSE);}else if(typeof elements==='string'){this.set(elements);}else if(other instanceof jsts.geom.IntersectionMatrix){this.matrix[Location.INTERIOR][Location.INTERIOR]=other.matrix[Location.INTERIOR][Location.INTERIOR];this.matrix[Location.INTERIOR][Location.BOUNDARY]=other.matrix[Location.INTERIOR][Location.BOUNDARY];this.matrix[Location.INTERIOR][Location.EXTERIOR]=other.matrix[Location.INTERIOR][Location.EXTERIOR];this.matrix[Location.BOUNDARY][Location.INTERIOR]=other.matrix[Location.BOUNDARY][Location.INTERIOR];this.matrix[Location.BOUNDARY][Location.BOUNDARY]=other.matrix[Location.BOUNDARY][Location.BOUNDARY];this.matrix[Location.BOUNDARY][Location.EXTERIOR]=other.matrix[Location.BOUNDARY][Location.EXTERIOR];this.matrix[Location.EXTERIOR][Location.INTERIOR]=other.matrix[Location.EXTERIOR][Location.INTERIOR];this.matrix[Location.EXTERIOR][Location.BOUNDARY]=other.matrix[Location.EXTERIOR][Location.BOUNDARY];this.matrix[Location.EXTERIOR][Location.EXTERIOR]=other.matrix[Location.EXTERIOR][Location.EXTERIOR];}};jsts.geom.IntersectionMatrix.prototype.matrix=null;jsts.geom.IntersectionMatrix.prototype.add=function(im){var i,j;for(i=0;i<3;i++){for(j=0;j<3;j++){this.setAtLeast(i,j,im.get(i,j));}}};jsts.geom.IntersectionMatrix.matches=function(actualDimensionValue,requiredDimensionSymbol){if(typeof actualDimensionValue==='string'){return jsts.geom.IntersectionMatrix.matches2.call(this,arguments);}
if(requiredDimensionSymbol==='*'){return true;}
if(requiredDimensionSymbol==='T'&&(actualDimensionValue>=0||actualDimensionValue===Dimension.TRUE)){return true;}
if(requiredDimensionSymbol==='F'&&actualDimensionValue===Dimension.FALSE){return true;}
if(requiredDimensionSymbol==='0'&&actualDimensionValue===Dimension.P){return true;}
if(requiredDimensionSymbol==='1'&&actualDimensionValue===Dimension.L){return true;}
if(requiredDimensionSymbol==='2'&&actualDimensionValue===Dimension.A){return true;}
return false;};jsts.geom.IntersectionMatrix.matches2=function(actualDimensionSymbols,requiredDimensionSymbols){var m=new jsts.geom.IntersectionMatrix(actualDimensionSymbols);return m.matches(requiredDimensionSymbols);};jsts.geom.IntersectionMatrix.prototype.set=function(row,column,dimensionValue){if(typeof row==='string'){this.set2(row);return;}
this.matrix[row][column]=dimensionValue;};jsts.geom.IntersectionMatrix.prototype.set2=function(dimensionSymbols){for(var i=0;i<dimensionSymbols.length();i++){var row=i/3;var col=i%3;this.matrix[row][col]=Dimension.toDimensionValue(dimensionSymbols.charAt(i));}};jsts.geom.IntersectionMatrix.prototype.setAtLeast=function(row,column,minimumDimensionValue){if(arguments.length===1){this.setAtLeast2(arguments[0]);return;}
if(this.matrix[row][column]<minimumDimensionValue){this.matrix[row][column]=minimumDimensionValue;}};jsts.geom.IntersectionMatrix.prototype.setAtLeastIfValid=function(row,column,minimumDimensionValue){if(row>=0&&column>=0){this.setAtLeast(row,column,minimumDimensionValue);}};jsts.geom.IntersectionMatrix.prototype.setAtLeast2=function(minimumDimensionSymbols){var i;for(i=0;i<minimumDimensionSymbols.length;i++){var row=parseInt(i/3);var col=parseInt(i%3);this.setAtLeast(row,col,jsts.geom.Dimension.toDimensionValue(minimumDimensionSymbols.charAt(i)));}};jsts.geom.IntersectionMatrix.prototype.setAll=function(dimensionValue){var ai,bi;for(ai=0;ai<3;ai++){for(bi=0;bi<3;bi++){this.matrix[ai][bi]=dimensionValue;}}};jsts.geom.IntersectionMatrix.prototype.get=function(row,column){return this.matrix[row][column];};jsts.geom.IntersectionMatrix.prototype.isDisjoint=function(){return this.matrix[Location.INTERIOR][Location.INTERIOR]===Dimension.FALSE&&this.matrix[Location.INTERIOR][Location.BOUNDARY]===Dimension.FALSE&&this.matrix[Location.BOUNDARY][Location.INTERIOR]===Dimension.FALSE&&this.matrix[Location.BOUNDARY][Location.BOUNDARY]===Dimension.FALSE;};jsts.geom.IntersectionMatrix.prototype.isIntersects=function(){return!this.isDisjoint();};jsts.geom.IntersectionMatrix.prototype.isTouches=function(dimensionOfGeometryA,dimensionOfGeometryB){if(dimensionOfGeometryA>dimensionOfGeometryB){return this.isTouches(dimensionOfGeometryB,dimensionOfGeometryA);}
if((dimensionOfGeometryA==Dimension.A&&dimensionOfGeometryB==Dimension.A)||(dimensionOfGeometryA==Dimension.L&&dimensionOfGeometryB==Dimension.L)||(dimensionOfGeometryA==Dimension.L&&dimensionOfGeometryB==Dimension.A)||(dimensionOfGeometryA==Dimension.P&&dimensionOfGeometryB==Dimension.A)||(dimensionOfGeometryA==Dimension.P&&dimensionOfGeometryB==Dimension.L)){return this.matrix[Location.INTERIOR][Location.INTERIOR]===Dimension.FALSE&&(jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.BOUNDARY],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.BOUNDARY][Location.INTERIOR],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.BOUNDARY][Location.BOUNDARY],'T'));}
return false;};jsts.geom.IntersectionMatrix.prototype.isCrosses=function(dimensionOfGeometryA,dimensionOfGeometryB){if((dimensionOfGeometryA==Dimension.P&&dimensionOfGeometryB==Dimension.L)||(dimensionOfGeometryA==Dimension.P&&dimensionOfGeometryB==Dimension.A)||(dimensionOfGeometryA==Dimension.L&&dimensionOfGeometryB==Dimension.A)){return jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')&&jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.EXTERIOR],'T');}
if((dimensionOfGeometryA==Dimension.L&&dimensionOfGeometryB==Dimension.P)||(dimensionOfGeometryA==Dimension.A&&dimensionOfGeometryB==Dimension.P)||(dimensionOfGeometryA==Dimension.A&&dimensionOfGeometryB==Dimension.L)){return jsts.geom.IntersectionMatrix.matches(matrix[Location.INTERIOR][Location.INTERIOR],'T')&&jsts.geom.IntersectionMatrix.matches(this.matrix[Location.EXTERIOR][Location.INTERIOR],'T');}
if(dimensionOfGeometryA===Dimension.L&&dimensionOfGeometryB===Dimension.L){return this.matrix[Location.INTERIOR][Location.INTERIOR]===0;}
return false;};jsts.geom.IntersectionMatrix.prototype.isWithin=function(){return jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')&&this.matrix[Location.INTERIOR][Location.EXTERIOR]==Dimension.FALSE&&this.matrix[Location.BOUNDARY][Location.EXTERIOR]==Dimension.FALSE;};jsts.geom.IntersectionMatrix.prototype.isContains=function(){return jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')&&this.matrix[Location.EXTERIOR][Location.INTERIOR]==Dimension.FALSE&&this.matrix[Location.EXTERIOR][Location.BOUNDARY]==Dimension.FALSE;};jsts.geom.IntersectionMatrix.prototype.isCovers=function(){var hasPointInCommon=jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.BOUNDARY],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.BOUNDARY][Location.INTERIOR],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.BOUNDARY][Location.BOUNDARY],'T');return hasPointInCommon&&this.matrix[Location.EXTERIOR][Location.INTERIOR]==Dimension.FALSE&&this.matrix[Location.EXTERIOR][Location.BOUNDARY]==Dimension.FALSE;};jsts.geom.IntersectionMatrix.prototype.isCoveredBy=function(){var hasPointInCommon=jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.BOUNDARY],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.BOUNDARY][Location.INTERIOR],'T')||jsts.geom.IntersectionMatrix.matches(this.matrix[Location.BOUNDARY][Location.BOUNDARY],'T');return hasPointInCommon&&this.matrix[Location.INTERIOR][Location.EXTERIOR]===Dimension.FALSE&&this.matrix[Location.BOUNDARY][Location.EXTERIOR]===Dimension.FALSE;};jsts.geom.IntersectionMatrix.prototype.isEquals=function(dimensionOfGeometryA,dimensionOfGeometryB){if(dimensionOfGeometryA!==dimensionOfGeometryB){return false;}
return jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')&&this.matrix[Location.EXTERIOR][Location.INTERIOR]===Dimension.FALSE&&this.matrix[Location.INTERIOR][Location.EXTERIOR]===Dimension.FALSE&&this.matrix[Location.EXTERIOR][Location.BOUNDARY]===Dimension.FALSE&&this.matrix[Location.BOUNDARY][Location.EXTERIOR]===Dimension.FALSE;};jsts.geom.IntersectionMatrix.prototype.isOverlaps=function(dimensionOfGeometryA,dimensionOfGeometryB){if((dimensionOfGeometryA==Dimension.P&&dimensionOfGeometryB===Dimension.P)||(dimensionOfGeometryA==Dimension.A&&dimensionOfGeometryB===Dimension.A)){return jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.INTERIOR],'T')&&jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.EXTERIOR],'T')&&jsts.geom.IntersectionMatrix.matches(this.matrix[Location.EXTERIOR][Location.INTERIOR],'T');}
if(dimensionOfGeometryA===Dimension.L&&dimensionOfGeometryB===Dimension.L){return this.matrix[Location.INTERIOR][Location.INTERIOR]==1&&jsts.geom.IntersectionMatrix.matches(this.matrix[Location.INTERIOR][Location.EXTERIOR],'T')&&jsts.geom.IntersectionMatrix.matches(this.matrix[Location.EXTERIOR][Location.INTERIOR],'T');}
return false;};jsts.geom.IntersectionMatrix.prototype.matches=function(requiredDimensionSymbols){if(requiredDimensionSymbols.length!=9){throw new jsts.error.IllegalArgumentException('Should be length 9: '+
requiredDimensionSymbols);}
for(var ai=0;ai<3;ai++){for(var bi=0;bi<3;bi++){if(!jsts.geom.IntersectionMatrix.matches(this.matrix[ai][bi],requiredDimensionSymbols.charAt(3*ai+bi))){return false;}}}
return true;};jsts.geom.IntersectionMatrix.prototype.transpose=function(){var temp=matrix[1][0];this.matrix[1][0]=this.matrix[0][1];this.matrix[0][1]=temp;temp=this.matrix[2][0];this.matrix[2][0]=this.matrix[0][2];this.matrix[0][2]=temp;temp=this.matrix[2][1];this.matrix[2][1]=this.matrix[1][2];this.matrix[1][2]=temp;return this;};jsts.geom.IntersectionMatrix.prototype.toString=function(){var ai,bi,buf='';for(ai=0;ai<3;ai++){for(bi=0;bi<3;bi++){buf+=Dimension.toDimensionSymbol(this.matrix[ai][bi]);}}
return buf;};})();jsts.triangulate.quadedge.LastFoundQuadEdgeLocator=function(subdiv){this.subdiv=subdiv;this.lastEdge=null;this.init();};jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.init=function(){this.lastEdge=this.findEdge();};jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.findEdge=function(){var edges=this.subdiv.getEdges();return edges[0];};jsts.triangulate.quadedge.LastFoundQuadEdgeLocator.prototype.locate=function(v){if(!this.lastEdge.isLive()){this.init();}
var e=this.subdiv.locateFromEdge(v,this.lastEdge);this.lastEdge=e;return e;};jsts.noding.SegmentNodeList=function(edge){this.nodeMap=new javascript.util.TreeMap();this.edge=edge;};jsts.noding.SegmentNodeList.prototype.nodeMap=null;jsts.noding.SegmentNodeList.prototype.iterator=function(){return this.nodeMap.values().iterator();};jsts.noding.SegmentNodeList.prototype.edge=null;jsts.noding.SegmentNodeList.prototype.getEdge=function(){return this.edge;};jsts.noding.SegmentNodeList.prototype.add=function(intPt,segmentIndex){var eiNew=new jsts.noding.SegmentNode(this.edge,intPt,segmentIndex,this.edge.getSegmentOctant(segmentIndex));var ei=this.nodeMap.get(eiNew);if(ei!==null){jsts.util.Assert.isTrue(ei.coord.equals2D(intPt),'Found equal nodes with different coordinates');return ei;}
this.nodeMap.put(eiNew,eiNew);return eiNew;};jsts.noding.SegmentNodeList.prototype.addEndpoints=function(){var maxSegIndex=this.edge.size()-1;this.add(this.edge.getCoordinate(0),0);this.add(this.edge.getCoordinate(maxSegIndex),maxSegIndex);};jsts.noding.SegmentNodeList.prototype.addCollapsedNodes=function(){var collapsedVertexIndexes=[];this.findCollapsesFromInsertedNodes(collapsedVertexIndexes);this.findCollapsesFromExistingVertices(collapsedVertexIndexes);for(var i=0;i<collapsedVertexIndexes.length;i++){var vertexIndex=collapsedVertexIndexes[i];this.add(this.edge.getCoordinate(vertexIndex),vertexIndex);}};jsts.noding.SegmentNodeList.prototype.findCollapsesFromExistingVertices=function(collapsedVertexIndexes){for(var i=0;i<this.edge.size()-2;i++){var p0=this.edge.getCoordinate(i);var p1=this.edge.getCoordinate(i+1);var p2=this.edge.getCoordinate(i+2);if(p0.equals2D(p2)){collapsedVertexIndexes.push(i+1);}}};jsts.noding.SegmentNodeList.prototype.findCollapsesFromInsertedNodes=function(collapsedVertexIndexes){var collapsedVertexIndex=[null];var it=this.iterator();var eiPrev=it.next();while(it.hasNext()){var ei=it.next();var isCollapsed=this.findCollapseIndex(eiPrev,ei,collapsedVertexIndex);if(isCollapsed)
collapsedVertexIndexes.push(collapsedVertexIndex[0]);eiPrev=ei;}};jsts.noding.SegmentNodeList.prototype.findCollapseIndex=function(ei0,ei1,collapsedVertexIndex){if(!ei0.coord.equals2D(ei1.coord))
return false;var numVerticesBetween=ei1.segmentIndex-ei0.segmentIndex;if(!ei1.isInterior()){numVerticesBetween--;}
if(numVerticesBetween===1){collapsedVertexIndex[0]=ei0.segmentIndex+1;return true;}
return false;};jsts.noding.SegmentNodeList.prototype.addSplitEdges=function(edgeList){this.addEndpoints();this.addCollapsedNodes();var it=this.iterator();var eiPrev=it.next();while(it.hasNext()){var ei=it.next();var newEdge=this.createSplitEdge(eiPrev,ei);edgeList.add(newEdge);eiPrev=ei;}};jsts.noding.SegmentNodeList.prototype.checkSplitEdgesCorrectness=function(splitEdges){var edgePts=edge.getCoordinates();var split0=splitEdges[0];var pt0=split0.getCoordinate(0);if(!pt0.equals2D(edgePts[0]))
throw new Error('bad split edge start point at '+pt0);var splitn=splitEdges[splitEdges.length-1];var splitnPts=splitn.getCoordinates();var ptn=splitnPts[splitnPts.length-1];if(!ptn.equals2D(edgePts[edgePts.length-1]))
throw new Error('bad split edge end point at '+ptn);};jsts.noding.SegmentNodeList.prototype.createSplitEdge=function(ei0,ei1){var npts=ei1.segmentIndex-ei0.segmentIndex+2;var lastSegStartPt=this.edge.getCoordinate(ei1.segmentIndex);var useIntPt1=ei1.isInterior()||!ei1.coord.equals2D(lastSegStartPt);if(!useIntPt1){npts--;}
var pts=[];var ipt=0;pts[ipt++]=new jsts.geom.Coordinate(ei0.coord);for(var i=ei0.segmentIndex+1;i<=ei1.segmentIndex;i++){pts[ipt++]=this.edge.getCoordinate(i);}
if(useIntPt1)
pts[ipt]=ei1.coord;return new jsts.noding.NodedSegmentString(pts,this.edge.getData());};jsts.io.WKTWriter=function(){this.parser=new jsts.io.WKTParser(this.geometryFactory);};jsts.io.WKTWriter.prototype.write=function(geometry){var wkt=this.parser.write(geometry);return wkt;};jsts.io.WKTWriter.toLineString=function(p0,p1){if(arguments.length!==2){throw new jsts.error.NotImplementedError();}
return'LINESTRING ( '+p0.x+' '+p0.y+', '+p1.x+' '+p1.y+' )';};jsts.io.WKTReader=function(geometryFactory){this.geometryFactory=geometryFactory||new jsts.geom.GeometryFactory();this.precisionModel=this.geometryFactory.getPrecisionModel();this.parser=new jsts.io.WKTParser(this.geometryFactory);};jsts.io.WKTReader.prototype.read=function(wkt){var geometry=this.parser.read(wkt);if(this.precisionModel.getType()===jsts.geom.PrecisionModel.FIXED){this.reducePrecision(geometry);}
return geometry;};jsts.io.WKTReader.prototype.reducePrecision=function(geometry){var i,len;if(geometry.coordinate){this.precisionModel.makePrecise(geometry.coordinate);}else if(geometry.points){for(i=0,len=geometry.points.length;i<len;i++){this.precisionModel.makePrecise(geometry.points[i]);}}else if(geometry.geometries){for(i=0,len=geometry.geometries.length;i<len;i++){this.reducePrecision(geometry.geometries[i]);}}};jsts.triangulate.quadedge.QuadEdgeSubdivision=function(env,tolerance){this.tolerance=tolerance;this.edgeCoincidenceTolerance=tolerance/jsts.triangulate.quadedge.QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR;this.visitedKey=0;this.quadEdges=[];this.startingEdge;this.tolerance;this.edgeCoincidenceTolerance;this.frameEnv;this.locator=null;this.seg=new jsts.geom.LineSegment();this.triEdges=new Array(3);this.frameVertex=new Array(3);this.createFrame(env);this.startingEdge=this.initSubdiv();this.locator=new jsts.triangulate.quadedge.LastFoundQuadEdgeLocator(this);};jsts.triangulate.quadedge.QuadEdgeSubdivision.EDGE_COINCIDENCE_TOL_FACTOR=1000;jsts.triangulate.quadedge.QuadEdgeSubdivision.getTriangleEdges=function(startQE,triEdge){triEdge[0]=startQE;triEdge[1]=triEdge[0].lNext();triEdge[2]=triEdge[1].lNext();if(triEdge[2].lNext()!=triEdge[0]){throw new jsts.IllegalArgumentError('Edges do not form a triangle');}};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.createFrame=function(env){var deltaX,deltaY,offset;deltaX=env.getWidth();deltaY=env.getHeight();offset=0.0;if(deltaX>deltaY){offset=deltaX*10.0;}else{offset=deltaY*10.0;}
this.frameVertex[0]=new jsts.triangulate.quadedge.Vertex((env.getMaxX()+env.getMinX())/2.0,env.getMaxY()
+offset);this.frameVertex[1]=new jsts.triangulate.quadedge.Vertex(env.getMinX()-offset,env.getMinY()-offset);this.frameVertex[2]=new jsts.triangulate.quadedge.Vertex(env.getMaxX()+offset,env.getMinY()-offset);this.frameEnv=new jsts.geom.Envelope(this.frameVertex[0].getCoordinate(),this.frameVertex[1].getCoordinate());this.frameEnv.expandToInclude(this.frameVertex[2].getCoordinate());};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.initSubdiv=function(){var ea,eb,ec;ea=this.makeEdge(this.frameVertex[0],this.frameVertex[1]);eb=this.makeEdge(this.frameVertex[1],this.frameVertex[2]);jsts.triangulate.quadedge.QuadEdge.splice(ea.sym(),eb);ec=this.makeEdge(this.frameVertex[2],this.frameVertex[0]);jsts.triangulate.quadedge.QuadEdge.splice(eb.sym(),ec);jsts.triangulate.quadedge.QuadEdge.splice(ec.sym(),ea);return ea;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTolerance=function(){return this.tolerance;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEnvelope=function(){return new jsts.geom.Envelope(this.frameEnv);};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEdges=function(){if(arguments.length>0){return this.getEdgesByFactory(arguments[0]);}else{return this.quadEdges;}};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.setLocator=function(locator){this.locator=locator;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.makeEdge=function(o,d){var q=jsts.triangulate.quadedge.QuadEdge.makeEdge(o,d);this.quadEdges.push(q);return q;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.connect=function(a,b){var q=jsts.triangulate.quadedge.QuadEdge.connect(a,b);this.quadEdges.push(q);return q;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.delete_jsts=function(e){jsts.triangulate.quadedge.QuadEdge.splice(e,e.oPrev());jsts.triangulate.quadedge.QuadEdge.splice(e.sym(),e.sym().oPrev());var eSym,eRot,eRotSym;e.eSym=e.sym();eRot=e.rot;eRotSym=e.rot.sym();var idx=this.quadEdges.indexOf(e);if(idx!==-1){this.quadEdges.splice(idx,1);}
idx=this.quadEdges.indexOf(eSym);if(idx!==-1){this.quadEdges.splice(idx,1);}
idx=this.quadEdges.indexOf(eRot);if(idx!==-1){this.quadEdges.splice(idx,1);}
idx=this.quadEdges.indexOf(eRotSym);if(idx!==-1){this.quadEdges.splice(idx,1);}
e.delete_jsts();eSym.delete_jsts();eRot.delete_jsts();eRotSym.delete_jsts();};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateFromEdge=function(v,startEdge){var iter=0,maxIter=this.quadEdges.length,e;e=startEdge;while(true){iter++;if(iter>maxIter){throw new jsts.error.LocateFailureError(e.toLineSegment());}
if((v.equals(e.orig()))||(v.equals(e.dest()))){break;}else if(v.rightOf(e)){e=e.sym();}else if(!v.rightOf(e.oNext())){e=e.oNext();}else if(!v.rightOf(e.dPrev())){e=e.dPrev();}else{break;}}
return e;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locate=function(){if(arguments.length===1){if(arguments[0]instanceof jsts.triangulate.quadedge.Vertex){return this.locateByVertex(arguments[0]);}else{return this.locateByCoordinate(arguments[0]);}}else{return this.locateByCoordinates(arguments[0],arguments[1]);}};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByVertex=function(v){return this.locator.locate(v);};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByCoordinate=function(p){return this.locator.locate(new jsts.triangulate.quadedge.Vertex(p));};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.locateByCoordinates=function(p0,p1){var e,base,locEdge;var e=this.locator.locate(new jsts.triangulate.quadedge.Vertex(p0));if(e===null){return null;}
base=e;if(e.dest().getCoordinate().equals2D(p0)){base=e.sym();}
locEdge=base;do{if(locEdge.dest().getCoordinate().equals2D(p1)){return locEdge;}
locEdge=locEdge.oNext();}while(locEdge!=base);return null;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.insertSite=function(v){var e,base,startEdge;e=this.locate(v);if((v.equals(e.orig(),this.tolerance))||(v.equals(e.dest(),this.tolerance))){return e;}
base=this.makeEdge(e.orig(),v);jsts.triangulate.quadedge.QuadEdge.splice(base,e);startEdge=base;do{base=this.connect(e,base.sym());e=base.oPrev();}while(e.lNext()!=startEdge);return startEdge;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameEdge=function(e){if(this.isFrameVertex(e.orig())||this.isFrameVertex(e.dest())){return true;}
return false;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameBorderEdge=function(e){var leftTri,rightTri,vLeftTriOther,vRightTriOther;leftTri=new Array(3);this.getTriangleEdges(e,leftTri);rightTri=new Array(3);this.getTriangleEdges(e.sym(),rightTri);vLeftTriOther=e.lNext().dest();if(this.isFrameVertex(vLeftTriOther)){return true;}
vRightTriOther=e.sym().lNext().dest();if(this.isFrameVertex(vRightTriOther)){return true;}
return false;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isFrameVertex=function(v){if(v.equals(this.frameVertex[0])){return true;}
if(v.equals(this.frameVertex[1])){return true;}
if(v.equals(this.frameVertex[2])){return true;}
return false;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isOnEdge=function(e,p){this.seg.setCoordinates(e.orig().getCoordinate(),e.dest().getCoordinate());var dist=this.seg.distance(p);return dist<this.edgeCoincidenceTolerance;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.isVertexOfEdge=function(e,v){if((v.equals(e.orig(),this.tolerance))||(v.equals(e.dest(),this.tolerance))){return true;}
return false;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVertices=function(includeFrame)
{var vertices=[],i,il,qe,v,vd;i=0,il=this.quadEdges.length;for(i;i<il;i++){qe=this.quadEdges[i];v=qe.orig();if(includeFrame||!this.isFrameVertex(v)){vertices.push(v);}
vd=qe.dest();if(includeFrame||!this.isFrameVertex(vd)){vertices.push(vd);}}
return vertices;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVertexUniqueEdges=function(includeFrame)
{var edges,visitedVertices,i,il,qe,v,qd,vd;edges=[];visitedVertices=[];i=0,il=this.quadEdges.length;for(i;i<il;i++){qe=this.quadEdges[i];v=qe.orig();if(visitedVertices.indexOf(v)===-1){visitedVertices.push(v);if(includeFrame||!this.isFrameVertex(v)){edges.push(qe);}}
qd=qe.sym();vd=qd.orig();if(visitedVertices.indexOf(vd)===-1){visitedVertices.push(vd);if(includeFrame||!this.isFrameVertex(vd)){edges.push(qd);}}}
return edges;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getPrimaryEdges=function(includeFrame){this.visitedKey++;var edges,edgeStack,visitedEdges,edge,priQE;edges=[];edgeStack=[];edgeStack.push(this.startingEdge);visitedEdges=[];while(edgeStack.length>0){edge=edgeStack.pop();if(visitedEdges.indexOf(edge)===-1){priQE=edge.getPrimary();if(includeFrame||!this.isFrameEdge(priQE)){edges.push(priQE);}
edgeStack.push(edge.oNext());edgeStack.push(edge.sym().oNext());visitedEdges.push(edge);visitedEdges.push(edge.sym());}}
return edges;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.visitTriangles=function(triVisitor,includeFrame){this.visitedKey++;var edgeStack,visitedEdges,edge,triEdges;edgeStack=[];edgeStack.push(this.startingEdge);visitedEdges=[];while(edgeStack.length>0){edge=edgeStack.pop();if(visitedEdges.indexOf(edge)===-1){triEdges=this.fetchTriangleToVisit(edge,edgeStack,includeFrame,visitedEdges);if(triEdges!==null)
triVisitor.visit(triEdges);}}};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.fetchTriangleToVisit=function(edge,edgeStack,includeFrame,visitedEdges){var curr,edgeCount,isFrame,sym;curr=edge;edgeCount=0;isFrame=false;do{this.triEdges[edgeCount]=curr;if(this.isFrameEdge(curr)){isFrame=true;}
sym=curr.sym();if(visitedEdges.indexOf(sym)===-1){edgeStack.push(sym);}
visitedEdges.push(curr);edgeCount++;curr=curr.lNext();}while(curr!==edge);if(isFrame&&!includeFrame){return null;}
return this.triEdges;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleEdges=function(includeFrame){var visitor=new jsts.triangulate.quadedge.TriangleEdgesListVisitor();this.visitTriangles(visitor,includeFrame);return visitor.getTriangleEdges();};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleVertices=function(includeFrame){var visitor=new TriangleVertexListVisitor();this.visitTriangles(visitor,includeFrame);return visitor.getTriangleVertices();};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangleCoordinates=function(includeFrame){var visitor=new jsts.triangulate.quadedge.TriangleCoordinatesVisitor();this.visitTriangles(visitor,includeFrame);return visitor.getTriangles();};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getEdgesByFactory=function(geomFact){var quadEdges,edges,i,il,qe,coords;quadEdges=this.getPrimaryEdges(false);edges=[];i=0;il=quadEdges.length;for(i;i<il;i++){qe=quadEdges[i];coords=[];coords[0]=(qe.orig().getCoordinate());coords[1]=(qe.dest().getCoordinate());edges[i]=geomFact.createLineString(coords);}
return geomFact.createMultiLineString(edges);};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getTriangles=function(geomFact){var triPtsList,tris,triPt,i,il;triPtsList=this.getTriangleCoordinates(false);tris=new Array(triPtsList.length);i=0,il=triPtsList.length;for(i;i<il;i++){triPt=triPtsList[i];tris[i]=geomFact.createPolygon(geomFact.createLinearRing(triPt,null));}
return geomFact.createGeometryCollection(tris);};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiDiagram=function(geomFact)
{var vorCells=this.getVoronoiCellPolygons(geomFact);return geomFact.createGeometryCollection(vorCells);};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiCellPolygons=function(geomFact)
{this.visitTriangles(new jsts.triangulate.quadedge.TriangleCircumcentreVisitor(),true);var cells,edges,i,il,qe;cells=[];edges=this.getVertexUniqueEdges(false);i=0,il=edges.length;for(i;i<il;i++){qe=edges[i];cells.push(this.getVoronoiCellPolygon(qe,geomFact));}
return cells;};jsts.triangulate.quadedge.QuadEdgeSubdivision.prototype.getVoronoiCellPolygon=function(qe,geomFact)
{var cellPts,startQe,cc,coordList,cellPoly,v;cellPts=[];startQE=qe;do{cc=qe.rot.orig().getCoordinate();cellPts.push(cc);qe=qe.oPrev();}while(qe!==startQE);coordList=new jsts.geom.CoordinateList([],false);coordList.add(cellPts,false);coordList.closeRing();if(coordList.size()<4){coordList.add(coordList.get(coordList.size()-1),true);}
cellPoly=geomFact.createPolygon(geomFact.createLinearRing(coordList.toArray()),null);v=startQE.orig();return cellPoly;};jsts.triangulate.quadedge.TriangleCircumcentreVisitor=function(){};jsts.triangulate.quadedge.TriangleCircumcentreVisitor.prototype.visit=function(triEdges){var a,b,c,cc,ccVertex,i;a=triEdges[0].orig().getCoordinate();b=triEdges[1].orig().getCoordinate();c=triEdges[2].orig().getCoordinate();cc=jsts.geom.Triangle.circumcentre(a,b,c);ccVertex=new jsts.triangulate.quadedge.Vertex(cc);i=0;for(i;i<3;i++){triEdges[i].rot.setOrig(ccVertex);}};jsts.triangulate.quadedge.TriangleEdgesListVisitor=function(){this.triList=[];};jsts.triangulate.quadedge.TriangleEdgesListVisitor.prototype.visit=function(triEdges){var clone=triEdges.concat();this.triList.push(clone);};jsts.triangulate.quadedge.TriangleEdgesListVisitor.prototype.getTriangleEdges=function(){return this.triList;};jsts.triangulate.quadedge.TriangleVertexListVisitor=function(){this.triList=[];};jsts.triangulate.quadedge.TriangleVertexListVisitor.prototype.visit=function(triEdges){var vertices=[];vertices.push(trieEdges[0].orig());vertices.push(trieEdges[1].orig());vertices.push(trieEdges[2].orig());this.triList.push(vertices);};jsts.triangulate.quadedge.TriangleVertexListVisitor.prototype.getTriangleVertices=function(){return this.triList;};jsts.triangulate.quadedge.TriangleCoordinatesVisitor=function(){this.coordList=new jsts.geom.CoordinateList([],false);this.triCoords=[];};jsts.triangulate.quadedge.TriangleCoordinatesVisitor.prototype.visit=function(triEdges){this.coordList=new jsts.geom.CoordinateList([],false);var i=0,v,pts;for(i;i<3;i++){v=triEdges[i].orig();this.coordList.add(v.getCoordinate());}
if(this.coordList.size()>0){this.coordList.closeRing();pts=this.coordList.toArray();if(pts.length!==4){return;}
this.triCoords.push(pts);}};jsts.triangulate.quadedge.TriangleCoordinatesVisitor.prototype.getTriangles=function(){return this.triCoords;};jsts.operation.relate.EdgeEndBundle=function(){this.edgeEnds=[];var e=arguments[0]instanceof jsts.geomgraph.EdgeEnd?arguments[0]:arguments[1];var edge=e.getEdge();var coord=e.getCoordinate();var dirCoord=e.getDirectedCoordinate();var label=new jsts.geomgraph.Label(e.getLabel());jsts.geomgraph.EdgeEnd.call(this,edge,coord,dirCoord,label);this.insert(e);};jsts.operation.relate.EdgeEndBundle.prototype=new jsts.geomgraph.EdgeEnd();jsts.operation.relate.EdgeEndBundle.prototype.edgeEnds=null;jsts.operation.relate.EdgeEndBundle.prototype.getLabel=function(){return this.label;};jsts.operation.relate.EdgeEndBundle.prototype.getEdgeEnds=function(){return this.edgeEnds;};jsts.operation.relate.EdgeEndBundle.prototype.insert=function(e){this.edgeEnds.push(e);};jsts.operation.relate.EdgeEndBundle.prototype.computeLabel=function(boundaryNodeRule){var isArea=false;for(var i=0;i<this.edgeEnds.length;i++){var e=this.edgeEnds[i];if(e.getLabel().isArea())
isArea=true;}
if(isArea)
this.label=new jsts.geomgraph.Label(jsts.geom.Location.NONE,jsts.geom.Location.NONE,jsts.geom.Location.NONE);else
this.label=new jsts.geomgraph.Label(jsts.geom.Location.NONE);for(var i=0;i<2;i++){this.computeLabelOn(i,boundaryNodeRule);if(isArea)
this.computeLabelSides(i);}};jsts.operation.relate.EdgeEndBundle.prototype.computeLabelOn=function(geomIndex,boundaryNodeRule){var boundaryCount=0;var foundInterior=false;for(var i=0;i<this.edgeEnds.length;i++){var e=this.edgeEnds[i];var loc=e.getLabel().getLocation(geomIndex);if(loc==jsts.geom.Location.BOUNDARY)
boundaryCount++;if(loc==jsts.geom.Location.INTERIOR)
foundInterior=true;}
var loc=jsts.geom.Location.NONE;if(foundInterior)
loc=jsts.geom.Location.INTERIOR;if(boundaryCount>0){loc=jsts.geomgraph.GeometryGraph.determineBoundary(boundaryNodeRule,boundaryCount);}
this.label.setLocation(geomIndex,loc);};jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSides=function(geomIndex){this.computeLabelSide(geomIndex,jsts.geomgraph.Position.LEFT);this.computeLabelSide(geomIndex,jsts.geomgraph.Position.RIGHT);};jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSide=function(geomIndex,side){for(var i=0;i<this.edgeEnds.length;i++){var e=this.edgeEnds[i];if(e.getLabel().isArea()){var loc=e.getLabel().getLocation(geomIndex,side);if(loc===jsts.geom.Location.INTERIOR){this.label.setLocation(geomIndex,side,jsts.geom.Location.INTERIOR);return;}else if(loc===jsts.geom.Location.EXTERIOR)
this.label.setLocation(geomIndex,side,jsts.geom.Location.EXTERIOR);}}};jsts.operation.relate.EdgeEndBundle.prototype.updateIM=function(im){jsts.geomgraph.Edge.updateIM(this.label,im);};jsts.index.kdtree.KdTree=function(tolerance){var tol=0.0;if(tolerance!==undefined){tol=tolerance;}
this.root=null;this.last=null;this.numberOfNodes=0;this.tolerance=tol;};jsts.index.kdtree.KdTree.prototype.insert=function(){if(arguments.length===1){return this.insertCoordinate.apply(this,arguments[0]);}else{return this.insertWithData.apply(this,arguments[0],arguments[1]);}};jsts.index.kdtree.KdTree.prototype.insertCoordinate=function(p){return this.insertWithData(p,null);};jsts.index.kdtree.KdTree.prototype.insertWithData=function(p,data){if(this.root===null){this.root=new jsts.index.kdtree.KdNode(p,data);return this.root;}
var currentNode=this.root,leafNode=this.root,isOddLevel=true,isLessThan=true;while(currentNode!==last){if(isOddLevel){isLessThan=p.x<currentNode.getX();}else{isLessThan=p.y<currentNode.getY();}
leafNode=currentNode;if(isLessThan){currentNode=currentNode.getLeft();}else{currentNode=currentNode.getRight();}
if(currentNode!==null){var isInTolerance=p.distance(currentNode.getCoordinate())<=this.tolerance;if(isInTolerance){currentNode.increment();return currentNode;}}
isOddLevel=!isOddLevel;}
this.numberOfNodes=numberOfNodes+1;var node=new jsts.index.kdtree.KdNode(p,data);node.setLeft(this.last);node.setRight(this.last);if(isLessThan){leafNode.setLeft(node);}else{leafNode.setRight(node);}
return node;};jsts.index.kdtree.KdTree.prototype.queryNode=function(currentNode,bottomNode,queryEnv,odd,result){if(currentNode===bottomNode){return;}
var min,max,discriminant;if(odd){min=queryEnv.getMinX();max=queryEnv.getMaxX();discriminant=currentNode.getX();}else{min=queryEnv.getMinY();max=queryEnv.getMaxY();discriminant=currentNode.getY();}
var searchLeft=min<discriminant;var searchRight=discriminant<=max;if(searchLeft){this.queryNode(currentNode.getLeft(),bottomNode,queryEnv,!odd,result);}
if(queryEnv.contains(currentNode.getCoordinate())){result.add(currentNode);}
if(searchRight){this.queryNode(currentNode.getRight(),bottomNode,queryEnv,!odd,result);}};jsts.index.kdtree.KdTree.prototype.query=function(){if(arguments.length===1){return this.queryByEnvelope.apply(this,arguments[0]);}else{return this.queryWithArray.apply(this,arguments[0],arguments[1]);}};jsts.index.kdtree.KdTree.prototype.queryByEnvelope=function(queryEnv){var result=[];this.queryNode(this.root,this.last,queryEnv,true,result);return result;};jsts.index.kdtree.KdTree.prototype.queryWithArray=function(queryEnv,result){this.queryNode(this.root,this.last,queryEnv,true,result);};jsts.geom.Triangle=function(p0,p1,p2){this.p0=p0;this.p1=p1;this.p2=p2;};jsts.geom.Triangle.isAcute=function(a,b,c){if(!jsts.algorithm.Angle.isAcute(a,b,c)){return false;}
if(!jsts.algorithm.Angle.isAcute(b,c,a)){return false;}
if(!jsts.algorithm.Angle.isAcute(c,a,b)){return false;}
return true;};jsts.geom.Triangle.perpendicularBisector=function(a,b){var dx,dy,l1,l2;dx=b.x-a.x;dy=b.y-a.y;l1=new jsts.algorithm.HCoordinate(a.x+dx/2.0,a.y+dy/2.0,1.0);l2=new jsts.algorithm.HCoordinate(a.x-dy+dx/2.0,a.y+dx+dy/2.0,1.0);return new jsts.algorithm.HCoordinate(l1,l2);};jsts.geom.Triangle.circumcentre=function(a,b,c){var cx,cy,ax,ay,bx,by,denom,numx,numy,ccx,ccy;cx=c.x;cy=c.y;ax=a.x-cx;ay=a.y-cy;bx=b.x-cx;by=b.y-cy;denom=2*jsts.geom.Triangle.det(ax,ay,bx,by);numx=jsts.geom.Triangle.det(ay,ax*ax+ay*ay,by,bx*bx+by*by);numy=jsts.geom.Triangle.det(ax,ax*ax+ay*ay,bx,bx*bx+by*by);ccx=cx-numx/denom;ccy=cy+numy/denom;return new jsts.geom.Coordinate(ccx,ccy);};jsts.geom.Triangle.det=function(m00,m01,m10,m11){return m00*m11-m01*m10;};jsts.geom.Triangle.inCentre=function(a,b,c){var len0,len1,len2,circum,inCentreX,inCentreY;len0=b.distance(c);len1=a.distance(c);len2=a.distance(b);circum=len0+len1+len2;inCentreX=(len0*a.x+len1*b.x+len2*c.x)/circum;inCentreY=(len0*a.y+len1*b.y+len2*c.y)/circum;return new jsts.geom.Coordinate(inCentreX,inCentreY);};jsts.geom.Triangle.centroid=function(a,b,c){var x,y;x=(a.x+b.x+c.x)/3;y=(a.y+b.y+c.y)/3;return new jsts.geom.Coordinate(x,y);};jsts.geom.Triangle.longestSideLength=function(a,b,c){var lenAB,lenBC,lenCA,maxLen;lenAB=a.distance(b);lenBC=b.distance(c);lenCA=c.distance(a);maxLen=lenAB;if(lenBC>maxLen){maxLen=lenBC;}
if(lenCA>maxLen){maxLen=lenCA;}
return maxLen;};jsts.geom.Triangle.angleBisector=function(a,b,c){var len0,len2,frac,dx,dy,splitPt;len0=b.distance(a);len2=b.distance(c);frac=len0/(len0+len2);dx=c.x-a.x;dy=c.y-a.y;splitPt=new jsts.geom.Coordinate(a.x+frac*dx,a.y+frac*dy);return splitPt;};jsts.geom.Triangle.area=function(a,b,c){return Math.abs(((c.x-a.x)*(b.y-a.y)-(b.x-a.x)*(c.y-a.y))/2.0);};jsts.geom.Triangle.signedArea=function(a,b,c){return((c.x-a.x)*(b.y-a.y)-(b.x-a.x)*(c.y-a.y))/2.0;};jsts.geom.Triangle.prototype.inCentre=function(){return jsts.geom.Triangle.inCentre(this.p0,this.p1,this.p2);};jsts.noding.OrientedCoordinateArray=function(pts){this.pts=pts;this._orientation=jsts.noding.OrientedCoordinateArray.orientation(pts);};jsts.noding.OrientedCoordinateArray.prototype.pts=null;jsts.noding.OrientedCoordinateArray.prototype._orientation=undefined;jsts.noding.OrientedCoordinateArray.orientation=function(pts){return jsts.geom.CoordinateArrays.increasingDirection(pts)===1;};jsts.noding.OrientedCoordinateArray.prototype.compareTo=function(o1){var oca=o1;var comp=jsts.noding.OrientedCoordinateArray.compareOriented(this.pts,this._orientation,oca.pts,oca._orientation);return comp;};jsts.noding.OrientedCoordinateArray.compareOriented=function(pts1,orientation1,pts2,orientation2){var dir1=orientation1?1:-1;var dir2=orientation2?1:-1;var limit1=orientation1?pts1.length:-1;var limit2=orientation2?pts2.length:-1;var i1=orientation1?0:pts1.length-1;var i2=orientation2?0:pts2.length-1;var comp=0;while(true){var compPt=pts1[i1].compareTo(pts2[i2]);if(compPt!==0)
return compPt;i1+=dir1;i2+=dir2;var done1=i1===limit1;var done2=i2===limit2;if(done1&&!done2)
return-1;if(!done1&&done2)
return 1;if(done1&&done2)
return 0;}};jsts.algorithm.CentralEndpointIntersector=function(p00,p01,p10,p11){this.pts=[p00,p01,p10,p11];this.compute();};jsts.algorithm.CentralEndpointIntersector.getIntersection=function(p00,p01,p10,p11){var intor=new jsts.algorithm.CentralEndpointIntersector(p00,p01,p10,p11);return intor.getIntersection();};jsts.algorithm.CentralEndpointIntersector.prototype.pts=null;jsts.algorithm.CentralEndpointIntersector.prototype.intPt=null;jsts.algorithm.CentralEndpointIntersector.prototype.compute=function(){var centroid=jsts.algorithm.CentralEndpointIntersector.average(this.pts);this.intPt=this.findNearestPoint(centroid,this.pts);};jsts.algorithm.CentralEndpointIntersector.prototype.getIntersection=function(){return this.intPt;};jsts.algorithm.CentralEndpointIntersector.average=function(pts){var avg=new jsts.geom.Coordinate();var i,n=pts.length;for(i=0;i<n;i++){avg.x+=pts[i].x;avg.y+=pts[i].y;}
if(n>0){avg.x/=n;avg.y/=n;}
return avg;};jsts.algorithm.CentralEndpointIntersector.prototype.findNearestPoint=function(p,pts){var minDist=Number.MAX_VALUE;var i,result=null,dist;for(i=0;i<pts.length;i++){dist=p.distance(pts[i]);if(dist<minDist){minDist=dist;result=pts[i];}}
return result;};jsts.operation.buffer.BufferOp=function(g,bufParams){this.argGeom=g;this.bufParams=bufParams?bufParams:new jsts.operation.buffer.BufferParameters();};jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS=12;jsts.operation.buffer.BufferOp.precisionScaleFactor=function(g,distance,maxPrecisionDigits){var env=g.getEnvelopeInternal();var envSize=Math.max(env.getHeight(),env.getWidth());var expandByDistance=distance>0.0?distance:0.0;var bufEnvSize=envSize+2*expandByDistance;var bufEnvLog10=(Math.log(bufEnvSize)/Math.log(10)+1.0);var minUnitLog10=bufEnvLog10-maxPrecisionDigits;var scaleFactor=Math.pow(10.0,-minUnitLog10);return scaleFactor;};jsts.operation.buffer.BufferOp.bufferOp=function(g,distance){if(arguments.length>2){return jsts.operation.buffer.BufferOp.bufferOp2.apply(this,arguments);}
var gBuf=new jsts.operation.buffer.BufferOp(g);var geomBuf=gBuf.getResultGeometry(distance);return geomBuf;};jsts.operation.buffer.BufferOp.bufferOp2=function(g,distance,params){if(arguments.length>3){return jsts.operation.buffer.BufferOp.bufferOp3.apply(this,arguments);}
var bufOp=new jsts.operation.buffer.BufferOp(g,params);var geomBuf=bufOp.getResultGeometry(distance);return geomBuf;};jsts.operation.buffer.BufferOp.bufferOp3=function(g,distance,quadrantSegments){if(arguments.length>4){return jsts.operation.buffer.BufferOp.bufferOp4.apply(this,arguments);}
var bufOp=new jsts.operation.buffer.BufferOp(g);bufOp.setQuadrantSegments(quadrantSegments);var geomBuf=bufOp.getResultGeometry(distance);return geomBuf;};jsts.operation.buffer.BufferOp.bufferOp4=function(g,distance,quadrantSegments,endCapStyle){var bufOp=new jsts.operation.buffer.BufferOp(g);bufOp.setQuadrantSegments(quadrantSegments);bufOp.setEndCapStyle(endCapStyle);var geomBuf=bufOp.getResultGeometry(distance);return geomBuf;};jsts.operation.buffer.BufferOp.prototype.argGeom=null;jsts.operation.buffer.BufferOp.prototype.distance=null;jsts.operation.buffer.BufferOp.prototype.bufParams=null;jsts.operation.buffer.BufferOp.prototype.resultGeometry=null;jsts.operation.buffer.BufferOp.prototype.setEndCapStyle=function(endCapStyle){this.bufParams.setEndCapStyle(endCapStyle);};jsts.operation.buffer.BufferOp.prototype.setQuadrantSegments=function(quadrantSegments){this.bufParams.setQuadrantSegments(quadrantSegments);};jsts.operation.buffer.BufferOp.prototype.getResultGeometry=function(dist){this.distance=dist;this.computeGeometry();return this.resultGeometry;};jsts.operation.buffer.BufferOp.prototype.computeGeometry=function(){this.bufferOriginalPrecision();if(this.resultGeometry!==null){return;}
var argPM=this.argGeom.getPrecisionModel();if(argPM.getType()===jsts.geom.PrecisionModel.FIXED){this.bufferFixedPrecision(argPM);}else{this.bufferReducedPrecision();}};jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision=function(){var precDigits;var saveException=null;for(precDigits=jsts.operation.buffer.BufferOp.MAX_PRECISION_DIGITS;precDigits>=0;precDigits--){try{this.bufferReducedPrecision2(precDigits);}catch(ex){saveException=ex;}
if(this.resultGeometry!==null){return;}}
throw saveException;};jsts.operation.buffer.BufferOp.prototype.bufferOriginalPrecision=function(){try{var bufBuilder=new jsts.operation.buffer.BufferBuilder(this.bufParams);this.resultGeometry=bufBuilder.buffer(this.argGeom,this.distance);}catch(e){}};jsts.operation.buffer.BufferOp.prototype.bufferReducedPrecision2=function(precisionDigits){var sizeBasedScaleFactor=jsts.operation.buffer.BufferOp.precisionScaleFactor(this.argGeom,this.distance,precisionDigits);var fixedPM=new jsts.geom.PrecisionModel(sizeBasedScaleFactor);this.bufferFixedPrecision(fixedPM);};jsts.operation.buffer.BufferOp.prototype.bufferFixedPrecision=function(fixedPM){var noder=new jsts.noding.ScaledNoder(new jsts.noding.snapround.MCIndexSnapRounder(new jsts.geom.PrecisionModel(1.0)),fixedPM.getScale());var bufBuilder=new jsts.operation.buffer.BufferBuilder(this.bufParams);bufBuilder.setWorkingPrecisionModel(fixedPM);bufBuilder.setNoder(noder);this.resultGeometry=bufBuilder.buffer(this.argGeom,this.distance);};(function(){var Location=jsts.geom.Location;var Position=jsts.geomgraph.Position;var Assert=jsts.util.Assert;jsts.geomgraph.GeometryGraph=function(argIndex,parentGeom,boundaryNodeRule){jsts.geomgraph.PlanarGraph.call(this);this.lineEdgeMap=new javascript.util.HashMap();this.ptLocator=new jsts.algorithm.PointLocator();this.argIndex=argIndex;this.parentGeom=parentGeom;this.boundaryNodeRule=boundaryNodeRule||jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;if(parentGeom!==null){this.add(parentGeom);}};jsts.geomgraph.GeometryGraph.prototype=new jsts.geomgraph.PlanarGraph();jsts.geomgraph.GeometryGraph.constructor=jsts.geomgraph.GeometryGraph;jsts.geomgraph.GeometryGraph.prototype.createEdgeSetIntersector=function(){return new jsts.geomgraph.index.SimpleMCSweepLineIntersector();};jsts.geomgraph.GeometryGraph.determineBoundary=function(boundaryNodeRule,boundaryCount){return boundaryNodeRule.isInBoundary(boundaryCount)?Location.BOUNDARY:Location.INTERIOR;};jsts.geomgraph.GeometryGraph.prototype.parentGeom=null;jsts.geomgraph.GeometryGraph.prototype.lineEdgeMap=null;jsts.geomgraph.GeometryGraph.prototype.boundaryNodeRule=null;jsts.geomgraph.GeometryGraph.prototype.useBoundaryDeterminationRule=true;jsts.geomgraph.GeometryGraph.prototype.argIndex=null;jsts.geomgraph.GeometryGraph.prototype.boundaryNodes=null;jsts.geomgraph.GeometryGraph.prototype.hasTooFewPoints=false;jsts.geomgraph.GeometryGraph.prototype.invalidPoint=null;jsts.geomgraph.GeometryGraph.prototype.areaPtLocator=null;jsts.geomgraph.GeometryGraph.prototype.ptLocator=null;jsts.geomgraph.GeometryGraph.prototype.getGeometry=function(){return this.parentGeom;};jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodes=function(){if(this.boundaryNodes===null)
this.boundaryNodes=this.nodes.getBoundaryNodes(this.argIndex);return this.boundaryNodes;};jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodeRule=function(){return this.boundaryNodeRule;};jsts.geomgraph.GeometryGraph.prototype.findEdge=function(line){return this.lineEdgeMap.get(line);};jsts.geomgraph.GeometryGraph.prototype.computeSplitEdges=function(edgelist){for(var i=this.edges.iterator();i.hasNext();){var e=i.next();e.eiList.addSplitEdges(edgelist);}}
jsts.geomgraph.GeometryGraph.prototype.add=function(g){if(g.isEmpty()){return;}
if(g instanceof jsts.geom.MultiPolygon)
this.useBoundaryDeterminationRule=false;if(g instanceof jsts.geom.Polygon)
this.addPolygon(g);else if(g instanceof jsts.geom.LineString)
this.addLineString(g);else if(g instanceof jsts.geom.Point)
this.addPoint(g);else if(g instanceof jsts.geom.MultiPoint)
this.addCollection(g);else if(g instanceof jsts.geom.MultiLineString)
this.addCollection(g);else if(g instanceof jsts.geom.MultiPolygon)
this.addCollection(g);else if(g instanceof jsts.geom.GeometryCollection)
this.addCollection(g);else
throw new jsts.error.IllegalArgumentError('Geometry type not supported.');};jsts.geomgraph.GeometryGraph.prototype.addCollection=function(gc){for(var i=0;i<gc.getNumGeometries();i++){var g=gc.getGeometryN(i);this.add(g);}};jsts.geomgraph.GeometryGraph.prototype.addEdge=function(e){this.insertEdge(e);var coord=e.getCoordinates();this.insertPoint(this.argIndex,coord[0],Location.BOUNDARY);this.insertPoint(this.argIndex,coord[coord.length-1],Location.BOUNDARY);};jsts.geomgraph.GeometryGraph.prototype.addPoint=function(p){var coord=p.getCoordinate();this.insertPoint(this.argIndex,coord,Location.INTERIOR);};jsts.geomgraph.GeometryGraph.prototype.addLineString=function(line){var coord=jsts.geom.CoordinateArrays.removeRepeatedPoints(line.getCoordinates());if(coord.length<2){this.hasTooFewPoints=true;this.invalidPoint=coords[0];return;}
var e=new jsts.geomgraph.Edge(coord,new jsts.geomgraph.Label(this.argIndex,Location.INTERIOR));this.lineEdgeMap.put(line,e);this.insertEdge(e);Assert.isTrue(coord.length>=2,'found LineString with single point');this.insertBoundaryPoint(this.argIndex,coord[0]);this.insertBoundaryPoint(this.argIndex,coord[coord.length-1]);};jsts.geomgraph.GeometryGraph.prototype.addPolygonRing=function(lr,cwLeft,cwRight){if(lr.isEmpty())
return;var coord=jsts.geom.CoordinateArrays.removeRepeatedPoints(lr.getCoordinates());if(coord.length<4){this.hasTooFewPoints=true;this.invalidPoint=coord[0];return;}
var left=cwLeft;var right=cwRight;if(jsts.algorithm.CGAlgorithms.isCCW(coord)){left=cwRight;right=cwLeft;}
var e=new jsts.geomgraph.Edge(coord,new jsts.geomgraph.Label(this.argIndex,Location.BOUNDARY,left,right));this.lineEdgeMap.put(lr,e);this.insertEdge(e);this.insertPoint(this.argIndex,coord[0],Location.BOUNDARY);};jsts.geomgraph.GeometryGraph.prototype.addPolygon=function(p){this.addPolygonRing(p.getExteriorRing(),Location.EXTERIOR,Location.INTERIOR);for(var i=0;i<p.getNumInteriorRing();i++){var hole=p.getInteriorRingN(i);this.addPolygonRing(hole,Location.INTERIOR,Location.EXTERIOR);}};jsts.geomgraph.GeometryGraph.prototype.computeEdgeIntersections=function(g,li,includeProper){var si=new jsts.geomgraph.index.SegmentIntersector(li,includeProper,true);si.setBoundaryNodes(this.getBoundaryNodes(),g.getBoundaryNodes());var esi=this.createEdgeSetIntersector();esi.computeIntersections(this.edges,g.edges,si);return si;};jsts.geomgraph.GeometryGraph.prototype.computeSelfNodes=function(li,computeRingSelfNodes){var si=new jsts.geomgraph.index.SegmentIntersector(li,true,false);var esi=this.createEdgeSetIntersector();if(!computeRingSelfNodes&&(this.parentGeom instanceof jsts.geom.LinearRing||this.parentGeom instanceof jsts.geom.Polygon||this.parentGeom instanceof jsts.geom.MultiPolygon)){esi.computeIntersections(this.edges,si,false);}else{esi.computeIntersections(this.edges,si,true);}
this.addSelfIntersectionNodes(this.argIndex);return si;};jsts.geomgraph.GeometryGraph.prototype.insertPoint=function(argIndex,coord,onLocation){var n=this.nodes.addNode(coord);var lbl=n.getLabel();if(lbl==null){n.label=new jsts.geomgraph.Label(argIndex,onLocation);}else
lbl.setLocation(argIndex,onLocation);};jsts.geomgraph.GeometryGraph.prototype.insertBoundaryPoint=function(argIndex,coord){var n=this.nodes.addNode(coord);var lbl=n.getLabel();var boundaryCount=1;var loc=Location.NONE;if(lbl!==null)
loc=lbl.getLocation(argIndex,Position.ON);if(loc===Location.BOUNDARY)
boundaryCount++;var newLoc=jsts.geomgraph.GeometryGraph.determineBoundary(this.boundaryNodeRule,boundaryCount);lbl.setLocation(argIndex,newLoc);};jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNodes=function(argIndex){for(var i=this.edges.iterator();i.hasNext();){var e=i.next();var eLoc=e.getLabel().getLocation(argIndex);for(var eiIt=e.eiList.iterator();eiIt.hasNext();){var ei=eiIt.next();this.addSelfIntersectionNode(argIndex,ei.coord,eLoc);}}};jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNode=function(argIndex,coord,loc){if(this.isBoundaryNode(argIndex,coord))
return;if(loc===Location.BOUNDARY&&this.useBoundaryDeterminationRule)
this.insertBoundaryPoint(argIndex,coord);else
this.insertPoint(argIndex,coord,loc);};jsts.geomgraph.GeometryGraph.prototype.getInvalidPoint=function(){return this.invalidPoint;};})();jsts.operation.buffer.OffsetSegmentString=function(){this.ptList=[];};jsts.operation.buffer.OffsetSegmentString.prototype.ptList=null;jsts.operation.buffer.OffsetSegmentString.prototype.precisionModel=null;jsts.operation.buffer.OffsetSegmentString.prototype.minimimVertexDistance=0.0;jsts.operation.buffer.OffsetSegmentString.prototype.setPrecisionModel=function(precisionModel){this.precisionModel=precisionModel;};jsts.operation.buffer.OffsetSegmentString.prototype.setMinimumVertexDistance=function(minimimVertexDistance){this.minimimVertexDistance=minimimVertexDistance;};jsts.operation.buffer.OffsetSegmentString.prototype.addPt=function(pt){var bufPt=new jsts.geom.Coordinate(pt);this.precisionModel.makePrecise(bufPt);if(this.isRedundant(bufPt))
return;this.ptList.push(bufPt);};jsts.operation.buffer.OffsetSegmentString.prototype.addPts=function(pt,isForward){if(isForward){for(var i=0;i<pt.length;i++){this.addPt(pt[i]);}}else{for(var i=pt.length-1;i>=0;i--){this.addPt(pt[i]);}}};jsts.operation.buffer.OffsetSegmentString.prototype.isRedundant=function(pt){if(this.ptList.length<1)
return false;var lastPt=this.ptList[this.ptList.length-1];var ptDist=pt.distance(lastPt);if(ptDist<this.minimimVertexDistance)
return true;return false;};jsts.operation.buffer.OffsetSegmentString.prototype.closeRing=function(){if(this.ptList.length<1)
return;var startPt=new jsts.geom.Coordinate(this.ptList[0]);var lastPt=this.ptList[this.ptList.length-1];var last2Pt=null;if(this.ptList.length>=2)
last2Pt=this.ptList[this.ptList.length-2];if(startPt.equals(lastPt))
return;this.ptList.push(startPt);};jsts.operation.buffer.OffsetSegmentString.prototype.reverse=function(){};jsts.operation.buffer.OffsetSegmentString.prototype.getCoordinates=function(){return this.ptList;};jsts.algorithm.distance.PointPairDistance=function(){this.pt=[new jsts.geom.Coordinate(),new jsts.geom.Coordinate()];};jsts.algorithm.distance.PointPairDistance.prototype.pt=null;jsts.algorithm.distance.PointPairDistance.prototype.distance=NaN;jsts.algorithm.distance.PointPairDistance.prototype.isNull=true;jsts.algorithm.distance.PointPairDistance.prototype.initialize=function(p0,p1,distance){if(p0===undefined){this.isNull=true;return;}
this.pt[0].setCoordinate(p0);this.pt[1].setCoordinate(p1);this.distance=distance!==undefined?distance:p0.distance(p1);this.isNull=false;};jsts.algorithm.distance.PointPairDistance.prototype.getDistance=function(){return this.distance;};jsts.algorithm.distance.PointPairDistance.prototype.getCoordinates=function(){return this.pt;};jsts.algorithm.distance.PointPairDistance.prototype.getCoordinate=function(i){return this.pt[i];};jsts.algorithm.distance.PointPairDistance.prototype.setMaximum=function(ptDist){if(arguments.length===2){this.setMaximum2.apply(this,arguments);return;}
this.setMaximum(ptDist.pt[0],ptDist.pt[1]);};jsts.algorithm.distance.PointPairDistance.prototype.setMaximum2=function(p0,p1){if(this.isNull){this.initialize(p0,p1);return;}
var dist=p0.distance(p1);if(dist>this.distance)
this.initialize(p0,p1,dist);};jsts.algorithm.distance.PointPairDistance.prototype.setMinimum=function(ptDist){if(arguments.length===2){this.setMinimum2.apply(this,arguments);return;}
this.setMinimum(ptDist.pt[0],ptDist.pt[1]);};jsts.algorithm.distance.PointPairDistance.prototype.setMinimum2=function(p0,p1){if(this.isNull){this.initialize(p0,p1);return;}
var dist=p0.distance(p1);if(dist<this.distance)
this.initialize(p0,p1,dist);};(function(){var PointPairDistance=jsts.algorithm.distance.PointPairDistance;var DistanceToPoint=jsts.algorithm.distance.DistanceToPoint;var MaxPointDistanceFilter=function(geom){this.maxPtDist=new PointPairDistance();this.minPtDist=new PointPairDistance();this.euclideanDist=new DistanceToPoint();this.geom=geom;};MaxPointDistanceFilter.prototype=new jsts.geom.CoordinateFilter();MaxPointDistanceFilter.prototype.maxPtDist=new PointPairDistance();MaxPointDistanceFilter.prototype.minPtDist=new PointPairDistance();MaxPointDistanceFilter.prototype.euclideanDist=new DistanceToPoint();MaxPointDistanceFilter.prototype.geom;MaxPointDistanceFilter.prototype.filter=function(pt){this.minPtDist.initialize();DistanceToPoint.computeDistance(this.geom,pt,this.minPtDist);this.maxPtDist.setMaximum(this.minPtDist);};MaxPointDistanceFilter.prototype.getMaxPointDistance=function(){return this.maxPtDist;};var MaxDensifiedByFractionDistanceFilter=function(geom,fraction){this.maxPtDist=new PointPairDistance();this.minPtDist=new PointPairDistance();this.geom=geom;this.numSubSegs=Math.round(1.0/fraction);};MaxDensifiedByFractionDistanceFilter.prototype=new jsts.geom.CoordinateSequenceFilter();MaxDensifiedByFractionDistanceFilter.prototype.maxPtDist=new PointPairDistance();MaxDensifiedByFractionDistanceFilter.prototype.minPtDist=new PointPairDistance();MaxDensifiedByFractionDistanceFilter.prototype.geom;MaxDensifiedByFractionDistanceFilter.prototype.numSubSegs=0;MaxDensifiedByFractionDistanceFilter.prototype.filter=function(seq,index){if(index==0)
return;var p0=seq[index-1];var p1=seq[index];var delx=(p1.x-p0.x)/this.numSubSegs;var dely=(p1.y-p0.y)/this.numSubSegs;for(var i=0;i<this.numSubSegs;i++){var x=p0.x+i*delx;var y=p0.y+i*dely;var pt=new jsts.geom.Coordinate(x,y);this.minPtDist.initialize();DistanceToPoint.computeDistance(this.geom,pt,this.minPtDist);this.maxPtDist.setMaximum(this.minPtDist);}};MaxDensifiedByFractionDistanceFilter.prototype.isGeometryChanged=function(){return false;};MaxDensifiedByFractionDistanceFilter.prototype.isDone=function(){return false;};MaxDensifiedByFractionDistanceFilter.prototype.getMaxPointDistance=function(){return this.maxPtDist;};jsts.algorithm.distance.DiscreteHausdorffDistance=function(g0,g1){this.g0=g0;this.g1=g1;this.ptDist=new jsts.algorithm.distance.PointPairDistance();};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.g0=null;jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.g1=null;jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.ptDist=null;jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.densifyFrac=0.0;jsts.algorithm.distance.DiscreteHausdorffDistance.distance=function(g0,g1,densifyFrac){var dist=new jsts.algorithm.distance.DiscreteHausdorffDistance(g0,g1);if(densifyFrac!==undefined)
dist.setDensifyFraction(densifyFrac);return dist.distance();};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.setDensifyFraction=function(densifyFrac){if(densifyFrac>1.0||densifyFrac<=0.0)
throw new jsts.error.IllegalArgumentError('Fraction is not in range (0.0 - 1.0]');this.densifyFrac=densifyFrac;};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.distance=function(){this.compute(this.g0,this.g1);return ptDist.getDistance();};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.orientedDistance=function(){this.computeOrientedDistance(this.g0,this.g1,this.ptDist);return this.ptDist.getDistance();};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.getCoordinates=function(){return ptDist.getCoordinates();};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.compute=function(g0,g1){this.computeOrientedDistance(g0,g1,this.ptDist);this.computeOrientedDistance(g1,g0,this.ptDist);};jsts.algorithm.distance.DiscreteHausdorffDistance.prototype.computeOrientedDistance=function(discreteGeom,geom,ptDist){var distFilter=new MaxPointDistanceFilter(geom);discreteGeom.apply(distFilter);ptDist.setMaximum(distFilter.getMaxPointDistance());if(this.densifyFrac>0){var fracFilter=new MaxDensifiedByFractionDistanceFilter(geom,this.densifyFrac);discreteGeom.apply(fracFilter);ptDist.setMaximum(fracFilter.getMaxPointDistance());}};})();jsts.algorithm.MinimumBoundingCircle=function(geom){this.input=null;this.extremalPts=null;this.centre=null;this.radius=0;this.input=geom;};jsts.algorithm.MinimumBoundingCircle.prototype.getCircle=function(){this.compute();if(this.centre===null){return this.input.getFactory().createPolygon(null,null);}
var centrePoint=this.input.getFactory().createPoint(this.centre);if(this.radius===0){return centrePoint;}
return centrePoint.buffer(this.radius);};jsts.algorithm.MinimumBoundingCircle.prototype.getExtremalPoints=function(){this.compute();return this.extremalPts;};jsts.algorithm.MinimumBoundingCircle.prototype.getCentre=function(){this.compute();return this.centre;};jsts.algorithm.MinimumBoundingCircle.prototype.getRadius=function(){this.compute();return this.radius;};jsts.algorithm.MinimumBoundingCircle.prototype.computeCentre=function(){switch(this.extremalPts.length){case 0:this.centre=null;break;case 1:this.centre=this.extremalPts[0];break;case 2:this.centre=new jsts.geom.Coordinate((this.extremalPts[0].x+this.extremalPts[1].x)/2,(this.extremalPts[0].y+this.extremalPts[1].y)/2);break;case 3:this.centre=jsts.geom.Triangle.circumcentre(this.extremalPts[0],this.extremalPts[1],this.extremalPts[2]);break;}};jsts.algorithm.MinimumBoundingCircle.prototype.compute=function(){if(this.extremalPts!==null){return;}
this.computeCirclePoints();this.computeCentre();if(this.centre!==null){this.radius=this.centre.distance(this.extremalPts[0]);}};jsts.algorithm.MinimumBoundingCircle.prototype.computeCirclePoints=function(){if(this.input.isEmpty()){this.extremalPts=[];return;}
var pts;if(this.input.getNumPoints()===1){pts=this.input.getCoordinates();this.extremalPts=[new jsts.geom.Coordinate(pts[0])];return;}
var convexHull=this.input.convexHull();var hullPts=convexHull.getCoordinates();pts=hullPts;if(hullPts[0].equals2D(hullPts[hullPts.length-1])){pts=[];jsts.geom.CoordinateArrays.copyDeep(hullPts,0,pts,0,hullPts.length-1);}
if(pts.length<=2){this.extremalPts=jsts.geom.CoordinateArrays.copyDeep(pts);return;}
var P=jsts.algorithm.MinimumBoundingCircle.lowestPoint(pts);var Q=jsts.algorithm.MinimumBoundingCircle.pointWitMinAngleWithX(pts,P);for(var i=0;i<pts.length;i++){var R=jsts.algorithm.MinimumBoundingCircle.pointWithMinAngleWithSegment(pts,P,Q);if(jsts.algorithm.Angle.isObtuse(P,R,Q)){this.extremalPts=[new jsts.geom.Coordinate(P),new jsts.geom.Coordinate(Q)];return;}
if(jsts.algorithm.Angle.isObtuse(R,P,Q)){P=R;continue;}
if(jsts.algorithm.Angle.isObtuse(R,Q,P)){Q=R;continue;}
this.extremalPts=[new jsts.geom.Coordinate(P),new jsts.geom.Coordinate(Q),new jsts.geom.Coordinate(R)];return;}
throw new Error("Logic failure in Minimum Bounding Circle algorithm!");};jsts.algorithm.MinimumBoundingCircle.lowestPoint=function(pts){var min=pts[0];for(var i=1;i<pts.length;i++){if(pts[i].y<min.y){min=pts[i];}}
return min;};jsts.algorithm.MinimumBoundingCircle.pointWitMinAngleWithX=function(pts,P){var minSin=Number.MAX_VALUE;var minAngPt=null;for(var i=0;i<pts.length;i++){var p=pts[i];if(p===P)continue;var dx=p.x-P.x;var dy=p.y-P.y;if(dy<0)dy=-dy;var len=Math.sqrt(dx*dx+dy*dy);var sin=dy/len;if(sin<minSin){minSin=sin;minAngPt=p;}}
return minAngPt;};jsts.algorithm.MinimumBoundingCircle.pointWithMinAngleWithSegment=function(pts,P,Q){var minAng=Number.MAX_VALUE;var minAngPt=null;for(var i=0;i<pts.length;i++){var p=pts[i];if(p===P)continue;if(p===Q)continue;var ang=jsts.algorithm.Angle.angleBetween(P,p,Q);if(ang<minAng){minAng=ang;minAngPt=p;}}
return minAngPt;};jsts.noding.ScaledNoder=function(noder,scaleFactor,offsetX,offsetY){this.offsetX=offsetX?offsetX:0;this.offsetY=offsetY?offsetY:0;this.noder=noder;this.scaleFactor=scaleFactor;this.isScaled=!this.isIntegerPrecision();};jsts.noding.ScaledNoder.prototype=new jsts.noding.Noder();jsts.noding.ScaledNoder.constructor=jsts.noding.ScaledNoder;jsts.noding.ScaledNoder.prototype.noder=null;jsts.noding.ScaledNoder.prototype.scaleFactor=undefined;jsts.noding.ScaledNoder.prototype.offsetX=undefined;jsts.noding.ScaledNoder.prototype.offsetY=undefined;jsts.noding.ScaledNoder.prototype.isScaled=false;jsts.noding.ScaledNoder.prototype.isIntegerPrecision=function(){return this.scaleFactor===1.0;};jsts.noding.ScaledNoder.prototype.getNodedSubstrings=function(){var splitSS=this.noder.getNodedSubstrings();if(this.isScaled)
this.rescale(splitSS);return splitSS;};jsts.noding.ScaledNoder.prototype.computeNodes=function(inputSegStrings){var intSegStrings=inputSegStrings;if(this.isScaled)
intSegStrings=this.scale(inputSegStrings);this.noder.computeNodes(intSegStrings);};jsts.noding.ScaledNoder.prototype.scale=function(segStrings){if(segStrings instanceof Array){return this.scale2(segStrings);}
var transformed=new javascript.util.ArrayList();for(var i=segStrings.iterator();i.hasNext();){var ss=i.next();transformed.add(new jsts.noding.NodedSegmentString(this.scale(ss.getCoordinates()),ss.getData()));}
return transformed;};jsts.noding.ScaledNoder.prototype.scale2=function(pts){var roundPts=[];for(var i=0;i<pts.length;i++){roundPts[i]=new jsts.geom.Coordinate(Math.round((pts[i].x-this.offsetX)*this.scaleFactor),Math.round((pts[i].y-this.offsetY)*this.scaleFactor));}
var roundPtsNoDup=jsts.geom.CoordinateArrays.removeRepeatedPoints(roundPts);return roundPtsNoDup;};jsts.noding.ScaledNoder.prototype.rescale=function(segStrings){if(segStrings instanceof Array){this.rescale2(segStrings);return;}
for(var i=segStrings.iterator();i.hasNext();){var ss=i.next();this.rescale(ss.getCoordinates());}};jsts.noding.ScaledNoder.prototype.rescale2=function(pts){for(var i=0;i<pts.length;i++){pts[i].x=pts[i].x/this.scaleFactor+this.offsetX;pts[i].y=pts[i].y/this.scaleFactor+this.offsetY;}};(function(){var ArrayList=javascript.util.ArrayList;jsts.geomgraph.index.SegmentIntersector=function(li,includeProper,recordIsolated){this.li=li;this.includeProper=includeProper;this.recordIsolated=recordIsolated;};jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments=function(i1,i2){return Math.abs(i1-i2)===1;};jsts.geomgraph.index.SegmentIntersector.prototype._hasIntersection=false;jsts.geomgraph.index.SegmentIntersector.prototype.hasProper=false;jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInterior=false;jsts.geomgraph.index.SegmentIntersector.prototype.properIntersectionPoint=null;jsts.geomgraph.index.SegmentIntersector.prototype.li=null;jsts.geomgraph.index.SegmentIntersector.prototype.includeProper=null;jsts.geomgraph.index.SegmentIntersector.prototype.recordIsolated=null;jsts.geomgraph.index.SegmentIntersector.prototype.isSelfIntersection=null;jsts.geomgraph.index.SegmentIntersector.prototype.numIntersections=0;jsts.geomgraph.index.SegmentIntersector.prototype.numTests=0;jsts.geomgraph.index.SegmentIntersector.prototype.bdyNodes=null;jsts.geomgraph.index.SegmentIntersector.prototype.setBoundaryNodes=function(bdyNodes0,bdyNodes1){this.bdyNodes=[];this.bdyNodes[0]=bdyNodes0;this.bdyNodes[1]=bdyNodes1;};jsts.geomgraph.index.SegmentIntersector.prototype.getProperIntersectionPoint=function(){return this.properIntersectionPoint;};jsts.geomgraph.index.SegmentIntersector.prototype.hasIntersection=function(){return this._hasIntersection;};jsts.geomgraph.index.SegmentIntersector.prototype.hasProperIntersection=function(){return this.hasProper;};jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInteriorIntersection=function(){return this.hasProperInterior;};jsts.geomgraph.index.SegmentIntersector.prototype.isTrivialIntersection=function(e0,segIndex0,e1,segIndex1){if(e0===e1){if(this.li.getIntersectionNum()===1){if(jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments(segIndex0,segIndex1))
return true;if(e0.isClosed()){var maxSegIndex=e0.getNumPoints()-1;if((segIndex0===0&&segIndex1===maxSegIndex)||(segIndex1===0&&segIndex0===maxSegIndex)){return true;}}}}
return false;};jsts.geomgraph.index.SegmentIntersector.prototype.addIntersections=function(e0,segIndex0,e1,segIndex1){if(e0===e1&&segIndex0===segIndex1)
return;this.numTests++;var p00=e0.getCoordinates()[segIndex0];var p01=e0.getCoordinates()[segIndex0+1];var p10=e1.getCoordinates()[segIndex1];var p11=e1.getCoordinates()[segIndex1+1];this.li.computeIntersection(p00,p01,p10,p11);if(this.li.hasIntersection()){if(this.recordIsolated){e0.setIsolated(false);e1.setIsolated(false);}
this.numIntersections++;if(!this.isTrivialIntersection(e0,segIndex0,e1,segIndex1)){this._hasIntersection=true;if(this.includeProper||!this.li.isProper()){e0.addIntersections(this.li,segIndex0,0);e1.addIntersections(this.li,segIndex1,1);}
if(this.li.isProper()){this.properIntersectionPoint=this.li.getIntersection(0).clone();this.hasProper=true;if(!this.isBoundaryPoint(this.li,this.bdyNodes))
this.hasProperInterior=true;}}}};jsts.geomgraph.index.SegmentIntersector.prototype.isBoundaryPoint=function(li,bdyNodes){if(bdyNodes===null)
return false;if(bdyNodes instanceof Array){if(this.isBoundaryPoint(li,bdyNodes[0]))
return true;if(this.isBoundaryPoint(li,bdyNodes[1]))
return true;return false;}else{for(var i=bdyNodes.iterator();i.hasNext();){var node=i.next();var pt=node.getCoordinate();if(li.isIntersection(pt))
return true;}
return false;}};})();
},{}],41:[function(require,module,exports){
(function (global){
/*
  javascript.util is a port of selected parts of java.util to JavaScript which
  main purpose is to ease porting Java code to JavaScript.
  
  The MIT License (MIT)

  Copyright (C) 2011-2014 by The Authors

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
;(function(){var e=this;function f(a,b){var c=a.split("."),d=e;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var t;c.length&&(t=c.shift());)c.length||void 0===b?d=d[t]?d[t]:d[t]={}:d[t]=b}function g(a,b){function c(){}c.prototype=b.prototype;a.q=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.p=function(a,c,O){var M=Array.prototype.slice.call(arguments,2);return b.prototype[c].apply(a,M)}};function h(a){this.message=a||""}g(h,Error);f("javascript.util.EmptyStackException",h);h.prototype.name="EmptyStackException";function k(a){this.message=a||""}g(k,Error);f("javascript.util.IndexOutOfBoundsException",k);k.prototype.name="IndexOutOfBoundsException";function l(){}f("javascript.util.Iterator",l);l.prototype.hasNext=l.prototype.c;l.prototype.next=l.prototype.next;l.prototype.remove=l.prototype.remove;function m(){}f("javascript.util.Collection",m);function n(){}g(n,m);f("javascript.util.List",n);function p(){}f("javascript.util.Map",p);function q(a){this.message=a||""}g(q,Error);f("javascript.util.NoSuchElementException",q);q.prototype.name="NoSuchElementException";function r(a){this.message=a||""}g(r,Error);r.prototype.name="OperationNotSupported";function s(a){this.a=[];a instanceof m&&this.e(a)}g(s,n);f("javascript.util.ArrayList",s);s.prototype.a=null;s.prototype.add=function(a){this.a.push(a);return!0};s.prototype.add=s.prototype.add;s.prototype.e=function(a){for(a=a.f();a.c();)this.add(a.next());return!0};s.prototype.addAll=s.prototype.e;s.prototype.set=function(a,b){var c=this.a[a];this.a[a]=b;return c};s.prototype.set=s.prototype.set;s.prototype.f=function(){return new u(this)};s.prototype.iterator=s.prototype.f;
s.prototype.get=function(a){if(0>a||a>=this.size())throw new k;return this.a[a]};s.prototype.get=s.prototype.get;s.prototype.g=function(){return 0===this.a.length};s.prototype.isEmpty=s.prototype.g;s.prototype.size=function(){return this.a.length};s.prototype.size=s.prototype.size;s.prototype.h=function(){for(var a=[],b=0,c=this.a.length;b<c;b++)a.push(this.a[b]);return a};s.prototype.toArray=s.prototype.h;
s.prototype.remove=function(a){for(var b=!1,c=0,d=this.a.length;c<d;c++)if(this.a[c]===a){this.a.splice(c,1);b=!0;break}return b};s.prototype.remove=s.prototype.remove;function u(a){this.j=a}f("$jscomp.scope.Iterator_",u);u.prototype.j=null;u.prototype.b=0;u.prototype.next=function(){if(this.b===this.j.size())throw new q;return this.j.get(this.b++)};u.prototype.next=u.prototype.next;u.prototype.c=function(){return this.b<this.j.size()?!0:!1};u.prototype.hasNext=u.prototype.c;
u.prototype.remove=function(){throw new r;};u.prototype.remove=u.prototype.remove;function v(){}f("javascript.util.Arrays",v);
v.sort=function(){var a=arguments[0],b,c,d;if(1===arguments.length)a.sort();else if(2===arguments.length)c=arguments[1],d=function(a,b){return c.compare(a,b)},a.sort(d);else if(3===arguments.length)for(b=a.slice(arguments[1],arguments[2]),b.sort(),d=a.slice(0,arguments[1]).concat(b,a.slice(arguments[2],a.length)),a.splice(0,a.length),b=0;b<d.length;b++)a.push(d[b]);else if(4===arguments.length)for(b=a.slice(arguments[1],arguments[2]),c=arguments[3],d=function(a,b){return c.compare(a,b)},b.sort(d),
d=a.slice(0,arguments[1]).concat(b,a.slice(arguments[2],a.length)),a.splice(0,a.length),b=0;b<d.length;b++)a.push(d[b])};v.asList=function(a){for(var b=new s,c=0,d=a.length;c<d;c++)b.add(a[c]);return b};function w(){this.i={}}g(w,p);f("javascript.util.HashMap",w);w.prototype.i=null;w.prototype.get=function(a){return this.i[a]||null};w.prototype.get=w.prototype.get;w.prototype.put=function(a,b){return this.i[a]=b};w.prototype.put=w.prototype.put;w.prototype.m=function(){var a=new s,b;for(b in this.i)this.i.hasOwnProperty(b)&&a.add(this.i[b]);return a};w.prototype.values=w.prototype.m;w.prototype.size=function(){return this.m().size()};w.prototype.size=w.prototype.size;function x(){}g(x,m);f("javascript.util.Set",x);function y(a){this.a=[];a instanceof m&&this.e(a)}g(y,x);f("javascript.util.HashSet",y);y.prototype.a=null;y.prototype.contains=function(a){for(var b=0,c=this.a.length;b<c;b++)if(this.a[b]===a)return!0;return!1};y.prototype.contains=y.prototype.contains;y.prototype.add=function(a){if(this.contains(a))return!1;this.a.push(a);return!0};y.prototype.add=y.prototype.add;y.prototype.e=function(a){for(a=a.f();a.c();)this.add(a.next());return!0};y.prototype.addAll=y.prototype.e;
y.prototype.remove=function(){throw new r;};y.prototype.remove=y.prototype.remove;y.prototype.size=function(){return this.a.length};y.prototype.g=function(){return 0===this.a.length};y.prototype.isEmpty=y.prototype.g;y.prototype.h=function(){for(var a=[],b=0,c=this.a.length;b<c;b++)a.push(this.a[b]);return a};y.prototype.toArray=y.prototype.h;y.prototype.f=function(){return new z(this)};y.prototype.iterator=y.prototype.f;function z(a){this.k=a}f("$jscomp.scope.Iterator_$1",z);z.prototype.k=null;
z.prototype.b=0;z.prototype.next=function(){if(this.b===this.k.size())throw new q;return this.k.a[this.b++]};z.prototype.next=z.prototype.next;z.prototype.c=function(){return this.b<this.k.size()?!0:!1};z.prototype.hasNext=z.prototype.c;z.prototype.remove=function(){throw new r;};z.prototype.remove=z.prototype.remove;function A(){}g(A,p);f("javascript.util.SortedMap",A);function B(){}g(B,x);f("javascript.util.SortedSet",B);function C(){this.a=[]}g(C,n);f("javascript.util.Stack",C);C.prototype.a=null;C.prototype.push=function(a){this.a.push(a);return a};C.prototype.push=C.prototype.push;C.prototype.pop=function(){if(0===this.a.length)throw new h;return this.a.pop()};C.prototype.pop=C.prototype.pop;C.prototype.o=function(){if(0===this.a.length)throw new h;return this.a[this.a.length-1]};C.prototype.peek=C.prototype.o;C.prototype.empty=function(){return 0===this.a.length?!0:!1};C.prototype.empty=C.prototype.empty;
C.prototype.g=function(){return this.empty()};C.prototype.isEmpty=C.prototype.g;C.prototype.search=function(a){return this.a.indexOf(a)};C.prototype.search=C.prototype.search;C.prototype.size=function(){return this.a.length};C.prototype.size=C.prototype.size;C.prototype.h=function(){for(var a=[],b=0,c=this.a.length;b<c;b++)a.push(this.a[b]);return a};C.prototype.toArray=C.prototype.h;function D(a){return null==a?null:a.parent}function E(a,b){null!==a&&(a.color=b)}function F(a){return null==a?null:a.left}function G(a){return null==a?null:a.right}function H(){this.d=null;this.n=0}g(H,A);f("javascript.util.TreeMap",H);H.prototype.get=function(a){for(var b=this.d;null!==b;){var c=a.compareTo(b.key);if(0>c)b=b.left;else if(0<c)b=b.right;else return b.value}return null};H.prototype.get=H.prototype.get;
H.prototype.put=function(a,b){if(null===this.d)return this.d={key:a,value:b,left:null,right:null,parent:null,color:0},this.n=1,null;var c=this.d,d,t;do if(d=c,t=a.compareTo(c.key),0>t)c=c.left;else if(0<t)c=c.right;else return d=c.value,c.value=b,d;while(null!==c);c={key:a,left:null,right:null,value:b,parent:d,color:0};0>t?d.left=c:d.right=c;for(c.color=1;null!=c&&c!=this.d&&1==c.parent.color;)D(c)==F(D(D(c)))?(d=G(D(D(c))),1==(null==d?0:d.color)?(E(D(c),0),E(d,0),E(D(D(c)),1),c=D(D(c))):(c==G(D(c))&&
(c=D(c),I(this,c)),E(D(c),0),E(D(D(c)),1),J(this,D(D(c))))):(d=F(D(D(c))),1==(null==d?0:d.color)?(E(D(c),0),E(d,0),E(D(D(c)),1),c=D(D(c))):(c==F(D(c))&&(c=D(c),J(this,c)),E(D(c),0),E(D(D(c)),1),I(this,D(D(c)))));this.d.color=0;this.n++;return null};H.prototype.put=H.prototype.put;H.prototype.m=function(){var a=new s,b;b=this.d;if(null!=b)for(;null!=b.left;)b=b.left;if(null!==b)for(a.add(b.value);null!==(b=K(b));)a.add(b.value);return a};H.prototype.values=H.prototype.m;
function I(a,b){if(null!=b){var c=b.right;b.right=c.left;null!=c.left&&(c.left.parent=b);c.parent=b.parent;null==b.parent?a.d=c:b.parent.left==b?b.parent.left=c:b.parent.right=c;c.left=b;b.parent=c}}function J(a,b){if(null!=b){var c=b.left;b.left=c.right;null!=c.right&&(c.right.parent=b);c.parent=b.parent;null==b.parent?a.d=c:b.parent.right==b?b.parent.right=c:b.parent.left=c;c.right=b;b.parent=c}}
function K(a){if(null===a)return null;if(null!==a.right)for(var b=a.right;null!==b.left;)b=b.left;else for(b=a.parent;null!==b&&a===b.right;)a=b,b=b.parent;return b}H.prototype.size=function(){return this.n};H.prototype.size=H.prototype.size;function L(a){this.a=[];a instanceof m&&this.e(a)}g(L,B);f("javascript.util.TreeSet",L);L.prototype.a=null;L.prototype.contains=function(a){for(var b=0,c=this.a.length;b<c;b++)if(0===this.a[b].compareTo(a))return!0;return!1};L.prototype.contains=L.prototype.contains;L.prototype.add=function(a){if(this.contains(a))return!1;for(var b=0,c=this.a.length;b<c;b++)if(1===this.a[b].compareTo(a))return this.a.splice(b,0,a),!0;this.a.push(a);return!0};L.prototype.add=L.prototype.add;
L.prototype.e=function(a){for(a=a.f();a.c();)this.add(a.next());return!0};L.prototype.addAll=L.prototype.e;L.prototype.remove=function(){throw new r;};L.prototype.remove=L.prototype.remove;L.prototype.size=function(){return this.a.length};L.prototype.size=L.prototype.size;L.prototype.g=function(){return 0===this.a.length};L.prototype.isEmpty=L.prototype.g;L.prototype.h=function(){for(var a=[],b=0,c=this.a.length;b<c;b++)a.push(this.a[b]);return a};L.prototype.toArray=L.prototype.h;L.prototype.f=function(){return new N(this)};
L.prototype.iterator=L.prototype.f;function N(a){this.l=a}f("$jscomp.scope.Iterator_$2",N);N.prototype.l=null;N.prototype.b=0;N.prototype.next=function(){if(this.b===this.l.size())throw new q;return this.l.a[this.b++]};N.prototype.next=N.prototype.next;N.prototype.c=function(){return this.b<this.l.size()?!0:!1};N.prototype.hasNext=N.prototype.c;N.prototype.remove=function(){throw new r;};N.prototype.remove=N.prototype.remove;"undefined"!==typeof global&&(global.javascript={},global.javascript.util={},global.javascript.util.ArrayList=s,global.javascript.util.Arrays=v,global.javascript.util.Collection=m,global.javascript.util.EmptyStackException=h,global.javascript.util.HashMap=w,global.javascript.util.HashSet=y,global.javascript.util.IndexOutOfBoundsException=k,global.javascript.util.Iterator=l,global.javascript.util.List=n,global.javascript.util.Map=p,global.javascript.util.NoSuchElementException=q,global.javascript.util.OperationNotSupported=
r,global.javascript.util.Set=x,global.javascript.util.SortedMap=A,global.javascript.util.SortedSet=B,global.javascript.util.Stack=C,global.javascript.util.TreeMap=H,global.javascript.util.TreeSet=L);}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
require('./dist/javascript.util-node.min.js');

},{"./dist/javascript.util-node.min.js":41}],43:[function(require,module,exports){
var extent = require('turf-extent');

module.exports = function(layer, done){
  var ext = extent(layer);
  var x = (ext[0] + ext[2])/2;
  var y = (ext[1] + ext[3])/2;
  var center = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [x, y]
    }
  };
  return center;
}
},{"turf-extent":68}],44:[function(require,module,exports){
var explode = require('turf-explode');
var point = require('turf-point');

module.exports = function(features){
  var vertices = explode(features).features,
    xSum = 0,
    ySum = 0,
    len = vertices.length;

  for (var i = 0; i < len; i++) {
    xSum += vertices[i].geometry.coordinates[0];
    ySum += vertices[i].geometry.coordinates[1];
  }

  return point(xSum / len, ySum / len);
}

},{"turf-explode":64,"turf-point":117}],45:[function(require,module,exports){
module.exports = function(fc){
  var type = fc.features[0].geometry.type;
  var err;
  var geometries = fc.features.map(function(f){
    return f.geometry;
  })

  switch(type){
    case 'Point':
      var multiPoint = {
        type: 'Feature',
        geometry: {
          type: 'MultiPoint',
          coordinates: []
        }
      };
      multiPoint.geometry.coordinates = pluckCoods(geometries);
      return multiPoint;
      break
    case 'LineString':
      var multiLineString = {
        type: 'Feature',
        geometry: {
          type: 'MultiLineString',
          coordinates: []
        }
      };
      multiLineString.geometry.coordinates = pluckCoods(geometries)
      return multiLineString;
      break
    case 'Polygon':
      var multiPolygon = {
        type: 'Feature',
        geometry: {
          type: 'MultiPolygon',
          coordinates: []
        }
      };
      multiPolygon.geometry.coordinates = pluckCoods(geometries)
      return multiPolygon;
      break
  }
}

function pluckCoods(multi){
  return multi.map(function(geom){
    return geom.coordinates;
  });
}
},{}],46:[function(require,module,exports){
// 1. run tin on points
// 2. calculate lenth of all edges and area of all triangles
// 3. remove triangles that fail the max length test
// 4. buffer the results slightly
// 5. merge the results
var t = {};
t.tin = require('turf-tin');
t.merge = require('turf-merge');
t.distance = require('turf-distance');
t.point = require('turf-point');

module.exports = function(points, maxEdge){
  var tinPolys,
    filteredPolys,
    bufferPolys,
    mergePolys;

  tinPolys = t.tin(points, null);

  if (tinPolys instanceof Error) {
    return tinPolys;
  }

  filteredPolys = filterTriangles(tinPolys.features, maxEdge);
  tinPolys.features = filteredPolys;
  return t.merge(tinPolys);
}

var filterTriangles = function(triangles, maxEdge, cb){
  return triangles.filter(function (triangle) {
    var pt1 = t.point(triangle.geometry.coordinates[0][0][0], triangle.geometry.coordinates[0][0][1])
    var pt2 = t.point(triangle.geometry.coordinates[0][1][0], triangle.geometry.coordinates[0][1][1])
    var pt3 = t.point(triangle.geometry.coordinates[0][2][0], triangle.geometry.coordinates[0][2][1])
    var dist1 = t.distance(pt1, pt2, 'miles');
    var dist2 = t.distance(pt2, pt3, 'miles');
    var dist3 = t.distance(pt1, pt3, 'miles');

    return (dist1 <= maxEdge && dist2 <= maxEdge && dist3 <= maxEdge);
  })
}

},{"turf-distance":53,"turf-merge":109,"turf-point":117,"turf-tin":135}],47:[function(require,module,exports){
// http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain#JavaScript

module.exports = function(fc){
  var points = fc.features.map(function(point){
    return point.geometry.coordinates;
  });

  points.sort(function(a, b) {
    return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
  });

  var lower = [];
  for (var i = 0; i < points.length; i++) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
       lower.pop();
    }
    lower.push(points[i]);
  }

  var upper = [];
  for (var i = points.length - 1; i >= 0; i--) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
       upper.pop();
    }
    upper.push(points[i]);
  }

  upper.pop();
  lower.pop();
  var coords = lower.concat(upper);
  coords.push(coords[0]);
  return {
    type:'Feature',
    properties: {},
    geometry: {
      type:'Polygon',
      coordinates: [
        coords
      ]
    } 
  };
}

function cross(o, a, b) {
   return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}
},{}],48:[function(require,module,exports){
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties) poly.properties = {};
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(1);
      }
    })
    poly.properties[outField] = values.length;
  })

  return polyFC;
}

},{"turf-inside":49}],49:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],50:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html
var point = require('turf-point');

module.exports = function (point1, distance, bearing, units) {
    var coordinates1 = point1.geometry.coordinates;
    var longitude1 = toRad(coordinates1[0]);
    var latitude1 = toRad(coordinates1[1]);
    var bearing_rad = toRad(bearing);

    var R = 0;
    switch (units) {
    case 'miles':
        R = 3960;
        break
    case 'kilometers':
        R = 6373;
        break
    case 'degrees':
        R = 57.2957795;
        break
    case 'radians':
        R = 1;
        break
    }

    var latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(distance / R) +
        Math.cos(latitude1) * Math.sin(distance / R) * Math.cos(bearing_rad));
    var longitude2 = longitude1 + Math.atan2(Math.sin(bearing_rad) * Math.sin(distance / R) * Math.cos(latitude1),
        Math.cos(distance / R) - Math.sin(latitude1) * Math.sin(latitude2));

    return point(toDeg(longitude2), toDeg(latitude2));
};

function toRad(degree) {
    return degree * Math.PI / 180;
}

function toDeg(rad) {
    return rad * 180 / Math.PI;
}

},{"turf-point":117}],51:[function(require,module,exports){
var ss = require('simple-statistics');
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    });
    poly.properties[outField] = ss.standard_deviation(values);
  })

  return polyFC;
}

},{"simple-statistics":52,"turf-inside":76}],52:[function(require,module,exports){
/* global module */
// # simple-statistics
//
// A simple, literate statistics system. The code below uses the
// [Javascript module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth),
// eventually assigning `simple-statistics` to `ss` in browsers or the
// `exports` object for node.js
(function() {
    var ss = {};

    if (typeof module !== 'undefined') {
        // Assign the `ss` object to exports, so that you can require
        // it in [node.js](http://nodejs.org/)
        module.exports = ss;
    } else {
        // Otherwise, in a browser, we assign `ss` to the window object,
        // so you can simply refer to it as `ss`.
        this.ss = ss;
    }

    // # [Linear Regression](http://en.wikipedia.org/wiki/Linear_regression)
    //
    // [Simple linear regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
    // is a simple way to find a fitted line
    // between a set of coordinates.
    function linear_regression() {
        var linreg = {},
            data = [];

        // Assign data to the model. Data is assumed to be an array.
        linreg.data = function(x) {
            if (!arguments.length) return data;
            data = x.slice();
            return linreg;
        };

        // Calculate the slope and y-intercept of the regression line
        // by calculating the least sum of squares
        linreg.mb = function() {
            var m, b;

            // Store data length in a local variable to reduce
            // repeated object property lookups
            var data_length = data.length;

            //if there's only one point, arbitrarily choose a slope of 0
            //and a y-intercept of whatever the y of the initial point is
            if (data_length === 1) {
                m = 0;
                b = data[0][1];
            } else {
                // Initialize our sums and scope the `m` and `b`
                // variables that define the line.
                var sum_x = 0, sum_y = 0,
                    sum_xx = 0, sum_xy = 0;

                // Use local variables to grab point values
                // with minimal object property lookups
                var point, x, y;

                // Gather the sum of all x values, the sum of all
                // y values, and the sum of x^2 and (x*y) for each
                // value.
                //
                // In math notation, these would be SS_x, SS_y, SS_xx, and SS_xy
                for (var i = 0; i < data_length; i++) {
                    point = data[i];
                    x = point[0];
                    y = point[1];

                    sum_x += x;
                    sum_y += y;

                    sum_xx += x * x;
                    sum_xy += x * y;
                }

                // `m` is the slope of the regression line
                m = ((data_length * sum_xy) - (sum_x * sum_y)) /
                    ((data_length * sum_xx) - (sum_x * sum_x));

                // `b` is the y-intercept of the line.
                b = (sum_y / data_length) - ((m * sum_x) / data_length);
            }

            // Return both values as an object.
            return { m: m, b: b };
        };

        // a shortcut for simply getting the slope of the regression line
        linreg.m = function() {
            return linreg.mb().m;
        };

        // a shortcut for simply getting the y-intercept of the regression
        // line.
        linreg.b = function() {
            return linreg.mb().b;
        };

        // ## Fitting The Regression Line
        //
        // This is called after `.data()` and returns the
        // equation `y = f(x)` which gives the position
        // of the regression line at each point in `x`.
        linreg.line = function() {

            // Get the slope, `m`, and y-intercept, `b`, of the line.
            var mb = linreg.mb(),
                m = mb.m,
                b = mb.b;

            // Return a function that computes a `y` value for each
            // x value it is given, based on the values of `b` and `a`
            // that we just computed.
            return function(x) {
                return b + (m * x);
            };
        };

        return linreg;
    }

    // # [R Squared](http://en.wikipedia.org/wiki/Coefficient_of_determination)
    //
    // The r-squared value of data compared with a function `f`
    // is the sum of the squared differences between the prediction
    // and the actual value.
    function r_squared(data, f) {
        if (data.length < 2) return 1;

        // Compute the average y value for the actual
        // data set in order to compute the
        // _total sum of squares_
        var sum = 0, average;
        for (var i = 0; i < data.length; i++) {
            sum += data[i][1];
        }
        average = sum / data.length;

        // Compute the total sum of squares - the
        // squared difference between each point
        // and the average of all points.
        var sum_of_squares = 0;
        for (var j = 0; j < data.length; j++) {
            sum_of_squares += Math.pow(average - data[j][1], 2);
        }

        // Finally estimate the error: the squared
        // difference between the estimate and the actual data
        // value at each point.
        var err = 0;
        for (var k = 0; k < data.length; k++) {
            err += Math.pow(data[k][1] - f(data[k][0]), 2);
        }

        // As the error grows larger, its ratio to the
        // sum of squares increases and the r squared
        // value grows lower.
        return 1 - (err / sum_of_squares);
    }


    // # [Bayesian Classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier)
    //
    // This is a naïve bayesian classifier that takes
    // singly-nested objects.
    function bayesian() {
        // The `bayes_model` object is what will be exposed
        // by this closure, with all of its extended methods, and will
        // have access to all scope variables, like `total_count`.
        var bayes_model = {},
            // The number of items that are currently
            // classified in the model
            total_count = 0,
            // Every item classified in the model
            data = {};

        // ## Train
        // Train the classifier with a new item, which has a single
        // dimension of Javascript literal keys and values.
        bayes_model.train = function(item, category) {
            // If the data object doesn't have any values
            // for this category, create a new object for it.
            if (!data[category]) data[category] = {};

            // Iterate through each key in the item.
            for (var k in item) {
                var v = item[k];
                // Initialize the nested object `data[category][k][item[k]]`
                // with an object of keys that equal 0.
                if (data[category][k] === undefined) data[category][k] = {};
                if (data[category][k][v] === undefined) data[category][k][v] = 0;

                // And increment the key for this key/value combination.
                data[category][k][item[k]]++;
            }
            // Increment the number of items classified
            total_count++;
        };

        // ## Score
        // Generate a score of how well this item matches all
        // possible categories based on its attributes
        bayes_model.score = function(item) {
            // Initialize an empty array of odds per category.
            var odds = {}, category;
            // Iterate through each key in the item,
            // then iterate through each category that has been used
            // in previous calls to `.train()`
            for (var k in item) {
                var v = item[k];
                for (category in data) {
                    // Create an empty object for storing key - value combinations
                    // for this category.
                    if (odds[category] === undefined) odds[category] = {};

                    // If this item doesn't even have a property, it counts for nothing,
                    // but if it does have the property that we're looking for from
                    // the item to categorize, it counts based on how popular it is
                    // versus the whole population.
                    if (data[category][k]) {
                        odds[category][k + '_' + v] = (data[category][k][v] || 0) / total_count;
                    } else {
                        odds[category][k + '_' + v] = 0;
                    }
                }
            }

            // Set up a new object that will contain sums of these odds by category
            var odds_sums = {};

            for (category in odds) {
                // Tally all of the odds for each category-combination pair -
                // the non-existence of a category does not add anything to the
                // score.
                for (var combination in odds[category]) {
                    if (odds_sums[category] === undefined) odds_sums[category] = 0;
                    odds_sums[category] += odds[category][combination];
                }
            }

            return odds_sums;
        };

        // Return the completed model.
        return bayes_model;
    }

    // # sum
    //
    // is simply the result of adding all numbers
    // together, starting from zero.
    //
    // This runs on `O(n)`, linear time in respect to the array
    function sum(x) {
        var value = 0;
        for (var i = 0; i < x.length; i++) {
            value += x[i];
        }
        return value;
    }

    // # mean
    //
    // is the sum over the number of values
    //
    // This runs on `O(n)`, linear time in respect to the array
    function mean(x) {
        // The mean of no numbers is null
        if (x.length === 0) return null;

        return sum(x) / x.length;
    }

    // # geometric mean
    //
    // a mean function that is more useful for numbers in different
    // ranges.
    //
    // this is the nth root of the input numbers multiplied by each other
    //
    // This runs on `O(n)`, linear time in respect to the array
    function geometric_mean(x) {
        // The mean of no numbers is null
        if (x.length === 0) return null;

        // the starting value.
        var value = 1;

        for (var i = 0; i < x.length; i++) {
            // the geometric mean is only valid for positive numbers
            if (x[i] <= 0) return null;

            // repeatedly multiply the value by each number
            value *= x[i];
        }

        return Math.pow(value, 1 / x.length);
    }


    // # harmonic mean
    //
    // a mean function typically used to find the average of rates
    //
    // this is the reciprocal of the arithmetic mean of the reciprocals
    // of the input numbers
    //
    // This runs on `O(n)`, linear time in respect to the array
    function harmonic_mean(x) {
        // The mean of no numbers is null
        if (x.length === 0) return null;

        var reciprocal_sum = 0;

        for (var i = 0; i < x.length; i++) {
            // the harmonic mean is only valid for positive numbers
            if (x[i] <= 0) return null;

            reciprocal_sum += 1 / x[i];
        }

        // divide n by the the reciprocal sum
        return x.length / reciprocal_sum;
    }


    // # min
    //
    // This is simply the minimum number in the set.
    //
    // This runs on `O(n)`, linear time in respect to the array
    function min(x) {
        var value;
        for (var i = 0; i < x.length; i++) {
            // On the first iteration of this loop, min is
            // undefined and is thus made the minimum element in the array
            if (x[i] < value || value === undefined) value = x[i];
        }
        return value;
    }

    // # max
    //
    // This is simply the maximum number in the set.
    //
    // This runs on `O(n)`, linear time in respect to the array
    function max(x) {
        var value;
        for (var i = 0; i < x.length; i++) {
            // On the first iteration of this loop, max is
            // undefined and is thus made the maximum element in the array
            if (x[i] > value || value === undefined) value = x[i];
        }
        return value;
    }

    // # [variance](http://en.wikipedia.org/wiki/Variance)
    //
    // is the sum of squared deviations from the mean
    //
    // depends on `mean()`
    function variance(x) {
        // The variance of no numbers is null
        if (x.length === 0) return null;

        var mean_value = mean(x),
            deviations = [];

        // Make a list of squared deviations from the mean.
        for (var i = 0; i < x.length; i++) {
            deviations.push(Math.pow(x[i] - mean_value, 2));
        }

        // Find the mean value of that list
        return mean(deviations);
    }

    // # [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
    //
    // is just the square root of the variance.
    //
    // depends on `variance()`
    function standard_deviation(x) {
        // The standard deviation of no numbers is null
        if (x.length === 0) return null;

        return Math.sqrt(variance(x));
    }

    // The sum of deviations to the Nth power.
    // When n=2 it's the sum of squared deviations.
    // When n=3 it's the sum of cubed deviations.
    //
    // depends on `mean()`
    function sum_nth_power_deviations(x, n) {
        var mean_value = mean(x),
            sum = 0;

        for (var i = 0; i < x.length; i++) {
            sum += Math.pow(x[i] - mean_value, n);
        }

        return sum;
    }

    // # [variance](http://en.wikipedia.org/wiki/Variance)
    //
    // is the sum of squared deviations from the mean
    //
    // depends on `sum_nth_power_deviations`
    function sample_variance(x) {
        // The variance of no numbers is null
        if (x.length <= 1) return null;

        var sum_squared_deviations_value = sum_nth_power_deviations(x, 2);

        // Find the mean value of that list
        return sum_squared_deviations_value / (x.length - 1);
    }

    // # [standard deviation](http://en.wikipedia.org/wiki/Standard_deviation)
    //
    // is just the square root of the variance.
    //
    // depends on `sample_variance()`
    function sample_standard_deviation(x) {
        // The standard deviation of no numbers is null
        if (x.length <= 1) return null;

        return Math.sqrt(sample_variance(x));
    }

    // # [covariance](http://en.wikipedia.org/wiki/Covariance)
    //
    // sample covariance of two datasets:
    // how much do the two datasets move together?
    // x and y are two datasets, represented as arrays of numbers.
    //
    // depends on `mean()`
    function sample_covariance(x, y) {

        // The two datasets must have the same length which must be more than 1
        if (x.length <= 1 || x.length != y.length){
            return null;
        }

        // determine the mean of each dataset so that we can judge each
        // value of the dataset fairly as the difference from the mean. this
        // way, if one dataset is [1, 2, 3] and [2, 3, 4], their covariance
        // does not suffer because of the difference in absolute values
        var xmean = mean(x),
            ymean = mean(y),
            sum = 0;

        // for each pair of values, the covariance increases when their
        // difference from the mean is associated - if both are well above
        // or if both are well below
        // the mean, the covariance increases significantly.
        for (var i = 0; i < x.length; i++){
            sum += (x[i] - xmean) * (y[i] - ymean);
        }

        // the covariance is weighted by the length of the datasets.
        return sum / (x.length - 1);
    }

    // # [correlation](http://en.wikipedia.org/wiki/Correlation_and_dependence)
    //
    // Gets a measure of how correlated two datasets are, between -1 and 1
    //
    // depends on `sample_standard_deviation()` and `sample_covariance()`
    function sample_correlation(x, y) {
        var cov = sample_covariance(x, y),
            xstd = sample_standard_deviation(x),
            ystd = sample_standard_deviation(y);

        if (cov === null || xstd === null || ystd === null) {
            return null;
        }

        return cov / xstd / ystd;
    }

    // # [median](http://en.wikipedia.org/wiki/Median)
    //
    // The middle number of a list. This is often a good indicator of 'the middle'
    // when there are outliers that skew the `mean()` value.
    function median(x) {
        // The median of an empty list is null
        if (x.length === 0) return null;

        // Sorting the array makes it easy to find the center, but
        // use `.slice()` to ensure the original array `x` is not modified
        var sorted = x.slice().sort(function (a, b) { return a - b; });

        // If the length of the list is odd, it's the central number
        if (sorted.length % 2 === 1) {
            return sorted[(sorted.length - 1) / 2];
        // Otherwise, the median is the average of the two numbers
        // at the center of the list
        } else {
            var a = sorted[(sorted.length / 2) - 1];
            var b = sorted[(sorted.length / 2)];
            return (a + b) / 2;
        }
    }

    // # [mode](http://bit.ly/W5K4Yt)
    //
    // The mode is the number that appears in a list the highest number of times.
    // There can be multiple modes in a list: in the event of a tie, this
    // algorithm will return the most recently seen mode.
    //
    // This implementation is inspired by [science.js](https://github.com/jasondavies/science.js/blob/master/src/stats/mode.js)
    //
    // This runs on `O(n)`, linear time in respect to the array
    function mode(x) {

        // Handle edge cases:
        // The median of an empty list is null
        if (x.length === 0) return null;
        else if (x.length === 1) return x[0];

        // Sorting the array lets us iterate through it below and be sure
        // that every time we see a new number it's new and we'll never
        // see the same number twice
        var sorted = x.slice().sort(function (a, b) { return a - b; });

        // This assumes it is dealing with an array of size > 1, since size
        // 0 and 1 are handled immediately. Hence it starts at index 1 in the
        // array.
        var last = sorted[0],
            // store the mode as we find new modes
            value,
            // store how many times we've seen the mode
            max_seen = 0,
            // how many times the current candidate for the mode
            // has been seen
            seen_this = 1;

        // end at sorted.length + 1 to fix the case in which the mode is
        // the highest number that occurs in the sequence. the last iteration
        // compares sorted[i], which is undefined, to the highest number
        // in the series
        for (var i = 1; i < sorted.length + 1; i++) {
            // we're seeing a new number pass by
            if (sorted[i] !== last) {
                // the last number is the new mode since we saw it more
                // often than the old one
                if (seen_this > max_seen) {
                    max_seen = seen_this;
                    value = last;
                }
                seen_this = 1;
                last = sorted[i];
            // if this isn't a new number, it's one more occurrence of
            // the potential mode
            } else { seen_this++; }
        }
        return value;
    }

    // # [t-test](http://en.wikipedia.org/wiki/Student's_t-test)
    //
    // This is to compute a one-sample t-test, comparing the mean
    // of a sample to a known value, x.
    //
    // in this case, we're trying to determine whether the
    // population mean is equal to the value that we know, which is `x`
    // here. usually the results here are used to look up a
    // [p-value](http://en.wikipedia.org/wiki/P-value), which, for
    // a certain level of significance, will let you determine that the
    // null hypothesis can or cannot be rejected.
    //
    // Depends on `standard_deviation()` and `mean()`
    function t_test(sample, x) {
        // The mean of the sample
        var sample_mean = mean(sample);

        // The standard deviation of the sample
        var sd = standard_deviation(sample);

        // Square root the length of the sample
        var rootN = Math.sqrt(sample.length);

        // Compute the known value against the sample,
        // returning the t value
        return (sample_mean - x) / (sd / rootN);
    }

    // # [2-sample t-test](http://en.wikipedia.org/wiki/Student's_t-test)
    //
    // This is to compute two sample t-test.
    // Tests whether "mean(X)-mean(Y) = difference", (
    // in the most common case, we often have `difference == 0` to test if two samples
    // are likely to be taken from populations with the same mean value) with
    // no prior knowledge on standard deviations of both samples
    // other than the fact that they have the same standard deviation.
    //
    // Usually the results here are used to look up a
    // [p-value](http://en.wikipedia.org/wiki/P-value), which, for
    // a certain level of significance, will let you determine that the
    // null hypothesis can or cannot be rejected.
    //
    // `diff` can be omitted if it equals 0.
    //
    // [This is used to confirm or deny](http://www.monarchlab.org/Lab/Research/Stats/2SampleT.aspx)
    // a null hypothesis that the two populations that have been sampled into
    // `sample_x` and `sample_y` are equal to each other.
    //
    // Depends on `sample_variance()` and `mean()`
    function t_test_two_sample(sample_x, sample_y, difference) {
        var n = sample_x.length,
            m = sample_y.length;

        // If either sample doesn't actually have any values, we can't
        // compute this at all, so we return `null`.
        if (!n || !m) return null ;

        // default difference (mu) is zero
        if (!difference) difference = 0;

        var meanX = mean(sample_x),
            meanY = mean(sample_y);

        var weightedVariance = ((n - 1) * sample_variance(sample_x) +
            (m - 1) * sample_variance(sample_y)) / (n + m - 2);

        return (meanX - meanY - difference) /
            Math.sqrt(weightedVariance * (1 / n + 1 / m));
    }

    // # chunk
    //
    // Split an array into chunks of a specified size. This function
    // has the same behavior as [PHP's array_chunk](http://php.net/manual/en/function.array-chunk.php)
    // function, and thus will insert smaller-sized chunks at the end if
    // the input size is not divisible by the chunk size.
    //
    // `sample` is expected to be an array, and `chunkSize` a number.
    // The `sample` array can contain any kind of data.
    function chunk(sample, chunkSize) {

        // a list of result chunks, as arrays in an array
        var output = [];

        // `chunkSize` must be zero or higher - otherwise the loop below,
        // in which we call `start += chunkSize`, will loop infinitely.
        // So, we'll detect and return null in that case to indicate
        // invalid input.
        if (chunkSize <= 0) {
            return null;
        }

        // `start` is the index at which `.slice` will start selecting
        // new array elements
        for (var start = 0; start < sample.length; start += chunkSize) {

            // for each chunk, slice that part of the array and add it
            // to the output. The `.slice` function does not change
            // the original array.
            output.push(sample.slice(start, start + chunkSize));
        }
        return output;
    }

    // # shuffle_in_place
    //
    // A [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
    // in-place - which means that it will change the order of the original
    // array by reference.
    function shuffle_in_place(sample, randomSource) {

        // a custom random number source can be provided if you want to use
        // a fixed seed or another random number generator, like
        // [random-js](https://www.npmjs.org/package/random-js)
        randomSource = randomSource || Math.random;

        // store the current length of the sample to determine
        // when no elements remain to shuffle.
        var length = sample.length;

        // temporary is used to hold an item when it is being
        // swapped between indices.
        var temporary;

        // The index to swap at each stage.
        var index;

        // While there are still items to shuffle
        while (length > 0) {
            // chose a random index within the subset of the array
            // that is not yet shuffled
            index = Math.floor(randomSource() * length--);

            // store the value that we'll move temporarily
            temporary = sample[length];

            // swap the value at `sample[length]` with `sample[index]`
            sample[length] = sample[index];
            sample[index] = temporary;
        }

        return sample;
    }

    // # shuffle
    //
    // A [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
    // is a fast way to create a random permutation of a finite set.
    function shuffle(sample, randomSource) {
        // slice the original array so that it is not modified
        sample = sample.slice();

        // and then shuffle that shallow-copied array, in place
        return shuffle_in_place(sample.slice(), randomSource);
    }

    // # sample
    //
    // Create a [simple random sample](http://en.wikipedia.org/wiki/Simple_random_sample)
    // from a given array of `n` elements.
    function sample(array, n, randomSource) {
        // shuffle the original array using a fisher-yates shuffle
        var shuffled = shuffle(array, randomSource);

        // and then return a subset of it - the first `n` elements.
        return shuffled.slice(0, n);
    }

    // # quantile
    //
    // This is a population quantile, since we assume to know the entire
    // dataset in this library. Thus I'm trying to follow the
    // [Quantiles of a Population](http://en.wikipedia.org/wiki/Quantile#Quantiles_of_a_population)
    // algorithm from wikipedia.
    //
    // Sample is a one-dimensional array of numbers,
    // and p is either a decimal number from 0 to 1 or an array of decimal
    // numbers from 0 to 1.
    // In terms of a k/q quantile, p = k/q - it's just dealing with fractions or dealing
    // with decimal values.
    // When p is an array, the result of the function is also an array containing the appropriate
    // quantiles in input order
    function quantile(sample, p) {

        // We can't derive quantiles from an empty list
        if (sample.length === 0) return null;

        // Sort a copy of the array. We'll need a sorted array to index
        // the values in sorted order.
        var sorted = sample.slice().sort(function (a, b) { return a - b; });

        if (p.length) {
            // Initialize the result array
            var results = [];
            // For each requested quantile
            for (var i = 0; i < p.length; i++) {
                results[i] = quantile_sorted(sorted, p[i]);
            }
            return results;
        } else {
            return quantile_sorted(sorted, p);
        }
    }

    // # quantile
    //
    // This is the internal implementation of quantiles: when you know
    // that the order is sorted, you don't need to re-sort it, and the computations
    // are much faster.
    function quantile_sorted(sample, p) {
        var idx = (sample.length) * p;
        if (p < 0 || p > 1) {
            return null;
        } else if (p === 1) {
            // If p is 1, directly return the last element
            return sample[sample.length - 1];
        } else if (p === 0) {
            // If p is 0, directly return the first element
            return sample[0];
        } else if (idx % 1 !== 0) {
            // If p is not integer, return the next element in array
            return sample[Math.ceil(idx) - 1];
        } else if (sample.length % 2 === 0) {
            // If the list has even-length, we'll take the average of this number
            // and the next value, if there is one
            return (sample[idx - 1] + sample[idx]) / 2;
        } else {
            // Finally, in the simple case of an integer value
            // with an odd-length list, return the sample value at the index.
            return sample[idx];
        }
    }

    // # [Interquartile range](http://en.wikipedia.org/wiki/Interquartile_range)
    //
    // A measure of statistical dispersion, or how scattered, spread, or
    // concentrated a distribution is. It's computed as the difference between
    // the third quartile and first quartile.
    function iqr(sample) {
        // We can't derive quantiles from an empty list
        if (sample.length === 0) return null;

        // Interquartile range is the span between the upper quartile,
        // at `0.75`, and lower quartile, `0.25`
        return quantile(sample, 0.75) - quantile(sample, 0.25);
    }

    // # [Median Absolute Deviation](http://en.wikipedia.org/wiki/Median_absolute_deviation)
    //
    // The Median Absolute Deviation (MAD) is a robust measure of statistical
    // dispersion. It is more resilient to outliers than the standard deviation.
    function mad(x) {
        // The mad of nothing is null
        if (!x || x.length === 0) return null;

        var median_value = median(x),
            median_absolute_deviations = [];

        // Make a list of absolute deviations from the median
        for (var i = 0; i < x.length; i++) {
            median_absolute_deviations.push(Math.abs(x[i] - median_value));
        }

        // Find the median value of that list
        return median(median_absolute_deviations);
    }

    // ## Compute Matrices for Jenks
    //
    // Compute the matrices required for Jenks breaks. These matrices
    // can be used for any classing of data with `classes <= n_classes`
    function jenksMatrices(data, n_classes) {

        // in the original implementation, these matrices are referred to
        // as `LC` and `OP`
        //
        // * lower_class_limits (LC): optimal lower class limits
        // * variance_combinations (OP): optimal variance combinations for all classes
        var lower_class_limits = [],
            variance_combinations = [],
            // loop counters
            i, j,
            // the variance, as computed at each step in the calculation
            variance = 0;

        // Initialize and fill each matrix with zeroes
        for (i = 0; i < data.length + 1; i++) {
            var tmp1 = [], tmp2 = [];
            // despite these arrays having the same values, we need
            // to keep them separate so that changing one does not change
            // the other
            for (j = 0; j < n_classes + 1; j++) {
                tmp1.push(0);
                tmp2.push(0);
            }
            lower_class_limits.push(tmp1);
            variance_combinations.push(tmp2);
        }

        for (i = 1; i < n_classes + 1; i++) {
            lower_class_limits[1][i] = 1;
            variance_combinations[1][i] = 0;
            // in the original implementation, 9999999 is used but
            // since Javascript has `Infinity`, we use that.
            for (j = 2; j < data.length + 1; j++) {
                variance_combinations[j][i] = Infinity;
            }
        }

        for (var l = 2; l < data.length + 1; l++) {

            // `SZ` originally. this is the sum of the values seen thus
            // far when calculating variance.
            var sum = 0,
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                sum_squares = 0,
                // `WT` originally. This is the number of
                w = 0,
                // `IV` originally
                i4 = 0;

            // in several instances, you could say `Math.pow(x, 2)`
            // instead of `x * x`, but this is slower in some browsers
            // introduces an unnecessary concept.
            for (var m = 1; m < l + 1; m++) {

                // `III` originally
                var lower_class_limit = l - m + 1,
                    val = data[lower_class_limit - 1];

                // here we're estimating variance for each potential classing
                // of the data, for each potential number of classes. `w`
                // is the number of data points considered so far.
                w++;

                // increase the current sum and sum-of-squares
                sum += val;
                sum_squares += val * val;

                // the variance at this point in the sequence is the difference
                // between the sum of squares and the total x 2, over the number
                // of samples.
                variance = sum_squares - (sum * sum) / w;

                i4 = lower_class_limit - 1;

                if (i4 !== 0) {
                    for (j = 2; j < n_classes + 1; j++) {
                        // if adding this element to an existing class
                        // will increase its variance beyond the limit, break
                        // the class at this point, setting the `lower_class_limit`
                        // at this point.
                        if (variance_combinations[l][j] >=
                            (variance + variance_combinations[i4][j - 1])) {
                            lower_class_limits[l][j] = lower_class_limit;
                            variance_combinations[l][j] = variance +
                                variance_combinations[i4][j - 1];
                        }
                    }
                }
            }

            lower_class_limits[l][1] = 1;
            variance_combinations[l][1] = variance;
        }

        // return the two matrices. for just providing breaks, only
        // `lower_class_limits` is needed, but variances can be useful to
        // evaluate goodness of fit.
        return {
            lower_class_limits: lower_class_limits,
            variance_combinations: variance_combinations
        };
    }

    // ## Pull Breaks Values for Jenks
    //
    // the second part of the jenks recipe: take the calculated matrices
    // and derive an array of n breaks.
    function jenksBreaks(data, lower_class_limits, n_classes) {

        var k = data.length - 1,
            kclass = [],
            countNum = n_classes;

        // the calculation of classes will never include the upper and
        // lower bounds, so we need to explicitly set them
        kclass[n_classes] = data[data.length - 1];
        kclass[0] = data[0];

        // the lower_class_limits matrix is used as indices into itself
        // here: the `k` variable is reused in each iteration.
        while (countNum > 1) {
            kclass[countNum - 1] = data[lower_class_limits[k][countNum] - 2];
            k = lower_class_limits[k][countNum] - 1;
            countNum--;
        }

        return kclass;
    }

    // # [Jenks natural breaks optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
    //
    // Implementations: [1](http://danieljlewis.org/files/2010/06/Jenks.pdf) (python),
    // [2](https://github.com/vvoovv/djeo-jenks/blob/master/main.js) (buggy),
    // [3](https://github.com/simogeo/geostats/blob/master/lib/geostats.js#L407) (works)
    //
    // Depends on `jenksBreaks()` and `jenksMatrices()`
    function jenks(data, n_classes) {

        if (n_classes > data.length) return null;

        // sort data in numerical order, since this is expected
        // by the matrices function
        data = data.slice().sort(function (a, b) { return a - b; });

        // get our basic matrices
        var matrices = jenksMatrices(data, n_classes),
            // we only need lower class limits here
            lower_class_limits = matrices.lower_class_limits;

        // extract n_classes out of the computed matrices
        return jenksBreaks(data, lower_class_limits, n_classes);

    }

    // # [Skewness](http://en.wikipedia.org/wiki/Skewness)
    //
    // A measure of the extent to which a probability distribution of a
    // real-valued random variable "leans" to one side of the mean.
    // The skewness value can be positive or negative, or even undefined.
    //
    // Implementation is based on the adjusted Fisher-Pearson standardized
    // moment coefficient, which is the version found in Excel and several
    // statistical packages including Minitab, SAS and SPSS.
    //
    // Depends on `sum_nth_power_deviations()` and `sample_standard_deviation`
    function sample_skewness(x) {
        // The skewness of less than three arguments is null
        if (x.length < 3) return null;

        var n = x.length,
            cubed_s = Math.pow(sample_standard_deviation(x), 3),
            sum_cubed_deviations = sum_nth_power_deviations(x, 3);

        return n * sum_cubed_deviations / ((n - 1) * (n - 2) * cubed_s);
    }

    // # Standard Normal Table
    // A standard normal table, also called the unit normal table or Z table,
    // is a mathematical table for the values of Φ (phi), which are the values of
    // the cumulative distribution function of the normal distribution.
    // It is used to find the probability that a statistic is observed below,
    // above, or between values on the standard normal distribution, and by
    // extension, any normal distribution.
    //
    // The probabilities are taken from http://en.wikipedia.org/wiki/Standard_normal_table
    // The table used is the cumulative, and not cumulative from 0 to mean
    // (even though the latter has 5 digits precision, instead of 4).
    var standard_normal_table = [
        /*  z      0.00    0.01    0.02    0.03    0.04    0.05    0.06    0.07    0.08    0.09 */
        /* 0.0 */
        0.5000, 0.5040, 0.5080, 0.5120, 0.5160, 0.5199, 0.5239, 0.5279, 0.5319, 0.5359,
        /* 0.1 */
        0.5398, 0.5438, 0.5478, 0.5517, 0.5557, 0.5596, 0.5636, 0.5675, 0.5714, 0.5753,
        /* 0.2 */
        0.5793, 0.5832, 0.5871, 0.5910, 0.5948, 0.5987, 0.6026, 0.6064, 0.6103, 0.6141,
        /* 0.3 */
        0.6179, 0.6217, 0.6255, 0.6293, 0.6331, 0.6368, 0.6406, 0.6443, 0.6480, 0.6517,
        /* 0.4 */
        0.6554, 0.6591, 0.6628, 0.6664, 0.6700, 0.6736, 0.6772, 0.6808, 0.6844, 0.6879,
        /* 0.5 */
        0.6915, 0.6950, 0.6985, 0.7019, 0.7054, 0.7088, 0.7123, 0.7157, 0.7190, 0.7224,
        /* 0.6 */
        0.7257, 0.7291, 0.7324, 0.7357, 0.7389, 0.7422, 0.7454, 0.7486, 0.7517, 0.7549,
        /* 0.7 */
        0.7580, 0.7611, 0.7642, 0.7673, 0.7704, 0.7734, 0.7764, 0.7794, 0.7823, 0.7852,
        /* 0.8 */
        0.7881, 0.7910, 0.7939, 0.7967, 0.7995, 0.8023, 0.8051, 0.8078, 0.8106, 0.8133,
        /* 0.9 */
        0.8159, 0.8186, 0.8212, 0.8238, 0.8264, 0.8289, 0.8315, 0.8340, 0.8365, 0.8389,
        /* 1.0 */
        0.8413, 0.8438, 0.8461, 0.8485, 0.8508, 0.8531, 0.8554, 0.8577, 0.8599, 0.8621,
        /* 1.1 */
        0.8643, 0.8665, 0.8686, 0.8708, 0.8729, 0.8749, 0.8770, 0.8790, 0.8810, 0.8830,
        /* 1.2 */
        0.8849, 0.8869, 0.8888, 0.8907, 0.8925, 0.8944, 0.8962, 0.8980, 0.8997, 0.9015,
        /* 1.3 */
        0.9032, 0.9049, 0.9066, 0.9082, 0.9099, 0.9115, 0.9131, 0.9147, 0.9162, 0.9177,
        /* 1.4 */
        0.9192, 0.9207, 0.9222, 0.9236, 0.9251, 0.9265, 0.9279, 0.9292, 0.9306, 0.9319,
        /* 1.5 */
        0.9332, 0.9345, 0.9357, 0.9370, 0.9382, 0.9394, 0.9406, 0.9418, 0.9429, 0.9441,
        /* 1.6 */
        0.9452, 0.9463, 0.9474, 0.9484, 0.9495, 0.9505, 0.9515, 0.9525, 0.9535, 0.9545,
        /* 1.7 */
        0.9554, 0.9564, 0.9573, 0.9582, 0.9591, 0.9599, 0.9608, 0.9616, 0.9625, 0.9633,
        /* 1.8 */
        0.9641, 0.9649, 0.9656, 0.9664, 0.9671, 0.9678, 0.9686, 0.9693, 0.9699, 0.9706,
        /* 1.9 */
        0.9713, 0.9719, 0.9726, 0.9732, 0.9738, 0.9744, 0.9750, 0.9756, 0.9761, 0.9767,
        /* 2.0 */
        0.9772, 0.9778, 0.9783, 0.9788, 0.9793, 0.9798, 0.9803, 0.9808, 0.9812, 0.9817,
        /* 2.1 */
        0.9821, 0.9826, 0.9830, 0.9834, 0.9838, 0.9842, 0.9846, 0.9850, 0.9854, 0.9857,
        /* 2.2 */
        0.9861, 0.9864, 0.9868, 0.9871, 0.9875, 0.9878, 0.9881, 0.9884, 0.9887, 0.9890,
        /* 2.3 */
        0.9893, 0.9896, 0.9898, 0.9901, 0.9904, 0.9906, 0.9909, 0.9911, 0.9913, 0.9916,
        /* 2.4 */
        0.9918, 0.9920, 0.9922, 0.9925, 0.9927, 0.9929, 0.9931, 0.9932, 0.9934, 0.9936,
        /* 2.5 */
        0.9938, 0.9940, 0.9941, 0.9943, 0.9945, 0.9946, 0.9948, 0.9949, 0.9951, 0.9952,
        /* 2.6 */
        0.9953, 0.9955, 0.9956, 0.9957, 0.9959, 0.9960, 0.9961, 0.9962, 0.9963, 0.9964,
        /* 2.7 */
        0.9965, 0.9966, 0.9967, 0.9968, 0.9969, 0.9970, 0.9971, 0.9972, 0.9973, 0.9974,
        /* 2.8 */
        0.9974, 0.9975, 0.9976, 0.9977, 0.9977, 0.9978, 0.9979, 0.9979, 0.9980, 0.9981,
        /* 2.9 */
        0.9981, 0.9982, 0.9982, 0.9983, 0.9984, 0.9984, 0.9985, 0.9985, 0.9986, 0.9986,
        /* 3.0 */
        0.9987, 0.9987, 0.9987, 0.9988, 0.9988, 0.9989, 0.9989, 0.9989, 0.9990, 0.9990
    ];

    // # [Cumulative Standard Normal Probability](http://en.wikipedia.org/wiki/Standard_normal_table)
    //
    // Since probability tables cannot be
    // printed for every normal distribution, as there are an infinite variety
    // of normal distributions, it is common practice to convert a normal to a
    // standard normal and then use the standard normal table to find probabilities
    function cumulative_std_normal_probability(z) {

        // Calculate the position of this value.
        var absZ = Math.abs(z),
            // Each row begins with a different
            // significant digit: 0.5, 0.6, 0.7, and so on. So the row is simply
            // this value's significant digit: 0.567 will be in row 0, so row=0,
            // 0.643 will be in row 1, so row=10.
            row = Math.floor(absZ * 10),
            column = 10 * (Math.floor(absZ * 100) / 10 - Math.floor(absZ * 100 / 10)),
            index = Math.min((row * 10) + column, standard_normal_table.length - 1);

        // The index we calculate must be in the table as a positive value,
        // but we still pay attention to whether the input is positive
        // or negative, and flip the output value as a last step.
        if (z >= 0) {
            return standard_normal_table[index];
        } else {
            // due to floating-point arithmetic, values in the table with
            // 4 significant figures can nevertheless end up as repeating
            // fractions when they're computed here.
            return +(1 - standard_normal_table[index]).toFixed(4);
        }
    }

    // # [Z-Score, or Standard Score](http://en.wikipedia.org/wiki/Standard_score)
    //
    // The standard score is the number of standard deviations an observation
    // or datum is above or below the mean. Thus, a positive standard score
    // represents a datum above the mean, while a negative standard score
    // represents a datum below the mean. It is a dimensionless quantity
    // obtained by subtracting the population mean from an individual raw
    // score and then dividing the difference by the population standard
    // deviation.
    //
    // The z-score is only defined if one knows the population parameters;
    // if one only has a sample set, then the analogous computation with
    // sample mean and sample standard deviation yields the
    // Student's t-statistic.
    function z_score(x, mean, standard_deviation) {
        return (x - mean) / standard_deviation;
    }

    // We use `ε`, epsilon, as a stopping criterion when we want to iterate
    // until we're "close enough".
    var epsilon = 0.0001;

    // # [Factorial](https://en.wikipedia.org/wiki/Factorial)
    //
    // A factorial, usually written n!, is the product of all positive
    // integers less than or equal to n. Often factorial is implemented
    // recursively, but this iterative approach is significantly faster
    // and simpler.
    function factorial(n) {

        // factorial is mathematically undefined for negative numbers
        if (n < 0 ) { return null; }

        // typically you'll expand the factorial function going down, like
        // 5! = 5 * 4 * 3 * 2 * 1. This is going in the opposite direction,
        // counting from 2 up to the number in question, and since anything
        // multiplied by 1 is itself, the loop only needs to start at 2.
        var accumulator = 1;
        for (var i = 2; i <= n; i++) {
            // for each number up to and including the number `n`, multiply
            // the accumulator my that number.
            accumulator *= i;
        }
        return accumulator;
    }

    // # Bernoulli Distribution
    //
    // The [Bernoulli distribution](http://en.wikipedia.org/wiki/Bernoulli_distribution)
    // is the probability discrete
    // distribution of a random variable which takes value 1 with success
    // probability `p` and value 0 with failure
    // probability `q` = 1 - `p`. It can be used, for example, to represent the
    // toss of a coin, where "1" is defined to mean "heads" and "0" is defined
    // to mean "tails" (or vice versa). It is
    // a special case of a Binomial Distribution
    // where `n` = 1.
    function bernoulli_distribution(p) {
        // Check that `p` is a valid probability (0 ≤ p ≤ 1)
        if (p < 0 || p > 1 ) { return null; }

        return binomial_distribution(1, p);
    }

    // # Binomial Distribution
    //
    // The [Binomial Distribution](http://en.wikipedia.org/wiki/Binomial_distribution) is the discrete probability
    // distribution of the number of successes in a sequence of n independent yes/no experiments, each of which yields
    // success with probability `probability`. Such a success/failure experiment is also called a Bernoulli experiment or
    // Bernoulli trial; when trials = 1, the Binomial Distribution is a Bernoulli Distribution.
    function binomial_distribution(trials, probability) {
        // Check that `p` is a valid probability (0 ≤ p ≤ 1),
        // that `n` is an integer, strictly positive.
        if (probability < 0 || probability > 1 ||
            trials <= 0 || trials % 1 !== 0) {
            return null;
        }

        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        function probability_mass(x, trials, probability) {
            return factorial(trials) /
                (factorial(x) * factorial(trials - x)) *
                (Math.pow(probability, x) * Math.pow(1 - probability, trials - x));
        }

        // We initialize `x`, the random variable, and `accumulator`, an accumulator
        // for the cumulative distribution function to 0. `distribution_functions`
        // is the object we'll return with the `probability_of_x` and the
        // `cumulative_probability_of_x`, as well as the calculated mean &
        // variance. We iterate until the `cumulative_probability_of_x` is
        // within `epsilon` of 1.0.
        var x = 0,
            cumulative_probability = 0,
            cells = {};

        // This algorithm iterates through each potential outcome,
        // until the `cumulative_probability` is very close to 1, at
        // which point we've defined the vast majority of outcomes
        do {
            cells[x] = probability_mass(x, trials, probability);
            cumulative_probability += cells[x];
            x++;
        // when the cumulative_probability is nearly 1, we've calculated
        // the useful range of this distribution
        } while (cumulative_probability < 1 - epsilon);

        return cells;
    }

    // # Poisson Distribution
    //
    // The [Poisson Distribution](http://en.wikipedia.org/wiki/Poisson_distribution)
    // is a discrete probability distribution that expresses the probability
    // of a given number of events occurring in a fixed interval of time
    // and/or space if these events occur with a known average rate and
    // independently of the time since the last event.
    //
    // The Poisson Distribution is characterized by the strictly positive
    // mean arrival or occurrence rate, `λ`.
    function poisson_distribution(lambda) {
        // Check that lambda is strictly positive
        if (lambda <= 0) { return null; }

        // our current place in the distribution
        var x = 0,
            // and we keep track of the current cumulative probability, in
            // order to know when to stop calculating chances.
            cumulative_probability = 0,
            // the calculated cells to be returned
            cells = {};

        // a [probability mass function](https://en.wikipedia.org/wiki/Probability_mass_function)
        function probability_mass(x, lambda) {
            return (Math.pow(Math.E, -lambda) * Math.pow(lambda, x)) /
                factorial(x);
        }

        // This algorithm iterates through each potential outcome,
        // until the `cumulative_probability` is very close to 1, at
        // which point we've defined the vast majority of outcomes
        do {
            cells[x] = probability_mass(x, lambda);
            cumulative_probability += cells[x];
            x++;
        // when the cumulative_probability is nearly 1, we've calculated
        // the useful range of this distribution
        } while (cumulative_probability < 1 - epsilon);

        return cells;
    }

    // # Percentage Points of the χ2 (Chi-Squared) Distribution
    // The [χ2 (Chi-Squared) Distribution](http://en.wikipedia.org/wiki/Chi-squared_distribution) is used in the common
    // chi-squared tests for goodness of fit of an observed distribution to a theoretical one, the independence of two
    // criteria of classification of qualitative data, and in confidence interval estimation for a population standard
    // deviation of a normal distribution from a sample standard deviation.
    //
    // Values from Appendix 1, Table III of William W. Hines & Douglas C. Montgomery, "Probability and Statistics in
    // Engineering and Management Science", Wiley (1980).
    var chi_squared_distribution_table = {
        1: { 0.995:  0.00, 0.99:  0.00, 0.975:  0.00, 0.95:  0.00, 0.9:  0.02, 0.5:  0.45, 0.1:  2.71, 0.05:  3.84, 0.025:  5.02, 0.01:  6.63, 0.005:  7.88 },
        2: { 0.995:  0.01, 0.99:  0.02, 0.975:  0.05, 0.95:  0.10, 0.9:  0.21, 0.5:  1.39, 0.1:  4.61, 0.05:  5.99, 0.025:  7.38, 0.01:  9.21, 0.005: 10.60 },
        3: { 0.995:  0.07, 0.99:  0.11, 0.975:  0.22, 0.95:  0.35, 0.9:  0.58, 0.5:  2.37, 0.1:  6.25, 0.05:  7.81, 0.025:  9.35, 0.01: 11.34, 0.005: 12.84 },
        4: { 0.995:  0.21, 0.99:  0.30, 0.975:  0.48, 0.95:  0.71, 0.9:  1.06, 0.5:  3.36, 0.1:  7.78, 0.05:  9.49, 0.025: 11.14, 0.01: 13.28, 0.005: 14.86 },
        5: { 0.995:  0.41, 0.99:  0.55, 0.975:  0.83, 0.95:  1.15, 0.9:  1.61, 0.5:  4.35, 0.1:  9.24, 0.05: 11.07, 0.025: 12.83, 0.01: 15.09, 0.005: 16.75 },
        6: { 0.995:  0.68, 0.99:  0.87, 0.975:  1.24, 0.95:  1.64, 0.9:  2.20, 0.5:  5.35, 0.1: 10.65, 0.05: 12.59, 0.025: 14.45, 0.01: 16.81, 0.005: 18.55 },
        7: { 0.995:  0.99, 0.99:  1.25, 0.975:  1.69, 0.95:  2.17, 0.9:  2.83, 0.5:  6.35, 0.1: 12.02, 0.05: 14.07, 0.025: 16.01, 0.01: 18.48, 0.005: 20.28 },
        8: { 0.995:  1.34, 0.99:  1.65, 0.975:  2.18, 0.95:  2.73, 0.9:  3.49, 0.5:  7.34, 0.1: 13.36, 0.05: 15.51, 0.025: 17.53, 0.01: 20.09, 0.005: 21.96 },
        9: { 0.995:  1.73, 0.99:  2.09, 0.975:  2.70, 0.95:  3.33, 0.9:  4.17, 0.5:  8.34, 0.1: 14.68, 0.05: 16.92, 0.025: 19.02, 0.01: 21.67, 0.005: 23.59 },
        10: { 0.995:  2.16, 0.99:  2.56, 0.975:  3.25, 0.95:  3.94, 0.9:  4.87, 0.5:  9.34, 0.1: 15.99, 0.05: 18.31, 0.025: 20.48, 0.01: 23.21, 0.005: 25.19 },
        11: { 0.995:  2.60, 0.99:  3.05, 0.975:  3.82, 0.95:  4.57, 0.9:  5.58, 0.5: 10.34, 0.1: 17.28, 0.05: 19.68, 0.025: 21.92, 0.01: 24.72, 0.005: 26.76 },
        12: { 0.995:  3.07, 0.99:  3.57, 0.975:  4.40, 0.95:  5.23, 0.9:  6.30, 0.5: 11.34, 0.1: 18.55, 0.05: 21.03, 0.025: 23.34, 0.01: 26.22, 0.005: 28.30 },
        13: { 0.995:  3.57, 0.99:  4.11, 0.975:  5.01, 0.95:  5.89, 0.9:  7.04, 0.5: 12.34, 0.1: 19.81, 0.05: 22.36, 0.025: 24.74, 0.01: 27.69, 0.005: 29.82 },
        14: { 0.995:  4.07, 0.99:  4.66, 0.975:  5.63, 0.95:  6.57, 0.9:  7.79, 0.5: 13.34, 0.1: 21.06, 0.05: 23.68, 0.025: 26.12, 0.01: 29.14, 0.005: 31.32 },
        15: { 0.995:  4.60, 0.99:  5.23, 0.975:  6.27, 0.95:  7.26, 0.9:  8.55, 0.5: 14.34, 0.1: 22.31, 0.05: 25.00, 0.025: 27.49, 0.01: 30.58, 0.005: 32.80 },
        16: { 0.995:  5.14, 0.99:  5.81, 0.975:  6.91, 0.95:  7.96, 0.9:  9.31, 0.5: 15.34, 0.1: 23.54, 0.05: 26.30, 0.025: 28.85, 0.01: 32.00, 0.005: 34.27 },
        17: { 0.995:  5.70, 0.99:  6.41, 0.975:  7.56, 0.95:  8.67, 0.9: 10.09, 0.5: 16.34, 0.1: 24.77, 0.05: 27.59, 0.025: 30.19, 0.01: 33.41, 0.005: 35.72 },
        18: { 0.995:  6.26, 0.99:  7.01, 0.975:  8.23, 0.95:  9.39, 0.9: 10.87, 0.5: 17.34, 0.1: 25.99, 0.05: 28.87, 0.025: 31.53, 0.01: 34.81, 0.005: 37.16 },
        19: { 0.995:  6.84, 0.99:  7.63, 0.975:  8.91, 0.95: 10.12, 0.9: 11.65, 0.5: 18.34, 0.1: 27.20, 0.05: 30.14, 0.025: 32.85, 0.01: 36.19, 0.005: 38.58 },
        20: { 0.995:  7.43, 0.99:  8.26, 0.975:  9.59, 0.95: 10.85, 0.9: 12.44, 0.5: 19.34, 0.1: 28.41, 0.05: 31.41, 0.025: 34.17, 0.01: 37.57, 0.005: 40.00 },
        21: { 0.995:  8.03, 0.99:  8.90, 0.975: 10.28, 0.95: 11.59, 0.9: 13.24, 0.5: 20.34, 0.1: 29.62, 0.05: 32.67, 0.025: 35.48, 0.01: 38.93, 0.005: 41.40 },
        22: { 0.995:  8.64, 0.99:  9.54, 0.975: 10.98, 0.95: 12.34, 0.9: 14.04, 0.5: 21.34, 0.1: 30.81, 0.05: 33.92, 0.025: 36.78, 0.01: 40.29, 0.005: 42.80 },
        23: { 0.995:  9.26, 0.99: 10.20, 0.975: 11.69, 0.95: 13.09, 0.9: 14.85, 0.5: 22.34, 0.1: 32.01, 0.05: 35.17, 0.025: 38.08, 0.01: 41.64, 0.005: 44.18 },
        24: { 0.995:  9.89, 0.99: 10.86, 0.975: 12.40, 0.95: 13.85, 0.9: 15.66, 0.5: 23.34, 0.1: 33.20, 0.05: 36.42, 0.025: 39.36, 0.01: 42.98, 0.005: 45.56 },
        25: { 0.995: 10.52, 0.99: 11.52, 0.975: 13.12, 0.95: 14.61, 0.9: 16.47, 0.5: 24.34, 0.1: 34.28, 0.05: 37.65, 0.025: 40.65, 0.01: 44.31, 0.005: 46.93 },
        26: { 0.995: 11.16, 0.99: 12.20, 0.975: 13.84, 0.95: 15.38, 0.9: 17.29, 0.5: 25.34, 0.1: 35.56, 0.05: 38.89, 0.025: 41.92, 0.01: 45.64, 0.005: 48.29 },
        27: { 0.995: 11.81, 0.99: 12.88, 0.975: 14.57, 0.95: 16.15, 0.9: 18.11, 0.5: 26.34, 0.1: 36.74, 0.05: 40.11, 0.025: 43.19, 0.01: 46.96, 0.005: 49.65 },
        28: { 0.995: 12.46, 0.99: 13.57, 0.975: 15.31, 0.95: 16.93, 0.9: 18.94, 0.5: 27.34, 0.1: 37.92, 0.05: 41.34, 0.025: 44.46, 0.01: 48.28, 0.005: 50.99 },
        29: { 0.995: 13.12, 0.99: 14.26, 0.975: 16.05, 0.95: 17.71, 0.9: 19.77, 0.5: 28.34, 0.1: 39.09, 0.05: 42.56, 0.025: 45.72, 0.01: 49.59, 0.005: 52.34 },
        30: { 0.995: 13.79, 0.99: 14.95, 0.975: 16.79, 0.95: 18.49, 0.9: 20.60, 0.5: 29.34, 0.1: 40.26, 0.05: 43.77, 0.025: 46.98, 0.01: 50.89, 0.005: 53.67 },
        40: { 0.995: 20.71, 0.99: 22.16, 0.975: 24.43, 0.95: 26.51, 0.9: 29.05, 0.5: 39.34, 0.1: 51.81, 0.05: 55.76, 0.025: 59.34, 0.01: 63.69, 0.005: 66.77 },
        50: { 0.995: 27.99, 0.99: 29.71, 0.975: 32.36, 0.95: 34.76, 0.9: 37.69, 0.5: 49.33, 0.1: 63.17, 0.05: 67.50, 0.025: 71.42, 0.01: 76.15, 0.005: 79.49 },
        60: { 0.995: 35.53, 0.99: 37.48, 0.975: 40.48, 0.95: 43.19, 0.9: 46.46, 0.5: 59.33, 0.1: 74.40, 0.05: 79.08, 0.025: 83.30, 0.01: 88.38, 0.005: 91.95 },
        70: { 0.995: 43.28, 0.99: 45.44, 0.975: 48.76, 0.95: 51.74, 0.9: 55.33, 0.5: 69.33, 0.1: 85.53, 0.05: 90.53, 0.025: 95.02, 0.01: 100.42, 0.005: 104.22 },
        80: { 0.995: 51.17, 0.99: 53.54, 0.975: 57.15, 0.95: 60.39, 0.9: 64.28, 0.5: 79.33, 0.1: 96.58, 0.05: 101.88, 0.025: 106.63, 0.01: 112.33, 0.005: 116.32 },
        90: { 0.995: 59.20, 0.99: 61.75, 0.975: 65.65, 0.95: 69.13, 0.9: 73.29, 0.5: 89.33, 0.1: 107.57, 0.05: 113.14, 0.025: 118.14, 0.01: 124.12, 0.005: 128.30 },
        100: { 0.995: 67.33, 0.99: 70.06, 0.975: 74.22, 0.95: 77.93, 0.9: 82.36, 0.5: 99.33, 0.1: 118.50, 0.05: 124.34, 0.025: 129.56, 0.01: 135.81, 0.005: 140.17 }
    };

    // # χ2 (Chi-Squared) Goodness-of-Fit Test
    //
    // The [χ2 (Chi-Squared) Goodness-of-Fit Test](http://en.wikipedia.org/wiki/Goodness_of_fit#Pearson.27s_chi-squared_test)
    // uses a measure of goodness of fit which is the sum of differences between observed and expected outcome frequencies
    // (that is, counts of observations), each squared and divided by the number of observations expected given the
    // hypothesized distribution. The resulting χ2 statistic, `chi_squared`, can be compared to the chi-squared distribution
    // to determine the goodness of fit. In order to determine the degrees of freedom of the chi-squared distribution, one
    // takes the total number of observed frequencies and subtracts the number of estimated parameters. The test statistic
    // follows, approximately, a chi-square distribution with (k − c) degrees of freedom where `k` is the number of non-empty
    // cells and `c` is the number of estimated parameters for the distribution.
    function chi_squared_goodness_of_fit(data, distribution_type, significance) {
        // Estimate from the sample data, a weighted mean.
        var input_mean = mean(data),
            // Calculated value of the χ2 statistic.
            chi_squared = 0,
            // Degrees of freedom, calculated as (number of class intervals -
            // number of hypothesized distribution parameters estimated - 1)
            degrees_of_freedom,
            // Number of hypothesized distribution parameters estimated, expected to be supplied in the distribution test.
            // Lose one degree of freedom for estimating `lambda` from the sample data.
            c = 1,
            // The hypothesized distribution.
            // Generate the hypothesized distribution.
            hypothesized_distribution = distribution_type(input_mean),
            observed_frequencies = [],
            expected_frequencies = [],
            k;

        // Create an array holding a histogram from the sample data, of
        // the form `{ value: numberOfOcurrences }`
        for (var i = 0; i < data.length; i++) {
            if (observed_frequencies[data[i]] === undefined) {
                observed_frequencies[data[i]] = 0;
            }
            observed_frequencies[data[i]]++;
        }

        // The histogram we created might be sparse - there might be gaps
        // between values. So we iterate through the histogram, making
        // sure that instead of undefined, gaps have 0 values.
        for (i = 0; i < observed_frequencies.length; i++) {
            if (observed_frequencies[i] === undefined) {
                observed_frequencies[i] = 0;
            }
        }

        // Create an array holding a histogram of expected data given the
        // sample size and hypothesized distribution.
        for (k in hypothesized_distribution) {
            if (k in observed_frequencies) {
                expected_frequencies[k] = hypothesized_distribution[k] * data.length;
            }
        }

        // Working backward through the expected frequencies, collapse classes
        // if less than three observations are expected for a class.
        // This transformation is applied to the observed frequencies as well.
        for (k = expected_frequencies.length - 1; k >= 0; k--) {
            if (expected_frequencies[k] < 3) {
                expected_frequencies[k - 1] += expected_frequencies[k];
                expected_frequencies.pop();

                observed_frequencies[k - 1] += observed_frequencies[k];
                observed_frequencies.pop();
            }
        }

        // Iterate through the squared differences between observed & expected
        // frequencies, accumulating the `chi_squared` statistic.
        for (k = 0; k < observed_frequencies.length; k++) {
            chi_squared += Math.pow(
                observed_frequencies[k] - expected_frequencies[k], 2) /
                expected_frequencies[k];
        }

        // Calculate degrees of freedom for this test and look it up in the
        // `chi_squared_distribution_table` in order to
        // accept or reject the goodness-of-fit of the hypothesized distribution.
        degrees_of_freedom = observed_frequencies.length - c - 1;
        return chi_squared_distribution_table[degrees_of_freedom][significance] < chi_squared;
    }

    // # Mixin
    //
    // Mixin simple_statistics to a single Array instance if provided
    // or the Array native object if not. This is an optional
    // feature that lets you treat simple_statistics as a native feature
    // of Javascript.
    function mixin(array) {
        var support = !!(Object.defineProperty && Object.defineProperties);
        if (!support) throw new Error('without defineProperty, simple-statistics cannot be mixed in');

        // only methods which work on basic arrays in a single step
        // are supported
        var arrayMethods = ['median', 'standard_deviation', 'sum',
            'sample_skewness',
            'mean', 'min', 'max', 'quantile', 'geometric_mean',
            'harmonic_mean'];

        // create a closure with a method name so that a reference
        // like `arrayMethods[i]` doesn't follow the loop increment
        function wrap(method) {
            return function() {
                // cast any arguments into an array, since they're
                // natively objects
                var args = Array.prototype.slice.apply(arguments);
                // make the first argument the array itself
                args.unshift(this);
                // return the result of the ss method
                return ss[method].apply(ss, args);
            };
        }

        // select object to extend
        var extending;
        if (array) {
            // create a shallow copy of the array so that our internal
            // operations do not change it by reference
            extending = array.slice();
        } else {
            extending = Array.prototype;
        }

        // for each array function, define a function that gets
        // the array as the first argument.
        // We use [defineProperty](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/defineProperty)
        // because it allows these properties to be non-enumerable:
        // `for (var in x)` loops will not run into problems with this
        // implementation.
        for (var i = 0; i < arrayMethods.length; i++) {
            Object.defineProperty(extending, arrayMethods[i], {
                value: wrap(arrayMethods[i]),
                configurable: true,
                enumerable: false,
                writable: true
            });
        }

        return extending;
    }

    ss.linear_regression = linear_regression;
    ss.standard_deviation = standard_deviation;
    ss.r_squared = r_squared;
    ss.median = median;
    ss.mean = mean;
    ss.mode = mode;
    ss.min = min;
    ss.max = max;
    ss.sum = sum;
    ss.quantile = quantile;
    ss.quantile_sorted = quantile_sorted;
    ss.iqr = iqr;
    ss.mad = mad;

    ss.chunk = chunk;
    ss.shuffle = shuffle;
    ss.shuffle_in_place = shuffle_in_place;

    ss.sample = sample;

    ss.sample_covariance = sample_covariance;
    ss.sample_correlation = sample_correlation;
    ss.sample_variance = sample_variance;
    ss.sample_standard_deviation = sample_standard_deviation;
    ss.sample_skewness = sample_skewness;

    ss.geometric_mean = geometric_mean;
    ss.harmonic_mean = harmonic_mean;
    ss.variance = variance;
    ss.t_test = t_test;
    ss.t_test_two_sample = t_test_two_sample;

    // jenks
    ss.jenksMatrices = jenksMatrices;
    ss.jenksBreaks = jenksBreaks;
    ss.jenks = jenks;

    ss.bayesian = bayesian;

    // Distribution-related methods
    ss.epsilon = epsilon; // We make ε available to the test suite.
    ss.factorial = factorial;
    ss.bernoulli_distribution = bernoulli_distribution;
    ss.binomial_distribution = binomial_distribution;
    ss.poisson_distribution = poisson_distribution;
    ss.chi_squared_goodness_of_fit = chi_squared_goodness_of_fit;

    // Normal distribution
    ss.z_score = z_score;
    ss.cumulative_std_normal_probability = cumulative_std_normal_probability;
    ss.standard_normal_table = standard_normal_table;

    // Alias this into its common name
    ss.average = mean;
    ss.interquartile_range = iqr;
    ss.mixin = mixin;
    ss.median_absolute_deviation = mad;

})(this);

},{}],53:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

module.exports = function(point1, point2, units){
  var coordinates1 = point1.geometry.coordinates;
  var coordinates2 = point2.geometry.coordinates;

  var dLat = toRad(coordinates2[1] - coordinates1[1]);
  var dLon = toRad(coordinates2[0] - coordinates1[0]);
  var lat1 = toRad(coordinates1[1]);
  var lat2 = toRad(coordinates2[1]);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var R = 0;
  switch(units){
    case 'miles':
      R = 3960;
      break
    case 'kilometers':
      R = 6373;
      break
    case 'degrees':
      R = 57.2957795;
      break
    case 'radians':
      R = 1;
      break
  }
  var distance = R * c;
  return distance;
}

function toRad(degree){
  return degree * Math.PI / 180;
}

},{}],54:[function(require,module,exports){
var extent = require('turf-extent');
var bboxPolygon = require('turf-bbox-polygon');

module.exports = function(features, done){
  var bbox = extent(features);
  var poly = bboxPolygon(bbox);
  return poly;
}
},{"turf-bbox-polygon":55,"turf-extent":57}],55:[function(require,module,exports){
var polygon = require('turf-polygon')

module.exports = function(bbox){
  var lowLeft = [bbox[0], bbox[1]]
  var topLeft = [bbox[0], bbox[3]]
  var topRight = [bbox[2], bbox[3]]
  var lowRight = [bbox[2], bbox[1]]

  var poly = polygon([[
    lowLeft,
    lowRight,
    topRight,
    topLeft,
    lowLeft
  ]])
  return poly
}

},{"turf-polygon":56}],56:[function(require,module,exports){
module.exports=require(34)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-bbox-polygon/node_modules/turf-polygon/index.js":34}],57:[function(require,module,exports){
var flatten = require('flatten')

module.exports = function(layer){
  var xmin = Infinity,
      ymin = Infinity,
      xmax = -Infinity,
      ymax = -Infinity
  if(layer.type === 'FeatureCollection'){
    for(var i in layer.features){
      var coordinates 
      switch(layer.features[i].geometry.type){
        case 'Point':
          coordinates = [layer.features[i].geometry.coordinates]
          break
        case 'LineString':
          coordinates = layer.features[i].geometry.coordinates
          break
        case 'Polygon':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = flatCoords(coordinates)
          break
        case 'MultiPoint':
          coordinates = layer.features[i].geometry.coordinates
          break
        case 'MultiLineString':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = flatCoords(coordinates)
          break
        case 'MultiPolygon':
          coordinates = layer.features[i].geometry.coordinates
          coordinates = flatCoords(coordinates)
          break
      }
      if(!layer.features[i].geometry && layer.features[i].properties){
        return new Error('Unknown Geometry Type')
      }
      
      for(var n in coordinates){
        if(xmin > coordinates[n][0]){
          xmin = coordinates[n][0]
        }
        if(ymin > coordinates[n][1]){
          ymin = coordinates[n][1]
        }
        if(xmax < coordinates[n][0]){
          xmax = coordinates[n][0]
        }
        if(ymax < coordinates[n][1]){
          ymax = coordinates[n][1]
        }
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    return bbox
  }
  else{
    var coordinates 
    var geometry
    if(layer.type === 'Feature'){
      geometry = layer.geometry
    }
    else{
      geometry = layer
    }
    switch(geometry.type){
      case 'Point':
        coordinates = [geometry.coordinates]
        break
      case 'LineString':
        coordinates = geometry.coordinates
        break
      case 'Polygon':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
      case 'MultiPoint':
        coordinates = geometry.coordinates
        break
      case 'MultiLineString':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
      case 'MultiPolygon':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
    }
    if(!geometry){
      return new Error('No Geometry Found')
    }
    
    for(var n in coordinates){
      if(xmin > coordinates[n][0]){
        xmin = coordinates[n][0]
      }
      if(ymin > coordinates[n][1]){
        ymin = coordinates[n][1]
      }
      if(xmax < coordinates[n][0]){
        xmax = coordinates[n][0]
      }
      if(ymax < coordinates[n][1]){
        ymax = coordinates[n][1]
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    return bbox
  }
}

function flatCoords(coords){
  var newCoords = []
  coords = flatten(coords)
  coords.forEach(function(c, i){
    if(i % 2 == 0) // if is even
    newCoords.push([c, coords[i+1]])
  })
  return newCoords
}
},{"flatten":58}],58:[function(require,module,exports){
module.exports = function flatten(list, depth) {
  depth = (typeof depth == 'number') ? depth : Infinity;

  return _flatten(list, 1);

  function _flatten(list, d) {
    return list.reduce(function (acc, item) {
      if (Array.isArray(item) && d < depth) {
        return acc.concat(_flatten(item, d + 1));
      }
      else {
        return acc.concat(item);
      }
    }, []);
  }
};

},{}],59:[function(require,module,exports){
// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html
var jsts = require('jsts');

module.exports = function(poly1, poly2, done){
  if(poly1.type !== 'Feature') {
    poly1 = {
      type: 'Feature',
      properties: {},
      geometry: poly1
    }
  }
  if(poly2.type !== 'Feature') {
    poly2 = {
      type: 'Feature',
      properties: {},
      geometry: poly2
    }
  }
  var reader = new jsts.io.GeoJSONReader();
  var a = reader.read(JSON.stringify(poly1.geometry));
  var b = reader.read(JSON.stringify(poly2.geometry));
  var erased = a.difference(b);
  var parser = new jsts.io.GeoJSONParser();
  erased = parser.write(erased);

  poly1.geometry = erased;
  if(poly1.geometry.type === 'GeometryCollection' && poly1.geometry.geometries.length === 0) {
    return;
  } else {
    return {
      type: 'Feature',
      properties: poly1.properties,
      geometry: erased
    };
  }
}
},{"jsts":60}],60:[function(require,module,exports){
module.exports=require(39)
},{"./lib/jsts":61,"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/index.js":39,"javascript.util":63}],61:[function(require,module,exports){
module.exports=require(40)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/lib/jsts.js":40}],62:[function(require,module,exports){
module.exports=require(41)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/node_modules/javascript.util/dist/javascript.util-node.min.js":41}],63:[function(require,module,exports){
module.exports=require(42)
},{"./dist/javascript.util-node.min.js":62,"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/node_modules/javascript.util/index.js":42}],64:[function(require,module,exports){
var flatten = require('flatten');
var featureCollection = require('turf-featurecollection');
var point = require('turf-point');

module.exports = function(fc){
  if(fc.type === 'FeatureCollection'){
    for(var i in fc.features){
      var coordinates ;
      switch(fc.features[i].geometry.type){
        case 'Point':
          coordinates = [fc.features[i].geometry.coordinates];
          break
        case 'LineString':
          coordinates = fc.features[i].geometry.coordinates;
          break
        case 'Polygon':
          coordinates = fc.features[i].geometry.coordinates;
          coordinates = flatCoords(coordinates);
          break
        case 'MultiPoint':
          coordinates = fc.features[i].geometry.coordinates;
          break
        case 'MultiLineString':
          coordinates = fc.features[i].geometry.coordinates;
          coordinates = flatCoords(coordinates);
          break
        case 'MultiPolygon':
          coordinates = fc.features[i].geometry.coordinates;
          coordinates = flatCoords(coordinates);
          break
      }
      if(!fc.features[i].geometry && fc.features[i].properties){
        return new Error('Unknown Geometry Type');
      }
    }
      
    var exploded = featureCollection([]);

    coordinates.forEach(function(coords){
      exploded.features.push(point(coords[0], coords[1]));
    })

    return exploded;
  }
  else{
    var coordinates ;
    var geometry;
    if(fc.type === 'Feature'){
      geometry = fc.geometry;
    }
    else{
      geometry = fc;
    }
    switch(geometry.type){
      case 'Point':
        coordinates = [geometry.coordinates];
        break
      case 'LineString':
        coordinates = geometry.coordinates;
        break
      case 'Polygon':
        coordinates = geometry.coordinates;
        coordinates = flatCoords(coordinates);
        break
      case 'MultiPoint':
        coordinates = geometry.coordinates;
        break
      case 'MultiLineString':
        coordinates = geometry.coordinates;
        coordinates = flatCoords(coordinates);
        break
      case 'MultiPolygon':
        coordinates = geometry.coordinates;
        coordinates = flatCoords(coordinates);
        break
    }
    if(!geometry){
      return new Error('No Geometry Found');
    }

    var exploded = featureCollection([]);

    coordinates.forEach(function(coords){
      exploded.features.push(point(coords[0], coords[1]));
    })

    return exploded;
  }
}

function flatCoords(coords){
  var newCoords = [];
  coords = flatten(coords);
  coords.forEach(function(c, i){
    if(i % 2 == 0) // if is even
      newCoords.push([c, coords[i+1]]);
  })
  return newCoords;
}
},{"flatten":65,"turf-featurecollection":66,"turf-point":67}],65:[function(require,module,exports){
module.exports=require(58)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-envelope/node_modules/turf-extent/node_modules/flatten/index.js":58}],66:[function(require,module,exports){
module.exports = function(features){
  var fc = {
    "type": "FeatureCollection",
    "features": features
  }

  return fc
}
},{}],67:[function(require,module,exports){
module.exports = function(x, y, properties){
  if(isNaN(x) || isNaN(y)) throw new Error('Invalid coordinates')
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [x, y]
    },
    properties: properties || {}
  }
}

},{}],68:[function(require,module,exports){
var flatten = require('flatten');

module.exports = function(layer){
  var xmin = Infinity,
      ymin = Infinity,
      xmax = -Infinity,
      ymax = -Infinity;
  if(layer.type === 'FeatureCollection'){
    for(var i in layer.features){
      var coordinates;
      switch(layer.features[i].geometry.type){
        case 'Point':
          coordinates = [layer.features[i].geometry.coordinates];
          break
        case 'LineString':
          coordinates = layer.features[i].geometry.coordinates;
          break
        case 'Polygon':
          coordinates = layer.features[i].geometry.coordinates;
          coordinates = flatCoords(coordinates);
          break
        case 'MultiPoint':
          coordinates = layer.features[i].geometry.coordinates;
          break
        case 'MultiLineString':
          coordinates = layer.features[i].geometry.coordinates;
          coordinates = flatCoords(coordinates);
          break
        case 'MultiPolygon':
          coordinates = layer.features[i].geometry.coordinates;
          coordinates = flatCoords(coordinates);
          break
      }
      if(!layer.features[i].geometry && layer.features[i].properties){
        return new Error('Unknown Geometry Type');
      }
      
      for(var n in coordinates){
        if(xmin > coordinates[n][0]){
          xmin = coordinates[n][0];
        }
        if(ymin > coordinates[n][1]){
          ymin = coordinates[n][1];
        }
        if(xmax < coordinates[n][0]){
          xmax = coordinates[n][0];
        }
        if(ymax < coordinates[n][1]){
          ymax = coordinates[n][1];
        }
      }
    }
    var bbox = [xmin, ymin, xmax, ymax]
    return bbox
  }
  else{
    var coordinates 
    var geometry
    if(layer.type === 'Feature'){
      geometry = layer.geometry
    }
    else{
      geometry = layer
    }
    switch(geometry.type){
      case 'Point':
        coordinates = [geometry.coordinates]
        break
      case 'LineString':
        coordinates = geometry.coordinates
        break
      case 'Polygon':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
      case 'MultiPoint':
        coordinates = geometry.coordinates
        break
      case 'MultiLineString':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
      case 'MultiPolygon':
        coordinates = geometry.coordinates
        coordinates = flatCoords(coordinates)
        break
    }
    if(!geometry){
      return new Error('No Geometry Found');
    }
    
    for(var n in coordinates){
      if(xmin > coordinates[n][0]){
        xmin = coordinates[n][0];
      }
      if(ymin > coordinates[n][1]){
        ymin = coordinates[n][1];
      }
      if(xmax < coordinates[n][0]){
        xmax = coordinates[n][0];
      }
      if(ymax < coordinates[n][1]){
        ymax = coordinates[n][1];
      }
    }
    var bbox = [xmin, ymin, xmax, ymax];
    return bbox;
  }
}

function flatCoords(coords){
  var newCoords = [];
  coords = flatten(coords);
  coords.forEach(function(c, i){
    if(i % 2 == 0) // if is even
      newCoords.push([c, coords[i+1]]);
  })
  return newCoords;
}
},{"flatten":69}],69:[function(require,module,exports){
module.exports=require(58)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-envelope/node_modules/turf-extent/node_modules/flatten/index.js":58}],70:[function(require,module,exports){
module.exports = function(features){
  var fc = {
    "type": "FeatureCollection",
    "features": features
  };

  return fc;
}
},{}],71:[function(require,module,exports){
var featureCollection = require('turf-featurecollection');

module.exports = function(collection, key, val) {
  var newFC = featureCollection([]);
  for(var i = 0; i < collection.features.length; i++) {
    if(collection.features[i].properties[key] === val) {
      newFC.features.push(collection.features[i]);
    }
  }
  return newFC;
}
},{"turf-featurecollection":70}],72:[function(require,module,exports){
module.exports = function(fc) {
  if(fc.type === 'Feature'){
    switch(fc.geometry.type){
      case 'Point':
        fc.geometry.coordinates = flipCoordinate(fc.geometry.coordinates);
        return fc;
        break;
      case 'LineString':
        fc.geometry.coordinates.forEach(function(coordinates, i){
          coordinates = flipCoordinate(coordinates);
          fc.geometry.coordinates[i] = coordinates;
        });
        return fc;
        break;
      case 'Polygon':
        fc.geometry.coordinates.forEach(function(ring, i){
          ring.forEach(function(coordinates, k){
            coordinates = flipCoordinate(coordinates);
            fc.geometry.coordinates[i][k] = coordinates;
          });
        });
        return fc;
        break;
    }
  }
  else if(fc.type === 'FeatureCollection'){
    fc.features.forEach(function(feature){
      switch(feature.geometry.type){
        case 'Point':
          feature.geometry.coordinates = flipCoordinate(feature.geometry.coordinates);
          break;
        case 'LineString':
          feature.geometry.coordinates.forEach(function(coordinates, i){
            coordinates = flipCoordinate(coordinates);
            feature.geometry.coordinates[i] = coordinates;
          });
          break;
        case 'Polygon':
          feature.geometry.coordinates.forEach(function(ring, i){
            ring.forEach(function(coordinates, k){
              coordinates = flipCoordinate(coordinates);
              feature.geometry.coordinates[i][k] = coordinates;
            });
          });
          break;
      }
    });
    return fc;
  }
  else {
    var err = new Error('Unknown geometry type');
    return err;
  }
}

function flipCoordinate (coordinates) {
  return([coordinates[1], coordinates[0]]);
}

},{}],73:[function(require,module,exports){
var point = require('turf-point');

module.exports = function(extents, depth) {
  var xmin = extents[0];
  var ymin = extents[1];
  var xmax = extents[2];
  var ymax = extents[3];
  var interval = (xmax - xmin) / depth;
  var coords = [];
  var fc = {
    type: 'FeatureCollection',
    features: []
  };

  for (var x=0; x<=depth; x++){
    for (var y=0;y<=depth; y++){
      fc.features.push(point((x * interval) + xmin, (y * interval) + ymin));
    }
  }
  return fc;
}

},{"turf-point":117}],74:[function(require,module,exports){
var polygon = require('turf-polygon');

module.exports = hexgrid;

//Precompute cosines and sines of angles used in hexagon creation
// for performance gain
var cosines = [];
var sines = [];
for (var i = 0; i < 6; i++) {
  var angle = 2 * Math.PI/6 * i;
  cosines.push(Math.cos(angle));
  sines.push(Math.sin(angle));
}

//Center should be [x, y]
function hexagon(center, radius) {
  var vertices = [];

  for (var i = 0; i < 6; i++) {
    var x = center[0] + radius * cosines[i];
    var y = center[1] + radius * sines[i];

    vertices.push([x,y]);
  }

  //first and last vertex must be the same
  vertices.push(vertices[0]);

  return polygon([vertices]);
}

// Creates a FeatureCollection of flat-topped
// hexagons aligned in an "odd-q" vertical grid as
// described on http://www.redblobgames.com/grids/hexagons/
//
// bbox: [xmin, ymin, xmax, ymax]
// radius: distance from hex center to vertex (in degrees)
// done: node-style callback (optional)
//
// Returns a GeoJSON FeatureCollection of tessellated hexagons
// that cover the given bbox
function hexgrid(bbox, radius, done) {
  var xmin = bbox[0];
  var ymin = bbox[1];
  var xmax = bbox[2];
  var ymax = bbox[3];

  var fc = {
    type: 'FeatureCollection',
    features: []
  };

  var hex_width = radius * 2;
  var hex_height = Math.sqrt(3)/2 * hex_width;
  
  var box_width = xmax - xmin;
  var box_height = ymax - ymin;

  var x_interval = 3/4 * hex_width;
  var y_interval = hex_height;

  var x_span = box_width / (hex_width - radius/2);
  var x_count = Math.ceil(x_span);
  if (Math.round(x_span) === x_count) {
    x_count++;
  }
  
  var x_adjust = ((x_count * x_interval - radius/2) - box_width)/2 - radius/2;

  var y_count = Math.ceil(box_height / hex_height);

  var y_adjust = (box_height - y_count * hex_height)/2;

  var hasOffsetY = y_count * hex_height - box_height > hex_height/2;
  if (hasOffsetY) {
    y_adjust -= hex_height/4;
  }
  
  for (var x = 0; x < x_count; x++) {
    for (var y = 0; y <= y_count; y++) {
    
      var isOdd = x % 2 === 1;
      if (y === 0 && isOdd) {
        continue;
      }

      if (y === 0 && hasOffsetY) {
        continue;
      }

      var center_x = x * x_interval + xmin - x_adjust;
      var center_y = y * y_interval + ymin + y_adjust;
      
      if (isOdd) {
        center_y -= hex_height/2;
      }

      fc.features.push(hexagon([center_x, center_y], radius));
    }
  }

  done = done || function () {};
  done(null, fc);

  return fc;
}

},{"turf-polygon":75}],75:[function(require,module,exports){
module.exports=require(34)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-bbox-polygon/node_modules/turf-polygon/index.js":34}],76:[function(require,module,exports){
// http://en.wikipedia.org/wiki/Even%E2%80%93odd_rule
// modified from: https://github.com/substack/point-in-polygon/blob/master/index.js
// which was modified from http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

module.exports = function(point, polygon) {
  var polys = polygon.geometry.coordinates;
  var pt = [point.geometry.coordinates[0], point.geometry.coordinates[1]];
  // normalize to multipolygon
  if(polygon.geometry.type === 'Polygon') polys = [polys];

  var insidePoly = false;
  var i = 0;
  while (i < polys.length && !insidePoly) {
    // check if it is in the outer ring first
    if(inRing(pt, polys[i][0])) {
      var inHole = false;
      var k = 1;
      // check for the point in any of the holes
      while(k < polys[i].length && !inHole) {
        if(inRing(pt, polys[i][k])) {
          inHole = true;
        }
        k++;
      }
      if(!inHole) insidePoly = true;
    }
    i++;
  }
  return insidePoly;
}

// pt is [x,y] and ring is [[x,y], [x,y],..]
function inRing (pt, ring) {
  var isInside = false;
  for (var i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    var xi = ring[i][0], yi = ring[i][1];
    var xj = ring[j][0], yj = ring[j][1];
    
    var intersect = ((yi > pt[1]) != (yj > pt[1]))
        && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
    if (intersect) isInside = !isInside;
  }
  return isInside;
}


},{}],77:[function(require,module,exports){
// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html
var jsts = require('jsts');
var featurecollection = require('turf-featurecollection');

module.exports = function(poly1, poly2){
  if(poly1.type !== 'Feature') {
  	poly1 = {
  		type: 'Feature',
  		geometry: poly1
  	};
  }
  if(poly2.type !== 'Feature') {
  	poly2 = {
  		type: 'Feature',
  		geometry: poly2
  	};
  }

  var reader = new jsts.io.GeoJSONReader(),
    a = reader.read(JSON.stringify(poly1.geometry)),
    b = reader.read(JSON.stringify(poly2.geometry)),
    intersection = a.intersection(b),
    parser = new jsts.io.GeoJSONParser();

  intersection = parser.write(intersection);
  if(intersection.type === 'GeometryCollection' && intersection.geometries.length === 0) {
    return;
  } else {
    return {
      type: 'Feature',
      properties: {},
      geometry: intersection
    };
  }
}
},{"jsts":78,"turf-featurecollection":70}],78:[function(require,module,exports){
module.exports=require(39)
},{"./lib/jsts":79,"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/index.js":39,"javascript.util":81}],79:[function(require,module,exports){
module.exports=require(40)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/lib/jsts.js":40}],80:[function(require,module,exports){
module.exports=require(41)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/node_modules/javascript.util/dist/javascript.util-node.min.js":41}],81:[function(require,module,exports){
module.exports=require(42)
},{"./dist/javascript.util-node.min.js":80,"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/node_modules/javascript.util/index.js":42}],82:[function(require,module,exports){
module.exports = function(ring){
  var sum = 0;
  var i = 1;
  var len = ring.length;
  var prev,cur;
  while(i<len){
    prev = cur||ring[0];
    cur = ring[i];
    sum += ((cur[0]-prev[0])*(cur[1]+prev[1]));
    i++;
  }
  return sum > 0;
}
},{}],83:[function(require,module,exports){
//https://github.com/jasondavies/conrec.js
//http://stackoverflow.com/questions/263305/drawing-a-topographical-map
var tin = require('turf-tin');
var inside = require('turf-inside');
var grid = require('turf-grid');
var extent = require('turf-extent');
var planepoint = require('turf-planepoint');
var featurecollection = require('turf-featurecollection');
var linestring = require('turf-linestring');
var polygon = require('turf-polygon');
var point = require('turf-point');
var square = require('turf-square');
var size = require('turf-size');

module.exports = function(points, z, resolution, breaks){
  var addEdgesResult = addEdges(points, z, resolution);

  var tinResult = tin(points, z);
  var extentBBox = extent(points);
  var squareBBox = square(extentBBox);
  var gridResult = grid(squareBBox, resolution);
  var data = [];

  gridResult.features.forEach(function(pt){
    tinResult.features.forEach(function(triangle){
      if (inside(pt, triangle)) {
        pt.properties = {};
        pt.properties[z] = planepoint(pt, triangle);
      }
    });
    if(!pt.properties){
      pt.properties = {};
      pt.properties[z] = -100;
    }
  });

  var depth = Math.sqrt(gridResult.features.length);
  for (var x=0; x<depth; x++){
    var xGroup = gridResult.features.slice(x * depth, (x + 1) * depth);
    var xFlat = [];
    xGroup.forEach(function(verticalPoint){
      if(verticalPoint.properties){
        xFlat.push(verticalPoint.properties[z]);
      } else{
        xFlat.push(0);
      }
    })
    data.push(xFlat);
  }
  var interval = (squareBBox[2] - squareBBox[0]) / depth;
  var xCoordinates = [];
  var yCoordinates = [];
  for (var x=0; x<depth; x++){
    xCoordinates.push(x * interval + squareBBox[0]);
    yCoordinates.push(x * interval + squareBBox[1]);
  }

  //change zero breaks to .01 to deal with bug in conrec algorithm
  breaks = breaks.map(function(num){
    if(num === 0){
      return .01;
    }
    else{
      return num;
    }
  })
  //deduplicate breaks
  breaks = unique(breaks);

  var c = new Conrec;
  c.contour(data, 0, resolution, 0, resolution, xCoordinates, yCoordinates, breaks.length, breaks);
  var contourList = c.contourList();

  var fc = featurecollection([]);
  contourList.forEach(function(c){
    if(c.length > 2){
      var polyCoordinates = [];
      c.forEach(function(coord){
        polyCoordinates.push([coord.x, coord.y]);
      });
      var poly = polygon([polyCoordinates]);
      poly.properties = {};
      poly.properties[z] = c.level;

      fc.features.push(poly);
    }
  });

  return fc;
}

function addEdges(points, z, resolution){
  var extentBBox = extent(points),
    squareBBox,
    sizeResult;

  if (typeof extentBBox === 'Error') {
    return extentBBox;
  }

  squareBBox = square(extentBBox);

  if (typeof squareBBox === 'Error') {
    return squareBBox;
  }

  sizeBBox = size(squareBBox, 0.35)

  if (typeof sizeBBox === 'Error') {
    return sizeBBox;
  }

  var edgeDistance = sizeBBox[2] - sizeBBox[0]
  var extendDistance = edgeDistance / resolution

  var xmin = sizeBBox[0]
  var ymin = sizeBBox[1]
  var xmax = sizeBBox[2]
  var ymax = sizeBBox[3]

  //left
  var left = [[xmin, ymin],[xmin, ymax]]
  for(var i = 0; i<=resolution; i++){
    var pt = point(xmin, ymin + (extendDistance * i))
    pt.properties = {}
    pt.properties[z] = -100
    points.features.push(pt)
  }

  //bottom
  var bottom = [[xmin, ymin],[xmax, ymin]]
  for(var i = 0; i<=resolution; i++){
    var pt = point(xmin + (extendDistance * i), ymin)
    pt.properties = {}
    pt.properties[z] = -100
    points.features.push(pt)
  }

  //right
  var right = [[xmax, ymin],[xmax, ymax]]
  for(var i = 0; i<=resolution; i++){
    var pt = point(xmax, ymin + (extendDistance * i))
    pt.properties = {}
    pt.properties[z] = -100
    points.features.push(pt)
  }

  //top
  var top = [[xmin, ymax],[xmax, ymax]]
  for(var i = 0; i<=resolution; i++){
    var pt = point(xmin + (extendDistance * i), ymax)
    pt.properties = {}
    pt.properties[z] = -100
    points.features.push(pt)
  }

  return points
}

function unique(a) {
  return a.reduce(function(p, c) {
      if (p.indexOf(c) < 0) p.push(c);
      return p;
  }, []);
}

/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */


exports.Conrec = Conrec;

var EPSILON = 1e-10;

function pointsEqual(a, b) {
  var x = a.x - b.x, y = a.y - b.y;
  return x * x + y * y < EPSILON;
}

function reverseList(list) {
  var pp = list.head;

  while (pp) {
    // swap prev/next pointers
    var temp = pp.next;
    pp.next = pp.prev;
    pp.prev = temp;

    // continue through the list
    pp = temp;
  }

  // swap head/tail pointers
  var temp = list.head;
  list.head = list.tail;
  list.tail = temp;
}

function ContourBuilder(level) {
  this.level = level;
  this.s = null;
  this.count = 0;
}
ContourBuilder.prototype.remove_seq = function(list) {
  // if list is the first item, static ptr s is updated
  if (list.prev) {
    list.prev.next = list.next;
  } else {
    this.s = list.next;
  }

  if (list.next) {
    list.next.prev = list.prev;
  }
  --this.count;
}
ContourBuilder.prototype.addSegment = function(a, b) {
  var ss = this.s;
  var ma = null;
  var mb = null;
  var prependA = false;
  var prependB = false;

  while (ss) {
    if (ma == null) {
      // no match for a yet
      if (pointsEqual(a, ss.head.p)) {
        ma = ss;
        prependA = true;
      } else if (pointsEqual(a, ss.tail.p)) {
        ma = ss;
      }
    }
    if (mb == null) {
      // no match for b yet
      if (pointsEqual(b, ss.head.p)) {
        mb = ss;
        prependB = true;
      } else if (pointsEqual(b, ss.tail.p)) {
        mb = ss;
      }
    }
    // if we matched both no need to continue searching
    if (mb != null && ma != null) {
      break;
    } else {
      ss = ss.next;
    }
  }

  // c is the case selector based on which of ma and/or mb are set
  var c = ((ma != null) ? 1 : 0) | ((mb != null) ? 2 : 0);

  switch(c) {
    case 0:   // both unmatched, add as new sequence
      var aa = {p: a, prev: null};
      var bb = {p: b, next: null};
      aa.next = bb;
      bb.prev = aa;

      // create sequence element and push onto head of main list. The order
      // of items in this list is unimportant
      ma = {head: aa, tail: bb, next: this.s, prev: null, closed: false};
      if (this.s) {
        this.s.prev = ma;
      }
      this.s = ma;

      ++this.count;    // not essential - tracks number of unmerged sequences
    break;

    case 1:   // a matched, b did not - thus b extends sequence ma
      var pp = {p: b};

      if (prependA) {
        pp.next = ma.head;
        pp.prev = null;
        ma.head.prev = pp;
        ma.head = pp;
      } else {
        pp.next = null;
        pp.prev = ma.tail;
        ma.tail.next = pp;
        ma.tail = pp;
      }
    break;

    case 2:   // b matched, a did not - thus a extends sequence mb
      var pp = {p: a};

      if (prependB) {
        pp.next = mb.head;
        pp.prev = null;
        mb.head.prev = pp;
        mb.head = pp;
      } else {
        pp.next = null;
        pp.prev = mb.tail;
        mb.tail.next = pp;
        mb.tail = pp;
      }
    break;

    case 3:   // both matched, can merge sequences
      // if the sequences are the same, do nothing, as we are simply closing this path (could set a flag)

      if (ma === mb) {
        var pp = {p: ma.tail.p, next: ma.head, prev: null};
        ma.head.prev = pp;
        ma.head = pp;
        ma.closed = true;
        break;
      }

      // there are 4 ways the sequence pair can be joined. The current setting of prependA and
      // prependB will tell us which type of join is needed. For head/head and tail/tail joins
      // one sequence needs to be reversed
      switch((prependA ? 1 : 0) | (prependB ? 2 : 0)) {
        case 0:   // tail-tail
          // reverse ma and append to mb
          reverseList(ma);
          // fall through to head/tail case
        case 1:   // head-tail
          // ma is appended to mb and ma discarded
          mb.tail.next = ma.head;
          ma.head.prev = mb.tail;
          mb.tail = ma.tail;

          //discard ma sequence record
          this.remove_seq(ma);
        break;

        case 3:   // head-head
          // reverse ma and append mb to it
          reverseList(ma);
          // fall through to tail/head case
        case 2:   // tail-head
          // mb is appended to ma and mb is discarded
          ma.tail.next = mb.head;
          mb.head.prev = ma.tail;
          ma.tail = mb.tail;

          //discard mb sequence record
          this.remove_seq(mb);
      break;
    }
  }
}

/**
 * Implements CONREC.
 *
 * @param {function} drawContour function for drawing contour.  Defaults to a
 *                               custom "contour builder", which populates the
 *                               contours property.
 */
function Conrec(drawContour) {
  if (!drawContour) {
    var c = this;
    c.contours = {};
    /**
     * drawContour - interface for implementing the user supplied method to
     * render the countours.
     *
     * Draws a line between the start and end coordinates.
     *
     * @param startX    - start coordinate for X
     * @param startY    - start coordinate for Y
     * @param endX      - end coordinate for X
     * @param endY      - end coordinate for Y
     * @param contourLevel - Contour level for line.
     */
    this.drawContour = function(startX, startY, endX, endY, contourLevel, k) {
      var cb = c.contours[k];
      if (!cb) {
        cb = c.contours[k] = new ContourBuilder(contourLevel);
      }
      cb.addSegment({x: startX, y: startY}, {x: endX, y: endY});
    }
    this.contourList = function() {
      var l = [];
      var a = c.contours;
      for (var k in a) {
        var s = a[k].s;
        var level = a[k].level;
        while (s) {
          var h = s.head;
          var l2 = [];
          l2.level = level;
          l2.k = k;
          while (h && h.p) {
            l2.push(h.p);
            h = h.next;
          }
          l.push(l2);
          s = s.next;
        }
      }
      l.sort(function(a, b) { return a.k - b.k });
      return l;
    }
  } else {
    this.drawContour = drawContour;
  }
  this.h  = new Array(5);
  this.sh = new Array(5);
  this.xh = new Array(5);
  this.yh = new Array(5);
}

/**
 * contour is a contouring subroutine for rectangularily spaced data
 *
 * It emits calls to a line drawing subroutine supplied by the user which
 * draws a contour map corresponding to real*4data on a randomly spaced
 * rectangular grid. The coordinates emitted are in the same units given in
 * the x() and y() arrays.
 *
 * Any number of contour levels may be specified but they must be in order of
 * increasing value.
 *
 *
 * @param {number[][]} d - matrix of data to contour
 * @param {number} ilb,iub,jlb,jub - index bounds of data matrix
 *
 *             The following two, one dimensional arrays (x and y) contain
 *             the horizontal and vertical coordinates of each sample points.
 * @param {number[]} x  - data matrix column coordinates
 * @param {number[]} y  - data matrix row coordinates
 * @param {number} nc   - number of contour levels
 * @param {number[]} z  - contour levels in increasing order.
 */
Conrec.prototype.contour = function(d, ilb, iub, jlb, jub, x, y, nc, z) {
  var h = this.h, sh = this.sh, xh = this.xh, yh = this.yh;
  var drawContour = this.drawContour;
  this.contours = {};

  /** private */
  var xsect = function(p1, p2){
    return (h[p2]*xh[p1]-h[p1]*xh[p2])/(h[p2]-h[p1]);
  }

  var ysect = function(p1, p2){
    return (h[p2]*yh[p1]-h[p1]*yh[p2])/(h[p2]-h[p1]);
  }
  var m1;
  var m2;
  var m3;
  var case_value;
  var dmin;
  var dmax;
  var x1 = 0.0;
  var x2 = 0.0;
  var y1 = 0.0;
  var y2 = 0.0;

  // The indexing of im and jm should be noted as it has to start from zero
  // unlike the fortran counter part
  var im = [0, 1, 1, 0];
  var jm = [0, 0, 1, 1];

  // Note that castab is arranged differently from the FORTRAN code because
  // Fortran and C/C++ arrays are transposed of each other, in this case
  // it is more tricky as castab is in 3 dimensions
  var castab = [
    [
      [0, 0, 8], [0, 2, 5], [7, 6, 9]
    ],
    [
      [0, 3, 4], [1, 3, 1], [4, 3, 0]
    ],
    [
      [9, 6, 7], [5, 2, 0], [8, 0, 0]
    ]
  ];

  for (var j=(jub-1);j>=jlb;j--) {
    for (var i=ilb;i<=iub-1;i++) {
      var temp1, temp2;
      temp1 = Math.min(d[i][j],d[i][j+1]);
      temp2 = Math.min(d[i+1][j],d[i+1][j+1]);
      dmin  = Math.min(temp1,temp2);
      temp1 = Math.max(d[i][j],d[i][j+1]);
      temp2 = Math.max(d[i+1][j],d[i+1][j+1]);
      dmax  = Math.max(temp1,temp2);

      if (dmax>=z[0]&&dmin<=z[nc-1]) {
        for (var k=0;k<nc;k++) {
          if (z[k]>=dmin&&z[k]<=dmax) {
            for (var m=4;m>=0;m--) {
              if (m>0) {
                // The indexing of im and jm should be noted as it has to
                // start from zero
                h[m] = d[i+im[m-1]][j+jm[m-1]]-z[k];
                xh[m] = x[i+im[m-1]];
                yh[m] = y[j+jm[m-1]];
              } else {
                h[0] = 0.25*(h[1]+h[2]+h[3]+h[4]);
                xh[0]=0.5*(x[i]+x[i+1]);
                yh[0]=0.5*(y[j]+y[j+1]);
              }
              if (h[m]>EPSILON) {
                sh[m] = 1;
              } else if (h[m]<-EPSILON) {
                sh[m] = -1;
              } else
                sh[m] = 0;
            }
            //
            // Note: at this stage the relative heights of the corners and the
            // centre are in the h array, and the corresponding coordinates are
            // in the xh and yh arrays. The centre of the box is indexed by 0
            // and the 4 corners by 1 to 4 as shown below.
            // Each triangle is then indexed by the parameter m, and the 3
            // vertices of each triangle are indexed by parameters m1,m2,and
            // m3.
            // It is assumed that the centre of the box is always vertex 2
            // though this isimportant only when all 3 vertices lie exactly on
            // the same contour level, in which case only the side of the box
            // is drawn.
            //
            //
            //      vertex 4 +-------------------+ vertex 3
            //               | \               / |
            //               |   \    m-3    /   |
            //               |     \       /     |
            //               |       \   /       |
            //               |  m=2    X   m=2   |       the centre is vertex 0
            //               |       /   \       |
            //               |     /       \     |
            //               |   /    m=1    \   |
            //               | /               \ |
            //      vertex 1 +-------------------+ vertex 2
            //
            //
            //
            //               Scan each triangle in the box
            //
            for (m=1;m<=4;m++) {
              m1 = m;
              m2 = 0;
              if (m!=4) {
                  m3 = m+1;
              } else {
                  m3 = 1;
              }
              case_value = castab[sh[m1]+1][sh[m2]+1][sh[m3]+1];
              if (case_value!=0) {
                switch (case_value) {
                  case 1: // Line between vertices 1 and 2
                    x1=xh[m1];
                    y1=yh[m1];
                    x2=xh[m2];
                    y2=yh[m2];
                    break;
                  case 2: // Line between vertices 2 and 3
                    x1=xh[m2];
                    y1=yh[m2];
                    x2=xh[m3];
                    y2=yh[m3];
                    break;
                  case 3: // Line between vertices 3 and 1
                    x1=xh[m3];
                    y1=yh[m3];
                    x2=xh[m1];
                    y2=yh[m1];
                    break;
                  case 4: // Line between vertex 1 and side 2-3
                    x1=xh[m1];
                    y1=yh[m1];
                    x2=xsect(m2,m3);
                    y2=ysect(m2,m3);
                    break;
                  case 5: // Line between vertex 2 and side 3-1
                    x1=xh[m2];
                    y1=yh[m2];
                    x2=xsect(m3,m1);
                    y2=ysect(m3,m1);
                    break;
                  case 6: //  Line between vertex 3 and side 1-2
                    x1=xh[m3];
                    y1=yh[m3];
                    x2=xsect(m1,m2);
                    y2=ysect(m1,m2);
                    break;
                  case 7: // Line between sides 1-2 and 2-3
                    x1=xsect(m1,m2);
                    y1=ysect(m1,m2);
                    x2=xsect(m2,m3);
                    y2=ysect(m2,m3);
                    break;
                  case 8: // Line between sides 2-3 and 3-1
                    x1=xsect(m2,m3);
                    y1=ysect(m2,m3);
                    x2=xsect(m3,m1);
                    y2=ysect(m3,m1);
                    break;
                  case 9: // Line between sides 3-1 and 1-2
                    x1=xsect(m3,m1);
                    y1=ysect(m3,m1);
                    x2=xsect(m1,m2);
                    y2=ysect(m1,m2);
                    break;
                  default:
                    break;
                }
                // Put your processing code here and comment out the printf
                //printf("%f %f %f %f %f\n",x1,y1,x2,y2,z[k]);
                drawContour(x1,y1,x2,y2,z[k],k);
              }
            }
          }
        }
      }
    }
  }
}

},{"turf-extent":68,"turf-featurecollection":70,"turf-grid":84,"turf-inside":76,"turf-linestring":104,"turf-planepoint":86,"turf-point":117,"turf-polygon":118,"turf-size":126,"turf-square":127,"turf-tin":87}],84:[function(require,module,exports){
var point = require('turf-point')

module.exports = function(extents, depth, done){
  var xmin = extents[0]
  var ymin = extents[1]
  var xmax = extents[2]
  var ymax = extents[3]
  var interval = (xmax - xmin) / depth
  var coords = []
  var fc = {
    type: 'FeatureCollection',
    features: []
  }

  done = done || function () {};

  for (var x=0; x<=depth; x++){
    for (var y=0;y<=depth; y++){
      fc.features.push(point((x * interval) + xmin, (y * interval) + ymin))
    }
  }
  done(null, fc)
  return fc;
}

},{"turf-point":85}],85:[function(require,module,exports){
module.exports=require(67)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-explode/node_modules/turf-point/index.js":67}],86:[function(require,module,exports){
module.exports = function(point, triangle, done){
  var x = point.geometry.coordinates[0]
      y = point.geometry.coordinates[1]
      x1 = triangle.geometry.coordinates[0][0][0],
      y1 = triangle.geometry.coordinates[0][0][1],
      z1 = triangle.properties.a
      x2 = triangle.geometry.coordinates[0][1][0],
      y2 = triangle.geometry.coordinates[0][1][1],
      z2 = triangle.properties.b
      x3 = triangle.geometry.coordinates[0][2][0],
      y3 = triangle.geometry.coordinates[0][2][1],
      z3 = triangle.properties.c

  var z = (z3 * (x-x1) * (y-y2) + z1 * (x-x2) * (y-y3) + z2 * (x-x3) * (y-y1)
      - z2 * (x-x1) * (y-y3) - z3 * (x-x2) * (y-y1) - z1 * (x-x3) * (y-y2)) /
      ((x-x1) * (y-y2) + (x-x2) * (y-y3) +(x-x3) * (y-y1) -
       (x-x1) * (y-y3) - (x-x2) * (y-y1) - (x-x3) * (y-y2))

  return z;
}

},{}],87:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Delaunay_triangulation
//https://github.com/ironwallaby/delaunay
var polygon = require('turf-polygon')
var nearest = require('turf-nearest')
var point = require('turf-point')

module.exports = function(points, z, done){
  //break down points
  var vertices = []
  points.features.forEach(function(p){
    vertices.push({x:p.geometry.coordinates[0], y:p.geometry.coordinates[1]})
  })

  var triangulated = triangulate(vertices)
  var triangles = {
    type: 'FeatureCollection',
    features: []
  }

  done = done || function () {};

  triangulated.forEach(function(triangle){
    var coords = [[[triangle.a.x, triangle.a.y], [triangle.b.x, triangle.b.y], [triangle.c.x, triangle.c.y]]]
    var poly = polygon(coords, {a: null, b: null, c: null})

    triangles.features.push(poly)
  })
  if(z){
    // add values from vertices
    triangles.features.forEach(function(tri){
      var coordinateNumber = 1
      tri.geometry.coordinates[0].forEach(function(c){
        var closest = nearest(point(c[0], c[1]), points);

        if(coordinateNumber === 1){
          tri.properties.a = closest.properties[z]
        }
        else if(coordinateNumber === 2){
          tri.properties.b = closest.properties[z]
        }
        else if(coordinateNumber === 3){
          tri.properties.c = closest.properties[z]
        }
        coordinateNumber++
      })
    })
  }

  triangles.features.forEach(function(tri){
    tri = correctRings(tri)
  })
  
  done(null, triangles)
  return triangles;
}

function correctRings(poly){
  poly.geometry.coordinates.forEach(function(ring){
    var isWrapped =  ring[0] === ring.slice(-1)[0]
    if(!isWrapped){
      ring.push(ring[0])
    }
  })
  return poly
}

function Triangle(a, b, c) {
  this.a = a
  this.b = b
  this.c = c

  var A = b.x - a.x,
      B = b.y - a.y,
      C = c.x - a.x,
      D = c.y - a.y,
      E = A * (a.x + b.x) + B * (a.y + b.y),
      F = C * (a.x + c.x) + D * (a.y + c.y),
      G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
      minx, miny, dx, dy

  /* If the points of the triangle are collinear, then just find the
   * extremes and use the midpoint as the center of the circumcircle. */
  if(Math.abs(G) < 0.000001) {
    minx = Math.min(a.x, b.x, c.x)
    miny = Math.min(a.y, b.y, c.y)
    dx   = (Math.max(a.x, b.x, c.x) - minx) * 0.5
    dy   = (Math.max(a.y, b.y, c.y) - miny) * 0.5

    this.x = minx + dx
    this.y = miny + dy
    this.r = dx * dx + dy * dy
  }

  else {
    this.x = (D*E - B*F) / G
    this.y = (A*F - C*E) / G
    dx = this.x - a.x
    dy = this.y - a.y
    this.r = dx * dx + dy * dy
  }
}

Triangle.prototype.draw = function(ctx) {
  ctx.beginPath()
  ctx.moveTo(this.a.x, this.a.y)
  ctx.lineTo(this.b.x, this.b.y)
  ctx.lineTo(this.c.x, this.c.y)
  ctx.closePath()
  ctx.stroke()
}

function byX(a, b) {
  return b.x - a.x
}

function dedup(edges) {
  var j = edges.length,
      a, b, i, m, n

  outer: while(j) {
    b = edges[--j]
    a = edges[--j]
    i = j
    while(i) {
      n = edges[--i]
      m = edges[--i]
      if((a === m && b === n) || (a === n && b === m)) {
        edges.splice(j, 2)
        edges.splice(i, 2)
        j -= 2
        continue outer
      }
    }
  }
}

function triangulate(vertices) {
  /* Bail if there aren't enough vertices to form any triangles. */
  if(vertices.length < 3)
    return []

  /* Ensure the vertex array is in order of descending X coordinate
   * (which is needed to ensure a subquadratic runtime), and then find
   * the bounding box around the points. */
  vertices.sort(byX)

  var i    = vertices.length - 1,
      xmin = vertices[i].x,
      xmax = vertices[0].x,
      ymin = vertices[i].y,
      ymax = ymin

  while(i--) {
    if(vertices[i].y < ymin) ymin = vertices[i].y
    if(vertices[i].y > ymax) ymax = vertices[i].y
  }

  /* Find a supertriangle, which is a triangle that surrounds all the
   * vertices. This is used like something of a sentinel value to remove
   * cases in the main algorithm, and is removed before we return any
   * results.
   *
   * Once found, put it in the "open" list. (The "open" list is for
   * triangles who may still need to be considered; the "closed" list is
   * for triangles which do not.) */
  var dx     = xmax - xmin,
      dy     = ymax - ymin,
      dmax   = (dx > dy) ? dx : dy,
      xmid   = (xmax + xmin) * 0.5,
      ymid   = (ymax + ymin) * 0.5,
      open   = [
        new Triangle(
          {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
          {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
          {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
        )
      ],
      closed = [],
      edges = [],
      j, a, b

  /* Incrementally add each vertex to the mesh. */
  i = vertices.length
  while(i--) {
    /* For each open triangle, check to see if the current point is
     * inside it's circumcircle. If it is, remove the triangle and add
     * it's edges to an edge list. */
    edges.length = 0
    j = open.length
    while(j--) {
      /* If this point is to the right of this triangle's circumcircle,
       * then this triangle should never get checked again. Remove it
       * from the open list, add it to the closed list, and skip. */
      dx = vertices[i].x - open[j].x
      if(dx > 0 && dx * dx > open[j].r) {
        closed.push(open[j])
        open.splice(j, 1)
        continue
      }

      /* If not, skip this triangle. */
      dy = vertices[i].y - open[j].y
      if(dx * dx + dy * dy > open[j].r)
        continue

      /* Remove the triangle and add it's edges to the edge list. */
      edges.push(
        open[j].a, open[j].b,
        open[j].b, open[j].c,
        open[j].c, open[j].a
      )
      open.splice(j, 1)
    }

    /* Remove any doubled edges. */
    dedup(edges)

    /* Add a new triangle for each edge. */
    j = edges.length
    while(j) {
      b = edges[--j]
      a = edges[--j]
      open.push(new Triangle(a, b, vertices[i]))
    }
  }

  /* Copy any remaining open triangles to the closed list, and then
   * remove any triangles that share a vertex with the supertriangle. */
  Array.prototype.push.apply(closed, open)

  i = closed.length
  while(i--)
    if(closed[i].a.__sentinel ||
       closed[i].b.__sentinel ||
       closed[i].c.__sentinel)
      closed.splice(i, 1)

  /* Yay, we're done! */
  return closed
}

/*if (typeof module !== 'undefined') {
    module.exports = {
        Triangle: Triangle,
        triangulate: triangulate
    }
}*/

},{"turf-nearest":88,"turf-point":90,"turf-polygon":91}],88:[function(require,module,exports){
distance = require('turf-distance')

module.exports = function(targetPoint, points){
  var nearestPoint
  var count = 0
  var dist = Infinity
  points.features.forEach(function(pt){
    if(!nearestPoint){
      nearestPoint = pt
      var dist = distance(targetPoint, pt, 'miles')
      nearestPoint.properties.distance = dist 
    }
    else{
      var dist = distance(targetPoint, pt, 'miles')
      if(dist < nearestPoint.properties.distance){
        nearestPoint = pt
        nearestPoint.properties.distance = dist
      }
    }
  })
  delete nearestPoint.properties.distance
  return nearestPoint
}
},{"turf-distance":89}],89:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Haversine_formula
//http://www.movable-type.co.uk/scripts/latlong.html

module.exports = function(point1, point2, units){
  var coordinates1 = point1.geometry.coordinates
  var coordinates2 = point2.geometry.coordinates

  var dLat = toRad(coordinates2[1] - coordinates1[1])
  var dLon = toRad(coordinates2[0] - coordinates1[0])
  var lat1 = toRad(coordinates1[1])
  var lat2 = toRad(coordinates2[1])
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  var R = 0
  switch(units){
    case 'miles':
      R = 3960
      break
    case 'kilometers':
      R = 6373
      break
    case 'degrees':
      R = 57.2957795
      break
    case 'radians':
      R = 1
      break
  }
  var distance = R * c
  return distance
}

function toRad(degree){
  return degree * Math.PI / 180
}

},{}],90:[function(require,module,exports){
module.exports=require(67)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-explode/node_modules/turf-point/index.js":67}],91:[function(require,module,exports){
module.exports=require(34)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-bbox-polygon/node_modules/turf-polygon/index.js":34}],92:[function(require,module,exports){
//https://github.com/jasondavies/conrec.js
//http://stackoverflow.com/questions/263305/drawing-a-topographical-map
var tin = require('turf-tin');
var inside = require('turf-inside');
var grid = require('turf-grid');
var extent = require('turf-extent');
var planepoint = require('turf-planepoint');
var featurecollection = require('turf-featurecollection');
var linestring = require('turf-linestring');
var square = require('turf-square');

module.exports = function(points, z, resolution, breaks, done){
  var tinResult = tin(points, z);
  var extentBBox = extent(points);
  var squareBBox = square(extentBBox);
  var gridResult = grid(squareBBox, resolution);
  var data = [];

  gridResult.features.forEach(function(pt){
    tinResult.features.forEach(function(triangle){
      if (inside(pt, triangle)) {
        pt.properties = {};
        pt.properties[z] = planepoint(pt, triangle);
      }
    });
  });

  var depth = Math.sqrt(gridResult.features.length);
  for (var x=0; x<depth; x++){
    var xGroup = gridResult.features.slice(x * depth, (x + 1) * depth);
    var xFlat = [];
    xGroup.forEach(function(verticalPoint){
      if(verticalPoint.properties){
        xFlat.push(verticalPoint.properties[z]);
      } else{
        xFlat.push(0);
      }
    });
    data.push(xFlat);
  }
  var interval = (squareBBox[2] - squareBBox[0]) / depth;
  var xCoordinates = [];
  var yCoordinates = [];
  for (var x=0; x<depth; x++){
    xCoordinates.push(x * interval + squareBBox[0]);
    yCoordinates.push(x * interval + squareBBox[1]);
  }

  var c = new Conrec;
  c.contour(data, 0, resolution, 0, resolution, xCoordinates, yCoordinates, breaks.length, breaks);
  var contourList = c.contourList();

  var fc = featurecollection([]);
  contourList.forEach(function(c){
    if(c.length > 2){
      var polyCoordinates = [];
      c.forEach(function(coord){
        polyCoordinates.push([coord.x, coord.y]);
      });
      var poly = linestring(polyCoordinates);
      poly.properties = {};
      poly.properties[z] = c.level;

      fc.features.push(poly);
    }
  });

  return fc;
}


/**
 * Copyright (c) 2010, Jason Davies.
 *
 * All rights reserved.  This code is based on Bradley White's Java version,
 * which is in turn based on Nicholas Yue's C++ version, which in turn is based
 * on Paul D. Bourke's original Fortran version.  See below for the respective
 * copyright notices.
 *
 * See http://local.wasp.uwa.edu.au/~pbourke/papers/conrec/ for the original
 * paper by Paul D. Bourke.
 *
 * The vector conversion code is based on http://apptree.net/conrec.htm by
 * Graham Cox.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * Copyright (c) 1996-1997 Nicholas Yue
 *
 * This software is copyrighted by Nicholas Yue. This code is based on Paul D.
 * Bourke's CONREC.F routine.
 *
 * The authors hereby grant permission to use, copy, and distribute this
 * software and its documentation for any purpose, provided that existing
 * copyright notices are retained in all copies and that this notice is
 * included verbatim in any distributions. Additionally, the authors grant
 * permission to modify this software and its documentation for any purpose,
 * provided that such modifications are not distributed without the explicit
 * consent of the authors and that existing copyright notices are retained in
 * all copies. Some of the algorithms implemented by this software are
 * patented, observe all applicable patent law.
 *
 * IN NO EVENT SHALL THE AUTHORS OR DISTRIBUTORS BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT
 * OF THE USE OF THIS SOFTWARE, ITS DOCUMENTATION, OR ANY DERIVATIVES THEREOF,
 * EVEN IF THE AUTHORS HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * THE AUTHORS AND DISTRIBUTORS SPECIFICALLY DISCLAIM ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.  THIS SOFTWARE IS
 * PROVIDED ON AN "AS IS" BASIS, AND THE AUTHORS AND DISTRIBUTORS HAVE NO
 * OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR
 * MODIFICATIONS.
 */


  exports.Conrec = Conrec;

  var EPSILON = 1e-10;

  function pointsEqual(a, b) {
    var x = a.x - b.x, y = a.y - b.y;
    return x * x + y * y < EPSILON;
  }

  function reverseList(list) {
    var pp = list.head;

    while (pp) {
      // swap prev/next pointers
      var temp = pp.next;
      pp.next = pp.prev;
      pp.prev = temp;

      // continue through the list
      pp = temp;
    }

    // swap head/tail pointers
    var temp = list.head;
    list.head = list.tail;
    list.tail = temp;
  }

  function ContourBuilder(level) {
    this.level = level;
    this.s = null;
    this.count = 0;
  }
  ContourBuilder.prototype.remove_seq = function(list) {
    // if list is the first item, static ptr s is updated
    if (list.prev) {
      list.prev.next = list.next;
    } else {
      this.s = list.next;
    }

    if (list.next) {
      list.next.prev = list.prev;
    }
    --this.count;
  }
  ContourBuilder.prototype.addSegment = function(a, b) {
    var ss = this.s;
    var ma = null;
    var mb = null;
    var prependA = false;
    var prependB = false;

    while (ss) {
      if (ma == null) {
        // no match for a yet
        if (pointsEqual(a, ss.head.p)) {
          ma = ss;
          prependA = true;
        } else if (pointsEqual(a, ss.tail.p)) {
          ma = ss;
        }
      }
      if (mb == null) {
        // no match for b yet
        if (pointsEqual(b, ss.head.p)) {
          mb = ss;
          prependB = true;
        } else if (pointsEqual(b, ss.tail.p)) {
          mb = ss;
        }
      }
      // if we matched both no need to continue searching
      if (mb != null && ma != null) {
        break;
      } else {
        ss = ss.next;
      }
    }

    // c is the case selector based on which of ma and/or mb are set
    var c = ((ma != null) ? 1 : 0) | ((mb != null) ? 2 : 0);

    switch(c) {
      case 0:   // both unmatched, add as new sequence
        var aa = {p: a, prev: null};
        var bb = {p: b, next: null};
        aa.next = bb;
        bb.prev = aa;

        // create sequence element and push onto head of main list. The order
        // of items in this list is unimportant
        ma = {head: aa, tail: bb, next: this.s, prev: null, closed: false};
        if (this.s) {
          this.s.prev = ma;
        }
        this.s = ma;

        ++this.count;    // not essential - tracks number of unmerged sequences
      break;

      case 1:   // a matched, b did not - thus b extends sequence ma
        var pp = {p: b};

        if (prependA) {
          pp.next = ma.head;
          pp.prev = null;
          ma.head.prev = pp;
          ma.head = pp;
        } else {
          pp.next = null;
          pp.prev = ma.tail;
          ma.tail.next = pp;
          ma.tail = pp;
        }
      break;

      case 2:   // b matched, a did not - thus a extends sequence mb
        var pp = {p: a};

        if (prependB) {
          pp.next = mb.head;
          pp.prev = null;
          mb.head.prev = pp;
          mb.head = pp;
        } else {
          pp.next = null;
          pp.prev = mb.tail;
          mb.tail.next = pp;
          mb.tail = pp;
        }
      break;

      case 3:   // both matched, can merge sequences
        // if the sequences are the same, do nothing, as we are simply closing this path (could set a flag)

        if (ma === mb) {
          var pp = {p: ma.tail.p, next: ma.head, prev: null};
          ma.head.prev = pp;
          ma.head = pp;
          ma.closed = true;
          break;
        }

        // there are 4 ways the sequence pair can be joined. The current setting of prependA and
        // prependB will tell us which type of join is needed. For head/head and tail/tail joins
        // one sequence needs to be reversed
        switch((prependA ? 1 : 0) | (prependB ? 2 : 0)) {
          case 0:   // tail-tail
            // reverse ma and append to mb
            reverseList(ma);
            // fall through to head/tail case
          case 1:   // head-tail
            // ma is appended to mb and ma discarded
            mb.tail.next = ma.head;
            ma.head.prev = mb.tail;
            mb.tail = ma.tail;

            //discard ma sequence record
            this.remove_seq(ma);
          break;

          case 3:   // head-head
            // reverse ma and append mb to it
            reverseList(ma);
            // fall through to tail/head case
          case 2:   // tail-head
            // mb is appended to ma and mb is discarded
            ma.tail.next = mb.head;
            mb.head.prev = ma.tail;
            ma.tail = mb.tail;

            //discard mb sequence record
            this.remove_seq(mb);
        break;
      }
    }
  }

  /**
   * Implements CONREC.
   *
   * @param {function} drawContour function for drawing contour.  Defaults to a
   *                               custom "contour builder", which populates the
   *                               contours property.
   */
  function Conrec(drawContour) {
    if (!drawContour) {
      var c = this;
      c.contours = {};
      /**
       * drawContour - interface for implementing the user supplied method to
       * render the countours.
       *
       * Draws a line between the start and end coordinates.
       *
       * @param startX    - start coordinate for X
       * @param startY    - start coordinate for Y
       * @param endX      - end coordinate for X
       * @param endY      - end coordinate for Y
       * @param contourLevel - Contour level for line.
       */
      this.drawContour = function(startX, startY, endX, endY, contourLevel, k) {
        var cb = c.contours[k];
        if (!cb) {
          cb = c.contours[k] = new ContourBuilder(contourLevel);
        }
        cb.addSegment({x: startX, y: startY}, {x: endX, y: endY});
      }
      this.contourList = function() {
        var l = [];
        var a = c.contours;
        for (var k in a) {
          var s = a[k].s;
          var level = a[k].level;
          while (s) {
            var h = s.head;
            var l2 = [];
            l2.level = level;
            l2.k = k;
            while (h && h.p) {
              l2.push(h.p);
              h = h.next;
            }
            l.push(l2);
            s = s.next;
          }
        }
        l.sort(function(a, b) { return a.k - b.k });
        return l;
      }
    } else {
      this.drawContour = drawContour;
    }
    this.h  = new Array(5);
    this.sh = new Array(5);
    this.xh = new Array(5);
    this.yh = new Array(5);
  }

  /**
   * contour is a contouring subroutine for rectangularily spaced data
   *
   * It emits calls to a line drawing subroutine supplied by the user which
   * draws a contour map corresponding to real*4data on a randomly spaced
   * rectangular grid. The coordinates emitted are in the same units given in
   * the x() and y() arrays.
   *
   * Any number of contour levels may be specified but they must be in order of
   * increasing value.
   *
   *
   * @param {number[][]} d - matrix of data to contour
   * @param {number} ilb,iub,jlb,jub - index bounds of data matrix
   *
   *             The following two, one dimensional arrays (x and y) contain
   *             the horizontal and vertical coordinates of each sample points.
   * @param {number[]} x  - data matrix column coordinates
   * @param {number[]} y  - data matrix row coordinates
   * @param {number} nc   - number of contour levels
   * @param {number[]} z  - contour levels in increasing order.
   */
  Conrec.prototype.contour = function(d, ilb, iub, jlb, jub, x, y, nc, z) {
    var h = this.h, sh = this.sh, xh = this.xh, yh = this.yh;
    var drawContour = this.drawContour;
    this.contours = {};

    /** private */
    var xsect = function(p1, p2){
      return (h[p2]*xh[p1]-h[p1]*xh[p2])/(h[p2]-h[p1]);
    }

    var ysect = function(p1, p2){
      return (h[p2]*yh[p1]-h[p1]*yh[p2])/(h[p2]-h[p1]);
    }
    var m1;
    var m2;
    var m3;
    var case_value;
    var dmin;
    var dmax;
    var x1 = 0.0;
    var x2 = 0.0;
    var y1 = 0.0;
    var y2 = 0.0;

    // The indexing of im and jm should be noted as it has to start from zero
    // unlike the fortran counter part
    var im = [0, 1, 1, 0];
    var jm = [0, 0, 1, 1];

    // Note that castab is arranged differently from the FORTRAN code because
    // Fortran and C/C++ arrays are transposed of each other, in this case
    // it is more tricky as castab is in 3 dimensions
    var castab = [
      [
        [0, 0, 8], [0, 2, 5], [7, 6, 9]
      ],
      [
        [0, 3, 4], [1, 3, 1], [4, 3, 0]
      ],
      [
        [9, 6, 7], [5, 2, 0], [8, 0, 0]
      ]
    ];

    for (var j=(jub-1);j>=jlb;j--) {
      for (var i=ilb;i<=iub-1;i++) {
        var temp1, temp2;
        temp1 = Math.min(d[i][j],d[i][j+1]);
        temp2 = Math.min(d[i+1][j],d[i+1][j+1]);
        dmin  = Math.min(temp1,temp2);
        temp1 = Math.max(d[i][j],d[i][j+1]);
        temp2 = Math.max(d[i+1][j],d[i+1][j+1]);
        dmax  = Math.max(temp1,temp2);

        if (dmax>=z[0]&&dmin<=z[nc-1]) {
          for (var k=0;k<nc;k++) {
            if (z[k]>=dmin&&z[k]<=dmax) {
              for (var m=4;m>=0;m--) {
                if (m>0) {
                  // The indexing of im and jm should be noted as it has to
                  // start from zero
                  h[m] = d[i+im[m-1]][j+jm[m-1]]-z[k];
                  xh[m] = x[i+im[m-1]];
                  yh[m] = y[j+jm[m-1]];
                } else {
                  h[0] = 0.25*(h[1]+h[2]+h[3]+h[4]);
                  xh[0]=0.5*(x[i]+x[i+1]);
                  yh[0]=0.5*(y[j]+y[j+1]);
                }
                if (h[m]>EPSILON) {
                  sh[m] = 1;
                } else if (h[m]<-EPSILON) {
                  sh[m] = -1;
                } else
                  sh[m] = 0;
              }
              //
              // Note: at this stage the relative heights of the corners and the
              // centre are in the h array, and the corresponding coordinates are
              // in the xh and yh arrays. The centre of the box is indexed by 0
              // and the 4 corners by 1 to 4 as shown below.
              // Each triangle is then indexed by the parameter m, and the 3
              // vertices of each triangle are indexed by parameters m1,m2,and
              // m3.
              // It is assumed that the centre of the box is always vertex 2
              // though this isimportant only when all 3 vertices lie exactly on
              // the same contour level, in which case only the side of the box
              // is drawn.
              //
              //
              //      vertex 4 +-------------------+ vertex 3
              //               | \               / |
              //               |   \    m-3    /   |
              //               |     \       /     |
              //               |       \   /       |
              //               |  m=2    X   m=2   |       the centre is vertex 0
              //               |       /   \       |
              //               |     /       \     |
              //               |   /    m=1    \   |
              //               | /               \ |
              //      vertex 1 +-------------------+ vertex 2
              //
              //
              //
              //               Scan each triangle in the box
              //
              for (m=1;m<=4;m++) {
                m1 = m;
                m2 = 0;
                if (m!=4) {
                    m3 = m+1;
                } else {
                    m3 = 1;
                }
                case_value = castab[sh[m1]+1][sh[m2]+1][sh[m3]+1];
                if (case_value!=0) {
                  switch (case_value) {
                    case 1: // Line between vertices 1 and 2
                      x1=xh[m1];
                      y1=yh[m1];
                      x2=xh[m2];
                      y2=yh[m2];
                      break;
                    case 2: // Line between vertices 2 and 3
                      x1=xh[m2];
                      y1=yh[m2];
                      x2=xh[m3];
                      y2=yh[m3];
                      break;
                    case 3: // Line between vertices 3 and 1
                      x1=xh[m3];
                      y1=yh[m3];
                      x2=xh[m1];
                      y2=yh[m1];
                      break;
                    case 4: // Line between vertex 1 and side 2-3
                      x1=xh[m1];
                      y1=yh[m1];
                      x2=xsect(m2,m3);
                      y2=ysect(m2,m3);
                      break;
                    case 5: // Line between vertex 2 and side 3-1
                      x1=xh[m2];
                      y1=yh[m2];
                      x2=xsect(m3,m1);
                      y2=ysect(m3,m1);
                      break;
                    case 6: //  Line between vertex 3 and side 1-2
                      x1=xh[m3];
                      y1=yh[m3];
                      x2=xsect(m1,m2);
                      y2=ysect(m1,m2);
                      break;
                    case 7: // Line between sides 1-2 and 2-3
                      x1=xsect(m1,m2);
                      y1=ysect(m1,m2);
                      x2=xsect(m2,m3);
                      y2=ysect(m2,m3);
                      break;
                    case 8: // Line between sides 2-3 and 3-1
                      x1=xsect(m2,m3);
                      y1=ysect(m2,m3);
                      x2=xsect(m3,m1);
                      y2=ysect(m3,m1);
                      break;
                    case 9: // Line between sides 3-1 and 1-2
                      x1=xsect(m3,m1);
                      y1=ysect(m3,m1);
                      x2=xsect(m1,m2);
                      y2=ysect(m1,m2);
                      break;
                    default:
                      break;
                  }
                  // Put your processing code here and comment out the printf
                  //printf("%f %f %f %f %f\n",x1,y1,x2,y2,z[k]);
                  drawContour(x1,y1,x2,y2,z[k],k);
                }
              }
            }
          }
        }
      }
    }
  }

},{"turf-extent":68,"turf-featurecollection":70,"turf-grid":93,"turf-inside":76,"turf-linestring":104,"turf-planepoint":95,"turf-square":127,"turf-tin":96}],93:[function(require,module,exports){
module.exports=require(84)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-isobands/node_modules/turf-grid/index.js":84,"turf-point":94}],94:[function(require,module,exports){
module.exports=require(67)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-explode/node_modules/turf-point/index.js":67}],95:[function(require,module,exports){
module.exports=require(86)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-isobands/node_modules/turf-planepoint/index.js":86}],96:[function(require,module,exports){
//http://en.wikipedia.org/wiki/Delaunay_triangulation
//https://github.com/ironwallaby/delaunay
var polygon = require('turf-polygon');
var nearest = require('turf-nearest');
var point = require('turf-point');

module.exports = function(points, z){
  //break down points
  var vertices = [];
  points.features.forEach(function(p){
    vertices.push({x:p.geometry.coordinates[0], y:p.geometry.coordinates[1]});
  })

  var triangulated = triangulate(vertices);
  var triangles = {
    type: 'FeatureCollection',
    features: []
  };

  triangulated.forEach(function(triangle){
    var coords = [[[triangle.a.x, triangle.a.y], [triangle.b.x, triangle.b.y], [triangle.c.x, triangle.c.y]]];
    var poly = polygon(coords, {a: null, b: null, c: null});

    triangles.features.push(poly);
  });
  if(z){
    // add values from vertices
    triangles.features.forEach(function(tri){
      var coordinateNumber = 1;
      tri.geometry.coordinates[0].forEach(function(c){
        var closest = nearest(point(c[0], c[1]), points);

        if(coordinateNumber === 1){
          tri.properties.a = closest.properties[z];
        }
        else if(coordinateNumber === 2){
          tri.properties.b = closest.properties[z];
        }
        else if(coordinateNumber === 3){
          tri.properties.c = closest.properties[z];
        }
        coordinateNumber++;
      });
    });
  }

  triangles.features.forEach(function(tri){
    tri = correctRings(tri);
  });
  
  return triangles;
}

function correctRings(poly){
  poly.geometry.coordinates.forEach(function(ring){
    var isWrapped =  ring[0] === ring.slice(-1)[0];
    if(!isWrapped){
      ring.push(ring[0]);
    }
  })
  return poly;
}

function Triangle(a, b, c) {
  this.a = a
  this.b = b
  this.c = c

  var A = b.x - a.x,
      B = b.y - a.y,
      C = c.x - a.x,
      D = c.y - a.y,
      E = A * (a.x + b.x) + B * (a.y + b.y),
      F = C * (a.x + c.x) + D * (a.y + c.y),
      G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
      minx, miny, dx, dy

  /* If the points of the triangle are collinear, then just find the
   * extremes and use the midpoint as the center of the circumcircle. */
  if(Math.abs(G) < 0.000001) {
    minx = Math.min(a.x, b.x, c.x)
    miny = Math.min(a.y, b.y, c.y)
    dx   = (Math.max(a.x, b.x, c.x) - minx) * 0.5
    dy   = (Math.max(a.y, b.y, c.y) - miny) * 0.5

    this.x = minx + dx
    this.y = miny + dy
    this.r = dx * dx + dy * dy
  }

  else {
    this.x = (D*E - B*F) / G
    this.y = (A*F - C*E) / G
    dx = this.x - a.x
    dy = this.y - a.y
    this.r = dx * dx + dy * dy
  }
}

Triangle.prototype.draw = function(ctx) {
  ctx.beginPath()
  ctx.moveTo(this.a.x, this.a.y)
  ctx.lineTo(this.b.x, this.b.y)
  ctx.lineTo(this.c.x, this.c.y)
  ctx.closePath()
  ctx.stroke()
}

function byX(a, b) {
  return b.x - a.x
}

function dedup(edges) {
  var j = edges.length,
      a, b, i, m, n

  outer: while(j) {
    b = edges[--j]
    a = edges[--j]
    i = j
    while(i) {
      n = edges[--i]
      m = edges[--i]
      if((a === m && b === n) || (a === n && b === m)) {
        edges.splice(j, 2)
        edges.splice(i, 2)
        j -= 2
        continue outer
      }
    }
  }
}

function triangulate(vertices) {
  /* Bail if there aren't enough vertices to form any triangles. */
  if(vertices.length < 3)
    return []

  /* Ensure the vertex array is in order of descending X coordinate
   * (which is needed to ensure a subquadratic runtime), and then find
   * the bounding box around the points. */
  vertices.sort(byX)

  var i    = vertices.length - 1,
      xmin = vertices[i].x,
      xmax = vertices[0].x,
      ymin = vertices[i].y,
      ymax = ymin

  while(i--) {
    if(vertices[i].y < ymin) ymin = vertices[i].y
    if(vertices[i].y > ymax) ymax = vertices[i].y
  }

  /* Find a supertriangle, which is a triangle that surrounds all the
   * vertices. This is used like something of a sentinel value to remove
   * cases in the main algorithm, and is removed before we return any
   * results.
   *
   * Once found, put it in the "open" list. (The "open" list is for
   * triangles who may still need to be considered; the "closed" list is
   * for triangles which do not.) */
  var dx     = xmax - xmin,
      dy     = ymax - ymin,
      dmax   = (dx > dy) ? dx : dy,
      xmid   = (xmax + xmin) * 0.5,
      ymid   = (ymax + ymin) * 0.5,
      open   = [
        new Triangle(
          {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true},
          {x: xmid            , y: ymid + 20 * dmax, __sentinel: true},
          {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true}
        )
      ],
      closed = [],
      edges = [],
      j, a, b

  /* Incrementally add each vertex to the mesh. */
  i = vertices.length
  while(i--) {
    /* For each open triangle, check to see if the current point is
     * inside it's circumcircle. If it is, remove the triangle and add
     * it's edges to an edge list. */
    edges.length = 0
    j = open.length
    while(j--) {
      /* If this point is to the right of this triangle's circumcircle,
       * then this triangle should never get checked again. Remove it
       * from the open list, add it to the closed list, and skip. */
      dx = vertices[i].x - open[j].x
      if(dx > 0 && dx * dx > open[j].r) {
        closed.push(open[j])
        open.splice(j, 1)
        continue
      }

      /* If not, skip this triangle. */
      dy = vertices[i].y - open[j].y
      if(dx * dx + dy * dy > open[j].r)
        continue

      /* Remove the triangle and add it's edges to the edge list. */
      edges.push(
        open[j].a, open[j].b,
        open[j].b, open[j].c,
        open[j].c, open[j].a
      )
      open.splice(j, 1)
    }

    /* Remove any doubled edges. */
    dedup(edges)

    /* Add a new triangle for each edge. */
    j = edges.length
    while(j) {
      b = edges[--j]
      a = edges[--j]
      open.push(new Triangle(a, b, vertices[i]))
    }
  }

  /* Copy any remaining open triangles to the closed list, and then
   * remove any triangles that share a vertex with the supertriangle. */
  Array.prototype.push.apply(closed, open)

  i = closed.length
  while(i--)
    if(closed[i].a.__sentinel ||
       closed[i].b.__sentinel ||
       closed[i].c.__sentinel)
      closed.splice(i, 1)

  /* Yay, we're done! */
  return closed
}

/*if (typeof module !== 'undefined') {
    module.exports = {
        Triangle: Triangle,
        triangulate: triangulate
    }
}*/

},{"turf-nearest":97,"turf-point":99,"turf-polygon":100}],97:[function(require,module,exports){
module.exports=require(88)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-isobands/node_modules/turf-tin/node_modules/turf-nearest/index.js":88,"turf-distance":98}],98:[function(require,module,exports){
module.exports=require(89)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-isobands/node_modules/turf-tin/node_modules/turf-nearest/node_modules/turf-distance/index.js":89}],99:[function(require,module,exports){
module.exports=require(67)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-explode/node_modules/turf-point/index.js":67}],100:[function(require,module,exports){
module.exports=require(34)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-bbox-polygon/node_modules/turf-polygon/index.js":34}],101:[function(require,module,exports){
var ss = require('simple-statistics');

module.exports = function(fc, field, num){
  var vals = [];
  var breaks = [];

  fc.features.forEach(function(feature){
    if(!(feature.properties[field]===undefined)){
      vals.push(feature.properties[field]);
    }
  });
  breaks = ss.jenks(vals, num);

  return breaks;
}

},{"simple-statistics":102}],102:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],103:[function(require,module,exports){
var polygon = require('turf-polygon');
var point = require('turf-point');
var fc = require('turf-featurecollection');

module.exports = function(polyIn) {
  var poly;
  var results = {intersections: fc([]), fixed: null};
  if (polyIn.type === 'Feature') {
    poly = polyIn.geometry;
  } else {
    poly = polyIn;
  }
  var intersectionHash = {};
  poly.coordinates.forEach(function(ring1){
    poly.coordinates.forEach(function(ring2){
      for(var i = 0; i < ring1.length-1; i++) {
        for(var k = 0; k < ring2.length-1; k++) {
          var intersection = lineIntersects(ring1[i][0],ring1[i][1],ring1[i+1][0],ring1[i+1][1],
            ring2[k][0],ring2[k][1],ring2[k+1][0],ring2[k+1][1]);
          if(intersection) {
            results.intersections.features.push(point(intersection[0], intersection[1]));
          }
        }
      }
    })
  })
  return results;
}


// modified from http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
function lineIntersects(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
  var denominator, a, b, numerator1, numerator2, result = {
    x: null,
    y: null,
    onLine1: false,
    onLine2: false
  };
  denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
  if (denominator == 0) {
    if(result.x != null && result.y != null) {
      return result;
    } else {
      return false;
    }
  }
  a = line1StartY - line2StartY;
  b = line1StartX - line2StartX;
  numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
  numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = line1StartX + (a * (line1EndX - line1StartX));
  result.y = line1StartY + (a * (line1EndY - line1StartY));

  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) {
    result.onLine1 = true;
  }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) {
    result.onLine2 = true;
  }
  // if line1 and line2 are segments, they intersect if both of the above are true
  if(result.onLine1 && result.onLine2){
    return [result.x, result.y];
  }
  else {
    return false;
  }
}

},{"turf-featurecollection":70,"turf-point":117,"turf-polygon":118}],104:[function(require,module,exports){
module.exports=require(37)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-bezier/node_modules/turf-linestring/index.js":37}],105:[function(require,module,exports){
var ss = require('simple-statistics');
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.max(values);
  })

  return polyFC;
}

},{"simple-statistics":106,"turf-inside":76}],106:[function(require,module,exports){
module.exports=require(52)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":52}],107:[function(require,module,exports){
var ss = require('simple-statistics');
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    });
    poly.properties[outField] = ss.median(values);
  });

  return polyFC;
}

},{"simple-statistics":108,"turf-inside":76}],108:[function(require,module,exports){
module.exports=require(52)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":52}],109:[function(require,module,exports){
var clone = require('clone');
var union = require('turf-union');

module.exports = function(polygons, done){

  var merged = clone(polygons.features[0]),
    features = polygons.features;

  for (var i = 0, len = features.length; i < len; i++) {
    var poly = features[i];

    if(poly.geometry){
      merged = union(merged, poly);
    }
  }

  return merged;
}

},{"clone":110,"turf-union":136}],110:[function(require,module,exports){
(function (Buffer){
'use strict';

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

// shim for Node's 'util' package
// DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
var util = {
  isArray: function (ar) {
    return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
  },
  isDate: function (d) {
    return typeof d === 'object' && objectToString(d) === '[object Date]';
  },
  isRegExp: function (re) {
    return typeof re === 'object' && objectToString(re) === '[object RegExp]';
  },
  getRegExpFlags: function (re) {
    var flags = '';
    re.global && (flags += 'g');
    re.ignoreCase && (flags += 'i');
    re.multiline && (flags += 'm');
    return flags;
  }
};


if (typeof module === 'object')
  module.exports = clone;

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
*/

function clone(parent, circular, depth, prototype) {
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth == 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (util.isArray(parent)) {
      child = [];
    } else if (util.isRegExp(parent)) {
      child = new RegExp(parent.source, util.getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (util.isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }
      
      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

}).call(this,require("buffer").Buffer)
},{"buffer":2}],111:[function(require,module,exports){
// http://cs.selu.edu/~rbyrd/math/midpoint/
// ((x1+x2)/2), ((y1+y2)/2)
var point = require('turf-point');

module.exports = function(point1, point2) {
  if(point1 === null || point2 === null || point1 && point2 === null){
    return new Error('Less than two points passed.');
  }

  var x1 = point1.geometry.coordinates[0];
  var x2 = point2.geometry.coordinates[0];
  var y1 = point1.geometry.coordinates[1];
  var y2 = point2.geometry.coordinates[1];

  var x3 = x1 + x2;
  var midX = x3/2;
  var y3 = y1 + y2;
  var midY = y3/2;

  var midpoint = point(midX, midY);

  return midpoint;
}
},{"turf-point":117}],112:[function(require,module,exports){
var ss = require('simple-statistics');
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    });
    poly.properties[outField] = ss.min(values);
  })

  return polyFC;
}

},{"simple-statistics":113,"turf-inside":76}],113:[function(require,module,exports){
module.exports=require(52)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":52}],114:[function(require,module,exports){
distance = require('turf-distance');

module.exports = function(targetPoint, points){
  var nearestPoint;
  var count = 0;
  var dist = Infinity;
  points.features.forEach(function(pt){
    if(!nearestPoint){
      nearestPoint = pt;
      var dist = distance(targetPoint, pt, 'miles');
      nearestPoint.properties.distance = dist;
    }
    else{
      var dist = distance(targetPoint, pt, 'miles');
      if(dist < nearestPoint.properties.distance){
        nearestPoint = pt;
        nearestPoint.properties.distance = dist;
      }
    }
  });
  delete nearestPoint.properties.distance;
  return nearestPoint;
}
},{"turf-distance":53}],115:[function(require,module,exports){
module.exports = function(point, triangle, done){
  var x = point.geometry.coordinates[0],
      y = point.geometry.coordinates[1],
      x1 = triangle.geometry.coordinates[0][0][0],
      y1 = triangle.geometry.coordinates[0][0][1],
      z1 = triangle.properties.a,
      x2 = triangle.geometry.coordinates[0][1][0],
      y2 = triangle.geometry.coordinates[0][1][1],
      z2 = triangle.properties.b,
      x3 = triangle.geometry.coordinates[0][2][0],
      y3 = triangle.geometry.coordinates[0][2][1],
      z3 = triangle.properties.c;

  var z = (z3 * (x-x1) * (y-y2) + z1 * (x-x2) * (y-y3) + z2 * (x-x3) * (y-y1)
      - z2 * (x-x1) * (y-y3) - z3 * (x-x2) * (y-y1) - z1 * (x-x3) * (y-y2)) /
      ((x-x1) * (y-y2) + (x-x2) * (y-y3) +(x-x3) * (y-y1) -
       (x-x1) * (y-y3) - (x-x2) * (y-y1) - (x-x3) * (y-y2));

  return z;
}

},{}],116:[function(require,module,exports){
var featureCollection = require('turf-featurecollection');
var centroid = require('turf-center');
var distance = require('turf-distance');
var inside = require('turf-inside');
var explode = require('turf-explode');

module.exports = function(fc) {
  // normalize
  if(fc.type != 'FeatureCollection') {
    if(fc.type != 'Feature') {
      fc = {
        type: 'Feature',
        geometry: fc
      };
    }
    fc = featureCollection([fc]);
  }

  //get centroid
  var cent = centroid(fc);

  // check to see if centroid is on surface
  var onSurface = false;
  var i = 0;
  while(!onSurface && i < fc.features.length) {
    var geom = fc.features[i].geometry;
    if (geom.type === 'Point') {
      if (cent.geometry.coordinates[0] === geom.coordinates[0] &&
        cent.geometry.coordinates[1] === geom.coordinates[1]) {
        onSurface = true;
      }
    } else if(geom.type === 'MultiPoint') {
      var onMultiPoint = false;
      var k = 0;
      while(!onMultiPoint && k < geom.coordinates.length) {
        if (cent.geometry.coordinates[0] === geom.coordinates[k][0] &&
          cent.geometry.coordinates[1] === geom.coordinates[k][1]) {
          onSurface = true;
          onMultiPoint = true;
        }
        k++;
      }
    } else if(geom.type === 'LineString') {
      var onLine = false;
      var k = 0;
      while(!onLine && k < geom.coordinates.length - 1) {
        var x = cent.geometry.coordinates[0];
        var y = cent.geometry.coordinates[1];
        var x1 = geom.coordinates[k][0];
        var y1 = geom.coordinates[k][1];
        var x2 = geom.coordinates[k+1][0];
        var y2 = geom.coordinates[k+1][1];
        if(pointOnSegment(x, y, x1, y1, x2, y2)) {
          onLine = true;
          onSurface = true;
        }
        k++;
      }
    } else if(geom.type === 'MultiLineString') {
      var onMultiLine = false;
      var j = 0;
      while(!onMultiLine && j < geom.coordinates.length) {
        var onLine = false;
        var k = 0;
        var line = geom.coordinates[j];
        while(!onLine && k < line.length - 1) {
          var x = cent.geometry.coordinates[0];
          var y = cent.geometry.coordinates[1];
          var x1 = line[k][0];
          var y1 = line[k][1];
          var x2 = line[k+1][0];
          var y2 = line[k+1][1];
          if(pointOnSegment(x, y, x1, y1, x2, y2)) {
            onLine = true;
            onSurface = true;
          }
          k++;
        }
        j++;
      }
    } else if(geom.type === 'Polygon' || geom.type === 'MultiPolygon') {
      var f = {
        type: 'Feature',
        geometry: geom
      };
      if(inside(cent, f)) {
        onSurface = true;
      }
    } 
    i++;
  }
  if(onSurface) {
    return cent;
  } else {
    var vertices = featureCollection([]);
    for(var i = 0; i < fc.features.length; i++) {
      vertices.features = vertices.features.concat(explode(fc.features[i]).features);
    }
    var closestVertex;
    var closestDistance = Infinity;
    for(var i = 0; i < vertices.features.length; i++) {
      var dist = distance(cent, vertices.features[i], 'miles');
      if(dist < closestDistance) {
        closestDistance = dist;
        closestVertex = vertices.features[i];
      }
    }
    return closestVertex;
  }
}

function pointOnSegment (x, y, x1, y1, x2, y2) {
  var ab = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
  var ap = Math.sqrt((x-x1)*(x-x1)+(y-y1)*(y-y1));
  var pb = Math.sqrt((x2-x)*(x2-x)+(y2-y)*(y2-y));
  if(ab === ap + pb) {
    return true;
  }
}
},{"turf-center":43,"turf-distance":53,"turf-explode":64,"turf-featurecollection":70,"turf-inside":76}],117:[function(require,module,exports){
module.exports = function(x, y, properties){
  if(x instanceof Array) {
  	properties = y;
  	y = x[1];
  	x = x[0];
  } else if(isNaN(x) || isNaN(y)) throw new Error('Invalid coordinates')
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [x, y]
    },
    properties: properties || {}
  };
}

},{}],118:[function(require,module,exports){
module.exports = function(coordinates, properties){
  if(coordinates === null) return new Error('No coordinates passed');
  var polygon = { 
    "type": "Feature",
    "geometry": {
      "type": "Polygon",
      "coordinates": coordinates
    },
    "properties": properties
  };

  if(!polygon.properties){
    polygon.properties = {};
  }
  
  return polygon;
}
},{}],119:[function(require,module,exports){
var ss = require('simple-statistics');

module.exports = function(fc, field, percentiles){
  var vals = [];
  var quantiles = [];

  fc.features.forEach(function(feature){
    vals.push(feature.properties[field]);
  })
  percentiles.forEach(function(percentile){
    quantiles.push(ss.quantile(vals, percentile * .01));
  })
  
  return quantiles;
}

},{"simple-statistics":120}],120:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],121:[function(require,module,exports){
var featurecollection = require('turf-featurecollection');
var reclass = require('./index.js');

module.exports = function(fc, inField, outField, translations, done){
  var reclassed = featurecollection([]);

  fc.features.forEach(function(feature){
    var reclassedFeature;
    var found = false;
    for(var i = 0; i < translations.length; i++){
      if(feature.properties[inField] >= translations[i][0] && feature.properties[inField] <= translations[i][1]) {
        feature.properties[outField] = translations[i][2];
      }
    }
    reclassed.features.push(feature);
  })

  return reclassed;
}

},{"./index.js":121,"turf-featurecollection":70}],122:[function(require,module,exports){
var featureCollection = require('turf-featurecollection');

module.exports = function(collection, key, val) {
  var newFC = featureCollection([]);
  for(var i = 0; i < collection.features.length; i++) {
    if(collection.features[i].properties[key] != val) {
      newFC.features.push(collection.features[i]);
    }
  }
  return newFC;
}
},{"turf-featurecollection":70}],123:[function(require,module,exports){
// http://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
featureCollection = require('turf-featurecollection');

module.exports = function(fc, num){
  var outFC = featureCollection(getRandomSubarray(fc.features, num));
  return outFC;
}

function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
},{"turf-featurecollection":70}],124:[function(require,module,exports){
var simplify = require('simplify-js');

module.exports = function(feature, tolerance, highQuality){
  if(feature.geometry.type === 'LineString') {
    var line = {
      type: 'LineString',
      coordinates: []
    };
    var pts = feature.geometry.coordinates.map(function(coord) {
      return {x: coord[0], y: coord[1]};
    });
    line.coordinates = simplify(pts, tolerance, highQuality).map(function(coords){
      return [coords.x, coords.y];
    });
    
    return simpleFeature(line, feature.properties);
  } else if(feature.geometry.type === 'Polygon') {
    var poly = {
      type: 'Polygon',
      coordinates: []
    };
    feature.geometry.coordinates.forEach(function(ring){
      var pts = ring.map(function(coord) {
        return {x: coord[0], y: coord[1]};
      });
      var simpleRing = simplify(pts, tolerance, highQuality).map(function(coords){
        return [coords.x, coords.y];
      });
      poly.coordinates.push(simpleRing);
    });
    return simpleFeature(poly, feature.properties)
  }
}

function simpleFeature (geom, properties) {
  return {
    type: 'Feature',
    geometry: geom,
    properties: properties
  };
}
},{"simplify-js":125}],125:[function(require,module,exports){
/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (typeof define === 'function' && define.amd) define(function() { return simplify; });
else if (typeof module !== 'undefined') module.exports = simplify;
else if (typeof self !== 'undefined') self.simplify = simplify;
else window.simplify = simplify;

})();

},{}],126:[function(require,module,exports){
module.exports = function(bbox, factor){
  var currentXDistance = (bbox[2] - bbox[0]);
  var currentYDistance = (bbox[3] - bbox[1]);
  var newXDistance = currentXDistance * factor;
  var newYDistance = currentYDistance * factor;
  var xChange = newXDistance - currentXDistance;
  var yChange = newYDistance - currentYDistance;

  var lowX = bbox[0] - (xChange / 2);
  var lowY = bbox[1] - (yChange / 2);
  var highX = (xChange / 2) + bbox[2];
  var highY = (yChange / 2) + bbox[3];

  var sized = [lowX, lowY, highX, highY];
  return sized;
}
},{}],127:[function(require,module,exports){
var midpoint = require('turf-midpoint');
var point = require('turf-point');
var distance = require('turf-distance');

module.exports = function(bbox){
  var squareBbox = [0,0,0,0];
  var lowLeft = point(bbox[0], bbox[1]);
  var topLeft = point(bbox[0], bbox[3]);
  var topRight = point(bbox[2], bbox[3]);
  var lowRight = point(bbox[2], bbox[1]);

  var horizontalDistance = distance(lowLeft, lowRight, 'miles');
  var verticalDistance = distance(lowLeft, topLeft, 'miles');
  if(horizontalDistance >= verticalDistance){
    squareBbox[0] = bbox[0];
    squareBbox[2] = bbox[2];
    var verticalMidpoint = midpoint(lowLeft, topLeft);
    squareBbox[1] = verticalMidpoint.geometry.coordinates[1] - ((bbox[2] - bbox[0]) / 2);
    squareBbox[3] = verticalMidpoint.geometry.coordinates[1] + ((bbox[2] - bbox[0]) / 2);
    return squareBbox;
  }
  else {
    squareBbox[1] = bbox[1];
    squareBbox[3] = bbox[3];
    var horzontalMidpoint = midpoint(lowLeft, lowRight);
    squareBbox[0] = horzontalMidpoint.geometry.coordinates[0] - ((bbox[3] - bbox[1]) / 2);
    squareBbox[2] = horzontalMidpoint.geometry.coordinates[0] + ((bbox[3] - bbox[1]) / 2);
    return squareBbox;
  }
}


},{"turf-distance":128,"turf-midpoint":129,"turf-point":117}],128:[function(require,module,exports){
module.exports=require(89)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-isobands/node_modules/turf-tin/node_modules/turf-nearest/node_modules/turf-distance/index.js":89}],129:[function(require,module,exports){
// http://cs.selu.edu/~rbyrd/math/midpoint/
// ((x1+x2)/2), ((y1+y2)/2)
var point = require('turf-point')

module.exports = function(point1, point2) {
  if(point1 === null || point2 === null || point1 && point2 === null){
    return new Error('Less than two points passed.')
  }

  var x1 = point1.geometry.coordinates[0];
  var x2 = point2.geometry.coordinates[0];
  var y1 = point1.geometry.coordinates[1];
  var y2 = point2.geometry.coordinates[1];

  var x3 = x1 + x2;
  var midX = x3/2;
  var y3 = y1 + y2;
  var midY = y3/2;

  var midpoint = point(midX, midY);

  return midpoint
}
},{"turf-point":130}],130:[function(require,module,exports){
module.exports=require(67)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-explode/node_modules/turf-point/index.js":67}],131:[function(require,module,exports){
var ss = require('simple-statistics');
var inside = require('turf-inside');

module.exports = function(polyFC, ptFC, inField, outField, done){
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    })
    poly.properties[outField] = ss.sum(values);
  })

  return polyFC;
}

},{"simple-statistics":132,"turf-inside":133}],132:[function(require,module,exports){
module.exports=require(12)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":12}],133:[function(require,module,exports){
module.exports=require(8)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-aggregate/node_modules/turf-average/node_modules/turf-inside/index.js":8}],134:[function(require,module,exports){
inside = require('turf-inside');

module.exports = function(points, polygons, field, outField){
  points.features.forEach(function(pt){
    if(!pt.properties){
      pt.properties = {};
    }
    polygons.features.forEach(function(poly){
      if(!pt.properties[outField]){
        var isInside = inside(pt, poly);
        if(isInside){
          pt.properties[outField] = poly.properties[field];
        }
        else{
          pt.properties[outField] = null;
        }
      }
    });
  })
  return points;
}
},{"turf-inside":76}],135:[function(require,module,exports){
arguments[4][96][0].apply(exports,arguments)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-isolines/node_modules/turf-tin/index.js":96,"turf-nearest":114,"turf-point":117,"turf-polygon":118}],136:[function(require,module,exports){
// look here for help http://svn.osgeo.org/grass/grass/branches/releasebranch_6_4/vector/v.overlay/main.c
//must be array of polygons

// depend on jsts for now https://github.com/bjornharrtell/jsts/blob/master/examples/overlay.html

var jsts = require('jsts');

module.exports = function(poly1, poly2){
  var reader = new jsts.io.GeoJSONReader();
  var a = reader.read(JSON.stringify(poly1.geometry));
  var b = reader.read(JSON.stringify(poly2.geometry));
  var union = a.union(b);
  var parser = new jsts.io.GeoJSONParser();

  union = parser.write(union);
  return {
    type: 'Feature',
    geometry: union,
    properties: poly1.properties
  };
}

},{"jsts":137}],137:[function(require,module,exports){
module.exports=require(39)
},{"./lib/jsts":138,"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/index.js":39,"javascript.util":140}],138:[function(require,module,exports){
module.exports=require(40)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/lib/jsts.js":40}],139:[function(require,module,exports){
module.exports=require(41)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/node_modules/javascript.util/dist/javascript.util-node.min.js":41}],140:[function(require,module,exports){
module.exports=require(42)
},{"./dist/javascript.util-node.min.js":139,"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-buffer/node_modules/jsts/node_modules/javascript.util/index.js":42}],141:[function(require,module,exports){
var ss = require('simple-statistics');
var inside = require('turf-inside');

module.exports = function (polyFC, ptFC, inField, outField, done) {
  polyFC.features.forEach(function(poly){
    if(!poly.properties){
      poly.properties = {};
    }
    var values = [];
    ptFC.features.forEach(function(pt){
      if (inside(pt, poly)) {
        values.push(pt.properties[inField]);
      }
    });
    poly.properties[outField] = ss.variance(values);
  })

  return polyFC;
}
},{"simple-statistics":142,"turf-inside":76}],142:[function(require,module,exports){
module.exports=require(52)
},{"/Users/morgan/Documents/projects/turfjs/turf/node_modules/turf-deviation/node_modules/simple-statistics/src/simple_statistics.js":52}],143:[function(require,module,exports){
var inside = require('turf-inside');
var featureCollection = require('turf-featurecollection');

module.exports = function(ptFC, polyFC){
  pointsWithin = featureCollection([]);
  polyFC.features.forEach(function(poly){
    ptFC.features.forEach(function(pt){
      var isInside = inside(pt, poly);
      if(isInside){
        pointsWithin.features.push(pt);
      }
    });
  });
  return pointsWithin;
}
},{"turf-featurecollection":70,"turf-inside":76}]},{},[1])(1)
});