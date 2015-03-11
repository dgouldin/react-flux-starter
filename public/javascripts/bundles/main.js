(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
'use strict';
var $ = require('jquery');
$(function() {
  var React = require('react/addons');
  var Router = require('react-router');
  window.React = React;
  React.initializeTouchEvents(true);
  var Services = require('./services');
  Services.initialize(window.EX.const.apiAccessToken);
  var Stores = require('./stores');
  Stores.initialize();
  window._stores = Stores;
  var Routes = require('./routes.jsx');
  var router = Router.create({
    routes: Routes,
    location: Router.HistoryLocation,
    onError: function() {
      alert('unexpected error in Router');
    }
  });
  router.run(function(Handler) {
    React.render(React.createElement(Handler, null), document.body);
  });
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/main.jsx
},{"./routes.jsx":20,"./services":22,"./stores":24,"jquery":"jquery","react-router":"react-router","react/addons":"react/addons"}],2:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.Immutable = factory()
}(this, function () { 'use strict';var SLICE$0 = Array.prototype.slice;

  function createClass(ctor, superClass) {
    if (superClass) {
      ctor.prototype = Object.create(superClass.prototype);
    }
    ctor.prototype.constructor = ctor;
  }

  // Used for setting prototype methods that IE8 chokes on.
  var DELETE = 'delete';

  // Constants describing the size of trie nodes.
  var SHIFT = 5; // Resulted in best performance after ______?
  var SIZE = 1 << SHIFT;
  var MASK = SIZE - 1;

  // A consistent shared value representing "not set" which equals nothing other
  // than itself, and nothing that could be provided externally.
  var NOT_SET = {};

  // Boolean references, Rough equivalent of `bool &`.
  var CHANGE_LENGTH = { value: false };
  var DID_ALTER = { value: false };

  function MakeRef(ref) {
    ref.value = false;
    return ref;
  }

  function SetRef(ref) {
    ref && (ref.value = true);
  }

  // A function which returns a value representing an "owner" for transient writes
  // to tries. The return value will only ever equal itself, and will not equal
  // the return of any subsequent call of this function.
  function OwnerID() {}

  // http://jsperf.com/copy-array-inline
  function arrCopy(arr, offset) {
    offset = offset || 0;
    var len = Math.max(0, arr.length - offset);
    var newArr = new Array(len);
    for (var ii = 0; ii < len; ii++) {
      newArr[ii] = arr[ii + offset];
    }
    return newArr;
  }

  function ensureSize(iter) {
    if (iter.size === undefined) {
      iter.size = iter.__iterate(returnTrue);
    }
    return iter.size;
  }

  function wrapIndex(iter, index) {
    return index >= 0 ? (+index) : ensureSize(iter) + (+index);
  }

  function returnTrue() {
    return true;
  }

  function wholeSlice(begin, end, size) {
    return (begin === 0 || (size !== undefined && begin <= -size)) &&
      (end === undefined || (size !== undefined && end >= size));
  }

  function resolveBegin(begin, size) {
    return resolveIndex(begin, size, 0);
  }

  function resolveEnd(end, size) {
    return resolveIndex(end, size, size);
  }

  function resolveIndex(index, size, defaultIndex) {
    return index === undefined ?
      defaultIndex :
      index < 0 ?
        Math.max(0, size + index) :
        size === undefined ?
          index :
          Math.min(size, index);
  }

  function Iterable(value) {
      return isIterable(value) ? value : Seq(value);
    }


  createClass(KeyedIterable, Iterable);
    function KeyedIterable(value) {
      return isKeyed(value) ? value : KeyedSeq(value);
    }


  createClass(IndexedIterable, Iterable);
    function IndexedIterable(value) {
      return isIndexed(value) ? value : IndexedSeq(value);
    }


  createClass(SetIterable, Iterable);
    function SetIterable(value) {
      return isIterable(value) && !isAssociative(value) ? value : SetSeq(value);
    }



  function isIterable(maybeIterable) {
    return !!(maybeIterable && maybeIterable[IS_ITERABLE_SENTINEL]);
  }

  function isKeyed(maybeKeyed) {
    return !!(maybeKeyed && maybeKeyed[IS_KEYED_SENTINEL]);
  }

  function isIndexed(maybeIndexed) {
    return !!(maybeIndexed && maybeIndexed[IS_INDEXED_SENTINEL]);
  }

  function isAssociative(maybeAssociative) {
    return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
  }

  function isOrdered(maybeOrdered) {
    return !!(maybeOrdered && maybeOrdered[IS_ORDERED_SENTINEL]);
  }

  Iterable.isIterable = isIterable;
  Iterable.isKeyed = isKeyed;
  Iterable.isIndexed = isIndexed;
  Iterable.isAssociative = isAssociative;
  Iterable.isOrdered = isOrdered;

  Iterable.Keyed = KeyedIterable;
  Iterable.Indexed = IndexedIterable;
  Iterable.Set = SetIterable;


  var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  /* global Symbol */

  var ITERATE_KEYS = 0;
  var ITERATE_VALUES = 1;
  var ITERATE_ENTRIES = 2;

  var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;


  function src_Iterator__Iterator(next) {
      this.next = next;
    }

    src_Iterator__Iterator.prototype.toString = function() {
      return '[Iterator]';
    };


  src_Iterator__Iterator.KEYS = ITERATE_KEYS;
  src_Iterator__Iterator.VALUES = ITERATE_VALUES;
  src_Iterator__Iterator.ENTRIES = ITERATE_ENTRIES;

  src_Iterator__Iterator.prototype.inspect =
  src_Iterator__Iterator.prototype.toSource = function () { return this.toString(); }
  src_Iterator__Iterator.prototype[ITERATOR_SYMBOL] = function () {
    return this;
  };


  function iteratorValue(type, k, v, iteratorResult) {
    var value = type === 0 ? k : type === 1 ? v : [k, v];
    iteratorResult ? (iteratorResult.value = value) : (iteratorResult = {
      value: value, done: false
    });
    return iteratorResult;
  }

  function iteratorDone() {
    return { value: undefined, done: true };
  }

  function hasIterator(maybeIterable) {
    return !!getIteratorFn(maybeIterable);
  }

  function isIterator(maybeIterator) {
    return maybeIterator && typeof maybeIterator.next === 'function';
  }

  function getIterator(iterable) {
    var iteratorFn = getIteratorFn(iterable);
    return iteratorFn && iteratorFn.call(iterable);
  }

  function getIteratorFn(iterable) {
    var iteratorFn = iterable && (
      (REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
      iterable[FAUX_ITERATOR_SYMBOL]
    );
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  function isArrayLike(value) {
    return value && typeof value.length === 'number';
  }

  createClass(Seq, Iterable);
    function Seq(value) {
      return value === null || value === undefined ? emptySequence() :
        isIterable(value) ? value.toSeq() : seqFromValue(value);
    }

    Seq.of = function(/*...values*/) {
      return Seq(arguments);
    };

    Seq.prototype.toSeq = function() {
      return this;
    };

    Seq.prototype.toString = function() {
      return this.__toString('Seq {', '}');
    };

    Seq.prototype.cacheResult = function() {
      if (!this._cache && this.__iterateUncached) {
        this._cache = this.entrySeq().toArray();
        this.size = this._cache.length;
      }
      return this;
    };

    // abstract __iterateUncached(fn, reverse)

    Seq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, true);
    };

    // abstract __iteratorUncached(type, reverse)

    Seq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, true);
    };



  createClass(KeyedSeq, Seq);
    function KeyedSeq(value) {
      return value === null || value === undefined ?
        emptySequence().toKeyedSeq() :
        isIterable(value) ?
          (isKeyed(value) ? value.toSeq() : value.fromEntrySeq()) :
          keyedSeqFromValue(value);
    }

    KeyedSeq.prototype.toKeyedSeq = function() {
      return this;
    };



  createClass(IndexedSeq, Seq);
    function IndexedSeq(value) {
      return value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value.toIndexedSeq();
    }

    IndexedSeq.of = function(/*...values*/) {
      return IndexedSeq(arguments);
    };

    IndexedSeq.prototype.toIndexedSeq = function() {
      return this;
    };

    IndexedSeq.prototype.toString = function() {
      return this.__toString('Seq [', ']');
    };

    IndexedSeq.prototype.__iterate = function(fn, reverse) {
      return seqIterate(this, fn, reverse, false);
    };

    IndexedSeq.prototype.__iterator = function(type, reverse) {
      return seqIterator(this, type, reverse, false);
    };



  createClass(SetSeq, Seq);
    function SetSeq(value) {
      return (
        value === null || value === undefined ? emptySequence() :
        !isIterable(value) ? indexedSeqFromValue(value) :
        isKeyed(value) ? value.entrySeq() : value
      ).toSetSeq();
    }

    SetSeq.of = function(/*...values*/) {
      return SetSeq(arguments);
    };

    SetSeq.prototype.toSetSeq = function() {
      return this;
    };



  Seq.isSeq = isSeq;
  Seq.Keyed = KeyedSeq;
  Seq.Set = SetSeq;
  Seq.Indexed = IndexedSeq;

  var IS_SEQ_SENTINEL = '@@__IMMUTABLE_SEQ__@@';

  Seq.prototype[IS_SEQ_SENTINEL] = true;



  // #pragma Root Sequences

  createClass(ArraySeq, IndexedSeq);
    function ArraySeq(array) {
      this._array = array;
      this.size = array.length;
    }

    ArraySeq.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
    };

    ArraySeq.prototype.__iterate = function(fn, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(array[reverse ? maxIndex - ii : ii], ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ArraySeq.prototype.__iterator = function(type, reverse) {
      var array = this._array;
      var maxIndex = array.length - 1;
      var ii = 0;
      return new src_Iterator__Iterator(function() 
        {return ii > maxIndex ?
          iteratorDone() :
          iteratorValue(type, ii, array[reverse ? maxIndex - ii++ : ii++])}
      );
    };



  createClass(ObjectSeq, KeyedSeq);
    function ObjectSeq(object) {
      var keys = Object.keys(object);
      this._object = object;
      this._keys = keys;
      this.size = keys.length;
    }

    ObjectSeq.prototype.get = function(key, notSetValue) {
      if (notSetValue !== undefined && !this.has(key)) {
        return notSetValue;
      }
      return this._object[key];
    };

    ObjectSeq.prototype.has = function(key) {
      return this._object.hasOwnProperty(key);
    };

    ObjectSeq.prototype.__iterate = function(fn, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var key = keys[reverse ? maxIndex - ii : ii];
        if (fn(object[key], key, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    ObjectSeq.prototype.__iterator = function(type, reverse) {
      var object = this._object;
      var keys = this._keys;
      var maxIndex = keys.length - 1;
      var ii = 0;
      return new src_Iterator__Iterator(function()  {
        var key = keys[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, key, object[key]);
      });
    };

  ObjectSeq.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(IterableSeq, IndexedSeq);
    function IterableSeq(iterable) {
      this._iterable = iterable;
      this.size = iterable.length || iterable.size;
    }

    IterableSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      var iterations = 0;
      if (isIterator(iterator)) {
        var step;
        while (!(step = iterator.next()).done) {
          if (fn(step.value, iterations++, this) === false) {
            break;
          }
        }
      }
      return iterations;
    };

    IterableSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterable = this._iterable;
      var iterator = getIterator(iterable);
      if (!isIterator(iterator)) {
        return new src_Iterator__Iterator(iteratorDone);
      }
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step : iteratorValue(type, iterations++, step.value);
      });
    };



  createClass(IteratorSeq, IndexedSeq);
    function IteratorSeq(iterator) {
      this._iterator = iterator;
      this._iteratorCache = [];
    }

    IteratorSeq.prototype.__iterateUncached = function(fn, reverse) {
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      while (iterations < cache.length) {
        if (fn(cache[iterations], iterations++, this) === false) {
          return iterations;
        }
      }
      var step;
      while (!(step = iterator.next()).done) {
        var val = step.value;
        cache[iterations] = val;
        if (fn(val, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };

    IteratorSeq.prototype.__iteratorUncached = function(type, reverse) {
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = this._iterator;
      var cache = this._iteratorCache;
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        if (iterations >= cache.length) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          cache[iterations] = step.value;
        }
        return iteratorValue(type, iterations, cache[iterations++]);
      });
    };




  // # pragma Helper functions

  function isSeq(maybeSeq) {
    return !!(maybeSeq && maybeSeq[IS_SEQ_SENTINEL]);
  }

  var EMPTY_SEQ;

  function emptySequence() {
    return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
  }

  function keyedSeqFromValue(value) {
    var seq =
      Array.isArray(value) ? new ArraySeq(value).fromEntrySeq() :
      isIterator(value) ? new IteratorSeq(value).fromEntrySeq() :
      hasIterator(value) ? new IterableSeq(value).fromEntrySeq() :
      typeof value === 'object' ? new ObjectSeq(value) :
      undefined;
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of [k, v] entries, '+
        'or keyed object: ' + value
      );
    }
    return seq;
  }

  function indexedSeqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value);
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values: ' + value
      );
    }
    return seq;
  }

  function seqFromValue(value) {
    var seq = maybeIndexedSeqFromValue(value) ||
      (typeof value === 'object' && new ObjectSeq(value));
    if (!seq) {
      throw new TypeError(
        'Expected Array or iterable object of values, or keyed object: ' + value
      );
    }
    return seq;
  }

  function maybeIndexedSeqFromValue(value) {
    return (
      isArrayLike(value) ? new ArraySeq(value) :
      isIterator(value) ? new IteratorSeq(value) :
      hasIterator(value) ? new IterableSeq(value) :
      undefined
    );
  }

  function seqIterate(seq, fn, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      for (var ii = 0; ii <= maxIndex; ii++) {
        var entry = cache[reverse ? maxIndex - ii : ii];
        if (fn(entry[1], useKeys ? entry[0] : ii, seq) === false) {
          return ii + 1;
        }
      }
      return ii;
    }
    return seq.__iterateUncached(fn, reverse);
  }

  function seqIterator(seq, type, reverse, useKeys) {
    var cache = seq._cache;
    if (cache) {
      var maxIndex = cache.length - 1;
      var ii = 0;
      return new src_Iterator__Iterator(function()  {
        var entry = cache[reverse ? maxIndex - ii : ii];
        return ii++ > maxIndex ?
          iteratorDone() :
          iteratorValue(type, useKeys ? entry[0] : ii - 1, entry[1]);
      });
    }
    return seq.__iteratorUncached(type, reverse);
  }

  createClass(Collection, Iterable);
    function Collection() {
      throw TypeError('Abstract');
    }


  createClass(KeyedCollection, Collection);function KeyedCollection() {}

  createClass(IndexedCollection, Collection);function IndexedCollection() {}

  createClass(SetCollection, Collection);function SetCollection() {}


  Collection.Keyed = KeyedCollection;
  Collection.Indexed = IndexedCollection;
  Collection.Set = SetCollection;

  /**
   * An extension of the "same-value" algorithm as [described for use by ES6 Map
   * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
   *
   * NaN is considered the same as NaN, however -0 and 0 are considered the same
   * value, which is different from the algorithm described by
   * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
   *
   * This is extended further to allow Objects to describe the values they
   * represent, by way of `valueOf` or `equals` (and `hashCode`).
   *
   * Note: because of this extension, the key equality of Immutable.Map and the
   * value equality of Immutable.Set will differ from ES6 Map and Set.
   *
   * ### Defining custom values
   *
   * The easiest way to describe the value an object represents is by implementing
   * `valueOf`. For example, `Date` represents a value by returning a unix
   * timestamp for `valueOf`:
   *
   *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
   *     var date2 = new Date(1234567890000);
   *     date1.valueOf(); // 1234567890000
   *     assert( date1 !== date2 );
   *     assert( Immutable.is( date1, date2 ) );
   *
   * Note: overriding `valueOf` may have other implications if you use this object
   * where JavaScript expects a primitive, such as implicit string coercion.
   *
   * For more complex types, especially collections, implementing `valueOf` may
   * not be performant. An alternative is to implement `equals` and `hashCode`.
   *
   * `equals` takes another object, presumably of similar type, and returns true
   * if the it is equal. Equality is symmetrical, so the same result should be
   * returned if this and the argument are flipped.
   *
   *     assert( a.equals(b) === b.equals(a) );
   *
   * `hashCode` returns a 32bit integer number representing the object which will
   * be used to determine how to store the value object in a Map or Set. You must
   * provide both or neither methods, one must not exist without the other.
   *
   * Also, an important relationship between these methods must be upheld: if two
   * values are equal, they *must* return the same hashCode. If the values are not
   * equal, they might have the same hashCode; this is called a hash collision,
   * and while undesirable for performance reasons, it is acceptable.
   *
   *     if (a.equals(b)) {
   *       assert( a.hashCode() === b.hashCode() );
   *     }
   *
   * All Immutable collections implement `equals` and `hashCode`.
   *
   */
  function is(valueA, valueB) {
    if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
      return true;
    }
    if (!valueA || !valueB) {
      return false;
    }
    if (typeof valueA.valueOf === 'function' &&
        typeof valueB.valueOf === 'function') {
      valueA = valueA.valueOf();
      valueB = valueB.valueOf();
    }
    return typeof valueA.equals === 'function' &&
      typeof valueB.equals === 'function' ?
        valueA.equals(valueB) :
        valueA === valueB || (valueA !== valueA && valueB !== valueB);
  }

  function fromJS(json, converter) {
    return converter ?
      fromJSWith(converter, json, '', {'': json}) :
      fromJSDefault(json);
  }

  function fromJSWith(converter, json, key, parentJSON) {
    if (Array.isArray(json)) {
      return converter.call(parentJSON, key, IndexedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    if (isPlainObj(json)) {
      return converter.call(parentJSON, key, KeyedSeq(json).map(function(v, k)  {return fromJSWith(converter, v, k, json)}));
    }
    return json;
  }

  function fromJSDefault(json) {
    if (Array.isArray(json)) {
      return IndexedSeq(json).map(fromJSDefault).toList();
    }
    if (isPlainObj(json)) {
      return KeyedSeq(json).map(fromJSDefault).toMap();
    }
    return json;
  }

  function isPlainObj(value) {
    return value && (value.constructor === Object || value.constructor === undefined);
  }

  var src_Math__imul =
    typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2 ?
    Math.imul :
    function src_Math__imul(a, b) {
      a = a | 0; // int
      b = b | 0; // int
      var c = a & 0xffff;
      var d = b & 0xffff;
      // Shift by 0 fixes the sign on the high part.
      return (c * d) + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0) | 0; // int
    };

  // v8 has an optimization for storing 31-bit signed numbers.
  // Values which have either 00 or 11 as the high order bits qualify.
  // This function drops the highest order bit in a signed number, maintaining
  // the sign bit.
  function smi(i32) {
    return ((i32 >>> 1) & 0x40000000) | (i32 & 0xBFFFFFFF);
  }

  function hash(o) {
    if (o === false || o === null || o === undefined) {
      return 0;
    }
    if (typeof o.valueOf === 'function') {
      o = o.valueOf();
      if (o === false || o === null || o === undefined) {
        return 0;
      }
    }
    if (o === true) {
      return 1;
    }
    var type = typeof o;
    if (type === 'number') {
      var h = o | 0;
      if (h !== o) {
        h ^= o * 0xFFFFFFFF;
      }
      while (o > 0xFFFFFFFF) {
        o /= 0xFFFFFFFF;
        h ^= o;
      }
      return smi(h);
    }
    if (type === 'string') {
      return o.length > STRING_HASH_CACHE_MIN_STRLEN ? cachedHashString(o) : hashString(o);
    }
    if (typeof o.hashCode === 'function') {
      return o.hashCode();
    }
    return hashJSObj(o);
  }

  function cachedHashString(string) {
    var hash = stringHashCache[string];
    if (hash === undefined) {
      hash = hashString(string);
      if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
        STRING_HASH_CACHE_SIZE = 0;
        stringHashCache = {};
      }
      STRING_HASH_CACHE_SIZE++;
      stringHashCache[string] = hash;
    }
    return hash;
  }

  // http://jsperf.com/hashing-strings
  function hashString(string) {
    // This is the hash from JVM
    // The hash code for a string is computed as
    // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
    // where s[i] is the ith character of the string and n is the length of
    // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
    // (exclusive) by dropping high bits.
    var hash = 0;
    for (var ii = 0; ii < string.length; ii++) {
      hash = 31 * hash + string.charCodeAt(ii) | 0;
    }
    return smi(hash);
  }

  function hashJSObj(obj) {
    var hash = weakMap && weakMap.get(obj);
    if (hash) return hash;

    hash = obj[UID_HASH_KEY];
    if (hash) return hash;

    if (!canDefineProperty) {
      hash = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
      if (hash) return hash;

      hash = getIENodeHash(obj);
      if (hash) return hash;
    }

    if (Object.isExtensible && !Object.isExtensible(obj)) {
      throw new Error('Non-extensible objects are not allowed as keys.');
    }

    hash = ++objHashUID;
    if (objHashUID & 0x40000000) {
      objHashUID = 0;
    }

    if (weakMap) {
      weakMap.set(obj, hash);
    } else if (canDefineProperty) {
      Object.defineProperty(obj, UID_HASH_KEY, {
        'enumerable': false,
        'configurable': false,
        'writable': false,
        'value': hash
      });
    } else if (obj.propertyIsEnumerable &&
               obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable) {
      // Since we can't define a non-enumerable property on the object
      // we'll hijack one of the less-used non-enumerable properties to
      // save our hash on it. Since this is a function it will not show up in
      // `JSON.stringify` which is what we want.
      obj.propertyIsEnumerable = function() {
        return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
      };
      obj.propertyIsEnumerable[UID_HASH_KEY] = hash;
    } else if (obj.nodeType) {
      // At this point we couldn't get the IE `uniqueID` to use as a hash
      // and we couldn't use a non-enumerable property to exploit the
      // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
      // itself.
      obj[UID_HASH_KEY] = hash;
    } else {
      throw new Error('Unable to set a non-enumerable property on object.');
    }

    return hash;
  }

  // True if Object.defineProperty works as expected. IE8 fails this test.
  var canDefineProperty = (function() {
    try {
      Object.defineProperty({}, '@', {});
      return true;
    } catch (e) {
      return false;
    }
  }());

  // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
  // and avoid memory leaks from the IE cloneNode bug.
  function getIENodeHash(node) {
    if (node && node.nodeType > 0) {
      switch (node.nodeType) {
        case 1: // Element
          return node.uniqueID;
        case 9: // Document
          return node.documentElement && node.documentElement.uniqueID;
      }
    }
  }

  // If possible, use a WeakMap.
  var weakMap = typeof WeakMap === 'function' && new WeakMap();

  var objHashUID = 0;

  var UID_HASH_KEY = '__immutablehash__';
  if (typeof Symbol === 'function') {
    UID_HASH_KEY = Symbol(UID_HASH_KEY);
  }

  var STRING_HASH_CACHE_MIN_STRLEN = 16;
  var STRING_HASH_CACHE_MAX_SIZE = 255;
  var STRING_HASH_CACHE_SIZE = 0;
  var stringHashCache = {};

  function invariant(condition, error) {
    if (!condition) throw new Error(error);
  }

  function assertNotInfinite(size) {
    invariant(
      size !== Infinity,
      'Cannot perform this action with an infinite size.'
    );
  }

  createClass(ToKeyedSequence, KeyedSeq);
    function ToKeyedSequence(indexed, useKeys) {
      this._iter = indexed;
      this._useKeys = useKeys;
      this.size = indexed.size;
    }

    ToKeyedSequence.prototype.get = function(key, notSetValue) {
      return this._iter.get(key, notSetValue);
    };

    ToKeyedSequence.prototype.has = function(key) {
      return this._iter.has(key);
    };

    ToKeyedSequence.prototype.valueSeq = function() {
      return this._iter.valueSeq();
    };

    ToKeyedSequence.prototype.reverse = function() {var this$0 = this;
      var reversedSequence = reverseFactory(this, true);
      if (!this._useKeys) {
        reversedSequence.valueSeq = function()  {return this$0._iter.toSeq().reverse()};
      }
      return reversedSequence;
    };

    ToKeyedSequence.prototype.map = function(mapper, context) {var this$0 = this;
      var mappedSequence = mapFactory(this, mapper, context);
      if (!this._useKeys) {
        mappedSequence.valueSeq = function()  {return this$0._iter.toSeq().map(mapper, context)};
      }
      return mappedSequence;
    };

    ToKeyedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var ii;
      return this._iter.__iterate(
        this._useKeys ?
          function(v, k)  {return fn(v, k, this$0)} :
          ((ii = reverse ? resolveSize(this) : 0),
            function(v ) {return fn(v, reverse ? --ii : ii++, this$0)}),
        reverse
      );
    };

    ToKeyedSequence.prototype.__iterator = function(type, reverse) {
      if (this._useKeys) {
        return this._iter.__iterator(type, reverse);
      }
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var ii = reverse ? resolveSize(this) : 0;
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, reverse ? --ii : ii++, step.value, step);
      });
    };

  ToKeyedSequence.prototype[IS_ORDERED_SENTINEL] = true;


  createClass(ToIndexedSequence, IndexedSeq);
    function ToIndexedSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToIndexedSequence.prototype.contains = function(value) {
      return this._iter.contains(value);
    };

    ToIndexedSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      return this._iter.__iterate(function(v ) {return fn(v, iterations++, this$0)}, reverse);
    };

    ToIndexedSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, iterations++, step.value, step)
      });
    };



  createClass(ToSetSequence, SetSeq);
    function ToSetSequence(iter) {
      this._iter = iter;
      this.size = iter.size;
    }

    ToSetSequence.prototype.has = function(key) {
      return this._iter.contains(key);
    };

    ToSetSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(v ) {return fn(v, v, this$0)}, reverse);
    };

    ToSetSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        return step.done ? step :
          iteratorValue(type, step.value, step.value, step);
      });
    };



  createClass(FromEntriesSequence, KeyedSeq);
    function FromEntriesSequence(entries) {
      this._iter = entries;
      this.size = entries.size;
    }

    FromEntriesSequence.prototype.entrySeq = function() {
      return this._iter.toSeq();
    };

    FromEntriesSequence.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._iter.__iterate(function(entry ) {
        // Check if entry exists first so array access doesn't throw for holes
        // in the parent iteration.
        if (entry) {
          validateEntry(entry);
          return fn(entry[1], entry[0], this$0);
        }
      }, reverse);
    };

    FromEntriesSequence.prototype.__iterator = function(type, reverse) {
      var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
      return new src_Iterator__Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          // Check if entry exists first so array access doesn't throw for holes
          // in the parent iteration.
          if (entry) {
            validateEntry(entry);
            return type === ITERATE_ENTRIES ? step :
              iteratorValue(type, entry[0], entry[1], step);
          }
        }
      });
    };


  ToIndexedSequence.prototype.cacheResult =
  ToKeyedSequence.prototype.cacheResult =
  ToSetSequence.prototype.cacheResult =
  FromEntriesSequence.prototype.cacheResult =
    cacheResultThrough;


  function flipFactory(iterable) {
    var flipSequence = makeSequence(iterable);
    flipSequence._iter = iterable;
    flipSequence.size = iterable.size;
    flipSequence.flip = function()  {return iterable};
    flipSequence.reverse = function () {
      var reversedSequence = iterable.reverse.apply(this); // super.reverse()
      reversedSequence.flip = function()  {return iterable.reverse()};
      return reversedSequence;
    };
    flipSequence.has = function(key ) {return iterable.contains(key)};
    flipSequence.contains = function(key ) {return iterable.has(key)};
    flipSequence.cacheResult = cacheResultThrough;
    flipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(k, v, this$0) !== false}, reverse);
    }
    flipSequence.__iteratorUncached = function(type, reverse) {
      if (type === ITERATE_ENTRIES) {
        var iterator = iterable.__iterator(type, reverse);
        return new src_Iterator__Iterator(function()  {
          var step = iterator.next();
          if (!step.done) {
            var k = step.value[0];
            step.value[0] = step.value[1];
            step.value[1] = k;
          }
          return step;
        });
      }
      return iterable.__iterator(
        type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
        reverse
      );
    }
    return flipSequence;
  }


  function mapFactory(iterable, mapper, context) {
    var mappedSequence = makeSequence(iterable);
    mappedSequence.size = iterable.size;
    mappedSequence.has = function(key ) {return iterable.has(key)};
    mappedSequence.get = function(key, notSetValue)  {
      var v = iterable.get(key, NOT_SET);
      return v === NOT_SET ?
        notSetValue :
        mapper.call(context, v, key, iterable);
    };
    mappedSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(
        function(v, k, c)  {return fn(mapper.call(context, v, k, c), k, this$0) !== false},
        reverse
      );
    }
    mappedSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      return new src_Iterator__Iterator(function()  {
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var key = entry[0];
        return iteratorValue(
          type,
          key,
          mapper.call(context, entry[1], key, iterable),
          step
        );
      });
    }
    return mappedSequence;
  }


  function reverseFactory(iterable, useKeys) {
    var reversedSequence = makeSequence(iterable);
    reversedSequence._iter = iterable;
    reversedSequence.size = iterable.size;
    reversedSequence.reverse = function()  {return iterable};
    if (iterable.flip) {
      reversedSequence.flip = function () {
        var flipSequence = flipFactory(iterable);
        flipSequence.reverse = function()  {return iterable.flip()};
        return flipSequence;
      };
    }
    reversedSequence.get = function(key, notSetValue) 
      {return iterable.get(useKeys ? key : -1 - key, notSetValue)};
    reversedSequence.has = function(key )
      {return iterable.has(useKeys ? key : -1 - key)};
    reversedSequence.contains = function(value ) {return iterable.contains(value)};
    reversedSequence.cacheResult = cacheResultThrough;
    reversedSequence.__iterate = function (fn, reverse) {var this$0 = this;
      return iterable.__iterate(function(v, k)  {return fn(v, k, this$0)}, !reverse);
    };
    reversedSequence.__iterator =
      function(type, reverse)  {return iterable.__iterator(type, !reverse)};
    return reversedSequence;
  }


  function filterFactory(iterable, predicate, context, useKeys) {
    var filterSequence = makeSequence(iterable);
    if (useKeys) {
      filterSequence.has = function(key ) {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && !!predicate.call(context, v, key, iterable);
      };
      filterSequence.get = function(key, notSetValue)  {
        var v = iterable.get(key, NOT_SET);
        return v !== NOT_SET && predicate.call(context, v, key, iterable) ?
          v : notSetValue;
      };
    }
    filterSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      }, reverse);
      return iterations;
    };
    filterSequence.__iteratorUncached = function (type, reverse) {
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        while (true) {
          var step = iterator.next();
          if (step.done) {
            return step;
          }
          var entry = step.value;
          var key = entry[0];
          var value = entry[1];
          if (predicate.call(context, value, key, iterable)) {
            return iteratorValue(type, useKeys ? key : iterations++, value, step);
          }
        }
      });
    }
    return filterSequence;
  }


  function countByFactory(iterable, grouper, context) {
    var groups = src_Map__Map().asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        0,
        function(a ) {return a + 1}
      );
    });
    return groups.asImmutable();
  }


  function groupByFactory(iterable, grouper, context) {
    var isKeyedIter = isKeyed(iterable);
    var groups = (isOrdered(iterable) ? OrderedMap() : src_Map__Map()).asMutable();
    iterable.__iterate(function(v, k)  {
      groups.update(
        grouper.call(context, v, k, iterable),
        function(a ) {return (a = a || [], a.push(isKeyedIter ? [k, v] : v), a)}
      );
    });
    var coerce = iterableClass(iterable);
    return groups.map(function(arr ) {return reify(iterable, coerce(arr))});
  }


  function sliceFactory(iterable, begin, end, useKeys) {
    var originalSize = iterable.size;

    if (wholeSlice(begin, end, originalSize)) {
      return iterable;
    }

    var resolvedBegin = resolveBegin(begin, originalSize);
    var resolvedEnd = resolveEnd(end, originalSize);

    // begin or end will be NaN if they were provided as negative numbers and
    // this iterable's size is unknown. In that case, cache first so there is
    // a known size.
    if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
      return sliceFactory(iterable.toSeq().cacheResult(), begin, end, useKeys);
    }

    var sliceSize = resolvedEnd - resolvedBegin;
    if (sliceSize < 0) {
      sliceSize = 0;
    }

    var sliceSeq = makeSequence(iterable);

    sliceSeq.size = sliceSize === 0 ? sliceSize : iterable.size && sliceSize || undefined;

    if (!useKeys && isSeq(iterable) && sliceSize >= 0) {
      sliceSeq.get = function (index, notSetValue) {
        index = wrapIndex(this, index);
        return index >= 0 && index < sliceSize ?
          iterable.get(index + resolvedBegin, notSetValue) :
          notSetValue;
      }
    }

    sliceSeq.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (sliceSize === 0) {
        return 0;
      }
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var skipped = 0;
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k)  {
        if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0) !== false &&
                 iterations !== sliceSize;
        }
      });
      return iterations;
    };

    sliceSeq.__iteratorUncached = function(type, reverse) {
      if (sliceSize && reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      // Don't bother instantiating parent iterator if taking 0.
      var iterator = sliceSize && iterable.__iterator(type, reverse);
      var skipped = 0;
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        while (skipped++ !== resolvedBegin) {
          iterator.next();
        }
        if (++iterations > sliceSize) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (useKeys || type === ITERATE_VALUES) {
          return step;
        } else if (type === ITERATE_KEYS) {
          return iteratorValue(type, iterations - 1, undefined, step);
        } else {
          return iteratorValue(type, iterations - 1, step.value[1], step);
        }
      });
    }

    return sliceSeq;
  }


  function takeWhileFactory(iterable, predicate, context) {
    var takeSequence = makeSequence(iterable);
    takeSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var iterations = 0;
      iterable.__iterate(function(v, k, c) 
        {return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$0)}
      );
      return iterations;
    };
    takeSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var iterating = true;
      return new src_Iterator__Iterator(function()  {
        if (!iterating) {
          return iteratorDone();
        }
        var step = iterator.next();
        if (step.done) {
          return step;
        }
        var entry = step.value;
        var k = entry[0];
        var v = entry[1];
        if (!predicate.call(context, v, k, this$0)) {
          iterating = false;
          return iteratorDone();
        }
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return takeSequence;
  }


  function skipWhileFactory(iterable, predicate, context, useKeys) {
    var skipSequence = makeSequence(iterable);
    skipSequence.__iterateUncached = function (fn, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterate(fn, reverse);
      }
      var isSkipping = true;
      var iterations = 0;
      iterable.__iterate(function(v, k, c)  {
        if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
          iterations++;
          return fn(v, useKeys ? k : iterations - 1, this$0);
        }
      });
      return iterations;
    };
    skipSequence.__iteratorUncached = function(type, reverse) {var this$0 = this;
      if (reverse) {
        return this.cacheResult().__iterator(type, reverse);
      }
      var iterator = iterable.__iterator(ITERATE_ENTRIES, reverse);
      var skipping = true;
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        var step, k, v;
        do {
          step = iterator.next();
          if (step.done) {
            if (useKeys || type === ITERATE_VALUES) {
              return step;
            } else if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations++, undefined, step);
            } else {
              return iteratorValue(type, iterations++, step.value[1], step);
            }
          }
          var entry = step.value;
          k = entry[0];
          v = entry[1];
          skipping && (skipping = predicate.call(context, v, k, this$0));
        } while (skipping);
        return type === ITERATE_ENTRIES ? step :
          iteratorValue(type, k, v, step);
      });
    };
    return skipSequence;
  }


  function concatFactory(iterable, values) {
    var isKeyedIterable = isKeyed(iterable);
    var iters = [iterable].concat(values).map(function(v ) {
      if (!isIterable(v)) {
        v = isKeyedIterable ?
          keyedSeqFromValue(v) :
          indexedSeqFromValue(Array.isArray(v) ? v : [v]);
      } else if (isKeyedIterable) {
        v = KeyedIterable(v);
      }
      return v;
    }).filter(function(v ) {return v.size !== 0});

    if (iters.length === 0) {
      return iterable;
    }

    if (iters.length === 1) {
      var singleton = iters[0];
      if (singleton === iterable ||
          isKeyedIterable && isKeyed(singleton) ||
          isIndexed(iterable) && isIndexed(singleton)) {
        return singleton;
      }
    }

    var concatSeq = new ArraySeq(iters);
    if (isKeyedIterable) {
      concatSeq = concatSeq.toKeyedSeq();
    } else if (!isIndexed(iterable)) {
      concatSeq = concatSeq.toSetSeq();
    }
    concatSeq = concatSeq.flatten(true);
    concatSeq.size = iters.reduce(
      function(sum, seq)  {
        if (sum !== undefined) {
          var size = seq.size;
          if (size !== undefined) {
            return sum + size;
          }
        }
      },
      0
    );
    return concatSeq;
  }


  function flattenFactory(iterable, depth, useKeys) {
    var flatSequence = makeSequence(iterable);
    flatSequence.__iterateUncached = function(fn, reverse) {
      var iterations = 0;
      var stopped = false;
      function flatDeep(iter, currentDepth) {var this$0 = this;
        iter.__iterate(function(v, k)  {
          if ((!depth || currentDepth < depth) && isIterable(v)) {
            flatDeep(v, currentDepth + 1);
          } else if (fn(v, useKeys ? k : iterations++, this$0) === false) {
            stopped = true;
          }
          return !stopped;
        }, reverse);
      }
      flatDeep(iterable, 0);
      return iterations;
    }
    flatSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(type, reverse);
      var stack = [];
      var iterations = 0;
      return new src_Iterator__Iterator(function()  {
        while (iterator) {
          var step = iterator.next();
          if (step.done !== false) {
            iterator = stack.pop();
            continue;
          }
          var v = step.value;
          if (type === ITERATE_ENTRIES) {
            v = v[1];
          }
          if ((!depth || stack.length < depth) && isIterable(v)) {
            stack.push(iterator);
            iterator = v.__iterator(type, reverse);
          } else {
            return useKeys ? step : iteratorValue(type, iterations++, v, step);
          }
        }
        return iteratorDone();
      });
    }
    return flatSequence;
  }


  function flatMapFactory(iterable, mapper, context) {
    var coerce = iterableClass(iterable);
    return iterable.toSeq().map(
      function(v, k)  {return coerce(mapper.call(context, v, k, iterable))}
    ).flatten(true);
  }


  function interposeFactory(iterable, separator) {
    var interposedSequence = makeSequence(iterable);
    interposedSequence.size = iterable.size && iterable.size * 2 -1;
    interposedSequence.__iterateUncached = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      iterable.__iterate(function(v, k) 
        {return (!iterations || fn(separator, iterations++, this$0) !== false) &&
        fn(v, iterations++, this$0) !== false},
        reverse
      );
      return iterations;
    };
    interposedSequence.__iteratorUncached = function(type, reverse) {
      var iterator = iterable.__iterator(ITERATE_VALUES, reverse);
      var iterations = 0;
      var step;
      return new src_Iterator__Iterator(function()  {
        if (!step || iterations % 2) {
          step = iterator.next();
          if (step.done) {
            return step;
          }
        }
        return iterations % 2 ?
          iteratorValue(type, iterations++, separator) :
          iteratorValue(type, iterations++, step.value, step);
      });
    };
    return interposedSequence;
  }


  function sortFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    var isKeyedIterable = isKeyed(iterable);
    var index = 0;
    var entries = iterable.toSeq().map(
      function(v, k)  {return [k, v, index++, mapper ? mapper(v, k, iterable) : v]}
    ).toArray();
    entries.sort(function(a, b)  {return comparator(a[3], b[3]) || a[2] - b[2]}).forEach(
      isKeyedIterable ?
      function(v, i)  { entries[i].length = 2; } :
      function(v, i)  { entries[i] = v[1]; }
    );
    return isKeyedIterable ? KeyedSeq(entries) :
      isIndexed(iterable) ? IndexedSeq(entries) :
      SetSeq(entries);
  }


  function maxFactory(iterable, comparator, mapper) {
    if (!comparator) {
      comparator = defaultComparator;
    }
    if (mapper) {
      var entry = iterable.toSeq()
        .map(function(v, k)  {return [v, mapper(v, k, iterable)]})
        .reduce(function(a, b)  {return maxCompare(comparator, a[1], b[1]) ? b : a});
      return entry && entry[0];
    } else {
      return iterable.reduce(function(a, b)  {return maxCompare(comparator, a, b) ? b : a});
    }
  }

  function maxCompare(comparator, a, b) {
    var comp = comparator(b, a);
    // b is considered the new max if the comparator declares them equal, but
    // they are not equal and b is in fact a nullish value.
    return (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) || comp > 0;
  }


  function zipWithFactory(keyIter, zipper, iters) {
    var zipSequence = makeSequence(keyIter);
    zipSequence.size = new ArraySeq(iters).map(function(i ) {return i.size}).min();
    // Note: this a generic base implementation of __iterate in terms of
    // __iterator which may be more generically useful in the future.
    zipSequence.__iterate = function(fn, reverse) {
      /* generic:
      var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        iterations++;
        if (fn(step.value[1], step.value[0], this) === false) {
          break;
        }
      }
      return iterations;
      */
      // indexed:
      var iterator = this.__iterator(ITERATE_VALUES, reverse);
      var step;
      var iterations = 0;
      while (!(step = iterator.next()).done) {
        if (fn(step.value, iterations++, this) === false) {
          break;
        }
      }
      return iterations;
    };
    zipSequence.__iteratorUncached = function(type, reverse) {
      var iterators = iters.map(function(i )
        {return (i = Iterable(i), getIterator(reverse ? i.reverse() : i))}
      );
      var iterations = 0;
      var isDone = false;
      return new src_Iterator__Iterator(function()  {
        var steps;
        if (!isDone) {
          steps = iterators.map(function(i ) {return i.next()});
          isDone = steps.some(function(s ) {return s.done});
        }
        if (isDone) {
          return iteratorDone();
        }
        return iteratorValue(
          type,
          iterations++,
          zipper.apply(null, steps.map(function(s ) {return s.value}))
        );
      });
    };
    return zipSequence
  }


  // #pragma Helper Functions

  function reify(iter, seq) {
    return isSeq(iter) ? seq : iter.constructor(seq);
  }

  function validateEntry(entry) {
    if (entry !== Object(entry)) {
      throw new TypeError('Expected [K, V] tuple: ' + entry);
    }
  }

  function resolveSize(iter) {
    assertNotInfinite(iter.size);
    return ensureSize(iter);
  }

  function iterableClass(iterable) {
    return isKeyed(iterable) ? KeyedIterable :
      isIndexed(iterable) ? IndexedIterable :
      SetIterable;
  }

  function makeSequence(iterable) {
    return Object.create(
      (
        isKeyed(iterable) ? KeyedSeq :
        isIndexed(iterable) ? IndexedSeq :
        SetSeq
      ).prototype
    );
  }

  function cacheResultThrough() {
    if (this._iter.cacheResult) {
      this._iter.cacheResult();
      this.size = this._iter.size;
      return this;
    } else {
      return Seq.prototype.cacheResult.call(this);
    }
  }

  function defaultComparator(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function forceIterator(keyPath) {
    var iter = getIterator(keyPath);
    if (!iter) {
      // Array might not be iterable in this environment, so we need a fallback
      // to our wrapped type.
      if (!isArrayLike(keyPath)) {
        throw new TypeError('Expected iterable or array-like: ' + keyPath);
      }
      iter = getIterator(Iterable(keyPath));
    }
    return iter;
  }

  createClass(src_Map__Map, KeyedCollection);

    // @pragma Construction

    function src_Map__Map(value) {
      return value === null || value === undefined ? emptyMap() :
        isMap(value) ? value :
        emptyMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    src_Map__Map.prototype.toString = function() {
      return this.__toString('Map {', '}');
    };

    // @pragma Access

    src_Map__Map.prototype.get = function(k, notSetValue) {
      return this._root ?
        this._root.get(0, undefined, k, notSetValue) :
        notSetValue;
    };

    // @pragma Modification

    src_Map__Map.prototype.set = function(k, v) {
      return updateMap(this, k, v);
    };

    src_Map__Map.prototype.setIn = function(keyPath, v) {
      return this.updateIn(keyPath, NOT_SET, function()  {return v});
    };

    src_Map__Map.prototype.remove = function(k) {
      return updateMap(this, k, NOT_SET);
    };

    src_Map__Map.prototype.deleteIn = function(keyPath) {
      return this.updateIn(keyPath, function()  {return NOT_SET});
    };

    src_Map__Map.prototype.update = function(k, notSetValue, updater) {
      return arguments.length === 1 ?
        k(this) :
        this.updateIn([k], notSetValue, updater);
    };

    src_Map__Map.prototype.updateIn = function(keyPath, notSetValue, updater) {
      if (!updater) {
        updater = notSetValue;
        notSetValue = undefined;
      }
      var updatedValue = updateInDeepMap(
        this,
        forceIterator(keyPath),
        notSetValue,
        updater
      );
      return updatedValue === NOT_SET ? undefined : updatedValue;
    };

    src_Map__Map.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._root = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyMap();
    };

    // @pragma Composition

    src_Map__Map.prototype.merge = function(/*...iters*/) {
      return mergeIntoMapWith(this, undefined, arguments);
    };

    src_Map__Map.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, merger, iters);
    };

    src_Map__Map.prototype.mergeIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(keyPath, emptyMap(), function(m ) {return m.merge.apply(m, iters)});
    };

    src_Map__Map.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoMapWith(this, deepMerger(undefined), arguments);
    };

    src_Map__Map.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoMapWith(this, deepMerger(merger), iters);
    };

    src_Map__Map.prototype.mergeDeepIn = function(keyPath) {var iters = SLICE$0.call(arguments, 1);
      return this.updateIn(keyPath, emptyMap(), function(m ) {return m.mergeDeep.apply(m, iters)});
    };

    src_Map__Map.prototype.sort = function(comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator));
    };

    src_Map__Map.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedMap(sortFactory(this, comparator, mapper));
    };

    // @pragma Mutability

    src_Map__Map.prototype.withMutations = function(fn) {
      var mutable = this.asMutable();
      fn(mutable);
      return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
    };

    src_Map__Map.prototype.asMutable = function() {
      return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
    };

    src_Map__Map.prototype.asImmutable = function() {
      return this.__ensureOwner();
    };

    src_Map__Map.prototype.wasAltered = function() {
      return this.__altered;
    };

    src_Map__Map.prototype.__iterator = function(type, reverse) {
      return new MapIterator(this, type, reverse);
    };

    src_Map__Map.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      var iterations = 0;
      this._root && this._root.iterate(function(entry ) {
        iterations++;
        return fn(entry[1], entry[0], this$0);
      }, reverse);
      return iterations;
    };

    src_Map__Map.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeMap(this.size, this._root, ownerID, this.__hash);
    };


  function isMap(maybeMap) {
    return !!(maybeMap && maybeMap[IS_MAP_SENTINEL]);
  }

  src_Map__Map.isMap = isMap;

  var IS_MAP_SENTINEL = '@@__IMMUTABLE_MAP__@@';

  var MapPrototype = src_Map__Map.prototype;
  MapPrototype[IS_MAP_SENTINEL] = true;
  MapPrototype[DELETE] = MapPrototype.remove;
  MapPrototype.removeIn = MapPrototype.deleteIn;


  // #pragma Trie Nodes



    function ArrayMapNode(ownerID, entries) {
      this.ownerID = ownerID;
      this.entries = entries;
    }

    ArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    ArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && entries.length === 1) {
        return; // undefined
      }

      if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
        return createNodes(ownerID, entries, key, value);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new ArrayMapNode(ownerID, newEntries);
    };




    function BitmapIndexedNode(ownerID, bitmap, nodes) {
      this.ownerID = ownerID;
      this.bitmap = bitmap;
      this.nodes = nodes;
    }

    BitmapIndexedNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var bit = (1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK));
      var bitmap = this.bitmap;
      return (bitmap & bit) === 0 ? notSetValue :
        this.nodes[popCount(bitmap & (bit - 1))].get(shift + SHIFT, keyHash, key, notSetValue);
    };

    BitmapIndexedNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var bit = 1 << keyHashFrag;
      var bitmap = this.bitmap;
      var exists = (bitmap & bit) !== 0;

      if (!exists && value === NOT_SET) {
        return this;
      }

      var idx = popCount(bitmap & (bit - 1));
      var nodes = this.nodes;
      var node = exists ? nodes[idx] : undefined;
      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);

      if (newNode === node) {
        return this;
      }

      if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
        return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
      }

      if (exists && !newNode && nodes.length === 2 && isLeafNode(nodes[idx ^ 1])) {
        return nodes[idx ^ 1];
      }

      if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
        return newNode;
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newBitmap = exists ? newNode ? bitmap : bitmap ^ bit : bitmap | bit;
      var newNodes = exists ? newNode ?
        setIn(nodes, idx, newNode, isEditable) :
        spliceOut(nodes, idx, isEditable) :
        spliceIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.bitmap = newBitmap;
        this.nodes = newNodes;
        return this;
      }

      return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
    };




    function HashArrayMapNode(ownerID, count, nodes) {
      this.ownerID = ownerID;
      this.count = count;
      this.nodes = nodes;
    }

    HashArrayMapNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var node = this.nodes[idx];
      return node ? node.get(shift + SHIFT, keyHash, key, notSetValue) : notSetValue;
    };

    HashArrayMapNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }
      var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
      var removed = value === NOT_SET;
      var nodes = this.nodes;
      var node = nodes[idx];

      if (removed && !node) {
        return this;
      }

      var newNode = updateNode(node, ownerID, shift + SHIFT, keyHash, key, value, didChangeSize, didAlter);
      if (newNode === node) {
        return this;
      }

      var newCount = this.count;
      if (!node) {
        newCount++;
      } else if (!newNode) {
        newCount--;
        if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
          return packNodes(ownerID, nodes, newCount, idx);
        }
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newNodes = setIn(nodes, idx, newNode, isEditable);

      if (isEditable) {
        this.count = newCount;
        this.nodes = newNodes;
        return this;
      }

      return new HashArrayMapNode(ownerID, newCount, newNodes);
    };




    function HashCollisionNode(ownerID, keyHash, entries) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entries = entries;
    }

    HashCollisionNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      var entries = this.entries;
      for (var ii = 0, len = entries.length; ii < len; ii++) {
        if (is(key, entries[ii][0])) {
          return entries[ii][1];
        }
      }
      return notSetValue;
    };

    HashCollisionNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      if (keyHash === undefined) {
        keyHash = hash(key);
      }

      var removed = value === NOT_SET;

      if (keyHash !== this.keyHash) {
        if (removed) {
          return this;
        }
        SetRef(didAlter);
        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
      }

      var entries = this.entries;
      var idx = 0;
      for (var len = entries.length; idx < len; idx++) {
        if (is(key, entries[idx][0])) {
          break;
        }
      }
      var exists = idx < len;

      if (exists ? entries[idx][1] === value : removed) {
        return this;
      }

      SetRef(didAlter);
      (removed || !exists) && SetRef(didChangeSize);

      if (removed && len === 2) {
        return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
      }

      var isEditable = ownerID && ownerID === this.ownerID;
      var newEntries = isEditable ? entries : arrCopy(entries);

      if (exists) {
        if (removed) {
          idx === len - 1 ? newEntries.pop() : (newEntries[idx] = newEntries.pop());
        } else {
          newEntries[idx] = [key, value];
        }
      } else {
        newEntries.push([key, value]);
      }

      if (isEditable) {
        this.entries = newEntries;
        return this;
      }

      return new HashCollisionNode(ownerID, this.keyHash, newEntries);
    };




    function ValueNode(ownerID, keyHash, entry) {
      this.ownerID = ownerID;
      this.keyHash = keyHash;
      this.entry = entry;
    }

    ValueNode.prototype.get = function(shift, keyHash, key, notSetValue) {
      return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
    };

    ValueNode.prototype.update = function(ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
      var removed = value === NOT_SET;
      var keyMatch = is(key, this.entry[0]);
      if (keyMatch ? value === this.entry[1] : removed) {
        return this;
      }

      SetRef(didAlter);

      if (removed) {
        SetRef(didChangeSize);
        return; // undefined
      }

      if (keyMatch) {
        if (ownerID && ownerID === this.ownerID) {
          this.entry[1] = value;
          return this;
        }
        return new ValueNode(ownerID, this.keyHash, [key, value]);
      }

      SetRef(didChangeSize);
      return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
    };



  // #pragma Iterators

  ArrayMapNode.prototype.iterate =
  HashCollisionNode.prototype.iterate = function (fn, reverse) {
    var entries = this.entries;
    for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
      if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
        return false;
      }
    }
  }

  BitmapIndexedNode.prototype.iterate =
  HashArrayMapNode.prototype.iterate = function (fn, reverse) {
    var nodes = this.nodes;
    for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
      var node = nodes[reverse ? maxIndex - ii : ii];
      if (node && node.iterate(fn, reverse) === false) {
        return false;
      }
    }
  }

  ValueNode.prototype.iterate = function (fn, reverse) {
    return fn(this.entry);
  }

  createClass(MapIterator, src_Iterator__Iterator);

    function MapIterator(map, type, reverse) {
      this._type = type;
      this._reverse = reverse;
      this._stack = map._root && mapIteratorFrame(map._root);
    }

    MapIterator.prototype.next = function() {
      var type = this._type;
      var stack = this._stack;
      while (stack) {
        var node = stack.node;
        var index = stack.index++;
        var maxIndex;
        if (node.entry) {
          if (index === 0) {
            return mapIteratorValue(type, node.entry);
          }
        } else if (node.entries) {
          maxIndex = node.entries.length - 1;
          if (index <= maxIndex) {
            return mapIteratorValue(type, node.entries[this._reverse ? maxIndex - index : index]);
          }
        } else {
          maxIndex = node.nodes.length - 1;
          if (index <= maxIndex) {
            var subNode = node.nodes[this._reverse ? maxIndex - index : index];
            if (subNode) {
              if (subNode.entry) {
                return mapIteratorValue(type, subNode.entry);
              }
              stack = this._stack = mapIteratorFrame(subNode, stack);
            }
            continue;
          }
        }
        stack = this._stack = this._stack.__prev;
      }
      return iteratorDone();
    };


  function mapIteratorValue(type, entry) {
    return iteratorValue(type, entry[0], entry[1]);
  }

  function mapIteratorFrame(node, prev) {
    return {
      node: node,
      index: 0,
      __prev: prev
    };
  }

  function makeMap(size, root, ownerID, hash) {
    var map = Object.create(MapPrototype);
    map.size = size;
    map._root = root;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_MAP;
  function emptyMap() {
    return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
  }

  function updateMap(map, k, v) {
    var newRoot;
    var newSize;
    if (!map._root) {
      if (v === NOT_SET) {
        return map;
      }
      newSize = 1;
      newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
    } else {
      var didChangeSize = MakeRef(CHANGE_LENGTH);
      var didAlter = MakeRef(DID_ALTER);
      newRoot = updateNode(map._root, map.__ownerID, 0, undefined, k, v, didChangeSize, didAlter);
      if (!didAlter.value) {
        return map;
      }
      newSize = map.size + (didChangeSize.value ? v === NOT_SET ? -1 : 1 : 0);
    }
    if (map.__ownerID) {
      map.size = newSize;
      map._root = newRoot;
      map.__hash = undefined;
      map.__altered = true;
      return map;
    }
    return newRoot ? makeMap(newSize, newRoot) : emptyMap();
  }

  function updateNode(node, ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
    if (!node) {
      if (value === NOT_SET) {
        return node;
      }
      SetRef(didAlter);
      SetRef(didChangeSize);
      return new ValueNode(ownerID, keyHash, [key, value]);
    }
    return node.update(ownerID, shift, keyHash, key, value, didChangeSize, didAlter);
  }

  function isLeafNode(node) {
    return node.constructor === ValueNode || node.constructor === HashCollisionNode;
  }

  function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
    if (node.keyHash === keyHash) {
      return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
    }

    var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
    var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

    var newNode;
    var nodes = idx1 === idx2 ?
      [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)] :
      ((newNode = new ValueNode(ownerID, keyHash, entry)), idx1 < idx2 ? [node, newNode] : [newNode, node]);

    return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
  }

  function createNodes(ownerID, entries, key, value) {
    if (!ownerID) {
      ownerID = new OwnerID();
    }
    var node = new ValueNode(ownerID, hash(key), [key, value]);
    for (var ii = 0; ii < entries.length; ii++) {
      var entry = entries[ii];
      node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
    }
    return node;
  }

  function packNodes(ownerID, nodes, count, excluding) {
    var bitmap = 0;
    var packedII = 0;
    var packedNodes = new Array(count);
    for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
      var node = nodes[ii];
      if (node !== undefined && ii !== excluding) {
        bitmap |= bit;
        packedNodes[packedII++] = node;
      }
    }
    return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
  }

  function expandNodes(ownerID, nodes, bitmap, including, node) {
    var count = 0;
    var expandedNodes = new Array(SIZE);
    for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
      expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
    }
    expandedNodes[including] = node;
    return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
  }

  function mergeIntoMapWith(map, merger, iterables) {
    var iters = [];
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = KeyedIterable(value);
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    return mergeIntoCollectionWith(map, merger, iters);
  }

  function deepMerger(merger) {
    return function(existing, value) 
      {return existing && existing.mergeDeepWith && isIterable(value) ?
        existing.mergeDeepWith(merger, value) :
        merger ? merger(existing, value) : value};
  }

  function mergeIntoCollectionWith(collection, merger, iters) {
    iters = iters.filter(function(x ) {return x.size !== 0});
    if (iters.length === 0) {
      return collection;
    }
    if (collection.size === 0 && iters.length === 1) {
      return collection.constructor(iters[0]);
    }
    return collection.withMutations(function(collection ) {
      var mergeIntoMap = merger ?
        function(value, key)  {
          collection.update(key, NOT_SET, function(existing )
            {return existing === NOT_SET ? value : merger(existing, value)}
          );
        } :
        function(value, key)  {
          collection.set(key, value);
        }
      for (var ii = 0; ii < iters.length; ii++) {
        iters[ii].forEach(mergeIntoMap);
      }
    });
  }

  function updateInDeepMap(existing, keyPathIter, notSetValue, updater) {
    var isNotSet = existing === NOT_SET;
    var step = keyPathIter.next();
    if (step.done) {
      var existingValue = isNotSet ? notSetValue : existing;
      var newValue = updater(existingValue);
      return newValue === existingValue ? existing : newValue;
    }
    invariant(
      isNotSet || (existing && existing.set),
      'invalid keyPath'
    );
    var key = step.value;
    var nextExisting = isNotSet ? NOT_SET : existing.get(key, NOT_SET);
    var nextUpdated = updateInDeepMap(
      nextExisting,
      keyPathIter,
      notSetValue,
      updater
    );
    return nextUpdated === nextExisting ? existing :
      nextUpdated === NOT_SET ? existing.remove(key) :
      (isNotSet ? emptyMap() : existing).set(key, nextUpdated);
  }

  function popCount(x) {
    x = x - ((x >> 1) & 0x55555555);
    x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
    x = (x + (x >> 4)) & 0x0f0f0f0f;
    x = x + (x >> 8);
    x = x + (x >> 16);
    return x & 0x7f;
  }

  function setIn(array, idx, val, canEdit) {
    var newArray = canEdit ? array : arrCopy(array);
    newArray[idx] = val;
    return newArray;
  }

  function spliceIn(array, idx, val, canEdit) {
    var newLen = array.length + 1;
    if (canEdit && idx + 1 === newLen) {
      array[idx] = val;
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        newArray[ii] = val;
        after = -1;
      } else {
        newArray[ii] = array[ii + after];
      }
    }
    return newArray;
  }

  function spliceOut(array, idx, canEdit) {
    var newLen = array.length - 1;
    if (canEdit && idx === newLen) {
      array.pop();
      return array;
    }
    var newArray = new Array(newLen);
    var after = 0;
    for (var ii = 0; ii < newLen; ii++) {
      if (ii === idx) {
        after = 1;
      }
      newArray[ii] = array[ii + after];
    }
    return newArray;
  }

  var MAX_ARRAY_MAP_SIZE = SIZE / 4;
  var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
  var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

  createClass(List, IndexedCollection);

    // @pragma Construction

    function List(value) {
      var empty = emptyList();
      if (value === null || value === undefined) {
        return empty;
      }
      if (isList(value)) {
        return value;
      }
      var iter = IndexedIterable(value);
      var size = iter.size;
      if (size === 0) {
        return empty;
      }
      assertNotInfinite(size);
      if (size > 0 && size < SIZE) {
        return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
      }
      return empty.withMutations(function(list ) {
        list.setSize(size);
        iter.forEach(function(v, i)  {return list.set(i, v)});
      });
    }

    List.of = function(/*...values*/) {
      return this(arguments);
    };

    List.prototype.toString = function() {
      return this.__toString('List [', ']');
    };

    // @pragma Access

    List.prototype.get = function(index, notSetValue) {
      index = wrapIndex(this, index);
      if (index < 0 || index >= this.size) {
        return notSetValue;
      }
      index += this._origin;
      var node = listNodeFor(this, index);
      return node && node.array[index & MASK];
    };

    // @pragma Modification

    List.prototype.set = function(index, value) {
      return updateList(this, index, value);
    };

    List.prototype.remove = function(index) {
      return !this.has(index) ? this :
        index === 0 ? this.shift() :
        index === this.size - 1 ? this.pop() :
        this.splice(index, 1);
    };

    List.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = this._origin = this._capacity = 0;
        this._level = SHIFT;
        this._root = this._tail = null;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyList();
    };

    List.prototype.push = function(/*...values*/) {
      var values = arguments;
      var oldSize = this.size;
      return this.withMutations(function(list ) {
        setListBounds(list, 0, oldSize + values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(oldSize + ii, values[ii]);
        }
      });
    };

    List.prototype.pop = function() {
      return setListBounds(this, 0, -1);
    };

    List.prototype.unshift = function(/*...values*/) {
      var values = arguments;
      return this.withMutations(function(list ) {
        setListBounds(list, -values.length);
        for (var ii = 0; ii < values.length; ii++) {
          list.set(ii, values[ii]);
        }
      });
    };

    List.prototype.shift = function() {
      return setListBounds(this, 1);
    };

    // @pragma Composition

    List.prototype.merge = function(/*...iters*/) {
      return mergeIntoListWith(this, undefined, arguments);
    };

    List.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, merger, iters);
    };

    List.prototype.mergeDeep = function(/*...iters*/) {
      return mergeIntoListWith(this, deepMerger(undefined), arguments);
    };

    List.prototype.mergeDeepWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return mergeIntoListWith(this, deepMerger(merger), iters);
    };

    List.prototype.setSize = function(size) {
      return setListBounds(this, 0, size);
    };

    // @pragma Iteration

    List.prototype.slice = function(begin, end) {
      var size = this.size;
      if (wholeSlice(begin, end, size)) {
        return this;
      }
      return setListBounds(
        this,
        resolveBegin(begin, size),
        resolveEnd(end, size)
      );
    };

    List.prototype.__iterator = function(type, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      return new src_Iterator__Iterator(function()  {
        var value = values();
        return value === DONE ?
          iteratorDone() :
          iteratorValue(type, index++, value);
      });
    };

    List.prototype.__iterate = function(fn, reverse) {
      var index = 0;
      var values = iterateList(this, reverse);
      var value;
      while ((value = values()) !== DONE) {
        if (fn(value, index++, this) === false) {
          break;
        }
      }
      return index;
    };

    List.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        return this;
      }
      return makeList(this._origin, this._capacity, this._level, this._root, this._tail, ownerID, this.__hash);
    };


  function isList(maybeList) {
    return !!(maybeList && maybeList[IS_LIST_SENTINEL]);
  }

  List.isList = isList;

  var IS_LIST_SENTINEL = '@@__IMMUTABLE_LIST__@@';

  var ListPrototype = List.prototype;
  ListPrototype[IS_LIST_SENTINEL] = true;
  ListPrototype[DELETE] = ListPrototype.remove;
  ListPrototype.setIn = MapPrototype.setIn;
  ListPrototype.deleteIn =
  ListPrototype.removeIn = MapPrototype.removeIn;
  ListPrototype.update = MapPrototype.update;
  ListPrototype.updateIn = MapPrototype.updateIn;
  ListPrototype.mergeIn = MapPrototype.mergeIn;
  ListPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  ListPrototype.withMutations = MapPrototype.withMutations;
  ListPrototype.asMutable = MapPrototype.asMutable;
  ListPrototype.asImmutable = MapPrototype.asImmutable;
  ListPrototype.wasAltered = MapPrototype.wasAltered;



    function VNode(array, ownerID) {
      this.array = array;
      this.ownerID = ownerID;
    }

    // TODO: seems like these methods are very similar

    VNode.prototype.removeBefore = function(ownerID, level, index) {
      if (index === level ? 1 << level : 0 || this.array.length === 0) {
        return this;
      }
      var originIndex = (index >>> level) & MASK;
      if (originIndex >= this.array.length) {
        return new VNode([], ownerID);
      }
      var removingFirst = originIndex === 0;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[originIndex];
        newChild = oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingFirst) {
          return this;
        }
      }
      if (removingFirst && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingFirst) {
        for (var ii = 0; ii < originIndex; ii++) {
          editable.array[ii] = undefined;
        }
      }
      if (newChild) {
        editable.array[originIndex] = newChild;
      }
      return editable;
    };

    VNode.prototype.removeAfter = function(ownerID, level, index) {
      if (index === level ? 1 << level : 0 || this.array.length === 0) {
        return this;
      }
      var sizeIndex = ((index - 1) >>> level) & MASK;
      if (sizeIndex >= this.array.length) {
        return this;
      }
      var removingLast = sizeIndex === this.array.length - 1;
      var newChild;
      if (level > 0) {
        var oldChild = this.array[sizeIndex];
        newChild = oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
        if (newChild === oldChild && removingLast) {
          return this;
        }
      }
      if (removingLast && !newChild) {
        return this;
      }
      var editable = editableVNode(this, ownerID);
      if (!removingLast) {
        editable.array.pop();
      }
      if (newChild) {
        editable.array[sizeIndex] = newChild;
      }
      return editable;
    };



  var DONE = {};

  function iterateList(list, reverse) {
    var left = list._origin;
    var right = list._capacity;
    var tailPos = getTailOffset(right);
    var tail = list._tail;

    return iterateNodeOrLeaf(list._root, list._level, 0);

    function iterateNodeOrLeaf(node, level, offset) {
      return level === 0 ?
        iterateLeaf(node, offset) :
        iterateNode(node, level, offset);
    }

    function iterateLeaf(node, offset) {
      var array = offset === tailPos ? tail && tail.array : node && node.array;
      var from = offset > left ? 0 : left - offset;
      var to = right - offset;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        if (from === to) {
          return DONE;
        }
        var idx = reverse ? --to : from++;
        return array && array[idx];
      };
    }

    function iterateNode(node, level, offset) {
      var values;
      var array = node && node.array;
      var from = offset > left ? 0 : (left - offset) >> level;
      var to = ((right - offset) >> level) + 1;
      if (to > SIZE) {
        to = SIZE;
      }
      return function()  {
        do {
          if (values) {
            var value = values();
            if (value !== DONE) {
              return value;
            }
            values = null;
          }
          if (from === to) {
            return DONE;
          }
          var idx = reverse ? --to : from++;
          values = iterateNodeOrLeaf(
            array && array[idx], level - SHIFT, offset + (idx << level)
          );
        } while (true);
      };
    }
  }

  function makeList(origin, capacity, level, root, tail, ownerID, hash) {
    var list = Object.create(ListPrototype);
    list.size = capacity - origin;
    list._origin = origin;
    list._capacity = capacity;
    list._level = level;
    list._root = root;
    list._tail = tail;
    list.__ownerID = ownerID;
    list.__hash = hash;
    list.__altered = false;
    return list;
  }

  var EMPTY_LIST;
  function emptyList() {
    return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
  }

  function updateList(list, index, value) {
    index = wrapIndex(list, index);

    if (index >= list.size || index < 0) {
      return list.withMutations(function(list ) {
        index < 0 ?
          setListBounds(list, index).set(0, value) :
          setListBounds(list, 0, index + 1).set(index, value)
      });
    }

    index += list._origin;

    var newTail = list._tail;
    var newRoot = list._root;
    var didAlter = MakeRef(DID_ALTER);
    if (index >= getTailOffset(list._capacity)) {
      newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
    } else {
      newRoot = updateVNode(newRoot, list.__ownerID, list._level, index, value, didAlter);
    }

    if (!didAlter.value) {
      return list;
    }

    if (list.__ownerID) {
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
  }

  function updateVNode(node, ownerID, level, index, value, didAlter) {
    var idx = (index >>> level) & MASK;
    var nodeHas = node && idx < node.array.length;
    if (!nodeHas && value === undefined) {
      return node;
    }

    var newNode;

    if (level > 0) {
      var lowerNode = node && node.array[idx];
      var newLowerNode = updateVNode(lowerNode, ownerID, level - SHIFT, index, value, didAlter);
      if (newLowerNode === lowerNode) {
        return node;
      }
      newNode = editableVNode(node, ownerID);
      newNode.array[idx] = newLowerNode;
      return newNode;
    }

    if (nodeHas && node.array[idx] === value) {
      return node;
    }

    SetRef(didAlter);

    newNode = editableVNode(node, ownerID);
    if (value === undefined && idx === newNode.array.length - 1) {
      newNode.array.pop();
    } else {
      newNode.array[idx] = value;
    }
    return newNode;
  }

  function editableVNode(node, ownerID) {
    if (ownerID && node && ownerID === node.ownerID) {
      return node;
    }
    return new VNode(node ? node.array.slice() : [], ownerID);
  }

  function listNodeFor(list, rawIndex) {
    if (rawIndex >= getTailOffset(list._capacity)) {
      return list._tail;
    }
    if (rawIndex < 1 << (list._level + SHIFT)) {
      var node = list._root;
      var level = list._level;
      while (node && level > 0) {
        node = node.array[(rawIndex >>> level) & MASK];
        level -= SHIFT;
      }
      return node;
    }
  }

  function setListBounds(list, begin, end) {
    var owner = list.__ownerID || new OwnerID();
    var oldOrigin = list._origin;
    var oldCapacity = list._capacity;
    var newOrigin = oldOrigin + begin;
    var newCapacity = end === undefined ? oldCapacity : end < 0 ? oldCapacity + end : oldOrigin + end;
    if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
      return list;
    }

    // If it's going to end after it starts, it's empty.
    if (newOrigin >= newCapacity) {
      return list.clear();
    }

    var newLevel = list._level;
    var newRoot = list._root;

    // New origin might require creating a higher root.
    var offsetShift = 0;
    while (newOrigin + offsetShift < 0) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [undefined, newRoot] : [], owner);
      newLevel += SHIFT;
      offsetShift += 1 << newLevel;
    }
    if (offsetShift) {
      newOrigin += offsetShift;
      oldOrigin += offsetShift;
      newCapacity += offsetShift;
      oldCapacity += offsetShift;
    }

    var oldTailOffset = getTailOffset(oldCapacity);
    var newTailOffset = getTailOffset(newCapacity);

    // New size might require creating a higher root.
    while (newTailOffset >= 1 << (newLevel + SHIFT)) {
      newRoot = new VNode(newRoot && newRoot.array.length ? [newRoot] : [], owner);
      newLevel += SHIFT;
    }

    // Locate or create the new tail.
    var oldTail = list._tail;
    var newTail = newTailOffset < oldTailOffset ?
      listNodeFor(list, newCapacity - 1) :
      newTailOffset > oldTailOffset ? new VNode([], owner) : oldTail;

    // Merge Tail into tree.
    if (oldTail && newTailOffset > oldTailOffset && newOrigin < oldCapacity && oldTail.array.length) {
      newRoot = editableVNode(newRoot, owner);
      var node = newRoot;
      for (var level = newLevel; level > SHIFT; level -= SHIFT) {
        var idx = (oldTailOffset >>> level) & MASK;
        node = node.array[idx] = editableVNode(node.array[idx], owner);
      }
      node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
    }

    // If the size has been reduced, there's a chance the tail needs to be trimmed.
    if (newCapacity < oldCapacity) {
      newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
    }

    // If the new origin is within the tail, then we do not need a root.
    if (newOrigin >= newTailOffset) {
      newOrigin -= newTailOffset;
      newCapacity -= newTailOffset;
      newLevel = SHIFT;
      newRoot = null;
      newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

    // Otherwise, if the root has been trimmed, garbage collect.
    } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
      offsetShift = 0;

      // Identify the new top root node of the subtree of the old root.
      while (newRoot) {
        var beginIndex = (newOrigin >>> newLevel) & MASK;
        if (beginIndex !== (newTailOffset >>> newLevel) & MASK) {
          break;
        }
        if (beginIndex) {
          offsetShift += (1 << newLevel) * beginIndex;
        }
        newLevel -= SHIFT;
        newRoot = newRoot.array[beginIndex];
      }

      // Trim the new sides of the new root.
      if (newRoot && newOrigin > oldOrigin) {
        newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
      }
      if (newRoot && newTailOffset < oldTailOffset) {
        newRoot = newRoot.removeAfter(owner, newLevel, newTailOffset - offsetShift);
      }
      if (offsetShift) {
        newOrigin -= offsetShift;
        newCapacity -= offsetShift;
      }
    }

    if (list.__ownerID) {
      list.size = newCapacity - newOrigin;
      list._origin = newOrigin;
      list._capacity = newCapacity;
      list._level = newLevel;
      list._root = newRoot;
      list._tail = newTail;
      list.__hash = undefined;
      list.__altered = true;
      return list;
    }
    return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
  }

  function mergeIntoListWith(list, merger, iterables) {
    var iters = [];
    var maxSize = 0;
    for (var ii = 0; ii < iterables.length; ii++) {
      var value = iterables[ii];
      var iter = IndexedIterable(value);
      if (iter.size > maxSize) {
        maxSize = iter.size;
      }
      if (!isIterable(value)) {
        iter = iter.map(function(v ) {return fromJS(v)});
      }
      iters.push(iter);
    }
    if (maxSize > list.size) {
      list = list.setSize(maxSize);
    }
    return mergeIntoCollectionWith(list, merger, iters);
  }

  function getTailOffset(size) {
    return size < SIZE ? 0 : (((size - 1) >>> SHIFT) << SHIFT);
  }

  createClass(OrderedMap, src_Map__Map);

    // @pragma Construction

    function OrderedMap(value) {
      return value === null || value === undefined ? emptyOrderedMap() :
        isOrderedMap(value) ? value :
        emptyOrderedMap().withMutations(function(map ) {
          var iter = KeyedIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v, k)  {return map.set(k, v)});
        });
    }

    OrderedMap.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedMap.prototype.toString = function() {
      return this.__toString('OrderedMap {', '}');
    };

    // @pragma Access

    OrderedMap.prototype.get = function(k, notSetValue) {
      var index = this._map.get(k);
      return index !== undefined ? this._list.get(index)[1] : notSetValue;
    };

    // @pragma Modification

    OrderedMap.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._map.clear();
        this._list.clear();
        return this;
      }
      return emptyOrderedMap();
    };

    OrderedMap.prototype.set = function(k, v) {
      return updateOrderedMap(this, k, v);
    };

    OrderedMap.prototype.remove = function(k) {
      return updateOrderedMap(this, k, NOT_SET);
    };

    OrderedMap.prototype.wasAltered = function() {
      return this._map.wasAltered() || this._list.wasAltered();
    };

    OrderedMap.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._list.__iterate(
        function(entry ) {return entry && fn(entry[1], entry[0], this$0)},
        reverse
      );
    };

    OrderedMap.prototype.__iterator = function(type, reverse) {
      return this._list.fromEntrySeq().__iterator(type, reverse);
    };

    OrderedMap.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      var newList = this._list.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        this._list = newList;
        return this;
      }
      return makeOrderedMap(newMap, newList, ownerID, this.__hash);
    };


  function isOrderedMap(maybeOrderedMap) {
    return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
  }

  OrderedMap.isOrderedMap = isOrderedMap;

  OrderedMap.prototype[IS_ORDERED_SENTINEL] = true;
  OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;



  function makeOrderedMap(map, list, ownerID, hash) {
    var omap = Object.create(OrderedMap.prototype);
    omap.size = map ? map.size : 0;
    omap._map = map;
    omap._list = list;
    omap.__ownerID = ownerID;
    omap.__hash = hash;
    return omap;
  }

  var EMPTY_ORDERED_MAP;
  function emptyOrderedMap() {
    return EMPTY_ORDERED_MAP || (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()));
  }

  function updateOrderedMap(omap, k, v) {
    var map = omap._map;
    var list = omap._list;
    var i = map.get(k);
    var has = i !== undefined;
    var newMap;
    var newList;
    if (v === NOT_SET) { // removed
      if (!has) {
        return omap;
      }
      if (list.size >= SIZE && list.size >= map.size * 2) {
        newList = list.filter(function(entry, idx)  {return entry !== undefined && i !== idx});
        newMap = newList.toKeyedSeq().map(function(entry ) {return entry[0]}).flip().toMap();
        if (omap.__ownerID) {
          newMap.__ownerID = newList.__ownerID = omap.__ownerID;
        }
      } else {
        newMap = map.remove(k);
        newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
      }
    } else {
      if (has) {
        if (v === list.get(i)[1]) {
          return omap;
        }
        newMap = map;
        newList = list.set(i, [k, v]);
      } else {
        newMap = map.set(k, list.size);
        newList = list.set(list.size, [k, v]);
      }
    }
    if (omap.__ownerID) {
      omap.size = newMap.size;
      omap._map = newMap;
      omap._list = newList;
      omap.__hash = undefined;
      return omap;
    }
    return makeOrderedMap(newMap, newList);
  }

  createClass(Stack, IndexedCollection);

    // @pragma Construction

    function Stack(value) {
      return value === null || value === undefined ? emptyStack() :
        isStack(value) ? value :
        emptyStack().unshiftAll(value);
    }

    Stack.of = function(/*...values*/) {
      return this(arguments);
    };

    Stack.prototype.toString = function() {
      return this.__toString('Stack [', ']');
    };

    // @pragma Access

    Stack.prototype.get = function(index, notSetValue) {
      var head = this._head;
      index = wrapIndex(this, index);
      while (head && index--) {
        head = head.next;
      }
      return head ? head.value : notSetValue;
    };

    Stack.prototype.peek = function() {
      return this._head && this._head.value;
    };

    // @pragma Modification

    Stack.prototype.push = function(/*...values*/) {
      if (arguments.length === 0) {
        return this;
      }
      var newSize = this.size + arguments.length;
      var head = this._head;
      for (var ii = arguments.length - 1; ii >= 0; ii--) {
        head = {
          value: arguments[ii],
          next: head
        };
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pushAll = function(iter) {
      iter = IndexedIterable(iter);
      if (iter.size === 0) {
        return this;
      }
      assertNotInfinite(iter.size);
      var newSize = this.size;
      var head = this._head;
      iter.reverse().forEach(function(value ) {
        newSize++;
        head = {
          value: value,
          next: head
        };
      });
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    Stack.prototype.pop = function() {
      return this.slice(1);
    };

    Stack.prototype.unshift = function(/*...values*/) {
      return this.push.apply(this, arguments);
    };

    Stack.prototype.unshiftAll = function(iter) {
      return this.pushAll(iter);
    };

    Stack.prototype.shift = function() {
      return this.pop.apply(this, arguments);
    };

    Stack.prototype.clear = function() {
      if (this.size === 0) {
        return this;
      }
      if (this.__ownerID) {
        this.size = 0;
        this._head = undefined;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return emptyStack();
    };

    Stack.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      var resolvedBegin = resolveBegin(begin, this.size);
      var resolvedEnd = resolveEnd(end, this.size);
      if (resolvedEnd !== this.size) {
        // super.slice(begin, end);
        return IndexedCollection.prototype.slice.call(this, begin, end);
      }
      var newSize = this.size - resolvedBegin;
      var head = this._head;
      while (resolvedBegin--) {
        head = head.next;
      }
      if (this.__ownerID) {
        this.size = newSize;
        this._head = head;
        this.__hash = undefined;
        this.__altered = true;
        return this;
      }
      return makeStack(newSize, head);
    };

    // @pragma Mutability

    Stack.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      if (!ownerID) {
        this.__ownerID = ownerID;
        this.__altered = false;
        return this;
      }
      return makeStack(this.size, this._head, ownerID, this.__hash);
    };

    // @pragma Iteration

    Stack.prototype.__iterate = function(fn, reverse) {
      if (reverse) {
        return this.reverse().__iterate(fn);
      }
      var iterations = 0;
      var node = this._head;
      while (node) {
        if (fn(node.value, iterations++, this) === false) {
          break;
        }
        node = node.next;
      }
      return iterations;
    };

    Stack.prototype.__iterator = function(type, reverse) {
      if (reverse) {
        return this.reverse().__iterator(type);
      }
      var iterations = 0;
      var node = this._head;
      return new src_Iterator__Iterator(function()  {
        if (node) {
          var value = node.value;
          node = node.next;
          return iteratorValue(type, iterations++, value);
        }
        return iteratorDone();
      });
    };


  function isStack(maybeStack) {
    return !!(maybeStack && maybeStack[IS_STACK_SENTINEL]);
  }

  Stack.isStack = isStack;

  var IS_STACK_SENTINEL = '@@__IMMUTABLE_STACK__@@';

  var StackPrototype = Stack.prototype;
  StackPrototype[IS_STACK_SENTINEL] = true;
  StackPrototype.withMutations = MapPrototype.withMutations;
  StackPrototype.asMutable = MapPrototype.asMutable;
  StackPrototype.asImmutable = MapPrototype.asImmutable;
  StackPrototype.wasAltered = MapPrototype.wasAltered;


  function makeStack(size, head, ownerID, hash) {
    var map = Object.create(StackPrototype);
    map.size = size;
    map._head = head;
    map.__ownerID = ownerID;
    map.__hash = hash;
    map.__altered = false;
    return map;
  }

  var EMPTY_STACK;
  function emptyStack() {
    return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
  }

  createClass(src_Set__Set, SetCollection);

    // @pragma Construction

    function src_Set__Set(value) {
      return value === null || value === undefined ? emptySet() :
        isSet(value) ? value :
        emptySet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    src_Set__Set.of = function(/*...values*/) {
      return this(arguments);
    };

    src_Set__Set.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    src_Set__Set.prototype.toString = function() {
      return this.__toString('Set {', '}');
    };

    // @pragma Access

    src_Set__Set.prototype.has = function(value) {
      return this._map.has(value);
    };

    // @pragma Modification

    src_Set__Set.prototype.add = function(value) {
      return updateSet(this, this._map.set(value, true));
    };

    src_Set__Set.prototype.remove = function(value) {
      return updateSet(this, this._map.remove(value));
    };

    src_Set__Set.prototype.clear = function() {
      return updateSet(this, this._map.clear());
    };

    // @pragma Composition

    src_Set__Set.prototype.union = function() {var iters = SLICE$0.call(arguments, 0);
      iters = iters.filter(function(x ) {return x.size !== 0});
      if (iters.length === 0) {
        return this;
      }
      if (this.size === 0 && iters.length === 1) {
        return this.constructor(iters[0]);
      }
      return this.withMutations(function(set ) {
        for (var ii = 0; ii < iters.length; ii++) {
          SetIterable(iters[ii]).forEach(function(value ) {return set.add(value)});
        }
      });
    };

    src_Set__Set.prototype.intersect = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (!iters.every(function(iter ) {return iter.contains(value)})) {
            set.remove(value);
          }
        });
      });
    };

    src_Set__Set.prototype.subtract = function() {var iters = SLICE$0.call(arguments, 0);
      if (iters.length === 0) {
        return this;
      }
      iters = iters.map(function(iter ) {return SetIterable(iter)});
      var originalSet = this;
      return this.withMutations(function(set ) {
        originalSet.forEach(function(value ) {
          if (iters.some(function(iter ) {return iter.contains(value)})) {
            set.remove(value);
          }
        });
      });
    };

    src_Set__Set.prototype.merge = function() {
      return this.union.apply(this, arguments);
    };

    src_Set__Set.prototype.mergeWith = function(merger) {var iters = SLICE$0.call(arguments, 1);
      return this.union.apply(this, iters);
    };

    src_Set__Set.prototype.sort = function(comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator));
    };

    src_Set__Set.prototype.sortBy = function(mapper, comparator) {
      // Late binding
      return OrderedSet(sortFactory(this, comparator, mapper));
    };

    src_Set__Set.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    src_Set__Set.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return this._map.__iterate(function(_, k)  {return fn(k, k, this$0)}, reverse);
    };

    src_Set__Set.prototype.__iterator = function(type, reverse) {
      return this._map.map(function(_, k)  {return k}).__iterator(type, reverse);
    };

    src_Set__Set.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return this.__make(newMap, ownerID);
    };


  function isSet(maybeSet) {
    return !!(maybeSet && maybeSet[IS_SET_SENTINEL]);
  }

  src_Set__Set.isSet = isSet;

  var IS_SET_SENTINEL = '@@__IMMUTABLE_SET__@@';

  var SetPrototype = src_Set__Set.prototype;
  SetPrototype[IS_SET_SENTINEL] = true;
  SetPrototype[DELETE] = SetPrototype.remove;
  SetPrototype.mergeDeep = SetPrototype.merge;
  SetPrototype.mergeDeepWith = SetPrototype.mergeWith;
  SetPrototype.withMutations = MapPrototype.withMutations;
  SetPrototype.asMutable = MapPrototype.asMutable;
  SetPrototype.asImmutable = MapPrototype.asImmutable;

  SetPrototype.__empty = emptySet;
  SetPrototype.__make = makeSet;

  function updateSet(set, newMap) {
    if (set.__ownerID) {
      set.size = newMap.size;
      set._map = newMap;
      return set;
    }
    return newMap === set._map ? set :
      newMap.size === 0 ? set.__empty() :
      set.__make(newMap);
  }

  function makeSet(map, ownerID) {
    var set = Object.create(SetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_SET;
  function emptySet() {
    return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
  }

  createClass(OrderedSet, src_Set__Set);

    // @pragma Construction

    function OrderedSet(value) {
      return value === null || value === undefined ? emptyOrderedSet() :
        isOrderedSet(value) ? value :
        emptyOrderedSet().withMutations(function(set ) {
          var iter = SetIterable(value);
          assertNotInfinite(iter.size);
          iter.forEach(function(v ) {return set.add(v)});
        });
    }

    OrderedSet.of = function(/*...values*/) {
      return this(arguments);
    };

    OrderedSet.fromKeys = function(value) {
      return this(KeyedIterable(value).keySeq());
    };

    OrderedSet.prototype.toString = function() {
      return this.__toString('OrderedSet {', '}');
    };


  function isOrderedSet(maybeOrderedSet) {
    return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
  }

  OrderedSet.isOrderedSet = isOrderedSet;

  var OrderedSetPrototype = OrderedSet.prototype;
  OrderedSetPrototype[IS_ORDERED_SENTINEL] = true;

  OrderedSetPrototype.__empty = emptyOrderedSet;
  OrderedSetPrototype.__make = makeOrderedSet;

  function makeOrderedSet(map, ownerID) {
    var set = Object.create(OrderedSetPrototype);
    set.size = map ? map.size : 0;
    set._map = map;
    set.__ownerID = ownerID;
    return set;
  }

  var EMPTY_ORDERED_SET;
  function emptyOrderedSet() {
    return EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()));
  }

  createClass(Record, KeyedCollection);

    function Record(defaultValues, name) {
      var RecordType = function Record(values) {
        if (!(this instanceof RecordType)) {
          return new RecordType(values);
        }
        this._map = src_Map__Map(values);
      };

      var keys = Object.keys(defaultValues);

      var RecordTypePrototype = RecordType.prototype = Object.create(RecordPrototype);
      RecordTypePrototype.constructor = RecordType;
      name && (RecordTypePrototype._name = name);
      RecordTypePrototype._defaultValues = defaultValues;
      RecordTypePrototype._keys = keys;
      RecordTypePrototype.size = keys.length;

      try {
        keys.forEach(function(key ) {
          Object.defineProperty(RecordType.prototype, key, {
            get: function() {
              return this.get(key);
            },
            set: function(value) {
              invariant(this.__ownerID, 'Cannot set on an immutable record.');
              this.set(key, value);
            }
          });
        });
      } catch (error) {
        // Object.defineProperty failed. Probably IE8.
      }

      return RecordType;
    }

    Record.prototype.toString = function() {
      return this.__toString(recordName(this) + ' {', '}');
    };

    // @pragma Access

    Record.prototype.has = function(k) {
      return this._defaultValues.hasOwnProperty(k);
    };

    Record.prototype.get = function(k, notSetValue) {
      if (!this.has(k)) {
        return notSetValue;
      }
      var defaultVal = this._defaultValues[k];
      return this._map ? this._map.get(k, defaultVal) : defaultVal;
    };

    // @pragma Modification

    Record.prototype.clear = function() {
      if (this.__ownerID) {
        this._map && this._map.clear();
        return this;
      }
      var SuperRecord = Object.getPrototypeOf(this).constructor;
      return SuperRecord._empty || (SuperRecord._empty = makeRecord(this, emptyMap()));
    };

    Record.prototype.set = function(k, v) {
      if (!this.has(k)) {
        throw new Error('Cannot set unknown key "' + k + '" on ' + recordName(this));
      }
      var newMap = this._map && this._map.set(k, v);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.remove = function(k) {
      if (!this.has(k)) {
        return this;
      }
      var newMap = this._map && this._map.remove(k);
      if (this.__ownerID || newMap === this._map) {
        return this;
      }
      return makeRecord(this, newMap);
    };

    Record.prototype.wasAltered = function() {
      return this._map.wasAltered();
    };

    Record.prototype.__iterator = function(type, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterator(type, reverse);
    };

    Record.prototype.__iterate = function(fn, reverse) {var this$0 = this;
      return KeyedIterable(this._defaultValues).map(function(_, k)  {return this$0.get(k)}).__iterate(fn, reverse);
    };

    Record.prototype.__ensureOwner = function(ownerID) {
      if (ownerID === this.__ownerID) {
        return this;
      }
      var newMap = this._map && this._map.__ensureOwner(ownerID);
      if (!ownerID) {
        this.__ownerID = ownerID;
        this._map = newMap;
        return this;
      }
      return makeRecord(this, newMap, ownerID);
    };


  var RecordPrototype = Record.prototype;
  RecordPrototype[DELETE] = RecordPrototype.remove;
  RecordPrototype.deleteIn =
  RecordPrototype.removeIn = MapPrototype.removeIn;
  RecordPrototype.merge = MapPrototype.merge;
  RecordPrototype.mergeWith = MapPrototype.mergeWith;
  RecordPrototype.mergeIn = MapPrototype.mergeIn;
  RecordPrototype.mergeDeep = MapPrototype.mergeDeep;
  RecordPrototype.mergeDeepWith = MapPrototype.mergeDeepWith;
  RecordPrototype.mergeDeepIn = MapPrototype.mergeDeepIn;
  RecordPrototype.setIn = MapPrototype.setIn;
  RecordPrototype.update = MapPrototype.update;
  RecordPrototype.updateIn = MapPrototype.updateIn;
  RecordPrototype.withMutations = MapPrototype.withMutations;
  RecordPrototype.asMutable = MapPrototype.asMutable;
  RecordPrototype.asImmutable = MapPrototype.asImmutable;


  function makeRecord(likeRecord, map, ownerID) {
    var record = Object.create(Object.getPrototypeOf(likeRecord));
    record._map = map;
    record.__ownerID = ownerID;
    return record;
  }

  function recordName(record) {
    return record._name || record.constructor.name;
  }

  function deepEqual(a, b) {
    if (a === b) {
      return true;
    }

    if (
      !isIterable(b) ||
      a.size !== undefined && b.size !== undefined && a.size !== b.size ||
      a.__hash !== undefined && b.__hash !== undefined && a.__hash !== b.__hash ||
      isKeyed(a) !== isKeyed(b) ||
      isIndexed(a) !== isIndexed(b) ||
      isOrdered(a) !== isOrdered(b)
    ) {
      return false;
    }

    if (a.size === 0 && b.size === 0) {
      return true;
    }

    var notAssociative = !isAssociative(a);

    if (isOrdered(a)) {
      var entries = a.entries();
      return b.every(function(v, k)  {
        var entry = entries.next().value;
        return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
      }) && entries.next().done;
    }

    var flipped = false;

    if (a.size === undefined) {
      if (b.size === undefined) {
        a.cacheResult();
      } else {
        flipped = true;
        var _ = a;
        a = b;
        b = _;
      }
    }

    var allEqual = true;
    var bSize = b.__iterate(function(v, k)  {
      if (notAssociative ? !a.has(v) :
          flipped ? !is(v, a.get(k, NOT_SET)) : !is(a.get(k, NOT_SET), v)) {
        allEqual = false;
        return false;
      }
    });

    return allEqual && a.size === bSize;
  }

  createClass(Range, IndexedSeq);

    function Range(start, end, step) {
      if (!(this instanceof Range)) {
        return new Range(start, end, step);
      }
      invariant(step !== 0, 'Cannot step a Range by 0');
      start = start || 0;
      if (end === undefined) {
        end = Infinity;
      }
      step = step === undefined ? 1 : Math.abs(step);
      if (end < start) {
        step = -step;
      }
      this._start = start;
      this._end = end;
      this._step = step;
      this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
      if (this.size === 0) {
        if (EMPTY_RANGE) {
          return EMPTY_RANGE;
        }
        EMPTY_RANGE = this;
      }
    }

    Range.prototype.toString = function() {
      if (this.size === 0) {
        return 'Range []';
      }
      return 'Range [ ' +
        this._start + '...' + this._end +
        (this._step > 1 ? ' by ' + this._step : '') +
      ' ]';
    };

    Range.prototype.get = function(index, notSetValue) {
      return this.has(index) ?
        this._start + wrapIndex(this, index) * this._step :
        notSetValue;
    };

    Range.prototype.contains = function(searchValue) {
      var possibleIndex = (searchValue - this._start) / this._step;
      return possibleIndex >= 0 &&
        possibleIndex < this.size &&
        possibleIndex === Math.floor(possibleIndex);
    };

    Range.prototype.slice = function(begin, end) {
      if (wholeSlice(begin, end, this.size)) {
        return this;
      }
      begin = resolveBegin(begin, this.size);
      end = resolveEnd(end, this.size);
      if (end <= begin) {
        return new Range(0, 0);
      }
      return new Range(this.get(begin, this._end), this.get(end, this._end), this._step);
    };

    Range.prototype.indexOf = function(searchValue) {
      var offsetValue = searchValue - this._start;
      if (offsetValue % this._step === 0) {
        var index = offsetValue / this._step;
        if (index >= 0 && index < this.size) {
          return index
        }
      }
      return -1;
    };

    Range.prototype.lastIndexOf = function(searchValue) {
      return this.indexOf(searchValue);
    };

    Range.prototype.__iterate = function(fn, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      for (var ii = 0; ii <= maxIndex; ii++) {
        if (fn(value, ii, this) === false) {
          return ii + 1;
        }
        value += reverse ? -step : step;
      }
      return ii;
    };

    Range.prototype.__iterator = function(type, reverse) {
      var maxIndex = this.size - 1;
      var step = this._step;
      var value = reverse ? this._start + maxIndex * step : this._start;
      var ii = 0;
      return new src_Iterator__Iterator(function()  {
        var v = value;
        value += reverse ? -step : step;
        return ii > maxIndex ? iteratorDone() : iteratorValue(type, ii++, v);
      });
    };

    Range.prototype.equals = function(other) {
      return other instanceof Range ?
        this._start === other._start &&
        this._end === other._end &&
        this._step === other._step :
        deepEqual(this, other);
    };


  var EMPTY_RANGE;

  createClass(Repeat, IndexedSeq);

    function Repeat(value, times) {
      if (!(this instanceof Repeat)) {
        return new Repeat(value, times);
      }
      this._value = value;
      this.size = times === undefined ? Infinity : Math.max(0, times);
      if (this.size === 0) {
        if (EMPTY_REPEAT) {
          return EMPTY_REPEAT;
        }
        EMPTY_REPEAT = this;
      }
    }

    Repeat.prototype.toString = function() {
      if (this.size === 0) {
        return 'Repeat []';
      }
      return 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
    };

    Repeat.prototype.get = function(index, notSetValue) {
      return this.has(index) ? this._value : notSetValue;
    };

    Repeat.prototype.contains = function(searchValue) {
      return is(this._value, searchValue);
    };

    Repeat.prototype.slice = function(begin, end) {
      var size = this.size;
      return wholeSlice(begin, end, size) ? this :
        new Repeat(this._value, resolveEnd(end, size) - resolveBegin(begin, size));
    };

    Repeat.prototype.reverse = function() {
      return this;
    };

    Repeat.prototype.indexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return 0;
      }
      return -1;
    };

    Repeat.prototype.lastIndexOf = function(searchValue) {
      if (is(this._value, searchValue)) {
        return this.size;
      }
      return -1;
    };

    Repeat.prototype.__iterate = function(fn, reverse) {
      for (var ii = 0; ii < this.size; ii++) {
        if (fn(this._value, ii, this) === false) {
          return ii + 1;
        }
      }
      return ii;
    };

    Repeat.prototype.__iterator = function(type, reverse) {var this$0 = this;
      var ii = 0;
      return new src_Iterator__Iterator(function() 
        {return ii < this$0.size ? iteratorValue(type, ii++, this$0._value) : iteratorDone()}
      );
    };

    Repeat.prototype.equals = function(other) {
      return other instanceof Repeat ?
        is(this._value, other._value) :
        deepEqual(other);
    };


  var EMPTY_REPEAT;

  /**
   * Contributes additional methods to a constructor
   */
  function mixin(ctor, methods) {
    var keyCopier = function(key ) { ctor.prototype[key] = methods[key]; };
    Object.keys(methods).forEach(keyCopier);
    Object.getOwnPropertySymbols &&
      Object.getOwnPropertySymbols(methods).forEach(keyCopier);
    return ctor;
  }

  Iterable.Iterator = src_Iterator__Iterator;

  mixin(Iterable, {

    // ### Conversion to other types

    toArray: function() {
      assertNotInfinite(this.size);
      var array = new Array(this.size || 0);
      this.valueSeq().__iterate(function(v, i)  { array[i] = v; });
      return array;
    },

    toIndexedSeq: function() {
      return new ToIndexedSequence(this);
    },

    toJS: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJS === 'function' ? value.toJS() : value}
      ).__toJS();
    },

    toJSON: function() {
      return this.toSeq().map(
        function(value ) {return value && typeof value.toJSON === 'function' ? value.toJSON() : value}
      ).__toJS();
    },

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, true);
    },

    toMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return src_Map__Map(this.toKeyedSeq());
    },

    toObject: function() {
      assertNotInfinite(this.size);
      var object = {};
      this.__iterate(function(v, k)  { object[k] = v; });
      return object;
    },

    toOrderedMap: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedMap(this.toKeyedSeq());
    },

    toOrderedSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
    },

    toSet: function() {
      // Use Late Binding here to solve the circular dependency.
      return src_Set__Set(isKeyed(this) ? this.valueSeq() : this);
    },

    toSetSeq: function() {
      return new ToSetSequence(this);
    },

    toSeq: function() {
      return isIndexed(this) ? this.toIndexedSeq() :
        isKeyed(this) ? this.toKeyedSeq() :
        this.toSetSeq();
    },

    toStack: function() {
      // Use Late Binding here to solve the circular dependency.
      return Stack(isKeyed(this) ? this.valueSeq() : this);
    },

    toList: function() {
      // Use Late Binding here to solve the circular dependency.
      return List(isKeyed(this) ? this.valueSeq() : this);
    },


    // ### Common JavaScript methods and properties

    toString: function() {
      return '[Iterable]';
    },

    __toString: function(head, tail) {
      if (this.size === 0) {
        return head + tail;
      }
      return head + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + tail;
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    concat: function() {var values = SLICE$0.call(arguments, 0);
      return reify(this, concatFactory(this, values));
    },

    contains: function(searchValue) {
      return this.some(function(value ) {return is(value, searchValue)});
    },

    entries: function() {
      return this.__iterator(ITERATE_ENTRIES);
    },

    every: function(predicate, context) {
      assertNotInfinite(this.size);
      var returnValue = true;
      this.__iterate(function(v, k, c)  {
        if (!predicate.call(context, v, k, c)) {
          returnValue = false;
          return false;
        }
      });
      return returnValue;
    },

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, true));
    },

    find: function(predicate, context, notSetValue) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[1] : notSetValue;
    },

    findEntry: function(predicate, context) {
      var found;
      this.__iterate(function(v, k, c)  {
        if (predicate.call(context, v, k, c)) {
          found = [k, v];
          return false;
        }
      });
      return found;
    },

    findLastEntry: function(predicate, context) {
      return this.toSeq().reverse().findEntry(predicate, context);
    },

    forEach: function(sideEffect, context) {
      assertNotInfinite(this.size);
      return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
    },

    join: function(separator) {
      assertNotInfinite(this.size);
      separator = separator !== undefined ? '' + separator : ',';
      var joined = '';
      var isFirst = true;
      this.__iterate(function(v ) {
        isFirst ? (isFirst = false) : (joined += separator);
        joined += v !== null && v !== undefined ? v.toString() : '';
      });
      return joined;
    },

    keys: function() {
      return this.__iterator(ITERATE_KEYS);
    },

    map: function(mapper, context) {
      return reify(this, mapFactory(this, mapper, context));
    },

    reduce: function(reducer, initialReduction, context) {
      assertNotInfinite(this.size);
      var reduction;
      var useFirst;
      if (arguments.length < 2) {
        useFirst = true;
      } else {
        reduction = initialReduction;
      }
      this.__iterate(function(v, k, c)  {
        if (useFirst) {
          useFirst = false;
          reduction = v;
        } else {
          reduction = reducer.call(context, reduction, v, k, c);
        }
      });
      return reduction;
    },

    reduceRight: function(reducer, initialReduction, context) {
      var reversed = this.toKeyedSeq().reverse();
      return reversed.reduce.apply(reversed, arguments);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, true));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, true));
    },

    some: function(predicate, context) {
      return !this.every(not(predicate), context);
    },

    sort: function(comparator) {
      return reify(this, sortFactory(this, comparator));
    },

    values: function() {
      return this.__iterator(ITERATE_VALUES);
    },


    // ### More sequential methods

    butLast: function() {
      return this.slice(0, -1);
    },

    isEmpty: function() {
      return this.size !== undefined ? this.size === 0 : !this.some(function()  {return true});
    },

    count: function(predicate, context) {
      return ensureSize(
        predicate ? this.toSeq().filter(predicate, context) : this
      );
    },

    countBy: function(grouper, context) {
      return countByFactory(this, grouper, context);
    },

    equals: function(other) {
      return deepEqual(this, other);
    },

    entrySeq: function() {
      var iterable = this;
      if (iterable._cache) {
        // We cache as an entries array, so we can just return the cache!
        return new ArraySeq(iterable._cache);
      }
      var entriesSequence = iterable.toSeq().map(entryMapper).toIndexedSeq();
      entriesSequence.fromEntrySeq = function()  {return iterable.toSeq()};
      return entriesSequence;
    },

    filterNot: function(predicate, context) {
      return this.filter(not(predicate), context);
    },

    findLast: function(predicate, context, notSetValue) {
      return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
    },

    first: function() {
      return this.find(returnTrue);
    },

    flatMap: function(mapper, context) {
      return reify(this, flatMapFactory(this, mapper, context));
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, true));
    },

    fromEntrySeq: function() {
      return new FromEntriesSequence(this);
    },

    get: function(searchKey, notSetValue) {
      return this.find(function(_, key)  {return is(key, searchKey)}, undefined, notSetValue);
    },

    getIn: function(searchKeyPath, notSetValue) {
      var nested = this;
      // Note: in an ES6 environment, we would prefer:
      // for (var key of searchKeyPath) {
      var iter = forceIterator(searchKeyPath);
      var step;
      while (!(step = iter.next()).done) {
        var key = step.value;
        nested = nested && nested.get ? nested.get(key, NOT_SET) : NOT_SET;
        if (nested === NOT_SET) {
          return notSetValue;
        }
      }
      return nested;
    },

    groupBy: function(grouper, context) {
      return groupByFactory(this, grouper, context);
    },

    has: function(searchKey) {
      return this.get(searchKey, NOT_SET) !== NOT_SET;
    },

    hasIn: function(searchKeyPath) {
      return this.getIn(searchKeyPath, NOT_SET) !== NOT_SET;
    },

    isSubset: function(iter) {
      iter = typeof iter.contains === 'function' ? iter : Iterable(iter);
      return this.every(function(value ) {return iter.contains(value)});
    },

    isSuperset: function(iter) {
      return iter.isSubset(this);
    },

    keySeq: function() {
      return this.toSeq().map(keyMapper).toIndexedSeq();
    },

    last: function() {
      return this.toSeq().reverse().first();
    },

    max: function(comparator) {
      return maxFactory(this, comparator);
    },

    maxBy: function(mapper, comparator) {
      return maxFactory(this, comparator, mapper);
    },

    min: function(comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator);
    },

    minBy: function(mapper, comparator) {
      return maxFactory(this, comparator ? neg(comparator) : defaultNegComparator, mapper);
    },

    rest: function() {
      return this.slice(1);
    },

    skip: function(amount) {
      return this.slice(Math.max(0, amount));
    },

    skipLast: function(amount) {
      return reify(this, this.toSeq().reverse().skip(amount).reverse());
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, true));
    },

    skipUntil: function(predicate, context) {
      return this.skipWhile(not(predicate), context);
    },

    sortBy: function(mapper, comparator) {
      return reify(this, sortFactory(this, comparator, mapper));
    },

    take: function(amount) {
      return this.slice(0, Math.max(0, amount));
    },

    takeLast: function(amount) {
      return reify(this, this.toSeq().reverse().take(amount).reverse());
    },

    takeWhile: function(predicate, context) {
      return reify(this, takeWhileFactory(this, predicate, context));
    },

    takeUntil: function(predicate, context) {
      return this.takeWhile(not(predicate), context);
    },

    valueSeq: function() {
      return this.toIndexedSeq();
    },


    // ### Hashable Object

    hashCode: function() {
      return this.__hash || (this.__hash = hashIterable(this));
    },


    // ### Internal

    // abstract __iterate(fn, reverse)

    // abstract __iterator(type, reverse)
  });

  // var IS_ITERABLE_SENTINEL = '@@__IMMUTABLE_ITERABLE__@@';
  // var IS_KEYED_SENTINEL = '@@__IMMUTABLE_KEYED__@@';
  // var IS_INDEXED_SENTINEL = '@@__IMMUTABLE_INDEXED__@@';
  // var IS_ORDERED_SENTINEL = '@@__IMMUTABLE_ORDERED__@@';

  var IterablePrototype = Iterable.prototype;
  IterablePrototype[IS_ITERABLE_SENTINEL] = true;
  IterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.values;
  IterablePrototype.__toJS = IterablePrototype.toArray;
  IterablePrototype.__toStringMapper = quoteString;
  IterablePrototype.inspect =
  IterablePrototype.toSource = function() { return this.toString(); };
  IterablePrototype.chain = IterablePrototype.flatMap;

  // Temporary warning about using length
  (function () {
    try {
      Object.defineProperty(IterablePrototype, 'length', {
        get: function () {
          if (!Iterable.noLengthWarning) {
            var stack;
            try {
              throw new Error();
            } catch (error) {
              stack = error.stack;
            }
            if (stack.indexOf('_wrapObject') === -1) {
              console && console.warn && console.warn(
                'iterable.length has been deprecated, '+
                'use iterable.size or iterable.count(). '+
                'This warning will become a silent error in a future version. ' +
                stack
              );
              return this.size;
            }
          }
        }
      });
    } catch (e) {}
  })();



  mixin(KeyedIterable, {

    // ### More sequential methods

    flip: function() {
      return reify(this, flipFactory(this));
    },

    findKey: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry && entry[0];
    },

    findLastKey: function(predicate, context) {
      return this.toSeq().reverse().findKey(predicate, context);
    },

    keyOf: function(searchValue) {
      return this.findKey(function(value ) {return is(value, searchValue)});
    },

    lastKeyOf: function(searchValue) {
      return this.findLastKey(function(value ) {return is(value, searchValue)});
    },

    mapEntries: function(mapper, context) {var this$0 = this;
      var iterations = 0;
      return reify(this,
        this.toSeq().map(
          function(v, k)  {return mapper.call(context, [k, v], iterations++, this$0)}
        ).fromEntrySeq()
      );
    },

    mapKeys: function(mapper, context) {var this$0 = this;
      return reify(this,
        this.toSeq().flip().map(
          function(k, v)  {return mapper.call(context, k, v, this$0)}
        ).flip()
      );
    },

  });

  var KeyedIterablePrototype = KeyedIterable.prototype;
  KeyedIterablePrototype[IS_KEYED_SENTINEL] = true;
  KeyedIterablePrototype[ITERATOR_SYMBOL] = IterablePrototype.entries;
  KeyedIterablePrototype.__toJS = IterablePrototype.toObject;
  KeyedIterablePrototype.__toStringMapper = function(v, k)  {return k + ': ' + quoteString(v)};



  mixin(IndexedIterable, {

    // ### Conversion to other types

    toKeyedSeq: function() {
      return new ToKeyedSequence(this, false);
    },


    // ### ES6 Collection methods (ES6 Array and Map)

    filter: function(predicate, context) {
      return reify(this, filterFactory(this, predicate, context, false));
    },

    findIndex: function(predicate, context) {
      var entry = this.findEntry(predicate, context);
      return entry ? entry[0] : -1;
    },

    indexOf: function(searchValue) {
      var key = this.toKeyedSeq().keyOf(searchValue);
      return key === undefined ? -1 : key;
    },

    lastIndexOf: function(searchValue) {
      return this.toSeq().reverse().indexOf(searchValue);
    },

    reverse: function() {
      return reify(this, reverseFactory(this, false));
    },

    slice: function(begin, end) {
      return reify(this, sliceFactory(this, begin, end, false));
    },

    splice: function(index, removeNum /*, ...values*/) {
      var numArgs = arguments.length;
      removeNum = Math.max(removeNum | 0, 0);
      if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
        return this;
      }
      index = resolveBegin(index, this.size);
      var spliced = this.slice(0, index);
      return reify(
        this,
        numArgs === 1 ?
          spliced :
          spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
      );
    },


    // ### More collection methods

    findLastIndex: function(predicate, context) {
      var key = this.toKeyedSeq().findLastKey(predicate, context);
      return key === undefined ? -1 : key;
    },

    first: function() {
      return this.get(0);
    },

    flatten: function(depth) {
      return reify(this, flattenFactory(this, depth, false));
    },

    get: function(index, notSetValue) {
      index = wrapIndex(this, index);
      return (index < 0 || (this.size === Infinity ||
          (this.size !== undefined && index > this.size))) ?
        notSetValue :
        this.find(function(_, key)  {return key === index}, undefined, notSetValue);
    },

    has: function(index) {
      index = wrapIndex(this, index);
      return index >= 0 && (this.size !== undefined ?
        this.size === Infinity || index < this.size :
        this.indexOf(index) !== -1
      );
    },

    interpose: function(separator) {
      return reify(this, interposeFactory(this, separator));
    },

    interleave: function(/*...iterables*/) {
      var iterables = [this].concat(arrCopy(arguments));
      var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, iterables);
      var interleaved = zipped.flatten(true);
      if (zipped.size) {
        interleaved.size = zipped.size * iterables.length;
      }
      return reify(this, interleaved);
    },

    last: function() {
      return this.get(-1);
    },

    skipWhile: function(predicate, context) {
      return reify(this, skipWhileFactory(this, predicate, context, false));
    },

    zip: function(/*, ...iterables */) {
      var iterables = [this].concat(arrCopy(arguments));
      return reify(this, zipWithFactory(this, defaultZipper, iterables));
    },

    zipWith: function(zipper/*, ...iterables */) {
      var iterables = arrCopy(arguments);
      iterables[0] = this;
      return reify(this, zipWithFactory(this, zipper, iterables));
    },

  });

  IndexedIterable.prototype[IS_INDEXED_SENTINEL] = true;
  IndexedIterable.prototype[IS_ORDERED_SENTINEL] = true;



  mixin(SetIterable, {

    // ### ES6 Collection methods (ES6 Array and Map)

    get: function(value, notSetValue) {
      return this.has(value) ? value : notSetValue;
    },

    contains: function(value) {
      return this.has(value);
    },


    // ### More sequential methods

    keySeq: function() {
      return this.valueSeq();
    },

  });

  SetIterable.prototype.has = IterablePrototype.contains;


  // Mixin subclasses

  mixin(KeyedSeq, KeyedIterable.prototype);
  mixin(IndexedSeq, IndexedIterable.prototype);
  mixin(SetSeq, SetIterable.prototype);

  mixin(KeyedCollection, KeyedIterable.prototype);
  mixin(IndexedCollection, IndexedIterable.prototype);
  mixin(SetCollection, SetIterable.prototype);


  // #pragma Helper functions

  function keyMapper(v, k) {
    return k;
  }

  function entryMapper(v, k) {
    return [k, v];
  }

  function not(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    }
  }

  function neg(predicate) {
    return function() {
      return -predicate.apply(this, arguments);
    }
  }

  function quoteString(value) {
    return typeof value === 'string' ? JSON.stringify(value) : value;
  }

  function defaultZipper() {
    return arrCopy(arguments);
  }

  function defaultNegComparator(a, b) {
    return a < b ? 1 : a > b ? -1 : 0;
  }

  function hashIterable(iterable) {
    if (iterable.size === Infinity) {
      return 0;
    }
    var ordered = isOrdered(iterable);
    var keyed = isKeyed(iterable);
    var h = ordered ? 1 : 0;
    var size = iterable.__iterate(
      keyed ?
        ordered ?
          function(v, k)  { h = 31 * h + hashMerge(hash(v), hash(k)) | 0; } :
          function(v, k)  { h = h + hashMerge(hash(v), hash(k)) | 0; } :
        ordered ?
          function(v ) { h = 31 * h + hash(v) | 0; } :
          function(v ) { h = h + hash(v) | 0; }
    );
    return murmurHashOfSize(size, h);
  }

  function murmurHashOfSize(size, h) {
    h = src_Math__imul(h, 0xCC9E2D51);
    h = src_Math__imul(h << 15 | h >>> -15, 0x1B873593);
    h = src_Math__imul(h << 13 | h >>> -13, 5);
    h = (h + 0xE6546B64 | 0) ^ size;
    h = src_Math__imul(h ^ h >>> 16, 0x85EBCA6B);
    h = src_Math__imul(h ^ h >>> 13, 0xC2B2AE35);
    h = smi(h ^ h >>> 16);
    return h;
  }

  function hashMerge(a, b) {
    return a ^ b + 0x9E3779B9 + (a << 6) + (a >> 2) | 0; // int
  }

  var Immutable = {

    Iterable: Iterable,

    Seq: Seq,
    Collection: Collection,
    Map: src_Map__Map,
    OrderedMap: OrderedMap,
    List: List,
    Stack: Stack,
    Set: src_Set__Set,
    OrderedSet: OrderedSet,

    Record: Record,
    Range: Range,
    Repeat: Repeat,

    is: is,
    fromJS: fromJS,

  };

  return Immutable;

}));
},{}],4:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if ("production" !== process.env.NODE_ENV) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;

}).call(this,require('_process'))

},{"_process":2}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  ("production" !== process.env.NODE_ENV ? invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  ) : invariant(obj instanceof Object && !Array.isArray(obj)));
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

}).call(this,require('_process'))

},{"./invariant":4,"_process":2}],6:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var Dispatcher = require('../dispatcher');
var apiSubscriptionSrvc = require('../services/index').apiSubscriptions;
var kState = require('../constants/states');
module.exports = (function() {
  var Actions = function Actions() {
    this._dispatcher = Dispatcher;
  };
  return ($traceurRuntime.createClass)(Actions, {
    _makePayload: function(action, syncState, data) {
      return {
        actionType: action,
        syncState: syncState,
        data: data
      };
    },
    _setMetaState: function(normalizedData) {
      var metaState = arguments[1] !== (void 0) ? arguments[1] : kState.SYNCED;
      _.each(normalizedData.entities, function(entities) {
        _.each(entities, function(entity) {
          entity._meta_state = metaState;
        });
      });
      return normalizedData;
    },
    _getPhysicalChannels: function(channels, methods) {
      return _.flatten(channels.map(function(channel) {
        return methods.map(function(method) {
          return method + ' ' + channel;
        });
      }));
    },
    _subscribe: function(channels, methods, handler, options) {
      if (_.isString(channels)) {
        channels = [channels];
      }
      if (!_.isArray(methods)) {
        throw new Error('methods argument must be array of HTTP methods');
      }
      _.each(this._getPhysicalChannels(channels, methods), function(channel) {
        apiSubscriptionSrvc.subscribe(channel, handler, options);
      });
    },
    _unsubscribe: function(channels, methods, handler) {
      if (_.isString(channels)) {
        channels = [channels];
      }
      if (!_.isArray(methods)) {
        throw new Error('methods argument must be array of HTTP methods');
      }
      _.each(this._getPhysicalChannels(channels, methods), function(channel) {
        apiSubscriptionSrvc.unsubscribe(channel, handler);
      });
    },
    _normalizeChannelName: function(channel) {
      return apiSubscriptionSrvc.normalizeChannelName(channel);
    },
    _checkDispatchArgs: function(action, syncState) {
      if (action === undefined) {
        throw new Error("action argument value of undefined passed to dispatchUserAction.  You're most likely referencing an invalid Action constant (constants/actions.js).");
      }
      if (syncState === undefined) {
        throw new Error("syncState argument value of undefined passed to dispatchUserAction.  You're most likely referencing an invalid State constant (constants/state.js).");
      }
    },
    dispatchServerAction: function(action, syncState, data) {
      this._checkDispatchArgs(action, syncState);
      try {
        this._dispatcher.handleServerAction(this._makePayload(action, syncState, data));
      } catch (err) {
        console.error(err.stack);
      }
    },
    dispatchViewAction: function(action, syncState, data) {
      this._checkDispatchArgs(action, syncState);
      try {
        this._dispatcher.handleViewAction(this._makePayload(action, syncState, data));
      } catch (err) {
        console.log(err.stack);
      }
    }
  }, {});
}());


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/base.js
},{"../constants/states":18,"../dispatcher":19,"../services/index":22,"lodash":"lodash"}],7:[function(require,module,exports){
"use strict";
'use strict';
var kActions = require('../constants/actions');
var kStates = require('../constants/states');
var ajax = require('../common/ajax');
var meteredGET = require('../common/metered-request').get;
var BaseAction = require('./base');
var _cid = 0;
var ItemActions = function ItemActions() {
  $traceurRuntime.superConstructor($ItemActions).call(this);
};
var $ItemActions = ItemActions;
($traceurRuntime.createClass)(ItemActions, {
  getAll: function() {
    var $__0 = this;
    meteredGET('/api/items', (function() {
      return $__0.dispatchServerAction(kActions.ITEM_GETALL, kStates.LOADING);
    }), (function(data) {
      return $__0.dispatchServerAction(kActions.ITEM_GETALL, kStates.SYNCED, data);
    }), (function(err) {
      return $__0.dispatchServerAction(kActions.ITEM_GETALL, kStates.ERRORED, err);
    }));
  },
  requestCreateEntry: function(first, last) {
    console.debug((this.getClassname() + ":requestCreateEntry"));
    var cid = 'c' + (_cid += 1),
        payload = {
          cid: cid,
          first: first,
          last: last
        };
    ajax({
      url: "/api/items",
      type: "POST",
      data: payload,
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    }).then(function(data) {
      this.dispatchServerAction(kActions.ITEM_POST, kStates.SYNCED, data);
    }.bind(this)).catch(function(err) {
      this.dispatchServerAction(kActions.ITEM_POST, kStates.ERRORED, err);
    }.bind(this));
    this.dispatchServerAction(kActions.ITEM_POST, kStates.NEW, payload);
  }
}, {}, BaseAction);
module.exports = new ItemActions();


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/items.js
},{"../common/ajax":9,"../common/metered-request":11,"../constants/actions":17,"../constants/states":18,"./base":6}],8:[function(require,module,exports){
"use strict";
'use strict';
var kActions = require('../constants/actions');
var kStates = require('../constants/states');
var meteredGET = require('../common/metered-request').get;
var BaseAction = require('./base');
var ItemActions = function ItemActions() {
  $traceurRuntime.superConstructor($ItemActions).call(this);
};
var $ItemActions = ItemActions;
($traceurRuntime.createClass)(ItemActions, {getTime: function() {
    var $__0 = this;
    meteredGET('/api/servertime', (function() {
      return $__0.dispatchServerAction(kActions.SERVERTIME_GET, kStates.LOADING);
    }), (function(data) {
      return $__0.dispatchServerAction(kActions.SERVERTIME_GET, kStates.SYNCED, data);
    }), (function(err) {
      return $__0.dispatchServerAction(kActions.SERVERTIME_GET, kStates.ERRORED, err);
    }));
  }}, {}, BaseAction);
module.exports = new ItemActions();


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/actions/server-time.js
},{"../common/metered-request":11,"../constants/actions":17,"../constants/states":18,"./base":6}],9:[function(require,module,exports){
"use strict";
'use strict';
var $ = require('jquery');
var HTTPError = require('./http-error');
module.exports = function(opts) {
  var promise = new Promise(function(resolve, reject) {
    $.ajax(opts).done(function(data) {
      resolve(data);
    }).fail(function(xhr, status, err) {
      var response;
      if (xhr.status === 0 && xhr.responseText === undefined) {
        response = {detail: 'Possible CORS error; check your browser console for further details'};
      } else {
        response = xhr.responseJSON;
      }
      reject(new HTTPError(opts.url, xhr, status, err, response));
    });
  });
  return promise;
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/common/ajax.js
},{"./http-error":10,"jquery":"jquery"}],10:[function(require,module,exports){
"use strict";
'use strict';
var HTTPError = function HTTPError(url, xhr, status, err, response) {
  this.url = url;
  this.xhr = xhr;
  this.status = status;
  this.error = err;
  this.response = response;
};
($traceurRuntime.createClass)(HTTPError, {toString: function() {
    return (this.constructor.name + " (status=" + this.xhr.status + ", url=" + this.url + ")");
  }}, {}, Error);
module.exports = HTTPError;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/common/http-error.js
},{}],11:[function(require,module,exports){
(function (process){
"use strict";
'use strict';
var _ = require('lodash');
var ajax = require('./ajax');
var _inFlightRequests = {};
module.exports = {get: function(settings, startHdlr, resolveHdlr, rejectHdlr, apiOpts) {
    var url;
    var promise;
    if (_.isString(settings)) {
      url = settings;
      settings = {
        url: url,
        contentType: 'application/json',
        type: 'GET'
      };
    } else {
      url = settings.url;
      settings = _.extend({}, settings, {
        contentType: 'application/json',
        type: 'GET'
      });
    }
    if (!_.isString(url)) {
      throw new Error('metered-request::get - URL argument is not a string');
    }
    if (url in _inFlightRequests) {
      promise = _inFlightRequests[url];
      promise._isNew = false;
      return promise;
    }
    promise = new Promise(function(resolve, reject) {
      process.nextTick(function() {
        ajax(settings, apiOpts).then(function(data) {
          delete _inFlightRequests[url];
          resolveHdlr(data);
          resolve(data);
        }, function(err) {
          delete _inFlightRequests[url];
          rejectHdlr(err);
          reject(err);
        });
        startHdlr();
      });
    });
    promise.catch(function() {});
    promise._isNew = true;
    _inFlightRequests[url] = promise;
    return promise;
  }};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/common/metered-request.js
}).call(this,require('_process'))

},{"./ajax":9,"_process":2,"lodash":"lodash"}],12:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Router = require('react-router'),
    RouteHandler = Router.RouteHandler;
var NavBar = require('./nav-bar.jsx');
module.exports = React.createClass({
  displayName: "exports",
  mixins: [Router.State],
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (React.createElement("div", null, React.createElement(NavBar, null), React.createElement(RouteHandler, null)));
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/app.jsx
},{"./nav-bar.jsx":14,"react-router":"react-router","react/addons":"react/addons"}],13:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
module.exports = React.createClass({
  displayName: "exports",
  render: function() {
    return React.createElement("div", null, "items");
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/items.jsx
},{"react/addons":"react/addons"}],14:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Router = require('react-router'),
    Link = Router.Link;
module.exports = React.createClass({
  displayName: "exports",
  mixins: [Router.State],
  render: function() {
    return (React.createElement("nav", {className: "navbar navbar-default"}, React.createElement("div", {className: "container-fluid"}, React.createElement("div", {className: "navbar-header"}, React.createElement("button", {
      type: "button",
      className: "navbar-toggle collapsed",
      "data-toggle": "collapse",
      "data-target": "#bs-example-navbar-collapse-1"
    }, React.createElement("span", {className: "sr-only"}, "Toggle navigation"), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"})), React.createElement(Link, {
      to: "root",
      className: "navbar-brand"
    }, window.EX.const.title)), React.createElement("div", {
      className: "collapse navbar-collapse",
      id: "bs-example-navbar-collapse-1"
    }, React.createElement("ul", {className: "nav navbar-nav"}, React.createElement("li", {className: this.isActive('items') ? "active" : ''}, React.createElement(Link, {to: "items"}, "Items")), React.createElement("li", {className: this.isActive('server-time') ? "active" : ''}, React.createElement(Link, {to: "server-time"}, "Server-Time")))))));
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/nav-bar.jsx
},{"react-router":"react-router","react/addons":"react/addons"}],15:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
module.exports = React.createClass({
  displayName: "exports",
  render: function() {
    return React.createElement("div", null, "Route Not Found");
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/route-not-found.jsx
},{"react/addons":"react/addons"}],16:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
module.exports = React.createClass({
  displayName: "exports",
  render: function() {
    return React.createElement("div", null, "server-time");
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/components/server-time.jsx
},{"react/addons":"react/addons"}],17:[function(require,module,exports){
"use strict";
'use strict';
var keyMirror = require('react/lib/keyMirror');
module.exports = keyMirror({
  ITEM_GETALL: null,
  ITEM_GETONE: null,
  ITEM_POST: null,
  ITEM_PUT: null,
  ITEM_DELETE: null,
  SERVERTIME_GET: null
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/constants/actions.js
},{"react/lib/keyMirror":5}],18:[function(require,module,exports){
"use strict";
'use strict';
var keyMirror = require('react/lib/keyMirror');
module.exports = keyMirror({
  SYNCED: null,
  LOADING: null,
  NEW: null,
  SAVING: null,
  DELETING: null,
  ERRORED: null
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/constants/states.js
},{"react/lib/keyMirror":5}],19:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var Dispatcher = require('./vendor/flux/Dispatcher');
module.exports = _.extend(new Dispatcher(), {
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },
  handleServerAction: function(action) {
    this.dispatch({
      source: 'SERVER_ACTION',
      action: action
    });
  }
});


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/dispatcher.js
},{"./vendor/flux/Dispatcher":27,"lodash":"lodash"}],20:[function(require,module,exports){
"use strict";
'use strict';
var React = require('react/addons');
var Router = require('react-router'),
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute,
    DefaultRoute = Router.Route;
module.exports = (React.createElement(Route, {
  name: "root",
  path: "/",
  handler: require('./components/app.jsx')
}, React.createElement(DefaultRoute, {
  name: "items",
  path: "/",
  handler: require('./components/items.jsx')
}), React.createElement(Route, {
  name: "server-time",
  handler: require('./components/server-time.jsx')
}), React.createElement(NotFoundRoute, {handler: require('./components/route-not-found.jsx')})));


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/routes.jsx
},{"./components/app.jsx":12,"./components/items.jsx":13,"./components/route-not-found.jsx":15,"./components/server-time.jsx":16,"react-router":"react-router","react/addons":"react/addons"}],21:[function(require,module,exports){
"use strict";
'use strict';
var EventEmitter = require("events").EventEmitter;
var _ = require('lodash');
var io = require('socket.io-client');
var httpVerbRe = /^(GET|PUT|POST|DELETE)\s/;
var SubscriptionService = function SubscriptionService(accessToken) {
  $traceurRuntime.superConstructor($SubscriptionService).call(this);
  this.accessToken = accessToken;
  var socket = this.socket = io({transports: ['websocket']});
  socket.on('connect', this.handleConnect.bind(this));
  socket.on('disconnect', this.handleDisconnect.bind(this));
  socket.on('reconnect', this.handleReconnect.bind(this));
  socket.on('set', this.handleSet.bind(this));
};
var $SubscriptionService = SubscriptionService;
($traceurRuntime.createClass)(SubscriptionService, {
  handleConnect: function() {
    this.socket.emit('auth', this.accessToken);
    this.emit('connect');
  },
  handleDisconnect: function() {
    this.emit('disconnect');
  },
  handleReconnect: function(attempts) {
    _.each(this._events, function(fn, channel) {
      if (httpVerbRe.test(channel)) {
        this.removeAllListeners(channel);
      }
    }, this);
    this.emit('reconnect');
  },
  handleSet: function(data) {
    this.emit(data.channel, 'set', data.channel, JSON.parse(data.data));
  },
  subscribe: function(channel, handler, options) {
    if (EventEmitter.listenerCount(this, channel) !== 0) {
      throw new Error('api-subscription: Cannot subscribe to channel "' + channel + '" more than once.');
    }
    options = _.extend({
      initialPayload: false,
      reconnectPayload: false
    }, options || {});
    handler._options = options;
    this.addListener(channel, handler);
    this.socket.emit('subscribe', channel, options.initialPayload);
    return this;
  },
  unsubscribe: function(channel, handler) {
    this.removeListener(channel, handler);
    if (EventEmitter.listenerCount(this, channel) === 0) {
      this.socket.emit('unsubscribe', channel);
    }
    return this;
  },
  normalizeChannelName: function(channel) {
    return channel.replace(/^(GET|PUT|POST|DELETE)\s/, '');
  },
  isConnected: function() {
    return this.socket.connected;
  },
  isDisconnected: function() {
    return this.socket.disconnected;
  }
}, {}, EventEmitter);
module.exports = function(accessToken) {
  return new SubscriptionService(accessToken);
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/services/api-subscriptions.js
},{"events":"events","lodash":"lodash","socket.io-client":"socket.io-client"}],22:[function(require,module,exports){
"use strict";
'use strict';
var apiSubscriptionSrvc = require('./api-subscriptions');
exports.initialize = function(accessToken) {
  exports.apiSubscriptions = apiSubscriptionSrvc(accessToken);
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/services/index.js
},{"./api-subscriptions":21}],23:[function(require,module,exports){
"use strict";
'use strict';
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var Immutable = require('immutable');
var CHANGE_EVENT = 'change';
var BaseStore = function BaseStore(dispatcher) {
  $traceurRuntime.superConstructor($BaseStore).call(this);
  this.dispatcher = dispatcher;
  this.inFlight = false;
  this.error = null;
  this._register();
  this.initialize();
};
var $BaseStore = BaseStore;
($traceurRuntime.createClass)(BaseStore, {
  initialize: function() {},
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },
  getState: function() {
    return undefined;
  },
  isInFlight: function() {
    return this.inFlight;
  },
  getActions: function() {
    return {};
  },
  getStoreName: function() {
    return this.constructor.name;
  },
  makeStatefulEntry: function() {
    var state = arguments[0];
    var data = arguments[1];
    return {
      meta: {state: state},
      data: data
    };
  },
  updateStatefulEntry: function(entry, state, data) {
    _.extend(entry.data || (entry.data = {}), data);
    entry.meta.state = state;
    return entry;
  },
  _register: function() {
    this.dispatchToken = this.dispatcher.register(_.bind(function(payload) {
      this._handleAction(payload.action.actionType, payload.action);
    }, this));
  },
  _handleAction: function(actionType, action) {
    var actions = this.getActions();
    if (actions.hasOwnProperty(actionType)) {
      var actionValue = actions[actionType];
      if (_.isString(actionValue)) {
        if (_.isFunction(this[actionValue])) {
          this[actionValue](action);
        } else {
          throw new Error(("Action handler defined in Store map is undefined or not a Function. Store: " + this.constructor.name + ", Action: " + actionType));
        }
      } else if (_.isFunction(actionValue)) {
        actionValue.call(this, action);
      }
    }
  },
  _makeStoreEntry: function() {
    return Immutable.fromJS({_meta: {state: undefined}});
  }
}, {}, EventEmitter);
module.exports = BaseStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/base.js
},{"events":"events","immutable":3,"lodash":"lodash"}],24:[function(require,module,exports){
"use strict";
'use strict';
var Dispatcher = require('../dispatcher');
var ItemsStore = require('./items'),
    ServerTimeStore = require('./server-time');
exports.initialize = function() {
  exports.ItemsStore = new ItemsStore(Dispatcher);
  exports.ServerTimeStore = new ServerTimeStore(Dispatcher);
  return this;
};


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/index.js
},{"../dispatcher":19,"./items":25,"./server-time":26}],25:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var BaseStore = require('./base');
var kActions = require('../constants/actions'),
    kStates = require('../constants/states'),
    ItemActions = require('../actions/items');
var _actions = _.zipObject([[kActions.ITEM_GETALL, 'handleSetAll'], [kActions.ITEM_POST, 'handleEntryCreate'], [kActions.ITEM_PUT, 'handleEntryUpdate'], [kActions.ITEM_DELETE, 'handleEntryDelete']]);
var EntryStore = function EntryStore(dispatcher) {
  $traceurRuntime.superConstructor($EntryStore).call(this, dispatcher);
  this._items = undefined;
};
var $EntryStore = EntryStore;
($traceurRuntime.createClass)(EntryStore, {
  getActions: function() {
    return _actions;
  },
  _load: function() {
    ItemActions.getAll();
    return undefined;
  },
  _getItems: function() {
    return this._items !== undefined ? this._items : this._load();
  },
  getAll: function() {
    return this._getItems();
  },
  get: function(id) {
    id = parseInt(id, 10);
    return this._items !== undefined ? (id in this._items ? this._items[id] : null) : this._load();
  },
  handleSetAll: function(payload) {
    var $__0 = this;
    console.debug((this.getStoreName() + ":handleSetAll; state=" + payload.state));
    switch (payload.state) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this._items = {};
        _.each(payload.data, (function(item) {
          return $__0.items[item.id] = $__0.makeStatefulEntry(payload.state, item);
        }));
        this.inflight = false;
        break;
    }
    this.emitChange();
  },
  handleEntryCreate: function(payload) {
    console.debug((this.getStoreName() + ":handleEntryCreate; state=" + payload.state));
    var state = this._items || {},
        newEntry,
        existingEntry;
    switch (payload.state) {
      case kStates.NEW:
        state[payload.data.cid] = this.makeStatefulEntry(payload.state, payload.data);
        break;
      case kStates.SYNCED:
        newEntry = payload.data;
        if (newEntry.cid && (existingEntry = state[newEntry.cid]) && !state[newEntry.id]) {
          console.debug((this.getStoreName() + ":handleEntryCreate; converting client-id to server-id"));
          existingEntry = this.updateStatefulEntry(existingEntry, payload.state, newEntry);
          delete state[existingEntry.data.cid];
          state[existingEntry.data.id] = existingEntry;
        } else {
          state[newEntry.id] = this.makeStatefulEntry(payload.state, newEntry);
        }
        break;
    }
    this.emitChange();
  },
  handleEntryUpdate: function(payload) {
    console.debug((this.getStoreName() + ":handleEntryUpdate; state=" + payload.state));
    var newEntry = payload.data,
        existingEntry;
    switch (payload.state) {
      case kStates.SAVING:
        existingEntry = this._items[newEntry.id];
        if (existingEntry) {
          existingEntry = this.updateStatefulEntry(existingEntry, payload.data, newEntry);
        }
        break;
      case kStates.SYNCED:
        existingEntry = this._items[newEntry.id];
        if (existingEntry) {
          existingEntry = this.updateStatefulEntry(existingEntry, payload.data, newEntry);
        }
        break;
    }
    this.emitChange();
  },
  handleEntryDelete: function(payload) {
    console.debug((this.getStoreName() + ":handleEntryDelete; state=" + payload.state));
    var existingEntry = this._items[payload.data.id];
    if (existingEntry) {
      switch (payload.state) {
        case kStates.DELETING:
          existingEntry = this.updateStatefulEntry(existingEntry, payload.state);
          break;
        case kStates.SYNCED:
          delete this._items[payload.data.id];
          break;
      }
      this.emitChange();
    }
  }
}, {}, BaseStore);
module.exports = EntryStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/items.js
},{"../actions/items":7,"../constants/actions":17,"../constants/states":18,"./base":23,"lodash":"lodash"}],26:[function(require,module,exports){
"use strict";
'use strict';
var _ = require('lodash');
var BaseStore = require('./base');
var kActions = require('../constants/actions'),
    kStates = require('../constants/states'),
    ServerActions = require('../actions/server-time');
var _actions = _.zipObject([[kActions.SERVERTIME_GET, 'handleGet']]);
var EntryStore = function EntryStore(dispatcher) {
  $traceurRuntime.superConstructor($EntryStore).call(this, dispatcher);
  this._serverTime = undefined;
};
var $EntryStore = EntryStore;
($traceurRuntime.createClass)(EntryStore, {
  getActions: function() {
    return _actions;
  },
  _load: function() {
    ServerActions.getAll();
    return undefined;
  },
  _getTime: function() {
    return this._serverTime !== undefined ? this._serverTime : this._load();
  },
  getServerTime: function() {
    return this._getTime();
  },
  handleSetAll: function(payload) {
    console.debug((this.getStoreName() + ":handleSetAll; state=" + payload.state));
    switch (payload.state) {
      case kStates.LOADING:
        this.inflight = true;
        break;
      case kStates.SYNCED:
        this.inflight = false;
        break;
    }
    this._serverTime = this.makeStatefulEntry(payload.state, payload.data);
    this.emitChange();
  }
}, {}, BaseStore);
module.exports = EntryStore;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/stores/server-time.js
},{"../actions/server-time":8,"../constants/actions":17,"../constants/states":18,"./base":23,"lodash":"lodash"}],27:[function(require,module,exports){
"use strict";
var invariant = require('./invariant');
var _lastID = 1;
var _prefix = 'ID_';
function Dispatcher() {
  "use strict";
  this.$Dispatcher_callbacks = {};
  this.$Dispatcher_isPending = {};
  this.$Dispatcher_isHandled = {};
  this.$Dispatcher_isDispatching = false;
  this.$Dispatcher_pendingPayload = null;
}
Dispatcher.prototype.register = function(callback) {
  "use strict";
  var id = _prefix + _lastID++;
  this.$Dispatcher_callbacks[id] = callback;
  return id;
};
Dispatcher.prototype.unregister = function(id) {
  "use strict";
  invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id);
  delete this.$Dispatcher_callbacks[id];
};
Dispatcher.prototype.waitFor = function(ids) {
  "use strict";
  invariant(this.$Dispatcher_isDispatching, 'Dispatcher.waitFor(...): Must be invoked while dispatching.');
  for (var ii = 0; ii < ids.length; ii++) {
    var id = ids[ii];
    if (this.$Dispatcher_isPending[id]) {
      invariant(this.$Dispatcher_isHandled[id], 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id);
      continue;
    }
    invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id);
    this.$Dispatcher_invokeCallback(id);
  }
};
Dispatcher.prototype.dispatch = function(payload) {
  "use strict";
  invariant(!this.$Dispatcher_isDispatching, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');
  this.$Dispatcher_startDispatching(payload);
  try {
    for (var id in this.$Dispatcher_callbacks) {
      if (this.$Dispatcher_isPending[id]) {
        continue;
      }
      this.$Dispatcher_invokeCallback(id);
    }
  } finally {
    this.$Dispatcher_stopDispatching();
  }
};
Dispatcher.prototype.isDispatching = function() {
  "use strict";
  return this.$Dispatcher_isDispatching;
};
Dispatcher.prototype.$Dispatcher_invokeCallback = function(id) {
  "use strict";
  this.$Dispatcher_isPending[id] = true;
  this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
  this.$Dispatcher_isHandled[id] = true;
};
Dispatcher.prototype.$Dispatcher_startDispatching = function(payload) {
  "use strict";
  for (var id in this.$Dispatcher_callbacks) {
    this.$Dispatcher_isPending[id] = false;
    this.$Dispatcher_isHandled[id] = false;
  }
  this.$Dispatcher_pendingPayload = payload;
  this.$Dispatcher_isDispatching = true;
};
Dispatcher.prototype.$Dispatcher_stopDispatching = function() {
  "use strict";
  this.$Dispatcher_pendingPayload = null;
  this.$Dispatcher_isDispatching = false;
};
module.exports = Dispatcher;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/vendor/flux/Dispatcher.js
},{"./invariant":28}],28:[function(require,module,exports){
"use strict";
"use strict";
var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }
  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function() {
        return args[argIndex++];
      }));
    }
    error.framesToPop = 1;
    throw error;
  }
};
module.exports = invariant;


//# sourceURL=/Users/hburrows/dev/heroku/react-flux-starter/public/javascripts/vendor/flux/invariant.js
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL21haW4uanN4Iiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9pbW11dGFibGUvZGlzdC9pbW11dGFibGUuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL2ludmFyaWFudC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIva2V5TWlycm9yLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9hY3Rpb25zL2Jhc2UuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2FjdGlvbnMvaXRlbXMuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2FjdGlvbnMvc2VydmVyLXRpbWUuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbW1vbi9hamF4LmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21tb24vaHR0cC1lcnJvci5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tbW9uL21ldGVyZWQtcmVxdWVzdC5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9hcHAuanN4IiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL2l0ZW1zLmpzeCIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9uYXYtYmFyLmpzeCIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29tcG9uZW50cy9yb3V0ZS1ub3QtZm91bmQuanN4IiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9jb21wb25lbnRzL3NlcnZlci10aW1lLmpzeCIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvY29uc3RhbnRzL2FjdGlvbnMuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2NvbnN0YW50cy9zdGF0ZXMuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL2Rpc3BhdGNoZXIuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3JvdXRlcy5qc3giLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3NlcnZpY2VzL2FwaS1zdWJzY3JpcHRpb25zLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9zZXJ2aWNlcy9pbmRleC5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvc3RvcmVzL2Jhc2UuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3N0b3Jlcy9pbmRleC5qcyIsIi9Vc2Vycy9oYnVycm93cy9kZXYvaGVyb2t1L3JlYWN0LWZsdXgtc3RhcnRlci9wdWJsaWMvamF2YXNjcmlwdHMvc3RvcmVzL2l0ZW1zLmpzIiwiL1VzZXJzL2hidXJyb3dzL2Rldi9oZXJva3UvcmVhY3QtZmx1eC1zdGFydGVyL3B1YmxpYy9qYXZhc2NyaXB0cy9zdG9yZXMvc2VydmVyLXRpbWUuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3ZlbmRvci9mbHV4L0Rpc3BhdGNoZXIuanMiLCIvVXNlcnMvaGJ1cnJvd3MvZGV2L2hlcm9rdS9yZWFjdC1mbHV4LXN0YXJ0ZXIvcHVibGljL2phdmFzY3JpcHRzL3ZlbmRvci9mbHV4L2ludmFyaWFudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQUEsV0FBVyxDQUFDO0FBRVosQUFBSSxFQUFBLENBQUEsQ0FBQSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsUUFBTyxDQUFDLENBQUM7QUFLekIsQUFBQyxDQUFDLFNBQVMsQUFBQyxDQUFFO0FBRVosQUFBSSxJQUFBLENBQUEsS0FBSSxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsY0FBYSxDQUFDLENBQUM7QUFFbkMsQUFBSSxJQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsY0FBYSxDQUFDLENBQUM7QUFHcEMsT0FBSyxNQUFNLEVBQUksTUFBSSxDQUFDO0FBRXBCLE1BQUksc0JBQXNCLEFBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQztBQUdqQyxBQUFJLElBQUEsQ0FBQSxRQUFPLEVBQUksQ0FBQSxPQUFNLEFBQUMsQ0FBQyxZQUFXLENBQUMsQ0FBQztBQUNoQyxTQUFPLFdBQVcsQUFBQyxDQUFDLE1BQUssR0FBRyxNQUFNLGVBQWUsQ0FBQyxDQUFDO0FBR3ZELEFBQUksSUFBQSxDQUFBLE1BQUssRUFBSSxDQUFBLE9BQU0sQUFBQyxDQUFDLFVBQVMsQ0FBQyxDQUFDO0FBQ2hDLE9BQUssV0FBVyxBQUFDLEVBQUMsQ0FBQztBQUduQixPQUFLLFFBQVEsRUFBSSxPQUFLLENBQUM7QUFFdkIsQUFBSSxJQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsT0FBTSxBQUFDLENBQUMsY0FBYSxDQUFDLENBQUM7QUFFcEMsQUFBSSxJQUFBLENBQUEsTUFBSyxFQUFJLENBQUEsTUFBSyxPQUFPLEFBQUMsQ0FBQztBQUN6QixTQUFLLENBQUcsT0FBSztBQUNiLFdBQU8sQ0FBRyxDQUFBLE1BQUssZ0JBQWdCO0FBQy9CLFVBQU0sQ0FBRyxVQUFTLEFBQUMsQ0FBRTtBQUNuQixVQUFJLEFBQUMsQ0FBQyw0QkFBMkIsQ0FBQyxDQUFDO0lBQ3JDO0FBQUEsRUFDRixDQUFDLENBQUM7QUFFRixPQUFLLElBQUksQUFBQyxDQUFDLFNBQVUsT0FBTSxDQUFHO0FBQzVCLFFBQUksT0FBTyxBQUFDLENBQUMsS0FBSSxjQUFjLEFBQUMsQ0FBQyxPQUFNLENBQUcsS0FBRyxDQUFDLENBQUcsQ0FBQSxRQUFPLEtBQUssQ0FBQyxDQUFDO0VBQ2pFLENBQUMsQ0FBQztBQUVKLENBQUMsQ0FBQztBQUUrd0Y7Ozs7QUM3Q2p4RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFDO0lBQ2pFO0FBQUEsRUFDRjtBQUFBLEFBRUEsS0FBSSxDQUFDLFNBQVEsQ0FBRztBQUNkLEFBQUksTUFBQSxDQUFBLEtBQUksQ0FBQztBQUNULE9BQUksTUFBSyxJQUFNLFVBQVEsQ0FBRztBQUN4QixVQUFJLEVBQUksSUFBSSxNQUFJLEFBQUMsQ0FDZixvRUFBbUUsRUFDbkUsOERBQTRELENBQzlELENBQUM7SUFDSCxLQUFPO0FBQ0wsQUFBSSxRQUFBLENBQUEsSUFBRyxFQUFJLEVBQUMsQ0FBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUcsRUFBQSxDQUFHLEVBQUEsQ0FBRyxFQUFBLENBQUMsQ0FBQztBQUM3QixBQUFJLFFBQUEsQ0FBQSxRQUFPLEVBQUksRUFBQSxDQUFDO0FBQ2hCLFVBQUksRUFBSSxJQUFJLE1BQUksQUFBQyxDQUNmLHVCQUFzQixFQUN0QixDQUFBLE1BQUssUUFBUSxBQUFDLENBQUMsS0FBSSxDQUFHLFVBQVEsQUFBQyxDQUFFO0FBQUUsYUFBTyxDQUFBLElBQUcsQ0FBRSxRQUFPLEVBQUUsQ0FBQyxDQUFDO01BQUUsQ0FBQyxDQUMvRCxDQUFDO0lBQ0g7QUFBQSxBQUVBLFFBQUksWUFBWSxFQUFJLEVBQUEsQ0FBQztBQUNyQixRQUFNLE1BQUksQ0FBQztFQUNiO0FBQUEsQUFDRixDQUFDO0FBRUQsS0FBSyxRQUFRLEVBQUksVUFBUSxDQUFDO0FBRXU3RyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG5cbi8qKlxuICogTWFpbiBlbnRyeS1wb2ludFxuICovXG4kKGZ1bmN0aW9uICgpIHtcblxuICB2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxuICB2YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyk7XG5cbiAgLy8gZm9yIGRldmVsb3BlciB0b29sc1xuICB3aW5kb3cuUmVhY3QgPSBSZWFjdDtcblxuICBSZWFjdC5pbml0aWFsaXplVG91Y2hFdmVudHModHJ1ZSk7XG5cbiAgLy8gc2VydmljZXMgaW5pdGlhbGl6YXRpb25cbiAgdmFyIFNlcnZpY2VzID0gcmVxdWlyZSgnLi9zZXJ2aWNlcycpO1xuICAgICAgU2VydmljZXMuaW5pdGlhbGl6ZSh3aW5kb3cuRVguY29uc3QuYXBpQWNjZXNzVG9rZW4pO1xuXG4gIC8vIHN0b3JlIGluaXRpYWxpemF0aW9uIC0tIG5lZWRzIHRvIGJlIGRvbmUgYmVmb3JlIGFueSBjb21wb25lbnQgcmVmZXJlbmNlc1xuICB2YXIgU3RvcmVzID0gcmVxdWlyZSgnLi9zdG9yZXMnKTtcbiAgU3RvcmVzLmluaXRpYWxpemUoKTtcblxuICAvLyBmb3IgZGVidWdnaW5nIC0gYWxsb3dzIHlvdSB0byBxdWVyeSB0aGUgc3RvcmVzIGZyb20gdGhlIGJyb3dzZXIgY29uc29sZVxuICB3aW5kb3cuX3N0b3JlcyA9IFN0b3JlcztcblxuICB2YXIgUm91dGVzID0gcmVxdWlyZSgnLi9yb3V0ZXMuanN4Jyk7XG5cbiAgdmFyIHJvdXRlciA9IFJvdXRlci5jcmVhdGUoe1xuICAgIHJvdXRlczogUm91dGVzLFxuICAgIGxvY2F0aW9uOiBSb3V0ZXIuSGlzdG9yeUxvY2F0aW9uLFxuICAgIG9uRXJyb3I6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGFsZXJ0KCd1bmV4cGVjdGVkIGVycm9yIGluIFJvdXRlcicpO1xuICAgIH1cbiAgfSk7XG5cbiAgcm91dGVyLnJ1bihmdW5jdGlvbiAoSGFuZGxlcikge1xuICAgIFJlYWN0LnJlbmRlcihSZWFjdC5jcmVhdGVFbGVtZW50KEhhbmRsZXIsIG51bGwpLCBkb2N1bWVudC5ib2R5KTtcbiAgfSk7XG5cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12YldGcGJpNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NRMEZCUXl4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGTVVJN08wZEJSVWM3UVVGRFNDeERRVUZETEVOQlFVTXNXVUZCV1RzN1FVRkZaQ3hGUVVGRkxFbEJRVWtzUzBGQlN5eEhRVUZITEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1EwRkJRenM3UVVGRmRFTXNSVUZCUlN4SlFVRkpMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETEVOQlFVTTdRVUZEZGtNN08wRkJSVUVzUlVGQlJTeE5RVUZOTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJRenM3UVVGRmRrSXNSVUZCUlN4TFFVRkxMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkRjRU03TzBWQlJVVXNTVUZCU1N4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExGbEJRVmtzUTBGQlF5eERRVUZETzBGQlEzWkRMRTFCUVUwc1VVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU14UkRzN1JVRkZSU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNWVUZCVlN4RFFVRkRMRU5CUVVNN1FVRkRia01zUlVGQlJTeE5RVUZOTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1FVRkRkRUk3TzBGQlJVRXNSVUZCUlN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExFMUJRVTBzUTBGQlF6czdRVUZGTVVJc1JVRkJSU3hKUVVGSkxFMUJRVTBzUjBGQlJ5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN08wVkJSWEpETEVsQlFVa3NUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhOUVVGTkxFTkJRVU03U1VGRGVrSXNUVUZCVFN4RlFVRkZMRTFCUVUwN1NVRkRaQ3hSUVVGUkxFVkJRVVVzVFVGQlRTeERRVUZETEdWQlFXVTdTVUZEYUVNc1QwRkJUeXhGUVVGRkxGbEJRVms3VFVGRGJrSXNTMEZCU3l4RFFVRkRMRFJDUVVFMFFpeERRVUZETEVOQlFVTTdTMEZEY2tNN1FVRkRUQ3hIUVVGSExFTkJRVU1zUTBGQlF6czdSVUZGU0N4TlFVRk5MRU5CUVVNc1IwRkJSeXhEUVVGRExGVkJRVlVzVDBGQlR5eEZRVUZGTzBsQlF6VkNMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU1zYjBKQlFVTXNUMEZCVHl4RlFVRkJMRWxCUVVVc1EwRkJRU3hGUVVGRkxGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhIUVVGSExFTkJRVU1zUTBGQlF6czdRMEZGU2l4RFFVRkRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JuWmhjaUFrSUQwZ2NtVnhkV2x5WlNnbmFuRjFaWEo1SnlrN1hHNWNiaThxS2x4dUlDb2dUV0ZwYmlCbGJuUnllUzF3YjJsdWRGeHVJQ292WEc0a0tHWjFibU4wYVc5dUlDZ3BJSHRjYmx4dUlDQjJZWElnVW1WaFkzUWdQU0J5WlhGMWFYSmxLQ2R5WldGamRDOWhaR1J2Ym5NbktUdGNibHh1SUNCMllYSWdVbTkxZEdWeUlEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRdGNtOTFkR1Z5SnlrN1hHNWNiaUFnTHk4Z1ptOXlJR1JsZG1Wc2IzQmxjaUIwYjI5c2MxeHVJQ0IzYVc1a2IzY3VVbVZoWTNRZ1BTQlNaV0ZqZER0Y2JseHVJQ0JTWldGamRDNXBibWwwYVdGc2FYcGxWRzkxWTJoRmRtVnVkSE1vZEhKMVpTazdYRzVjYmlBZ0x5OGdjMlZ5ZG1salpYTWdhVzVwZEdsaGJHbDZZWFJwYjI1Y2JpQWdkbUZ5SUZObGNuWnBZMlZ6SUQwZ2NtVnhkV2x5WlNnbkxpOXpaWEoyYVdObGN5Y3BPMXh1SUNBZ0lDQWdVMlZ5ZG1salpYTXVhVzVwZEdsaGJHbDZaU2gzYVc1a2IzY3VSVmd1WTI5dWMzUXVZWEJwUVdOalpYTnpWRzlyWlc0cE8xeHVYRzRnSUM4dklITjBiM0psSUdsdWFYUnBZV3hwZW1GMGFXOXVJQzB0SUc1bFpXUnpJSFJ2SUdKbElHUnZibVVnWW1WbWIzSmxJR0Z1ZVNCamIyMXdiMjVsYm5RZ2NtVm1aWEpsYm1ObGMxeHVJQ0IyWVhJZ1UzUnZjbVZ6SUQwZ2NtVnhkV2x5WlNnbkxpOXpkRzl5WlhNbktUdGNiaUFnVTNSdmNtVnpMbWx1YVhScFlXeHBlbVVvS1R0Y2JseHVJQ0F2THlCbWIzSWdaR1ZpZFdkbmFXNW5JQzBnWVd4c2IzZHpJSGx2ZFNCMGJ5QnhkV1Z5ZVNCMGFHVWdjM1J2Y21WeklHWnliMjBnZEdobElHSnliM2R6WlhJZ1kyOXVjMjlzWlZ4dUlDQjNhVzVrYjNjdVgzTjBiM0psY3lBOUlGTjBiM0psY3p0Y2JseHVJQ0IyWVhJZ1VtOTFkR1Z6SUQwZ2NtVnhkV2x5WlNnbkxpOXliM1YwWlhNdWFuTjRKeWs3WEc1Y2JpQWdkbUZ5SUhKdmRYUmxjaUE5SUZKdmRYUmxjaTVqY21WaGRHVW9lMXh1SUNBZ0lISnZkWFJsY3pvZ1VtOTFkR1Z6TEZ4dUlDQWdJR3h2WTJGMGFXOXVPaUJTYjNWMFpYSXVTR2x6ZEc5eWVVeHZZMkYwYVc5dUxGeHVJQ0FnSUc5dVJYSnliM0k2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lHRnNaWEowS0NkMWJtVjRjR1ZqZEdWa0lHVnljbTl5SUdsdUlGSnZkWFJsY2ljcE8xeHVJQ0FnSUgxY2JpQWdmU2s3WEc1Y2JpQWdjbTkxZEdWeUxuSjFiaWhtZFc1amRHbHZiaUFvU0dGdVpHeGxjaWtnZTF4dUlDQWdJRkpsWVdOMExuSmxibVJsY2lnOFNHRnVaR3hsY2k4K0xDQmtiMk4xYldWdWRDNWliMlI1S1R0Y2JpQWdmU2s3WEc1Y2JuMHBPMXh1SWwxOSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKipcbiAqICBDb3B5cmlnaHQgKGMpIDIwMTQtMjAxNSwgRmFjZWJvb2ssIEluYy5cbiAqICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqICBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqICBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqICBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICBnbG9iYWwuSW1tdXRhYmxlID0gZmFjdG9yeSgpXG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO3ZhciBTTElDRSQwID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4gIGZ1bmN0aW9uIGNyZWF0ZUNsYXNzKGN0b3IsIHN1cGVyQ2xhc3MpIHtcbiAgICBpZiAoc3VwZXJDbGFzcykge1xuICAgICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MucHJvdG90eXBlKTtcbiAgICB9XG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yO1xuICB9XG5cbiAgLy8gVXNlZCBmb3Igc2V0dGluZyBwcm90b3R5cGUgbWV0aG9kcyB0aGF0IElFOCBjaG9rZXMgb24uXG4gIHZhciBERUxFVEUgPSAnZGVsZXRlJztcblxuICAvLyBDb25zdGFudHMgZGVzY3JpYmluZyB0aGUgc2l6ZSBvZiB0cmllIG5vZGVzLlxuICB2YXIgU0hJRlQgPSA1OyAvLyBSZXN1bHRlZCBpbiBiZXN0IHBlcmZvcm1hbmNlIGFmdGVyIF9fX19fXz9cbiAgdmFyIFNJWkUgPSAxIDw8IFNISUZUO1xuICB2YXIgTUFTSyA9IFNJWkUgLSAxO1xuXG4gIC8vIEEgY29uc2lzdGVudCBzaGFyZWQgdmFsdWUgcmVwcmVzZW50aW5nIFwibm90IHNldFwiIHdoaWNoIGVxdWFscyBub3RoaW5nIG90aGVyXG4gIC8vIHRoYW4gaXRzZWxmLCBhbmQgbm90aGluZyB0aGF0IGNvdWxkIGJlIHByb3ZpZGVkIGV4dGVybmFsbHkuXG4gIHZhciBOT1RfU0VUID0ge307XG5cbiAgLy8gQm9vbGVhbiByZWZlcmVuY2VzLCBSb3VnaCBlcXVpdmFsZW50IG9mIGBib29sICZgLlxuICB2YXIgQ0hBTkdFX0xFTkdUSCA9IHsgdmFsdWU6IGZhbHNlIH07XG4gIHZhciBESURfQUxURVIgPSB7IHZhbHVlOiBmYWxzZSB9O1xuXG4gIGZ1bmN0aW9uIE1ha2VSZWYocmVmKSB7XG4gICAgcmVmLnZhbHVlID0gZmFsc2U7XG4gICAgcmV0dXJuIHJlZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIFNldFJlZihyZWYpIHtcbiAgICByZWYgJiYgKHJlZi52YWx1ZSA9IHRydWUpO1xuICB9XG5cbiAgLy8gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGEgdmFsdWUgcmVwcmVzZW50aW5nIGFuIFwib3duZXJcIiBmb3IgdHJhbnNpZW50IHdyaXRlc1xuICAvLyB0byB0cmllcy4gVGhlIHJldHVybiB2YWx1ZSB3aWxsIG9ubHkgZXZlciBlcXVhbCBpdHNlbGYsIGFuZCB3aWxsIG5vdCBlcXVhbFxuICAvLyB0aGUgcmV0dXJuIG9mIGFueSBzdWJzZXF1ZW50IGNhbGwgb2YgdGhpcyBmdW5jdGlvbi5cbiAgZnVuY3Rpb24gT3duZXJJRCgpIHt9XG5cbiAgLy8gaHR0cDovL2pzcGVyZi5jb20vY29weS1hcnJheS1pbmxpbmVcbiAgZnVuY3Rpb24gYXJyQ29weShhcnIsIG9mZnNldCkge1xuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuICAgIHZhciBsZW4gPSBNYXRoLm1heCgwLCBhcnIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgICB2YXIgbmV3QXJyID0gbmV3IEFycmF5KGxlbik7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGxlbjsgaWkrKykge1xuICAgICAgbmV3QXJyW2lpXSA9IGFycltpaSArIG9mZnNldF07XG4gICAgfVxuICAgIHJldHVybiBuZXdBcnI7XG4gIH1cblxuICBmdW5jdGlvbiBlbnN1cmVTaXplKGl0ZXIpIHtcbiAgICBpZiAoaXRlci5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGl0ZXIuc2l6ZSA9IGl0ZXIuX19pdGVyYXRlKHJldHVyblRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gaXRlci5zaXplO1xuICB9XG5cbiAgZnVuY3Rpb24gd3JhcEluZGV4KGl0ZXIsIGluZGV4KSB7XG4gICAgcmV0dXJuIGluZGV4ID49IDAgPyAoK2luZGV4KSA6IGVuc3VyZVNpemUoaXRlcikgKyAoK2luZGV4KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJldHVyblRydWUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiB3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHNpemUpIHtcbiAgICByZXR1cm4gKGJlZ2luID09PSAwIHx8IChzaXplICE9PSB1bmRlZmluZWQgJiYgYmVnaW4gPD0gLXNpemUpKSAmJlxuICAgICAgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IChzaXplICE9PSB1bmRlZmluZWQgJiYgZW5kID49IHNpemUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSkge1xuICAgIHJldHVybiByZXNvbHZlSW5kZXgoYmVnaW4sIHNpemUsIDApO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUVuZChlbmQsIHNpemUpIHtcbiAgICByZXR1cm4gcmVzb2x2ZUluZGV4KGVuZCwgc2l6ZSwgc2l6ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlSW5kZXgoaW5kZXgsIHNpemUsIGRlZmF1bHRJbmRleCkge1xuICAgIHJldHVybiBpbmRleCA9PT0gdW5kZWZpbmVkID9cbiAgICAgIGRlZmF1bHRJbmRleCA6XG4gICAgICBpbmRleCA8IDAgP1xuICAgICAgICBNYXRoLm1heCgwLCBzaXplICsgaW5kZXgpIDpcbiAgICAgICAgc2l6ZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgICBpbmRleCA6XG4gICAgICAgICAgTWF0aC5taW4oc2l6ZSwgaW5kZXgpO1xuICB9XG5cbiAgZnVuY3Rpb24gSXRlcmFibGUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc0l0ZXJhYmxlKHZhbHVlKSA/IHZhbHVlIDogU2VxKHZhbHVlKTtcbiAgICB9XG5cblxuICBjcmVhdGVDbGFzcyhLZXllZEl0ZXJhYmxlLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gS2V5ZWRJdGVyYWJsZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUgOiBLZXllZFNlcSh2YWx1ZSk7XG4gICAgfVxuXG5cbiAgY3JlYXRlQ2xhc3MoSW5kZXhlZEl0ZXJhYmxlLCBJdGVyYWJsZSk7XG4gICAgZnVuY3Rpb24gSW5kZXhlZEl0ZXJhYmxlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNJbmRleGVkKHZhbHVlKSA/IHZhbHVlIDogSW5kZXhlZFNlcSh2YWx1ZSk7XG4gICAgfVxuXG5cbiAgY3JlYXRlQ2xhc3MoU2V0SXRlcmFibGUsIEl0ZXJhYmxlKTtcbiAgICBmdW5jdGlvbiBTZXRJdGVyYWJsZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzSXRlcmFibGUodmFsdWUpICYmICFpc0Fzc29jaWF0aXZlKHZhbHVlKSA/IHZhbHVlIDogU2V0U2VxKHZhbHVlKTtcbiAgICB9XG5cblxuXG4gIGZ1bmN0aW9uIGlzSXRlcmFibGUobWF5YmVJdGVyYWJsZSkge1xuICAgIHJldHVybiAhIShtYXliZUl0ZXJhYmxlICYmIG1heWJlSXRlcmFibGVbSVNfSVRFUkFCTEVfU0VOVElORUxdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzS2V5ZWQobWF5YmVLZXllZCkge1xuICAgIHJldHVybiAhIShtYXliZUtleWVkICYmIG1heWJlS2V5ZWRbSVNfS0VZRURfU0VOVElORUxdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSW5kZXhlZChtYXliZUluZGV4ZWQpIHtcbiAgICByZXR1cm4gISEobWF5YmVJbmRleGVkICYmIG1heWJlSW5kZXhlZFtJU19JTkRFWEVEX1NFTlRJTkVMXSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0Fzc29jaWF0aXZlKG1heWJlQXNzb2NpYXRpdmUpIHtcbiAgICByZXR1cm4gaXNLZXllZChtYXliZUFzc29jaWF0aXZlKSB8fCBpc0luZGV4ZWQobWF5YmVBc3NvY2lhdGl2ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc09yZGVyZWQobWF5YmVPcmRlcmVkKSB7XG4gICAgcmV0dXJuICEhKG1heWJlT3JkZXJlZCAmJiBtYXliZU9yZGVyZWRbSVNfT1JERVJFRF9TRU5USU5FTF0pO1xuICB9XG5cbiAgSXRlcmFibGUuaXNJdGVyYWJsZSA9IGlzSXRlcmFibGU7XG4gIEl0ZXJhYmxlLmlzS2V5ZWQgPSBpc0tleWVkO1xuICBJdGVyYWJsZS5pc0luZGV4ZWQgPSBpc0luZGV4ZWQ7XG4gIEl0ZXJhYmxlLmlzQXNzb2NpYXRpdmUgPSBpc0Fzc29jaWF0aXZlO1xuICBJdGVyYWJsZS5pc09yZGVyZWQgPSBpc09yZGVyZWQ7XG5cbiAgSXRlcmFibGUuS2V5ZWQgPSBLZXllZEl0ZXJhYmxlO1xuICBJdGVyYWJsZS5JbmRleGVkID0gSW5kZXhlZEl0ZXJhYmxlO1xuICBJdGVyYWJsZS5TZXQgPSBTZXRJdGVyYWJsZTtcblxuXG4gIHZhciBJU19JVEVSQUJMRV9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0lURVJBQkxFX19AQCc7XG4gIHZhciBJU19LRVlFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0tFWUVEX19AQCc7XG4gIHZhciBJU19JTkRFWEVEX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfSU5ERVhFRF9fQEAnO1xuICB2YXIgSVNfT1JERVJFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX09SREVSRURfX0BAJztcblxuICAvKiBnbG9iYWwgU3ltYm9sICovXG5cbiAgdmFyIElURVJBVEVfS0VZUyA9IDA7XG4gIHZhciBJVEVSQVRFX1ZBTFVFUyA9IDE7XG4gIHZhciBJVEVSQVRFX0VOVFJJRVMgPSAyO1xuXG4gIHZhciBSRUFMX0lURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xuICB2YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5cbiAgdmFyIElURVJBVE9SX1NZTUJPTCA9IFJFQUxfSVRFUkFUT1JfU1lNQk9MIHx8IEZBVVhfSVRFUkFUT1JfU1lNQk9MO1xuXG5cbiAgZnVuY3Rpb24gc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihuZXh0KSB7XG4gICAgICB0aGlzLm5leHQgPSBuZXh0O1xuICAgIH1cblxuICAgIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ1tJdGVyYXRvcl0nO1xuICAgIH07XG5cblxuICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLktFWVMgPSBJVEVSQVRFX0tFWVM7XG4gIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IuVkFMVUVTID0gSVRFUkFURV9WQUxVRVM7XG4gIHNyY19JdGVyYXRvcl9fSXRlcmF0b3IuRU5UUklFUyA9IElURVJBVEVfRU5UUklFUztcblxuICBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yLnByb3RvdHlwZS5pbnNwZWN0ID1cbiAgc3JjX0l0ZXJhdG9yX19JdGVyYXRvci5wcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLnRvU3RyaW5nKCk7IH1cbiAgc3JjX0l0ZXJhdG9yX19JdGVyYXRvci5wcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG4gIGZ1bmN0aW9uIGl0ZXJhdG9yVmFsdWUodHlwZSwgaywgdiwgaXRlcmF0b3JSZXN1bHQpIHtcbiAgICB2YXIgdmFsdWUgPSB0eXBlID09PSAwID8gayA6IHR5cGUgPT09IDEgPyB2IDogW2ssIHZdO1xuICAgIGl0ZXJhdG9yUmVzdWx0ID8gKGl0ZXJhdG9yUmVzdWx0LnZhbHVlID0gdmFsdWUpIDogKGl0ZXJhdG9yUmVzdWx0ID0ge1xuICAgICAgdmFsdWU6IHZhbHVlLCBkb25lOiBmYWxzZVxuICAgIH0pO1xuICAgIHJldHVybiBpdGVyYXRvclJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRG9uZSgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBmdW5jdGlvbiBoYXNJdGVyYXRvcihtYXliZUl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuICEhZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzSXRlcmF0b3IobWF5YmVJdGVyYXRvcikge1xuICAgIHJldHVybiBtYXliZUl0ZXJhdG9yICYmIHR5cGVvZiBtYXliZUl0ZXJhdG9yLm5leHQgPT09ICdmdW5jdGlvbic7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJdGVyYXRvcihpdGVyYWJsZSkge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihpdGVyYWJsZSk7XG4gICAgcmV0dXJuIGl0ZXJhdG9yRm4gJiYgaXRlcmF0b3JGbi5jYWxsKGl0ZXJhYmxlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4oaXRlcmFibGUpIHtcbiAgICB2YXIgaXRlcmF0b3JGbiA9IGl0ZXJhYmxlICYmIChcbiAgICAgIChSRUFMX0lURVJBVE9SX1NZTUJPTCAmJiBpdGVyYWJsZVtSRUFMX0lURVJBVE9SX1NZTUJPTF0pIHx8XG4gICAgICBpdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF1cbiAgICApO1xuICAgIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yRm47XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmxlbmd0aCA9PT0gJ251bWJlcic7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhTZXEsIEl0ZXJhYmxlKTtcbiAgICBmdW5jdGlvbiBTZXEodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTZXF1ZW5jZSgpIDpcbiAgICAgICAgaXNJdGVyYWJsZSh2YWx1ZSkgPyB2YWx1ZS50b1NlcSgpIDogc2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgICB9XG5cbiAgICBTZXEub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gU2VxKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFNlcS5wcm90b3R5cGUudG9TZXEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTZXEgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIFNlcS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5fY2FjaGUgJiYgdGhpcy5fX2l0ZXJhdGVVbmNhY2hlZCkge1xuICAgICAgICB0aGlzLl9jYWNoZSA9IHRoaXMuZW50cnlTZXEoKS50b0FycmF5KCk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2NhY2hlLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvLyBhYnN0cmFjdCBfX2l0ZXJhdGVVbmNhY2hlZChmbiwgcmV2ZXJzZSlcblxuICAgIFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBzZXFJdGVyYXRlKHRoaXMsIGZuLCByZXZlcnNlLCB0cnVlKTtcbiAgICB9O1xuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRvclVuY2FjaGVkKHR5cGUsIHJldmVyc2UpXG5cbiAgICBTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICByZXR1cm4gc2VxSXRlcmF0b3IodGhpcywgdHlwZSwgcmV2ZXJzZSwgdHJ1ZSk7XG4gICAgfTtcblxuXG5cbiAgY3JlYXRlQ2xhc3MoS2V5ZWRTZXEsIFNlcSk7XG4gICAgZnVuY3Rpb24gS2V5ZWRTZXEodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID9cbiAgICAgICAgZW1wdHlTZXF1ZW5jZSgpLnRvS2V5ZWRTZXEoKSA6XG4gICAgICAgIGlzSXRlcmFibGUodmFsdWUpID9cbiAgICAgICAgICAoaXNLZXllZCh2YWx1ZSkgPyB2YWx1ZS50b1NlcSgpIDogdmFsdWUuZnJvbUVudHJ5U2VxKCkpIDpcbiAgICAgICAgICBrZXllZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gICAgfVxuXG4gICAgS2V5ZWRTZXEucHJvdG90eXBlLnRvS2V5ZWRTZXEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKEluZGV4ZWRTZXEsIFNlcSk7XG4gICAgZnVuY3Rpb24gSW5kZXhlZFNlcSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQgPyBlbXB0eVNlcXVlbmNlKCkgOlxuICAgICAgICAhaXNJdGVyYWJsZSh2YWx1ZSkgPyBpbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSA6XG4gICAgICAgIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUuZW50cnlTZXEoKSA6IHZhbHVlLnRvSW5kZXhlZFNlcSgpO1xuICAgIH1cblxuICAgIEluZGV4ZWRTZXEub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gSW5kZXhlZFNlcShhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBJbmRleGVkU2VxLnByb3RvdHlwZS50b0luZGV4ZWRTZXEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBJbmRleGVkU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2VxIFsnLCAnXScpO1xuICAgIH07XG5cbiAgICBJbmRleGVkU2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHNlcUl0ZXJhdGUodGhpcywgZm4sIHJldmVyc2UsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgSW5kZXhlZFNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBzZXFJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlLCBmYWxzZSk7XG4gICAgfTtcblxuXG5cbiAgY3JlYXRlQ2xhc3MoU2V0U2VxLCBTZXEpO1xuICAgIGZ1bmN0aW9uIFNldFNlcSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2VxdWVuY2UoKSA6XG4gICAgICAgICFpc0l0ZXJhYmxlKHZhbHVlKSA/IGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIDpcbiAgICAgICAgaXNLZXllZCh2YWx1ZSkgPyB2YWx1ZS5lbnRyeVNlcSgpIDogdmFsdWVcbiAgICAgICkudG9TZXRTZXEoKTtcbiAgICB9XG5cbiAgICBTZXRTZXEub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gU2V0U2VxKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFNldFNlcS5wcm90b3R5cGUudG9TZXRTZXEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuXG4gIFNlcS5pc1NlcSA9IGlzU2VxO1xuICBTZXEuS2V5ZWQgPSBLZXllZFNlcTtcbiAgU2VxLlNldCA9IFNldFNlcTtcbiAgU2VxLkluZGV4ZWQgPSBJbmRleGVkU2VxO1xuXG4gIHZhciBJU19TRVFfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9TRVFfX0BAJztcblxuICBTZXEucHJvdG90eXBlW0lTX1NFUV9TRU5USU5FTF0gPSB0cnVlO1xuXG5cblxuICAvLyAjcHJhZ21hIFJvb3QgU2VxdWVuY2VzXG5cbiAgY3JlYXRlQ2xhc3MoQXJyYXlTZXEsIEluZGV4ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIEFycmF5U2VxKGFycmF5KSB7XG4gICAgICB0aGlzLl9hcnJheSA9IGFycmF5O1xuICAgICAgdGhpcy5zaXplID0gYXJyYXkubGVuZ3RoO1xuICAgIH1cblxuICAgIEFycmF5U2VxLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl9hcnJheVt3cmFwSW5kZXgodGhpcywgaW5kZXgpXSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBBcnJheVNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBhcnJheSA9IHRoaXMuX2FycmF5O1xuICAgICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgICAgaWYgKGZuKGFycmF5W3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldLCBpaSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH07XG5cbiAgICBBcnJheVNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBhcnJheSA9IHRoaXMuX2FycmF5O1xuICAgICAgdmFyIG1heEluZGV4ID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBpaSA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSBcbiAgICAgICAge3JldHVybiBpaSA+IG1heEluZGV4ID9cbiAgICAgICAgICBpdGVyYXRvckRvbmUoKSA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpaSwgYXJyYXlbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkrKyA6IGlpKytdKX1cbiAgICAgICk7XG4gICAgfTtcblxuXG5cbiAgY3JlYXRlQ2xhc3MoT2JqZWN0U2VxLCBLZXllZFNlcSk7XG4gICAgZnVuY3Rpb24gT2JqZWN0U2VxKG9iamVjdCkge1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgICAgdGhpcy5fb2JqZWN0ID0gb2JqZWN0O1xuICAgICAgdGhpcy5fa2V5cyA9IGtleXM7XG4gICAgICB0aGlzLnNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICB9XG5cbiAgICBPYmplY3RTZXEucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmIChub3RTZXRWYWx1ZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3Rba2V5XTtcbiAgICB9O1xuXG4gICAgT2JqZWN0U2VxLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KTtcbiAgICB9O1xuXG4gICAgT2JqZWN0U2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgdmFyIG9iamVjdCA9IHRoaXMuX29iamVjdDtcbiAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcbiAgICAgIHZhciBtYXhJbmRleCA9IGtleXMubGVuZ3RoIC0gMTtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICAgIGlmIChmbihvYmplY3Rba2V5XSwga2V5LCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaWk7XG4gICAgfTtcblxuICAgIE9iamVjdFNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBvYmplY3QgPSB0aGlzLl9vYmplY3Q7XG4gICAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgICB2YXIgbWF4SW5kZXggPSBrZXlzLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICAgIHJldHVybiBpaSsrID4gbWF4SW5kZXggP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGtleSwgb2JqZWN0W2tleV0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICBPYmplY3RTZXEucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXG4gIGNyZWF0ZUNsYXNzKEl0ZXJhYmxlU2VxLCBJbmRleGVkU2VxKTtcbiAgICBmdW5jdGlvbiBJdGVyYWJsZVNlcShpdGVyYWJsZSkge1xuICAgICAgdGhpcy5faXRlcmFibGUgPSBpdGVyYWJsZTtcbiAgICAgIHRoaXMuc2l6ZSA9IGl0ZXJhYmxlLmxlbmd0aCB8fCBpdGVyYWJsZS5zaXplO1xuICAgIH1cblxuICAgIEl0ZXJhYmxlU2VxLnByb3RvdHlwZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmFibGUgPSB0aGlzLl9pdGVyYWJsZTtcbiAgICAgIHZhciBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGl0ZXJhYmxlKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIGlmIChpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChmbihzdGVwLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgSXRlcmFibGVTZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYWJsZSA9IHRoaXMuX2l0ZXJhYmxlO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpO1xuICAgICAgaWYgKCFpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoaXRlcmF0b3JEb25lKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzdGVwLnZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKEl0ZXJhdG9yU2VxLCBJbmRleGVkU2VxKTtcbiAgICBmdW5jdGlvbiBJdGVyYXRvclNlcShpdGVyYXRvcikge1xuICAgICAgdGhpcy5faXRlcmF0b3IgPSBpdGVyYXRvcjtcbiAgICAgIHRoaXMuX2l0ZXJhdG9yQ2FjaGUgPSBbXTtcbiAgICB9XG5cbiAgICBJdGVyYXRvclNlcS5wcm90b3R5cGUuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlcmF0b3I7XG4gICAgICB2YXIgY2FjaGUgPSB0aGlzLl9pdGVyYXRvckNhY2hlO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgd2hpbGUgKGl0ZXJhdGlvbnMgPCBjYWNoZS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKGZuKGNhY2hlW2l0ZXJhdGlvbnNdLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgdmFyIHZhbCA9IHN0ZXAudmFsdWU7XG4gICAgICAgIGNhY2hlW2l0ZXJhdGlvbnNdID0gdmFsO1xuICAgICAgICBpZiAoZm4odmFsLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuXG4gICAgSXRlcmF0b3JTZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXJhdG9yO1xuICAgICAgdmFyIGNhY2hlID0gdGhpcy5faXRlcmF0b3JDYWNoZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIGlmIChpdGVyYXRpb25zID49IGNhY2hlLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYWNoZVtpdGVyYXRpb25zXSA9IHN0ZXAudmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucywgY2FjaGVbaXRlcmF0aW9ucysrXSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG5cblxuXG4gIC8vICMgcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuICBmdW5jdGlvbiBpc1NlcShtYXliZVNlcSkge1xuICAgIHJldHVybiAhIShtYXliZVNlcSAmJiBtYXliZVNlcVtJU19TRVFfU0VOVElORUxdKTtcbiAgfVxuXG4gIHZhciBFTVBUWV9TRVE7XG5cbiAgZnVuY3Rpb24gZW1wdHlTZXF1ZW5jZSgpIHtcbiAgICByZXR1cm4gRU1QVFlfU0VRIHx8IChFTVBUWV9TRVEgPSBuZXcgQXJyYXlTZXEoW10pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGtleWVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgdmFyIHNlcSA9XG4gICAgICBBcnJheS5pc0FycmF5KHZhbHVlKSA/IG5ldyBBcnJheVNlcSh2YWx1ZSkuZnJvbUVudHJ5U2VxKCkgOlxuICAgICAgaXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmF0b3JTZXEodmFsdWUpLmZyb21FbnRyeVNlcSgpIDpcbiAgICAgIGhhc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYWJsZVNlcSh2YWx1ZSkuZnJvbUVudHJ5U2VxKCkgOlxuICAgICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyA/IG5ldyBPYmplY3RTZXEodmFsdWUpIDpcbiAgICAgIHVuZGVmaW5lZDtcbiAgICBpZiAoIXNlcSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0V4cGVjdGVkIEFycmF5IG9yIGl0ZXJhYmxlIG9iamVjdCBvZiBbaywgdl0gZW50cmllcywgJytcbiAgICAgICAgJ29yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VxO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICAgIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICAgIGlmICghc2VxKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgaXRlcmFibGUgb2JqZWN0IG9mIHZhbHVlczogJyArIHZhbHVlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VxO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkgfHxcbiAgICAgICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIG5ldyBPYmplY3RTZXEodmFsdWUpKTtcbiAgICBpZiAoIXNlcSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0V4cGVjdGVkIEFycmF5IG9yIGl0ZXJhYmxlIG9iamVjdCBvZiB2YWx1ZXMsIG9yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gc2VxO1xuICB9XG5cbiAgZnVuY3Rpb24gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzQXJyYXlMaWtlKHZhbHVlKSA/IG5ldyBBcnJheVNlcSh2YWx1ZSkgOlxuICAgICAgaXNJdGVyYXRvcih2YWx1ZSkgPyBuZXcgSXRlcmF0b3JTZXEodmFsdWUpIDpcbiAgICAgIGhhc0l0ZXJhdG9yKHZhbHVlKSA/IG5ldyBJdGVyYWJsZVNlcSh2YWx1ZSkgOlxuICAgICAgdW5kZWZpbmVkXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlcUl0ZXJhdGUoc2VxLCBmbiwgcmV2ZXJzZSwgdXNlS2V5cykge1xuICAgIHZhciBjYWNoZSA9IHNlcS5fY2FjaGU7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSBjYWNoZS5sZW5ndGggLSAxO1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgICB2YXIgZW50cnkgPSBjYWNoZVtyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgICAgaWYgKGZuKGVudHJ5WzFdLCB1c2VLZXlzID8gZW50cnlbMF0gOiBpaSwgc2VxKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4gaWkgKyAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaWk7XG4gICAgfVxuICAgIHJldHVybiBzZXEuX19pdGVyYXRlVW5jYWNoZWQoZm4sIHJldmVyc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2VxSXRlcmF0b3Ioc2VxLCB0eXBlLCByZXZlcnNlLCB1c2VLZXlzKSB7XG4gICAgdmFyIGNhY2hlID0gc2VxLl9jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHZhciBtYXhJbmRleCA9IGNhY2hlLmxlbmd0aCAtIDE7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gY2FjaGVbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICAgIHJldHVybiBpaSsrID4gbWF4SW5kZXggP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIHVzZUtleXMgPyBlbnRyeVswXSA6IGlpIC0gMSwgZW50cnlbMV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzZXEuX19pdGVyYXRvclVuY2FjaGVkKHR5cGUsIHJldmVyc2UpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoQ29sbGVjdGlvbiwgSXRlcmFibGUpO1xuICAgIGZ1bmN0aW9uIENvbGxlY3Rpb24oKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ0Fic3RyYWN0Jyk7XG4gICAgfVxuXG5cbiAgY3JlYXRlQ2xhc3MoS2V5ZWRDb2xsZWN0aW9uLCBDb2xsZWN0aW9uKTtmdW5jdGlvbiBLZXllZENvbGxlY3Rpb24oKSB7fVxuXG4gIGNyZWF0ZUNsYXNzKEluZGV4ZWRDb2xsZWN0aW9uLCBDb2xsZWN0aW9uKTtmdW5jdGlvbiBJbmRleGVkQ29sbGVjdGlvbigpIHt9XG5cbiAgY3JlYXRlQ2xhc3MoU2V0Q29sbGVjdGlvbiwgQ29sbGVjdGlvbik7ZnVuY3Rpb24gU2V0Q29sbGVjdGlvbigpIHt9XG5cblxuICBDb2xsZWN0aW9uLktleWVkID0gS2V5ZWRDb2xsZWN0aW9uO1xuICBDb2xsZWN0aW9uLkluZGV4ZWQgPSBJbmRleGVkQ29sbGVjdGlvbjtcbiAgQ29sbGVjdGlvbi5TZXQgPSBTZXRDb2xsZWN0aW9uO1xuXG4gIC8qKlxuICAgKiBBbiBleHRlbnNpb24gb2YgdGhlIFwic2FtZS12YWx1ZVwiIGFsZ29yaXRobSBhcyBbZGVzY3JpYmVkIGZvciB1c2UgYnkgRVM2IE1hcFxuICAgKiBhbmQgU2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAjS2V5X2VxdWFsaXR5KVxuICAgKlxuICAgKiBOYU4gaXMgY29uc2lkZXJlZCB0aGUgc2FtZSBhcyBOYU4sIGhvd2V2ZXIgLTAgYW5kIDAgYXJlIGNvbnNpZGVyZWQgdGhlIHNhbWVcbiAgICogdmFsdWUsIHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBhbGdvcml0aG0gZGVzY3JpYmVkIGJ5XG4gICAqIFtgT2JqZWN0LmlzYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzKS5cbiAgICpcbiAgICogVGhpcyBpcyBleHRlbmRlZCBmdXJ0aGVyIHRvIGFsbG93IE9iamVjdHMgdG8gZGVzY3JpYmUgdGhlIHZhbHVlcyB0aGV5XG4gICAqIHJlcHJlc2VudCwgYnkgd2F5IG9mIGB2YWx1ZU9mYCBvciBgZXF1YWxzYCAoYW5kIGBoYXNoQ29kZWApLlxuICAgKlxuICAgKiBOb3RlOiBiZWNhdXNlIG9mIHRoaXMgZXh0ZW5zaW9uLCB0aGUga2V5IGVxdWFsaXR5IG9mIEltbXV0YWJsZS5NYXAgYW5kIHRoZVxuICAgKiB2YWx1ZSBlcXVhbGl0eSBvZiBJbW11dGFibGUuU2V0IHdpbGwgZGlmZmVyIGZyb20gRVM2IE1hcCBhbmQgU2V0LlxuICAgKlxuICAgKiAjIyMgRGVmaW5pbmcgY3VzdG9tIHZhbHVlc1xuICAgKlxuICAgKiBUaGUgZWFzaWVzdCB3YXkgdG8gZGVzY3JpYmUgdGhlIHZhbHVlIGFuIG9iamVjdCByZXByZXNlbnRzIGlzIGJ5IGltcGxlbWVudGluZ1xuICAgKiBgdmFsdWVPZmAuIEZvciBleGFtcGxlLCBgRGF0ZWAgcmVwcmVzZW50cyBhIHZhbHVlIGJ5IHJldHVybmluZyBhIHVuaXhcbiAgICogdGltZXN0YW1wIGZvciBgdmFsdWVPZmA6XG4gICAqXG4gICAqICAgICB2YXIgZGF0ZTEgPSBuZXcgRGF0ZSgxMjM0NTY3ODkwMDAwKTsgLy8gRnJpIEZlYiAxMyAyMDA5IC4uLlxuICAgKiAgICAgdmFyIGRhdGUyID0gbmV3IERhdGUoMTIzNDU2Nzg5MDAwMCk7XG4gICAqICAgICBkYXRlMS52YWx1ZU9mKCk7IC8vIDEyMzQ1Njc4OTAwMDBcbiAgICogICAgIGFzc2VydCggZGF0ZTEgIT09IGRhdGUyICk7XG4gICAqICAgICBhc3NlcnQoIEltbXV0YWJsZS5pcyggZGF0ZTEsIGRhdGUyICkgKTtcbiAgICpcbiAgICogTm90ZTogb3ZlcnJpZGluZyBgdmFsdWVPZmAgbWF5IGhhdmUgb3RoZXIgaW1wbGljYXRpb25zIGlmIHlvdSB1c2UgdGhpcyBvYmplY3RcbiAgICogd2hlcmUgSmF2YVNjcmlwdCBleHBlY3RzIGEgcHJpbWl0aXZlLCBzdWNoIGFzIGltcGxpY2l0IHN0cmluZyBjb2VyY2lvbi5cbiAgICpcbiAgICogRm9yIG1vcmUgY29tcGxleCB0eXBlcywgZXNwZWNpYWxseSBjb2xsZWN0aW9ucywgaW1wbGVtZW50aW5nIGB2YWx1ZU9mYCBtYXlcbiAgICogbm90IGJlIHBlcmZvcm1hbnQuIEFuIGFsdGVybmF0aXZlIGlzIHRvIGltcGxlbWVudCBgZXF1YWxzYCBhbmQgYGhhc2hDb2RlYC5cbiAgICpcbiAgICogYGVxdWFsc2AgdGFrZXMgYW5vdGhlciBvYmplY3QsIHByZXN1bWFibHkgb2Ygc2ltaWxhciB0eXBlLCBhbmQgcmV0dXJucyB0cnVlXG4gICAqIGlmIHRoZSBpdCBpcyBlcXVhbC4gRXF1YWxpdHkgaXMgc3ltbWV0cmljYWwsIHNvIHRoZSBzYW1lIHJlc3VsdCBzaG91bGQgYmVcbiAgICogcmV0dXJuZWQgaWYgdGhpcyBhbmQgdGhlIGFyZ3VtZW50IGFyZSBmbGlwcGVkLlxuICAgKlxuICAgKiAgICAgYXNzZXJ0KCBhLmVxdWFscyhiKSA9PT0gYi5lcXVhbHMoYSkgKTtcbiAgICpcbiAgICogYGhhc2hDb2RlYCByZXR1cm5zIGEgMzJiaXQgaW50ZWdlciBudW1iZXIgcmVwcmVzZW50aW5nIHRoZSBvYmplY3Qgd2hpY2ggd2lsbFxuICAgKiBiZSB1c2VkIHRvIGRldGVybWluZSBob3cgdG8gc3RvcmUgdGhlIHZhbHVlIG9iamVjdCBpbiBhIE1hcCBvciBTZXQuIFlvdSBtdXN0XG4gICAqIHByb3ZpZGUgYm90aCBvciBuZWl0aGVyIG1ldGhvZHMsIG9uZSBtdXN0IG5vdCBleGlzdCB3aXRob3V0IHRoZSBvdGhlci5cbiAgICpcbiAgICogQWxzbywgYW4gaW1wb3J0YW50IHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHRoZXNlIG1ldGhvZHMgbXVzdCBiZSB1cGhlbGQ6IGlmIHR3b1xuICAgKiB2YWx1ZXMgYXJlIGVxdWFsLCB0aGV5ICptdXN0KiByZXR1cm4gdGhlIHNhbWUgaGFzaENvZGUuIElmIHRoZSB2YWx1ZXMgYXJlIG5vdFxuICAgKiBlcXVhbCwgdGhleSBtaWdodCBoYXZlIHRoZSBzYW1lIGhhc2hDb2RlOyB0aGlzIGlzIGNhbGxlZCBhIGhhc2ggY29sbGlzaW9uLFxuICAgKiBhbmQgd2hpbGUgdW5kZXNpcmFibGUgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIGl0IGlzIGFjY2VwdGFibGUuXG4gICAqXG4gICAqICAgICBpZiAoYS5lcXVhbHMoYikpIHtcbiAgICogICAgICAgYXNzZXJ0KCBhLmhhc2hDb2RlKCkgPT09IGIuaGFzaENvZGUoKSApO1xuICAgKiAgICAgfVxuICAgKlxuICAgKiBBbGwgSW1tdXRhYmxlIGNvbGxlY3Rpb25zIGltcGxlbWVudCBgZXF1YWxzYCBhbmQgYGhhc2hDb2RlYC5cbiAgICpcbiAgICovXG4gIGZ1bmN0aW9uIGlzKHZhbHVlQSwgdmFsdWVCKSB7XG4gICAgaWYgKHZhbHVlQSA9PT0gdmFsdWVCIHx8ICh2YWx1ZUEgIT09IHZhbHVlQSAmJiB2YWx1ZUIgIT09IHZhbHVlQikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXZhbHVlQSB8fCAhdmFsdWVCKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdmFsdWVBLnZhbHVlT2YgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgICAgdHlwZW9mIHZhbHVlQi52YWx1ZU9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YWx1ZUEgPSB2YWx1ZUEudmFsdWVPZigpO1xuICAgICAgdmFsdWVCID0gdmFsdWVCLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZUEuZXF1YWxzID09PSAnZnVuY3Rpb24nICYmXG4gICAgICB0eXBlb2YgdmFsdWVCLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgIHZhbHVlQS5lcXVhbHModmFsdWVCKSA6XG4gICAgICAgIHZhbHVlQSA9PT0gdmFsdWVCIHx8ICh2YWx1ZUEgIT09IHZhbHVlQSAmJiB2YWx1ZUIgIT09IHZhbHVlQik7XG4gIH1cblxuICBmdW5jdGlvbiBmcm9tSlMoanNvbiwgY29udmVydGVyKSB7XG4gICAgcmV0dXJuIGNvbnZlcnRlciA/XG4gICAgICBmcm9tSlNXaXRoKGNvbnZlcnRlciwganNvbiwgJycsIHsnJzoganNvbn0pIDpcbiAgICAgIGZyb21KU0RlZmF1bHQoanNvbik7XG4gIH1cblxuICBmdW5jdGlvbiBmcm9tSlNXaXRoKGNvbnZlcnRlciwganNvbiwga2V5LCBwYXJlbnRKU09OKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbikpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0ZXIuY2FsbChwYXJlbnRKU09OLCBrZXksIEluZGV4ZWRTZXEoanNvbikubWFwKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZyb21KU1dpdGgoY29udmVydGVyLCB2LCBrLCBqc29uKX0pKTtcbiAgICB9XG4gICAgaWYgKGlzUGxhaW5PYmooanNvbikpIHtcbiAgICAgIHJldHVybiBjb252ZXJ0ZXIuY2FsbChwYXJlbnRKU09OLCBrZXksIEtleWVkU2VxKGpzb24pLm1hcChmdW5jdGlvbih2LCBrKSAge3JldHVybiBmcm9tSlNXaXRoKGNvbnZlcnRlciwgdiwgaywganNvbil9KSk7XG4gICAgfVxuICAgIHJldHVybiBqc29uO1xuICB9XG5cbiAgZnVuY3Rpb24gZnJvbUpTRGVmYXVsdChqc29uKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbikpIHtcbiAgICAgIHJldHVybiBJbmRleGVkU2VxKGpzb24pLm1hcChmcm9tSlNEZWZhdWx0KS50b0xpc3QoKTtcbiAgICB9XG4gICAgaWYgKGlzUGxhaW5PYmooanNvbikpIHtcbiAgICAgIHJldHVybiBLZXllZFNlcShqc29uKS5tYXAoZnJvbUpTRGVmYXVsdCkudG9NYXAoKTtcbiAgICB9XG4gICAgcmV0dXJuIGpzb247XG4gIH1cblxuICBmdW5jdGlvbiBpc1BsYWluT2JqKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0IHx8IHZhbHVlLmNvbnN0cnVjdG9yID09PSB1bmRlZmluZWQpO1xuICB9XG5cbiAgdmFyIHNyY19NYXRoX19pbXVsID1cbiAgICB0eXBlb2YgTWF0aC5pbXVsID09PSAnZnVuY3Rpb24nICYmIE1hdGguaW11bCgweGZmZmZmZmZmLCAyKSA9PT0gLTIgP1xuICAgIE1hdGguaW11bCA6XG4gICAgZnVuY3Rpb24gc3JjX01hdGhfX2ltdWwoYSwgYikge1xuICAgICAgYSA9IGEgfCAwOyAvLyBpbnRcbiAgICAgIGIgPSBiIHwgMDsgLy8gaW50XG4gICAgICB2YXIgYyA9IGEgJiAweGZmZmY7XG4gICAgICB2YXIgZCA9IGIgJiAweGZmZmY7XG4gICAgICAvLyBTaGlmdCBieSAwIGZpeGVzIHRoZSBzaWduIG9uIHRoZSBoaWdoIHBhcnQuXG4gICAgICByZXR1cm4gKGMgKiBkKSArICgoKChhID4+PiAxNikgKiBkICsgYyAqIChiID4+PiAxNikpIDw8IDE2KSA+Pj4gMCkgfCAwOyAvLyBpbnRcbiAgICB9O1xuXG4gIC8vIHY4IGhhcyBhbiBvcHRpbWl6YXRpb24gZm9yIHN0b3JpbmcgMzEtYml0IHNpZ25lZCBudW1iZXJzLlxuICAvLyBWYWx1ZXMgd2hpY2ggaGF2ZSBlaXRoZXIgMDAgb3IgMTEgYXMgdGhlIGhpZ2ggb3JkZXIgYml0cyBxdWFsaWZ5LlxuICAvLyBUaGlzIGZ1bmN0aW9uIGRyb3BzIHRoZSBoaWdoZXN0IG9yZGVyIGJpdCBpbiBhIHNpZ25lZCBudW1iZXIsIG1haW50YWluaW5nXG4gIC8vIHRoZSBzaWduIGJpdC5cbiAgZnVuY3Rpb24gc21pKGkzMikge1xuICAgIHJldHVybiAoKGkzMiA+Pj4gMSkgJiAweDQwMDAwMDAwKSB8IChpMzIgJiAweEJGRkZGRkZGKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc2gobykge1xuICAgIGlmIChvID09PSBmYWxzZSB8fCBvID09PSBudWxsIHx8IG8gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygby52YWx1ZU9mID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvID0gby52YWx1ZU9mKCk7XG4gICAgICBpZiAobyA9PT0gZmFsc2UgfHwgbyA9PT0gbnVsbCB8fCBvID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChvID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgdmFyIHR5cGUgPSB0eXBlb2YgbztcbiAgICBpZiAodHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHZhciBoID0gbyB8IDA7XG4gICAgICBpZiAoaCAhPT0gbykge1xuICAgICAgICBoIF49IG8gKiAweEZGRkZGRkZGO1xuICAgICAgfVxuICAgICAgd2hpbGUgKG8gPiAweEZGRkZGRkZGKSB7XG4gICAgICAgIG8gLz0gMHhGRkZGRkZGRjtcbiAgICAgICAgaCBePSBvO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNtaShoKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gby5sZW5ndGggPiBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOID8gY2FjaGVkSGFzaFN0cmluZyhvKSA6IGhhc2hTdHJpbmcobyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygby5oYXNoQ29kZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG8uaGFzaENvZGUoKTtcbiAgICB9XG4gICAgcmV0dXJuIGhhc2hKU09iaihvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhY2hlZEhhc2hTdHJpbmcoc3RyaW5nKSB7XG4gICAgdmFyIGhhc2ggPSBzdHJpbmdIYXNoQ2FjaGVbc3RyaW5nXTtcbiAgICBpZiAoaGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBoYXNoID0gaGFzaFN0cmluZyhzdHJpbmcpO1xuICAgICAgaWYgKFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPT09IFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFKSB7XG4gICAgICAgIFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPSAwO1xuICAgICAgICBzdHJpbmdIYXNoQ2FjaGUgPSB7fTtcbiAgICAgIH1cbiAgICAgIFNUUklOR19IQVNIX0NBQ0hFX1NJWkUrKztcbiAgICAgIHN0cmluZ0hhc2hDYWNoZVtzdHJpbmddID0gaGFzaDtcbiAgICB9XG4gICAgcmV0dXJuIGhhc2g7XG4gIH1cblxuICAvLyBodHRwOi8vanNwZXJmLmNvbS9oYXNoaW5nLXN0cmluZ3NcbiAgZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmcpIHtcbiAgICAvLyBUaGlzIGlzIHRoZSBoYXNoIGZyb20gSlZNXG4gICAgLy8gVGhlIGhhc2ggY29kZSBmb3IgYSBzdHJpbmcgaXMgY29tcHV0ZWQgYXNcbiAgICAvLyBzWzBdICogMzEgXiAobiAtIDEpICsgc1sxXSAqIDMxIF4gKG4gLSAyKSArIC4uLiArIHNbbiAtIDFdLFxuICAgIC8vIHdoZXJlIHNbaV0gaXMgdGhlIGl0aCBjaGFyYWN0ZXIgb2YgdGhlIHN0cmluZyBhbmQgbiBpcyB0aGUgbGVuZ3RoIG9mXG4gICAgLy8gdGhlIHN0cmluZy4gV2UgXCJtb2RcIiB0aGUgcmVzdWx0IHRvIG1ha2UgaXQgYmV0d2VlbiAwIChpbmNsdXNpdmUpIGFuZCAyXjMxXG4gICAgLy8gKGV4Y2x1c2l2ZSkgYnkgZHJvcHBpbmcgaGlnaCBiaXRzLlxuICAgIHZhciBoYXNoID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgc3RyaW5nLmxlbmd0aDsgaWkrKykge1xuICAgICAgaGFzaCA9IDMxICogaGFzaCArIHN0cmluZy5jaGFyQ29kZUF0KGlpKSB8IDA7XG4gICAgfVxuICAgIHJldHVybiBzbWkoaGFzaCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYXNoSlNPYmoob2JqKSB7XG4gICAgdmFyIGhhc2ggPSB3ZWFrTWFwICYmIHdlYWtNYXAuZ2V0KG9iaik7XG4gICAgaWYgKGhhc2gpIHJldHVybiBoYXNoO1xuXG4gICAgaGFzaCA9IG9ialtVSURfSEFTSF9LRVldO1xuICAgIGlmIChoYXNoKSByZXR1cm4gaGFzaDtcblxuICAgIGlmICghY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIGhhc2ggPSBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgJiYgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlW1VJRF9IQVNIX0tFWV07XG4gICAgICBpZiAoaGFzaCkgcmV0dXJuIGhhc2g7XG5cbiAgICAgIGhhc2ggPSBnZXRJRU5vZGVIYXNoKG9iaik7XG4gICAgICBpZiAoaGFzaCkgcmV0dXJuIGhhc2g7XG4gICAgfVxuXG4gICAgaWYgKE9iamVjdC5pc0V4dGVuc2libGUgJiYgIU9iamVjdC5pc0V4dGVuc2libGUob2JqKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb24tZXh0ZW5zaWJsZSBvYmplY3RzIGFyZSBub3QgYWxsb3dlZCBhcyBrZXlzLicpO1xuICAgIH1cblxuICAgIGhhc2ggPSArK29iakhhc2hVSUQ7XG4gICAgaWYgKG9iakhhc2hVSUQgJiAweDQwMDAwMDAwKSB7XG4gICAgICBvYmpIYXNoVUlEID0gMDtcbiAgICB9XG5cbiAgICBpZiAod2Vha01hcCkge1xuICAgICAgd2Vha01hcC5zZXQob2JqLCBoYXNoKTtcbiAgICB9IGVsc2UgaWYgKGNhbkRlZmluZVByb3BlcnR5KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBVSURfSEFTSF9LRVksIHtcbiAgICAgICAgJ2VudW1lcmFibGUnOiBmYWxzZSxcbiAgICAgICAgJ2NvbmZpZ3VyYWJsZSc6IGZhbHNlLFxuICAgICAgICAnd3JpdGFibGUnOiBmYWxzZSxcbiAgICAgICAgJ3ZhbHVlJzogaGFzaFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChvYmoucHJvcGVydHlJc0VudW1lcmFibGUgJiZcbiAgICAgICAgICAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9PT0gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZSkge1xuICAgICAgLy8gU2luY2Ugd2UgY2FuJ3QgZGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gdGhlIG9iamVjdFxuICAgICAgLy8gd2UnbGwgaGlqYWNrIG9uZSBvZiB0aGUgbGVzcy11c2VkIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgdG9cbiAgICAgIC8vIHNhdmUgb3VyIGhhc2ggb24gaXQuIFNpbmNlIHRoaXMgaXMgYSBmdW5jdGlvbiBpdCB3aWxsIG5vdCBzaG93IHVwIGluXG4gICAgICAvLyBgSlNPTi5zdHJpbmdpZnlgIHdoaWNoIGlzIHdoYXQgd2Ugd2FudC5cbiAgICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGVbVUlEX0hBU0hfS0VZXSA9IGhhc2g7XG4gICAgfSBlbHNlIGlmIChvYmoubm9kZVR5cGUpIHtcbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2UgY291bGRuJ3QgZ2V0IHRoZSBJRSBgdW5pcXVlSURgIHRvIHVzZSBhcyBhIGhhc2hcbiAgICAgIC8vIGFuZCB3ZSBjb3VsZG4ndCB1c2UgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSB0byBleHBsb2l0IHRoZVxuICAgICAgLy8gZG9udEVudW0gYnVnIHNvIHdlIHNpbXBseSBhZGQgdGhlIGBVSURfSEFTSF9LRVlgIG9uIHRoZSBub2RlXG4gICAgICAvLyBpdHNlbGYuXG4gICAgICBvYmpbVUlEX0hBU0hfS0VZXSA9IGhhc2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHNldCBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG9uIG9iamVjdC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGFzaDtcbiAgfVxuXG4gIC8vIFRydWUgaWYgT2JqZWN0LmRlZmluZVByb3BlcnR5IHdvcmtzIGFzIGV4cGVjdGVkLiBJRTggZmFpbHMgdGhpcyB0ZXN0LlxuICB2YXIgY2FuRGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24oKSB7XG4gICAgdHJ5IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ0AnLCB7fSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KCkpO1xuXG4gIC8vIElFIGhhcyBhIGB1bmlxdWVJRGAgcHJvcGVydHkgb24gRE9NIG5vZGVzLiBXZSBjYW4gY29uc3RydWN0IHRoZSBoYXNoIGZyb20gaXRcbiAgLy8gYW5kIGF2b2lkIG1lbW9yeSBsZWFrcyBmcm9tIHRoZSBJRSBjbG9uZU5vZGUgYnVnLlxuICBmdW5jdGlvbiBnZXRJRU5vZGVIYXNoKG5vZGUpIHtcbiAgICBpZiAobm9kZSAmJiBub2RlLm5vZGVUeXBlID4gMCkge1xuICAgICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICAgIGNhc2UgMTogLy8gRWxlbWVudFxuICAgICAgICAgIHJldHVybiBub2RlLnVuaXF1ZUlEO1xuICAgICAgICBjYXNlIDk6IC8vIERvY3VtZW50XG4gICAgICAgICAgcmV0dXJuIG5vZGUuZG9jdW1lbnRFbGVtZW50ICYmIG5vZGUuZG9jdW1lbnRFbGVtZW50LnVuaXF1ZUlEO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIElmIHBvc3NpYmxlLCB1c2UgYSBXZWFrTWFwLlxuICB2YXIgd2Vha01hcCA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nICYmIG5ldyBXZWFrTWFwKCk7XG5cbiAgdmFyIG9iakhhc2hVSUQgPSAwO1xuXG4gIHZhciBVSURfSEFTSF9LRVkgPSAnX19pbW11dGFibGVoYXNoX18nO1xuICBpZiAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFVJRF9IQVNIX0tFWSA9IFN5bWJvbChVSURfSEFTSF9LRVkpO1xuICB9XG5cbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX01JTl9TVFJMRU4gPSAxNjtcbiAgdmFyIFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFID0gMjU1O1xuICB2YXIgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG4gIHZhciBzdHJpbmdIYXNoQ2FjaGUgPSB7fTtcblxuICBmdW5jdGlvbiBpbnZhcmlhbnQoY29uZGl0aW9uLCBlcnJvcikge1xuICAgIGlmICghY29uZGl0aW9uKSB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNzZXJ0Tm90SW5maW5pdGUoc2l6ZSkge1xuICAgIGludmFyaWFudChcbiAgICAgIHNpemUgIT09IEluZmluaXR5LFxuICAgICAgJ0Nhbm5vdCBwZXJmb3JtIHRoaXMgYWN0aW9uIHdpdGggYW4gaW5maW5pdGUgc2l6ZS4nXG4gICAgKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFRvS2V5ZWRTZXF1ZW5jZSwgS2V5ZWRTZXEpO1xuICAgIGZ1bmN0aW9uIFRvS2V5ZWRTZXF1ZW5jZShpbmRleGVkLCB1c2VLZXlzKSB7XG4gICAgICB0aGlzLl9pdGVyID0gaW5kZXhlZDtcbiAgICAgIHRoaXMuX3VzZUtleXMgPSB1c2VLZXlzO1xuICAgICAgdGhpcy5zaXplID0gaW5kZXhlZC5zaXplO1xuICAgIH1cblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oa2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuZ2V0KGtleSwgbm90U2V0VmFsdWUpO1xuICAgIH07XG5cbiAgICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuaGFzKGtleSk7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUudmFsdWVTZXEgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLnZhbHVlU2VxKCk7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uKCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSByZXZlcnNlRmFjdG9yeSh0aGlzLCB0cnVlKTtcbiAgICAgIGlmICghdGhpcy5fdXNlS2V5cykge1xuICAgICAgICByZXZlcnNlZFNlcXVlbmNlLnZhbHVlU2VxID0gZnVuY3Rpb24oKSAge3JldHVybiB0aGlzJDAuX2l0ZXIudG9TZXEoKS5yZXZlcnNlKCl9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24obWFwcGVyLCBjb250ZXh0KSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgbWFwcGVkU2VxdWVuY2UgPSBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCk7XG4gICAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgICAgbWFwcGVkU2VxdWVuY2UudmFsdWVTZXEgPSBmdW5jdGlvbigpICB7cmV0dXJuIHRoaXMkMC5faXRlci50b1NlcSgpLm1hcChtYXBwZXIsIGNvbnRleHQpfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcbiAgICB9O1xuXG4gICAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGlpO1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKFxuICAgICAgICB0aGlzLl91c2VLZXlzID9cbiAgICAgICAgICBmdW5jdGlvbih2LCBrKSAge3JldHVybiBmbih2LCBrLCB0aGlzJDApfSA6XG4gICAgICAgICAgKChpaSA9IHJldmVyc2UgPyByZXNvbHZlU2l6ZSh0aGlzKSA6IDApLFxuICAgICAgICAgICAgZnVuY3Rpb24odiApIHtyZXR1cm4gZm4odiwgcmV2ZXJzZSA/IC0taWkgOiBpaSsrLCB0aGlzJDApfSksXG4gICAgICAgIHJldmVyc2VcbiAgICAgICk7XG4gICAgfTtcblxuICAgIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmICh0aGlzLl91c2VLZXlzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIGlpID0gcmV2ZXJzZSA/IHJlc29sdmVTaXplKHRoaXMpIDogMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCByZXZlcnNlID8gLS1paSA6IGlpKyssIHN0ZXAudmFsdWUsIHN0ZXApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuXG4gIGNyZWF0ZUNsYXNzKFRvSW5kZXhlZFNlcXVlbmNlLCBJbmRleGVkU2VxKTtcbiAgICBmdW5jdGlvbiBUb0luZGV4ZWRTZXF1ZW5jZShpdGVyKSB7XG4gICAgICB0aGlzLl9pdGVyID0gaXRlcjtcbiAgICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICB9XG5cbiAgICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuY29udGFpbnModmFsdWUpO1xuICAgIH07XG5cbiAgICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShmdW5jdGlvbih2ICkge3JldHVybiBmbih2LCBpdGVyYXRpb25zKyssIHRoaXMkMCl9LCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcClcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKFRvU2V0U2VxdWVuY2UsIFNldFNlcSk7XG4gICAgZnVuY3Rpb24gVG9TZXRTZXF1ZW5jZShpdGVyKSB7XG4gICAgICB0aGlzLl9pdGVyID0gaXRlcjtcbiAgICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICB9XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9pdGVyLmNvbnRhaW5zKGtleSk7XG4gICAgfTtcblxuICAgIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiApIHtyZXR1cm4gZm4odiwgdiwgdGhpcyQwKX0sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICByZXR1cm4gc3RlcC5kb25lID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBzdGVwLnZhbHVlLCBzdGVwLnZhbHVlLCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG5cblxuXG4gIGNyZWF0ZUNsYXNzKEZyb21FbnRyaWVzU2VxdWVuY2UsIEtleWVkU2VxKTtcbiAgICBmdW5jdGlvbiBGcm9tRW50cmllc1NlcXVlbmNlKGVudHJpZXMpIHtcbiAgICAgIHRoaXMuX2l0ZXIgPSBlbnRyaWVzO1xuICAgICAgdGhpcy5zaXplID0gZW50cmllcy5zaXplO1xuICAgIH1cblxuICAgIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmVudHJ5U2VxID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5faXRlci50b1NlcSgpO1xuICAgIH07XG5cbiAgICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uKGVudHJ5ICkge1xuICAgICAgICAvLyBDaGVjayBpZiBlbnRyeSBleGlzdHMgZmlyc3Qgc28gYXJyYXkgYWNjZXNzIGRvZXNuJ3QgdGhyb3cgZm9yIGhvbGVzXG4gICAgICAgIC8vIGluIHRoZSBwYXJlbnQgaXRlcmF0aW9uLlxuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YWxpZGF0ZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDApO1xuICAgICAgICB9XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIC8vIENoZWNrIGlmIGVudHJ5IGV4aXN0cyBmaXJzdCBzbyBhcnJheSBhY2Nlc3MgZG9lc24ndCB0aHJvdyBmb3IgaG9sZXNcbiAgICAgICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRW50cnkoZW50cnkpO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09IElURVJBVEVfRU5UUklFUyA/IHN0ZXAgOlxuICAgICAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGVudHJ5WzBdLCBlbnRyeVsxXSwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG5cbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICAgIGNhY2hlUmVzdWx0VGhyb3VnaDtcblxuXG4gIGZ1bmN0aW9uIGZsaXBGYWN0b3J5KGl0ZXJhYmxlKSB7XG4gICAgdmFyIGZsaXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgZmxpcFNlcXVlbmNlLl9pdGVyID0gaXRlcmFibGU7XG4gICAgZmxpcFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuICAgIGZsaXBTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZX07XG4gICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IGl0ZXJhYmxlLnJldmVyc2UuYXBwbHkodGhpcyk7IC8vIHN1cGVyLnJldmVyc2UoKVxuICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZS5yZXZlcnNlKCl9O1xuICAgICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG4gICAgfTtcbiAgICBmbGlwU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5ICkge3JldHVybiBpdGVyYWJsZS5jb250YWlucyhrZXkpfTtcbiAgICBmbGlwU2VxdWVuY2UuY29udGFpbnMgPSBmdW5jdGlvbihrZXkgKSB7cmV0dXJuIGl0ZXJhYmxlLmhhcyhrZXkpfTtcbiAgICBmbGlwU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gICAgZmxpcFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGZuKGssIHYsIHRoaXMkMCkgIT09IGZhbHNlfSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgICAgaWYgKCFzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHZhciBrID0gc3RlcC52YWx1ZVswXTtcbiAgICAgICAgICAgIHN0ZXAudmFsdWVbMF0gPSBzdGVwLnZhbHVlWzFdO1xuICAgICAgICAgICAgc3RlcC52YWx1ZVsxXSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYWJsZS5fX2l0ZXJhdG9yKFxuICAgICAgICB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUyA/IElURVJBVEVfS0VZUyA6IElURVJBVEVfVkFMVUVTLFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gZmxpcFNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBtYXBGYWN0b3J5KGl0ZXJhYmxlLCBtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgbWFwcGVkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIG1hcHBlZFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuICAgIG1hcHBlZFNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uKGtleSApIHtyZXR1cm4gaXRlcmFibGUuaGFzKGtleSl9O1xuICAgIG1hcHBlZFNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpICB7XG4gICAgICB2YXIgdiA9IGl0ZXJhYmxlLmdldChrZXksIE5PVF9TRVQpO1xuICAgICAgcmV0dXJuIHYgPT09IE5PVF9TRVQgP1xuICAgICAgICBub3RTZXRWYWx1ZSA6XG4gICAgICAgIG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGtleSwgaXRlcmFibGUpO1xuICAgIH07XG4gICAgbWFwcGVkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiBpdGVyYWJsZS5fX2l0ZXJhdGUoXG4gICAgICAgIGZ1bmN0aW9uKHYsIGssIGMpICB7cmV0dXJuIGZuKG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGssIGMpLCBrLCB0aGlzJDApICE9PSBmYWxzZX0sXG4gICAgICAgIHJldmVyc2VcbiAgICAgICk7XG4gICAgfVxuICAgIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgIHZhciBrZXkgPSBlbnRyeVswXTtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUoXG4gICAgICAgICAgdHlwZSxcbiAgICAgICAgICBrZXksXG4gICAgICAgICAgbWFwcGVyLmNhbGwoY29udGV4dCwgZW50cnlbMV0sIGtleSwgaXRlcmFibGUpLFxuICAgICAgICAgIHN0ZXBcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkU2VxdWVuY2U7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHJldmVyc2VGYWN0b3J5KGl0ZXJhYmxlLCB1c2VLZXlzKSB7XG4gICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIHJldmVyc2VkU2VxdWVuY2UuX2l0ZXIgPSBpdGVyYWJsZTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplO1xuICAgIHJldmVyc2VkU2VxdWVuY2UucmV2ZXJzZSA9IGZ1bmN0aW9uKCkgIHtyZXR1cm4gaXRlcmFibGV9O1xuICAgIGlmIChpdGVyYWJsZS5mbGlwKSB7XG4gICAgICByZXZlcnNlZFNlcXVlbmNlLmZsaXAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmbGlwU2VxdWVuY2UgPSBmbGlwRmFjdG9yeShpdGVyYWJsZSk7XG4gICAgICAgIGZsaXBTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZS5mbGlwKCl9O1xuICAgICAgICByZXR1cm4gZmxpcFNlcXVlbmNlO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbihrZXksIG5vdFNldFZhbHVlKSBcbiAgICAgIHtyZXR1cm4gaXRlcmFibGUuZ2V0KHVzZUtleXMgPyBrZXkgOiAtMSAtIGtleSwgbm90U2V0VmFsdWUpfTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uKGtleSApXG4gICAgICB7cmV0dXJuIGl0ZXJhYmxlLmhhcyh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXkpfTtcbiAgICByZXZlcnNlZFNlcXVlbmNlLmNvbnRhaW5zID0gZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIGl0ZXJhYmxlLmNvbnRhaW5zKHZhbHVlKX07XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5jYWNoZVJlc3VsdCA9IGNhY2hlUmVzdWx0VGhyb3VnaDtcbiAgICByZXZlcnNlZFNlcXVlbmNlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge3JldHVybiBmbih2LCBrLCB0aGlzJDApfSwgIXJldmVyc2UpO1xuICAgIH07XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yID1cbiAgICAgIGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpICB7cmV0dXJuIGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgIXJldmVyc2UpfTtcbiAgICByZXR1cm4gcmV2ZXJzZWRTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmlsdGVyRmFjdG9yeShpdGVyYWJsZSwgcHJlZGljYXRlLCBjb250ZXh0LCB1c2VLZXlzKSB7XG4gICAgdmFyIGZpbHRlclNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGl0ZXJhYmxlKTtcbiAgICBpZiAodXNlS2V5cykge1xuICAgICAgZmlsdGVyU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24oa2V5ICkge1xuICAgICAgICB2YXIgdiA9IGl0ZXJhYmxlLmdldChrZXksIE5PVF9TRVQpO1xuICAgICAgICByZXR1cm4gdiAhPT0gTk9UX1NFVCAmJiAhIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGtleSwgaXRlcmFibGUpO1xuICAgICAgfTtcbiAgICAgIGZpbHRlclNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uKGtleSwgbm90U2V0VmFsdWUpICB7XG4gICAgICAgIHZhciB2ID0gaXRlcmFibGUuZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgICAgIHJldHVybiB2ICE9PSBOT1RfU0VUICYmIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGtleSwgaXRlcmFibGUpID9cbiAgICAgICAgICB2IDogbm90U2V0VmFsdWU7XG4gICAgICB9O1xuICAgIH1cbiAgICBmaWx0ZXJTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgaXRlcmFibGUuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG4gICAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgdGhpcyQwKTtcbiAgICAgICAgfVxuICAgICAgfSwgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuICAgIGZpbHRlclNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICAgIHZhciBrZXkgPSBlbnRyeVswXTtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBlbnRyeVsxXTtcbiAgICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgaXRlcmFibGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8ga2V5IDogaXRlcmF0aW9ucysrLCB2YWx1ZSwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGZpbHRlclNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBjb3VudEJ5RmFjdG9yeShpdGVyYWJsZSwgZ3JvdXBlciwgY29udGV4dCkge1xuICAgIHZhciBncm91cHMgPSBzcmNfTWFwX19NYXAoKS5hc011dGFibGUoKTtcbiAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgIGdyb3Vwcy51cGRhdGUoXG4gICAgICAgIGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSksXG4gICAgICAgIDAsXG4gICAgICAgIGZ1bmN0aW9uKGEgKSB7cmV0dXJuIGEgKyAxfVxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZ3JvdXBzLmFzSW1tdXRhYmxlKCk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIGdyb3VwQnlGYWN0b3J5KGl0ZXJhYmxlLCBncm91cGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIGlzS2V5ZWRJdGVyID0gaXNLZXllZChpdGVyYWJsZSk7XG4gICAgdmFyIGdyb3VwcyA9IChpc09yZGVyZWQoaXRlcmFibGUpID8gT3JkZXJlZE1hcCgpIDogc3JjX01hcF9fTWFwKCkpLmFzTXV0YWJsZSgpO1xuICAgIGl0ZXJhYmxlLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgZ3JvdXBzLnVwZGF0ZShcbiAgICAgICAgZ3JvdXBlci5jYWxsKGNvbnRleHQsIHYsIGssIGl0ZXJhYmxlKSxcbiAgICAgICAgZnVuY3Rpb24oYSApIHtyZXR1cm4gKGEgPSBhIHx8IFtdLCBhLnB1c2goaXNLZXllZEl0ZXIgPyBbaywgdl0gOiB2KSwgYSl9XG4gICAgICApO1xuICAgIH0pO1xuICAgIHZhciBjb2VyY2UgPSBpdGVyYWJsZUNsYXNzKGl0ZXJhYmxlKTtcbiAgICByZXR1cm4gZ3JvdXBzLm1hcChmdW5jdGlvbihhcnIgKSB7cmV0dXJuIHJlaWZ5KGl0ZXJhYmxlLCBjb2VyY2UoYXJyKSl9KTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gc2xpY2VGYWN0b3J5KGl0ZXJhYmxlLCBiZWdpbiwgZW5kLCB1c2VLZXlzKSB7XG4gICAgdmFyIG9yaWdpbmFsU2l6ZSA9IGl0ZXJhYmxlLnNpemU7XG5cbiAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBvcmlnaW5hbFNpemUpKSB7XG4gICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgfVxuXG4gICAgdmFyIHJlc29sdmVkQmVnaW4gPSByZXNvbHZlQmVnaW4oYmVnaW4sIG9yaWdpbmFsU2l6ZSk7XG4gICAgdmFyIHJlc29sdmVkRW5kID0gcmVzb2x2ZUVuZChlbmQsIG9yaWdpbmFsU2l6ZSk7XG5cbiAgICAvLyBiZWdpbiBvciBlbmQgd2lsbCBiZSBOYU4gaWYgdGhleSB3ZXJlIHByb3ZpZGVkIGFzIG5lZ2F0aXZlIG51bWJlcnMgYW5kXG4gICAgLy8gdGhpcyBpdGVyYWJsZSdzIHNpemUgaXMgdW5rbm93bi4gSW4gdGhhdCBjYXNlLCBjYWNoZSBmaXJzdCBzbyB0aGVyZSBpc1xuICAgIC8vIGEga25vd24gc2l6ZS5cbiAgICBpZiAocmVzb2x2ZWRCZWdpbiAhPT0gcmVzb2x2ZWRCZWdpbiB8fCByZXNvbHZlZEVuZCAhPT0gcmVzb2x2ZWRFbmQpIHtcbiAgICAgIHJldHVybiBzbGljZUZhY3RvcnkoaXRlcmFibGUudG9TZXEoKS5jYWNoZVJlc3VsdCgpLCBiZWdpbiwgZW5kLCB1c2VLZXlzKTtcbiAgICB9XG5cbiAgICB2YXIgc2xpY2VTaXplID0gcmVzb2x2ZWRFbmQgLSByZXNvbHZlZEJlZ2luO1xuICAgIGlmIChzbGljZVNpemUgPCAwKSB7XG4gICAgICBzbGljZVNpemUgPSAwO1xuICAgIH1cblxuICAgIHZhciBzbGljZVNlcSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG5cbiAgICBzbGljZVNlcS5zaXplID0gc2xpY2VTaXplID09PSAwID8gc2xpY2VTaXplIDogaXRlcmFibGUuc2l6ZSAmJiBzbGljZVNpemUgfHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKCF1c2VLZXlzICYmIGlzU2VxKGl0ZXJhYmxlKSAmJiBzbGljZVNpemUgPj0gMCkge1xuICAgICAgc2xpY2VTZXEuZ2V0ID0gZnVuY3Rpb24gKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgc2xpY2VTaXplID9cbiAgICAgICAgICBpdGVyYWJsZS5nZXQoaW5kZXggKyByZXNvbHZlZEJlZ2luLCBub3RTZXRWYWx1ZSkgOlxuICAgICAgICAgIG5vdFNldFZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHNsaWNlU2VxLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIGlmIChzbGljZVNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgc2tpcHBlZCA9IDA7XG4gICAgICB2YXIgaXNTa2lwcGluZyA9IHRydWU7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgICAgaWYgKCEoaXNTa2lwcGluZyAmJiAoaXNTa2lwcGluZyA9IHNraXBwZWQrKyA8IHJlc29sdmVkQmVnaW4pKSkge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgdGhpcyQwKSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICAgICAgICAgaXRlcmF0aW9ucyAhPT0gc2xpY2VTaXplO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG5cbiAgICBzbGljZVNlcS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICBpZiAoc2xpY2VTaXplICYmIHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgLy8gRG9uJ3QgYm90aGVyIGluc3RhbnRpYXRpbmcgcGFyZW50IGl0ZXJhdG9yIGlmIHRha2luZyAwLlxuICAgICAgdmFyIGl0ZXJhdG9yID0gc2xpY2VTaXplICYmIGl0ZXJhYmxlLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICB2YXIgc2tpcHBlZCA9IDA7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAoc2tpcHBlZCsrICE9PSByZXNvbHZlZEJlZ2luKSB7XG4gICAgICAgICAgaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgrK2l0ZXJhdGlvbnMgPiBzbGljZVNpemUpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmICh1c2VLZXlzIHx8IHR5cGUgPT09IElURVJBVEVfVkFMVUVTKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucyAtIDEsIHVuZGVmaW5lZCwgc3RlcCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucyAtIDEsIHN0ZXAudmFsdWVbMV0sIHN0ZXApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2xpY2VTZXE7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIHRha2VXaGlsZUZhY3RvcnkoaXRlcmFibGUsIHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciB0YWtlU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoaXRlcmFibGUpO1xuICAgIHRha2VTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgXG4gICAgICAgIHtyZXR1cm4gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykgJiYgKytpdGVyYXRpb25zICYmIGZuKHYsIGssIHRoaXMkMCl9XG4gICAgICApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICB0YWtlU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIGl0ZXJhdGluZyA9IHRydWU7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICBpZiAoIWl0ZXJhdGluZykge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgIHZhciBrID0gZW50cnlbMF07XG4gICAgICAgIHZhciB2ID0gZW50cnlbMV07XG4gICAgICAgIGlmICghcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgdGhpcyQwKSkge1xuICAgICAgICAgIGl0ZXJhdGluZyA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHRha2VTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gc2tpcFdoaWxlRmFjdG9yeShpdGVyYWJsZSwgcHJlZGljYXRlLCBjb250ZXh0LCB1c2VLZXlzKSB7XG4gICAgdmFyIHNraXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgc2tpcFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgICB9XG4gICAgICB2YXIgaXNTa2lwcGluZyA9IHRydWU7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaywgYykgIHtcbiAgICAgICAgaWYgKCEoaXNTa2lwcGluZyAmJiAoaXNTa2lwcGluZyA9IHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSkpIHtcbiAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgcmV0dXJuIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcbiAgICBza2lwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmFibGUuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgICAgdmFyIHNraXBwaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciBzdGVwLCBrLCB2O1xuICAgICAgICBkbyB7XG4gICAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUykge1xuICAgICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdW5kZWZpbmVkLCBzdGVwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZVsxXSwgc3RlcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgayA9IGVudHJ5WzBdO1xuICAgICAgICAgIHYgPSBlbnRyeVsxXTtcbiAgICAgICAgICBza2lwcGluZyAmJiAoc2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDApKTtcbiAgICAgICAgfSB3aGlsZSAoc2tpcHBpbmcpO1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHNraXBTZXF1ZW5jZTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gY29uY2F0RmFjdG9yeShpdGVyYWJsZSwgdmFsdWVzKSB7XG4gICAgdmFyIGlzS2V5ZWRJdGVyYWJsZSA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBpdGVycyA9IFtpdGVyYWJsZV0uY29uY2F0KHZhbHVlcykubWFwKGZ1bmN0aW9uKHYgKSB7XG4gICAgICBpZiAoIWlzSXRlcmFibGUodikpIHtcbiAgICAgICAgdiA9IGlzS2V5ZWRJdGVyYWJsZSA/XG4gICAgICAgICAga2V5ZWRTZXFGcm9tVmFsdWUodikgOlxuICAgICAgICAgIGluZGV4ZWRTZXFGcm9tVmFsdWUoQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbdl0pO1xuICAgICAgfSBlbHNlIGlmIChpc0tleWVkSXRlcmFibGUpIHtcbiAgICAgICAgdiA9IEtleWVkSXRlcmFibGUodik7XG4gICAgICB9XG4gICAgICByZXR1cm4gdjtcbiAgICB9KS5maWx0ZXIoZnVuY3Rpb24odiApIHtyZXR1cm4gdi5zaXplICE9PSAwfSk7XG5cbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgfVxuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHNpbmdsZXRvbiA9IGl0ZXJzWzBdO1xuICAgICAgaWYgKHNpbmdsZXRvbiA9PT0gaXRlcmFibGUgfHxcbiAgICAgICAgICBpc0tleWVkSXRlcmFibGUgJiYgaXNLZXllZChzaW5nbGV0b24pIHx8XG4gICAgICAgICAgaXNJbmRleGVkKGl0ZXJhYmxlKSAmJiBpc0luZGV4ZWQoc2luZ2xldG9uKSkge1xuICAgICAgICByZXR1cm4gc2luZ2xldG9uO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBjb25jYXRTZXEgPSBuZXcgQXJyYXlTZXEoaXRlcnMpO1xuICAgIGlmIChpc0tleWVkSXRlcmFibGUpIHtcbiAgICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b0tleWVkU2VxKCk7XG4gICAgfSBlbHNlIGlmICghaXNJbmRleGVkKGl0ZXJhYmxlKSkge1xuICAgICAgY29uY2F0U2VxID0gY29uY2F0U2VxLnRvU2V0U2VxKCk7XG4gICAgfVxuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS5mbGF0dGVuKHRydWUpO1xuICAgIGNvbmNhdFNlcS5zaXplID0gaXRlcnMucmVkdWNlKFxuICAgICAgZnVuY3Rpb24oc3VtLCBzZXEpICB7XG4gICAgICAgIGlmIChzdW0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzaXplID0gc2VxLnNpemU7XG4gICAgICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1bSArIHNpemU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgMFxuICAgICk7XG4gICAgcmV0dXJuIGNvbmNhdFNlcTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gZmxhdHRlbkZhY3RvcnkoaXRlcmFibGUsIGRlcHRoLCB1c2VLZXlzKSB7XG4gICAgdmFyIGZsYXRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgZmxhdFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBzdG9wcGVkID0gZmFsc2U7XG4gICAgICBmdW5jdGlvbiBmbGF0RGVlcChpdGVyLCBjdXJyZW50RGVwdGgpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgICAgaXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgIHtcbiAgICAgICAgICBpZiAoKCFkZXB0aCB8fCBjdXJyZW50RGVwdGggPCBkZXB0aCkgJiYgaXNJdGVyYWJsZSh2KSkge1xuICAgICAgICAgICAgZmxhdERlZXAodiwgY3VycmVudERlcHRoICsgMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMrKywgdGhpcyQwKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gIXN0b3BwZWQ7XG4gICAgICAgIH0sIHJldmVyc2UpO1xuICAgICAgfVxuICAgICAgZmxhdERlZXAoaXRlcmFibGUsIDApO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfVxuICAgIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgdmFyIHN0YWNrID0gW107XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICByZXR1cm4gbmV3IHNyY19JdGVyYXRvcl9fSXRlcmF0b3IoZnVuY3Rpb24oKSAge1xuICAgICAgICB3aGlsZSAoaXRlcmF0b3IpIHtcbiAgICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgaXRlcmF0b3IgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgdiA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgaWYgKHR5cGUgPT09IElURVJBVEVfRU5UUklFUykge1xuICAgICAgICAgICAgdiA9IHZbMV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICgoIWRlcHRoIHx8IHN0YWNrLmxlbmd0aCA8IGRlcHRoKSAmJiBpc0l0ZXJhYmxlKHYpKSB7XG4gICAgICAgICAgICBzdGFjay5wdXNoKGl0ZXJhdG9yKTtcbiAgICAgICAgICAgIGl0ZXJhdG9yID0gdi5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdXNlS2V5cyA/IHN0ZXAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdiwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gZmxhdFNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBmbGF0TWFwRmFjdG9yeShpdGVyYWJsZSwgbWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIGNvZXJjZSA9IGl0ZXJhYmxlQ2xhc3MoaXRlcmFibGUpO1xuICAgIHJldHVybiBpdGVyYWJsZS50b1NlcSgpLm1hcChcbiAgICAgIGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIGNvZXJjZShtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBpdGVyYWJsZSkpfVxuICAgICkuZmxhdHRlbih0cnVlKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gaW50ZXJwb3NlRmFjdG9yeShpdGVyYWJsZSwgc2VwYXJhdG9yKSB7XG4gICAgdmFyIGludGVycG9zZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShpdGVyYWJsZSk7XG4gICAgaW50ZXJwb3NlZFNlcXVlbmNlLnNpemUgPSBpdGVyYWJsZS5zaXplICYmIGl0ZXJhYmxlLnNpemUgKiAyIC0xO1xuICAgIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgICBpdGVyYWJsZS5fX2l0ZXJhdGUoZnVuY3Rpb24odiwgaykgXG4gICAgICAgIHtyZXR1cm4gKCFpdGVyYXRpb25zIHx8IGZuKHNlcGFyYXRvciwgaXRlcmF0aW9ucysrLCB0aGlzJDApICE9PSBmYWxzZSkgJiZcbiAgICAgICAgZm4odiwgaXRlcmF0aW9ucysrLCB0aGlzJDApICE9PSBmYWxzZX0sXG4gICAgICAgIHJldmVyc2VcbiAgICAgICk7XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICB9O1xuICAgIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBpdGVyYWJsZS5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgaWYgKCFzdGVwIHx8IGl0ZXJhdGlvbnMgJSAyKSB7XG4gICAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZXJhdGlvbnMgJSAyID9cbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc2VwYXJhdG9yKSA6XG4gICAgICAgICAgaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHN0ZXAudmFsdWUsIHN0ZXApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gaW50ZXJwb3NlZFNlcXVlbmNlO1xuICB9XG5cblxuICBmdW5jdGlvbiBzb3J0RmFjdG9yeShpdGVyYWJsZSwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG4gICAgaWYgKCFjb21wYXJhdG9yKSB7XG4gICAgICBjb21wYXJhdG9yID0gZGVmYXVsdENvbXBhcmF0b3I7XG4gICAgfVxuICAgIHZhciBpc0tleWVkSXRlcmFibGUgPSBpc0tleWVkKGl0ZXJhYmxlKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBlbnRyaWVzID0gaXRlcmFibGUudG9TZXEoKS5tYXAoXG4gICAgICBmdW5jdGlvbih2LCBrKSAge3JldHVybiBbaywgdiwgaW5kZXgrKywgbWFwcGVyID8gbWFwcGVyKHYsIGssIGl0ZXJhYmxlKSA6IHZdfVxuICAgICkudG9BcnJheSgpO1xuICAgIGVudHJpZXMuc29ydChmdW5jdGlvbihhLCBiKSAge3JldHVybiBjb21wYXJhdG9yKGFbM10sIGJbM10pIHx8IGFbMl0gLSBiWzJdfSkuZm9yRWFjaChcbiAgICAgIGlzS2V5ZWRJdGVyYWJsZSA/XG4gICAgICBmdW5jdGlvbih2LCBpKSAgeyBlbnRyaWVzW2ldLmxlbmd0aCA9IDI7IH0gOlxuICAgICAgZnVuY3Rpb24odiwgaSkgIHsgZW50cmllc1tpXSA9IHZbMV07IH1cbiAgICApO1xuICAgIHJldHVybiBpc0tleWVkSXRlcmFibGUgPyBLZXllZFNlcShlbnRyaWVzKSA6XG4gICAgICBpc0luZGV4ZWQoaXRlcmFibGUpID8gSW5kZXhlZFNlcShlbnRyaWVzKSA6XG4gICAgICBTZXRTZXEoZW50cmllcyk7XG4gIH1cblxuXG4gIGZ1bmN0aW9uIG1heEZhY3RvcnkoaXRlcmFibGUsIGNvbXBhcmF0b3IsIG1hcHBlcikge1xuICAgIGlmICghY29tcGFyYXRvcikge1xuICAgICAgY29tcGFyYXRvciA9IGRlZmF1bHRDb21wYXJhdG9yO1xuICAgIH1cbiAgICBpZiAobWFwcGVyKSB7XG4gICAgICB2YXIgZW50cnkgPSBpdGVyYWJsZS50b1NlcSgpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gW3YsIG1hcHBlcih2LCBrLCBpdGVyYWJsZSldfSlcbiAgICAgICAgLnJlZHVjZShmdW5jdGlvbihhLCBiKSAge3JldHVybiBtYXhDb21wYXJlKGNvbXBhcmF0b3IsIGFbMV0sIGJbMV0pID8gYiA6IGF9KTtcbiAgICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeVswXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGl0ZXJhYmxlLnJlZHVjZShmdW5jdGlvbihhLCBiKSAge3JldHVybiBtYXhDb21wYXJlKGNvbXBhcmF0b3IsIGEsIGIpID8gYiA6IGF9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBtYXhDb21wYXJlKGNvbXBhcmF0b3IsIGEsIGIpIHtcbiAgICB2YXIgY29tcCA9IGNvbXBhcmF0b3IoYiwgYSk7XG4gICAgLy8gYiBpcyBjb25zaWRlcmVkIHRoZSBuZXcgbWF4IGlmIHRoZSBjb21wYXJhdG9yIGRlY2xhcmVzIHRoZW0gZXF1YWwsIGJ1dFxuICAgIC8vIHRoZXkgYXJlIG5vdCBlcXVhbCBhbmQgYiBpcyBpbiBmYWN0IGEgbnVsbGlzaCB2YWx1ZS5cbiAgICByZXR1cm4gKGNvbXAgPT09IDAgJiYgYiAhPT0gYSAmJiAoYiA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwgfHwgYiAhPT0gYikpIHx8IGNvbXAgPiAwO1xuICB9XG5cblxuICBmdW5jdGlvbiB6aXBXaXRoRmFjdG9yeShrZXlJdGVyLCB6aXBwZXIsIGl0ZXJzKSB7XG4gICAgdmFyIHppcFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGtleUl0ZXIpO1xuICAgIHppcFNlcXVlbmNlLnNpemUgPSBuZXcgQXJyYXlTZXEoaXRlcnMpLm1hcChmdW5jdGlvbihpICkge3JldHVybiBpLnNpemV9KS5taW4oKTtcbiAgICAvLyBOb3RlOiB0aGlzIGEgZ2VuZXJpYyBiYXNlIGltcGxlbWVudGF0aW9uIG9mIF9faXRlcmF0ZSBpbiB0ZXJtcyBvZlxuICAgIC8vIF9faXRlcmF0b3Igd2hpY2ggbWF5IGJlIG1vcmUgZ2VuZXJpY2FsbHkgdXNlZnVsIGluIHRoZSBmdXR1cmUuXG4gICAgemlwU2VxdWVuY2UuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIC8qIGdlbmVyaWM6XG4gICAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgIGlmIChmbihzdGVwLnZhbHVlWzFdLCBzdGVwLnZhbHVlWzBdLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgICAqL1xuICAgICAgLy8gaW5kZXhlZDpcbiAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgaWYgKGZuKHN0ZXAudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG4gICAgemlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGl0ZXJhdG9ycyA9IGl0ZXJzLm1hcChmdW5jdGlvbihpIClcbiAgICAgICAge3JldHVybiAoaSA9IEl0ZXJhYmxlKGkpLCBnZXRJdGVyYXRvcihyZXZlcnNlID8gaS5yZXZlcnNlKCkgOiBpKSl9XG4gICAgICApO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIGlzRG9uZSA9IGZhbHNlO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHN0ZXBzO1xuICAgICAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgICAgIHN0ZXBzID0gaXRlcmF0b3JzLm1hcChmdW5jdGlvbihpICkge3JldHVybiBpLm5leHQoKX0pO1xuICAgICAgICAgIGlzRG9uZSA9IHN0ZXBzLnNvbWUoZnVuY3Rpb24ocyApIHtyZXR1cm4gcy5kb25lfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICB0eXBlLFxuICAgICAgICAgIGl0ZXJhdGlvbnMrKyxcbiAgICAgICAgICB6aXBwZXIuYXBwbHkobnVsbCwgc3RlcHMubWFwKGZ1bmN0aW9uKHMgKSB7cmV0dXJuIHMudmFsdWV9KSlcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIHppcFNlcXVlbmNlXG4gIH1cblxuXG4gIC8vICNwcmFnbWEgSGVscGVyIEZ1bmN0aW9uc1xuXG4gIGZ1bmN0aW9uIHJlaWZ5KGl0ZXIsIHNlcSkge1xuICAgIHJldHVybiBpc1NlcShpdGVyKSA/IHNlcSA6IGl0ZXIuY29uc3RydWN0b3Ioc2VxKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlRW50cnkoZW50cnkpIHtcbiAgICBpZiAoZW50cnkgIT09IE9iamVjdChlbnRyeSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFtLLCBWXSB0dXBsZTogJyArIGVudHJ5KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlU2l6ZShpdGVyKSB7XG4gICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICByZXR1cm4gZW5zdXJlU2l6ZShpdGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhYmxlQ2xhc3MoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZEl0ZXJhYmxlIDpcbiAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkSXRlcmFibGUgOlxuICAgICAgU2V0SXRlcmFibGU7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU2VxdWVuY2UoaXRlcmFibGUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAgIChcbiAgICAgICAgaXNLZXllZChpdGVyYWJsZSkgPyBLZXllZFNlcSA6XG4gICAgICAgIGlzSW5kZXhlZChpdGVyYWJsZSkgPyBJbmRleGVkU2VxIDpcbiAgICAgICAgU2V0U2VxXG4gICAgICApLnByb3RvdHlwZVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBjYWNoZVJlc3VsdFRocm91Z2goKSB7XG4gICAgaWYgKHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQpIHtcbiAgICAgIHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQoKTtcbiAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2l0ZXIuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdC5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZmF1bHRDb21wYXJhdG9yKGEsIGIpIHtcbiAgICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JjZUl0ZXJhdG9yKGtleVBhdGgpIHtcbiAgICB2YXIgaXRlciA9IGdldEl0ZXJhdG9yKGtleVBhdGgpO1xuICAgIGlmICghaXRlcikge1xuICAgICAgLy8gQXJyYXkgbWlnaHQgbm90IGJlIGl0ZXJhYmxlIGluIHRoaXMgZW52aXJvbm1lbnQsIHNvIHdlIG5lZWQgYSBmYWxsYmFja1xuICAgICAgLy8gdG8gb3VyIHdyYXBwZWQgdHlwZS5cbiAgICAgIGlmICghaXNBcnJheUxpa2Uoa2V5UGF0aCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgaXRlcmFibGUgb3IgYXJyYXktbGlrZTogJyArIGtleVBhdGgpO1xuICAgICAgfVxuICAgICAgaXRlciA9IGdldEl0ZXJhdG9yKEl0ZXJhYmxlKGtleVBhdGgpKTtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXI7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhzcmNfTWFwX19NYXAsIEtleWVkQ29sbGVjdGlvbik7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gc3JjX01hcF9fTWFwKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5TWFwKCkgOlxuICAgICAgICBpc01hcCh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5TWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihtYXAgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBLZXllZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbih2LCBrKSAge3JldHVybiBtYXAuc2V0KGssIHYpfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ01hcCB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yb290ID9cbiAgICAgICAgdGhpcy5fcm9vdC5nZXQoMCwgdW5kZWZpbmVkLCBrLCBub3RTZXRWYWx1ZSkgOlxuICAgICAgICBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaywgdikge1xuICAgICAgcmV0dXJuIHVwZGF0ZU1hcCh0aGlzLCBrLCB2KTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5zZXRJbiA9IGZ1bmN0aW9uKGtleVBhdGgsIHYpIHtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKGtleVBhdGgsIE5PVF9TRVQsIGZ1bmN0aW9uKCkgIHtyZXR1cm4gdn0pO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGspIHtcbiAgICAgIHJldHVybiB1cGRhdGVNYXAodGhpcywgaywgTk9UX1NFVCk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuZGVsZXRlSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihrZXlQYXRoLCBmdW5jdGlvbigpICB7cmV0dXJuIE5PVF9TRVR9KTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbihrLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuICAgICAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgP1xuICAgICAgICBrKHRoaXMpIDpcbiAgICAgICAgdGhpcy51cGRhdGVJbihba10sIG5vdFNldFZhbHVlLCB1cGRhdGVyKTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS51cGRhdGVJbiA9IGZ1bmN0aW9uKGtleVBhdGgsIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gICAgICBpZiAoIXVwZGF0ZXIpIHtcbiAgICAgICAgdXBkYXRlciA9IG5vdFNldFZhbHVlO1xuICAgICAgICBub3RTZXRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICAgIHZhciB1cGRhdGVkVmFsdWUgPSB1cGRhdGVJbkRlZXBNYXAoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGZvcmNlSXRlcmF0b3Ioa2V5UGF0aCksXG4gICAgICAgIG5vdFNldFZhbHVlLFxuICAgICAgICB1cGRhdGVyXG4gICAgICApO1xuICAgICAgcmV0dXJuIHVwZGF0ZWRWYWx1ZSA9PT0gTk9UX1NFVCA/IHVuZGVmaW5lZCA6IHVwZGF0ZWRWYWx1ZTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlNYXAoKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b01hcFdpdGgodGhpcywgdW5kZWZpbmVkLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLm1lcmdlV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIG1lcmdlSW50b01hcFdpdGgodGhpcywgbWVyZ2VyLCBpdGVycyk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VJbiA9IGZ1bmN0aW9uKGtleVBhdGgpIHt2YXIgaXRlcnMgPSBTTElDRSQwLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIHJldHVybiB0aGlzLnVwZGF0ZUluKGtleVBhdGgsIGVtcHR5TWFwKCksIGZ1bmN0aW9uKG0gKSB7cmV0dXJuIG0ubWVyZ2UuYXBwbHkobSwgaXRlcnMpfSk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VEZWVwID0gZnVuY3Rpb24oLyouLi5pdGVycyovKSB7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTWFwV2l0aCh0aGlzLCBkZWVwTWVyZ2VyKHVuZGVmaW5lZCksIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIG1lcmdlSW50b01hcFdpdGgodGhpcywgZGVlcE1lcmdlcihtZXJnZXIpLCBpdGVycyk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBmdW5jdGlvbihrZXlQYXRoKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gdGhpcy51cGRhdGVJbihrZXlQYXRoLCBlbXB0eU1hcCgpLCBmdW5jdGlvbihtICkge3JldHVybiBtLm1lcmdlRGVlcC5hcHBseShtLCBpdGVycyl9KTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgICByZXR1cm4gT3JkZXJlZE1hcChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24obWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICAgIHJldHVybiBPcmRlcmVkTWFwKHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE11dGFiaWxpdHlcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IGZ1bmN0aW9uKGZuKSB7XG4gICAgICB2YXIgbXV0YWJsZSA9IHRoaXMuYXNNdXRhYmxlKCk7XG4gICAgICBmbihtdXRhYmxlKTtcbiAgICAgIHJldHVybiBtdXRhYmxlLndhc0FsdGVyZWQoKSA/IG11dGFibGUuX19lbnN1cmVPd25lcih0aGlzLl9fb3duZXJJRCkgOiB0aGlzO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLmFzTXV0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19vd25lcklEID8gdGhpcyA6IHRoaXMuX19lbnN1cmVPd25lcihuZXcgT3duZXJJRCgpKTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19lbnN1cmVPd25lcigpO1xuICAgIH07XG5cbiAgICBzcmNfTWFwX19NYXAucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fYWx0ZXJlZDtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgc3JjX01hcF9fTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdGhpcy5fcm9vdCAmJiB0aGlzLl9yb290Lml0ZXJhdGUoZnVuY3Rpb24oZW50cnkgKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgcmV0dXJuIGZuKGVudHJ5WzFdLCBlbnRyeVswXSwgdGhpcyQwKTtcbiAgICAgIH0sIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gICAgfTtcblxuICAgIHNyY19NYXBfX01hcC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uKG93bmVySUQpIHtcbiAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1ha2VNYXAodGhpcy5zaXplLCB0aGlzLl9yb290LCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzTWFwKG1heWJlTWFwKSB7XG4gICAgcmV0dXJuICEhKG1heWJlTWFwICYmIG1heWJlTWFwW0lTX01BUF9TRU5USU5FTF0pO1xuICB9XG5cbiAgc3JjX01hcF9fTWFwLmlzTWFwID0gaXNNYXA7XG5cbiAgdmFyIElTX01BUF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX01BUF9fQEAnO1xuXG4gIHZhciBNYXBQcm90b3R5cGUgPSBzcmNfTWFwX19NYXAucHJvdG90eXBlO1xuICBNYXBQcm90b3R5cGVbSVNfTUFQX1NFTlRJTkVMXSA9IHRydWU7XG4gIE1hcFByb3RvdHlwZVtERUxFVEVdID0gTWFwUHJvdG90eXBlLnJlbW92ZTtcbiAgTWFwUHJvdG90eXBlLnJlbW92ZUluID0gTWFwUHJvdG90eXBlLmRlbGV0ZUluO1xuXG5cbiAgLy8gI3ByYWdtYSBUcmllIE5vZGVzXG5cblxuXG4gICAgZnVuY3Rpb24gQXJyYXlNYXBOb2RlKG93bmVySUQsIGVudHJpZXMpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xuICAgIH1cblxuICAgIEFycmF5TWFwTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICAgICAgZm9yICh2YXIgaWkgPSAwLCBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaWkgPCBsZW47IGlpKyspIHtcbiAgICAgICAgaWYgKGlzKGtleSwgZW50cmllc1tpaV1bMF0pKSB7XG4gICAgICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgfTtcblxuICAgIEFycmF5TWFwTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuXG4gICAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICAgIHZhciBpZHggPSAwO1xuICAgICAgZm9yICh2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICAgICAgaWYgKGlzKGtleSwgZW50cmllc1tpZHhdWzBdKSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgZXhpc3RzID0gaWR4IDwgbGVuO1xuXG4gICAgICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIFNldFJlZihkaWRBbHRlcik7XG4gICAgICAocmVtb3ZlZCB8fCAhZXhpc3RzKSAmJiBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cbiAgICAgIGlmIChyZW1vdmVkICYmIGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybjsgLy8gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGlmICghZXhpc3RzICYmICFyZW1vdmVkICYmIGVudHJpZXMubGVuZ3RoID49IE1BWF9BUlJBWV9NQVBfU0laRSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlTm9kZXMob3duZXJJRCwgZW50cmllcywga2V5LCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gICAgICB2YXIgbmV3RW50cmllcyA9IGlzRWRpdGFibGUgPyBlbnRyaWVzIDogYXJyQ29weShlbnRyaWVzKTtcblxuICAgICAgaWYgKGV4aXN0cykge1xuICAgICAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgICAgIGlkeCA9PT0gbGVuIC0gMSA/IG5ld0VudHJpZXMucG9wKCkgOiAobmV3RW50cmllc1tpZHhdID0gbmV3RW50cmllcy5wb3AoKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3RW50cmllc1tpZHhdID0gW2tleSwgdmFsdWVdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdFbnRyaWVzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5lbnRyaWVzID0gbmV3RW50cmllcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgQXJyYXlNYXBOb2RlKG93bmVySUQsIG5ld0VudHJpZXMpO1xuICAgIH07XG5cblxuXG5cbiAgICBmdW5jdGlvbiBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBiaXRtYXAsIG5vZGVzKSB7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5iaXRtYXAgPSBiaXRtYXA7XG4gICAgICB0aGlzLm5vZGVzID0gbm9kZXM7XG4gICAgfVxuXG4gICAgQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gICAgICB9XG4gICAgICB2YXIgYml0ID0gKDEgPDwgKChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLKSk7XG4gICAgICB2YXIgYml0bWFwID0gdGhpcy5iaXRtYXA7XG4gICAgICByZXR1cm4gKGJpdG1hcCAmIGJpdCkgPT09IDAgPyBub3RTZXRWYWx1ZSA6XG4gICAgICAgIHRoaXMubm9kZXNbcG9wQ291bnQoYml0bWFwICYgKGJpdCAtIDEpKV0uZ2V0KHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpO1xuICAgIH07XG5cbiAgICBCaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gICAgICB9XG4gICAgICB2YXIga2V5SGFzaEZyYWcgPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICAgIHZhciBiaXQgPSAxIDw8IGtleUhhc2hGcmFnO1xuICAgICAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuICAgICAgdmFyIGV4aXN0cyA9IChiaXRtYXAgJiBiaXQpICE9PSAwO1xuXG4gICAgICBpZiAoIWV4aXN0cyAmJiB2YWx1ZSA9PT0gTk9UX1NFVCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIGlkeCA9IHBvcENvdW50KGJpdG1hcCAmIChiaXQgLSAxKSk7XG4gICAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgICAgdmFyIG5vZGUgPSBleGlzdHMgPyBub2Rlc1tpZHhdIDogdW5kZWZpbmVkO1xuICAgICAgdmFyIG5ld05vZGUgPSB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcblxuICAgICAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGlmICghZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID49IE1BWF9CSVRNQVBfSU5ERVhFRF9TSVpFKSB7XG4gICAgICAgIHJldHVybiBleHBhbmROb2Rlcyhvd25lcklELCBub2RlcywgYml0bWFwLCBrZXlIYXNoRnJhZywgbmV3Tm9kZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChleGlzdHMgJiYgIW5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID09PSAyICYmIGlzTGVhZk5vZGUobm9kZXNbaWR4IF4gMV0pKSB7XG4gICAgICAgIHJldHVybiBub2Rlc1tpZHggXiAxXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4aXN0cyAmJiBuZXdOb2RlICYmIG5vZGVzLmxlbmd0aCA9PT0gMSAmJiBpc0xlYWZOb2RlKG5ld05vZGUpKSB7XG4gICAgICAgIHJldHVybiBuZXdOb2RlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuICAgICAgdmFyIG5ld0JpdG1hcCA9IGV4aXN0cyA/IG5ld05vZGUgPyBiaXRtYXAgOiBiaXRtYXAgXiBiaXQgOiBiaXRtYXAgfCBiaXQ7XG4gICAgICB2YXIgbmV3Tm9kZXMgPSBleGlzdHMgPyBuZXdOb2RlID9cbiAgICAgICAgc2V0SW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSkgOlxuICAgICAgICBzcGxpY2VPdXQobm9kZXMsIGlkeCwgaXNFZGl0YWJsZSkgOlxuICAgICAgICBzcGxpY2VJbihub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKTtcblxuICAgICAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5iaXRtYXAgPSBuZXdCaXRtYXA7XG4gICAgICAgIHRoaXMubm9kZXMgPSBuZXdOb2RlcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgbmV3Qml0bWFwLCBuZXdOb2Rlcyk7XG4gICAgfTtcblxuXG5cblxuICAgIGZ1bmN0aW9uIEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgY291bnQsIG5vZGVzKSB7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5jb3VudCA9IGNvdW50O1xuICAgICAgdGhpcy5ub2RlcyA9IG5vZGVzO1xuICAgIH1cblxuICAgIEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gICAgICB9XG4gICAgICB2YXIgaWR4ID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gICAgICB2YXIgbm9kZSA9IHRoaXMubm9kZXNbaWR4XTtcbiAgICAgIHJldHVybiBub2RlID8gbm9kZS5nZXQoc2hpZnQgKyBTSElGVCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkgOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgSGFzaEFycmF5TWFwTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24ob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gICAgICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gICAgICB9XG4gICAgICB2YXIgaWR4ID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gICAgICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuICAgICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaWR4XTtcblxuICAgICAgaWYgKHJlbW92ZWQgJiYgIW5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIHZhciBuZXdOb2RlID0gdXBkYXRlTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcik7XG4gICAgICBpZiAobmV3Tm9kZSA9PT0gbm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgdmFyIG5ld0NvdW50ID0gdGhpcy5jb3VudDtcbiAgICAgIGlmICghbm9kZSkge1xuICAgICAgICBuZXdDb3VudCsrO1xuICAgICAgfSBlbHNlIGlmICghbmV3Tm9kZSkge1xuICAgICAgICBuZXdDb3VudC0tO1xuICAgICAgICBpZiAobmV3Q291bnQgPCBNSU5fSEFTSF9BUlJBWV9NQVBfU0laRSkge1xuICAgICAgICAgIHJldHVybiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIG5ld0NvdW50LCBpZHgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gICAgICB2YXIgbmV3Tm9kZXMgPSBzZXRJbihub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKTtcblxuICAgICAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IG5ld0NvdW50O1xuICAgICAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3Q291bnQsIG5ld05vZGVzKTtcbiAgICB9O1xuXG5cblxuXG4gICAgZnVuY3Rpb24gSGFzaENvbGxpc2lvbk5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cmllcykge1xuICAgICAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMua2V5SGFzaCA9IGtleUhhc2g7XG4gICAgICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xuICAgIH1cblxuICAgIEhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuICAgICAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lpXVswXSkpIHtcbiAgICAgICAgICByZXR1cm4gZW50cmllc1tpaV1bMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgICAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuXG4gICAgICBpZiAoa2V5SGFzaCAhPT0gdGhpcy5rZXlIYXNoKSB7XG4gICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICAgICAgICByZXR1cm4gbWVyZ2VJbnRvTm9kZSh0aGlzLCBvd25lcklELCBzaGlmdCwga2V5SGFzaCwgW2tleSwgdmFsdWVdKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgICB2YXIgaWR4ID0gMDtcbiAgICAgIGZvciAodmFyIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWR4XVswXSkpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGV4aXN0cyA9IGlkeCA8IGxlbjtcblxuICAgICAgaWYgKGV4aXN0cyA/IGVudHJpZXNbaWR4XVsxXSA9PT0gdmFsdWUgOiByZW1vdmVkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAgICAgKHJlbW92ZWQgfHwgIWV4aXN0cykgJiYgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuXG4gICAgICBpZiAocmVtb3ZlZCAmJiBsZW4gPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBlbnRyaWVzW2lkeCBeIDFdKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgICAgIHZhciBuZXdFbnRyaWVzID0gaXNFZGl0YWJsZSA/IGVudHJpZXMgOiBhcnJDb3B5KGVudHJpZXMpO1xuXG4gICAgICBpZiAoZXhpc3RzKSB7XG4gICAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgICAgaWR4ID09PSBsZW4gLSAxID8gbmV3RW50cmllcy5wb3AoKSA6IChuZXdFbnRyaWVzW2lkeF0gPSBuZXdFbnRyaWVzLnBvcCgpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNFZGl0YWJsZSkge1xuICAgICAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIG5ld0VudHJpZXMpO1xuICAgIH07XG5cblxuXG5cbiAgICBmdW5jdGlvbiBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpIHtcbiAgICAgIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLmtleUhhc2ggPSBrZXlIYXNoO1xuICAgICAgdGhpcy5lbnRyeSA9IGVudHJ5O1xuICAgIH1cblxuICAgIFZhbHVlTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiBpcyhrZXksIHRoaXMuZW50cnlbMF0pID8gdGhpcy5lbnRyeVsxXSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBWYWx1ZU5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgICAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcbiAgICAgIHZhciBrZXlNYXRjaCA9IGlzKGtleSwgdGhpcy5lbnRyeVswXSk7XG4gICAgICBpZiAoa2V5TWF0Y2ggPyB2YWx1ZSA9PT0gdGhpcy5lbnRyeVsxXSA6IHJlbW92ZWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIFNldFJlZihkaWRBbHRlcik7XG5cbiAgICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICAgICAgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgICAgIH1cblxuICAgICAgaWYgKGtleU1hdGNoKSB7XG4gICAgICAgIGlmIChvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRCkge1xuICAgICAgICAgIHRoaXMuZW50cnlbMV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gICAgICB9XG5cbiAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICAgIHJldHVybiBtZXJnZUludG9Ob2RlKHRoaXMsIG93bmVySUQsIHNoaWZ0LCBoYXNoKGtleSksIFtrZXksIHZhbHVlXSk7XG4gICAgfTtcblxuXG5cbiAgLy8gI3ByYWdtYSBJdGVyYXRvcnNcblxuICBBcnJheU1hcE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuICBIYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICAgIGZvciAodmFyIGlpID0gMCwgbWF4SW5kZXggPSBlbnRyaWVzLmxlbmd0aCAtIDE7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICBpZiAoZm4oZW50cmllc1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBCaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9XG4gIEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgIGZvciAodmFyIGlpID0gMCwgbWF4SW5kZXggPSBub2Rlcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuaXRlcmF0ZShmbiwgcmV2ZXJzZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBWYWx1ZU5vZGUucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICByZXR1cm4gZm4odGhpcy5lbnRyeSk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhNYXBJdGVyYXRvciwgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcik7XG5cbiAgICBmdW5jdGlvbiBNYXBJdGVyYXRvcihtYXAsIHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgdGhpcy5fcmV2ZXJzZSA9IHJldmVyc2U7XG4gICAgICB0aGlzLl9zdGFjayA9IG1hcC5fcm9vdCAmJiBtYXBJdGVyYXRvckZyYW1lKG1hcC5fcm9vdCk7XG4gICAgfVxuXG4gICAgTWFwSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0eXBlID0gdGhpcy5fdHlwZTtcbiAgICAgIHZhciBzdGFjayA9IHRoaXMuX3N0YWNrO1xuICAgICAgd2hpbGUgKHN0YWNrKSB7XG4gICAgICAgIHZhciBub2RlID0gc3RhY2subm9kZTtcbiAgICAgICAgdmFyIGluZGV4ID0gc3RhY2suaW5kZXgrKztcbiAgICAgICAgdmFyIG1heEluZGV4O1xuICAgICAgICBpZiAobm9kZS5lbnRyeSkge1xuICAgICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG5vZGUuZW50cmllcykge1xuICAgICAgICAgIG1heEluZGV4ID0gbm9kZS5lbnRyaWVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgaWYgKGluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgICAgICByZXR1cm4gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBub2RlLmVudHJpZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhJbmRleCA9IG5vZGUubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzdWJOb2RlID0gbm9kZS5ub2Rlc1t0aGlzLl9yZXZlcnNlID8gbWF4SW5kZXggLSBpbmRleCA6IGluZGV4XTtcbiAgICAgICAgICAgIGlmIChzdWJOb2RlKSB7XG4gICAgICAgICAgICAgIGlmIChzdWJOb2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgc3ViTm9kZS5lbnRyeSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IG1hcEl0ZXJhdG9yRnJhbWUoc3ViTm9kZSwgc3RhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN0YWNrID0gdGhpcy5fc3RhY2sgPSB0aGlzLl9zdGFjay5fX3ByZXY7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnkpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbWFwSXRlcmF0b3JGcmFtZShub2RlLCBwcmV2KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5vZGU6IG5vZGUsXG4gICAgICBpbmRleDogMCxcbiAgICAgIF9fcHJldjogcHJldlxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlTWFwKHNpemUsIHJvb3QsIG93bmVySUQsIGhhc2gpIHtcbiAgICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShNYXBQcm90b3R5cGUpO1xuICAgIG1hcC5zaXplID0gc2l6ZTtcbiAgICBtYXAuX3Jvb3QgPSByb290O1xuICAgIG1hcC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIG1hcC5fX2hhc2ggPSBoYXNoO1xuICAgIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gbWFwO1xuICB9XG5cbiAgdmFyIEVNUFRZX01BUDtcbiAgZnVuY3Rpb24gZW1wdHlNYXAoKSB7XG4gICAgcmV0dXJuIEVNUFRZX01BUCB8fCAoRU1QVFlfTUFQID0gbWFrZU1hcCgwKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVNYXAobWFwLCBrLCB2KSB7XG4gICAgdmFyIG5ld1Jvb3Q7XG4gICAgdmFyIG5ld1NpemU7XG4gICAgaWYgKCFtYXAuX3Jvb3QpIHtcbiAgICAgIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgICB9XG4gICAgICBuZXdTaXplID0gMTtcbiAgICAgIG5ld1Jvb3QgPSBuZXcgQXJyYXlNYXBOb2RlKG1hcC5fX293bmVySUQsIFtbaywgdl1dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGRpZENoYW5nZVNpemUgPSBNYWtlUmVmKENIQU5HRV9MRU5HVEgpO1xuICAgICAgdmFyIGRpZEFsdGVyID0gTWFrZVJlZihESURfQUxURVIpO1xuICAgICAgbmV3Um9vdCA9IHVwZGF0ZU5vZGUobWFwLl9yb290LCBtYXAuX19vd25lcklELCAwLCB1bmRlZmluZWQsIGssIHYsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKTtcbiAgICAgIGlmICghZGlkQWx0ZXIudmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH1cbiAgICAgIG5ld1NpemUgPSBtYXAuc2l6ZSArIChkaWRDaGFuZ2VTaXplLnZhbHVlID8gdiA9PT0gTk9UX1NFVCA/IC0xIDogMSA6IDApO1xuICAgIH1cbiAgICBpZiAobWFwLl9fb3duZXJJRCkge1xuICAgICAgbWFwLnNpemUgPSBuZXdTaXplO1xuICAgICAgbWFwLl9yb290ID0gbmV3Um9vdDtcbiAgICAgIG1hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICBtYXAuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIHJldHVybiBuZXdSb290ID8gbWFrZU1hcChuZXdTaXplLCBuZXdSb290KSA6IGVtcHR5TWFwKCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVOb2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICAgIGlmICghbm9kZSkge1xuICAgICAgaWYgKHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gICAgfVxuICAgIHJldHVybiBub2RlLnVwZGF0ZShvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNMZWFmTm9kZShub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuY29uc3RydWN0b3IgPT09IFZhbHVlTm9kZSB8fCBub2RlLmNvbnN0cnVjdG9yID09PSBIYXNoQ29sbGlzaW9uTm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGVudHJ5KSB7XG4gICAgaWYgKG5vZGUua2V5SGFzaCA9PT0ga2V5SGFzaCkge1xuICAgICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBbbm9kZS5lbnRyeSwgZW50cnldKTtcbiAgICB9XG5cbiAgICB2YXIgaWR4MSA9IChzaGlmdCA9PT0gMCA/IG5vZGUua2V5SGFzaCA6IG5vZGUua2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgICB2YXIgaWR4MiA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuXG4gICAgdmFyIG5ld05vZGU7XG4gICAgdmFyIG5vZGVzID0gaWR4MSA9PT0gaWR4MiA/XG4gICAgICBbbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBlbnRyeSldIDpcbiAgICAgICgobmV3Tm9kZSA9IG5ldyBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpKSwgaWR4MSA8IGlkeDIgPyBbbm9kZSwgbmV3Tm9kZV0gOiBbbmV3Tm9kZSwgbm9kZV0pO1xuXG4gICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCAoMSA8PCBpZHgxKSB8ICgxIDw8IGlkeDIpLCBub2Rlcyk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBvd25lcklEID0gbmV3IE93bmVySUQoKTtcbiAgICB9XG4gICAgdmFyIG5vZGUgPSBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGhhc2goa2V5KSwgW2tleSwgdmFsdWVdKTtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgZW50cmllcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaWldO1xuICAgICAgbm9kZSA9IG5vZGUudXBkYXRlKG93bmVySUQsIDAsIHVuZGVmaW5lZCwgZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIGNvdW50LCBleGNsdWRpbmcpIHtcbiAgICB2YXIgYml0bWFwID0gMDtcbiAgICB2YXIgcGFja2VkSUkgPSAwO1xuICAgIHZhciBwYWNrZWROb2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBiaXQgPSAxLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrLCBiaXQgPDw9IDEpIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbaWldO1xuICAgICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCAmJiBpaSAhPT0gZXhjbHVkaW5nKSB7XG4gICAgICAgIGJpdG1hcCB8PSBiaXQ7XG4gICAgICAgIHBhY2tlZE5vZGVzW3BhY2tlZElJKytdID0gbm9kZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBiaXRtYXAsIHBhY2tlZE5vZGVzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGluY2x1ZGluZywgbm9kZSkge1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGV4cGFuZGVkTm9kZXMgPSBuZXcgQXJyYXkoU0laRSk7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBiaXRtYXAgIT09IDA7IGlpKyssIGJpdG1hcCA+Pj49IDEpIHtcbiAgICAgIGV4cGFuZGVkTm9kZXNbaWldID0gYml0bWFwICYgMSA/IG5vZGVzW2NvdW50KytdIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgICBleHBhbmRlZE5vZGVzW2luY2x1ZGluZ10gPSBub2RlO1xuICAgIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCArIDEsIGV4cGFuZGVkTm9kZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVyZ2VJbnRvTWFwV2l0aChtYXAsIG1lcmdlciwgaXRlcmFibGVzKSB7XG4gICAgdmFyIGl0ZXJzID0gW107XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJhYmxlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZXJhYmxlc1tpaV07XG4gICAgICB2YXIgaXRlciA9IEtleWVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgaWYgKCFpc0l0ZXJhYmxlKHZhbHVlKSkge1xuICAgICAgICBpdGVyID0gaXRlci5tYXAoZnVuY3Rpb24odiApIHtyZXR1cm4gZnJvbUpTKHYpfSk7XG4gICAgICB9XG4gICAgICBpdGVycy5wdXNoKGl0ZXIpO1xuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VJbnRvQ29sbGVjdGlvbldpdGgobWFwLCBtZXJnZXIsIGl0ZXJzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlZXBNZXJnZXIobWVyZ2VyKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGV4aXN0aW5nLCB2YWx1ZSkgXG4gICAgICB7cmV0dXJuIGV4aXN0aW5nICYmIGV4aXN0aW5nLm1lcmdlRGVlcFdpdGggJiYgaXNJdGVyYWJsZSh2YWx1ZSkgP1xuICAgICAgICBleGlzdGluZy5tZXJnZURlZXBXaXRoKG1lcmdlciwgdmFsdWUpIDpcbiAgICAgICAgbWVyZ2VyID8gbWVyZ2VyKGV4aXN0aW5nLCB2YWx1ZSkgOiB2YWx1ZX07XG4gIH1cblxuICBmdW5jdGlvbiBtZXJnZUludG9Db2xsZWN0aW9uV2l0aChjb2xsZWN0aW9uLCBtZXJnZXIsIGl0ZXJzKSB7XG4gICAgaXRlcnMgPSBpdGVycy5maWx0ZXIoZnVuY3Rpb24oeCApIHtyZXR1cm4geC5zaXplICE9PSAwfSk7XG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfVxuICAgIGlmIChjb2xsZWN0aW9uLnNpemUgPT09IDAgJiYgaXRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gY29sbGVjdGlvbi5jb25zdHJ1Y3RvcihpdGVyc1swXSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24oY29sbGVjdGlvbiApIHtcbiAgICAgIHZhciBtZXJnZUludG9NYXAgPSBtZXJnZXIgP1xuICAgICAgICBmdW5jdGlvbih2YWx1ZSwga2V5KSAge1xuICAgICAgICAgIGNvbGxlY3Rpb24udXBkYXRlKGtleSwgTk9UX1NFVCwgZnVuY3Rpb24oZXhpc3RpbmcgKVxuICAgICAgICAgICAge3JldHVybiBleGlzdGluZyA9PT0gTk9UX1NFVCA/IHZhbHVlIDogbWVyZ2VyKGV4aXN0aW5nLCB2YWx1ZSl9XG4gICAgICAgICAgKTtcbiAgICAgICAgfSA6XG4gICAgICAgIGZ1bmN0aW9uKHZhbHVlLCBrZXkpICB7XG4gICAgICAgICAgY29sbGVjdGlvbi5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgaXRlcnNbaWldLmZvckVhY2gobWVyZ2VJbnRvTWFwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZUluRGVlcE1hcChleGlzdGluZywga2V5UGF0aEl0ZXIsIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gICAgdmFyIGlzTm90U2V0ID0gZXhpc3RpbmcgPT09IE5PVF9TRVQ7XG4gICAgdmFyIHN0ZXAgPSBrZXlQYXRoSXRlci5uZXh0KCk7XG4gICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgdmFyIGV4aXN0aW5nVmFsdWUgPSBpc05vdFNldCA/IG5vdFNldFZhbHVlIDogZXhpc3Rpbmc7XG4gICAgICB2YXIgbmV3VmFsdWUgPSB1cGRhdGVyKGV4aXN0aW5nVmFsdWUpO1xuICAgICAgcmV0dXJuIG5ld1ZhbHVlID09PSBleGlzdGluZ1ZhbHVlID8gZXhpc3RpbmcgOiBuZXdWYWx1ZTtcbiAgICB9XG4gICAgaW52YXJpYW50KFxuICAgICAgaXNOb3RTZXQgfHwgKGV4aXN0aW5nICYmIGV4aXN0aW5nLnNldCksXG4gICAgICAnaW52YWxpZCBrZXlQYXRoJ1xuICAgICk7XG4gICAgdmFyIGtleSA9IHN0ZXAudmFsdWU7XG4gICAgdmFyIG5leHRFeGlzdGluZyA9IGlzTm90U2V0ID8gTk9UX1NFVCA6IGV4aXN0aW5nLmdldChrZXksIE5PVF9TRVQpO1xuICAgIHZhciBuZXh0VXBkYXRlZCA9IHVwZGF0ZUluRGVlcE1hcChcbiAgICAgIG5leHRFeGlzdGluZyxcbiAgICAgIGtleVBhdGhJdGVyLFxuICAgICAgbm90U2V0VmFsdWUsXG4gICAgICB1cGRhdGVyXG4gICAgKTtcbiAgICByZXR1cm4gbmV4dFVwZGF0ZWQgPT09IG5leHRFeGlzdGluZyA/IGV4aXN0aW5nIDpcbiAgICAgIG5leHRVcGRhdGVkID09PSBOT1RfU0VUID8gZXhpc3RpbmcucmVtb3ZlKGtleSkgOlxuICAgICAgKGlzTm90U2V0ID8gZW1wdHlNYXAoKSA6IGV4aXN0aW5nKS5zZXQoa2V5LCBuZXh0VXBkYXRlZCk7XG4gIH1cblxuICBmdW5jdGlvbiBwb3BDb3VudCh4KSB7XG4gICAgeCA9IHggLSAoKHggPj4gMSkgJiAweDU1NTU1NTU1KTtcbiAgICB4ID0gKHggJiAweDMzMzMzMzMzKSArICgoeCA+PiAyKSAmIDB4MzMzMzMzMzMpO1xuICAgIHggPSAoeCArICh4ID4+IDQpKSAmIDB4MGYwZjBmMGY7XG4gICAgeCA9IHggKyAoeCA+PiA4KTtcbiAgICB4ID0geCArICh4ID4+IDE2KTtcbiAgICByZXR1cm4geCAmIDB4N2Y7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRJbihhcnJheSwgaWR4LCB2YWwsIGNhbkVkaXQpIHtcbiAgICB2YXIgbmV3QXJyYXkgPSBjYW5FZGl0ID8gYXJyYXkgOiBhcnJDb3B5KGFycmF5KTtcbiAgICBuZXdBcnJheVtpZHhdID0gdmFsO1xuICAgIHJldHVybiBuZXdBcnJheTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwbGljZUluKGFycmF5LCBpZHgsIHZhbCwgY2FuRWRpdCkge1xuICAgIHZhciBuZXdMZW4gPSBhcnJheS5sZW5ndGggKyAxO1xuICAgIGlmIChjYW5FZGl0ICYmIGlkeCArIDEgPT09IG5ld0xlbikge1xuICAgICAgYXJyYXlbaWR4XSA9IHZhbDtcbiAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG4gICAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG4gICAgdmFyIGFmdGVyID0gMDtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbmV3TGVuOyBpaSsrKSB7XG4gICAgICBpZiAoaWkgPT09IGlkeCkge1xuICAgICAgICBuZXdBcnJheVtpaV0gPSB2YWw7XG4gICAgICAgIGFmdGVyID0gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0FycmF5O1xuICB9XG5cbiAgZnVuY3Rpb24gc3BsaWNlT3V0KGFycmF5LCBpZHgsIGNhbkVkaXQpIHtcbiAgICB2YXIgbmV3TGVuID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgICBpZiAoY2FuRWRpdCAmJiBpZHggPT09IG5ld0xlbikge1xuICAgICAgYXJyYXkucG9wKCk7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfVxuICAgIHZhciBuZXdBcnJheSA9IG5ldyBBcnJheShuZXdMZW4pO1xuICAgIHZhciBhZnRlciA9IDA7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG5ld0xlbjsgaWkrKykge1xuICAgICAgaWYgKGlpID09PSBpZHgpIHtcbiAgICAgICAgYWZ0ZXIgPSAxO1xuICAgICAgfVxuICAgICAgbmV3QXJyYXlbaWldID0gYXJyYXlbaWkgKyBhZnRlcl07XG4gICAgfVxuICAgIHJldHVybiBuZXdBcnJheTtcbiAgfVxuXG4gIHZhciBNQVhfQVJSQVlfTUFQX1NJWkUgPSBTSVpFIC8gNDtcbiAgdmFyIE1BWF9CSVRNQVBfSU5ERVhFRF9TSVpFID0gU0laRSAvIDI7XG4gIHZhciBNSU5fSEFTSF9BUlJBWV9NQVBfU0laRSA9IFNJWkUgLyA0O1xuXG4gIGNyZWF0ZUNsYXNzKExpc3QsIEluZGV4ZWRDb2xsZWN0aW9uKTtcblxuICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cbiAgICBmdW5jdGlvbiBMaXN0KHZhbHVlKSB7XG4gICAgICB2YXIgZW1wdHkgPSBlbXB0eUxpc3QoKTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBlbXB0eTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0xpc3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHZhciBpdGVyID0gSW5kZXhlZEl0ZXJhYmxlKHZhbHVlKTtcbiAgICAgIHZhciBzaXplID0gaXRlci5zaXplO1xuICAgICAgaWYgKHNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5O1xuICAgICAgfVxuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoc2l6ZSk7XG4gICAgICBpZiAoc2l6ZSA+IDAgJiYgc2l6ZSA8IFNJWkUpIHtcbiAgICAgICAgcmV0dXJuIG1ha2VMaXN0KDAsIHNpemUsIFNISUZULCBudWxsLCBuZXcgVk5vZGUoaXRlci50b0FycmF5KCkpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGxpc3QgKSB7XG4gICAgICAgIGxpc3Quc2V0U2l6ZShzaXplKTtcbiAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uKHYsIGkpICB7cmV0dXJuIGxpc3Quc2V0KGksIHYpfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBMaXN0Lm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ0xpc3QgWycsICddJyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gdGhpcy5zaXplKSB7XG4gICAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGluZGV4ICs9IHRoaXMuX29yaWdpbjtcbiAgICAgIHZhciBub2RlID0gbGlzdE5vZGVGb3IodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5hcnJheVtpbmRleCAmIE1BU0tdO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgTGlzdC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oaW5kZXgsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdXBkYXRlTGlzdCh0aGlzLCBpbmRleCwgdmFsdWUpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihpbmRleCkge1xuICAgICAgcmV0dXJuICF0aGlzLmhhcyhpbmRleCkgPyB0aGlzIDpcbiAgICAgICAgaW5kZXggPT09IDAgPyB0aGlzLnNoaWZ0KCkgOlxuICAgICAgICBpbmRleCA9PT0gdGhpcy5zaXplIC0gMSA/IHRoaXMucG9wKCkgOlxuICAgICAgICB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX29yaWdpbiA9IHRoaXMuX2NhcGFjaXR5ID0gMDtcbiAgICAgICAgdGhpcy5fbGV2ZWwgPSBTSElGVDtcbiAgICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3RhaWwgPSBudWxsO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBlbXB0eUxpc3QoKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG4gICAgICB2YXIgb2xkU2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAwLCBvbGRTaXplICsgdmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgbGlzdC5zZXQob2xkU2l6ZSArIGlpLCB2YWx1ZXNbaWldKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMCwgLTEpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgdmFyIHZhbHVlcyA9IGFyZ3VtZW50cztcbiAgICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24obGlzdCApIHtcbiAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAtdmFsdWVzLmxlbmd0aCk7XG4gICAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgICAgbGlzdC5zZXQoaWksIHZhbHVlc1tpaV0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDEpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cbiAgICBMaXN0LnByb3RvdHlwZS5tZXJnZSA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUubWVyZ2VXaXRoID0gZnVuY3Rpb24obWVyZ2VyKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICByZXR1cm4gbWVyZ2VJbnRvTGlzdFdpdGgodGhpcywgbWVyZ2VyLCBpdGVycyk7XG4gICAgfTtcblxuICAgIExpc3QucHJvdG90eXBlLm1lcmdlRGVlcCA9IGZ1bmN0aW9uKC8qLi4uaXRlcnMqLykge1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIGRlZXBNZXJnZXIodW5kZWZpbmVkKSwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgTGlzdC5wcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIG1lcmdlSW50b0xpc3RXaXRoKHRoaXMsIGRlZXBNZXJnZXIobWVyZ2VyKSwgaXRlcnMpO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24oc2l6ZSkge1xuICAgICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMCwgc2l6ZSk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgSXRlcmF0aW9uXG5cbiAgICBMaXN0LnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyhcbiAgICAgICAgdGhpcyxcbiAgICAgICAgcmVzb2x2ZUJlZ2luKGJlZ2luLCBzaXplKSxcbiAgICAgICAgcmVzb2x2ZUVuZChlbmQsIHNpemUpXG4gICAgICApO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICAgIHJldHVybiBuZXcgc3JjX0l0ZXJhdG9yX19JdGVyYXRvcihmdW5jdGlvbigpICB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlcygpO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IERPTkUgP1xuICAgICAgICAgIGl0ZXJhdG9yRG9uZSgpIDpcbiAgICAgICAgICBpdGVyYXRvclZhbHVlKHR5cGUsIGluZGV4KyssIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICAgIHZhciB2YWx1ZTtcbiAgICAgIHdoaWxlICgodmFsdWUgPSB2YWx1ZXMoKSkgIT09IERPTkUpIHtcbiAgICAgICAgaWYgKGZuKHZhbHVlLCBpbmRleCsrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH07XG5cbiAgICBMaXN0LnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24ob3duZXJJRCkge1xuICAgICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZUxpc3QodGhpcy5fb3JpZ2luLCB0aGlzLl9jYXBhY2l0eSwgdGhpcy5fbGV2ZWwsIHRoaXMuX3Jvb3QsIHRoaXMuX3RhaWwsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNMaXN0KG1heWJlTGlzdCkge1xuICAgIHJldHVybiAhIShtYXliZUxpc3QgJiYgbWF5YmVMaXN0W0lTX0xJU1RfU0VOVElORUxdKTtcbiAgfVxuXG4gIExpc3QuaXNMaXN0ID0gaXNMaXN0O1xuXG4gIHZhciBJU19MSVNUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfTElTVF9fQEAnO1xuXG4gIHZhciBMaXN0UHJvdG90eXBlID0gTGlzdC5wcm90b3R5cGU7XG4gIExpc3RQcm90b3R5cGVbSVNfTElTVF9TRU5USU5FTF0gPSB0cnVlO1xuICBMaXN0UHJvdG90eXBlW0RFTEVURV0gPSBMaXN0UHJvdG90eXBlLnJlbW92ZTtcbiAgTGlzdFByb3RvdHlwZS5zZXRJbiA9IE1hcFByb3RvdHlwZS5zZXRJbjtcbiAgTGlzdFByb3RvdHlwZS5kZWxldGVJbiA9XG4gIExpc3RQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUucmVtb3ZlSW47XG4gIExpc3RQcm90b3R5cGUudXBkYXRlID0gTWFwUHJvdG90eXBlLnVwZGF0ZTtcbiAgTGlzdFByb3RvdHlwZS51cGRhdGVJbiA9IE1hcFByb3RvdHlwZS51cGRhdGVJbjtcbiAgTGlzdFByb3RvdHlwZS5tZXJnZUluID0gTWFwUHJvdG90eXBlLm1lcmdlSW47XG4gIExpc3RQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VEZWVwSW47XG4gIExpc3RQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBMaXN0UHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIExpc3RQcm90b3R5cGUuYXNJbW11dGFibGUgPSBNYXBQcm90b3R5cGUuYXNJbW11dGFibGU7XG4gIExpc3RQcm90b3R5cGUud2FzQWx0ZXJlZCA9IE1hcFByb3RvdHlwZS53YXNBbHRlcmVkO1xuXG5cblxuICAgIGZ1bmN0aW9uIFZOb2RlKGFycmF5LCBvd25lcklEKSB7XG4gICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICAgIH1cblxuICAgIC8vIFRPRE86IHNlZW1zIGxpa2UgdGhlc2UgbWV0aG9kcyBhcmUgdmVyeSBzaW1pbGFyXG5cbiAgICBWTm9kZS5wcm90b3R5cGUucmVtb3ZlQmVmb3JlID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxldmVsID8gMSA8PCBsZXZlbCA6IDAgfHwgdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgb3JpZ2luSW5kZXggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBpZiAob3JpZ2luSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWTm9kZShbXSwgb3duZXJJRCk7XG4gICAgICB9XG4gICAgICB2YXIgcmVtb3ZpbmdGaXJzdCA9IG9yaWdpbkluZGV4ID09PSAwO1xuICAgICAgdmFyIG5ld0NoaWxkO1xuICAgICAgaWYgKGxldmVsID4gMCkge1xuICAgICAgICB2YXIgb2xkQ2hpbGQgPSB0aGlzLmFycmF5W29yaWdpbkluZGV4XTtcbiAgICAgICAgbmV3Q2hpbGQgPSBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVCZWZvcmUob3duZXJJRCwgbGV2ZWwgLSBTSElGVCwgaW5kZXgpO1xuICAgICAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nRmlyc3QpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlbW92aW5nRmlyc3QgJiYgIW5ld0NoaWxkKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgICAgIGlmICghcmVtb3ZpbmdGaXJzdCkge1xuICAgICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb3JpZ2luSW5kZXg7IGlpKyspIHtcbiAgICAgICAgICBlZGl0YWJsZS5hcnJheVtpaV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuZXdDaGlsZCkge1xuICAgICAgICBlZGl0YWJsZS5hcnJheVtvcmlnaW5JbmRleF0gPSBuZXdDaGlsZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBlZGl0YWJsZTtcbiAgICB9O1xuXG4gICAgVk5vZGUucHJvdG90eXBlLnJlbW92ZUFmdGVyID0gZnVuY3Rpb24ob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gICAgICBpZiAoaW5kZXggPT09IGxldmVsID8gMSA8PCBsZXZlbCA6IDAgfHwgdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgc2l6ZUluZGV4ID0gKChpbmRleCAtIDEpID4+PiBsZXZlbCkgJiBNQVNLO1xuICAgICAgaWYgKHNpemVJbmRleCA+PSB0aGlzLmFycmF5Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciByZW1vdmluZ0xhc3QgPSBzaXplSW5kZXggPT09IHRoaXMuYXJyYXkubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBuZXdDaGlsZDtcbiAgICAgIGlmIChsZXZlbCA+IDApIHtcbiAgICAgICAgdmFyIG9sZENoaWxkID0gdGhpcy5hcnJheVtzaXplSW5kZXhdO1xuICAgICAgICBuZXdDaGlsZCA9IG9sZENoaWxkICYmIG9sZENoaWxkLnJlbW92ZUFmdGVyKG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4KTtcbiAgICAgICAgaWYgKG5ld0NoaWxkID09PSBvbGRDaGlsZCAmJiByZW1vdmluZ0xhc3QpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHJlbW92aW5nTGFzdCAmJiAhbmV3Q2hpbGQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgZWRpdGFibGUgPSBlZGl0YWJsZVZOb2RlKHRoaXMsIG93bmVySUQpO1xuICAgICAgaWYgKCFyZW1vdmluZ0xhc3QpIHtcbiAgICAgICAgZWRpdGFibGUuYXJyYXkucG9wKCk7XG4gICAgICB9XG4gICAgICBpZiAobmV3Q2hpbGQpIHtcbiAgICAgICAgZWRpdGFibGUuYXJyYXlbc2l6ZUluZGV4XSA9IG5ld0NoaWxkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVkaXRhYmxlO1xuICAgIH07XG5cblxuXG4gIHZhciBET05FID0ge307XG5cbiAgZnVuY3Rpb24gaXRlcmF0ZUxpc3QobGlzdCwgcmV2ZXJzZSkge1xuICAgIHZhciBsZWZ0ID0gbGlzdC5fb3JpZ2luO1xuICAgIHZhciByaWdodCA9IGxpc3QuX2NhcGFjaXR5O1xuICAgIHZhciB0YWlsUG9zID0gZ2V0VGFpbE9mZnNldChyaWdodCk7XG4gICAgdmFyIHRhaWwgPSBsaXN0Ll90YWlsO1xuXG4gICAgcmV0dXJuIGl0ZXJhdGVOb2RlT3JMZWFmKGxpc3QuX3Jvb3QsIGxpc3QuX2xldmVsLCAwKTtcblxuICAgIGZ1bmN0aW9uIGl0ZXJhdGVOb2RlT3JMZWFmKG5vZGUsIGxldmVsLCBvZmZzZXQpIHtcbiAgICAgIHJldHVybiBsZXZlbCA9PT0gMCA/XG4gICAgICAgIGl0ZXJhdGVMZWFmKG5vZGUsIG9mZnNldCkgOlxuICAgICAgICBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpdGVyYXRlTGVhZihub2RlLCBvZmZzZXQpIHtcbiAgICAgIHZhciBhcnJheSA9IG9mZnNldCA9PT0gdGFpbFBvcyA/IHRhaWwgJiYgdGFpbC5hcnJheSA6IG5vZGUgJiYgbm9kZS5hcnJheTtcbiAgICAgIHZhciBmcm9tID0gb2Zmc2V0ID4gbGVmdCA/IDAgOiBsZWZ0IC0gb2Zmc2V0O1xuICAgICAgdmFyIHRvID0gcmlnaHQgLSBvZmZzZXQ7XG4gICAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICAgIHRvID0gU0laRTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbigpICB7XG4gICAgICAgIGlmIChmcm9tID09PSB0bykge1xuICAgICAgICAgIHJldHVybiBET05FO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZHggPSByZXZlcnNlID8gLS10byA6IGZyb20rKztcbiAgICAgICAgcmV0dXJuIGFycmF5ICYmIGFycmF5W2lkeF07XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGl0ZXJhdGVOb2RlKG5vZGUsIGxldmVsLCBvZmZzZXQpIHtcbiAgICAgIHZhciB2YWx1ZXM7XG4gICAgICB2YXIgYXJyYXkgPSBub2RlICYmIG5vZGUuYXJyYXk7XG4gICAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogKGxlZnQgLSBvZmZzZXQpID4+IGxldmVsO1xuICAgICAgdmFyIHRvID0gKChyaWdodCAtIG9mZnNldCkgPj4gbGV2ZWwpICsgMTtcbiAgICAgIGlmICh0byA+IFNJWkUpIHtcbiAgICAgICAgdG8gPSBTSVpFO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlcygpO1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBET05FKSB7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmcm9tID09PSB0bykge1xuICAgICAgICAgICAgcmV0dXJuIERPTkU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciBpZHggPSByZXZlcnNlID8gLS10byA6IGZyb20rKztcbiAgICAgICAgICB2YWx1ZXMgPSBpdGVyYXRlTm9kZU9yTGVhZihcbiAgICAgICAgICAgIGFycmF5ICYmIGFycmF5W2lkeF0sIGxldmVsIC0gU0hJRlQsIG9mZnNldCArIChpZHggPDwgbGV2ZWwpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1ha2VMaXN0KG9yaWdpbiwgY2FwYWNpdHksIGxldmVsLCByb290LCB0YWlsLCBvd25lcklELCBoYXNoKSB7XG4gICAgdmFyIGxpc3QgPSBPYmplY3QuY3JlYXRlKExpc3RQcm90b3R5cGUpO1xuICAgIGxpc3Quc2l6ZSA9IGNhcGFjaXR5IC0gb3JpZ2luO1xuICAgIGxpc3QuX29yaWdpbiA9IG9yaWdpbjtcbiAgICBsaXN0Ll9jYXBhY2l0eSA9IGNhcGFjaXR5O1xuICAgIGxpc3QuX2xldmVsID0gbGV2ZWw7XG4gICAgbGlzdC5fcm9vdCA9IHJvb3Q7XG4gICAgbGlzdC5fdGFpbCA9IHRhaWw7XG4gICAgbGlzdC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIGxpc3QuX19oYXNoID0gaGFzaDtcbiAgICBsaXN0Ll9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgdmFyIEVNUFRZX0xJU1Q7XG4gIGZ1bmN0aW9uIGVtcHR5TGlzdCgpIHtcbiAgICByZXR1cm4gRU1QVFlfTElTVCB8fCAoRU1QVFlfTElTVCA9IG1ha2VMaXN0KDAsIDAsIFNISUZUKSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVMaXN0KGxpc3QsIGluZGV4LCB2YWx1ZSkge1xuICAgIGluZGV4ID0gd3JhcEluZGV4KGxpc3QsIGluZGV4KTtcblxuICAgIGlmIChpbmRleCA+PSBsaXN0LnNpemUgfHwgaW5kZXggPCAwKSB7XG4gICAgICByZXR1cm4gbGlzdC53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKGxpc3QgKSB7XG4gICAgICAgIGluZGV4IDwgMCA/XG4gICAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCBpbmRleCkuc2V0KDAsIHZhbHVlKSA6XG4gICAgICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAwLCBpbmRleCArIDEpLnNldChpbmRleCwgdmFsdWUpXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpbmRleCArPSBsaXN0Ll9vcmlnaW47XG5cbiAgICB2YXIgbmV3VGFpbCA9IGxpc3QuX3RhaWw7XG4gICAgdmFyIG5ld1Jvb3QgPSBsaXN0Ll9yb290O1xuICAgIHZhciBkaWRBbHRlciA9IE1ha2VSZWYoRElEX0FMVEVSKTtcbiAgICBpZiAoaW5kZXggPj0gZ2V0VGFpbE9mZnNldChsaXN0Ll9jYXBhY2l0eSkpIHtcbiAgICAgIG5ld1RhaWwgPSB1cGRhdGVWTm9kZShuZXdUYWlsLCBsaXN0Ll9fb3duZXJJRCwgMCwgaW5kZXgsIHZhbHVlLCBkaWRBbHRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1Jvb3QgPSB1cGRhdGVWTm9kZShuZXdSb290LCBsaXN0Ll9fb3duZXJJRCwgbGlzdC5fbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpO1xuICAgIH1cblxuICAgIGlmICghZGlkQWx0ZXIudmFsdWUpIHtcbiAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cblxuICAgIGlmIChsaXN0Ll9fb3duZXJJRCkge1xuICAgICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICAgIGxpc3QuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuICAgIHJldHVybiBtYWtlTGlzdChsaXN0Ll9vcmlnaW4sIGxpc3QuX2NhcGFjaXR5LCBsaXN0Ll9sZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWTm9kZShub2RlLCBvd25lcklELCBsZXZlbCwgaW5kZXgsIHZhbHVlLCBkaWRBbHRlcikge1xuICAgIHZhciBpZHggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgdmFyIG5vZGVIYXMgPSBub2RlICYmIGlkeCA8IG5vZGUuYXJyYXkubGVuZ3RoO1xuICAgIGlmICghbm9kZUhhcyAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICB2YXIgbmV3Tm9kZTtcblxuICAgIGlmIChsZXZlbCA+IDApIHtcbiAgICAgIHZhciBsb3dlck5vZGUgPSBub2RlICYmIG5vZGUuYXJyYXlbaWR4XTtcbiAgICAgIHZhciBuZXdMb3dlck5vZGUgPSB1cGRhdGVWTm9kZShsb3dlck5vZGUsIG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpO1xuICAgICAgaWYgKG5ld0xvd2VyTm9kZSA9PT0gbG93ZXJOb2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgICAgbmV3Tm9kZSA9IGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCk7XG4gICAgICBuZXdOb2RlLmFycmF5W2lkeF0gPSBuZXdMb3dlck5vZGU7XG4gICAgICByZXR1cm4gbmV3Tm9kZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZUhhcyAmJiBub2RlLmFycmF5W2lkeF0gPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG5cbiAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuXG4gICAgbmV3Tm9kZSA9IGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCk7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgaWR4ID09PSBuZXdOb2RlLmFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIG5ld05vZGUuYXJyYXkucG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld05vZGUuYXJyYXlbaWR4XSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCkge1xuICAgIGlmIChvd25lcklEICYmIG5vZGUgJiYgb3duZXJJRCA9PT0gbm9kZS5vd25lcklEKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWTm9kZShub2RlID8gbm9kZS5hcnJheS5zbGljZSgpIDogW10sIG93bmVySUQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlzdE5vZGVGb3IobGlzdCwgcmF3SW5kZXgpIHtcbiAgICBpZiAocmF3SW5kZXggPj0gZ2V0VGFpbE9mZnNldChsaXN0Ll9jYXBhY2l0eSkpIHtcbiAgICAgIHJldHVybiBsaXN0Ll90YWlsO1xuICAgIH1cbiAgICBpZiAocmF3SW5kZXggPCAxIDw8IChsaXN0Ll9sZXZlbCArIFNISUZUKSkge1xuICAgICAgdmFyIG5vZGUgPSBsaXN0Ll9yb290O1xuICAgICAgdmFyIGxldmVsID0gbGlzdC5fbGV2ZWw7XG4gICAgICB3aGlsZSAobm9kZSAmJiBsZXZlbCA+IDApIHtcbiAgICAgICAgbm9kZSA9IG5vZGUuYXJyYXlbKHJhd0luZGV4ID4+PiBsZXZlbCkgJiBNQVNLXTtcbiAgICAgICAgbGV2ZWwgLT0gU0hJRlQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzZXRMaXN0Qm91bmRzKGxpc3QsIGJlZ2luLCBlbmQpIHtcbiAgICB2YXIgb3duZXIgPSBsaXN0Ll9fb3duZXJJRCB8fCBuZXcgT3duZXJJRCgpO1xuICAgIHZhciBvbGRPcmlnaW4gPSBsaXN0Ll9vcmlnaW47XG4gICAgdmFyIG9sZENhcGFjaXR5ID0gbGlzdC5fY2FwYWNpdHk7XG4gICAgdmFyIG5ld09yaWdpbiA9IG9sZE9yaWdpbiArIGJlZ2luO1xuICAgIHZhciBuZXdDYXBhY2l0eSA9IGVuZCA9PT0gdW5kZWZpbmVkID8gb2xkQ2FwYWNpdHkgOiBlbmQgPCAwID8gb2xkQ2FwYWNpdHkgKyBlbmQgOiBvbGRPcmlnaW4gKyBlbmQ7XG4gICAgaWYgKG5ld09yaWdpbiA9PT0gb2xkT3JpZ2luICYmIG5ld0NhcGFjaXR5ID09PSBvbGRDYXBhY2l0eSkge1xuICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxuXG4gICAgLy8gSWYgaXQncyBnb2luZyB0byBlbmQgYWZ0ZXIgaXQgc3RhcnRzLCBpdCdzIGVtcHR5LlxuICAgIGlmIChuZXdPcmlnaW4gPj0gbmV3Q2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiBsaXN0LmNsZWFyKCk7XG4gICAgfVxuXG4gICAgdmFyIG5ld0xldmVsID0gbGlzdC5fbGV2ZWw7XG4gICAgdmFyIG5ld1Jvb3QgPSBsaXN0Ll9yb290O1xuXG4gICAgLy8gTmV3IG9yaWdpbiBtaWdodCByZXF1aXJlIGNyZWF0aW5nIGEgaGlnaGVyIHJvb3QuXG4gICAgdmFyIG9mZnNldFNoaWZ0ID0gMDtcbiAgICB3aGlsZSAobmV3T3JpZ2luICsgb2Zmc2V0U2hpZnQgPCAwKSB7XG4gICAgICBuZXdSb290ID0gbmV3IFZOb2RlKG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbdW5kZWZpbmVkLCBuZXdSb290XSA6IFtdLCBvd25lcik7XG4gICAgICBuZXdMZXZlbCArPSBTSElGVDtcbiAgICAgIG9mZnNldFNoaWZ0ICs9IDEgPDwgbmV3TGV2ZWw7XG4gICAgfVxuICAgIGlmIChvZmZzZXRTaGlmdCkge1xuICAgICAgbmV3T3JpZ2luICs9IG9mZnNldFNoaWZ0O1xuICAgICAgb2xkT3JpZ2luICs9IG9mZnNldFNoaWZ0O1xuICAgICAgbmV3Q2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG4gICAgICBvbGRDYXBhY2l0eSArPSBvZmZzZXRTaGlmdDtcbiAgICB9XG5cbiAgICB2YXIgb2xkVGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQob2xkQ2FwYWNpdHkpO1xuICAgIHZhciBuZXdUYWlsT2Zmc2V0ID0gZ2V0VGFpbE9mZnNldChuZXdDYXBhY2l0eSk7XG5cbiAgICAvLyBOZXcgc2l6ZSBtaWdodCByZXF1aXJlIGNyZWF0aW5nIGEgaGlnaGVyIHJvb3QuXG4gICAgd2hpbGUgKG5ld1RhaWxPZmZzZXQgPj0gMSA8PCAobmV3TGV2ZWwgKyBTSElGVCkpIHtcbiAgICAgIG5ld1Jvb3QgPSBuZXcgVk5vZGUobmV3Um9vdCAmJiBuZXdSb290LmFycmF5Lmxlbmd0aCA/IFtuZXdSb290XSA6IFtdLCBvd25lcik7XG4gICAgICBuZXdMZXZlbCArPSBTSElGVDtcbiAgICB9XG5cbiAgICAvLyBMb2NhdGUgb3IgY3JlYXRlIHRoZSBuZXcgdGFpbC5cbiAgICB2YXIgb2xkVGFpbCA9IGxpc3QuX3RhaWw7XG4gICAgdmFyIG5ld1RhaWwgPSBuZXdUYWlsT2Zmc2V0IDwgb2xkVGFpbE9mZnNldCA/XG4gICAgICBsaXN0Tm9kZUZvcihsaXN0LCBuZXdDYXBhY2l0eSAtIDEpIDpcbiAgICAgIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ID8gbmV3IFZOb2RlKFtdLCBvd25lcikgOiBvbGRUYWlsO1xuXG4gICAgLy8gTWVyZ2UgVGFpbCBpbnRvIHRyZWUuXG4gICAgaWYgKG9sZFRhaWwgJiYgbmV3VGFpbE9mZnNldCA+IG9sZFRhaWxPZmZzZXQgJiYgbmV3T3JpZ2luIDwgb2xkQ2FwYWNpdHkgJiYgb2xkVGFpbC5hcnJheS5sZW5ndGgpIHtcbiAgICAgIG5ld1Jvb3QgPSBlZGl0YWJsZVZOb2RlKG5ld1Jvb3QsIG93bmVyKTtcbiAgICAgIHZhciBub2RlID0gbmV3Um9vdDtcbiAgICAgIGZvciAodmFyIGxldmVsID0gbmV3TGV2ZWw7IGxldmVsID4gU0hJRlQ7IGxldmVsIC09IFNISUZUKSB7XG4gICAgICAgIHZhciBpZHggPSAob2xkVGFpbE9mZnNldCA+Pj4gbGV2ZWwpICYgTUFTSztcbiAgICAgICAgbm9kZSA9IG5vZGUuYXJyYXlbaWR4XSA9IGVkaXRhYmxlVk5vZGUobm9kZS5hcnJheVtpZHhdLCBvd25lcik7XG4gICAgICB9XG4gICAgICBub2RlLmFycmF5WyhvbGRUYWlsT2Zmc2V0ID4+PiBTSElGVCkgJiBNQVNLXSA9IG9sZFRhaWw7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHNpemUgaGFzIGJlZW4gcmVkdWNlZCwgdGhlcmUncyBhIGNoYW5jZSB0aGUgdGFpbCBuZWVkcyB0byBiZSB0cmltbWVkLlxuICAgIGlmIChuZXdDYXBhY2l0eSA8IG9sZENhcGFjaXR5KSB7XG4gICAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUFmdGVyKG93bmVyLCAwLCBuZXdDYXBhY2l0eSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIG5ldyBvcmlnaW4gaXMgd2l0aGluIHRoZSB0YWlsLCB0aGVuIHdlIGRvIG5vdCBuZWVkIGEgcm9vdC5cbiAgICBpZiAobmV3T3JpZ2luID49IG5ld1RhaWxPZmZzZXQpIHtcbiAgICAgIG5ld09yaWdpbiAtPSBuZXdUYWlsT2Zmc2V0O1xuICAgICAgbmV3Q2FwYWNpdHkgLT0gbmV3VGFpbE9mZnNldDtcbiAgICAgIG5ld0xldmVsID0gU0hJRlQ7XG4gICAgICBuZXdSb290ID0gbnVsbDtcbiAgICAgIG5ld1RhaWwgPSBuZXdUYWlsICYmIG5ld1RhaWwucmVtb3ZlQmVmb3JlKG93bmVyLCAwLCBuZXdPcmlnaW4pO1xuXG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgcm9vdCBoYXMgYmVlbiB0cmltbWVkLCBnYXJiYWdlIGNvbGxlY3QuXG4gICAgfSBlbHNlIGlmIChuZXdPcmlnaW4gPiBvbGRPcmlnaW4gfHwgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQpIHtcbiAgICAgIG9mZnNldFNoaWZ0ID0gMDtcblxuICAgICAgLy8gSWRlbnRpZnkgdGhlIG5ldyB0b3Agcm9vdCBub2RlIG9mIHRoZSBzdWJ0cmVlIG9mIHRoZSBvbGQgcm9vdC5cbiAgICAgIHdoaWxlIChuZXdSb290KSB7XG4gICAgICAgIHZhciBiZWdpbkluZGV4ID0gKG5ld09yaWdpbiA+Pj4gbmV3TGV2ZWwpICYgTUFTSztcbiAgICAgICAgaWYgKGJlZ2luSW5kZXggIT09IChuZXdUYWlsT2Zmc2V0ID4+PiBuZXdMZXZlbCkgJiBNQVNLKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJlZ2luSW5kZXgpIHtcbiAgICAgICAgICBvZmZzZXRTaGlmdCArPSAoMSA8PCBuZXdMZXZlbCkgKiBiZWdpbkluZGV4O1xuICAgICAgICB9XG4gICAgICAgIG5ld0xldmVsIC09IFNISUZUO1xuICAgICAgICBuZXdSb290ID0gbmV3Um9vdC5hcnJheVtiZWdpbkluZGV4XTtcbiAgICAgIH1cblxuICAgICAgLy8gVHJpbSB0aGUgbmV3IHNpZGVzIG9mIHRoZSBuZXcgcm9vdC5cbiAgICAgIGlmIChuZXdSb290ICYmIG5ld09yaWdpbiA+IG9sZE9yaWdpbikge1xuICAgICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVCZWZvcmUob3duZXIsIG5ld0xldmVsLCBuZXdPcmlnaW4gLSBvZmZzZXRTaGlmdCk7XG4gICAgICB9XG4gICAgICBpZiAobmV3Um9vdCAmJiBuZXdUYWlsT2Zmc2V0IDwgb2xkVGFpbE9mZnNldCkge1xuICAgICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVBZnRlcihvd25lciwgbmV3TGV2ZWwsIG5ld1RhaWxPZmZzZXQgLSBvZmZzZXRTaGlmdCk7XG4gICAgICB9XG4gICAgICBpZiAob2Zmc2V0U2hpZnQpIHtcbiAgICAgICAgbmV3T3JpZ2luIC09IG9mZnNldFNoaWZ0O1xuICAgICAgICBuZXdDYXBhY2l0eSAtPSBvZmZzZXRTaGlmdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobGlzdC5fX293bmVySUQpIHtcbiAgICAgIGxpc3Quc2l6ZSA9IG5ld0NhcGFjaXR5IC0gbmV3T3JpZ2luO1xuICAgICAgbGlzdC5fb3JpZ2luID0gbmV3T3JpZ2luO1xuICAgICAgbGlzdC5fY2FwYWNpdHkgPSBuZXdDYXBhY2l0eTtcbiAgICAgIGxpc3QuX2xldmVsID0gbmV3TGV2ZWw7XG4gICAgICBsaXN0Ll9yb290ID0gbmV3Um9vdDtcbiAgICAgIGxpc3QuX3RhaWwgPSBuZXdUYWlsO1xuICAgICAgbGlzdC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICBsaXN0Ll9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VMaXN0KG5ld09yaWdpbiwgbmV3Q2FwYWNpdHksIG5ld0xldmVsLCBuZXdSb290LCBuZXdUYWlsKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlSW50b0xpc3RXaXRoKGxpc3QsIG1lcmdlciwgaXRlcmFibGVzKSB7XG4gICAgdmFyIGl0ZXJzID0gW107XG4gICAgdmFyIG1heFNpemUgPSAwO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVyYWJsZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBpdGVyYWJsZXNbaWldO1xuICAgICAgdmFyIGl0ZXIgPSBJbmRleGVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgaWYgKGl0ZXIuc2l6ZSA+IG1heFNpemUpIHtcbiAgICAgICAgbWF4U2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICAgIH1cbiAgICAgIGlmICghaXNJdGVyYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgaXRlciA9IGl0ZXIubWFwKGZ1bmN0aW9uKHYgKSB7cmV0dXJuIGZyb21KUyh2KX0pO1xuICAgICAgfVxuICAgICAgaXRlcnMucHVzaChpdGVyKTtcbiAgICB9XG4gICAgaWYgKG1heFNpemUgPiBsaXN0LnNpemUpIHtcbiAgICAgIGxpc3QgPSBsaXN0LnNldFNpemUobWF4U2l6ZSk7XG4gICAgfVxuICAgIHJldHVybiBtZXJnZUludG9Db2xsZWN0aW9uV2l0aChsaXN0LCBtZXJnZXIsIGl0ZXJzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRhaWxPZmZzZXQoc2l6ZSkge1xuICAgIHJldHVybiBzaXplIDwgU0laRSA/IDAgOiAoKChzaXplIC0gMSkgPj4+IFNISUZUKSA8PCBTSElGVCk7XG4gIH1cblxuICBjcmVhdGVDbGFzcyhPcmRlcmVkTWFwLCBzcmNfTWFwX19NYXApO1xuXG4gICAgLy8gQHByYWdtYSBDb25zdHJ1Y3Rpb25cblxuICAgIGZ1bmN0aW9uIE9yZGVyZWRNYXAodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlPcmRlcmVkTWFwKCkgOlxuICAgICAgICBpc09yZGVyZWRNYXAodmFsdWUpID8gdmFsdWUgOlxuICAgICAgICBlbXB0eU9yZGVyZWRNYXAoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKG1hcCApIHtcbiAgICAgICAgICB2YXIgaXRlciA9IEtleWVkSXRlcmFibGUodmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uKHYsIGspICB7cmV0dXJuIG1hcC5zZXQoaywgdil9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgT3JkZXJlZE1hcC5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdPcmRlcmVkTWFwIHsnLCAnfScpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciBpbmRleCA9IHRoaXMuX21hcC5nZXQoayk7XG4gICAgICByZXR1cm4gaW5kZXggIT09IHVuZGVmaW5lZCA/IHRoaXMuX2xpc3QuZ2V0KGluZGV4KVsxXSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgICAgdGhpcy5fbWFwLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX2xpc3QuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gZW1wdHlPcmRlcmVkTWFwKCk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIHJldHVybiB1cGRhdGVPcmRlcmVkTWFwKHRoaXMsIGssIHYpO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihrKSB7XG4gICAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCBOT1RfU0VUKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC53YXNBbHRlcmVkKCkgfHwgdGhpcy5fbGlzdC53YXNBbHRlcmVkKCk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy5fbGlzdC5fX2l0ZXJhdGUoXG4gICAgICAgIGZ1bmN0aW9uKGVudHJ5ICkge3JldHVybiBlbnRyeSAmJiBmbihlbnRyeVsxXSwgZW50cnlbMF0sIHRoaXMkMCl9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH07XG5cbiAgICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xpc3QuZnJvbUVudHJ5U2VxKCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZE1hcC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uKG93bmVySUQpIHtcbiAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIHZhciBuZXdMaXN0ID0gdGhpcy5fbGlzdC5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3TWFwO1xuICAgICAgICB0aGlzLl9saXN0ID0gbmV3TGlzdDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZU9yZGVyZWRNYXAobmV3TWFwLCBuZXdMaXN0LCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzT3JkZXJlZE1hcChtYXliZU9yZGVyZWRNYXApIHtcbiAgICByZXR1cm4gaXNNYXAobWF5YmVPcmRlcmVkTWFwKSAmJiBpc09yZGVyZWQobWF5YmVPcmRlcmVkTWFwKTtcbiAgfVxuXG4gIE9yZGVyZWRNYXAuaXNPcmRlcmVkTWFwID0gaXNPcmRlcmVkTWFwO1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcbiAgT3JkZXJlZE1hcC5wcm90b3R5cGVbREVMRVRFXSA9IE9yZGVyZWRNYXAucHJvdG90eXBlLnJlbW92ZTtcblxuXG5cbiAgZnVuY3Rpb24gbWFrZU9yZGVyZWRNYXAobWFwLCBsaXN0LCBvd25lcklELCBoYXNoKSB7XG4gICAgdmFyIG9tYXAgPSBPYmplY3QuY3JlYXRlKE9yZGVyZWRNYXAucHJvdG90eXBlKTtcbiAgICBvbWFwLnNpemUgPSBtYXAgPyBtYXAuc2l6ZSA6IDA7XG4gICAgb21hcC5fbWFwID0gbWFwO1xuICAgIG9tYXAuX2xpc3QgPSBsaXN0O1xuICAgIG9tYXAuX19vd25lcklEID0gb3duZXJJRDtcbiAgICBvbWFwLl9faGFzaCA9IGhhc2g7XG4gICAgcmV0dXJuIG9tYXA7XG4gIH1cblxuICB2YXIgRU1QVFlfT1JERVJFRF9NQVA7XG4gIGZ1bmN0aW9uIGVtcHR5T3JkZXJlZE1hcCgpIHtcbiAgICByZXR1cm4gRU1QVFlfT1JERVJFRF9NQVAgfHwgKEVNUFRZX09SREVSRURfTUFQID0gbWFrZU9yZGVyZWRNYXAoZW1wdHlNYXAoKSwgZW1wdHlMaXN0KCkpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZU9yZGVyZWRNYXAob21hcCwgaywgdikge1xuICAgIHZhciBtYXAgPSBvbWFwLl9tYXA7XG4gICAgdmFyIGxpc3QgPSBvbWFwLl9saXN0O1xuICAgIHZhciBpID0gbWFwLmdldChrKTtcbiAgICB2YXIgaGFzID0gaSAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBuZXdNYXA7XG4gICAgdmFyIG5ld0xpc3Q7XG4gICAgaWYgKHYgPT09IE5PVF9TRVQpIHsgLy8gcmVtb3ZlZFxuICAgICAgaWYgKCFoYXMpIHtcbiAgICAgICAgcmV0dXJuIG9tYXA7XG4gICAgICB9XG4gICAgICBpZiAobGlzdC5zaXplID49IFNJWkUgJiYgbGlzdC5zaXplID49IG1hcC5zaXplICogMikge1xuICAgICAgICBuZXdMaXN0ID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24oZW50cnksIGlkeCkgIHtyZXR1cm4gZW50cnkgIT09IHVuZGVmaW5lZCAmJiBpICE9PSBpZHh9KTtcbiAgICAgICAgbmV3TWFwID0gbmV3TGlzdC50b0tleWVkU2VxKCkubWFwKGZ1bmN0aW9uKGVudHJ5ICkge3JldHVybiBlbnRyeVswXX0pLmZsaXAoKS50b01hcCgpO1xuICAgICAgICBpZiAob21hcC5fX293bmVySUQpIHtcbiAgICAgICAgICBuZXdNYXAuX19vd25lcklEID0gbmV3TGlzdC5fX293bmVySUQgPSBvbWFwLl9fb3duZXJJRDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3TWFwID0gbWFwLnJlbW92ZShrKTtcbiAgICAgICAgbmV3TGlzdCA9IGkgPT09IGxpc3Quc2l6ZSAtIDEgPyBsaXN0LnBvcCgpIDogbGlzdC5zZXQoaSwgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcykge1xuICAgICAgICBpZiAodiA9PT0gbGlzdC5nZXQoaSlbMV0pIHtcbiAgICAgICAgICByZXR1cm4gb21hcDtcbiAgICAgICAgfVxuICAgICAgICBuZXdNYXAgPSBtYXA7XG4gICAgICAgIG5ld0xpc3QgPSBsaXN0LnNldChpLCBbaywgdl0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmV3TWFwID0gbWFwLnNldChrLCBsaXN0LnNpemUpO1xuICAgICAgICBuZXdMaXN0ID0gbGlzdC5zZXQobGlzdC5zaXplLCBbaywgdl0pO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAob21hcC5fX293bmVySUQpIHtcbiAgICAgIG9tYXAuc2l6ZSA9IG5ld01hcC5zaXplO1xuICAgICAgb21hcC5fbWFwID0gbmV3TWFwO1xuICAgICAgb21hcC5fbGlzdCA9IG5ld0xpc3Q7XG4gICAgICBvbWFwLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybiBvbWFwO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZU9yZGVyZWRNYXAobmV3TWFwLCBuZXdMaXN0KTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFN0YWNrLCBJbmRleGVkQ29sbGVjdGlvbik7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gU3RhY2sodmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gZW1wdHlTdGFjaygpIDpcbiAgICAgICAgaXNTdGFjayh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5U3RhY2soKS51bnNoaWZ0QWxsKHZhbHVlKTtcbiAgICB9XG5cbiAgICBTdGFjay5vZiA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU3RhY2sgWycsICddJyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBTdGFjay5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG4gICAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgICB3aGlsZSAoaGVhZCAmJiBpbmRleC0tKSB7XG4gICAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gaGVhZCA/IGhlYWQudmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9oZWFkICYmIHRoaXMuX2hlYWQudmFsdWU7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uKC8qLi4udmFsdWVzKi8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgKyBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgZm9yICh2YXIgaWkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgICAgICBoZWFkID0ge1xuICAgICAgICAgIHZhbHVlOiBhcmd1bWVudHNbaWldLFxuICAgICAgICAgIG5leHQ6IGhlYWRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUucHVzaEFsbCA9IGZ1bmN0aW9uKGl0ZXIpIHtcbiAgICAgIGl0ZXIgPSBJbmRleGVkSXRlcmFibGUoaXRlcik7XG4gICAgICBpZiAoaXRlci5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplO1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgaXRlci5yZXZlcnNlKCkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtcbiAgICAgICAgbmV3U2l6ZSsrO1xuICAgICAgICBoZWFkID0ge1xuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBuZXh0OiBoZWFkXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnVuc2hpZnQgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcy5wdXNoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIFN0YWNrLnByb3RvdHlwZS51bnNoaWZ0QWxsID0gZnVuY3Rpb24oaXRlcikge1xuICAgICAgcmV0dXJuIHRoaXMucHVzaEFsbChpdGVyKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5wb3AuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICAgIHRoaXMuX2hlYWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGVtcHR5U3RhY2soKTtcbiAgICB9O1xuXG4gICAgU3RhY2sucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgdGhpcy5zaXplKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCB0aGlzLnNpemUpO1xuICAgICAgdmFyIHJlc29sdmVkRW5kID0gcmVzb2x2ZUVuZChlbmQsIHRoaXMuc2l6ZSk7XG4gICAgICBpZiAocmVzb2x2ZWRFbmQgIT09IHRoaXMuc2l6ZSkge1xuICAgICAgICAvLyBzdXBlci5zbGljZShiZWdpbiwgZW5kKTtcbiAgICAgICAgcmV0dXJuIEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMsIGJlZ2luLCBlbmQpO1xuICAgICAgfVxuICAgICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgLSByZXNvbHZlZEJlZ2luO1xuICAgICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgICAgd2hpbGUgKHJlc29sdmVkQmVnaW4tLSkge1xuICAgICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICAgIHRoaXMuX2hlYWQgPSBoZWFkO1xuICAgICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTXV0YWJpbGl0eVxuXG4gICAgU3RhY2sucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlU3RhY2sodGhpcy5zaXplLCB0aGlzLl9oZWFkLCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgSXRlcmF0aW9uXG5cbiAgICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5fX2l0ZXJhdGUoZm4pO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgICAgaWYgKGZuKG5vZGUudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgIH07XG5cbiAgICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHtcbiAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5fX2l0ZXJhdG9yKHR5cGUpO1xuICAgICAgfVxuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBub2RlLnZhbHVlO1xuICAgICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfSk7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGlzU3RhY2sobWF5YmVTdGFjaykge1xuICAgIHJldHVybiAhIShtYXliZVN0YWNrICYmIG1heWJlU3RhY2tbSVNfU1RBQ0tfU0VOVElORUxdKTtcbiAgfVxuXG4gIFN0YWNrLmlzU3RhY2sgPSBpc1N0YWNrO1xuXG4gIHZhciBJU19TVEFDS19TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX1NUQUNLX19AQCc7XG5cbiAgdmFyIFN0YWNrUHJvdG90eXBlID0gU3RhY2sucHJvdG90eXBlO1xuICBTdGFja1Byb3RvdHlwZVtJU19TVEFDS19TRU5USU5FTF0gPSB0cnVlO1xuICBTdGFja1Byb3RvdHlwZS53aXRoTXV0YXRpb25zID0gTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnM7XG4gIFN0YWNrUHJvdG90eXBlLmFzTXV0YWJsZSA9IE1hcFByb3RvdHlwZS5hc011dGFibGU7XG4gIFN0YWNrUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlO1xuICBTdGFja1Byb3RvdHlwZS53YXNBbHRlcmVkID0gTWFwUHJvdG90eXBlLndhc0FsdGVyZWQ7XG5cblxuICBmdW5jdGlvbiBtYWtlU3RhY2soc2l6ZSwgaGVhZCwgb3duZXJJRCwgaGFzaCkge1xuICAgIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKFN0YWNrUHJvdG90eXBlKTtcbiAgICBtYXAuc2l6ZSA9IHNpemU7XG4gICAgbWFwLl9oZWFkID0gaGVhZDtcbiAgICBtYXAuX19vd25lcklEID0gb3duZXJJRDtcbiAgICBtYXAuX19oYXNoID0gaGFzaDtcbiAgICBtYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHZhciBFTVBUWV9TVEFDSztcbiAgZnVuY3Rpb24gZW1wdHlTdGFjaygpIHtcbiAgICByZXR1cm4gRU1QVFlfU1RBQ0sgfHwgKEVNUFRZX1NUQUNLID0gbWFrZVN0YWNrKDApKTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKHNyY19TZXRfX1NldCwgU2V0Q29sbGVjdGlvbik7XG5cbiAgICAvLyBAcHJhZ21hIENvbnN0cnVjdGlvblxuXG4gICAgZnVuY3Rpb24gc3JjX1NldF9fU2V0KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5U2V0KCkgOlxuICAgICAgICBpc1NldCh2YWx1ZSkgPyB2YWx1ZSA6XG4gICAgICAgIGVtcHR5U2V0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBTZXRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiApIHtyZXR1cm4gc2V0LmFkZCh2KX0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzcmNfU2V0X19TZXQub2YgPSBmdW5jdGlvbigvKi4uLnZhbHVlcyovKSB7XG4gICAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQuZnJvbUtleXMgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMoS2V5ZWRJdGVyYWJsZSh2YWx1ZSkua2V5U2VxKCkpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTZXQgeycsICd9Jyk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbWFwLmhhcyh2YWx1ZSk7XG4gICAgfTtcblxuICAgIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdXBkYXRlU2V0KHRoaXMsIHRoaXMuX21hcC5zZXQodmFsdWUsIHRydWUpKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAucmVtb3ZlKHZhbHVlKSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLmNsZWFyKCkpO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24oKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICBpdGVycyA9IGl0ZXJzLmZpbHRlcihmdW5jdGlvbih4ICkge3JldHVybiB4LnNpemUgIT09IDB9KTtcbiAgICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwICYmIGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihpdGVyc1swXSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcbiAgICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICAgIFNldEl0ZXJhYmxlKGl0ZXJzW2lpXSkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gc2V0LmFkZCh2YWx1ZSl9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuaW50ZXJzZWN0ID0gZnVuY3Rpb24oKSB7dmFyIGl0ZXJzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaXRlcnMgPSBpdGVycy5tYXAoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gU2V0SXRlcmFibGUoaXRlcil9KTtcbiAgICAgIHZhciBvcmlnaW5hbFNldCA9IHRoaXM7XG4gICAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uKHNldCApIHtcbiAgICAgICAgb3JpZ2luYWxTZXQuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSApIHtcbiAgICAgICAgICBpZiAoIWl0ZXJzLmV2ZXJ5KGZ1bmN0aW9uKGl0ZXIgKSB7cmV0dXJuIGl0ZXIuY29udGFpbnModmFsdWUpfSkpIHtcbiAgICAgICAgICAgIHNldC5yZW1vdmUodmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5zdWJ0cmFjdCA9IGZ1bmN0aW9uKCkge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDApO1xuICAgICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIGl0ZXJzID0gaXRlcnMubWFwKGZ1bmN0aW9uKGl0ZXIgKSB7cmV0dXJuIFNldEl0ZXJhYmxlKGl0ZXIpfSk7XG4gICAgICB2YXIgb3JpZ2luYWxTZXQgPSB0aGlzO1xuICAgICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgIG9yaWdpbmFsU2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUgKSB7XG4gICAgICAgICAgaWYgKGl0ZXJzLnNvbWUoZnVuY3Rpb24oaXRlciApIHtyZXR1cm4gaXRlci5jb250YWlucyh2YWx1ZSl9KSkge1xuICAgICAgICAgICAgc2V0LnJlbW92ZSh2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLm1lcmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy51bmlvbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLm1lcmdlV2l0aCA9IGZ1bmN0aW9uKG1lcmdlcikge3ZhciBpdGVycyA9IFNMSUNFJDAuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgcmV0dXJuIHRoaXMudW5pb24uYXBwbHkodGhpcywgaXRlcnMpO1xuICAgIH07XG5cbiAgICBzcmNfU2V0X19TZXQucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbihjb21wYXJhdG9yKSB7XG4gICAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICAgIHJldHVybiBPcmRlcmVkU2V0KHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIC8vIExhdGUgYmluZGluZ1xuICAgICAgcmV0dXJuIE9yZGVyZWRTZXQoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC53YXNBbHRlcmVkKCk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiB0aGlzLl9tYXAuX19pdGVyYXRlKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIGZuKGssIGssIHRoaXMkMCl9LCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgc3JjX1NldF9fU2V0LnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24odHlwZSwgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC5tYXAoZnVuY3Rpb24oXywgaykgIHtyZXR1cm4ga30pLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfTtcblxuICAgIHNyY19TZXRfX1NldC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uKG93bmVySUQpIHtcbiAgICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICAgIGlmICghb3duZXJJRCkge1xuICAgICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fX21ha2UobmV3TWFwLCBvd25lcklEKTtcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaXNTZXQobWF5YmVTZXQpIHtcbiAgICByZXR1cm4gISEobWF5YmVTZXQgJiYgbWF5YmVTZXRbSVNfU0VUX1NFTlRJTkVMXSk7XG4gIH1cblxuICBzcmNfU2V0X19TZXQuaXNTZXQgPSBpc1NldDtcblxuICB2YXIgSVNfU0VUX1NFTlRJTkVMID0gJ0BAX19JTU1VVEFCTEVfU0VUX19AQCc7XG5cbiAgdmFyIFNldFByb3RvdHlwZSA9IHNyY19TZXRfX1NldC5wcm90b3R5cGU7XG4gIFNldFByb3RvdHlwZVtJU19TRVRfU0VOVElORUxdID0gdHJ1ZTtcbiAgU2V0UHJvdG90eXBlW0RFTEVURV0gPSBTZXRQcm90b3R5cGUucmVtb3ZlO1xuICBTZXRQcm90b3R5cGUubWVyZ2VEZWVwID0gU2V0UHJvdG90eXBlLm1lcmdlO1xuICBTZXRQcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IFNldFByb3RvdHlwZS5tZXJnZVdpdGg7XG4gIFNldFByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnM7XG4gIFNldFByb3RvdHlwZS5hc011dGFibGUgPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlO1xuICBTZXRQcm90b3R5cGUuYXNJbW11dGFibGUgPSBNYXBQcm90b3R5cGUuYXNJbW11dGFibGU7XG5cbiAgU2V0UHJvdG90eXBlLl9fZW1wdHkgPSBlbXB0eVNldDtcbiAgU2V0UHJvdG90eXBlLl9fbWFrZSA9IG1ha2VTZXQ7XG5cbiAgZnVuY3Rpb24gdXBkYXRlU2V0KHNldCwgbmV3TWFwKSB7XG4gICAgaWYgKHNldC5fX293bmVySUQpIHtcbiAgICAgIHNldC5zaXplID0gbmV3TWFwLnNpemU7XG4gICAgICBzZXQuX21hcCA9IG5ld01hcDtcbiAgICAgIHJldHVybiBzZXQ7XG4gICAgfVxuICAgIHJldHVybiBuZXdNYXAgPT09IHNldC5fbWFwID8gc2V0IDpcbiAgICAgIG5ld01hcC5zaXplID09PSAwID8gc2V0Ll9fZW1wdHkoKSA6XG4gICAgICBzZXQuX19tYWtlKG5ld01hcCk7XG4gIH1cblxuICBmdW5jdGlvbiBtYWtlU2V0KG1hcCwgb3duZXJJRCkge1xuICAgIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKFNldFByb3RvdHlwZSk7XG4gICAgc2V0LnNpemUgPSBtYXAgPyBtYXAuc2l6ZSA6IDA7XG4gICAgc2V0Ll9tYXAgPSBtYXA7XG4gICAgc2V0Ll9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgcmV0dXJuIHNldDtcbiAgfVxuXG4gIHZhciBFTVBUWV9TRVQ7XG4gIGZ1bmN0aW9uIGVtcHR5U2V0KCkge1xuICAgIHJldHVybiBFTVBUWV9TRVQgfHwgKEVNUFRZX1NFVCA9IG1ha2VTZXQoZW1wdHlNYXAoKSkpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoT3JkZXJlZFNldCwgc3JjX1NldF9fU2V0KTtcblxuICAgIC8vIEBwcmFnbWEgQ29uc3RydWN0aW9uXG5cbiAgICBmdW5jdGlvbiBPcmRlcmVkU2V0KHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCA/IGVtcHR5T3JkZXJlZFNldCgpIDpcbiAgICAgICAgaXNPcmRlcmVkU2V0KHZhbHVlKSA/IHZhbHVlIDpcbiAgICAgICAgZW1wdHlPcmRlcmVkU2V0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbihzZXQgKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBTZXRJdGVyYWJsZSh2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24odiApIHtyZXR1cm4gc2V0LmFkZCh2KX0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBPcmRlcmVkU2V0Lm9mID0gZnVuY3Rpb24oLyouLi52YWx1ZXMqLykge1xuICAgICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgT3JkZXJlZFNldC5mcm9tS2V5cyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcyhLZXllZEl0ZXJhYmxlKHZhbHVlKS5rZXlTZXEoKSk7XG4gICAgfTtcblxuICAgIE9yZGVyZWRTZXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdPcmRlcmVkU2V0IHsnLCAnfScpO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBpc09yZGVyZWRTZXQobWF5YmVPcmRlcmVkU2V0KSB7XG4gICAgcmV0dXJuIGlzU2V0KG1heWJlT3JkZXJlZFNldCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZFNldCk7XG4gIH1cblxuICBPcmRlcmVkU2V0LmlzT3JkZXJlZFNldCA9IGlzT3JkZXJlZFNldDtcblxuICB2YXIgT3JkZXJlZFNldFByb3RvdHlwZSA9IE9yZGVyZWRTZXQucHJvdG90eXBlO1xuICBPcmRlcmVkU2V0UHJvdG90eXBlW0lTX09SREVSRURfU0VOVElORUxdID0gdHJ1ZTtcblxuICBPcmRlcmVkU2V0UHJvdG90eXBlLl9fZW1wdHkgPSBlbXB0eU9yZGVyZWRTZXQ7XG4gIE9yZGVyZWRTZXRQcm90b3R5cGUuX19tYWtlID0gbWFrZU9yZGVyZWRTZXQ7XG5cbiAgZnVuY3Rpb24gbWFrZU9yZGVyZWRTZXQobWFwLCBvd25lcklEKSB7XG4gICAgdmFyIHNldCA9IE9iamVjdC5jcmVhdGUoT3JkZXJlZFNldFByb3RvdHlwZSk7XG4gICAgc2V0LnNpemUgPSBtYXAgPyBtYXAuc2l6ZSA6IDA7XG4gICAgc2V0Ll9tYXAgPSBtYXA7XG4gICAgc2V0Ll9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgcmV0dXJuIHNldDtcbiAgfVxuXG4gIHZhciBFTVBUWV9PUkRFUkVEX1NFVDtcbiAgZnVuY3Rpb24gZW1wdHlPcmRlcmVkU2V0KCkge1xuICAgIHJldHVybiBFTVBUWV9PUkRFUkVEX1NFVCB8fCAoRU1QVFlfT1JERVJFRF9TRVQgPSBtYWtlT3JkZXJlZFNldChlbXB0eU9yZGVyZWRNYXAoKSkpO1xuICB9XG5cbiAgY3JlYXRlQ2xhc3MoUmVjb3JkLCBLZXllZENvbGxlY3Rpb24pO1xuXG4gICAgZnVuY3Rpb24gUmVjb3JkKGRlZmF1bHRWYWx1ZXMsIG5hbWUpIHtcbiAgICAgIHZhciBSZWNvcmRUeXBlID0gZnVuY3Rpb24gUmVjb3JkKHZhbHVlcykge1xuICAgICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVjb3JkVHlwZSkpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFJlY29yZFR5cGUodmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAgPSBzcmNfTWFwX19NYXAodmFsdWVzKTtcbiAgICAgIH07XG5cbiAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZGVmYXVsdFZhbHVlcyk7XG5cbiAgICAgIHZhciBSZWNvcmRUeXBlUHJvdG90eXBlID0gUmVjb3JkVHlwZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFJlY29yZFByb3RvdHlwZSk7XG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVjb3JkVHlwZTtcbiAgICAgIG5hbWUgJiYgKFJlY29yZFR5cGVQcm90b3R5cGUuX25hbWUgPSBuYW1lKTtcbiAgICAgIFJlY29yZFR5cGVQcm90b3R5cGUuX2RlZmF1bHRWYWx1ZXMgPSBkZWZhdWx0VmFsdWVzO1xuICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5fa2V5cyA9IGtleXM7XG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLnNpemUgPSBrZXlzLmxlbmd0aDtcblxuICAgICAgdHJ5IHtcbiAgICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSApIHtcbiAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUmVjb3JkVHlwZS5wcm90b3R5cGUsIGtleSwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgICBpbnZhcmlhbnQodGhpcy5fX293bmVySUQsICdDYW5ub3Qgc2V0IG9uIGFuIGltbXV0YWJsZSByZWNvcmQuJyk7XG4gICAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBmYWlsZWQuIFByb2JhYmx5IElFOC5cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFJlY29yZFR5cGU7XG4gICAgfVxuXG4gICAgUmVjb3JkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX190b1N0cmluZyhyZWNvcmROYW1lKHRoaXMpICsgJyB7JywgJ30nKTtcbiAgICB9O1xuXG4gICAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICAgIFJlY29yZC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24oaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRWYWx1ZXMuaGFzT3duUHJvcGVydHkoayk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaywgbm90U2V0VmFsdWUpIHtcbiAgICAgIGlmICghdGhpcy5oYXMoaykpIHtcbiAgICAgICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICAgICAgfVxuICAgICAgdmFyIGRlZmF1bHRWYWwgPSB0aGlzLl9kZWZhdWx0VmFsdWVzW2tdO1xuICAgICAgcmV0dXJuIHRoaXMuX21hcCA/IHRoaXMuX21hcC5nZXQoaywgZGVmYXVsdFZhbCkgOiBkZWZhdWx0VmFsO1xuICAgIH07XG5cbiAgICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICAgIHRoaXMuX21hcCAmJiB0aGlzLl9tYXAuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgU3VwZXJSZWNvcmQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuY29uc3RydWN0b3I7XG4gICAgICByZXR1cm4gU3VwZXJSZWNvcmQuX2VtcHR5IHx8IChTdXBlclJlY29yZC5fZW1wdHkgPSBtYWtlUmVjb3JkKHRoaXMsIGVtcHR5TWFwKCkpKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IHNldCB1bmtub3duIGtleSBcIicgKyBrICsgJ1wiIG9uICcgKyByZWNvcmROYW1lKHRoaXMpKTtcbiAgICAgIH1cbiAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAgJiYgdGhpcy5fbWFwLnNldChrLCB2KTtcbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCB8fCBuZXdNYXAgPT09IHRoaXMuX21hcCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld01hcCk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oaykge1xuICAgICAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAgJiYgdGhpcy5fbWFwLnJlbW92ZShrKTtcbiAgICAgIGlmICh0aGlzLl9fb3duZXJJRCB8fCBuZXdNYXAgPT09IHRoaXMuX21hcCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld01hcCk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21hcC53YXNBbHRlcmVkKCk7XG4gICAgfTtcblxuICAgIFJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uKHR5cGUsIHJldmVyc2UpIHt2YXIgdGhpcyQwID0gdGhpcztcbiAgICAgIHJldHVybiBLZXllZEl0ZXJhYmxlKHRoaXMuX2RlZmF1bHRWYWx1ZXMpLm1hcChmdW5jdGlvbihfLCBrKSAge3JldHVybiB0aGlzJDAuZ2V0KGspfSkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB9O1xuXG4gICAgUmVjb3JkLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbihmbiwgcmV2ZXJzZSkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIEtleWVkSXRlcmFibGUodGhpcy5fZGVmYXVsdFZhbHVlcykubWFwKGZ1bmN0aW9uKF8sIGspICB7cmV0dXJuIHRoaXMkMC5nZXQoayl9KS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgIH07XG5cbiAgICBSZWNvcmQucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbihvd25lcklEKSB7XG4gICAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwICYmIHRoaXMuX21hcC5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuICAgICAgaWYgKCFvd25lcklEKSB7XG4gICAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3TWFwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld01hcCwgb3duZXJJRCk7XG4gICAgfTtcblxuXG4gIHZhciBSZWNvcmRQcm90b3R5cGUgPSBSZWNvcmQucHJvdG90eXBlO1xuICBSZWNvcmRQcm90b3R5cGVbREVMRVRFXSA9IFJlY29yZFByb3RvdHlwZS5yZW1vdmU7XG4gIFJlY29yZFByb3RvdHlwZS5kZWxldGVJbiA9XG4gIFJlY29yZFByb3RvdHlwZS5yZW1vdmVJbiA9IE1hcFByb3RvdHlwZS5yZW1vdmVJbjtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlID0gTWFwUHJvdG90eXBlLm1lcmdlO1xuICBSZWNvcmRQcm90b3R5cGUubWVyZ2VXaXRoID0gTWFwUHJvdG90eXBlLm1lcmdlV2l0aDtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlSW4gPSBNYXBQcm90b3R5cGUubWVyZ2VJbjtcbiAgUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcCA9IE1hcFByb3RvdHlwZS5tZXJnZURlZXA7XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gTWFwUHJvdG90eXBlLm1lcmdlRGVlcFdpdGg7XG4gIFJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IE1hcFByb3RvdHlwZS5tZXJnZURlZXBJbjtcbiAgUmVjb3JkUHJvdG90eXBlLnNldEluID0gTWFwUHJvdG90eXBlLnNldEluO1xuICBSZWNvcmRQcm90b3R5cGUudXBkYXRlID0gTWFwUHJvdG90eXBlLnVwZGF0ZTtcbiAgUmVjb3JkUHJvdG90eXBlLnVwZGF0ZUluID0gTWFwUHJvdG90eXBlLnVwZGF0ZUluO1xuICBSZWNvcmRQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IE1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zO1xuICBSZWNvcmRQcm90b3R5cGUuYXNNdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzTXV0YWJsZTtcbiAgUmVjb3JkUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlO1xuXG5cbiAgZnVuY3Rpb24gbWFrZVJlY29yZChsaWtlUmVjb3JkLCBtYXAsIG93bmVySUQpIHtcbiAgICB2YXIgcmVjb3JkID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YobGlrZVJlY29yZCkpO1xuICAgIHJlY29yZC5fbWFwID0gbWFwO1xuICAgIHJlY29yZC5fX293bmVySUQgPSBvd25lcklEO1xuICAgIHJldHVybiByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiByZWNvcmROYW1lKHJlY29yZCkge1xuICAgIHJldHVybiByZWNvcmQuX25hbWUgfHwgcmVjb3JkLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cblxuICBmdW5jdGlvbiBkZWVwRXF1YWwoYSwgYikge1xuICAgIGlmIChhID09PSBiKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICAhaXNJdGVyYWJsZShiKSB8fFxuICAgICAgYS5zaXplICE9PSB1bmRlZmluZWQgJiYgYi5zaXplICE9PSB1bmRlZmluZWQgJiYgYS5zaXplICE9PSBiLnNpemUgfHxcbiAgICAgIGEuX19oYXNoICE9PSB1bmRlZmluZWQgJiYgYi5fX2hhc2ggIT09IHVuZGVmaW5lZCAmJiBhLl9faGFzaCAhPT0gYi5fX2hhc2ggfHxcbiAgICAgIGlzS2V5ZWQoYSkgIT09IGlzS2V5ZWQoYikgfHxcbiAgICAgIGlzSW5kZXhlZChhKSAhPT0gaXNJbmRleGVkKGIpIHx8XG4gICAgICBpc09yZGVyZWQoYSkgIT09IGlzT3JkZXJlZChiKVxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChhLnNpemUgPT09IDAgJiYgYi5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgbm90QXNzb2NpYXRpdmUgPSAhaXNBc3NvY2lhdGl2ZShhKTtcblxuICAgIGlmIChpc09yZGVyZWQoYSkpIHtcbiAgICAgIHZhciBlbnRyaWVzID0gYS5lbnRyaWVzKCk7XG4gICAgICByZXR1cm4gYi5ldmVyeShmdW5jdGlvbih2LCBrKSAge1xuICAgICAgICB2YXIgZW50cnkgPSBlbnRyaWVzLm5leHQoKS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGVudHJ5ICYmIGlzKGVudHJ5WzFdLCB2KSAmJiAobm90QXNzb2NpYXRpdmUgfHwgaXMoZW50cnlbMF0sIGspKTtcbiAgICAgIH0pICYmIGVudHJpZXMubmV4dCgpLmRvbmU7XG4gICAgfVxuXG4gICAgdmFyIGZsaXBwZWQgPSBmYWxzZTtcblxuICAgIGlmIChhLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGEuY2FjaGVSZXN1bHQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZsaXBwZWQgPSB0cnVlO1xuICAgICAgICB2YXIgXyA9IGE7XG4gICAgICAgIGEgPSBiO1xuICAgICAgICBiID0gXztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgYWxsRXF1YWwgPSB0cnVlO1xuICAgIHZhciBiU2l6ZSA9IGIuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGspICB7XG4gICAgICBpZiAobm90QXNzb2NpYXRpdmUgPyAhYS5oYXModikgOlxuICAgICAgICAgIGZsaXBwZWQgPyAhaXModiwgYS5nZXQoaywgTk9UX1NFVCkpIDogIWlzKGEuZ2V0KGssIE5PVF9TRVQpLCB2KSkge1xuICAgICAgICBhbGxFcXVhbCA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYWxsRXF1YWwgJiYgYS5zaXplID09PSBiU2l6ZTtcbiAgfVxuXG4gIGNyZWF0ZUNsYXNzKFJhbmdlLCBJbmRleGVkU2VxKTtcblxuICAgIGZ1bmN0aW9uIFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSYW5nZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSYW5nZShzdGFydCwgZW5kLCBzdGVwKTtcbiAgICAgIH1cbiAgICAgIGludmFyaWFudChzdGVwICE9PSAwLCAnQ2Fubm90IHN0ZXAgYSBSYW5nZSBieSAwJyk7XG4gICAgICBzdGFydCA9IHN0YXJ0IHx8IDA7XG4gICAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZW5kID0gSW5maW5pdHk7XG4gICAgICB9XG4gICAgICBzdGVwID0gc3RlcCA9PT0gdW5kZWZpbmVkID8gMSA6IE1hdGguYWJzKHN0ZXApO1xuICAgICAgaWYgKGVuZCA8IHN0YXJ0KSB7XG4gICAgICAgIHN0ZXAgPSAtc3RlcDtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3N0YXJ0ID0gc3RhcnQ7XG4gICAgICB0aGlzLl9lbmQgPSBlbmQ7XG4gICAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICAgIHRoaXMuc2l6ZSA9IE1hdGgubWF4KDAsIE1hdGguY2VpbCgoZW5kIC0gc3RhcnQpIC8gc3RlcCAtIDEpICsgMSk7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIGlmIChFTVBUWV9SQU5HRSkge1xuICAgICAgICAgIHJldHVybiBFTVBUWV9SQU5HRTtcbiAgICAgICAgfVxuICAgICAgICBFTVBUWV9SQU5HRSA9IHRoaXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnUmFuZ2UgW10nO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdSYW5nZSBbICcgK1xuICAgICAgICB0aGlzLl9zdGFydCArICcuLi4nICsgdGhpcy5fZW5kICtcbiAgICAgICAgKHRoaXMuX3N0ZXAgPiAxID8gJyBieSAnICsgdGhpcy5fc3RlcCA6ICcnKSArXG4gICAgICAnIF0nO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24oaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID9cbiAgICAgICAgdGhpcy5fc3RhcnQgKyB3cmFwSW5kZXgodGhpcywgaW5kZXgpICogdGhpcy5fc3RlcCA6XG4gICAgICAgIG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBSYW5nZS5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgdmFyIHBvc3NpYmxlSW5kZXggPSAoc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydCkgLyB0aGlzLl9zdGVwO1xuICAgICAgcmV0dXJuIHBvc3NpYmxlSW5kZXggPj0gMCAmJlxuICAgICAgICBwb3NzaWJsZUluZGV4IDwgdGhpcy5zaXplICYmXG4gICAgICAgIHBvc3NpYmxlSW5kZXggPT09IE1hdGguZmxvb3IocG9zc2libGVJbmRleCk7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uKGJlZ2luLCBlbmQpIHtcbiAgICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgICBiZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICAgIGVuZCA9IHJlc29sdmVFbmQoZW5kLCB0aGlzLnNpemUpO1xuICAgICAgaWYgKGVuZCA8PSBiZWdpbikge1xuICAgICAgICByZXR1cm4gbmV3IFJhbmdlKDAsIDApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBSYW5nZSh0aGlzLmdldChiZWdpbiwgdGhpcy5fZW5kKSwgdGhpcy5nZXQoZW5kLCB0aGlzLl9lbmQpLCB0aGlzLl9zdGVwKTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgdmFyIG9mZnNldFZhbHVlID0gc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydDtcbiAgICAgIGlmIChvZmZzZXRWYWx1ZSAlIHRoaXMuX3N0ZXAgPT09IDApIHtcbiAgICAgICAgdmFyIGluZGV4ID0gb2Zmc2V0VmFsdWUgLyB0aGlzLl9zdGVwO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuICAgICAgICAgIHJldHVybiBpbmRleFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIFJhbmdlLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleE9mKHNlYXJjaFZhbHVlKTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uKGZuLCByZXZlcnNlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSB0aGlzLnNpemUgLSAxO1xuICAgICAgdmFyIHN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgbWF4SW5kZXggKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDw9IG1heEluZGV4OyBpaSsrKSB7XG4gICAgICAgIGlmIChmbih2YWx1ZSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiBpaSArIDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUgKz0gcmV2ZXJzZSA/IC1zdGVwIDogc3RlcDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpaTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7XG4gICAgICB2YXIgbWF4SW5kZXggPSB0aGlzLnNpemUgLSAxO1xuICAgICAgdmFyIHN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgbWF4SW5kZXggKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgIHtcbiAgICAgICAgdmFyIHYgPSB2YWx1ZTtcbiAgICAgICAgdmFsdWUgKz0gcmV2ZXJzZSA/IC1zdGVwIDogc3RlcDtcbiAgICAgICAgcmV0dXJuIGlpID4gbWF4SW5kZXggPyBpdGVyYXRvckRvbmUoKSA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaWkrKywgdik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgUmFuZ2UucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKG90aGVyKSB7XG4gICAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSYW5nZSA/XG4gICAgICAgIHRoaXMuX3N0YXJ0ID09PSBvdGhlci5fc3RhcnQgJiZcbiAgICAgICAgdGhpcy5fZW5kID09PSBvdGhlci5fZW5kICYmXG4gICAgICAgIHRoaXMuX3N0ZXAgPT09IG90aGVyLl9zdGVwIDpcbiAgICAgICAgZGVlcEVxdWFsKHRoaXMsIG90aGVyKTtcbiAgICB9O1xuXG5cbiAgdmFyIEVNUFRZX1JBTkdFO1xuXG4gIGNyZWF0ZUNsYXNzKFJlcGVhdCwgSW5kZXhlZFNlcSk7XG5cbiAgICBmdW5jdGlvbiBSZXBlYXQodmFsdWUsIHRpbWVzKSB7XG4gICAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVwZWF0KSkge1xuICAgICAgICByZXR1cm4gbmV3IFJlcGVhdCh2YWx1ZSwgdGltZXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgIHRoaXMuc2l6ZSA9IHRpbWVzID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IE1hdGgubWF4KDAsIHRpbWVzKTtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgaWYgKEVNUFRZX1JFUEVBVCkge1xuICAgICAgICAgIHJldHVybiBFTVBUWV9SRVBFQVQ7XG4gICAgICAgIH1cbiAgICAgICAgRU1QVFlfUkVQRUFUID0gdGhpcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiAnUmVwZWF0IFtdJztcbiAgICAgIH1cbiAgICAgIHJldHVybiAnUmVwZWF0IFsgJyArIHRoaXMuX3ZhbHVlICsgJyAnICsgdGhpcy5zaXplICsgJyB0aW1lcyBdJztcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbihpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl92YWx1ZSA6IG5vdFNldFZhbHVlO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmNvbnRhaW5zID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiBpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgICByZXR1cm4gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSA/IHRoaXMgOlxuICAgICAgICBuZXcgUmVwZWF0KHRoaXMuX3ZhbHVlLCByZXNvbHZlRW5kKGVuZCwgc2l6ZSkgLSByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpKTtcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5yZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgUmVwZWF0LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNpemU7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24oZm4sIHJldmVyc2UpIHtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB0aGlzLnNpemU7IGlpKyspIHtcbiAgICAgICAgaWYgKGZuKHRoaXMuX3ZhbHVlLCBpaSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIGlpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGlpO1xuICAgIH07XG5cbiAgICBSZXBlYXQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbih0eXBlLCByZXZlcnNlKSB7dmFyIHRoaXMkMCA9IHRoaXM7XG4gICAgICB2YXIgaWkgPSAwO1xuICAgICAgcmV0dXJuIG5ldyBzcmNfSXRlcmF0b3JfX0l0ZXJhdG9yKGZ1bmN0aW9uKCkgXG4gICAgICAgIHtyZXR1cm4gaWkgPCB0aGlzJDAuc2l6ZSA/IGl0ZXJhdG9yVmFsdWUodHlwZSwgaWkrKywgdGhpcyQwLl92YWx1ZSkgOiBpdGVyYXRvckRvbmUoKX1cbiAgICAgICk7XG4gICAgfTtcblxuICAgIFJlcGVhdC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24ob3RoZXIpIHtcbiAgICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIFJlcGVhdCA/XG4gICAgICAgIGlzKHRoaXMuX3ZhbHVlLCBvdGhlci5fdmFsdWUpIDpcbiAgICAgICAgZGVlcEVxdWFsKG90aGVyKTtcbiAgICB9O1xuXG5cbiAgdmFyIEVNUFRZX1JFUEVBVDtcblxuICAvKipcbiAgICogQ29udHJpYnV0ZXMgYWRkaXRpb25hbCBtZXRob2RzIHRvIGEgY29uc3RydWN0b3JcbiAgICovXG4gIGZ1bmN0aW9uIG1peGluKGN0b3IsIG1ldGhvZHMpIHtcbiAgICB2YXIga2V5Q29waWVyID0gZnVuY3Rpb24oa2V5ICkgeyBjdG9yLnByb3RvdHlwZVtrZXldID0gbWV0aG9kc1trZXldOyB9O1xuICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzICYmXG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgICByZXR1cm4gY3RvcjtcbiAgfVxuXG4gIEl0ZXJhYmxlLkl0ZXJhdG9yID0gc3JjX0l0ZXJhdG9yX19JdGVyYXRvcjtcblxuICBtaXhpbihJdGVyYWJsZSwge1xuXG4gICAgLy8gIyMjIENvbnZlcnNpb24gdG8gb3RoZXIgdHlwZXNcblxuICAgIHRvQXJyYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHZhciBhcnJheSA9IG5ldyBBcnJheSh0aGlzLnNpemUgfHwgMCk7XG4gICAgICB0aGlzLnZhbHVlU2VxKCkuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGkpICB7IGFycmF5W2ldID0gdjsgfSk7XG4gICAgICByZXR1cm4gYXJyYXk7XG4gICAgfSxcblxuICAgIHRvSW5kZXhlZFNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFRvSW5kZXhlZFNlcXVlbmNlKHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b0pTOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkubWFwKFxuICAgICAgICBmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLnRvSlMgPT09ICdmdW5jdGlvbicgPyB2YWx1ZS50b0pTKCkgOiB2YWx1ZX1cbiAgICAgICkuX190b0pTKCk7XG4gICAgfSxcblxuICAgIHRvSlNPTjogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLm1hcChcbiAgICAgICAgZnVuY3Rpb24odmFsdWUgKSB7cmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09ICdmdW5jdGlvbicgPyB2YWx1ZS50b0pTT04oKSA6IHZhbHVlfVxuICAgICAgKS5fX3RvSlMoKTtcbiAgICB9LFxuXG4gICAgdG9LZXllZFNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgdG9NYXA6IGZ1bmN0aW9uKCkge1xuICAgICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgICAgcmV0dXJuIHNyY19NYXBfX01hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG4gICAgfSxcblxuICAgIHRvT2JqZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgb2JqZWN0ID0ge307XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrKSAgeyBvYmplY3Rba10gPSB2OyB9KTtcbiAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfSxcblxuICAgIHRvT3JkZXJlZE1hcDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gT3JkZXJlZE1hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG4gICAgfSxcblxuICAgIHRvT3JkZXJlZFNldDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gT3JkZXJlZFNldChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gICAgfSxcblxuICAgIHRvU2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBzcmNfU2V0X19TZXQoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICAgIH0sXG5cbiAgICB0b1NldFNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFRvU2V0U2VxdWVuY2UodGhpcyk7XG4gICAgfSxcblxuICAgIHRvU2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBpc0luZGV4ZWQodGhpcykgPyB0aGlzLnRvSW5kZXhlZFNlcSgpIDpcbiAgICAgICAgaXNLZXllZCh0aGlzKSA/IHRoaXMudG9LZXllZFNlcSgpIDpcbiAgICAgICAgdGhpcy50b1NldFNlcSgpO1xuICAgIH0sXG5cbiAgICB0b1N0YWNrOiBmdW5jdGlvbigpIHtcbiAgICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICAgIHJldHVybiBTdGFjayhpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gICAgfSxcblxuICAgIHRvTGlzdDogZnVuY3Rpb24oKSB7XG4gICAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgICByZXR1cm4gTGlzdChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIENvbW1vbiBKYXZhU2NyaXB0IG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcblxuICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnW0l0ZXJhYmxlXSc7XG4gICAgfSxcblxuICAgIF9fdG9TdHJpbmc6IGZ1bmN0aW9uKGhlYWQsIHRhaWwpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGhlYWQgKyB0YWlsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGhlYWQgKyAnICcgKyB0aGlzLnRvU2VxKCkubWFwKHRoaXMuX190b1N0cmluZ01hcHBlcikuam9pbignLCAnKSArICcgJyArIHRhaWw7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gICAgY29uY2F0OiBmdW5jdGlvbigpIHt2YXIgdmFsdWVzID0gU0xJQ0UkMC5jYWxsKGFyZ3VtZW50cywgMCk7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgY29uY2F0RmFjdG9yeSh0aGlzLCB2YWx1ZXMpKTtcbiAgICB9LFxuXG4gICAgY29udGFpbnM6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb21lKGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpfSk7XG4gICAgfSxcblxuICAgIGVudHJpZXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMpO1xuICAgIH0sXG5cbiAgICBldmVyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgICAgdmFyIHJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG4gICAgICAgIGlmICghcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfSxcblxuICAgIGZpbHRlcjogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmlsdGVyRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIHRydWUpKTtcbiAgICB9LFxuXG4gICAgZmluZDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiBlbnRyeSA/IGVudHJ5WzFdIDogbm90U2V0VmFsdWU7XG4gICAgfSxcblxuICAgIGZpbmRFbnRyeTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICB2YXIgZm91bmQ7XG4gICAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbih2LCBrLCBjKSAge1xuICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcbiAgICAgICAgICBmb3VuZCA9IFtrLCB2XTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0sXG5cbiAgICBmaW5kTGFzdEVudHJ5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICBmb3JFYWNoOiBmdW5jdGlvbihzaWRlRWZmZWN0LCBjb250ZXh0KSB7XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgICAgcmV0dXJuIHRoaXMuX19pdGVyYXRlKGNvbnRleHQgPyBzaWRlRWZmZWN0LmJpbmQoY29udGV4dCkgOiBzaWRlRWZmZWN0KTtcbiAgICB9LFxuXG4gICAgam9pbjogZnVuY3Rpb24oc2VwYXJhdG9yKSB7XG4gICAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yICE9PSB1bmRlZmluZWQgPyAnJyArIHNlcGFyYXRvciA6ICcsJztcbiAgICAgIHZhciBqb2luZWQgPSAnJztcbiAgICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYgKSB7XG4gICAgICAgIGlzRmlyc3QgPyAoaXNGaXJzdCA9IGZhbHNlKSA6IChqb2luZWQgKz0gc2VwYXJhdG9yKTtcbiAgICAgICAgam9pbmVkICs9IHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkID8gdi50b1N0cmluZygpIDogJyc7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBqb2luZWQ7XG4gICAgfSxcblxuICAgIGtleXM6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0tFWVMpO1xuICAgIH0sXG5cbiAgICBtYXA6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIG1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KSk7XG4gICAgfSxcblxuICAgIHJlZHVjZTogZnVuY3Rpb24ocmVkdWNlciwgaW5pdGlhbFJlZHVjdGlvbiwgY29udGV4dCkge1xuICAgICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICAgIHZhciByZWR1Y3Rpb247XG4gICAgICB2YXIgdXNlRmlyc3Q7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgdXNlRmlyc3QgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVkdWN0aW9uID0gaW5pdGlhbFJlZHVjdGlvbjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uKHYsIGssIGMpICB7XG4gICAgICAgIGlmICh1c2VGaXJzdCkge1xuICAgICAgICAgIHVzZUZpcnN0ID0gZmFsc2U7XG4gICAgICAgICAgcmVkdWN0aW9uID0gdjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWR1Y3Rpb24gPSByZWR1Y2VyLmNhbGwoY29udGV4dCwgcmVkdWN0aW9uLCB2LCBrLCBjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVkdWN0aW9uO1xuICAgIH0sXG5cbiAgICByZWR1Y2VSaWdodDogZnVuY3Rpb24ocmVkdWNlciwgaW5pdGlhbFJlZHVjdGlvbiwgY29udGV4dCkge1xuICAgICAgdmFyIHJldmVyc2VkID0gdGhpcy50b0tleWVkU2VxKCkucmV2ZXJzZSgpO1xuICAgICAgcmV0dXJuIHJldmVyc2VkLnJlZHVjZS5hcHBseShyZXZlcnNlZCwgYXJndW1lbnRzKTtcbiAgICB9LFxuXG4gICAgcmV2ZXJzZTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgcmV2ZXJzZUZhY3RvcnkodGhpcywgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBzbGljZTogZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNsaWNlRmFjdG9yeSh0aGlzLCBiZWdpbiwgZW5kLCB0cnVlKSk7XG4gICAgfSxcblxuICAgIHNvbWU6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuICF0aGlzLmV2ZXJ5KG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgc29ydDogZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpKTtcbiAgICB9LFxuXG4gICAgdmFsdWVzOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gICAgYnV0TGFzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZSgwLCAtMSk7XG4gICAgfSxcblxuICAgIGlzRW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5zaXplID09PSAwIDogIXRoaXMuc29tZShmdW5jdGlvbigpICB7cmV0dXJuIHRydWV9KTtcbiAgICB9LFxuXG4gICAgY291bnQ6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIGVuc3VyZVNpemUoXG4gICAgICAgIHByZWRpY2F0ZSA/IHRoaXMudG9TZXEoKS5maWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KSA6IHRoaXNcbiAgICAgICk7XG4gICAgfSxcblxuICAgIGNvdW50Qnk6IGZ1bmN0aW9uKGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBjb3VudEJ5RmFjdG9yeSh0aGlzLCBncm91cGVyLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgZXF1YWxzOiBmdW5jdGlvbihvdGhlcikge1xuICAgICAgcmV0dXJuIGRlZXBFcXVhbCh0aGlzLCBvdGhlcik7XG4gICAgfSxcblxuICAgIGVudHJ5U2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpdGVyYWJsZSA9IHRoaXM7XG4gICAgICBpZiAoaXRlcmFibGUuX2NhY2hlKSB7XG4gICAgICAgIC8vIFdlIGNhY2hlIGFzIGFuIGVudHJpZXMgYXJyYXksIHNvIHdlIGNhbiBqdXN0IHJldHVybiB0aGUgY2FjaGUhXG4gICAgICAgIHJldHVybiBuZXcgQXJyYXlTZXEoaXRlcmFibGUuX2NhY2hlKTtcbiAgICAgIH1cbiAgICAgIHZhciBlbnRyaWVzU2VxdWVuY2UgPSBpdGVyYWJsZS50b1NlcSgpLm1hcChlbnRyeU1hcHBlcikudG9JbmRleGVkU2VxKCk7XG4gICAgICBlbnRyaWVzU2VxdWVuY2UuZnJvbUVudHJ5U2VxID0gZnVuY3Rpb24oKSAge3JldHVybiBpdGVyYWJsZS50b1NlcSgpfTtcbiAgICAgIHJldHVybiBlbnRyaWVzU2VxdWVuY2U7XG4gICAgfSxcblxuICAgIGZpbHRlck5vdDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdGhpcy5maWx0ZXIobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICAgIH0sXG5cbiAgICBmaW5kTGFzdDogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKS5maW5kKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpO1xuICAgIH0sXG5cbiAgICBmaXJzdDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kKHJldHVyblRydWUpO1xuICAgIH0sXG5cbiAgICBmbGF0TWFwOiBmdW5jdGlvbihtYXBwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0TWFwRmFjdG9yeSh0aGlzLCBtYXBwZXIsIGNvbnRleHQpKTtcbiAgICB9LFxuXG4gICAgZmxhdHRlbjogZnVuY3Rpb24oZGVwdGgpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBmcm9tRW50cnlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBGcm9tRW50cmllc1NlcXVlbmNlKHRoaXMpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKHNlYXJjaEtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmQoZnVuY3Rpb24oXywga2V5KSAge3JldHVybiBpcyhrZXksIHNlYXJjaEtleSl9LCB1bmRlZmluZWQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgZ2V0SW46IGZ1bmN0aW9uKHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgbmVzdGVkID0gdGhpcztcbiAgICAgIC8vIE5vdGU6IGluIGFuIEVTNiBlbnZpcm9ubWVudCwgd2Ugd291bGQgcHJlZmVyOlxuICAgICAgLy8gZm9yICh2YXIga2V5IG9mIHNlYXJjaEtleVBhdGgpIHtcbiAgICAgIHZhciBpdGVyID0gZm9yY2VJdGVyYXRvcihzZWFyY2hLZXlQYXRoKTtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXIubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIHZhciBrZXkgPSBzdGVwLnZhbHVlO1xuICAgICAgICBuZXN0ZWQgPSBuZXN0ZWQgJiYgbmVzdGVkLmdldCA/IG5lc3RlZC5nZXQoa2V5LCBOT1RfU0VUKSA6IE5PVF9TRVQ7XG4gICAgICAgIGlmIChuZXN0ZWQgPT09IE5PVF9TRVQpIHtcbiAgICAgICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXN0ZWQ7XG4gICAgfSxcblxuICAgIGdyb3VwQnk6IGZ1bmN0aW9uKGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiBncm91cEJ5RmFjdG9yeSh0aGlzLCBncm91cGVyLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgaGFzOiBmdW5jdGlvbihzZWFyY2hLZXkpIHtcbiAgICAgIHJldHVybiB0aGlzLmdldChzZWFyY2hLZXksIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xuICAgIH0sXG5cbiAgICBoYXNJbjogZnVuY3Rpb24oc2VhcmNoS2V5UGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SW4oc2VhcmNoS2V5UGF0aCwgTk9UX1NFVCkgIT09IE5PVF9TRVQ7XG4gICAgfSxcblxuICAgIGlzU3Vic2V0OiBmdW5jdGlvbihpdGVyKSB7XG4gICAgICBpdGVyID0gdHlwZW9mIGl0ZXIuY29udGFpbnMgPT09ICdmdW5jdGlvbicgPyBpdGVyIDogSXRlcmFibGUoaXRlcik7XG4gICAgICByZXR1cm4gdGhpcy5ldmVyeShmdW5jdGlvbih2YWx1ZSApIHtyZXR1cm4gaXRlci5jb250YWlucyh2YWx1ZSl9KTtcbiAgICB9LFxuXG4gICAgaXNTdXBlcnNldDogZnVuY3Rpb24oaXRlcikge1xuICAgICAgcmV0dXJuIGl0ZXIuaXNTdWJzZXQodGhpcyk7XG4gICAgfSxcblxuICAgIGtleVNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50b1NlcSgpLm1hcChrZXlNYXBwZXIpLnRvSW5kZXhlZFNlcSgpO1xuICAgIH0sXG5cbiAgICBsYXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmZpcnN0KCk7XG4gICAgfSxcblxuICAgIG1heDogZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvcik7XG4gICAgfSxcblxuICAgIG1heEJ5OiBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcik7XG4gICAgfSxcblxuICAgIG1pbjogZnVuY3Rpb24oY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvciA/IG5lZyhjb21wYXJhdG9yKSA6IGRlZmF1bHROZWdDb21wYXJhdG9yKTtcbiAgICB9LFxuXG4gICAgbWluQnk6IGZ1bmN0aW9uKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvciA/IG5lZyhjb21wYXJhdG9yKSA6IGRlZmF1bHROZWdDb21wYXJhdG9yLCBtYXBwZXIpO1xuICAgIH0sXG5cbiAgICByZXN0OiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnNsaWNlKDEpO1xuICAgIH0sXG5cbiAgICBza2lwOiBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNsaWNlKE1hdGgubWF4KDAsIGFtb3VudCkpO1xuICAgIH0sXG5cbiAgICBza2lwTGFzdDogZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgdGhpcy50b1NlcSgpLnJldmVyc2UoKS5za2lwKGFtb3VudCkucmV2ZXJzZSgpKTtcbiAgICB9LFxuXG4gICAgc2tpcFdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBza2lwV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgdHJ1ZSkpO1xuICAgIH0sXG5cbiAgICBza2lwVW50aWw6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2tpcFdoaWxlKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAgc29ydEJ5OiBmdW5jdGlvbihtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgICB9LFxuXG4gICAgdGFrZTogZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5zbGljZSgwLCBNYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgICB9LFxuXG4gICAgdGFrZUxhc3Q6IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHRoaXMudG9TZXEoKS5yZXZlcnNlKCkudGFrZShhbW91bnQpLnJldmVyc2UoKSk7XG4gICAgfSxcblxuICAgIHRha2VXaGlsZTogZnVuY3Rpb24ocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgdGFrZVdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQpKTtcbiAgICB9LFxuXG4gICAgdGFrZVVudGlsOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRha2VXaGlsZShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gICAgfSxcblxuICAgIHZhbHVlU2VxOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvSW5kZXhlZFNlcSgpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBIYXNoYWJsZSBPYmplY3RcblxuICAgIGhhc2hDb2RlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faGFzaCB8fCAodGhpcy5fX2hhc2ggPSBoYXNoSXRlcmFibGUodGhpcykpO1xuICAgIH0sXG5cblxuICAgIC8vICMjIyBJbnRlcm5hbFxuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRlKGZuLCByZXZlcnNlKVxuXG4gICAgLy8gYWJzdHJhY3QgX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKVxuICB9KTtcblxuICAvLyB2YXIgSVNfSVRFUkFCTEVfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9JVEVSQUJMRV9fQEAnO1xuICAvLyB2YXIgSVNfS0VZRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9LRVlFRF9fQEAnO1xuICAvLyB2YXIgSVNfSU5ERVhFRF9TRU5USU5FTCA9ICdAQF9fSU1NVVRBQkxFX0lOREVYRURfX0BAJztcbiAgLy8gdmFyIElTX09SREVSRURfU0VOVElORUwgPSAnQEBfX0lNTVVUQUJMRV9PUkRFUkVEX19AQCc7XG5cbiAgdmFyIEl0ZXJhYmxlUHJvdG90eXBlID0gSXRlcmFibGUucHJvdG90eXBlO1xuICBJdGVyYWJsZVByb3RvdHlwZVtJU19JVEVSQUJMRV9TRU5USU5FTF0gPSB0cnVlO1xuICBJdGVyYWJsZVByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gSXRlcmFibGVQcm90b3R5cGUudmFsdWVzO1xuICBJdGVyYWJsZVByb3RvdHlwZS5fX3RvSlMgPSBJdGVyYWJsZVByb3RvdHlwZS50b0FycmF5O1xuICBJdGVyYWJsZVByb3RvdHlwZS5fX3RvU3RyaW5nTWFwcGVyID0gcXVvdGVTdHJpbmc7XG4gIEl0ZXJhYmxlUHJvdG90eXBlLmluc3BlY3QgPVxuICBJdGVyYWJsZVByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy50b1N0cmluZygpOyB9O1xuICBJdGVyYWJsZVByb3RvdHlwZS5jaGFpbiA9IEl0ZXJhYmxlUHJvdG90eXBlLmZsYXRNYXA7XG5cbiAgLy8gVGVtcG9yYXJ5IHdhcm5pbmcgYWJvdXQgdXNpbmcgbGVuZ3RoXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShJdGVyYWJsZVByb3RvdHlwZSwgJ2xlbmd0aCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCFJdGVyYWJsZS5ub0xlbmd0aFdhcm5pbmcpIHtcbiAgICAgICAgICAgIHZhciBzdGFjaztcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgc3RhY2sgPSBlcnJvci5zdGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzdGFjay5pbmRleE9mKCdfd3JhcE9iamVjdCcpID09PSAtMSkge1xuICAgICAgICAgICAgICBjb25zb2xlICYmIGNvbnNvbGUud2FybiAmJiBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgJ2l0ZXJhYmxlLmxlbmd0aCBoYXMgYmVlbiBkZXByZWNhdGVkLCAnK1xuICAgICAgICAgICAgICAgICd1c2UgaXRlcmFibGUuc2l6ZSBvciBpdGVyYWJsZS5jb3VudCgpLiAnK1xuICAgICAgICAgICAgICAgICdUaGlzIHdhcm5pbmcgd2lsbCBiZWNvbWUgYSBzaWxlbnQgZXJyb3IgaW4gYSBmdXR1cmUgdmVyc2lvbi4gJyArXG4gICAgICAgICAgICAgICAgc3RhY2tcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0pKCk7XG5cblxuXG4gIG1peGluKEtleWVkSXRlcmFibGUsIHtcblxuICAgIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gICAgZmxpcDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gcmVpZnkodGhpcywgZmxpcEZhY3RvcnkodGhpcykpO1xuICAgIH0sXG5cbiAgICBmaW5kS2V5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZW50cnkgJiYgZW50cnlbMF07XG4gICAgfSxcblxuICAgIGZpbmRMYXN0S2V5OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmZpbmRLZXkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICB9LFxuXG4gICAga2V5T2Y6IGZ1bmN0aW9uKHNlYXJjaFZhbHVlKSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kS2V5KGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpfSk7XG4gICAgfSxcblxuICAgIGxhc3RLZXlPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmRMYXN0S2V5KGZ1bmN0aW9uKHZhbHVlICkge3JldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpfSk7XG4gICAgfSxcblxuICAgIG1hcEVudHJpZXM6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsXG4gICAgICAgIHRoaXMudG9TZXEoKS5tYXAoXG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHtyZXR1cm4gbWFwcGVyLmNhbGwoY29udGV4dCwgW2ssIHZdLCBpdGVyYXRpb25zKyssIHRoaXMkMCl9XG4gICAgICAgICkuZnJvbUVudHJ5U2VxKClcbiAgICAgICk7XG4gICAgfSxcblxuICAgIG1hcEtleXM6IGZ1bmN0aW9uKG1hcHBlciwgY29udGV4dCkge3ZhciB0aGlzJDAgPSB0aGlzO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsXG4gICAgICAgIHRoaXMudG9TZXEoKS5mbGlwKCkubWFwKFxuICAgICAgICAgIGZ1bmN0aW9uKGssIHYpICB7cmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIGssIHYsIHRoaXMkMCl9XG4gICAgICAgICkuZmxpcCgpXG4gICAgICApO1xuICAgIH0sXG5cbiAgfSk7XG5cbiAgdmFyIEtleWVkSXRlcmFibGVQcm90b3R5cGUgPSBLZXllZEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgS2V5ZWRJdGVyYWJsZVByb3RvdHlwZVtJU19LRVlFRF9TRU5USU5FTF0gPSB0cnVlO1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBJdGVyYWJsZVByb3RvdHlwZS5lbnRyaWVzO1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlLl9fdG9KUyA9IEl0ZXJhYmxlUHJvdG90eXBlLnRvT2JqZWN0O1xuICBLZXllZEl0ZXJhYmxlUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBmdW5jdGlvbih2LCBrKSAge3JldHVybiBrICsgJzogJyArIHF1b3RlU3RyaW5nKHYpfTtcblxuXG5cbiAgbWl4aW4oSW5kZXhlZEl0ZXJhYmxlLCB7XG5cbiAgICAvLyAjIyMgQ29udmVyc2lvbiB0byBvdGhlciB0eXBlc1xuXG4gICAgdG9LZXllZFNlcTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCBmYWxzZSk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gICAgZmlsdGVyOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBmaWx0ZXJGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgZmluZEluZGV4OiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gZW50cnkgPyBlbnRyeVswXSA6IC0xO1xuICAgIH0sXG5cbiAgICBpbmRleE9mOiBmdW5jdGlvbihzZWFyY2hWYWx1ZSkge1xuICAgICAgdmFyIGtleSA9IHRoaXMudG9LZXllZFNlcSgpLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/IC0xIDoga2V5O1xuICAgIH0sXG5cbiAgICBsYXN0SW5kZXhPZjogZnVuY3Rpb24oc2VhcmNoVmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmluZGV4T2Yoc2VhcmNoVmFsdWUpO1xuICAgIH0sXG5cbiAgICByZXZlcnNlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCByZXZlcnNlRmFjdG9yeSh0aGlzLCBmYWxzZSkpO1xuICAgIH0sXG5cbiAgICBzbGljZTogZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNsaWNlRmFjdG9yeSh0aGlzLCBiZWdpbiwgZW5kLCBmYWxzZSkpO1xuICAgIH0sXG5cbiAgICBzcGxpY2U6IGZ1bmN0aW9uKGluZGV4LCByZW1vdmVOdW0gLyosIC4uLnZhbHVlcyovKSB7XG4gICAgICB2YXIgbnVtQXJncyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgICByZW1vdmVOdW0gPSBNYXRoLm1heChyZW1vdmVOdW0gfCAwLCAwKTtcbiAgICAgIGlmIChudW1BcmdzID09PSAwIHx8IChudW1BcmdzID09PSAyICYmICFyZW1vdmVOdW0pKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgaW5kZXggPSByZXNvbHZlQmVnaW4oaW5kZXgsIHRoaXMuc2l6ZSk7XG4gICAgICB2YXIgc3BsaWNlZCA9IHRoaXMuc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgcmV0dXJuIHJlaWZ5KFxuICAgICAgICB0aGlzLFxuICAgICAgICBudW1BcmdzID09PSAxID9cbiAgICAgICAgICBzcGxpY2VkIDpcbiAgICAgICAgICBzcGxpY2VkLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cywgMiksIHRoaXMuc2xpY2UoaW5kZXggKyByZW1vdmVOdW0pKVxuICAgICAgKTtcbiAgICB9LFxuXG5cbiAgICAvLyAjIyMgTW9yZSBjb2xsZWN0aW9uIG1ldGhvZHNcblxuICAgIGZpbmRMYXN0SW5kZXg6IGZ1bmN0aW9uKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgICAgdmFyIGtleSA9IHRoaXMudG9LZXllZFNlcSgpLmZpbmRMYXN0S2V5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgPyAtMSA6IGtleTtcbiAgICB9LFxuXG4gICAgZmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KDApO1xuICAgIH0sXG5cbiAgICBmbGF0dGVuOiBmdW5jdGlvbihkZXB0aCkge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZsYXR0ZW5GYWN0b3J5KHRoaXMsIGRlcHRoLCBmYWxzZSkpO1xuICAgIH0sXG5cbiAgICBnZXQ6IGZ1bmN0aW9uKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIChpbmRleCA8IDAgfHwgKHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHxcbiAgICAgICAgICAodGhpcy5zaXplICE9PSB1bmRlZmluZWQgJiYgaW5kZXggPiB0aGlzLnNpemUpKSkgP1xuICAgICAgICBub3RTZXRWYWx1ZSA6XG4gICAgICAgIHRoaXMuZmluZChmdW5jdGlvbihfLCBrZXkpICB7cmV0dXJuIGtleSA9PT0gaW5kZXh9LCB1bmRlZmluZWQsIG5vdFNldFZhbHVlKTtcbiAgICB9LFxuXG4gICAgaGFzOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgKHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgdGhpcy5zaXplID09PSBJbmZpbml0eSB8fCBpbmRleCA8IHRoaXMuc2l6ZSA6XG4gICAgICAgIHRoaXMuaW5kZXhPZihpbmRleCkgIT09IC0xXG4gICAgICApO1xuICAgIH0sXG5cbiAgICBpbnRlcnBvc2U6IGZ1bmN0aW9uKHNlcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGludGVycG9zZUZhY3RvcnkodGhpcywgc2VwYXJhdG9yKSk7XG4gICAgfSxcblxuICAgIGludGVybGVhdmU6IGZ1bmN0aW9uKC8qLi4uaXRlcmFibGVzKi8pIHtcbiAgICAgIHZhciBpdGVyYWJsZXMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG4gICAgICB2YXIgemlwcGVkID0gemlwV2l0aEZhY3RvcnkodGhpcy50b1NlcSgpLCBJbmRleGVkU2VxLm9mLCBpdGVyYWJsZXMpO1xuICAgICAgdmFyIGludGVybGVhdmVkID0gemlwcGVkLmZsYXR0ZW4odHJ1ZSk7XG4gICAgICBpZiAoemlwcGVkLnNpemUpIHtcbiAgICAgICAgaW50ZXJsZWF2ZWQuc2l6ZSA9IHppcHBlZC5zaXplICogaXRlcmFibGVzLmxlbmd0aDtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcmxlYXZlZCk7XG4gICAgfSxcblxuICAgIGxhc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0KC0xKTtcbiAgICB9LFxuXG4gICAgc2tpcFdoaWxlOiBmdW5jdGlvbihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCBza2lwV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgZmFsc2UpKTtcbiAgICB9LFxuXG4gICAgemlwOiBmdW5jdGlvbigvKiwgLi4uaXRlcmFibGVzICovKSB7XG4gICAgICB2YXIgaXRlcmFibGVzID0gW3RoaXNdLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cykpO1xuICAgICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIGRlZmF1bHRaaXBwZXIsIGl0ZXJhYmxlcykpO1xuICAgIH0sXG5cbiAgICB6aXBXaXRoOiBmdW5jdGlvbih6aXBwZXIvKiwgLi4uaXRlcmFibGVzICovKSB7XG4gICAgICB2YXIgaXRlcmFibGVzID0gYXJyQ29weShhcmd1bWVudHMpO1xuICAgICAgaXRlcmFibGVzWzBdID0gdGhpcztcbiAgICAgIHJldHVybiByZWlmeSh0aGlzLCB6aXBXaXRoRmFjdG9yeSh0aGlzLCB6aXBwZXIsIGl0ZXJhYmxlcykpO1xuICAgIH0sXG5cbiAgfSk7XG5cbiAgSW5kZXhlZEl0ZXJhYmxlLnByb3RvdHlwZVtJU19JTkRFWEVEX1NFTlRJTkVMXSA9IHRydWU7XG4gIEluZGV4ZWRJdGVyYWJsZS5wcm90b3R5cGVbSVNfT1JERVJFRF9TRU5USU5FTF0gPSB0cnVlO1xuXG5cblxuICBtaXhpbihTZXRJdGVyYWJsZSwge1xuXG4gICAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gICAgZ2V0OiBmdW5jdGlvbih2YWx1ZSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyh2YWx1ZSkgPyB2YWx1ZSA6IG5vdFNldFZhbHVlO1xuICAgIH0sXG5cbiAgICBjb250YWluczogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB0aGlzLmhhcyh2YWx1ZSk7XG4gICAgfSxcblxuXG4gICAgLy8gIyMjIE1vcmUgc2VxdWVudGlhbCBtZXRob2RzXG5cbiAgICBrZXlTZXE6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudmFsdWVTZXEoKTtcbiAgICB9LFxuXG4gIH0pO1xuXG4gIFNldEl0ZXJhYmxlLnByb3RvdHlwZS5oYXMgPSBJdGVyYWJsZVByb3RvdHlwZS5jb250YWlucztcblxuXG4gIC8vIE1peGluIHN1YmNsYXNzZXNcblxuICBtaXhpbihLZXllZFNlcSwgS2V5ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuICBtaXhpbihJbmRleGVkU2VxLCBJbmRleGVkSXRlcmFibGUucHJvdG90eXBlKTtcbiAgbWl4aW4oU2V0U2VxLCBTZXRJdGVyYWJsZS5wcm90b3R5cGUpO1xuXG4gIG1peGluKEtleWVkQ29sbGVjdGlvbiwgS2V5ZWRJdGVyYWJsZS5wcm90b3R5cGUpO1xuICBtaXhpbihJbmRleGVkQ29sbGVjdGlvbiwgSW5kZXhlZEl0ZXJhYmxlLnByb3RvdHlwZSk7XG4gIG1peGluKFNldENvbGxlY3Rpb24sIFNldEl0ZXJhYmxlLnByb3RvdHlwZSk7XG5cblxuICAvLyAjcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuICBmdW5jdGlvbiBrZXlNYXBwZXIodiwgaykge1xuICAgIHJldHVybiBrO1xuICB9XG5cbiAgZnVuY3Rpb24gZW50cnlNYXBwZXIodiwgaykge1xuICAgIHJldHVybiBbaywgdl07XG4gIH1cblxuICBmdW5jdGlvbiBub3QocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBuZWcocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIC1wcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBxdW90ZVN0cmluZyh2YWx1ZSkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpIDogdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBkZWZhdWx0WmlwcGVyKCkge1xuICAgIHJldHVybiBhcnJDb3B5KGFyZ3VtZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWZhdWx0TmVnQ29tcGFyYXRvcihhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gMSA6IGEgPiBiID8gLTEgOiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaEl0ZXJhYmxlKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlLnNpemUgPT09IEluZmluaXR5KSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgdmFyIG9yZGVyZWQgPSBpc09yZGVyZWQoaXRlcmFibGUpO1xuICAgIHZhciBrZXllZCA9IGlzS2V5ZWQoaXRlcmFibGUpO1xuICAgIHZhciBoID0gb3JkZXJlZCA/IDEgOiAwO1xuICAgIHZhciBzaXplID0gaXRlcmFibGUuX19pdGVyYXRlKFxuICAgICAga2V5ZWQgP1xuICAgICAgICBvcmRlcmVkID9cbiAgICAgICAgICBmdW5jdGlvbih2LCBrKSAgeyBoID0gMzEgKiBoICsgaGFzaE1lcmdlKGhhc2godiksIGhhc2goaykpIHwgMDsgfSA6XG4gICAgICAgICAgZnVuY3Rpb24odiwgaykgIHsgaCA9IGggKyBoYXNoTWVyZ2UoaGFzaCh2KSwgaGFzaChrKSkgfCAwOyB9IDpcbiAgICAgICAgb3JkZXJlZCA/XG4gICAgICAgICAgZnVuY3Rpb24odiApIHsgaCA9IDMxICogaCArIGhhc2godikgfCAwOyB9IDpcbiAgICAgICAgICBmdW5jdGlvbih2ICkgeyBoID0gaCArIGhhc2godikgfCAwOyB9XG4gICAgKTtcbiAgICByZXR1cm4gbXVybXVySGFzaE9mU2l6ZShzaXplLCBoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG11cm11ckhhc2hPZlNpemUoc2l6ZSwgaCkge1xuICAgIGggPSBzcmNfTWF0aF9faW11bChoLCAweENDOUUyRDUxKTtcbiAgICBoID0gc3JjX01hdGhfX2ltdWwoaCA8PCAxNSB8IGggPj4+IC0xNSwgMHgxQjg3MzU5Myk7XG4gICAgaCA9IHNyY19NYXRoX19pbXVsKGggPDwgMTMgfCBoID4+PiAtMTMsIDUpO1xuICAgIGggPSAoaCArIDB4RTY1NDZCNjQgfCAwKSBeIHNpemU7XG4gICAgaCA9IHNyY19NYXRoX19pbXVsKGggXiBoID4+PiAxNiwgMHg4NUVCQ0E2Qik7XG4gICAgaCA9IHNyY19NYXRoX19pbXVsKGggXiBoID4+PiAxMywgMHhDMkIyQUUzNSk7XG4gICAgaCA9IHNtaShoIF4gaCA+Pj4gMTYpO1xuICAgIHJldHVybiBoO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFzaE1lcmdlKGEsIGIpIHtcbiAgICByZXR1cm4gYSBeIGIgKyAweDlFMzc3OUI5ICsgKGEgPDwgNikgKyAoYSA+PiAyKSB8IDA7IC8vIGludFxuICB9XG5cbiAgdmFyIEltbXV0YWJsZSA9IHtcblxuICAgIEl0ZXJhYmxlOiBJdGVyYWJsZSxcblxuICAgIFNlcTogU2VxLFxuICAgIENvbGxlY3Rpb246IENvbGxlY3Rpb24sXG4gICAgTWFwOiBzcmNfTWFwX19NYXAsXG4gICAgT3JkZXJlZE1hcDogT3JkZXJlZE1hcCxcbiAgICBMaXN0OiBMaXN0LFxuICAgIFN0YWNrOiBTdGFjayxcbiAgICBTZXQ6IHNyY19TZXRfX1NldCxcbiAgICBPcmRlcmVkU2V0OiBPcmRlcmVkU2V0LFxuXG4gICAgUmVjb3JkOiBSZWNvcmQsXG4gICAgUmFuZ2U6IFJhbmdlLFxuICAgIFJlcGVhdDogUmVwZWF0LFxuXG4gICAgaXM6IGlzLFxuICAgIGZyb21KUzogZnJvbUpTLFxuXG4gIH07XG5cbiAgcmV0dXJuIEltbXV0YWJsZTtcblxufSkpOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBpbnZhcmlhbnRcbiAqL1xuXG5cInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBVc2UgaW52YXJpYW50KCkgdG8gYXNzZXJ0IHN0YXRlIHdoaWNoIHlvdXIgcHJvZ3JhbSBhc3N1bWVzIHRvIGJlIHRydWUuXG4gKlxuICogUHJvdmlkZSBzcHJpbnRmLXN0eWxlIGZvcm1hdCAob25seSAlcyBpcyBzdXBwb3J0ZWQpIGFuZCBhcmd1bWVudHNcbiAqIHRvIHByb3ZpZGUgaW5mb3JtYXRpb24gYWJvdXQgd2hhdCBicm9rZSBhbmQgd2hhdCB5b3Ugd2VyZVxuICogZXhwZWN0aW5nLlxuICpcbiAqIFRoZSBpbnZhcmlhbnQgbWVzc2FnZSB3aWxsIGJlIHN0cmlwcGVkIGluIHByb2R1Y3Rpb24sIGJ1dCB0aGUgaW52YXJpYW50XG4gKiB3aWxsIHJlbWFpbiB0byBlbnN1cmUgbG9naWMgZG9lcyBub3QgZGlmZmVyIGluIHByb2R1Y3Rpb24uXG4gKi9cblxudmFyIGludmFyaWFudCA9IGZ1bmN0aW9uKGNvbmRpdGlvbiwgZm9ybWF0LCBhLCBiLCBjLCBkLCBlLCBmKSB7XG4gIGlmIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLTIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUga2V5TWlycm9yXG4gKiBAdHlwZWNoZWNrcyBzdGF0aWMtb25seVxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZShcIi4vaW52YXJpYW50XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgcmV0ID0ge307XG4gIHZhciBrZXk7XG4gIChcInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPyBpbnZhcmlhbnQoXG4gICAgb2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaiksXG4gICAgJ2tleU1pcnJvciguLi4pOiBBcmd1bWVudCBtdXN0IGJlIGFuIG9iamVjdC4nXG4gICkgOiBpbnZhcmlhbnQob2JqIGluc3RhbmNlb2YgT2JqZWN0ICYmICFBcnJheS5pc0FycmF5KG9iaikpKTtcbiAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgaWYgKCFvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIHJldFtrZXldID0ga2V5O1xuICB9XG4gIHJldHVybiByZXQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcjtcbiIsIi8qKiBAbW9kdWxlIGFjdGlvbnMvYmFzZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgRGlzcGF0Y2hlciA9IHJlcXVpcmUoJy4uL2Rpc3BhdGNoZXInKTtcblxudmFyIGFwaVN1YnNjcmlwdGlvblNydmMgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9pbmRleCcpLmFwaVN1YnNjcmlwdGlvbnM7XG5cbnZhciBrU3RhdGUgPSByZXF1aXJlKCcuLi9jb25zdGFudHMvc3RhdGVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQWN0aW9ucyB7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuX2Rpc3BhdGNoZXIgPSBEaXNwYXRjaGVyO1xuICB9XG5cbiAgLyoqXG4gICAgKiBTdGFuZGFyZCBEaXNwYXRjaGVyIHBheWxvYWRcbiAgICAqXG4gICAgKiBAcHJvcGVydHkge2ludGVnZXJ9IGFjdGlvblR5cGUgLSBhY3Rpb24gdHlwZSBmcm9tIGNvbnN0YW50cy9hY3Rpb25zXG4gICAgKiBAcHJvcGVydHkge2ludGVnZXJ9IHN5bmNTdGF0ZSAtIHN5bmMgc3RhdGUgd2l0aCBzZXJ2ZXIgZnJvbSBjb250YW50cy9zdGF0ZXNcbiAgICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBkYXRhIC0gcGF5bG9hZCBkYXRhICh0byBiZSBpbnRlcnByZXRlZCBiYXNlZCBvbiBhY3Rpb25UeXBlICYgc3RhdGUpXG4gICAgKlxuICAgICovXG4gIF9tYWtlUGF5bG9hZCAoYWN0aW9uLCBzeW5jU3RhdGUsIGRhdGEpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uVHlwZTogYWN0aW9uLFxuICAgICAgc3luY1N0YXRlOiBzeW5jU3RhdGUsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgX21ldGFfc3RhdGUgcHJvcGVydHkgdG8gU1lOQ0VEIGluIGFsbCBjb250YWluZWQgZW50aXRpZXNcbiAgICogQG1ldGhvZCBfc2V0TWV0YVN0YXRlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBub3JtYWxpemVkRGF0YSAtIHNlcnZlciByZXNwb25zZSB3aGljaCBoYXMgYmVlbiBub3JtYWxpemVkIHdpdGggbm9ybWFsaXpyXG4gICAqL1xuICBfc2V0TWV0YVN0YXRlIChub3JtYWxpemVkRGF0YSwgbWV0YVN0YXRlID0ga1N0YXRlLlNZTkNFRCkge1xuICAgIF8uZWFjaChub3JtYWxpemVkRGF0YS5lbnRpdGllcywgZnVuY3Rpb24gKGVudGl0aWVzKSB7XG4gICAgICBfLmVhY2goZW50aXRpZXMsIGZ1bmN0aW9uIChlbnRpdHkpIHtcbiAgICAgICAgZW50aXR5Ll9tZXRhX3N0YXRlID0gbWV0YVN0YXRlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbm9ybWFsaXplZERhdGE7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgbGlzdCBvZiBwaHlzaWNhbCBjaGFubmVsc1xuICAgKiBAbWV0aG9kIF9nZXRQaHlzaWNhbENoYW5uZWxzXG4gICAqIEBwYXJhbSB7YXJyYXl9IGNoYW5uZWxzXG4gICAqIEBwYXJhbSB7YXJyYXl9IG1ldGhvZHNcbiAgICovXG4gIF9nZXRQaHlzaWNhbENoYW5uZWxzIChjaGFubmVscywgbWV0aG9kcykge1xuICAgIHJldHVybiBfLmZsYXR0ZW4oY2hhbm5lbHMubWFwKGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICByZXR1cm4gbWV0aG9kcy5tYXAoZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgICByZXR1cm4gbWV0aG9kICsgJyAnICsgY2hhbm5lbDtcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKiBTdWJzY3JpYmUgdG8gY2hhbm5lbC5cbiAgICAqIEBtZXRob2QgX3N1YnNjcmliZVxuICAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGNoYW5uZWxzIC0gU3RyaW5nIG9yIGFycmF5IG9mIGNoYW5uZWwgbmFtZXMuXG4gICAgKiBAcGFyYW0ge2FycmF5fSBtZXRob2RzXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gSGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiBldmVudCBvbiBjaGFubmVsIG9jY3Vyc1xuICAgICovXG4gIF9zdWJzY3JpYmUgKGNoYW5uZWxzLCBtZXRob2RzLCBoYW5kbGVyLCBvcHRpb25zKSB7XG5cbiAgICBpZiAoXy5pc1N0cmluZyhjaGFubmVscykpIHtcbiAgICAgIGNoYW5uZWxzID0gW2NoYW5uZWxzXTtcbiAgICB9XG5cbiAgICBpZiAoIV8uaXNBcnJheShtZXRob2RzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtZXRob2RzIGFyZ3VtZW50IG11c3QgYmUgYXJyYXkgb2YgSFRUUCBtZXRob2RzJyk7XG4gICAgfVxuXG4gICAgXy5lYWNoKHRoaXMuX2dldFBoeXNpY2FsQ2hhbm5lbHMoY2hhbm5lbHMsIG1ldGhvZHMpLCBmdW5jdGlvbiAoY2hhbm5lbCkge1xuICAgICAgYXBpU3Vic2NyaXB0aW9uU3J2Yy5zdWJzY3JpYmUoY2hhbm5lbCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKiBVbnN1YnNjcmliZSBmcm9tIGNoYW5uZWwuXG4gICAgKiBAbWV0aG9kIF91bnN1YnNjcmliZVxuICAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGNoYW5uZWxzIC0gU3RyaW5nIG9yIGFycmF5IG9mIGNoYW5uZWwgbmFtZXMuXG4gICAgKiBAcGFyYW0ge2FycmF5fSBtZXRob2RzXG4gICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gSGFuZGxlciB0byBiZSBjYWxsZWQgd2hlbiBldmVudCBvbiBjaGFubmVsIG9jY3Vyc1xuICAgICovXG4gIF91bnN1YnNjcmliZSAoY2hhbm5lbHMsIG1ldGhvZHMsIGhhbmRsZXIpIHtcblxuICAgIGlmIChfLmlzU3RyaW5nKGNoYW5uZWxzKSkge1xuICAgICAgY2hhbm5lbHMgPSBbY2hhbm5lbHNdO1xuICAgIH1cblxuICAgIGlmICghXy5pc0FycmF5KG1ldGhvZHMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21ldGhvZHMgYXJndW1lbnQgbXVzdCBiZSBhcnJheSBvZiBIVFRQIG1ldGhvZHMnKTtcbiAgICB9XG5cbiAgICBfLmVhY2godGhpcy5fZ2V0UGh5c2ljYWxDaGFubmVscyhjaGFubmVscywgbWV0aG9kcyksIGZ1bmN0aW9uIChjaGFubmVsKSB7XG4gICAgICBhcGlTdWJzY3JpcHRpb25TcnZjLnVuc3Vic2NyaWJlKGNoYW5uZWwsIGhhbmRsZXIpO1xuICAgIH0pO1xuXG4gIH1cblxuICAvKiogQ2xlYW4gbGVhZGluZyBIVFRQIHZlcmJzIGZyb20gYSBjaGFubmVsIG5hbWUuXG4gICAqIEBtZXRob2QgX25vcm1hbGl6ZUNoYW5uZWxOYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGFubmVsXG4gICAqL1xuICBfbm9ybWFsaXplQ2hhbm5lbE5hbWUoY2hhbm5lbCl7XG4gICAgcmV0dXJuIGFwaVN1YnNjcmlwdGlvblNydmMubm9ybWFsaXplQ2hhbm5lbE5hbWUoY2hhbm5lbCk7XG4gIH1cblxuICBfY2hlY2tEaXNwYXRjaEFyZ3MgKGFjdGlvbiwgc3luY1N0YXRlKSB7XG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGFjdGlvbiBhcmd1bWVudCB2YWx1ZSBvZiB1bmRlZmluZWQgcGFzc2VkIHRvIGRpc3BhdGNoVXNlckFjdGlvbi4gIFlvdSdyZSBtb3N0IGxpa2VseSByZWZlcmVuY2luZyBhbiBpbnZhbGlkIEFjdGlvbiBjb25zdGFudCAoY29uc3RhbnRzL2FjdGlvbnMuanMpLmApO1xuICAgIH1cbiAgICBpZiAoc3luY1N0YXRlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc3luY1N0YXRlIGFyZ3VtZW50IHZhbHVlIG9mIHVuZGVmaW5lZCBwYXNzZWQgdG8gZGlzcGF0Y2hVc2VyQWN0aW9uLiAgWW91J3JlIG1vc3QgbGlrZWx5IHJlZmVyZW5jaW5nIGFuIGludmFsaWQgU3RhdGUgY29uc3RhbnQgKGNvbnN0YW50cy9zdGF0ZS5qcykuYCk7XG4gICAgfVxuICB9XG4gIC8qKiBEaXNwYXRjaCBzZXJ2ZXIgYWN0aW9uLlxuICAgKiBAbWV0aG9kIGRpc3BhdGNoU2VydmVyQWN0aW9uXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gYWN0aW9uVHlwZSAtIGFjdGlvbiB0eXBlIGZyb20gY29uc3RhbnRzL2FjdGlvbnNcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBzeW5jU3RhdGUgLSBzeW5jIHN0YXRlIHdpdGggc2VydmVyOyBvbmUgb2YgU1lOQ0VELCBSRVFVRVNULCBFUlJPUkVEIGZyb20gY29udGFudHMvc3RhdGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gcGF5bG9hZCBkYXRhICh0byBiZSBpbnRlcnByZXRlZCBiYXNlZCBvbiBhY3Rpb25UeXBlICYgc3RhdGUpXG4gICAqL1xuICBkaXNwYXRjaFNlcnZlckFjdGlvbiAoYWN0aW9uLCBzeW5jU3RhdGUsIGRhdGEpIHtcbiAgICB0aGlzLl9jaGVja0Rpc3BhdGNoQXJncyhhY3Rpb24sIHN5bmNTdGF0ZSk7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX2Rpc3BhdGNoZXIuaGFuZGxlU2VydmVyQWN0aW9uKHRoaXMuX21ha2VQYXlsb2FkKGFjdGlvbiwgc3luY1N0YXRlLCBkYXRhKSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2ggdXNlciBhY3Rpb24uXG4gICAqIEBtZXRob2QgZGlzcGF0Y2hVc2VyQWN0aW9uXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gYWN0aW9uVHlwZSAtIGFjdGlvbiB0eXBlIGZyb20gY29uc3RhbnRzL2FjdGlvbnNcbiAgICogQHBhcmFtIHtpbnRlZ2VyfSBzeW5jU3RhdGUgLSBzeW5jIHN0YXRlIHdpdGggc2VydmVyOyBvbmUgb2YgU1lOQ0VELCBSRVFVRVNULCBFUlJPUkVEIGZyb20gY29udGFudHMvc3RhdGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhIC0gcGF5bG9hZCBkYXRhICh0byBiZSBpbnRlcnByZXRlZCBiYXNlZCBvbiBhY3Rpb25UeXBlICYgc3RhdGUpXG4gICAqL1xuICBkaXNwYXRjaFZpZXdBY3Rpb24gKGFjdGlvbiwgc3luY1N0YXRlLCBkYXRhKSB7XG4gICAgdGhpcy5fY2hlY2tEaXNwYXRjaEFyZ3MoYWN0aW9uLCBzeW5jU3RhdGUpO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9kaXNwYXRjaGVyLmhhbmRsZVZpZXdBY3Rpb24odGhpcy5fbWFrZVBheWxvYWQoYWN0aW9uLCBzeW5jU3RhdGUsIGRhdGEpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICB9XG4gIH1cblxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdllXTjBhVzl1Y3k5aVlYTmxMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxESkNRVUV5UWpzN1FVRkZNMElzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTXhRaXhKUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN08wRkJSVEZETEVsQlFVa3NiVUpCUVcxQ0xFZEJRVWNzVDBGQlR5eERRVUZETEcxQ1FVRnRRaXhEUVVGRExFTkJRVU1zWjBKQlFXZENMRU5CUVVNN08wRkJSWGhGTEVsQlFVa3NUVUZCVFN4SFFVRkhMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPenRCUVVVMVF5eE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhMRTFCUVUwc1QwRkJUeXhEUVVGRE96dEZRVVUzUWl4WFFVRlhMRWxCUVVrN1NVRkRZaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEZWQlFWVXNRMEZCUXp0QlFVTnNReXhIUVVGSE8wRkJRMGc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UlVGRlJTeFpRVUZaTERKQ1FVRXlRanRKUVVOeVF5eFBRVUZQTzAxQlEwd3NWVUZCVlN4RlFVRkZMRTFCUVUwN1RVRkRiRUlzVTBGQlV5eEZRVUZGTEZOQlFWTTdUVUZEY0VJc1NVRkJTU3hGUVVGRkxFbEJRVWs3UzBGRFdDeERRVUZETzBGQlEwNHNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBWQlJVVXNZVUZCWVN3MlEwRkJOa003U1VGRGVFUXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVVVGQlVTeEZRVUZGTEZWQlFWVXNVVUZCVVN4RlFVRkZPMDFCUTJ4RUxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4RlFVRkZMRlZCUVZVc1RVRkJUU3hGUVVGRk8xRkJRMnBETEUxQlFVMHNRMEZCUXl4WFFVRlhMRWRCUVVjc1UwRkJVeXhEUVVGRE8wOUJRMmhETEVOQlFVTXNRMEZCUXp0QlFVTlVMRXRCUVVzc1EwRkJReXhEUVVGRE96dEpRVVZJTEU5QlFVOHNZMEZCWXl4RFFVRkRPMEZCUXpGQ0xFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wVkJSVVVzYjBKQlFXOUNMSEZDUVVGeFFqdEpRVU4yUXl4UFFVRlBMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVkQlFVY3NRMEZCUXl4VlFVRlZMRTlCUVU4c1JVRkJSVHROUVVNdlF5eFBRVUZQTEU5QlFVOHNRMEZCUXl4SFFVRkhMRU5CUVVNc1ZVRkJWU3hOUVVGTkxFVkJRVVU3VVVGRGJrTXNUMEZCVHl4TlFVRk5MRWRCUVVjc1IwRkJSeXhIUVVGSExFOUJRVThzUTBGQlF6dFBRVU12UWl4RFFVRkRMRU5CUVVNN1MwRkRTaXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU5TTEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBGQlJVRXNSVUZCUlN4VlFVRlZMSFZEUVVGMVF6czdTVUZGTDBNc1NVRkJTU3hEUVVGRExFTkJRVU1zVVVGQlVTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkZPMDFCUTNoQ0xGRkJRVkVzUjBGQlJ5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXpWQ0xFdEJRVXM3TzBsQlJVUXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zVDBGQlR5eERRVUZETEVWQlFVVTdUVUZEZGtJc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eG5SRUZCWjBRc1EwRkJReXhEUVVGRE8wRkJRM2hGTEV0QlFVczdPMGxCUlVRc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVVVGQlVTeEZRVUZGTEU5QlFVOHNRMEZCUXl4RlFVRkZMRlZCUVZVc1QwRkJUeXhGUVVGRk8wMUJRM1JGTEcxQ1FVRnRRaXhEUVVGRExGTkJRVk1zUTBGQlF5eFBRVUZQTEVWQlFVVXNUMEZCVHl4RlFVRkZMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJReTlFTEV0QlFVc3NRMEZCUXl4RFFVRkRPenRCUVVWUUxFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wRkJSVUVzUlVGQlJTeFpRVUZaTERoQ1FVRTRRanM3U1VGRmVFTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1VVRkJVU3hEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZGTzAxQlEzaENMRkZCUVZFc1IwRkJSeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZETzBGQlF6VkNMRXRCUVVzN08wbEJSVVFzU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXl4UFFVRlBMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3VFVGRGRrSXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXhuUkVGQlowUXNRMEZCUXl4RFFVRkRPMEZCUTNoRkxFdEJRVXM3TzBsQlJVUXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1VVRkJVU3hGUVVGRkxFOUJRVThzUTBGQlF5eEZRVUZGTEZWQlFWVXNUMEZCVHl4RlFVRkZPMDFCUTNSRkxHMUNRVUZ0UWl4RFFVRkRMRmRCUVZjc1EwRkJReXhQUVVGUExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZUVRc1MwRkJTeXhEUVVGRExFTkJRVU03TzBGQlJWQXNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEZRVVZGTEhGQ1FVRnhRaXhUUVVGVE8wbEJRelZDTEU5QlFVOHNiVUpCUVcxQ0xFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRE4wUXNSMEZCUnpzN1JVRkZSQ3hyUWtGQmEwSXNjVUpCUVhGQ08wbEJRM0pETEVsQlFVa3NUVUZCVFN4TFFVRkxMRk5CUVZNc1JVRkJSVHROUVVONFFpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMSEZLUVVGeFNpeERRVUZETEVOQlFVTTdTMEZEZUVzN1NVRkRSQ3hKUVVGSkxGTkJRVk1zUzBGQlN5eFRRVUZUTEVWQlFVVTdUVUZETTBJc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eHhTa0ZCY1Vvc1EwRkJReXhEUVVGRE8wdEJRM2hMTzBGQlEwd3NSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBWQlJVVXNiMEpCUVc5Q0xESkNRVUV5UWp0SlFVTTNReXhKUVVGSkxFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1RVRkJUU3hGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzBsQlF6TkRMRWxCUVVrN1RVRkRSaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEd0Q1FVRnJRaXhEUVVGRExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RlFVRkZMRk5CUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzB0QlEycEdPMGxCUTBRc1QwRkJUeXhIUVVGSExFVkJRVVU3VFVGRFZpeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dExRVU14UWp0QlFVTk1MRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMFZCUlVVc2EwSkJRV3RDTERKQ1FVRXlRanRKUVVNelF5eEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zVFVGQlRTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMGxCUXpORExFbEJRVWs3VFVGRFJpeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMR2RDUVVGblFpeERRVUZETEVsQlFVa3NRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMHRCUXk5Rk8wbEJRMFFzVDBGQlR5eEhRVUZITEVWQlFVVTdUVUZEVml4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0TFFVTjRRanRCUVVOTUxFZEJRVWM3TzBOQlJVWXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFLaUJBYlc5a2RXeGxJR0ZqZEdsdmJuTXZZbUZ6WlNBcUwxeHVYRzRuZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCZklEMGdjbVZ4ZFdseVpTZ25iRzlrWVhOb0p5azdYRzUyWVhJZ1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KeTR1TDJScGMzQmhkR05vWlhJbktUdGNibHh1ZG1GeUlHRndhVk4xWW5OamNtbHdkR2x2YmxOeWRtTWdQU0J5WlhGMWFYSmxLQ2N1TGk5elpYSjJhV05sY3k5cGJtUmxlQ2NwTG1Gd2FWTjFZbk5qY21sd2RHbHZibk03WEc1Y2JuWmhjaUJyVTNSaGRHVWdQU0J5WlhGMWFYSmxLQ2N1TGk5amIyNXpkR0Z1ZEhNdmMzUmhkR1Z6SnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdZMnhoYzNNZ1FXTjBhVzl1Y3lCN1hHNWNiaUFnWTI5dWMzUnlkV04wYjNJZ0tDa2dlMXh1SUNBZ0lIUm9hWE11WDJScGMzQmhkR05vWlhJZ1BTQkVhWE53WVhSamFHVnlPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FnS2lCVGRHRnVaR0Z5WkNCRWFYTndZWFJqYUdWeUlIQmhlV3h2WVdSY2JpQWdJQ0FxWEc0Z0lDQWdLaUJBY0hKdmNHVnlkSGtnZTJsdWRHVm5aWEo5SUdGamRHbHZibFI1Y0dVZ0xTQmhZM1JwYjI0Z2RIbHdaU0JtY205dElHTnZibk4wWVc1MGN5OWhZM1JwYjI1elhHNGdJQ0FnS2lCQWNISnZjR1Z5ZEhrZ2UybHVkR1ZuWlhKOUlITjVibU5UZEdGMFpTQXRJSE41Ym1NZ2MzUmhkR1VnZDJsMGFDQnpaWEoyWlhJZ1puSnZiU0JqYjI1MFlXNTBjeTl6ZEdGMFpYTmNiaUFnSUNBcUlFQndjbTl3WlhKMGVTQjdiMkpxWldOMGZTQmtZWFJoSUMwZ2NHRjViRzloWkNCa1lYUmhJQ2gwYnlCaVpTQnBiblJsY25CeVpYUmxaQ0JpWVhObFpDQnZiaUJoWTNScGIyNVVlWEJsSUNZZ2MzUmhkR1VwWEc0Z0lDQWdLbHh1SUNBZ0lDb3ZYRzRnSUY5dFlXdGxVR0Y1Ykc5aFpDQW9ZV04wYVc5dUxDQnplVzVqVTNSaGRHVXNJR1JoZEdFcElIdGNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnWVdOMGFXOXVWSGx3WlRvZ1lXTjBhVzl1TEZ4dUlDQWdJQ0FnYzNsdVkxTjBZWFJsT2lCemVXNWpVM1JoZEdVc1hHNGdJQ0FnSUNCa1lYUmhPaUJrWVhSaFhHNGdJQ0FnZlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlRaWFFnWDIxbGRHRmZjM1JoZEdVZ2NISnZjR1Z5ZEhrZ2RHOGdVMWxPUTBWRUlHbHVJR0ZzYkNCamIyNTBZV2x1WldRZ1pXNTBhWFJwWlhOY2JpQWdJQ29nUUcxbGRHaHZaQ0JmYzJWMFRXVjBZVk4wWVhSbFhHNGdJQ0FxSUVCd1lYSmhiU0I3YjJKcVpXTjBmU0J1YjNKdFlXeHBlbVZrUkdGMFlTQXRJSE5sY25abGNpQnlaWE53YjI1elpTQjNhR2xqYUNCb1lYTWdZbVZsYmlCdWIzSnRZV3hwZW1Wa0lIZHBkR2dnYm05eWJXRnNhWHB5WEc0Z0lDQXFMMXh1SUNCZmMyVjBUV1YwWVZOMFlYUmxJQ2h1YjNKdFlXeHBlbVZrUkdGMFlTd2diV1YwWVZOMFlYUmxJRDBnYTFOMFlYUmxMbE5aVGtORlJDa2dlMXh1SUNBZ0lGOHVaV0ZqYUNodWIzSnRZV3hwZW1Wa1JHRjBZUzVsYm5ScGRHbGxjeXdnWm5WdVkzUnBiMjRnS0dWdWRHbDBhV1Z6S1NCN1hHNGdJQ0FnSUNCZkxtVmhZMmdvWlc1MGFYUnBaWE1zSUdaMWJtTjBhVzl1SUNobGJuUnBkSGtwSUh0Y2JpQWdJQ0FnSUNBZ1pXNTBhWFI1TGw5dFpYUmhYM04wWVhSbElEMGdiV1YwWVZOMFlYUmxPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc1Y2JpQWdJQ0J5WlhSMWNtNGdibTl5YldGc2FYcGxaRVJoZEdFN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlZ1WlhKaGRHVWdiR2x6ZENCdlppQndhSGx6YVdOaGJDQmphR0Z1Ym1Wc2MxeHVJQ0FnS2lCQWJXVjBhRzlrSUY5blpYUlFhSGx6YVdOaGJFTm9ZVzV1Wld4elhHNGdJQ0FxSUVCd1lYSmhiU0I3WVhKeVlYbDlJR05vWVc1dVpXeHpYRzRnSUNBcUlFQndZWEpoYlNCN1lYSnlZWGw5SUcxbGRHaHZaSE5jYmlBZ0lDb3ZYRzRnSUY5blpYUlFhSGx6YVdOaGJFTm9ZVzV1Wld4eklDaGphR0Z1Ym1Wc2N5d2diV1YwYUc5a2N5a2dlMXh1SUNBZ0lISmxkSFZ5YmlCZkxtWnNZWFIwWlc0b1kyaGhibTVsYkhNdWJXRndLR1oxYm1OMGFXOXVJQ2hqYUdGdWJtVnNLU0I3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdiV1YwYUc5a2N5NXRZWEFvWm5WdVkzUnBiMjRnS0cxbGRHaHZaQ2tnZTF4dUlDQWdJQ0FnSUNCeVpYUjFjbTRnYldWMGFHOWtJQ3NnSnlBbklDc2dZMmhoYm01bGJEdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtpQlRkV0p6WTNKcFltVWdkRzhnWTJoaGJtNWxiQzVjYmlBZ0lDQXFJRUJ0WlhSb2IyUWdYM04xWW5OamNtbGlaVnh1SUNBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOFlYSnlZWGw5SUdOb1lXNXVaV3h6SUMwZ1UzUnlhVzVuSUc5eUlHRnljbUY1SUc5bUlHTm9ZVzV1Wld3Z2JtRnRaWE11WEc0Z0lDQWdLaUJBY0dGeVlXMGdlMkZ5Y21GNWZTQnRaWFJvYjJSelhHNGdJQ0FnS2lCQWNHRnlZVzBnZTJaMWJtTjBhVzl1ZlNCb1lXNWtiR1Z5SUMwZ1NHRnVaR3hsY2lCMGJ5QmlaU0JqWVd4c1pXUWdkMmhsYmlCbGRtVnVkQ0J2YmlCamFHRnVibVZzSUc5alkzVnljMXh1SUNBZ0lDb3ZYRzRnSUY5emRXSnpZM0pwWW1VZ0tHTm9ZVzV1Wld4ekxDQnRaWFJvYjJSekxDQm9ZVzVrYkdWeUxDQnZjSFJwYjI1ektTQjdYRzVjYmlBZ0lDQnBaaUFvWHk1cGMxTjBjbWx1WnloamFHRnVibVZzY3lrcElIdGNiaUFnSUNBZ0lHTm9ZVzV1Wld4eklEMGdXMk5vWVc1dVpXeHpYVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvSVY4dWFYTkJjbkpoZVNodFpYUm9iMlJ6S1NrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkdFpYUm9iMlJ6SUdGeVozVnRaVzUwSUcxMWMzUWdZbVVnWVhKeVlYa2diMllnU0ZSVVVDQnRaWFJvYjJSekp5azdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1h5NWxZV05vS0hSb2FYTXVYMmRsZEZCb2VYTnBZMkZzUTJoaGJtNWxiSE1vWTJoaGJtNWxiSE1zSUcxbGRHaHZaSE1wTENCbWRXNWpkR2x2YmlBb1kyaGhibTVsYkNrZ2UxeHVJQ0FnSUNBZ1lYQnBVM1ZpYzJOeWFYQjBhVzl1VTNKMll5NXpkV0p6WTNKcFltVW9ZMmhoYm01bGJDd2dhR0Z1Wkd4bGNpd2diM0IwYVc5dWN5azdYRzRnSUNBZ2ZTazdYRzVjYmlBZ2ZWeHVYRzRnSUM4cUtpQlZibk4xWW5OamNtbGlaU0JtY205dElHTm9ZVzV1Wld3dVhHNGdJQ0FnS2lCQWJXVjBhRzlrSUY5MWJuTjFZbk5qY21saVpWeHVJQ0FnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ4WVhKeVlYbDlJR05vWVc1dVpXeHpJQzBnVTNSeWFXNW5JRzl5SUdGeWNtRjVJRzltSUdOb1lXNXVaV3dnYm1GdFpYTXVYRzRnSUNBZ0tpQkFjR0Z5WVcwZ2UyRnljbUY1ZlNCdFpYUm9iMlJ6WEc0Z0lDQWdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVmU0JvWVc1a2JHVnlJQzBnU0dGdVpHeGxjaUIwYnlCaVpTQmpZV3hzWldRZ2QyaGxiaUJsZG1WdWRDQnZiaUJqYUdGdWJtVnNJRzlqWTNWeWMxeHVJQ0FnSUNvdlhHNGdJRjkxYm5OMVluTmpjbWxpWlNBb1kyaGhibTVsYkhNc0lHMWxkR2h2WkhNc0lHaGhibVJzWlhJcElIdGNibHh1SUNBZ0lHbG1JQ2hmTG1selUzUnlhVzVuS0dOb1lXNXVaV3h6S1NrZ2UxeHVJQ0FnSUNBZ1kyaGhibTVsYkhNZ1BTQmJZMmhoYm01bGJITmRPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHbG1JQ2doWHk1cGMwRnljbUY1S0cxbGRHaHZaSE1wS1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvSjIxbGRHaHZaSE1nWVhKbmRXMWxiblFnYlhWemRDQmlaU0JoY25KaGVTQnZaaUJJVkZSUUlHMWxkR2h2WkhNbktUdGNiaUFnSUNCOVhHNWNiaUFnSUNCZkxtVmhZMmdvZEdocGN5NWZaMlYwVUdoNWMybGpZV3hEYUdGdWJtVnNjeWhqYUdGdWJtVnNjeXdnYldWMGFHOWtjeWtzSUdaMWJtTjBhVzl1SUNoamFHRnVibVZzS1NCN1hHNGdJQ0FnSUNCaGNHbFRkV0p6WTNKcGNIUnBiMjVUY25aakxuVnVjM1ZpYzJOeWFXSmxLR05vWVc1dVpXd3NJR2hoYm1Sc1pYSXBPMXh1SUNBZ0lIMHBPMXh1WEc0Z0lIMWNibHh1SUNBdktpb2dRMnhsWVc0Z2JHVmhaR2x1WnlCSVZGUlFJSFpsY21KeklHWnliMjBnWVNCamFHRnVibVZzSUc1aGJXVXVYRzRnSUNBcUlFQnRaWFJvYjJRZ1gyNXZjbTFoYkdsNlpVTm9ZVzV1Wld4T1lXMWxYRzRnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCamFHRnVibVZzWEc0Z0lDQXFMMXh1SUNCZmJtOXliV0ZzYVhwbFEyaGhibTVsYkU1aGJXVW9ZMmhoYm01bGJDbDdYRzRnSUNBZ2NtVjBkWEp1SUdGd2FWTjFZbk5qY21sd2RHbHZibE55ZG1NdWJtOXliV0ZzYVhwbFEyaGhibTVsYkU1aGJXVW9ZMmhoYm01bGJDazdYRzRnSUgxY2JseHVJQ0JmWTJobFkydEVhWE53WVhSamFFRnlaM01nS0dGamRHbHZiaXdnYzNsdVkxTjBZWFJsS1NCN1hHNGdJQ0FnYVdZZ0tHRmpkR2x2YmlBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9ZR0ZqZEdsdmJpQmhjbWQxYldWdWRDQjJZV3gxWlNCdlppQjFibVJsWm1sdVpXUWdjR0Z6YzJWa0lIUnZJR1JwYzNCaGRHTm9WWE5sY2tGamRHbHZiaTRnSUZsdmRTZHlaU0J0YjNOMElHeHBhMlZzZVNCeVpXWmxjbVZ1WTJsdVp5QmhiaUJwYm5aaGJHbGtJRUZqZEdsdmJpQmpiMjV6ZEdGdWRDQW9ZMjl1YzNSaGJuUnpMMkZqZEdsdmJuTXVhbk1wTG1BcE8xeHVJQ0FnSUgxY2JpQWdJQ0JwWmlBb2MzbHVZMU4wWVhSbElEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhnYzNsdVkxTjBZWFJsSUdGeVozVnRaVzUwSUhaaGJIVmxJRzltSUhWdVpHVm1hVzVsWkNCd1lYTnpaV1FnZEc4Z1pHbHpjR0YwWTJoVmMyVnlRV04wYVc5dUxpQWdXVzkxSjNKbElHMXZjM1FnYkdsclpXeDVJSEpsWm1WeVpXNWphVzVuSUdGdUlHbHVkbUZzYVdRZ1UzUmhkR1VnWTI5dWMzUmhiblFnS0dOdmJuTjBZVzUwY3k5emRHRjBaUzVxY3lrdVlDazdYRzRnSUNBZ2ZWeHVJQ0I5WEc0Z0lDOHFLaUJFYVhOd1lYUmphQ0J6WlhKMlpYSWdZV04wYVc5dUxseHVJQ0FnS2lCQWJXVjBhRzlrSUdScGMzQmhkR05vVTJWeWRtVnlRV04wYVc5dVhHNGdJQ0FxSUVCd1lYSmhiU0I3YVc1MFpXZGxjbjBnWVdOMGFXOXVWSGx3WlNBdElHRmpkR2x2YmlCMGVYQmxJR1p5YjIwZ1kyOXVjM1JoYm5SekwyRmpkR2x2Ym5OY2JpQWdJQ29nUUhCaGNtRnRJSHRwYm5SbFoyVnlmU0J6ZVc1alUzUmhkR1VnTFNCemVXNWpJSE4wWVhSbElIZHBkR2dnYzJWeWRtVnlPeUJ2Ym1VZ2IyWWdVMWxPUTBWRUxDQlNSVkZWUlZOVUxDQkZVbEpQVWtWRUlHWnliMjBnWTI5dWRHRnVkSE12YzNSaGRHVnpYRzRnSUNBcUlFQndZWEpoYlNCN2IySnFaV04wZlNCa1lYUmhJQzBnY0dGNWJHOWhaQ0JrWVhSaElDaDBieUJpWlNCcGJuUmxjbkJ5WlhSbFpDQmlZWE5sWkNCdmJpQmhZM1JwYjI1VWVYQmxJQ1lnYzNSaGRHVXBYRzRnSUNBcUwxeHVJQ0JrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmlBb1lXTjBhVzl1TENCemVXNWpVM1JoZEdVc0lHUmhkR0VwSUh0Y2JpQWdJQ0IwYUdsekxsOWphR1ZqYTBScGMzQmhkR05vUVhKbmN5aGhZM1JwYjI0c0lITjVibU5UZEdGMFpTazdYRzRnSUNBZ2RISjVJSHRjYmlBZ0lDQWdJSFJvYVhNdVgyUnBjM0JoZEdOb1pYSXVhR0Z1Wkd4bFUyVnlkbVZ5UVdOMGFXOXVLSFJvYVhNdVgyMWhhMlZRWVhsc2IyRmtLR0ZqZEdsdmJpd2djM2x1WTFOMFlYUmxMQ0JrWVhSaEtTazdYRzRnSUNBZ2ZWeHVJQ0FnSUdOaGRHTm9JQ2hsY25JcElIdGNiaUFnSUNBZ0lHTnZibk52YkdVdVpYSnliM0lvWlhKeUxuTjBZV05yS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpb2dSR2x6Y0dGMFkyZ2dkWE5sY2lCaFkzUnBiMjR1WEc0Z0lDQXFJRUJ0WlhSb2IyUWdaR2x6Y0dGMFkyaFZjMlZ5UVdOMGFXOXVYRzRnSUNBcUlFQndZWEpoYlNCN2FXNTBaV2RsY24wZ1lXTjBhVzl1Vkhsd1pTQXRJR0ZqZEdsdmJpQjBlWEJsSUdaeWIyMGdZMjl1YzNSaGJuUnpMMkZqZEdsdmJuTmNiaUFnSUNvZ1FIQmhjbUZ0SUh0cGJuUmxaMlZ5ZlNCemVXNWpVM1JoZEdVZ0xTQnplVzVqSUhOMFlYUmxJSGRwZEdnZ2MyVnlkbVZ5T3lCdmJtVWdiMllnVTFsT1EwVkVMQ0JTUlZGVlJWTlVMQ0JGVWxKUFVrVkVJR1p5YjIwZ1kyOXVkR0Z1ZEhNdmMzUmhkR1Z6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdiMkpxWldOMGZTQmtZWFJoSUMwZ2NHRjViRzloWkNCa1lYUmhJQ2gwYnlCaVpTQnBiblJsY25CeVpYUmxaQ0JpWVhObFpDQnZiaUJoWTNScGIyNVVlWEJsSUNZZ2MzUmhkR1VwWEc0Z0lDQXFMMXh1SUNCa2FYTndZWFJqYUZacFpYZEJZM1JwYjI0Z0tHRmpkR2x2Yml3Z2MzbHVZMU4wWVhSbExDQmtZWFJoS1NCN1hHNGdJQ0FnZEdocGN5NWZZMmhsWTJ0RWFYTndZWFJqYUVGeVozTW9ZV04wYVc5dUxDQnplVzVqVTNSaGRHVXBPMXh1SUNBZ0lIUnllU0I3WEc0Z0lDQWdJQ0IwYUdsekxsOWthWE53WVhSamFHVnlMbWhoYm1Sc1pWWnBaWGRCWTNScGIyNG9kR2hwY3k1ZmJXRnJaVkJoZVd4dllXUW9ZV04wYVc5dUxDQnplVzVqVTNSaGRHVXNJR1JoZEdFcEtUdGNiaUFnSUNCOVhHNGdJQ0FnWTJGMFkyZ2dLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ1kyOXVjMjlzWlM1c2IyY29aWEp5TG5OMFlXTnJLVHRjYmlBZ0lDQjlYRzRnSUgxY2JseHVmVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9hY3Rpb25zJyk7XG52YXIga1N0YXRlcyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9zdGF0ZXMnKTtcblxudmFyIGFqYXggPSByZXF1aXJlKCcuLi9jb21tb24vYWpheCcpO1xudmFyIG1ldGVyZWRHRVQgPSByZXF1aXJlKCcuLi9jb21tb24vbWV0ZXJlZC1yZXF1ZXN0JykuZ2V0O1xuXG52YXIgQmFzZUFjdGlvbiA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG4vLyB1c2VkIGZvciBnZW5lcmF0aW5nIGNsaWVudC1zaWRlIGlkcyBmb3IgbmV3IGVudHJpZXNcbnZhciBfY2lkID0gMDtcblxuY2xhc3MgSXRlbUFjdGlvbnMgZXh0ZW5kcyBCYXNlQWN0aW9uIHtcblxuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGdldEFsbCgpIHtcbiAgICBtZXRlcmVkR0VUKFxuICAgICAgJy9hcGkvaXRlbXMnLFxuICAgICAgKCkgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5JVEVNX0dFVEFMTCwga1N0YXRlcy5MT0FESU5HKSxcbiAgICAgIGRhdGEgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5JVEVNX0dFVEFMTCwga1N0YXRlcy5TWU5DRUQsIGRhdGEpLFxuICAgICAgZXJyID0+IHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oa0FjdGlvbnMuSVRFTV9HRVRBTEwsIGtTdGF0ZXMuRVJST1JFRCwgZXJyKVxuICAgICk7XG4gIH1cblxuICByZXF1ZXN0Q3JlYXRlRW50cnkgKGZpcnN0LCBsYXN0KSB7XG5cbiAgICBjb25zb2xlLmRlYnVnKGAke3RoaXMuZ2V0Q2xhc3NuYW1lKCl9OnJlcXVlc3RDcmVhdGVFbnRyeWApO1xuXG4gICAgdmFyIGNpZCA9ICdjJyArIChfY2lkICs9IDEpLFxuICAgICAgICBwYXlsb2FkID0geyBjaWQ6IGNpZCwgZmlyc3Q6IGZpcnN0LCBsYXN0OiBsYXN0IH07XG5cbiAgICBhamF4KHtcbiAgICAgIHVybDogXCIvYXBpL2l0ZW1zXCIsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICBhY2NlcHRzOiB7XG4gICAgICAgICdqc29uJzogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICd0ZXh0JzogJ3RleHQvcGxhaW4nXG4gICAgICB9XG4gICAgfSlcbiAgICAudGhlbihmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5JVEVNX1BPU1QsIGtTdGF0ZXMuU1lOQ0VELCBkYXRhKTtcbiAgICB9LmJpbmQodGhpcykpXG4gICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oa0FjdGlvbnMuSVRFTV9QT1NULCBrU3RhdGVzLkVSUk9SRUQsIGVycik7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZGlzcGF0Y2hTZXJ2ZXJBY3Rpb24oa0FjdGlvbnMuSVRFTV9QT1NULCBrU3RhdGVzLk5FVywgcGF5bG9hZCk7XG4gIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBJdGVtQWN0aW9ucygpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12WVdOMGFXOXVjeTlwZEdWdGN5NXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMSE5DUVVGelFpeERRVUZETEVOQlFVTTdRVUZETDBNc1NVRkJTU3hQUVVGUExFZEJRVWNzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03TzBGQlJUZERMRWxCUVVrc1NVRkJTU3hIUVVGSExFOUJRVThzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhEUVVGRE8wRkJRM0pETEVsQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXd5UWtGQk1rSXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJRenM3UVVGRk1VUXNTVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVnVReXh6UkVGQmMwUTdRVUZEZEVRc1NVRkJTU3hKUVVGSkxFZEJRVWNzUTBGQlF5eERRVUZET3p0QlFVVmlMRTFCUVUwc1YwRkJWeXhUUVVGVExGVkJRVlVzUTBGQlF6czdSVUZGYmtNc1YwRkJWeXhKUVVGSk8wbEJRMklzUzBGQlN5eEZRVUZGTEVOQlFVTTdRVUZEV2l4SFFVRkhPenRGUVVWRUxFMUJRVTBzUjBGQlJ6dEpRVU5RTEZWQlFWVTdUVUZEVWl4WlFVRlpPMDFCUTFvc1RVRkJUU3hKUVVGSkxFTkJRVU1zYjBKQlFXOUNMRU5CUVVNc1VVRkJVU3hEUVVGRExGZEJRVmNzUlVGQlJTeFBRVUZQTEVOQlFVTXNUMEZCVHl4RFFVRkRPMDFCUTNSRkxFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNiMEpCUVc5Q0xFTkJRVU1zVVVGQlVTeERRVUZETEZkQlFWY3NSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUTBGQlF6dE5RVU0zUlN4SFFVRkhMRWxCUVVrc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRkZCUVZFc1EwRkJReXhYUVVGWExFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVOHNSVUZCUlN4SFFVRkhMRU5CUVVNN1MwRkROMFVzUTBGQlF6dEJRVU5PTEVkQlFVYzdPMEZCUlVnc1JVRkJSU3hyUWtGQmEwSXNaVUZCWlRzN1FVRkZia01zU1VGQlNTeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUlVGQlJTeHhRa0ZCY1VJc1EwRkJReXhEUVVGRE96dEpRVVV6UkN4SlFVRkpMRWRCUVVjc1IwRkJSeXhIUVVGSExFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTXZRaXhSUVVGUkxFOUJRVThzUjBGQlJ5eEZRVUZGTEVkQlFVY3NSVUZCUlN4SFFVRkhMRVZCUVVVc1MwRkJTeXhGUVVGRkxFdEJRVXNzUlVGQlJTeEpRVUZKTEVWQlFVVXNTVUZCU1N4RlFVRkZMRU5CUVVNN08wbEJSWEpFTEVsQlFVa3NRMEZCUXp0TlFVTklMRWRCUVVjc1JVRkJSU3haUVVGWk8wMUJRMnBDTEVsQlFVa3NSVUZCUlN4TlFVRk5PMDFCUTFvc1NVRkJTU3hGUVVGRkxFOUJRVTg3VFVGRFlpeFBRVUZQTEVWQlFVVTdVVUZEVUN4TlFVRk5MRVZCUVVVc2EwSkJRV3RDTzFGQlF6RkNMRTFCUVUwc1JVRkJSU3haUVVGWk8wOUJRM0pDTzB0QlEwWXNRMEZCUXp0TFFVTkVMRWxCUVVrc1EwRkJReXhWUVVGVkxFbEJRVWtzUlVGQlJUdE5RVU53UWl4SlFVRkpMRU5CUVVNc2IwSkJRVzlDTEVOQlFVTXNVVUZCVVN4RFFVRkRMRk5CUVZNc1JVRkJSU3hQUVVGUExFTkJRVU1zVFVGQlRTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTNKRkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMHRCUTFvc1MwRkJTeXhEUVVGRExGVkJRVlVzUjBGQlJ5eEZRVUZGTzAxQlEzQkNMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4UlFVRlJMRU5CUVVNc1UwRkJVeXhGUVVGRkxFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRNVVVzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE96dEpRVVZrTEVsQlFVa3NRMEZCUXl4dlFrRkJiMElzUTBGQlF5eFJRVUZSTEVOQlFVTXNVMEZCVXl4RlFVRkZMRTlCUVU4c1EwRkJReXhIUVVGSExFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEZUVVc1IwRkJSenM3UVVGRlNDeERRVUZET3p0QlFVVkVMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzU1VGQlNTeFhRVUZYTEVWQlFVVXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJR3RCWTNScGIyNXpJRDBnY21WeGRXbHlaU2duTGk0dlkyOXVjM1JoYm5SekwyRmpkR2x2Ym5NbktUdGNiblpoY2lCclUzUmhkR1Z6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl1YzNSaGJuUnpMM04wWVhSbGN5Y3BPMXh1WEc1MllYSWdZV3BoZUNBOUlISmxjWFZwY21Vb0p5NHVMMk52YlcxdmJpOWhhbUY0SnlrN1hHNTJZWElnYldWMFpYSmxaRWRGVkNBOUlISmxjWFZwY21Vb0p5NHVMMk52YlcxdmJpOXRaWFJsY21Wa0xYSmxjWFZsYzNRbktTNW5aWFE3WEc1Y2JuWmhjaUJDWVhObFFXTjBhVzl1SUQwZ2NtVnhkV2x5WlNnbkxpOWlZWE5sSnlrN1hHNWNiaTh2SUhWelpXUWdabTl5SUdkbGJtVnlZWFJwYm1jZ1kyeHBaVzUwTFhOcFpHVWdhV1J6SUdadmNpQnVaWGNnWlc1MGNtbGxjMXh1ZG1GeUlGOWphV1FnUFNBd08xeHVYRzVqYkdGemN5QkpkR1Z0UVdOMGFXOXVjeUJsZUhSbGJtUnpJRUpoYzJWQlkzUnBiMjRnZTF4dVhHNGdJR052Ym5OMGNuVmpkRzl5SUNncElIdGNiaUFnSUNCemRYQmxjaWdwTzF4dUlDQjlYRzVjYmlBZ1oyVjBRV3hzS0NrZ2UxeHVJQ0FnSUcxbGRHVnlaV1JIUlZRb1hHNGdJQ0FnSUNBbkwyRndhUzlwZEdWdGN5Y3NYRzRnSUNBZ0lDQW9LU0E5UGlCMGFHbHpMbVJwYzNCaGRHTm9VMlZ5ZG1WeVFXTjBhVzl1S0d0QlkzUnBiMjV6TGtsVVJVMWZSMFZVUVV4TUxDQnJVM1JoZEdWekxreFBRVVJKVGtjcExGeHVJQ0FnSUNBZ1pHRjBZU0E5UGlCMGFHbHpMbVJwYzNCaGRHTm9VMlZ5ZG1WeVFXTjBhVzl1S0d0QlkzUnBiMjV6TGtsVVJVMWZSMFZVUVV4TUxDQnJVM1JoZEdWekxsTlpUa05GUkN3Z1pHRjBZU2tzWEc0Z0lDQWdJQ0JsY25JZ1BUNGdkR2hwY3k1a2FYTndZWFJqYUZObGNuWmxja0ZqZEdsdmJpaHJRV04wYVc5dWN5NUpWRVZOWDBkRlZFRk1UQ3dnYTFOMFlYUmxjeTVGVWxKUFVrVkVMQ0JsY25JcFhHNGdJQ0FnS1R0Y2JpQWdmVnh1WEc0Z0lISmxjWFZsYzNSRGNtVmhkR1ZGYm5SeWVTQW9abWx5YzNRc0lHeGhjM1FwSUh0Y2JseHVJQ0FnSUdOdmJuTnZiR1V1WkdWaWRXY29ZQ1I3ZEdocGN5NW5aWFJEYkdGemMyNWhiV1VvS1gwNmNtVnhkV1Z6ZEVOeVpXRjBaVVZ1ZEhKNVlDazdYRzVjYmlBZ0lDQjJZWElnWTJsa0lEMGdKMk1uSUNzZ0tGOWphV1FnS3owZ01Ta3NYRzRnSUNBZ0lDQWdJSEJoZVd4dllXUWdQU0I3SUdOcFpEb2dZMmxrTENCbWFYSnpkRG9nWm1seWMzUXNJR3hoYzNRNklHeGhjM1FnZlR0Y2JseHVJQ0FnSUdGcVlYZ29lMXh1SUNBZ0lDQWdkWEpzT2lCY0lpOWhjR2t2YVhSbGJYTmNJaXhjYmlBZ0lDQWdJSFI1Y0dVNklGd2lVRTlUVkZ3aUxGeHVJQ0FnSUNBZ1pHRjBZVG9nY0dGNWJHOWhaQ3hjYmlBZ0lDQWdJR0ZqWTJWd2RITTZJSHRjYmlBZ0lDQWdJQ0FnSjJwemIyNG5PaUJjSW1Gd2NHeHBZMkYwYVc5dUwycHpiMjVjSWl4Y2JpQWdJQ0FnSUNBZ0ozUmxlSFFuT2lBbmRHVjRkQzl3YkdGcGJpZGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtWeHVJQ0FnSUM1MGFHVnVLR1oxYm1OMGFXOXVJQ2hrWVhSaEtTQjdYRzRnSUNBZ0lDQjBhR2x6TG1ScGMzQmhkR05vVTJWeWRtVnlRV04wYVc5dUtHdEJZM1JwYjI1ekxrbFVSVTFmVUU5VFZDd2dhMU4wWVhSbGN5NVRXVTVEUlVRc0lHUmhkR0VwTzF4dUlDQWdJSDB1WW1sdVpDaDBhR2x6S1NsY2JpQWdJQ0F1WTJGMFkyZ29ablZ1WTNScGIyNGdLR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVrYVhOd1lYUmphRk5sY25abGNrRmpkR2x2YmloclFXTjBhVzl1Y3k1SlZFVk5YMUJQVTFRc0lHdFRkR0YwWlhNdVJWSlNUMUpGUkN3Z1pYSnlLVHRjYmlBZ0lDQjlMbUpwYm1Rb2RHaHBjeWtwTzF4dVhHNGdJQ0FnZEdocGN5NWthWE53WVhSamFGTmxjblpsY2tGamRHbHZiaWhyUVdOMGFXOXVjeTVKVkVWTlgxQlBVMVFzSUd0VGRHRjBaWE11VGtWWExDQndZWGxzYjJGa0tUdGNiaUFnZlZ4dVhHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYm1WM0lFbDBaVzFCWTNScGIyNXpLQ2s3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9hY3Rpb25zJyk7XG52YXIga1N0YXRlcyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9zdGF0ZXMnKTtcblxudmFyIG1ldGVyZWRHRVQgPSByZXF1aXJlKCcuLi9jb21tb24vbWV0ZXJlZC1yZXF1ZXN0JykuZ2V0O1xuXG52YXIgQmFzZUFjdGlvbiA9IHJlcXVpcmUoJy4vYmFzZScpO1xuXG5jbGFzcyBJdGVtQWN0aW9ucyBleHRlbmRzIEJhc2VBY3Rpb24ge1xuXG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0VGltZSgpIHtcbiAgICBtZXRlcmVkR0VUKFxuICAgICAgJy9hcGkvc2VydmVydGltZScsXG4gICAgICAoKSA9PiB0aGlzLmRpc3BhdGNoU2VydmVyQWN0aW9uKGtBY3Rpb25zLlNFUlZFUlRJTUVfR0VULCBrU3RhdGVzLkxPQURJTkcpLFxuICAgICAgZGF0YSA9PiB0aGlzLmRpc3BhdGNoU2VydmVyQWN0aW9uKGtBY3Rpb25zLlNFUlZFUlRJTUVfR0VULCBrU3RhdGVzLlNZTkNFRCwgZGF0YSksXG4gICAgICBlcnIgPT4gdGhpcy5kaXNwYXRjaFNlcnZlckFjdGlvbihrQWN0aW9ucy5TRVJWRVJUSU1FX0dFVCwga1N0YXRlcy5FUlJPUkVELCBlcnIpXG4gICAgKTtcbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEl0ZW1BY3Rpb25zKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZZV04wYVc5dWN5OXpaWEoyWlhJdGRHbHRaUzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZETEhOQ1FVRnpRaXhEUVVGRExFTkJRVU03UVVGREwwTXNTVUZCU1N4UFFVRlBMRWRCUVVjc1QwRkJUeXhEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRU5CUVVNN08wRkJSVGRETEVsQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXd5UWtGQk1rSXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJRenM3UVVGRk1VUXNTVUZCU1N4VlFVRlZMRWRCUVVjc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eERRVUZET3p0QlFVVnVReXhOUVVGTkxGZEJRVmNzVTBGQlV5eFZRVUZWTEVOQlFVTTdPMFZCUlc1RExGZEJRVmNzU1VGQlNUdEpRVU5pTEV0QlFVc3NSVUZCUlN4RFFVRkRPMEZCUTFvc1IwRkJSenM3UlVGRlJDeFBRVUZQTEVkQlFVYzdTVUZEVWl4VlFVRlZPMDFCUTFJc2FVSkJRV2xDTzAxQlEycENMRTFCUVUwc1NVRkJTU3hEUVVGRExHOUNRVUZ2UWl4RFFVRkRMRkZCUVZFc1EwRkJReXhqUVVGakxFVkJRVVVzVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXp0TlFVTjZSU3hKUVVGSkxFbEJRVWtzU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRExGRkJRVkVzUTBGQlF5eGpRVUZqTEVWQlFVVXNUMEZCVHl4RFFVRkRMRTFCUVUwc1JVRkJSU3hKUVVGSkxFTkJRVU03VFVGRGFFWXNSMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkJReXh2UWtGQmIwSXNRMEZCUXl4UlFVRlJMRU5CUVVNc1kwRkJZeXhGUVVGRkxFOUJRVThzUTBGQlF5eFBRVUZQTEVWQlFVVXNSMEZCUnl4RFFVRkRPMHRCUTJoR0xFTkJRVU03UVVGRFRpeEhRVUZIT3p0QlFVVklMRU5CUVVNN08wRkJSVVFzVFVGQlRTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRmRCUVZjc1JVRkJSU3hEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lKM1Z6WlNCemRISnBZM1FuTzF4dVhHNTJZWElnYTBGamRHbHZibk1nUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjV6ZEdGdWRITXZZV04wYVc5dWN5Y3BPMXh1ZG1GeUlHdFRkR0YwWlhNZ1BTQnlaWEYxYVhKbEtDY3VMaTlqYjI1emRHRnVkSE12YzNSaGRHVnpKeWs3WEc1Y2JuWmhjaUJ0WlhSbGNtVmtSMFZVSUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl0Ylc5dUwyMWxkR1Z5WldRdGNtVnhkV1Z6ZENjcExtZGxkRHRjYmx4dWRtRnlJRUpoYzJWQlkzUnBiMjRnUFNCeVpYRjFhWEpsS0NjdUwySmhjMlVuS1R0Y2JseHVZMnhoYzNNZ1NYUmxiVUZqZEdsdmJuTWdaWGgwWlc1a2N5QkNZWE5sUVdOMGFXOXVJSHRjYmx4dUlDQmpiMjV6ZEhKMVkzUnZjaUFvS1NCN1hHNGdJQ0FnYzNWd1pYSW9LVHRjYmlBZ2ZWeHVYRzRnSUdkbGRGUnBiV1VvS1NCN1hHNGdJQ0FnYldWMFpYSmxaRWRGVkNoY2JpQWdJQ0FnSUNjdllYQnBMM05sY25abGNuUnBiV1VuTEZ4dUlDQWdJQ0FnS0NrZ1BUNGdkR2hwY3k1a2FYTndZWFJqYUZObGNuWmxja0ZqZEdsdmJpaHJRV04wYVc5dWN5NVRSVkpXUlZKVVNVMUZYMGRGVkN3Z2ExTjBZWFJsY3k1TVQwRkVTVTVIS1N4Y2JpQWdJQ0FnSUdSaGRHRWdQVDRnZEdocGN5NWthWE53WVhSamFGTmxjblpsY2tGamRHbHZiaWhyUVdOMGFXOXVjeTVUUlZKV1JWSlVTVTFGWDBkRlZDd2dhMU4wWVhSbGN5NVRXVTVEUlVRc0lHUmhkR0VwTEZ4dUlDQWdJQ0FnWlhKeUlEMCtJSFJvYVhNdVpHbHpjR0YwWTJoVFpYSjJaWEpCWTNScGIyNG9hMEZqZEdsdmJuTXVVMFZTVmtWU1ZFbE5SVjlIUlZRc0lHdFRkR0YwWlhNdVJWSlNUMUpGUkN3Z1pYSnlLVnh1SUNBZ0lDazdYRzRnSUgxY2JseHVmVnh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUc1bGR5QkpkR1Z0UVdOMGFXOXVjeWdwTzF4dUlsMTkiLCIvKipcbiAqICBXcmFwcGVyIGZvciAkLmFqYXgoKSB0aGF0IHJldHVybnMgRVM2IHByb21pc2VzIGluc3RlYWRcbiAqICBvZiBqUXVlcnkgcHJvbWlzZXMuXG4gKiAgQG1vZHVsZSBjb21tb24vYWpheFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcblxudmFyIEhUVFBFcnJvciA9IHJlcXVpcmUoJy4vaHR0cC1lcnJvcicpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3B0cykge1xuICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICQuYWpheChvcHRzKVxuICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHJlc29sdmUoZGF0YSk7XG4gICAgfSlcbiAgICAuZmFpbChmdW5jdGlvbih4aHIsIHN0YXR1cywgZXJyKSB7XG4gICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMCAmJiB4aHIucmVzcG9uc2VUZXh0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVzcG9uc2UgPSB7ZGV0YWlsOidQb3NzaWJsZSBDT1JTIGVycm9yOyBjaGVjayB5b3VyIGJyb3dzZXIgY29uc29sZSBmb3IgZnVydGhlciBkZXRhaWxzJ307XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2VKU09OO1xuICAgICAgfVxuXG4gICAgICByZWplY3QobmV3IEhUVFBFcnJvcihvcHRzLnVybCwgeGhyLCBzdGF0dXMsIGVyciwgcmVzcG9uc2UpKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIHByb21pc2U7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12WTI5dGJXOXVMMkZxWVhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3UVVGRFFUdEJRVU5CT3p0QlFVVkJMRWRCUVVjN08wRkJSVWdzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZNVUlzU1VGQlNTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE8wRkJRM2hET3p0QlFVVkJMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVTBGQlV5eEpRVUZKTEVWQlFVVTdSVUZET1VJc1NVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeFBRVUZQTEVOQlFVTXNVMEZCVXl4UFFVRlBMRVZCUVVVc1RVRkJUU3hGUVVGRk8wbEJRMnhFTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRE8wdEJRMWdzU1VGQlNTeERRVUZETEZOQlFWTXNTVUZCU1N4RlFVRkZPMDFCUTI1Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0TFFVTm1MRU5CUVVNN1MwRkRSQ3hKUVVGSkxFTkJRVU1zVTBGQlV5eEhRVUZITEVWQlFVVXNUVUZCVFN4RlFVRkZMRWRCUVVjc1JVRkJSVHROUVVNdlFpeEpRVUZKTEZGQlFWRXNRMEZCUXp0TlFVTmlMRWxCUVVrc1IwRkJSeXhEUVVGRExFMUJRVTBzUzBGQlN5eERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRmxCUVZrc1MwRkJTeXhUUVVGVExFVkJRVVU3VVVGRGRFUXNVVUZCVVN4SFFVRkhMRU5CUVVNc1RVRkJUU3hEUVVGRExIRkZRVUZ4UlN4RFFVRkRMRU5CUVVNN1QwRkRNMFk3VjBGRFNUdFJRVU5JTEZGQlFWRXNSMEZCUnl4SFFVRkhMRU5CUVVNc1dVRkJXU3hEUVVGRE8wRkJRM0JETEU5QlFVODdPMDFCUlVRc1RVRkJUU3hEUVVGRExFbEJRVWtzVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRVZCUVVVc1IwRkJSeXhGUVVGRkxFMUJRVTBzUlVGQlJTeEhRVUZITEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJRenRMUVVNM1JDeERRVUZETEVOQlFVTTdRVUZEVUN4SFFVRkhMRU5CUVVNc1EwRkJRenM3UlVGRlNDeFBRVUZQTEU5QlFVOHNRMEZCUXp0RFFVTm9RaXhEUVVGRElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQWdWM0poY0hCbGNpQm1iM0lnSkM1aGFtRjRLQ2tnZEdoaGRDQnlaWFIxY201eklFVlROaUJ3Y205dGFYTmxjeUJwYm5OMFpXRmtYRzRnS2lBZ2IyWWdhbEYxWlhKNUlIQnliMjFwYzJWekxseHVJQ29nSUVCdGIyUjFiR1VnWTI5dGJXOXVMMkZxWVhoY2JpQXFMMXh1WEc0bmRYTmxJSE4wY21samRDYzdYRzVjYm5aaGNpQWtJRDBnY21WeGRXbHlaU2duYW5GMVpYSjVKeWs3WEc1Y2JuWmhjaUJJVkZSUVJYSnliM0lnUFNCeVpYRjFhWEpsS0NjdUwyaDBkSEF0WlhKeWIzSW5LVHRjYmx4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHWjFibU4wYVc5dUtHOXdkSE1wSUh0Y2JpQWdkbUZ5SUhCeWIyMXBjMlVnUFNCdVpYY2dVSEp2YldselpTaG1kVzVqZEdsdmJpaHlaWE52YkhabExDQnlaV3BsWTNRcElIdGNiaUFnSUNBa0xtRnFZWGdvYjNCMGN5bGNiaUFnSUNBdVpHOXVaU2htZFc1amRHbHZiaWhrWVhSaEtTQjdYRzRnSUNBZ0lDQnlaWE52YkhabEtHUmhkR0VwTzF4dUlDQWdJSDBwWEc0Z0lDQWdMbVpoYVd3b1puVnVZM1JwYjI0b2VHaHlMQ0J6ZEdGMGRYTXNJR1Z5Y2lrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEpsYzNCdmJuTmxPMXh1SUNBZ0lDQWdhV1lnS0hob2NpNXpkR0YwZFhNZ1BUMDlJREFnSmlZZ2VHaHlMbkpsYzNCdmJuTmxWR1Y0ZENBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0FnSUhKbGMzQnZibk5sSUQwZ2UyUmxkR0ZwYkRvblVHOXpjMmxpYkdVZ1EwOVNVeUJsY25KdmNqc2dZMmhsWTJzZ2VXOTFjaUJpY205M2MyVnlJR052Ym5OdmJHVWdabTl5SUdaMWNuUm9aWElnWkdWMFlXbHNjeWQ5TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQWdJSEpsYzNCdmJuTmxJRDBnZUdoeUxuSmxjM0J2Ym5ObFNsTlBUanRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnY21WcVpXTjBLRzVsZHlCSVZGUlFSWEp5YjNJb2IzQjBjeTUxY213c0lIaG9jaXdnYzNSaGRIVnpMQ0JsY25Jc0lISmxjM0J2Ym5ObEtTazdYRzRnSUNBZ2ZTazdYRzRnSUgwcE8xeHVYRzRnSUhKbGRIVnliaUJ3Y205dGFYTmxPMXh1ZlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG5jbGFzcyBIVFRQRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKHVybCwgeGhyLCBzdGF0dXMsIGVyciwgcmVzcG9uc2UpIHtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgICB0aGlzLnhociA9IHhocjtcbiAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cztcbiAgICB0aGlzLmVycm9yID0gZXJyO1xuICAgIHRoaXMucmVzcG9uc2UgPSByZXNwb25zZTtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IChzdGF0dXM9JHt0aGlzLnhoci5zdGF0dXN9LCB1cmw9JHt0aGlzLnVybH0pYDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhUVFBFcnJvcjtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRiVzl1TDJoMGRIQXRaWEp5YjNJdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRTFCUVUwc1UwRkJVeXhUUVVGVExFdEJRVXNzUTBGQlF6dEZRVU0xUWl4WFFVRlhMR3REUVVGclF6dEpRVU16UXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFZEJRVWNzUTBGQlF6dEpRVU5tTEVsQlFVa3NRMEZCUXl4SFFVRkhMRWRCUVVjc1IwRkJSeXhEUVVGRE8wbEJRMllzU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4TlFVRk5MRU5CUVVNN1NVRkRja0lzU1VGQlNTeERRVUZETEV0QlFVc3NSMEZCUnl4SFFVRkhMRU5CUVVNN1NVRkRha0lzU1VGQlNTeERRVUZETEZGQlFWRXNSMEZCUnl4UlFVRlJMRU5CUVVNN1FVRkROMElzUjBGQlJ6czdSVUZGUkN4UlFVRlJMRWRCUVVjN1NVRkRWQ3hQUVVGUExFZEJRVWNzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4SlFVRkpMRmxCUVZrc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eE5RVUZOTEZOQlFWTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1IwRkJSeXhEUVVGRE8wZEJRMmhHTzBGQlEwZ3NRMEZCUXpzN1FVRkZSQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZOQlFWTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dVkyeGhjM01nU0ZSVVVFVnljbTl5SUdWNGRHVnVaSE1nUlhKeWIzSWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpaDFjbXdzSUhob2Npd2djM1JoZEhWekxDQmxjbklzSUhKbGMzQnZibk5sS1NCN1hHNGdJQ0FnZEdocGN5NTFjbXdnUFNCMWNtdzdYRzRnSUNBZ2RHaHBjeTU0YUhJZ1BTQjRhSEk3WEc0Z0lDQWdkR2hwY3k1emRHRjBkWE1nUFNCemRHRjBkWE03WEc0Z0lDQWdkR2hwY3k1bGNuSnZjaUE5SUdWeWNqdGNiaUFnSUNCMGFHbHpMbkpsYzNCdmJuTmxJRDBnY21WemNHOXVjMlU3WEc0Z0lIMWNibHh1SUNCMGIxTjBjbWx1WnlncElIdGNiaUFnSUNCeVpYUjFjbTRnWUNSN2RHaHBjeTVqYjI1emRISjFZM1J2Y2k1dVlXMWxmU0FvYzNSaGRIVnpQU1I3ZEdocGN5NTRhSEl1YzNSaGRIVnpmU3dnZFhKc1BTUjdkR2hwY3k1MWNteDlLV0E3WEc0Z0lIMWNibjFjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCSVZGUlFSWEp5YjNJN1hHNGlYWDA9IiwiLyoqIEBtb2R1bGUgY29tbW9uL21ldGVyZWQtcmVxdWVzdCAqL1xuXG4ndXNlIHN0cmljdCc7XG5cblxuLypcbipcbiogQWxsb3dzIG9ubHkgMSByZXF1ZXN0IGZvciBhIG1ldGhvZC91cmwgdG8gb2NjdXIgYXQgYSB0aW1lLiAgUmVxdWVzdHMgZm9yIHRoZSBzYW1lIHJlc291cmNlXG4qIGFyZSBmb2xkZWQgaW50byB0aGUgb3V0c3RhbmRpbmcgcmVxdWVzdCBieSByZXR1cm5pbmcgaXRzIFByb21pc2UuXG4qXG4qL1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIGFqYXggPSByZXF1aXJlKCcuL2FqYXgnKTtcblxuLy8gRGljdGlvbmFyeSB0aGF0IGhvbGRzIGluLWZsaWdodCByZXF1ZXN0cy4gIE1hcHMgcmVxdWVzdCB1cmwgdG8gcHJvbWlzZS5cbnZhciBfaW5GbGlnaHRSZXF1ZXN0cyA9IHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICAvKiogR0VUIEpTT04gcmVzb3VyY2UgZnJvbSBBUEkgZW5kcG9pbnQuXG4gICAqICBJZiByZXF1ZXN0IGlzIGFscmVhZHkgcGVuZGluZywgd2lsbCByZXR1cm4gdGhlIGV4aXN0aW5nIHByb21pc2UuXG4gICAqICBAbWV0aG9kIGdldFxuICAgKiAgQHBhcmFtIHtzdHJpbmcgb3Igb2JqZWN0fSB1cmwgfCBzZXR0aW5ncyAtIGVpdGhlcjpcbiAgICogICAgICBhIHN0cmluZyBjb250YWluaW5nIHRoZSBVUkwgdG8gd2hpY2ggdGhlIHJlcXVlc3QgaXMgc2VudCBvclxuICAgKiAgICAgIGEgc2V0IG9mIGtleS92YWx1ZSBwYWlycyB0aGF0IGNvbmZpZ3VyZSB0aGUgQWpheCByZXF1ZXN0XG4gICAqICBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICovXG4gIGdldDogZnVuY3Rpb24gKHNldHRpbmdzLCBzdGFydEhkbHIsIHJlc29sdmVIZGxyLCByZWplY3RIZGxyLCBhcGlPcHRzKSB7XG4gICAgdmFyIHVybDtcbiAgICB2YXIgcHJvbWlzZTtcblxuICAgIGlmIChfLmlzU3RyaW5nKHNldHRpbmdzKSkge1xuICAgICAgdXJsID0gc2V0dGluZ3M7XG4gICAgICBzZXR0aW5ncyA9IHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIGNvbnRlbnRUeXBlIDogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICB0eXBlIDogJ0dFVCdcbiAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdXJsID0gc2V0dGluZ3MudXJsO1xuICAgICAgc2V0dGluZ3MgPSBfLmV4dGVuZCh7fSwgc2V0dGluZ3MsIHtcbiAgICAgICAgY29udGVudFR5cGUgOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIHR5cGUgOiAnR0VUJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFfLmlzU3RyaW5nKHVybCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWV0ZXJlZC1yZXF1ZXN0OjpnZXQgLSBVUkwgYXJndW1lbnQgaXMgbm90IGEgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgLy8gcmVxdWVzdCBhbHJlYWR5IGluIGZsaWdodCwgcmV0dXJuIGl0cyBwcm9taXNlXG4gICAgaWYgKHVybCBpbiBfaW5GbGlnaHRSZXF1ZXN0cykge1xuICAgICAgLy9jb25zb2xlLmRlYnVnKCdSZXR1cm5pbmcgcGVuZGluZyBtZXRlcmVkIHJlcXVlc3QgZm9yOiAnICsgdXJsKTtcbiAgICAgIHByb21pc2UgPSBfaW5GbGlnaHRSZXF1ZXN0c1t1cmxdO1xuICAgICAgcHJvbWlzZS5faXNOZXcgPSBmYWxzZTtcbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIC8vY29uc29sZS5kZWJ1ZygnQ3JlYXRpbmcgbmV3IG1ldGVyZWQgcmVxdWVzdCBmb3I6ICcgKyB1cmwpO1xuXG4gICAgLy8gY3JlYXRlIGEgbmV3IHByb21pc2UgdG8gcmVwcmVzZW50IHRoZSBHRVQuICBHRVRzIGFyZSBhbHdheXNcbiAgICAvLyBpbml0aWF0ZWQgaW4gdGhlIG5leHRUaWNrIHRvIHByZXZlbnQgZGlzcGF0Y2hlcyBkdXJpbmcgZGlzcGF0Y2hlc1xuICAgIC8vXG4gICAgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgYWpheChzZXR0aW5ncywgYXBpT3B0cylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICBkZWxldGUgX2luRmxpZ2h0UmVxdWVzdHNbdXJsXTtcbiAgICAgICAgICByZXNvbHZlSGRscihkYXRhKTtcbiAgICAgICAgICByZXNvbHZlKGRhdGEpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgZGVsZXRlIF9pbkZsaWdodFJlcXVlc3RzW3VybF07XG4gICAgICAgICAgcmVqZWN0SGRscihlcnIpO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzdGFydEhkbHIoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcHJvbWlzZS5jYXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBuby1vcCBjYXRjaCBoYW5kbGVyIHRvIHByZXZlbnQgXCJ1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb25cIiBjb25zb2xlIG1lc3NhZ2VzXG4gICAgfSk7XG5cbiAgICAvLyBBZGQgYSBjdXN0b20gcHJvcGVydHkgdG8gYXNzZXJ0IHRoYXQgYSBBSkFYIHJlcXVlc3RcbiAgICAvLyB3YXMgbWFrZSBhbmQgYSBQcm9taXNlIGNyZWF0ZWQgYXMgcGFydCBvZiB0aGlzIGNhbGwuXG4gICAgLy8gVGhpcyBpcyB1c2VkIGFzIGEgaGludCB0byBjYWxsZXJzIHRvIGNyZWF0ZSByZXNvbHZlL3JlamVjdFxuICAgIC8vIGhhbmRsZXJzIG9yIG5vdCAoaS5lLiBkb24ndCBhZGQgbW9yZSByZXNvbHZlL3JlamVjdCBoYW5kbGVyc1xuICAgIC8vIGlmIHRoZSBQcm9taXNlIGlzIGZvciBhIHBlbmRpbmcgcmVxdWVzdClcbiAgICBwcm9taXNlLl9pc05ldyA9IHRydWU7XG5cbiAgICAvLyByZWNvcmQgcmVxdWVzdFxuICAgIF9pbkZsaWdodFJlcXVlc3RzW3VybF0gPSBwcm9taXNlO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRiVzl1TDIxbGRHVnlaV1F0Y21WeGRXVnpkQzVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeHhRMEZCY1VNN08wRkJSWEpETEZsQlFWa3NRMEZCUXp0QlFVTmlPenRCUVVWQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0QlFVVkJMRVZCUVVVN08wRkJSVVlzU1VGQlNTeERRVUZETEVkQlFVY3NUMEZCVHl4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRekZDTEVsQlFVa3NTVUZCU1N4SFFVRkhMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6czdRVUZGTjBJc01FVkJRVEJGTzBGQlF6RkZMRWxCUVVrc2FVSkJRV2xDTEVkQlFVY3NSVUZCUlN4RFFVRkRPenRCUVVVelFpeE5RVUZOTEVOQlFVTXNUMEZCVHl4SFFVRkhPMEZCUTJwQ08wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wVkJSVVVzUjBGQlJ5eEZRVUZGTEZWQlFWVXNVVUZCVVN4RlFVRkZMRk5CUVZNc1JVRkJSU3hYUVVGWExFVkJRVVVzVlVGQlZTeEZRVUZGTEU5QlFVOHNSVUZCUlR0SlFVTndSU3hKUVVGSkxFZEJRVWNzUTBGQlF6dEJRVU5hTEVsQlFVa3NTVUZCU1N4UFFVRlBMRU5CUVVNN08wbEJSVm9zU1VGQlNTeERRVUZETEVOQlFVTXNVVUZCVVN4RFFVRkRMRkZCUVZFc1EwRkJReXhGUVVGRk8wMUJRM2hDTEVkQlFVY3NSMEZCUnl4UlFVRlJMRU5CUVVNN1RVRkRaaXhSUVVGUkxFZEJRVWM3VVVGRFZDeEhRVUZITEVWQlFVVXNSMEZCUnp0UlFVTlNMRmRCUVZjc1IwRkJSeXhyUWtGQmEwSTdVVUZEYUVNc1NVRkJTU3hIUVVGSExFdEJRVXM3VDBGRFlpeERRVUZETzB0QlEwZzdVMEZEU1R0TlFVTklMRWRCUVVjc1IwRkJSeXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETzAxQlEyNUNMRkZCUVZFc1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEVWQlFVVXNSVUZCUlN4UlFVRlJMRVZCUVVVN1VVRkRhRU1zVjBGQlZ5eEhRVUZITEd0Q1FVRnJRanRSUVVOb1F5eEpRVUZKTEVkQlFVY3NTMEZCU3p0UFFVTmlMRU5CUVVNc1EwRkJRenRCUVVOVUxFdEJRVXM3TzBsQlJVUXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJReXhSUVVGUkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVTdUVUZEY0VJc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eHhSRUZCY1VRc1EwRkJReXhEUVVGRE8wRkJRemRGTEV0QlFVczdRVUZEVERzN1FVRkZRU3hKUVVGSkxFbEJRVWtzUjBGQlJ5eEpRVUZKTEdsQ1FVRnBRaXhGUVVGRk96dE5RVVUxUWl4UFFVRlBMRWRCUVVjc2FVSkJRV2xDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1RVRkRha01zVDBGQlR5eERRVUZETEUxQlFVMHNSMEZCUnl4TFFVRkxMRU5CUVVNN1RVRkRka0lzVDBGQlR5eFBRVUZQTEVOQlFVTTdRVUZEY2tJc1MwRkJTenRCUVVOTU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFc1NVRkJTU3hQUVVGUExFZEJRVWNzU1VGQlNTeFBRVUZQTEVOQlFVTXNWVUZCVlN4UFFVRlBMRVZCUVVVc1RVRkJUU3hGUVVGRk96dEJRVVZ5UkN4TlFVRk5MRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zV1VGQldUczdVVUZGTTBJc1NVRkJTU3hEUVVGRExGRkJRVkVzUlVGQlJTeFBRVUZQTEVOQlFVTTdVMEZEZEVJc1NVRkJTU3hEUVVGRExGVkJRVlVzU1VGQlNTeEZRVUZGTzFWQlEzQkNMRTlCUVU4c2FVSkJRV2xDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1ZVRkRPVUlzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMVZCUTJ4Q0xFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0VFFVTm1MRVZCUVVVc1ZVRkJWU3hIUVVGSExFVkJRVVU3VlVGRGFFSXNUMEZCVHl4cFFrRkJhVUlzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0VlFVTTVRaXhWUVVGVkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdWVUZEYUVJc1RVRkJUU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEzUkNMRk5CUVZNc1EwRkJReXhEUVVGRE96dFJRVVZJTEZOQlFWTXNSVUZCUlN4RFFVRkRPMDlCUTJJc1EwRkJReXhEUVVGRE8wRkJRMVFzUzBGQlN5eERRVUZETEVOQlFVTTdPMEZCUlZBc1NVRkJTU3hQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEZsQlFWazdPMEZCUlRsQ0xFdEJRVXNzUTBGQlF5eERRVUZETzBGQlExQTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHM3UVVGRlFTeEpRVUZKTEU5QlFVOHNRMEZCUXl4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRekZDT3p0QlFVVkJMRWxCUVVrc2FVSkJRV2xDTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1QwRkJUeXhEUVVGRE96dEpRVVZxUXl4UFFVRlBMRTlCUVU4c1EwRkJRenRCUVVOdVFpeEhRVUZIT3p0RFFVVkdMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SXZLaW9nUUcxdlpIVnNaU0JqYjIxdGIyNHZiV1YwWlhKbFpDMXlaWEYxWlhOMElDb3ZYRzVjYmlkMWMyVWdjM1J5YVdOMEp6dGNibHh1WEc0dktseHVLbHh1S2lCQmJHeHZkM01nYjI1c2VTQXhJSEpsY1hWbGMzUWdabTl5SUdFZ2JXVjBhRzlrTDNWeWJDQjBieUJ2WTJOMWNpQmhkQ0JoSUhScGJXVXVJQ0JTWlhGMVpYTjBjeUJtYjNJZ2RHaGxJSE5oYldVZ2NtVnpiM1Z5WTJWY2Jpb2dZWEpsSUdadmJHUmxaQ0JwYm5SdklIUm9aU0J2ZFhSemRHRnVaR2x1WnlCeVpYRjFaWE4wSUdKNUlISmxkSFZ5Ym1sdVp5QnBkSE1nVUhKdmJXbHpaUzVjYmlwY2Jpb3ZYRzVjYm5aaGNpQmZJRDBnY21WeGRXbHlaU2duYkc5a1lYTm9KeWs3WEc1MllYSWdZV3BoZUNBOUlISmxjWFZwY21Vb0p5NHZZV3BoZUNjcE8xeHVYRzR2THlCRWFXTjBhVzl1WVhKNUlIUm9ZWFFnYUc5c1pITWdhVzR0Wm14cFoyaDBJSEpsY1hWbGMzUnpMaUFnVFdGd2N5QnlaWEYxWlhOMElIVnliQ0IwYnlCd2NtOXRhWE5sTGx4dWRtRnlJRjlwYmtac2FXZG9kRkpsY1hWbGMzUnpJRDBnZTMwN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdlMXh1WEc0Z0lDOHFLaUJIUlZRZ1NsTlBUaUJ5WlhOdmRYSmpaU0JtY205dElFRlFTU0JsYm1Sd2IybHVkQzVjYmlBZ0lDb2dJRWxtSUhKbGNYVmxjM1FnYVhNZ1lXeHlaV0ZrZVNCd1pXNWthVzVuTENCM2FXeHNJSEpsZEhWeWJpQjBhR1VnWlhocGMzUnBibWNnY0hKdmJXbHpaUzVjYmlBZ0lDb2dJRUJ0WlhSb2IyUWdaMlYwWEc0Z0lDQXFJQ0JBY0dGeVlXMGdlM04wY21sdVp5QnZjaUJ2WW1wbFkzUjlJSFZ5YkNCOElITmxkSFJwYm1keklDMGdaV2wwYUdWeU9seHVJQ0FnS2lBZ0lDQWdJR0VnYzNSeWFXNW5JR052Ym5SaGFXNXBibWNnZEdobElGVlNUQ0IwYnlCM2FHbGphQ0IwYUdVZ2NtVnhkV1Z6ZENCcGN5QnpaVzUwSUc5eVhHNGdJQ0FxSUNBZ0lDQWdZU0J6WlhRZ2IyWWdhMlY1TDNaaGJIVmxJSEJoYVhKeklIUm9ZWFFnWTI5dVptbG5kWEpsSUhSb1pTQkJhbUY0SUhKbGNYVmxjM1JjYmlBZ0lDb2dJRUJ5WlhSMWNtNXpJSHRRY205dGFYTmxmVnh1SUNBZ0tpOWNiaUFnWjJWME9pQm1kVzVqZEdsdmJpQW9jMlYwZEdsdVozTXNJSE4wWVhKMFNHUnNjaXdnY21WemIyeDJaVWhrYkhJc0lISmxhbVZqZEVoa2JISXNJR0Z3YVU5d2RITXBJSHRjYmlBZ0lDQjJZWElnZFhKc08xeHVJQ0FnSUhaaGNpQndjbTl0YVhObE8xeHVYRzRnSUNBZ2FXWWdLRjh1YVhOVGRISnBibWNvYzJWMGRHbHVaM01wS1NCN1hHNGdJQ0FnSUNCMWNtd2dQU0J6WlhSMGFXNW5jenRjYmlBZ0lDQWdJSE5sZEhScGJtZHpJRDBnZTF4dUlDQWdJQ0FnSUNCMWNtdzZJSFZ5YkN4Y2JpQWdJQ0FnSUNBZ1kyOXVkR1Z1ZEZSNWNHVWdPaUFuWVhCd2JHbGpZWFJwYjI0dmFuTnZiaWNzWEc0Z0lDQWdJQ0FnSUhSNWNHVWdPaUFuUjBWVUoxeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOVhHNGdJQ0FnWld4elpTQjdYRzRnSUNBZ0lDQjFjbXdnUFNCelpYUjBhVzVuY3k1MWNtdzdYRzRnSUNBZ0lDQnpaWFIwYVc1bmN5QTlJRjh1WlhoMFpXNWtLSHQ5TENCelpYUjBhVzVuY3l3Z2UxeHVJQ0FnSUNBZ0lDQmpiMjUwWlc1MFZIbHdaU0E2SUNkaGNIQnNhV05oZEdsdmJpOXFjMjl1Snl4Y2JpQWdJQ0FnSUNBZ2RIbHdaU0E2SUNkSFJWUW5YRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnBaaUFvSVY4dWFYTlRkSEpwYm1jb2RYSnNLU2tnZTF4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2R0WlhSbGNtVmtMWEpsY1hWbGMzUTZPbWRsZENBdElGVlNUQ0JoY21kMWJXVnVkQ0JwY3lCdWIzUWdZU0J6ZEhKcGJtY25LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJ5WlhGMVpYTjBJR0ZzY21WaFpIa2dhVzRnWm14cFoyaDBMQ0J5WlhSMWNtNGdhWFJ6SUhCeWIyMXBjMlZjYmlBZ0lDQnBaaUFvZFhKc0lHbHVJRjlwYmtac2FXZG9kRkpsY1hWbGMzUnpLU0I3WEc0Z0lDQWdJQ0F2TDJOdmJuTnZiR1V1WkdWaWRXY29KMUpsZEhWeWJtbHVaeUJ3Wlc1a2FXNW5JRzFsZEdWeVpXUWdjbVZ4ZFdWemRDQm1iM0k2SUNjZ0t5QjFjbXdwTzF4dUlDQWdJQ0FnY0hKdmJXbHpaU0E5SUY5cGJrWnNhV2RvZEZKbGNYVmxjM1J6VzNWeWJGMDdYRzRnSUNBZ0lDQndjbTl0YVhObExsOXBjMDVsZHlBOUlHWmhiSE5sTzF4dUlDQWdJQ0FnY21WMGRYSnVJSEJ5YjIxcGMyVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OWpiMjV6YjJ4bExtUmxZblZuS0NkRGNtVmhkR2x1WnlCdVpYY2diV1YwWlhKbFpDQnlaWEYxWlhOMElHWnZjam9nSnlBcklIVnliQ2s3WEc1Y2JpQWdJQ0F2THlCamNtVmhkR1VnWVNCdVpYY2djSEp2YldselpTQjBieUJ5WlhCeVpYTmxiblFnZEdobElFZEZWQzRnSUVkRlZITWdZWEpsSUdGc2QyRjVjMXh1SUNBZ0lDOHZJR2x1YVhScFlYUmxaQ0JwYmlCMGFHVWdibVY0ZEZScFkyc2dkRzhnY0hKbGRtVnVkQ0JrYVhOd1lYUmphR1Z6SUdSMWNtbHVaeUJrYVhOd1lYUmphR1Z6WEc0Z0lDQWdMeTljYmlBZ0lDQndjbTl0YVhObElEMGdibVYzSUZCeWIyMXBjMlVvWm5WdVkzUnBiMjRnS0hKbGMyOXNkbVVzSUhKbGFtVmpkQ2tnZTF4dVhHNGdJQ0FnSUNCd2NtOWpaWE56TG01bGVIUlVhV05yS0daMWJtTjBhVzl1SUNncElIdGNibHh1SUNBZ0lDQWdJQ0JoYW1GNEtITmxkSFJwYm1kekxDQmhjR2xQY0hSektWeHVJQ0FnSUNBZ0lDQXVkR2hsYmlobWRXNWpkR2x2YmlBb1pHRjBZU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHUmxiR1YwWlNCZmFXNUdiR2xuYUhSU1pYRjFaWE4wYzF0MWNteGRPMXh1SUNBZ0lDQWdJQ0FnSUhKbGMyOXNkbVZJWkd4eUtHUmhkR0VwTzF4dUlDQWdJQ0FnSUNBZ0lISmxjMjlzZG1Vb1pHRjBZU2s3WEc0Z0lDQWdJQ0FnSUgwc0lHWjFibU4wYVc5dUlDaGxjbklwSUh0Y2JpQWdJQ0FnSUNBZ0lDQmtaV3hsZEdVZ1gybHVSbXhwWjJoMFVtVnhkV1Z6ZEhOYmRYSnNYVHRjYmlBZ0lDQWdJQ0FnSUNCeVpXcGxZM1JJWkd4eUtHVnljaWs3WEc0Z0lDQWdJQ0FnSUNBZ2NtVnFaV04wS0dWeWNpazdYRzRnSUNBZ0lDQWdJSDBwTzF4dVhHNGdJQ0FnSUNBZ0lITjBZWEowU0dSc2NpZ3BPMXh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc1Y2JpQWdJQ0J3Y205dGFYTmxMbU5oZEdOb0tHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJQzh2SUc1dkxXOXdJR05oZEdOb0lHaGhibVJzWlhJZ2RHOGdjSEpsZG1WdWRDQmNJblZ1YUdGdVpHeGxaQ0J3Y205dGFYTmxJSEpsYW1WamRHbHZibHdpSUdOdmJuTnZiR1VnYldWemMyRm5aWE5jYmlBZ0lDQjlLVHRjYmx4dUlDQWdJQzh2SUVGa1pDQmhJR04xYzNSdmJTQndjbTl3WlhKMGVTQjBieUJoYzNObGNuUWdkR2hoZENCaElFRktRVmdnY21WeGRXVnpkRnh1SUNBZ0lDOHZJSGRoY3lCdFlXdGxJR0Z1WkNCaElGQnliMjFwYzJVZ1kzSmxZWFJsWkNCaGN5QndZWEowSUc5bUlIUm9hWE1nWTJGc2JDNWNiaUFnSUNBdkx5QlVhR2x6SUdseklIVnpaV1FnWVhNZ1lTQm9hVzUwSUhSdklHTmhiR3hsY25NZ2RHOGdZM0psWVhSbElISmxjMjlzZG1VdmNtVnFaV04wWEc0Z0lDQWdMeThnYUdGdVpHeGxjbk1nYjNJZ2JtOTBJQ2hwTG1VdUlHUnZiaWQwSUdGa1pDQnRiM0psSUhKbGMyOXNkbVV2Y21WcVpXTjBJR2hoYm1Sc1pYSnpYRzRnSUNBZ0x5OGdhV1lnZEdobElGQnliMjFwYzJVZ2FYTWdabTl5SUdFZ2NHVnVaR2x1WnlCeVpYRjFaWE4wS1Z4dUlDQWdJSEJ5YjIxcGMyVXVYMmx6VG1WM0lEMGdkSEoxWlR0Y2JseHVJQ0FnSUM4dklISmxZMjl5WkNCeVpYRjFaWE4wWEc0Z0lDQWdYMmx1Um14cFoyaDBVbVZ4ZFdWemRITmJkWEpzWFNBOUlIQnliMjFwYzJVN1hHNWNiaUFnSUNCeVpYUjFjbTRnY0hKdmJXbHpaVHRjYmlBZ2ZWeHVYRzU5TzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG52YXIgUm91dGVyID0gcmVxdWlyZSgncmVhY3Qtcm91dGVyJyksXG4gICAgUm91dGVIYW5kbGVyID0gUm91dGVyLlJvdXRlSGFuZGxlcjtcblxudmFyIE5hdkJhciA9IHJlcXVpcmUoJy4vbmF2LWJhci5qc3gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiZXhwb3J0c1wiLFxuXG4gIG1peGluczogW1JvdXRlci5TdGF0ZV0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5hdkJhciwgbnVsbCksIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlSGFuZGxlciwgbnVsbClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRjRzl1Wlc1MGN5OWhjSEF1YW5ONElsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEV0QlFVc3NSMEZCUnl4UFFVRlBMRU5CUVVNc1kwRkJZeXhEUVVGRExFTkJRVU03TzBGQlJYQkRMRWxCUVVrc1RVRkJUU3hIUVVGSExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTTdRVUZEY0VNc1NVRkJTU3haUVVGWkxFZEJRVWNzVFVGQlRTeERRVUZETEZsQlFWa3NRMEZCUXpzN1FVRkZka01zU1VGQlNTeE5RVUZOTEVkQlFVY3NUMEZCVHl4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRE96dEJRVVYwUXl4dlEwRkJiME1zZFVKQlFVRTdPMEZCUlhCRExFVkJRVVVzVFVGQlRTeEZRVUZGTEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJRenM3UlVGRmRFSXNaVUZCWlN4RlFVRkZMRmxCUVZrN1NVRkRNMElzVDBGQlR5eEZRVUZGTEVOQlFVTTdRVUZEWkN4SFFVRkhPenRGUVVWRUxFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENPMDFCUTBVc2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVsQlFVTXNSVUZCUVR0UlFVTklMRzlDUVVGRExFMUJRVTBzUlVGQlFTeEpRVUZCTEVOQlFVY3NRMEZCUVN4RlFVRkJPMUZCUTFZc2IwSkJRVU1zV1VGQldTeEZRVUZCTEVsQlFVRXNRMEZCUnl4RFFVRkJPMDFCUTFvc1EwRkJRVHROUVVOT08wZEJRMGc3UTBGRFJpeERRVUZETEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCU1pXRmpkQ0E5SUhKbGNYVnBjbVVvSjNKbFlXTjBMMkZrWkc5dWN5Y3BPMXh1WEc1MllYSWdVbTkxZEdWeUlEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRdGNtOTFkR1Z5Snlrc1hHNGdJQ0FnVW05MWRHVklZVzVrYkdWeUlEMGdVbTkxZEdWeUxsSnZkWFJsU0dGdVpHeGxjanRjYmx4dWRtRnlJRTVoZGtKaGNpQTlJSEpsY1hWcGNtVW9KeTR2Ym1GMkxXSmhjaTVxYzNnbktUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc1Y2JpQWdiV2w0YVc1ek9pQmJVbTkxZEdWeUxsTjBZWFJsWFN4Y2JseHVJQ0JuWlhSSmJtbDBhV0ZzVTNSaGRHVTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdlMzA3WEc0Z0lIMHNYRzVjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUNoY2JpQWdJQ0FnSUR4a2FYWStYRzRnSUNBZ0lDQWdJRHhPWVhaQ1lYSWdMejVjYmlBZ0lDQWdJQ0FnUEZKdmRYUmxTR0Z1Wkd4bGNpQXZQbHh1SUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnS1R0Y2JpQWdmVnh1ZlNrN1hHNGlYWDA9IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdC9hZGRvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiZXhwb3J0c1wiLFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcIml0ZW1zXCIpO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRjRzl1Wlc1MGN5OXBkR1Z0Y3k1cWMzZ2lYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc1MwRkJTeXhIUVVGSExFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXpzN1FVRkZjRU1zYjBOQlFXOURMSFZDUVVGQk8wVkJRMnhETEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q0xFOUJRVThzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRWxCUVVNc1JVRkJRU3hQUVVGWExFTkJRVUVzUTBGQlF6dEhRVU42UWp0RFFVTkdMRU5CUVVNc1EwRkJReUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSWlkMWMyVWdjM1J5YVdOMEp6dGNibHh1ZG1GeUlGSmxZV04wSUQwZ2NtVnhkV2x5WlNnbmNtVmhZM1F2WVdSa2IyNXpKeWs3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1VtVmhZM1F1WTNKbFlYUmxRMnhoYzNNb2UxeHVJQ0J5Wlc1a1pYSTZJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdQR1JwZGo1cGRHVnRjend2WkdsMlBqdGNiaUFnZlZ4dWZTazdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKSxcbiAgICBMaW5rID0gUm91dGVyLkxpbms7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcImV4cG9ydHNcIixcbiAgbWl4aW5zOiBbUm91dGVyLlN0YXRlXSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJuYXZcIiwge2NsYXNzTmFtZTogXCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIn0sIFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29udGFpbmVyLWZsdWlkXCJ9LCBcbiAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibmF2YmFyLWhlYWRlclwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHt0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwibmF2YmFyLXRvZ2dsZSBjb2xsYXBzZWRcIiwgXCJkYXRhLXRvZ2dsZVwiOiBcImNvbGxhcHNlXCIsIFwiZGF0YS10YXJnZXRcIjogXCIjYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwic3Itb25seVwifSwgXCJUb2dnbGUgbmF2aWdhdGlvblwiKSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwiaWNvbi1iYXJcIn0pLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2NsYXNzTmFtZTogXCJpY29uLWJhclwifSksIFxuICAgICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcImljb24tYmFyXCJ9KVxuICAgICAgICAgICAgKSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHt0bzogXCJyb290XCIsIGNsYXNzTmFtZTogXCJuYXZiYXItYnJhbmRcIn0sIHdpbmRvdy5FWC5jb25zdC50aXRsZSlcbiAgICAgICAgICApLCBcblxuICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiwgaWQ6IFwiYnMtZXhhbXBsZS1uYXZiYXItY29sbGFwc2UtMVwifSwgXG4gICAgICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwidWxcIiwge2NsYXNzTmFtZTogXCJuYXYgbmF2YmFyLW5hdlwifSwgXG4gICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7Y2xhc3NOYW1lOiB0aGlzLmlzQWN0aXZlKCdpdGVtcycpID8gXCJhY3RpdmVcIiA6ICcnfSwgUmVhY3QuY3JlYXRlRWxlbWVudChMaW5rLCB7dG86IFwiaXRlbXNcIn0sIFwiSXRlbXNcIikpLCBcbiAgICAgICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxpXCIsIHtjbGFzc05hbWU6IHRoaXMuaXNBY3RpdmUoJ3NlcnZlci10aW1lJykgPyBcImFjdGl2ZVwiIDogJyd9LCBSZWFjdC5jcmVhdGVFbGVtZW50KExpbmssIHt0bzogXCJzZXJ2ZXItdGltZVwifSwgXCJTZXJ2ZXItVGltZVwiKSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRjRzl1Wlc1MGN5OXVZWFl0WW1GeUxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4SlFVRkpMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETzBGQlEzQkRMRWxCUVVrc1NVRkJTU3hIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTTdPMEZCUlhaQ0xHOURRVUZ2UXl4MVFrRkJRVHRGUVVOc1F5eE5RVUZOTEVWQlFVVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRE8wVkJRM1JDTEUxQlFVMHNSVUZCUlN4WlFVRlpPMGxCUTJ4Q08wMUJRMFVzYjBKQlFVRXNTMEZCU1N4RlFVRkJMRU5CUVVFc1EwRkJReXhUUVVGQkxFVkJRVk1zUTBGQlF5eDFRa0ZCZDBJc1EwRkJRU3hGUVVGQk8xRkJRM0pETEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNhVUpCUVd0Q0xFTkJRVUVzUlVGQlFUdFZRVU12UWl4dlFrRkJRU3hMUVVGSkxFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMR1ZCUVdkQ0xFTkJRVUVzUlVGQlFUdFpRVU0zUWl4dlFrRkJRU3hSUVVGUExFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRkZCUVVFc1JVRkJVU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEhsQ1FVRkJMRVZCUVhsQ0xFTkJRVU1zWVVGQlFTeEZRVUZYTEVOQlFVTXNWVUZCUVN4RlFVRlZMRU5CUVVNc1lVRkJRU3hGUVVGWExFTkJRVU1zSzBKQlFXZERMRU5CUVVFc1JVRkJRVHRqUVVNelNDeHZRa0ZCUVN4TlFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZETEZOQlFWVXNRMEZCUVN4RlFVRkJMRzFDUVVGM1FpeERRVUZCTEVWQlFVRTdZMEZEYkVRc2IwSkJRVUVzVFVGQlN5eEZRVUZCTEVOQlFVRXNRMEZCUXl4VFFVRkJMRVZCUVZNc1EwRkJReXhWUVVGWExFTkJRVThzUTBGQlFTeEZRVUZCTzJOQlEyeERMRzlDUVVGQkxFMUJRVXNzUlVGQlFTeERRVUZCTEVOQlFVTXNVMEZCUVN4RlFVRlRMRU5CUVVNc1ZVRkJWeXhEUVVGUExFTkJRVUVzUlVGQlFUdGpRVU5zUXl4dlFrRkJRU3hOUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkRMRlZCUVZjc1EwRkJUeXhEUVVGQk8xbEJRek5DTEVOQlFVRXNSVUZCUVR0WlFVTlVMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNSVUZCUVN4RlFVRkZMRU5CUVVNc1RVRkJRU3hGUVVGTkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNZMEZCWXl4RFFVRkZMRU5CUVVFc1JVRkJReXhOUVVGTkxFTkJRVU1zUlVGQlJTeERRVUZETEV0QlFVc3NRMEZCUXl4TFFVRmhMRU5CUVVFN1FVRkRjRVlzVlVGQlowSXNRMEZCUVN4RlFVRkJPenRWUVVWT0xHOUNRVUZCTEV0QlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1UwRkJRU3hGUVVGVExFTkJRVU1zTUVKQlFVRXNSVUZCTUVJc1EwRkJReXhGUVVGQkxFVkJRVVVzUTBGQlF5dzRRa0ZCSzBJc1EwRkJRU3hGUVVGQk8xbEJRekZGTEc5Q1FVRkJMRWxCUVVjc1JVRkJRU3hEUVVGQkxFTkJRVU1zVTBGQlFTeEZRVUZUTEVOQlFVTXNaMEpCUVdsQ0xFTkJRVUVzUlVGQlFUdGpRVU0zUWl4dlFrRkJRU3hKUVVGSExFVkJRVUVzUTBGQlFTeERRVUZETEZOQlFVRXNSVUZCVXl4RFFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEVkQlFVY3NVVUZCVVN4SFFVRkhMRVZCUVVrc1EwRkJRU3hGUVVGQkxHOUNRVUZETEVsQlFVa3NSVUZCUVN4RFFVRkJMRU5CUVVNc1JVRkJRU3hGUVVGRkxFTkJRVU1zVDBGQlVTeERRVUZCTEVWQlFVRXNUMEZCV1N4RFFVRkxMRU5CUVVFc1JVRkJRVHRqUVVONlJpeHZRa0ZCUVN4SlFVRkhMRVZCUVVFc1EwRkJRU3hEUVVGRExGTkJRVUVzUlVGQlV5eERRVUZGTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1lVRkJZU3hEUVVGRExFZEJRVWNzVVVGQlVTeEhRVUZITEVWQlFVa3NRMEZCUVN4RlFVRkJMRzlDUVVGRExFbEJRVWtzUlVGQlFTeERRVUZCTEVOQlFVTXNSVUZCUVN4RlFVRkZMRU5CUVVNc1lVRkJZeXhEUVVGQkxFVkJRVUVzWVVGQmEwSXNRMEZCU3l4RFFVRkJPMWxCUTNoSExFTkJRVUU3VlVGRFJDeERRVUZCTzFGQlEwWXNRMEZCUVR0TlFVTkdMRU5CUVVFN1RVRkRUanRIUVVOSU8wTkJRMFlzUTBGQlF5eERRVUZESWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUozVnpaU0J6ZEhKcFkzUW5PMXh1WEc1MllYSWdVbVZoWTNRZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZEM5aFpHUnZibk1uS1R0Y2JseHVkbUZ5SUZKdmRYUmxjaUE5SUhKbGNYVnBjbVVvSjNKbFlXTjBMWEp2ZFhSbGNpY3BMRnh1SUNBZ0lFeHBibXNnUFNCU2IzVjBaWEl1VEdsdWF6dGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JTWldGamRDNWpjbVZoZEdWRGJHRnpjeWg3WEc0Z0lHMXBlR2x1Y3pvZ1cxSnZkWFJsY2k1VGRHRjBaVjBzWEc0Z0lISmxibVJsY2pvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lISmxkSFZ5YmlBb1hHNGdJQ0FnSUNBOGJtRjJJR05zWVhOelRtRnRaVDFjSW01aGRtSmhjaUJ1WVhaaVlYSXRaR1ZtWVhWc2RGd2lQbHh1SUNBZ0lDQWdJQ0E4WkdsMklHTnNZWE56VG1GdFpUMWNJbU52Ym5SaGFXNWxjaTFtYkhWcFpGd2lQbHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpYm1GMlltRnlMV2hsWVdSbGNsd2lQbHh1SUNBZ0lDQWdJQ0FnSUNBZ1BHSjFkSFJ2YmlCMGVYQmxQVndpWW5WMGRHOXVYQ0lnWTJ4aGMzTk9ZVzFsUFZ3aWJtRjJZbUZ5TFhSdloyZHNaU0JqYjJ4c1lYQnpaV1JjSWlCa1lYUmhMWFJ2WjJkc1pUMWNJbU52Ykd4aGNITmxYQ0lnWkdGMFlTMTBZWEpuWlhROVhDSWpZbk10WlhoaGJYQnNaUzF1WVhaaVlYSXRZMjlzYkdGd2MyVXRNVndpUGx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0E4YzNCaGJpQmpiR0Z6YzA1aGJXVTlYQ0p6Y2kxdmJteDVYQ0krVkc5bloyeGxJRzVoZG1sbllYUnBiMjQ4TDNOd1lXNCtYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lEeHpjR0Z1SUdOc1lYTnpUbUZ0WlQxY0ltbGpiMjR0WW1GeVhDSStQQzl6Y0dGdVBseHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBOGMzQmhiaUJqYkdGemMwNWhiV1U5WENKcFkyOXVMV0poY2x3aVBqd3ZjM0JoYmo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEhOd1lXNGdZMnhoYzNOT1lXMWxQVndpYVdOdmJpMWlZWEpjSWo0OEwzTndZVzQrWEc0Z0lDQWdJQ0FnSUNBZ0lDQThMMkoxZEhSdmJqNWNiaUFnSUNBZ0lDQWdJQ0FnSUR4TWFXNXJJSFJ2UFZ3aWNtOXZkRndpSUdOc1lYTnpUbUZ0WlQxY0ltNWhkbUpoY2kxaWNtRnVaRndpSUQ1N2QybHVaRzkzTGtWWUxtTnZibk4wTG5ScGRHeGxmVHd2VEdsdWF6NWNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNibHh1SUNBZ0lDQWdJQ0FnSUR4a2FYWWdZMnhoYzNOT1lXMWxQVndpWTI5c2JHRndjMlVnYm1GMlltRnlMV052Ykd4aGNITmxYQ0lnYVdROVhDSmljeTFsZUdGdGNHeGxMVzVoZG1KaGNpMWpiMnhzWVhCelpTMHhYQ0krWEc0Z0lDQWdJQ0FnSUNBZ0lDQThkV3dnWTJ4aGMzTk9ZVzFsUFZ3aWJtRjJJRzVoZG1KaGNpMXVZWFpjSWo1Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnUEd4cElHTnNZWE56VG1GdFpUMTdkR2hwY3k1cGMwRmpkR2wyWlNnbmFYUmxiWE1uS1NBL0lGd2lZV04wYVhabFhDSWdPaUFuSjMwK1BFeHBibXNnZEc4OVhDSnBkR1Z0YzF3aVBrbDBaVzF6UEM5TWFXNXJQand2YkdrK1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUR4c2FTQmpiR0Z6YzA1aGJXVTllM1JvYVhNdWFYTkJZM1JwZG1Vb0ozTmxjblpsY2kxMGFXMWxKeWtnUHlCY0ltRmpkR2wyWlZ3aUlEb2dKeWQ5UGp4TWFXNXJJSFJ2UFZ3aWMyVnlkbVZ5TFhScGJXVmNJajVUWlhKMlpYSXRWR2x0WlR3dlRHbHVhejQ4TDJ4cFBseHVJQ0FnSUNBZ0lDQWdJQ0FnUEM5MWJENWNiaUFnSUNBZ0lDQWdJQ0E4TDJScGRqNWNiaUFnSUNBZ0lDQWdQQzlrYVhZK1hHNGdJQ0FnSUNBOEwyNWhkajVjYmlBZ0lDQXBPMXh1SUNCOVhHNTlLVHRjYmlKZGZRPT0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJleHBvcnRzXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwiUm91dGUgTm90IEZvdW5kXCIpO1xuICB9XG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdlkyOXRjRzl1Wlc1MGN5OXliM1YwWlMxdWIzUXRabTkxYm1RdWFuTjRJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEZsQlFWa3NRMEZCUXpzN1FVRkZZaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNN08wRkJSWEJETEc5RFFVRnZReXgxUWtGQlFUdEZRVU5zUXl4TlFVRk5MRVZCUVVVc1dVRkJXVHRKUVVOc1FpeFBRVUZQTEc5Q1FVRkJMRXRCUVVrc1JVRkJRU3hKUVVGRExFVkJRVUVzYVVKQlFYRkNMRU5CUVVFc1EwRkJRenRIUVVOdVF6dERRVU5HTEVOQlFVTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJRkpsWVdOMElEMGdjbVZ4ZFdseVpTZ25jbVZoWTNRdllXUmtiMjV6SnlrN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdVbVZoWTNRdVkzSmxZWFJsUTJ4aGMzTW9lMXh1SUNCeVpXNWtaWEk2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNCeVpYUjFjbTRnUEdScGRqNVNiM1YwWlNCT2IzUWdSbTkxYm1ROEwyUnBkajQ3WEc0Z0lIMWNibjBwTzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0L2FkZG9ucycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJleHBvcnRzXCIsXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwic2VydmVyLXRpbWVcIik7XG4gIH1cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12WTI5dGNHOXVaVzUwY3k5elpYSjJaWEl0ZEdsdFpTNXFjM2dpWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NTMEZCU3l4SFFVRkhMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6czdRVUZGY0VNc2IwTkJRVzlETEhWQ1FVRkJPMFZCUTJ4RExFMUJRVTBzUlVGQlJTeFpRVUZaTzBsQlEyeENMRTlCUVU4c2IwSkJRVUVzUzBGQlNTeEZRVUZCTEVsQlFVTXNSVUZCUVN4aFFVRnBRaXhEUVVGQkxFTkJRVU03UjBGREwwSTdRMEZEUml4RFFVRkRMRU5CUVVNaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SW5kWE5sSUhOMGNtbGpkQ2M3WEc1Y2JuWmhjaUJTWldGamRDQTlJSEpsY1hWcGNtVW9KM0psWVdOMEwyRmtaRzl1Y3ljcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRkpsWVdOMExtTnlaV0YwWlVOc1lYTnpLSHRjYmlBZ2NtVnVaR1Z5T2lCbWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUR4a2FYWStjMlZ5ZG1WeUxYUnBiV1U4TDJScGRqNDdYRzRnSUgxY2JuMHBPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ3JlYWN0L2xpYi9rZXlNaXJyb3InKTtcblxuLyoqXG4gKiBBY3Rpb24gdHlwZSBjb25zdGFudHMuIFNob3VsZCBmb2xsb3cgdGhlIGZvcm1hdDpcbiAqIDxPQkpFQ1QgQUxJQVM+XzxWRVJCPlxuICpcbiAqIEZvciBleGFtcGxlLCBhbiBhY3Rpb24gZm9yIGZldGNoaW5nIGEgc3BlY2lmaWMgXCJJdGVtXCIgb2JqZWN0OlxuICogSVRFTV9HRVRcbiAqXG4gKiBBY3Rpb25zIHZlcmJzIHNob3VsZCB0eXBpY2FsbHkgdXNlIG9uZSBvZiB0aGUgZm9sbG93aW5nOlxuICogR0VUICAgICAgICAgICAgICAgICAgICAgIDwtIFJldHJpZXZpbmcgYSBsaXN0IG9mIG9iamVjdHMuIChlLmcuIEdFVCAvaXRlbXMpXG4gKiBQT1NUICAgICAgICAgICAgICAgICAgICAgPC0gQ3JlYXRpbmcgYW4gb2JqZWN0LiAoZS5nLiBQT1NUIC9pdGVtcylcbiAqIFBVVCAgICAgICAgICAgICAgICAgICAgICA8LSBVcGRhdGUgYW4gZXhpc3Rpbmcgb2JqZWN0LiAoZS5nLiBQVVQgL2l0ZW1zLzppZClcbiAqIERFTEVURSAgICAgICAgICAgICAgICAgICA8LSBEZWxldGluZyBhbiBvYmplY3QuIChlLmcuIERFTEVURSAvaXRlbXMvOmlkKVxuICpcbiAqIFNvbWUgYWN0aW9ucyB0eXBlcyBtYXkgbm90IGhhdmUgYSByZWNlaXZlciwgd2hpY2ggaXMgT0suIFRoZSByZXN1bHQgb2YgUE9TVCwgUFVULCBhbmQgREVMRVRFIGFjdGlvbnNcbiAqIG1heSBlbnRlciBiYWNrIGludG8gdGhlIHN5c3RlbSB0aHJvdWdoIHN1YnNjcmlwdGlvbnMgcmF0aGVyIHRoYW4gaW4gcmVzcG9uc2UgdG8gQVBJIHJlcXVlc3RzLlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yKHtcblxuICAvLyBpdGVtIGFjdGlvbnNcbiAgSVRFTV9HRVRBTEw6IG51bGwsXG4gIElURU1fR0VUT05FOiBudWxsLFxuICBJVEVNX1BPU1Q6IG51bGwsXG4gIElURU1fUFVUOiBudWxsLFxuICBJVEVNX0RFTEVURTogbnVsbCxcblxuICAvLyBzZXJ2ZXJ0aW1lIGFjdGlvbnNcbiAgU0VSVkVSVElNRV9HRVQ6IG51bGxcblxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZZMjl1YzNSaGJuUnpMMkZqZEdsdmJuTXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1dVRkJXU3hEUVVGRE96dEJRVVZpTEVsQlFVa3NVMEZCVXl4SFFVRkhMRTlCUVU4c1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RFFVRkRPenRCUVVVdlF6dEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRCUVVWQkxFZEJRVWM3TzBGQlJVZ3NUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRE0wSTdPMFZCUlVVc1YwRkJWeXhGUVVGRkxFbEJRVWs3UlVGRGFrSXNWMEZCVnl4RlFVRkZMRWxCUVVrN1JVRkRha0lzVTBGQlV5eEZRVUZGTEVsQlFVazdSVUZEWml4UlFVRlJMRVZCUVVVc1NVRkJTVHRCUVVOb1FpeEZRVUZGTEZkQlFWY3NSVUZCUlN4SlFVRkpPMEZCUTI1Q096dEJRVVZCTEVWQlFVVXNZMEZCWXl4RlFVRkZMRWxCUVVrN08wTkJSWEpDTEVOQlFVTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJR3RsZVUxcGNuSnZjaUE5SUhKbGNYVnBjbVVvSjNKbFlXTjBMMnhwWWk5clpYbE5hWEp5YjNJbktUdGNibHh1THlvcVhHNGdLaUJCWTNScGIyNGdkSGx3WlNCamIyNXpkR0Z1ZEhNdUlGTm9iM1ZzWkNCbWIyeHNiM2NnZEdobElHWnZjbTFoZERwY2JpQXFJRHhQUWtwRlExUWdRVXhKUVZNK1h6eFdSVkpDUGx4dUlDcGNiaUFxSUVadmNpQmxlR0Z0Y0d4bExDQmhiaUJoWTNScGIyNGdabTl5SUdabGRHTm9hVzVuSUdFZ2MzQmxZMmxtYVdNZ1hDSkpkR1Z0WENJZ2IySnFaV04wT2x4dUlDb2dTVlJGVFY5SFJWUmNiaUFxWEc0Z0tpQkJZM1JwYjI1eklIWmxjbUp6SUhOb2IzVnNaQ0IwZVhCcFkyRnNiSGtnZFhObElHOXVaU0J2WmlCMGFHVWdabTlzYkc5M2FXNW5PbHh1SUNvZ1IwVlVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUR3dElGSmxkSEpwWlhacGJtY2dZU0JzYVhOMElHOW1JRzlpYW1WamRITXVJQ2hsTG1jdUlFZEZWQ0F2YVhSbGJYTXBYRzRnS2lCUVQxTlVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnUEMwZ1EzSmxZWFJwYm1jZ1lXNGdiMkpxWldOMExpQW9aUzVuTGlCUVQxTlVJQzlwZEdWdGN5bGNiaUFxSUZCVlZDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TFNCVmNHUmhkR1VnWVc0Z1pYaHBjM1JwYm1jZ2IySnFaV04wTGlBb1pTNW5MaUJRVlZRZ0wybDBaVzF6THpwcFpDbGNiaUFxSUVSRlRFVlVSU0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0E4TFNCRVpXeGxkR2x1WnlCaGJpQnZZbXBsWTNRdUlDaGxMbWN1SUVSRlRFVlVSU0F2YVhSbGJYTXZPbWxrS1Z4dUlDcGNiaUFxSUZOdmJXVWdZV04wYVc5dWN5QjBlWEJsY3lCdFlYa2dibTkwSUdoaGRtVWdZU0J5WldObGFYWmxjaXdnZDJocFkyZ2dhWE1nVDBzdUlGUm9aU0J5WlhOMWJIUWdiMllnVUU5VFZDd2dVRlZVTENCaGJtUWdSRVZNUlZSRklHRmpkR2x2Ym5OY2JpQXFJRzFoZVNCbGJuUmxjaUJpWVdOcklHbHVkRzhnZEdobElITjVjM1JsYlNCMGFISnZkV2RvSUhOMVluTmpjbWx3ZEdsdmJuTWdjbUYwYUdWeUlIUm9ZVzRnYVc0Z2NtVnpjRzl1YzJVZ2RHOGdRVkJKSUhKbGNYVmxjM1J6TGx4dUlDb3ZYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYTJWNVRXbHljbTl5S0h0Y2JseHVJQ0F2THlCcGRHVnRJR0ZqZEdsdmJuTmNiaUFnU1ZSRlRWOUhSVlJCVEV3NklHNTFiR3dzWEc0Z0lFbFVSVTFmUjBWVVQwNUZPaUJ1ZFd4c0xGeHVJQ0JKVkVWTlgxQlBVMVE2SUc1MWJHd3NYRzRnSUVsVVJVMWZVRlZVT2lCdWRXeHNMRnh1SUNCSlZFVk5YMFJGVEVWVVJUb2diblZzYkN4Y2JseHVJQ0F2THlCelpYSjJaWEowYVcxbElHRmpkR2x2Ym5OY2JpQWdVMFZTVmtWU1ZFbE5SVjlIUlZRNklHNTFiR3hjYmx4dWZTazdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ3JlYWN0L2xpYi9rZXlNaXJyb3InKTtcblxuLyoqXG4gICogU3RvcmUgZW50aXRpZXMgbmVlZCB0aGUgY29uY2VwdCBvZiBcIm5ld1wiLCBcImRpcnR5XCIsIFwiZGVsZXRlZFwiIChpLmUuIGlzTmV3LCBpc0RpcnR5LCBpc0RlbGV0ZSkgd2hpY2hcbiAgKiB3aGVuIGNvbWJpbmVkIHdpdGggc3RhdGUgKHN5bmNlZCwgcmVxdWVzdCwgZXJyb3JlZCkgcHJvdmlkZXMgY29tcG9uZW50cyBnb29kIGRldGFpbCBvbiBob3cgdG9cbiAgKiByZW5kZXJcbiAgKlxuICAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGtleU1pcnJvcih7XG5cbiAgLyogZW50aXR5IHN0YXRlcyAqL1xuICBTWU5DRUQ6IG51bGwsICAgICAvLyBlbnRpdHkgaXMgaW4gc3luYyB3aXRoIGJhY2tlbmRcbiAgTE9BRElORzogbnVsbCwgICAgLy8gZW50aXR5IGlzIGluLXByb2Nlc3Mgb2YgYmVpbmcgZmV0Y2hlZCBmcm9tIGJhY2tlbmQgKGltcGxpZXMgR0VUKVxuICBORVc6IG51bGwsICAgICAgICAvLyBlbnRpdHkgaXMgbmV3IGFuZCBpbi1wcm9jZXNzIG9mIHN5bmNpbmcgd2l0aCBiYWNrZW5kXG4gIFNBVklORzogbnVsbCwgICAgIC8vIGVudGl0eSBpcyBkaXJ0eSBhbmQgaW4tcHJvY2VzcyBvZiBzeW5jaW5nIHdpdGggYmFja2VuZFxuICBERUxFVElORzogbnVsbCwgICAvLyBlbnRpdHkgaGFzIGJlZW4gZGVsZXRlZCBhbmQgaW4tcHJvY2VzcyBvZiBzeW5jaW5nIHdpdGggYmFja2VuZFxuICBFUlJPUkVEOiBudWxsICAgICAvLyBlbnRpdHkgaXMgaW4gYW4gZXJyb3Igc3RhdGUgYW5kIHBvdGVudGlhbGx5IG91dC1vZi1zeW5jIHdpdGggc2VydmVyXG5cbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12WTI5dWMzUmhiblJ6TDNOMFlYUmxjeTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU03TzBGQlJTOURPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEJRVVZCTEVsQlFVazdPMEZCUlVvc1RVRkJUU3hEUVVGRExFOUJRVThzUjBGQlJ5eFRRVUZUTEVOQlFVTTdRVUZETTBJN08wVkJSVVVzVFVGQlRTeEZRVUZGTEVsQlFVazdSVUZEV2l4UFFVRlBMRVZCUVVVc1NVRkJTVHRGUVVOaUxFZEJRVWNzUlVGQlJTeEpRVUZKTzBWQlExUXNUVUZCVFN4RlFVRkZMRWxCUVVrN1JVRkRXaXhSUVVGUkxFVkJRVVVzU1VGQlNUdEJRVU5vUWl4RlFVRkZMRTlCUVU4c1JVRkJSU3hKUVVGSk96dERRVVZrTEVOQlFVTXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJR3RsZVUxcGNuSnZjaUE5SUhKbGNYVnBjbVVvSjNKbFlXTjBMMnhwWWk5clpYbE5hWEp5YjNJbktUdGNibHh1THlvcVhHNGdJQ29nVTNSdmNtVWdaVzUwYVhScFpYTWdibVZsWkNCMGFHVWdZMjl1WTJWd2RDQnZaaUJjSW01bGQxd2lMQ0JjSW1ScGNuUjVYQ0lzSUZ3aVpHVnNaWFJsWkZ3aUlDaHBMbVV1SUdselRtVjNMQ0JwYzBScGNuUjVMQ0JwYzBSbGJHVjBaU2tnZDJocFkyaGNiaUFnS2lCM2FHVnVJR052YldKcGJtVmtJSGRwZEdnZ2MzUmhkR1VnS0hONWJtTmxaQ3dnY21WeGRXVnpkQ3dnWlhKeWIzSmxaQ2tnY0hKdmRtbGtaWE1nWTI5dGNHOXVaVzUwY3lCbmIyOWtJR1JsZEdGcGJDQnZiaUJvYjNjZ2RHOWNiaUFnS2lCeVpXNWtaWEpjYmlBZ0tseHVJQ0FxTDF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlHdGxlVTFwY25KdmNpaDdYRzVjYmlBZ0x5b2daVzUwYVhSNUlITjBZWFJsY3lBcUwxeHVJQ0JUV1U1RFJVUTZJRzUxYkd3c0lDQWdJQ0F2THlCbGJuUnBkSGtnYVhNZ2FXNGdjM2x1WXlCM2FYUm9JR0poWTJ0bGJtUmNiaUFnVEU5QlJFbE9Sem9nYm5Wc2JDd2dJQ0FnTHk4Z1pXNTBhWFI1SUdseklHbHVMWEJ5YjJObGMzTWdiMllnWW1WcGJtY2dabVYwWTJobFpDQm1jbTl0SUdKaFkydGxibVFnS0dsdGNHeHBaWE1nUjBWVUtWeHVJQ0JPUlZjNklHNTFiR3dzSUNBZ0lDQWdJQ0F2THlCbGJuUnBkSGtnYVhNZ2JtVjNJR0Z1WkNCcGJpMXdjbTlqWlhOeklHOW1JSE41Ym1OcGJtY2dkMmwwYUNCaVlXTnJaVzVrWEc0Z0lGTkJWa2xPUnpvZ2JuVnNiQ3dnSUNBZ0lDOHZJR1Z1ZEdsMGVTQnBjeUJrYVhKMGVTQmhibVFnYVc0dGNISnZZMlZ6Y3lCdlppQnplVzVqYVc1bklIZHBkR2dnWW1GamEyVnVaRnh1SUNCRVJVeEZWRWxPUnpvZ2JuVnNiQ3dnSUNBdkx5QmxiblJwZEhrZ2FHRnpJR0psWlc0Z1pHVnNaWFJsWkNCaGJtUWdhVzR0Y0hKdlkyVnpjeUJ2WmlCemVXNWphVzVuSUhkcGRHZ2dZbUZqYTJWdVpGeHVJQ0JGVWxKUFVrVkVPaUJ1ZFd4c0lDQWdJQ0F2THlCbGJuUnBkSGtnYVhNZ2FXNGdZVzRnWlhKeWIzSWdjM1JoZEdVZ1lXNWtJSEJ2ZEdWdWRHbGhiR3g1SUc5MWRDMXZaaTF6ZVc1aklIZHBkR2dnYzJWeWRtVnlYRzVjYm4wcE8xeHVJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCcuL3ZlbmRvci9mbHV4L0Rpc3BhdGNoZXInKTtcblxubW9kdWxlLmV4cG9ydHMgPSBfLmV4dGVuZChuZXcgRGlzcGF0Y2hlcigpLCB7XG5cbiAgLyoqXG4gICAqIEEgYnJpZGdlIGZ1bmN0aW9uIGJldHdlZW4gdGhlIHZpZXdzIGFuZCB0aGUgZGlzcGF0Y2hlciwgbWFya2luZyB0aGUgYWN0aW9uXG4gICAqIGFzIGEgdmlldyBhY3Rpb24uXG4gICAqIEBwYXJhbSAge29iamVjdH0gYWN0aW9uIFRoZSBkYXRhIGNvbWluZyBmcm9tIHRoZSB2aWV3LlxuICAgKi9cbiAgaGFuZGxlVmlld0FjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaCh7XG4gICAgICBzb3VyY2U6ICdWSUVXX0FDVElPTicsXG4gICAgICBhY3Rpb246IGFjdGlvblxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBBIGJyaWRnZSBmdW5jdGlvbiBiZXR3ZWVuIHRoZSBzZXJ2ZXIgYW5kIHRoZSBkaXNwYXRjaGVyLCBtYXJraW5nIHRoZSBhY3Rpb25cbiAgICogYXMgYSBzZXJ2ZXIgYWN0aW9uLlxuICAgKiBAcGFyYW0gIHtvYmplY3R9IGFjdGlvbiBUaGUgZGF0YSBjb21pbmcgZnJvbSB0aGUgdmlldy5cbiAgICovXG4gIGhhbmRsZVNlcnZlckFjdGlvbjogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgdGhpcy5kaXNwYXRjaCh7XG4gICAgICBzb3VyY2U6ICdTRVJWRVJfQUNUSU9OJyxcbiAgICAgIGFjdGlvbjogYWN0aW9uXG4gICAgfSk7XG4gIH1cblxufSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZaR2x6Y0dGMFkyaGxjaTVxY3lKZExDSnVZVzFsY3lJNlcxMHNJbTFoY0hCcGJtZHpJam9pUVVGQlFTeFpRVUZaTEVOQlFVTTdPMEZCUldJc1NVRkJTU3hEUVVGRExFZEJRVWNzVDBGQlR5eERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUXpGQ0xFbEJRVWtzVlVGQlZTeEhRVUZITEU5QlFVOHNRMEZCUXl3d1FrRkJNRUlzUTBGQlF5eERRVUZET3p0QlFVVnlSQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hWUVVGVkxFVkJRVVVzUlVGQlJUdEJRVU0xUXp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk96dEZRVVZGTEdkQ1FVRm5RaXhGUVVGRkxGTkJRVk1zVFVGQlRTeEZRVUZGTzBsQlEycERMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03VFVGRFdpeE5RVUZOTEVWQlFVVXNZVUZCWVR0TlFVTnlRaXhOUVVGTkxFVkJRVVVzVFVGQlRUdExRVU5tTEVOQlFVTXNRMEZCUXp0QlFVTlFMRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CT3p0RlFVVkZMR3RDUVVGclFpeEZRVUZGTEZOQlFWTXNUVUZCVFN4RlFVRkZPMGxCUTI1RExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTTdUVUZEV2l4TlFVRk5MRVZCUVVVc1pVRkJaVHROUVVOMlFpeE5RVUZOTEVWQlFVVXNUVUZCVFR0TFFVTm1MRU5CUVVNc1EwRkJRenRCUVVOUUxFZEJRVWM3TzBOQlJVWXNRMEZCUXl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ1h5QTlJSEpsY1hWcGNtVW9KMnh2WkdGemFDY3BPMXh1ZG1GeUlFUnBjM0JoZEdOb1pYSWdQU0J5WlhGMWFYSmxLQ2N1TDNabGJtUnZjaTltYkhWNEwwUnBjM0JoZEdOb1pYSW5LVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCZkxtVjRkR1Z1WkNodVpYY2dSR2x6Y0dGMFkyaGxjaWdwTENCN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVFZ1luSnBaR2RsSUdaMWJtTjBhVzl1SUdKbGRIZGxaVzRnZEdobElIWnBaWGR6SUdGdVpDQjBhR1VnWkdsemNHRjBZMmhsY2l3Z2JXRnlhMmx1WnlCMGFHVWdZV04wYVc5dVhHNGdJQ0FxSUdGeklHRWdkbWxsZHlCaFkzUnBiMjR1WEc0Z0lDQXFJRUJ3WVhKaGJTQWdlMjlpYW1WamRIMGdZV04wYVc5dUlGUm9aU0JrWVhSaElHTnZiV2x1WnlCbWNtOXRJSFJvWlNCMmFXVjNMbHh1SUNBZ0tpOWNiaUFnYUdGdVpHeGxWbWxsZDBGamRHbHZiam9nWm5WdVkzUnBiMjRvWVdOMGFXOXVLU0I3WEc0Z0lDQWdkR2hwY3k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCemIzVnlZMlU2SUNkV1NVVlhYMEZEVkVsUFRpY3NYRzRnSUNBZ0lDQmhZM1JwYjI0NklHRmpkR2x2Ymx4dUlDQWdJSDBwTzF4dUlDQjlMRnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkJJR0p5YVdSblpTQm1kVzVqZEdsdmJpQmlaWFIzWldWdUlIUm9aU0J6WlhKMlpYSWdZVzVrSUhSb1pTQmthWE53WVhSamFHVnlMQ0J0WVhKcmFXNW5JSFJvWlNCaFkzUnBiMjVjYmlBZ0lDb2dZWE1nWVNCelpYSjJaWElnWVdOMGFXOXVMbHh1SUNBZ0tpQkFjR0Z5WVcwZ0lIdHZZbXBsWTNSOUlHRmpkR2x2YmlCVWFHVWdaR0YwWVNCamIyMXBibWNnWm5KdmJTQjBhR1VnZG1sbGR5NWNiaUFnSUNvdlhHNGdJR2hoYm1Sc1pWTmxjblpsY2tGamRHbHZiam9nWm5WdVkzUnBiMjRvWVdOMGFXOXVLU0I3WEc0Z0lDQWdkR2hwY3k1a2FYTndZWFJqYUNoN1hHNGdJQ0FnSUNCemIzVnlZMlU2SUNkVFJWSldSVkpmUVVOVVNVOU9KeXhjYmlBZ0lDQWdJR0ZqZEdsdmJqb2dZV04wYVc5dVhHNGdJQ0FnZlNrN1hHNGdJSDFjYmx4dWZTazdYRzRpWFgwPSIsIid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QvYWRkb25zJyk7XG5cbnZhciBSb3V0ZXIgPSByZXF1aXJlKCdyZWFjdC1yb3V0ZXInKSxcbiAgICBSb3V0ZSA9IFJvdXRlci5Sb3V0ZSxcbiAgICBOb3RGb3VuZFJvdXRlID0gUm91dGVyLk5vdEZvdW5kUm91dGUsXG4gICAgRGVmYXVsdFJvdXRlID0gUm91dGVyLlJvdXRlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChcblxuICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlLCB7bmFtZTogXCJyb290XCIsIHBhdGg6IFwiL1wiLCBoYW5kbGVyOiByZXF1aXJlKCcuL2NvbXBvbmVudHMvYXBwLmpzeCcpfSwgXG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KERlZmF1bHRSb3V0ZSwge25hbWU6IFwiaXRlbXNcIiwgcGF0aDogXCIvXCIsIGhhbmRsZXI6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9pdGVtcy5qc3gnKX0pLCBcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUm91dGUsIHtuYW1lOiBcInNlcnZlci10aW1lXCIsIGhhbmRsZXI6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXJ2ZXItdGltZS5qc3gnKX0pLCBcblxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm90Rm91bmRSb3V0ZSwge2hhbmRsZXI6IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yb3V0ZS1ub3QtZm91bmQuanN4Jyl9KVxuXG4gIClcbik7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZjbTkxZEdWekxtcHplQ0pkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVN4WlFVRlpMRU5CUVVNN08wRkJSV0lzU1VGQlNTeExRVUZMTEVkQlFVY3NUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96dEJRVVZ3UXl4SlFVRkpMRTFCUVUwc1IwRkJSeXhQUVVGUExFTkJRVU1zWTBGQll5eERRVUZETzBsQlEyaERMRXRCUVVzc1IwRkJSeXhOUVVGTkxFTkJRVU1zUzBGQlN6dEpRVU53UWl4aFFVRmhMRWRCUVVjc1RVRkJUU3hEUVVGRExHRkJRV0U3UVVGRGVFTXNTVUZCU1N4WlFVRlpMRWRCUVVjc1RVRkJUU3hEUVVGRExFdEJRVXNzUTBGQlF6czdRVUZGYUVNc1RVRkJUU3hEUVVGRExFOUJRVTg3TzBGQlJXUXNSVUZCUlN4dlFrRkJReXhMUVVGTExFVkJRVUVzUTBGQlFTeERRVUZETEVsQlFVRXNSVUZCU1N4RFFVRkRMRTFCUVVFc1JVRkJUU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEVkQlFVRXNSVUZCUnl4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFOUJRVThzUTBGQlF5eHpRa0ZCYzBJc1EwRkJSeXhEUVVGQkxFVkJRVUU3TzBGQlJYaEZMRWxCUVVrc2IwSkJRVU1zV1VGQldTeEZRVUZCTEVOQlFVRXNRMEZCUXl4SlFVRkJMRVZCUVVrc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlF5eEpRVUZCTEVWQlFVa3NRMEZCUXl4SFFVRkJMRVZCUVVjc1EwRkJReXhQUVVGQkxFVkJRVThzUTBGQlJTeFBRVUZQTEVOQlFVTXNkMEpCUVhkQ0xFTkJRVVVzUTBGQlFTeERRVUZITEVOQlFVRXNSVUZCUVRzN1FVRkZkRVlzU1VGQlNTeHZRa0ZCUXl4TFFVRkxMRVZCUVVFc1EwRkJRU3hEUVVGRExFbEJRVUVzUlVGQlNTeERRVUZETEdGQlFVRXNSVUZCWVN4RFFVRkRMRTlCUVVFc1JVRkJUeXhEUVVGRkxFOUJRVThzUTBGQlF5dzRRa0ZCT0VJc1EwRkJSU3hEUVVGQkxFTkJRVWNzUTBGQlFTeEZRVUZCT3p0QlFVVnNSaXhKUVVGSkxHOUNRVUZETEdGQlFXRXNSVUZCUVN4RFFVRkJMRU5CUVVNc1QwRkJRU3hGUVVGUExFTkJRVVVzVDBGQlR5eERRVUZETEd0RFFVRnJReXhEUVVGRkxFTkJRVUVzUTBGQlJ5eERRVUZCT3p0RlFVVnFSU3hEUVVGQk8wTkJRMVFzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUZKbFlXTjBJRDBnY21WeGRXbHlaU2duY21WaFkzUXZZV1JrYjI1ekp5azdYRzVjYm5aaGNpQlNiM1YwWlhJZ1BTQnlaWEYxYVhKbEtDZHlaV0ZqZEMxeWIzVjBaWEluS1N4Y2JpQWdJQ0JTYjNWMFpTQTlJRkp2ZFhSbGNpNVNiM1YwWlN4Y2JpQWdJQ0JPYjNSR2IzVnVaRkp2ZFhSbElEMGdVbTkxZEdWeUxrNXZkRVp2ZFc1a1VtOTFkR1VzWEc0Z0lDQWdSR1ZtWVhWc2RGSnZkWFJsSUQwZ1VtOTFkR1Z5TGxKdmRYUmxPMXh1WEc1dGIyUjFiR1V1Wlhod2IzSjBjeUE5SUNoY2JseHVJQ0E4VW05MWRHVWdibUZ0WlQxY0luSnZiM1JjSWlCd1lYUm9QVndpTDF3aUlHaGhibVJzWlhJOWUzSmxjWFZwY21Vb0p5NHZZMjl0Y0c5dVpXNTBjeTloY0hBdWFuTjRKeWw5UGx4dVhHNGdJQ0FnUEVSbFptRjFiSFJTYjNWMFpTQnVZVzFsUFZ3aWFYUmxiWE5jSWlCd1lYUm9QVndpTDF3aUlHaGhibVJzWlhJOWUzSmxjWFZwY21Vb0p5NHZZMjl0Y0c5dVpXNTBjeTlwZEdWdGN5NXFjM2duS1gwZ0x6NWNibHh1SUNBZ0lEeFNiM1YwWlNCdVlXMWxQVndpYzJWeWRtVnlMWFJwYldWY0lpQm9ZVzVrYkdWeVBYdHlaWEYxYVhKbEtDY3VMMk52YlhCdmJtVnVkSE12YzJWeWRtVnlMWFJwYldVdWFuTjRKeWw5SUM4K1hHNWNiaUFnSUNBOFRtOTBSbTkxYm1SU2IzVjBaU0JvWVc1a2JHVnlQWHR5WlhGMWFYSmxLQ2N1TDJOdmJYQnZibVZ1ZEhNdmNtOTFkR1V0Ym05MExXWnZkVzVrTG1wemVDY3BmU0F2UGx4dVhHNGdJRHd2VW05MWRHVStYRzRwTzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlcjtcblxudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciBpbyA9IHJlcXVpcmUoJ3NvY2tldC5pby1jbGllbnQnKTtcblxudmFyIGh0dHBWZXJiUmUgPSAvXihHRVR8UFVUfFBPU1R8REVMRVRFKVxccy87XG5cblxuY2xhc3MgU3Vic2NyaXB0aW9uU2VydmljZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGFjY2Vzc1Rva2VuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuYWNjZXNzVG9rZW4gPSBhY2Nlc3NUb2tlbjtcblxuICAgIHZhciBzb2NrZXQgPSB0aGlzLnNvY2tldCA9IGlvKHt0cmFuc3BvcnRzOlsnd2Vic29ja2V0J119KTtcblxuICAgIC8vIGF0dGFjaCBoYW5kbGVyc1xuICAgIHNvY2tldC5vbignY29ubmVjdCcsIHRoaXMuaGFuZGxlQ29ubmVjdC5iaW5kKHRoaXMpKTtcbiAgICBzb2NrZXQub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLmhhbmRsZURpc2Nvbm5lY3QuYmluZCh0aGlzKSk7XG4gICAgc29ja2V0Lm9uKCdyZWNvbm5lY3QnLCB0aGlzLmhhbmRsZVJlY29ubmVjdC5iaW5kKHRoaXMpKTtcbiAgICBzb2NrZXQub24oJ3NldCcsIHRoaXMuaGFuZGxlU2V0LmJpbmQodGhpcykpO1xuXG4gICAgLy9jb25zb2xlLmxvZyhzb2NrZXQpO1xuICB9XG5cbiAgaGFuZGxlQ29ubmVjdCgpe1xuICAgIHRoaXMuc29ja2V0LmVtaXQoJ2F1dGgnLCB0aGlzLmFjY2Vzc1Rva2VuKTtcbiAgICB0aGlzLmVtaXQoJ2Nvbm5lY3QnKTtcbiAgfVxuXG4gIGhhbmRsZURpc2Nvbm5lY3QoKXtcbiAgICB0aGlzLmVtaXQoJ2Rpc2Nvbm5lY3QnKTtcbiAgfVxuXG4gIGhhbmRsZVJlY29ubmVjdChhdHRlbXB0cyl7XG4gICAgLy9jb25zb2xlLmRlYnVnKCdyZWNvbm5lY3Q7IGF0dGVtcHRzOiAnICsgYXR0ZW1wdHMpO1xuICAgIF8uZWFjaCh0aGlzLl9ldmVudHMsIGZ1bmN0aW9uKGZuLCBjaGFubmVsKXtcbiAgICAgIC8vIG9uIHJlY29ubmVjdCByZW1vdmUgYWxsIEFQSSBjaGFubmVsIGxpc3RlbmVyc1xuICAgICAgaWYgKGh0dHBWZXJiUmUudGVzdChjaGFubmVsKSkge1xuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhjaGFubmVsKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLmVtaXQoJ3JlY29ubmVjdCcpO1xuICB9XG5cbiAgaGFuZGxlU2V0KGRhdGEpe1xuICAgIHRoaXMuZW1pdChkYXRhLmNoYW5uZWwsICdzZXQnLCBkYXRhLmNoYW5uZWwsIEpTT04ucGFyc2UoZGF0YS5kYXRhKSk7XG4gIH1cblxuICBzdWJzY3JpYmUoY2hhbm5lbCwgaGFuZGxlciwgb3B0aW9ucyl7XG4gICAgLy9jb25zb2xlLmxvZygnc3Vic2NyaWJlJywgYXJndW1lbnRzKTtcblxuICAgIC8vIG9ubHkgb25lIHN1YnNjcmlwdGlvbiBwZXIgY2hhbm5lbFxuICAgIGlmIChFdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCh0aGlzLCBjaGFubmVsKSAhPT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdhcGktc3Vic2NyaXB0aW9uOiBDYW5ub3Qgc3Vic2NyaWJlIHRvIGNoYW5uZWwgXCInICsgY2hhbm5lbCArICdcIiBtb3JlIHRoYW4gb25jZS4nKTtcbiAgICB9XG5cbiAgICBvcHRpb25zID0gXy5leHRlbmQoe1xuICAgICAgaW5pdGlhbFBheWxvYWQ6IGZhbHNlLFxuICAgICAgLy8gZGVwcmVjYXRlZFxuICAgICAgcmVjb25uZWN0UGF5bG9hZDogZmFsc2VcbiAgICB9LCBvcHRpb25zIHx8IHt9KTtcblxuICAgIGhhbmRsZXIuX29wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy5hZGRMaXN0ZW5lcihjaGFubmVsLCBoYW5kbGVyKTtcbiAgICB0aGlzLnNvY2tldC5lbWl0KCdzdWJzY3JpYmUnLCBjaGFubmVsLCBvcHRpb25zLmluaXRpYWxQYXlsb2FkKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5zdWJzY3JpYmUoY2hhbm5lbCwgaGFuZGxlcil7XG4gICAgLy9jb25zb2xlLmxvZygndW5zdWJzY3JpYmUnLCBhcmd1bWVudHMpO1xuXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBoYW5kbGVyKTtcblxuICAgIC8vIGlmIHRoZXJlJ3Mgbm8gbW9yZSBoYW5kbGVycyBmb3IgdGhpcyBjaGFubmVsLCB1bnN1YnNjcmliZSBmcm9tIGl0IGNvbXBsZXRlbHlcbiAgICBpZiAoRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQodGhpcywgY2hhbm5lbCkgPT09IDApIHtcbiAgICAgIHRoaXMuc29ja2V0LmVtaXQoJ3Vuc3Vic2NyaWJlJywgY2hhbm5lbCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbm9ybWFsaXplQ2hhbm5lbE5hbWUoY2hhbm5lbCl7XG4gICAgcmV0dXJuIGNoYW5uZWwucmVwbGFjZSgvXihHRVR8UFVUfFBPU1R8REVMRVRFKVxccy8sICcnKTtcbiAgfVxuXG4gIGlzQ29ubmVjdGVkKCl7XG4gICAgcmV0dXJuIHRoaXMuc29ja2V0LmNvbm5lY3RlZDtcbiAgfVxuXG4gIGlzRGlzY29ubmVjdGVkKCl7XG4gICAgcmV0dXJuIHRoaXMuc29ja2V0LmRpc2Nvbm5lY3RlZDtcbiAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFjY2Vzc1Rva2VuKSB7XG4gIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uU2VydmljZShhY2Nlc3NUb2tlbik7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12YzJWeWRtbGpaWE12WVhCcExYTjFZbk5qY21sd2RHbHZibk11YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNXVUZCV1N4RFFVRkRPenRCUVVWaUxFbEJRVWtzV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhaUVVGWkxFTkJRVU03TzBGQlJXeEVMRWxCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTXhRaXhKUVVGSkxFVkJRVVVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUTBGQlF6czdRVUZGY2tNc1NVRkJTU3hWUVVGVkxFZEJRVWNzTUVKQlFUQkNMRU5CUVVNN1FVRkROVU03TzBGQlJVRXNUVUZCVFN4dFFrRkJiVUlzVTBGQlV5eFpRVUZaTEVOQlFVTTdSVUZETjBNc1YwRkJWeXhqUVVGak8wRkJRek5DTEVsQlFVa3NTMEZCU3l4RlFVRkZMRU5CUVVNN08wRkJSVm9zU1VGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRmRCUVZjc1EwRkJRenM3UVVGRmJrTXNTVUZCU1N4SlFVRkpMRTFCUVUwc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeEhRVUZITEVWQlFVVXNRMEZCUXl4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRExGZEJRVmNzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTTVSRHM3U1VGRlNTeE5RVUZOTEVOQlFVTXNSVUZCUlN4RFFVRkRMRk5CUVZNc1JVRkJSU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRM0JFTEUxQlFVMHNRMEZCUXl4RlFVRkZMRU5CUVVNc1dVRkJXU3hGUVVGRkxFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTXhSQ3hOUVVGTkxFTkJRVU1zUlVGQlJTeERRVUZETEZkQlFWY3NSVUZCUlN4SlFVRkpMRU5CUVVNc1pVRkJaU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXpWRUxFbEJRVWtzVFVGQlRTeERRVUZETEVWQlFVVXNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOb1JEczdRVUZGUVN4SFFVRkhPenRGUVVWRUxHRkJRV0VzUlVGQlJUdEpRVU5pTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUlVGQlJTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN1NVRkRNME1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVONlFpeEhRVUZIT3p0RlFVVkVMR2RDUVVGblFpeEZRVUZGTzBsQlEyaENMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVOQlFVTTdRVUZETlVJc1IwRkJSenM3UVVGRlNDeEZRVUZGTEdWQlFXVXNWVUZCVlRzN1FVRkZNMElzU1VGQlNTeERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzVTBGQlV5eEZRVUZGTEVWQlFVVXNUMEZCVHl4RFFVRkRPenROUVVWNFF5eEpRVUZKTEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3VVVGRE5VSXNTVUZCU1N4RFFVRkRMR3RDUVVGclFpeERRVUZETEU5QlFVOHNRMEZCUXl4RFFVRkRPMDlCUTJ4RE8wdEJRMFlzUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTlVMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVOQlFVTTdRVUZETTBJc1IwRkJSenM3UlVGRlJDeFRRVUZUTEUxQlFVMDdTVUZEWWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhQUVVGUExFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU40UlN4SFFVRkhPenRCUVVWSUxFVkJRVVVzVTBGQlV5d3lRa0ZCTWtJN1FVRkRkRU03UVVGRFFUczdTVUZGU1N4SlFVRkpMRmxCUVZrc1EwRkJReXhoUVVGaExFTkJRVU1zU1VGQlNTeEZRVUZGTEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1JVRkJSVHROUVVOdVJDeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMR2xFUVVGcFJDeEhRVUZITEU5QlFVOHNSMEZCUnl4dFFrRkJiVUlzUTBGQlF5eERRVUZETzBGQlEzcEhMRXRCUVVzN08wbEJSVVFzVDBGQlR5eEhRVUZITEVOQlFVTXNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRka0lzVFVGQlRTeGpRVUZqTEVWQlFVVXNTMEZCU3pzN1RVRkZja0lzWjBKQlFXZENMRVZCUVVVc1MwRkJTenRCUVVNM1FpeExRVUZMTEVWQlFVVXNUMEZCVHl4SlFVRkpMRVZCUVVVc1EwRkJReXhEUVVGRE96dEJRVVYwUWl4SlFVRkpMRTlCUVU4c1EwRkJReXhSUVVGUkxFZEJRVWNzVDBGQlR5eERRVUZET3p0SlFVVXpRaXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEU5QlFVOHNSVUZCUlN4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVOMlF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExGZEJRVmNzUlVGQlJTeFBRVUZQTEVWQlFVVXNUMEZCVHl4RFFVRkRMR05CUVdNc1EwRkJReXhEUVVGRE96dEpRVVV2UkN4UFFVRlBMRWxCUVVrc1EwRkJRenRCUVVOb1FpeEhRVUZIT3p0QlFVVklMRVZCUVVVc1YwRkJWeXhyUWtGQmEwSTdRVUZETDBJN08wRkJSVUVzU1VGQlNTeEpRVUZKTEVOQlFVTXNZMEZCWXl4RFFVRkRMRTlCUVU4c1JVRkJSU3hQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU14UXpzN1NVRkZTU3hKUVVGSkxGbEJRVmtzUTBGQlF5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUlVGQlJUdE5RVU51UkN4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eGhRVUZoTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1MwRkRNVU03U1VGRFJDeFBRVUZQTEVsQlFVa3NRMEZCUXp0QlFVTm9RaXhIUVVGSE96dEZRVVZFTEc5Q1FVRnZRaXhUUVVGVE8wbEJRek5DTEU5QlFVOHNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXd3UWtGQk1FSXNSVUZCUlN4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVNelJDeEhRVUZIT3p0RlFVVkVMRmRCUVZjc1JVRkJSVHRKUVVOWUxFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4VFFVRlRMRU5CUVVNN1FVRkRha01zUjBGQlJ6czdSVUZGUkN4alFVRmpMRVZCUVVVN1NVRkRaQ3hQUVVGUExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRPMGRCUTJwRE8wRkJRMGdzUTBGQlF6dEJRVU5FT3p0QlFVVkJMRTFCUVUwc1EwRkJReXhQUVVGUExFZEJRVWNzVlVGQlZTeFhRVUZYTEVWQlFVVTdSVUZEZEVNc1QwRkJUeXhKUVVGSkxHMUNRVUZ0UWl4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wTkJRemRETEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCRmRtVnVkRVZ0YVhSMFpYSWdQU0J5WlhGMWFYSmxLRndpWlhabGJuUnpYQ0lwTGtWMlpXNTBSVzFwZEhSbGNqdGNibHh1ZG1GeUlGOGdQU0J5WlhGMWFYSmxLQ2RzYjJSaGMyZ25LVHRjYm5aaGNpQnBieUE5SUhKbGNYVnBjbVVvSjNOdlkydGxkQzVwYnkxamJHbGxiblFuS1R0Y2JseHVkbUZ5SUdoMGRIQldaWEppVW1VZ1BTQXZYaWhIUlZSOFVGVlVmRkJQVTFSOFJFVk1SVlJGS1Z4Y2N5ODdYRzVjYmx4dVkyeGhjM01nVTNWaWMyTnlhWEIwYVc5dVUyVnlkbWxqWlNCbGVIUmxibVJ6SUVWMlpXNTBSVzFwZEhSbGNpQjdYRzRnSUdOdmJuTjBjblZqZEc5eUtHRmpZMlZ6YzFSdmEyVnVLU0I3WEc0Z0lDQWdjM1Z3WlhJb0tUdGNibHh1SUNBZ0lIUm9hWE11WVdOalpYTnpWRzlyWlc0Z1BTQmhZMk5sYzNOVWIydGxianRjYmx4dUlDQWdJSFpoY2lCemIyTnJaWFFnUFNCMGFHbHpMbk52WTJ0bGRDQTlJR2x2S0h0MGNtRnVjM0J2Y25Sek9sc25kMlZpYzI5amEyVjBKMTE5S1R0Y2JseHVJQ0FnSUM4dklHRjBkR0ZqYUNCb1lXNWtiR1Z5YzF4dUlDQWdJSE52WTJ0bGRDNXZiaWduWTI5dWJtVmpkQ2NzSUhSb2FYTXVhR0Z1Wkd4bFEyOXVibVZqZEM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnSUNCemIyTnJaWFF1YjI0b0oyUnBjMk52Ym01bFkzUW5MQ0IwYUdsekxtaGhibVJzWlVScGMyTnZibTVsWTNRdVltbHVaQ2gwYUdsektTazdYRzRnSUNBZ2MyOWphMlYwTG05dUtDZHlaV052Ym01bFkzUW5MQ0IwYUdsekxtaGhibVJzWlZKbFkyOXVibVZqZEM1aWFXNWtLSFJvYVhNcEtUdGNiaUFnSUNCemIyTnJaWFF1YjI0b0ozTmxkQ2NzSUhSb2FYTXVhR0Z1Wkd4bFUyVjBMbUpwYm1Rb2RHaHBjeWtwTzF4dVhHNGdJQ0FnTHk5amIyNXpiMnhsTG14dlp5aHpiMk5yWlhRcE8xeHVJQ0I5WEc1Y2JpQWdhR0Z1Wkd4bFEyOXVibVZqZENncGUxeHVJQ0FnSUhSb2FYTXVjMjlqYTJWMExtVnRhWFFvSjJGMWRHZ25MQ0IwYUdsekxtRmpZMlZ6YzFSdmEyVnVLVHRjYmlBZ0lDQjBhR2x6TG1WdGFYUW9KMk52Ym01bFkzUW5LVHRjYmlBZ2ZWeHVYRzRnSUdoaGJtUnNaVVJwYzJOdmJtNWxZM1FvS1h0Y2JpQWdJQ0IwYUdsekxtVnRhWFFvSjJScGMyTnZibTVsWTNRbktUdGNiaUFnZlZ4dVhHNGdJR2hoYm1Sc1pWSmxZMjl1Ym1WamRDaGhkSFJsYlhCMGN5bDdYRzRnSUNBZ0x5OWpiMjV6YjJ4bExtUmxZblZuS0NkeVpXTnZibTVsWTNRN0lHRjBkR1Z0Y0hSek9pQW5JQ3NnWVhSMFpXMXdkSE1wTzF4dUlDQWdJRjh1WldGamFDaDBhR2x6TGw5bGRtVnVkSE1zSUdaMWJtTjBhVzl1S0dadUxDQmphR0Z1Ym1Wc0tYdGNiaUFnSUNBZ0lDOHZJRzl1SUhKbFkyOXVibVZqZENCeVpXMXZkbVVnWVd4c0lFRlFTU0JqYUdGdWJtVnNJR3hwYzNSbGJtVnljMXh1SUNBZ0lDQWdhV1lnS0doMGRIQldaWEppVW1VdWRHVnpkQ2hqYUdGdWJtVnNLU2tnZTF4dUlDQWdJQ0FnSUNCMGFHbHpMbkpsYlc5MlpVRnNiRXhwYzNSbGJtVnljeWhqYUdGdWJtVnNLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlMQ0IwYUdsektUdGNiaUFnSUNCMGFHbHpMbVZ0YVhRb0ozSmxZMjl1Ym1WamRDY3BPMXh1SUNCOVhHNWNiaUFnYUdGdVpHeGxVMlYwS0dSaGRHRXBlMXh1SUNBZ0lIUm9hWE11WlcxcGRDaGtZWFJoTG1Ob1lXNXVaV3dzSUNkelpYUW5MQ0JrWVhSaExtTm9ZVzV1Wld3c0lFcFRUMDR1Y0dGeWMyVW9aR0YwWVM1a1lYUmhLU2s3WEc0Z0lIMWNibHh1SUNCemRXSnpZM0pwWW1Vb1kyaGhibTVsYkN3Z2FHRnVaR3hsY2l3Z2IzQjBhVzl1Y3lsN1hHNGdJQ0FnTHk5amIyNXpiMnhsTG14dlp5Z25jM1ZpYzJOeWFXSmxKeXdnWVhKbmRXMWxiblJ6S1R0Y2JseHVJQ0FnSUM4dklHOXViSGtnYjI1bElITjFZbk5qY21sd2RHbHZiaUJ3WlhJZ1kyaGhibTVsYkZ4dUlDQWdJR2xtSUNoRmRtVnVkRVZ0YVhSMFpYSXViR2x6ZEdWdVpYSkRiM1Z1ZENoMGFHbHpMQ0JqYUdGdWJtVnNLU0FoUFQwZ01Da2dlMXh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZGhjR2t0YzNWaWMyTnlhWEIwYVc5dU9pQkRZVzV1YjNRZ2MzVmljMk55YVdKbElIUnZJR05vWVc1dVpXd2dYQ0luSUNzZ1kyaGhibTVsYkNBcklDZGNJaUJ0YjNKbElIUm9ZVzRnYjI1alpTNG5LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZjSFJwYjI1eklEMGdYeTVsZUhSbGJtUW9lMXh1SUNBZ0lDQWdhVzVwZEdsaGJGQmhlV3h2WVdRNklHWmhiSE5sTEZ4dUlDQWdJQ0FnTHk4Z1pHVndjbVZqWVhSbFpGeHVJQ0FnSUNBZ2NtVmpiMjV1WldOMFVHRjViRzloWkRvZ1ptRnNjMlZjYmlBZ0lDQjlMQ0J2Y0hScGIyNXpJSHg4SUh0OUtUdGNibHh1SUNBZ0lHaGhibVJzWlhJdVgyOXdkR2x2Ym5NZ1BTQnZjSFJwYjI1ek8xeHVYRzRnSUNBZ2RHaHBjeTVoWkdSTWFYTjBaVzVsY2loamFHRnVibVZzTENCb1lXNWtiR1Z5S1R0Y2JpQWdJQ0IwYUdsekxuTnZZMnRsZEM1bGJXbDBLQ2R6ZFdKelkzSnBZbVVuTENCamFHRnVibVZzTENCdmNIUnBiMjV6TG1sdWFYUnBZV3hRWVhsc2IyRmtLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQjlYRzVjYmlBZ2RXNXpkV0p6WTNKcFltVW9ZMmhoYm01bGJDd2dhR0Z1Wkd4bGNpbDdYRzRnSUNBZ0x5OWpiMjV6YjJ4bExteHZaeWduZFc1emRXSnpZM0pwWW1VbkxDQmhjbWQxYldWdWRITXBPMXh1WEc0Z0lDQWdkR2hwY3k1eVpXMXZkbVZNYVhOMFpXNWxjaWhqYUdGdWJtVnNMQ0JvWVc1a2JHVnlLVHRjYmx4dUlDQWdJQzh2SUdsbUlIUm9aWEpsSjNNZ2JtOGdiVzl5WlNCb1lXNWtiR1Z5Y3lCbWIzSWdkR2hwY3lCamFHRnVibVZzTENCMWJuTjFZbk5qY21saVpTQm1jbTl0SUdsMElHTnZiWEJzWlhSbGJIbGNiaUFnSUNCcFppQW9SWFpsYm5SRmJXbDBkR1Z5TG14cGMzUmxibVZ5UTI5MWJuUW9kR2hwY3l3Z1kyaGhibTVsYkNrZ1BUMDlJREFwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVjMjlqYTJWMExtVnRhWFFvSjNWdWMzVmljMk55YVdKbEp5d2dZMmhoYm01bGJDazdYRzRnSUNBZ2ZWeHVJQ0FnSUhKbGRIVnliaUIwYUdsek8xeHVJQ0I5WEc1Y2JpQWdibTl5YldGc2FYcGxRMmhoYm01bGJFNWhiV1VvWTJoaGJtNWxiQ2w3WEc0Z0lDQWdjbVYwZFhKdUlHTm9ZVzV1Wld3dWNtVndiR0ZqWlNndlhpaEhSVlI4VUZWVWZGQlBVMVI4UkVWTVJWUkZLVnhjY3k4c0lDY25LVHRjYmlBZ2ZWeHVYRzRnSUdselEyOXVibVZqZEdWa0tDbDdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjMjlqYTJWMExtTnZibTVsWTNSbFpEdGNiaUFnZlZ4dVhHNGdJR2x6UkdselkyOXVibVZqZEdWa0tDbDdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVjMjlqYTJWMExtUnBjMk52Ym01bFkzUmxaRHRjYmlBZ2ZWeHVmVnh1WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1puVnVZM1JwYjI0Z0tHRmpZMlZ6YzFSdmEyVnVLU0I3WEc0Z0lISmxkSFZ5YmlCdVpYY2dVM1ZpYzJOeWFYQjBhVzl1VTJWeWRtbGpaU2hoWTJObGMzTlViMnRsYmlrN1hHNTlPMXh1SWwxOSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFwaVN1YnNjcmlwdGlvblNydmMgPSByZXF1aXJlKCcuL2FwaS1zdWJzY3JpcHRpb25zJyk7XG5cbmV4cG9ydHMuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uIChhY2Nlc3NUb2tlbikge1xuICBleHBvcnRzLmFwaVN1YnNjcmlwdGlvbnMgPSBhcGlTdWJzY3JpcHRpb25TcnZjKGFjY2Vzc1Rva2VuKTtcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZjMlZ5ZG1salpYTXZhVzVrWlhndWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUVzV1VGQldTeERRVUZET3p0QlFVVmlMRWxCUVVrc2JVSkJRVzFDTEVkQlFVY3NUMEZCVHl4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVOQlFVTTdPMEZCUlhwRUxFOUJRVThzUTBGQlF5eFZRVUZWTEVkQlFVY3NWVUZCVlN4WFFVRlhMRVZCUVVVN1JVRkRNVU1zVDBGQlR5eERRVUZETEdkQ1FVRm5RaXhIUVVGSExHMUNRVUZ0UWl4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wTkJRemRFTEVOQlFVTWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXeUluZFhObElITjBjbWxqZENjN1hHNWNiblpoY2lCaGNHbFRkV0p6WTNKcGNIUnBiMjVUY25aaklEMGdjbVZ4ZFdseVpTZ25MaTloY0drdGMzVmljMk55YVhCMGFXOXVjeWNwTzF4dVhHNWxlSEJ2Y25SekxtbHVhWFJwWVd4cGVtVWdQU0JtZFc1amRHbHZiaUFvWVdOalpYTnpWRzlyWlc0cElIdGNiaUFnWlhod2IzSjBjeTVoY0dsVGRXSnpZM0pwY0hScGIyNXpJRDBnWVhCcFUzVmljMk55YVhCMGFXOXVVM0oyWXloaFkyTmxjM05VYjJ0bGJpazdYRzU5TzF4dUlsMTkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgSW1tdXRhYmxlID0gcmVxdWlyZSgnaW1tdXRhYmxlJyk7XG5cbmNvbnN0IENIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuXG5jbGFzcyBCYXNlU3RvcmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihkaXNwYXRjaGVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmRpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuaW5GbGlnaHQgPSBmYWxzZTtcbiAgICB0aGlzLmVycm9yID0gbnVsbDtcbiAgICB0aGlzLl9yZWdpc3RlcigpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHt9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLm9uKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKENIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmVtaXQoQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGdldFN0YXRlKCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBpc0luRmxpZ2h0KCkge1xuICAgIHJldHVybiB0aGlzLmluRmxpZ2h0O1xuICB9XG5cbiAgZ2V0QWN0aW9ucygpe1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIGdldFN0b3JlTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICB9XG5cbiAgLy8gZm9yIGNyZWF0aW5nIGEgc3RhbmRhcmQgc3RvcmUgZW50cnkgdGhhdCBjYXB0dXJlcyB0aGUgZW50aXRpZXMgc3RhdGVcbiAgbWFrZVN0YXRlZnVsRW50cnkoc3RhdGU9dW5kZWZpbmVkLCBkYXRhPXVuZGVmaW5lZCkge1xuICAgIHJldHVybiB7XG4gICAgICBtZXRhOiB7XG4gICAgICAgIHN0YXRlOiBzdGF0ZVxuICAgICAgfSxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9O1xuICB9XG5cbiAgdXBkYXRlU3RhdGVmdWxFbnRyeShlbnRyeSwgc3RhdGUsIGRhdGEpIHtcbiAgICBfLmV4dGVuZChlbnRyeS5kYXRhIHx8IChlbnRyeS5kYXRhID0ge30pLCBkYXRhKTtcbiAgICBlbnRyeS5tZXRhLnN0YXRlID0gc3RhdGU7XG4gICAgcmV0dXJuIGVudHJ5O1xuICB9XG5cbiAgX3JlZ2lzdGVyKCkge1xuICAgIHRoaXMuZGlzcGF0Y2hUb2tlbiA9IHRoaXMuZGlzcGF0Y2hlci5yZWdpc3RlcihfLmJpbmQoZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgIHRoaXMuX2hhbmRsZUFjdGlvbihwYXlsb2FkLmFjdGlvbi5hY3Rpb25UeXBlLCBwYXlsb2FkLmFjdGlvbik7XG4gICAgfSwgdGhpcykpO1xuICB9XG5cbiAgX2hhbmRsZUFjdGlvbihhY3Rpb25UeXBlLCBhY3Rpb24pe1xuICAgIC8vIFByb3h5IGFjdGlvblR5cGUgdG8gdGhlIGluc3RhbmNlIG1ldGhvZCBkZWZpbmVkIGluIGFjdGlvbnNbYWN0aW9uVHlwZV0sXG4gICAgLy8gb3Igb3B0aW9uYWxseSBpZiB0aGUgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaW52b2tlIGl0IGluc3RlYWQuXG4gICAgdmFyIGFjdGlvbnMgPSB0aGlzLmdldEFjdGlvbnMoKTtcbiAgICBpZiAoYWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShhY3Rpb25UeXBlKSkge1xuICAgICAgdmFyIGFjdGlvblZhbHVlID0gYWN0aW9uc1thY3Rpb25UeXBlXTtcbiAgICAgIGlmIChfLmlzU3RyaW5nKGFjdGlvblZhbHVlKSkge1xuICAgICAgICBpZiAoXy5pc0Z1bmN0aW9uKHRoaXNbYWN0aW9uVmFsdWVdKSkge1xuICAgICAgICAgIHRoaXNbYWN0aW9uVmFsdWVdKGFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY3Rpb24gaGFuZGxlciBkZWZpbmVkIGluIFN0b3JlIG1hcCBpcyB1bmRlZmluZWQgb3Igbm90IGEgRnVuY3Rpb24uIFN0b3JlOiAke3RoaXMuY29uc3RydWN0b3IubmFtZX0sIEFjdGlvbjogJHthY3Rpb25UeXBlfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChfLmlzRnVuY3Rpb24oYWN0aW9uVmFsdWUpKSB7XG4gICAgICAgIGFjdGlvblZhbHVlLmNhbGwodGhpcywgYWN0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfbWFrZVN0b3JlRW50cnkoKSB7XG4gICAgcmV0dXJuIEltbXV0YWJsZS5mcm9tSlMoe1xuICAgICAgX21ldGE6IHtcbiAgICAgICAgc3RhdGU6IHVuZGVmaW5lZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlU3RvcmU7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZjM1J2Y21WekwySmhjMlV1YW5NaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNXVUZCV1N4RFFVRkRPenRCUVVWaUxFbEJRVWtzV1VGQldTeEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhaUVVGWkxFTkJRVU03TzBGQlJXeEVMRWxCUVVrc1EwRkJReXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXp0QlFVTXhRaXhKUVVGSkxGTkJRVk1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNWMEZCVnl4RFFVRkRMRU5CUVVNN08wRkJSWEpETEUxQlFVMHNXVUZCV1N4SFFVRkhMRkZCUVZFc1EwRkJRenM3UVVGRk9VSXNUVUZCVFN4VFFVRlRMRk5CUVZNc1dVRkJXU3hEUVVGRE8wVkJRMjVETEZkQlFWY3NZVUZCWVR0SlFVTjBRaXhMUVVGTExFVkJRVVVzUTBGQlF6dEpRVU5TTEVsQlFVa3NRMEZCUXl4VlFVRlZMRWRCUVVjc1ZVRkJWU3hEUVVGRE8wbEJRemRDTEVsQlFVa3NRMEZCUXl4UlFVRlJMRWRCUVVjc1MwRkJTeXhEUVVGRE8wbEJRM1JDTEVsQlFVa3NRMEZCUXl4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRE8wbEJRMnhDTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1EwRkJRenRKUVVOcVFpeEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1FVRkRkRUlzUjBGQlJ6czdRVUZGU0N4RlFVRkZMRlZCUVZVc1IwRkJSeXhGUVVGRk96dEZRVVZtTEdsQ1FVRnBRaXhYUVVGWE8wbEJRekZDTEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1dVRkJXU3hGUVVGRkxGRkJRVkVzUTBGQlF5eERRVUZETzBGQlEzQkRMRWRCUVVjN08wVkJSVVFzYjBKQlFXOUNMRmRCUVZjN1NVRkROMElzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4WlFVRlpMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRGFFUXNSMEZCUnpzN1JVRkZSQ3hWUVVGVkxFZEJRVWM3U1VGRFdDeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhEUVVGRE8wRkJRelZDTEVkQlFVYzdPMFZCUlVRc1VVRkJVU3hIUVVGSE8wbEJRMVFzVDBGQlR5eFRRVUZUTEVOQlFVTTdRVUZEY2tJc1IwRkJSenM3UlVGRlJDeFZRVUZWTEVkQlFVYzdTVUZEV0N4UFFVRlBMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRGVrSXNSMEZCUnpzN1JVRkZSQ3hWUVVGVkxFVkJRVVU3U1VGRFZpeFBRVUZQTEVWQlFVVXNRMEZCUXp0QlFVTmtMRWRCUVVjN08wVkJSVVFzV1VGQldTeEhRVUZITzBsQlEySXNUMEZCVHl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU5xUXl4SFFVRkhPMEZCUTBnN08wVkJSVVVzYVVKQlFXbENMR3REUVVGclF6dEpRVU5xUkN4UFFVRlBPMDFCUTB3c1NVRkJTU3hGUVVGRk8xRkJRMG9zUzBGQlN5eEZRVUZGTEV0QlFVczdUMEZEWWp0TlFVTkVMRWxCUVVrc1JVRkJSU3hKUVVGSk8wdEJRMWdzUTBGQlF6dEJRVU5PTEVkQlFVYzdPMFZCUlVRc2JVSkJRVzFDTEhGQ1FVRnhRanRKUVVOMFF5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFdEJRVXNzUzBGQlN5eERRVUZETEVsQlFVa3NSMEZCUnl4RlFVRkZMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU5vUkN4TFFVRkxMRU5CUVVNc1NVRkJTU3hEUVVGRExFdEJRVXNzUjBGQlJ5eExRVUZMTEVOQlFVTTdTVUZEZWtJc1QwRkJUeXhMUVVGTExFTkJRVU03UVVGRGFrSXNSMEZCUnpzN1JVRkZSQ3hUUVVGVExFZEJRVWM3U1VGRFZpeEpRVUZKTEVOQlFVTXNZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hQUVVGUExFVkJRVVU3VFVGRGRFVXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEZWQlFWVXNSVUZCUlN4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UzBGREwwUXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMlFzUjBGQlJ6czdRVUZGU0N4RlFVRkZMR0ZCUVdFc2IwSkJRVzlDTzBGQlEyNURPenRKUVVWSkxFbEJRVWtzVDBGQlR5eEhRVUZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRKUVVOb1F5eEpRVUZKTEU5QlFVOHNRMEZCUXl4alFVRmpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFVkJRVVU3VFVGRGRFTXNTVUZCU1N4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzAxQlEzUkRMRWxCUVVrc1EwRkJReXhEUVVGRExGRkJRVkVzUTBGQlF5eFhRVUZYTEVOQlFVTXNSVUZCUlR0UlFVTXpRaXhKUVVGSkxFTkJRVU1zUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFVkJRVVU3VlVGRGJrTXNTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzFOQlF6TkNPMkZCUTBrN1ZVRkRTQ3hOUVVGTkxFbEJRVWtzUzBGQlN5eERRVUZETERoRlFVRTRSU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETEVsQlFVa3NZVUZCWVN4VlFVRlZMRVZCUVVVc1EwRkJReXhEUVVGRE8xTkJReTlKTzA5QlEwWTdWMEZEU1N4SlFVRkpMRU5CUVVNc1EwRkJReXhWUVVGVkxFTkJRVU1zVjBGQlZ5eERRVUZETEVWQlFVVTdVVUZEYkVNc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNUVUZCVFN4RFFVRkRMRU5CUVVNN1QwRkRhRU03UzBGRFJqdEJRVU5NTEVkQlFVYzdPMFZCUlVRc1pVRkJaU3hIUVVGSE8wbEJRMmhDTEU5QlFVOHNVMEZCVXl4RFFVRkRMRTFCUVUwc1EwRkJRenROUVVOMFFpeExRVUZMTEVWQlFVVTdVVUZEVEN4TFFVRkxMRVZCUVVVc1UwRkJVenRQUVVOcVFqdExRVU5HTEVOQlFVTXNRMEZCUXp0QlFVTlFMRWRCUVVjN08wRkJSVWdzUTBGQlF6czdRVUZGUkN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUVWMlpXNTBSVzFwZEhSbGNpQTlJSEpsY1hWcGNtVW9KMlYyWlc1MGN5Y3BMa1YyWlc1MFJXMXBkSFJsY2p0Y2JseHVkbUZ5SUY4Z1BTQnlaWEYxYVhKbEtDZHNiMlJoYzJnbktUdGNiblpoY2lCSmJXMTFkR0ZpYkdVZ1BTQnlaWEYxYVhKbEtDZHBiVzExZEdGaWJHVW5LVHRjYmx4dVkyOXVjM1FnUTBoQlRrZEZYMFZXUlU1VUlEMGdKMk5vWVc1blpTYzdYRzVjYm1Oc1lYTnpJRUpoYzJWVGRHOXlaU0JsZUhSbGJtUnpJRVYyWlc1MFJXMXBkSFJsY2lCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0dScGMzQmhkR05vWlhJcElIdGNiaUFnSUNCemRYQmxjaWdwTzF4dUlDQWdJSFJvYVhNdVpHbHpjR0YwWTJobGNpQTlJR1JwYzNCaGRHTm9aWEk3WEc0Z0lDQWdkR2hwY3k1cGJrWnNhV2RvZENBOUlHWmhiSE5sTzF4dUlDQWdJSFJvYVhNdVpYSnliM0lnUFNCdWRXeHNPMXh1SUNBZ0lIUm9hWE11WDNKbFoybHpkR1Z5S0NrN1hHNGdJQ0FnZEdocGN5NXBibWwwYVdGc2FYcGxLQ2s3WEc0Z0lIMWNibHh1SUNCcGJtbDBhV0ZzYVhwbEtDa2dlMzFjYmx4dUlDQmhaR1JEYUdGdVoyVk1hWE4wWlc1bGNpaGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lIUm9hWE11YjI0b1EwaEJUa2RGWDBWV1JVNVVMQ0JqWVd4c1ltRmpheWs3WEc0Z0lIMWNibHh1SUNCeVpXMXZkbVZEYUdGdVoyVk1hWE4wWlc1bGNpaGpZV3hzWW1GamF5a2dlMXh1SUNBZ0lIUm9hWE11Y21WdGIzWmxUR2x6ZEdWdVpYSW9RMGhCVGtkRlgwVldSVTVVTENCallXeHNZbUZqYXlrN1hHNGdJSDFjYmx4dUlDQmxiV2wwUTJoaGJtZGxLQ2tnZTF4dUlDQWdJSFJvYVhNdVpXMXBkQ2hEU0VGT1IwVmZSVlpGVGxRcE8xeHVJQ0I5WEc1Y2JpQWdaMlYwVTNSaGRHVW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlIVnVaR1ZtYVc1bFpEdGNiaUFnZlZ4dVhHNGdJR2x6U1c1R2JHbG5hSFFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWFXNUdiR2xuYUhRN1hHNGdJSDFjYmx4dUlDQm5aWFJCWTNScGIyNXpLQ2w3WEc0Z0lDQWdjbVYwZFhKdUlIdDlPMXh1SUNCOVhHNWNiaUFnWjJWMFUzUnZjbVZPWVcxbEtDa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbU52Ym5OMGNuVmpkRzl5TG01aGJXVTdYRzRnSUgxY2JseHVJQ0F2THlCbWIzSWdZM0psWVhScGJtY2dZU0J6ZEdGdVpHRnlaQ0J6ZEc5eVpTQmxiblJ5ZVNCMGFHRjBJR05oY0hSMWNtVnpJSFJvWlNCbGJuUnBkR2xsY3lCemRHRjBaVnh1SUNCdFlXdGxVM1JoZEdWbWRXeEZiblJ5ZVNoemRHRjBaVDExYm1SbFptbHVaV1FzSUdSaGRHRTlkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIdGNiaUFnSUNBZ0lHMWxkR0U2SUh0Y2JpQWdJQ0FnSUNBZ2MzUmhkR1U2SUhOMFlYUmxYRzRnSUNBZ0lDQjlMRnh1SUNBZ0lDQWdaR0YwWVRvZ1pHRjBZVnh1SUNBZ0lIMDdYRzRnSUgxY2JseHVJQ0IxY0dSaGRHVlRkR0YwWldaMWJFVnVkSEo1S0dWdWRISjVMQ0J6ZEdGMFpTd2daR0YwWVNrZ2UxeHVJQ0FnSUY4dVpYaDBaVzVrS0dWdWRISjVMbVJoZEdFZ2ZId2dLR1Z1ZEhKNUxtUmhkR0VnUFNCN2ZTa3NJR1JoZEdFcE8xeHVJQ0FnSUdWdWRISjVMbTFsZEdFdWMzUmhkR1VnUFNCemRHRjBaVHRjYmlBZ0lDQnlaWFIxY200Z1pXNTBjbms3WEc0Z0lIMWNibHh1SUNCZmNtVm5hWE4wWlhJb0tTQjdYRzRnSUNBZ2RHaHBjeTVrYVhOd1lYUmphRlJ2YTJWdUlEMGdkR2hwY3k1a2FYTndZWFJqYUdWeUxuSmxaMmx6ZEdWeUtGOHVZbWx1WkNobWRXNWpkR2x2YmlBb2NHRjViRzloWkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVmYUdGdVpHeGxRV04wYVc5dUtIQmhlV3h2WVdRdVlXTjBhVzl1TG1GamRHbHZibFI1Y0dVc0lIQmhlV3h2WVdRdVlXTjBhVzl1S1R0Y2JpQWdJQ0I5TENCMGFHbHpLU2s3WEc0Z0lIMWNibHh1SUNCZmFHRnVaR3hsUVdOMGFXOXVLR0ZqZEdsdmJsUjVjR1VzSUdGamRHbHZiaWw3WEc0Z0lDQWdMeThnVUhKdmVIa2dZV04wYVc5dVZIbHdaU0IwYnlCMGFHVWdhVzV6ZEdGdVkyVWdiV1YwYUc5a0lHUmxabWx1WldRZ2FXNGdZV04wYVc5dWMxdGhZM1JwYjI1VWVYQmxYU3hjYmlBZ0lDQXZMeUJ2Y2lCdmNIUnBiMjVoYkd4NUlHbG1JSFJvWlNCMllXeDFaU0JwY3lCaElHWjFibU4wYVc5dUxDQnBiblp2YTJVZ2FYUWdhVzV6ZEdWaFpDNWNiaUFnSUNCMllYSWdZV04wYVc5dWN5QTlJSFJvYVhNdVoyVjBRV04wYVc5dWN5Z3BPMXh1SUNBZ0lHbG1JQ2hoWTNScGIyNXpMbWhoYzA5M2JsQnliM0JsY25SNUtHRmpkR2x2YmxSNWNHVXBLU0I3WEc0Z0lDQWdJQ0IyWVhJZ1lXTjBhVzl1Vm1Gc2RXVWdQU0JoWTNScGIyNXpXMkZqZEdsdmJsUjVjR1ZkTzF4dUlDQWdJQ0FnYVdZZ0tGOHVhWE5UZEhKcGJtY29ZV04wYVc5dVZtRnNkV1VwS1NCN1hHNGdJQ0FnSUNBZ0lHbG1JQ2hmTG1selJuVnVZM1JwYjI0b2RHaHBjMXRoWTNScGIyNVdZV3gxWlYwcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdocGMxdGhZM1JwYjI1V1lXeDFaVjBvWVdOMGFXOXVLVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWUVGamRHbHZiaUJvWVc1a2JHVnlJR1JsWm1sdVpXUWdhVzRnVTNSdmNtVWdiV0Z3SUdseklIVnVaR1ZtYVc1bFpDQnZjaUJ1YjNRZ1lTQkdkVzVqZEdsdmJpNGdVM1J2Y21VNklDUjdkR2hwY3k1amIyNXpkSEoxWTNSdmNpNXVZVzFsZlN3Z1FXTjBhVzl1T2lBa2UyRmpkR2x2YmxSNWNHVjlZQ2s3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgxY2JpQWdJQ0FnSUdWc2MyVWdhV1lnS0Y4dWFYTkdkVzVqZEdsdmJpaGhZM1JwYjI1V1lXeDFaU2twSUh0Y2JpQWdJQ0FnSUNBZ1lXTjBhVzl1Vm1Gc2RXVXVZMkZzYkNoMGFHbHpMQ0JoWTNScGIyNHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJRjl0WVd0bFUzUnZjbVZGYm5SeWVTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z1NXMXRkWFJoWW14bExtWnliMjFLVXloN1hHNGdJQ0FnSUNCZmJXVjBZVG9nZTF4dUlDQWdJQ0FnSUNCemRHRjBaVG9nZFc1a1pXWnBibVZrWEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2s3WEc0Z0lIMWNibHh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFSmhjMlZUZEc5eVpUdGNiaUpkZlE9PSIsIid1c2Ugc3RyaWN0JztcblxudmFyIERpc3BhdGNoZXIgPSByZXF1aXJlKCcuLi9kaXNwYXRjaGVyJyk7XG5cbnZhciBJdGVtc1N0b3JlID0gcmVxdWlyZSgnLi9pdGVtcycpLFxuICAgIFNlcnZlclRpbWVTdG9yZSA9IHJlcXVpcmUoJy4vc2VydmVyLXRpbWUnKTtcblxuXG5leHBvcnRzLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gIGV4cG9ydHMuSXRlbXNTdG9yZSA9IG5ldyBJdGVtc1N0b3JlKERpc3BhdGNoZXIpO1xuICBleHBvcnRzLlNlcnZlclRpbWVTdG9yZSA9IG5ldyBTZXJ2ZXJUaW1lU3RvcmUoRGlzcGF0Y2hlcik7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12YzNSdmNtVnpMMmx1WkdWNExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSkJRVUZCTEZsQlFWa3NRMEZCUXpzN1FVRkZZaXhKUVVGSkxGVkJRVlVzUjBGQlJ5eFBRVUZQTEVOQlFVTXNaVUZCWlN4RFFVRkRMRU5CUVVNN08wRkJSVEZETEVsQlFVa3NWVUZCVlN4SFFVRkhMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGJrTXNTVUZCU1N4bFFVRmxMRWRCUVVjc1QwRkJUeXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzBGQlF5OURPenRCUVVWQkxFOUJRVThzUTBGQlF5eFZRVUZWTEVkQlFVY3NXVUZCV1R0RlFVTXZRaXhQUVVGUExFTkJRVU1zVlVGQlZTeEhRVUZITEVsQlFVa3NWVUZCVlN4RFFVRkRMRlZCUVZVc1EwRkJReXhEUVVGRE8wRkJRMnhFTEVWQlFVVXNUMEZCVHl4RFFVRkRMR1ZCUVdVc1IwRkJSeXhKUVVGSkxHVkJRV1VzUTBGQlF5eFZRVUZWTEVOQlFVTXNRMEZCUXpzN1JVRkZNVVFzVDBGQlR5eEpRVUZKTEVOQlFVTTdRMEZEWWl4RFFVRkRJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ1JHbHpjR0YwWTJobGNpQTlJSEpsY1hWcGNtVW9KeTR1TDJScGMzQmhkR05vWlhJbktUdGNibHh1ZG1GeUlFbDBaVzF6VTNSdmNtVWdQU0J5WlhGMWFYSmxLQ2N1TDJsMFpXMXpKeWtzWEc0Z0lDQWdVMlZ5ZG1WeVZHbHRaVk4wYjNKbElEMGdjbVZ4ZFdseVpTZ25MaTl6WlhKMlpYSXRkR2x0WlNjcE8xeHVYRzVjYm1WNGNHOXlkSE11YVc1cGRHbGhiR2w2WlNBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ1pYaHdiM0owY3k1SmRHVnRjMU4wYjNKbElEMGdibVYzSUVsMFpXMXpVM1J2Y21Vb1JHbHpjR0YwWTJobGNpazdYRzRnSUdWNGNHOXlkSE11VTJWeWRtVnlWR2x0WlZOMGIzSmxJRDBnYm1WM0lGTmxjblpsY2xScGJXVlRkRzl5WlNoRWFYTndZWFJqYUdWeUtUdGNibHh1SUNCeVpYUjFjbTRnZEdocGN6dGNibjA3WEc0aVhYMD0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbnZhciBCYXNlU3RvcmUgPSByZXF1aXJlKCcuL2Jhc2UnKTtcblxudmFyIGtBY3Rpb25zID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL2FjdGlvbnMnKSxcbiAgICBrU3RhdGVzID0gcmVxdWlyZSgnLi4vY29uc3RhbnRzL3N0YXRlcycpLFxuICAgIEl0ZW1BY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9pdGVtcycpO1xuXG52YXIgX2FjdGlvbnMgPSBfLnppcE9iamVjdChbXG4gIFtrQWN0aW9ucy5JVEVNX0dFVEFMTCwgJ2hhbmRsZVNldEFsbCddLFxuICBba0FjdGlvbnMuSVRFTV9QT1NULCAnaGFuZGxlRW50cnlDcmVhdGUnXSxcbiAgW2tBY3Rpb25zLklURU1fUFVULCAnaGFuZGxlRW50cnlVcGRhdGUnXSxcbiAgW2tBY3Rpb25zLklURU1fREVMRVRFLCAnaGFuZGxlRW50cnlEZWxldGUnXVxuXSk7XG5cbmNsYXNzIEVudHJ5U3RvcmUgZXh0ZW5kcyBCYXNlU3RvcmUge1xuXG4gIGNvbnN0cnVjdG9yKGRpc3BhdGNoZXIpIHtcbiAgICBzdXBlcihkaXNwYXRjaGVyKTtcbiAgICB0aGlzLl9pdGVtcyA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGdldEFjdGlvbnMoKSB7XG4gICAgcmV0dXJuIF9hY3Rpb25zO1xuICB9XG5cbiAgX2xvYWQoKSB7XG4gICAgSXRlbUFjdGlvbnMuZ2V0QWxsKCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIF9nZXRJdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlbXMgIT09IHVuZGVmaW5lZCA/IHRoaXMuX2l0ZW1zIDogdGhpcy5fbG9hZCgpO1xuICB9XG5cbiAgZ2V0QWxsKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRJdGVtcygpO1xuICB9XG5cbiAgZ2V0KGlkKSB7XG4gICAgaWQgPSBwYXJzZUludChpZCwgMTApO1xuICAgIHJldHVybiB0aGlzLl9pdGVtcyAhPT0gdW5kZWZpbmVkID8gKGlkIGluIHRoaXMuX2l0ZW1zID8gdGhpcy5faXRlbXNbaWRdIDogbnVsbCkgOiB0aGlzLl9sb2FkKCk7XG4gIH1cblxuICAvKlxuICAqXG4gICogQWN0aW9uIEhhbmRsZXJzXG4gICpcbiAgKi9cblxuICBoYW5kbGVTZXRBbGwocGF5bG9hZCkge1xuICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06aGFuZGxlU2V0QWxsOyBzdGF0ZT0ke3BheWxvYWQuc3RhdGV9YCk7XG5cbiAgICBzd2l0Y2gocGF5bG9hZC5zdGF0ZSkge1xuICAgICAgY2FzZSBrU3RhdGVzLkxPQURJTkc6XG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Uga1N0YXRlcy5TWU5DRUQ6XG4gICAgICAgIHRoaXMuX2l0ZW1zID0ge307XG4gICAgICAgIF8uZWFjaChwYXlsb2FkLmRhdGEsIGl0ZW0gPT4gdGhpcy5pdGVtc1tpdGVtLmlkXSA9IHRoaXMubWFrZVN0YXRlZnVsRW50cnkocGF5bG9hZC5zdGF0ZSwgaXRlbSkpO1xuICAgICAgICB0aGlzLmluZmxpZ2h0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgaGFuZGxlRW50cnlDcmVhdGUocGF5bG9hZCkge1xuICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06aGFuZGxlRW50cnlDcmVhdGU7IHN0YXRlPSR7cGF5bG9hZC5zdGF0ZX1gKTtcblxuICAgIHZhciBzdGF0ZSA9IHRoaXMuX2l0ZW1zIHx8IHt9LFxuICAgICAgICBuZXdFbnRyeSwgZXhpc3RpbmdFbnRyeTtcblxuICAgIHN3aXRjaChwYXlsb2FkLnN0YXRlKSB7XG4gICAgICBjYXNlIGtTdGF0ZXMuTkVXOlxuICAgICAgICBzdGF0ZVtwYXlsb2FkLmRhdGEuY2lkXSA9IHRoaXMubWFrZVN0YXRlZnVsRW50cnkocGF5bG9hZC5zdGF0ZSwgcGF5bG9hZC5kYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIGtTdGF0ZXMuU1lOQ0VEOlxuICAgICAgICBuZXdFbnRyeSA9IHBheWxvYWQuZGF0YTtcbiAgICAgICAgLy8gY2hlY2sgZm9yIGEgbG9jYWwgY2xpZW50IGlkIGFuZCBzd2l0Y2ggdG8gc2VydmVyIGlkXG4gICAgICAgIC8vID8/PyBpcyB0aGlzIGJlc3QgZG9uZSBoZXJlIG9yIGVuY2Fwc3VsYXRlZCBpbiBFbnRyeSBNb2RlbCA/Pz9cbiAgICAgICAgaWYgKG5ld0VudHJ5LmNpZCAmJiAoZXhpc3RpbmdFbnRyeSA9IHN0YXRlW25ld0VudHJ5LmNpZF0pICYmICFzdGF0ZVtuZXdFbnRyeS5pZF0pIHtcblxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06aGFuZGxlRW50cnlDcmVhdGU7IGNvbnZlcnRpbmcgY2xpZW50LWlkIHRvIHNlcnZlci1pZGApO1xuXG4gICAgICAgICAgZXhpc3RpbmdFbnRyeSA9IHRoaXMudXBkYXRlU3RhdGVmdWxFbnRyeShleGlzdGluZ0VudHJ5LCBwYXlsb2FkLnN0YXRlLCBuZXdFbnRyeSk7XG5cbiAgICAgICAgICAvLyByZW1vdmUgdGhlIFwibmV3XCIgZW50cnkgd2hpY2ggaXMgYmVpbmcgcmVwbGFjZWQgYnkgaXRzIHBlcm1hbmVudCBvbmVcbiAgICAgICAgICBkZWxldGUgc3RhdGVbZXhpc3RpbmdFbnRyeS5kYXRhLmNpZF07XG4gICAgICAgICAgc3RhdGVbZXhpc3RpbmdFbnRyeS5kYXRhLmlkXSA9IGV4aXN0aW5nRW50cnk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3RhdGVbbmV3RW50cnkuaWRdID0gdGhpcy5tYWtlU3RhdGVmdWxFbnRyeShwYXlsb2FkLnN0YXRlLCBuZXdFbnRyeSk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBoYW5kbGVFbnRyeVVwZGF0ZShwYXlsb2FkKSB7XG4gICAgY29uc29sZS5kZWJ1ZyhgJHt0aGlzLmdldFN0b3JlTmFtZSgpfTpoYW5kbGVFbnRyeVVwZGF0ZTsgc3RhdGU9JHtwYXlsb2FkLnN0YXRlfWApO1xuXG4gICAgdmFyIG5ld0VudHJ5ID0gcGF5bG9hZC5kYXRhLFxuICAgICAgICBleGlzdGluZ0VudHJ5O1xuXG4gICAgc3dpdGNoKHBheWxvYWQuc3RhdGUpIHtcbiAgICAgIGNhc2Uga1N0YXRlcy5TQVZJTkc6XG4gICAgICAgIGV4aXN0aW5nRW50cnkgPSB0aGlzLl9pdGVtc1tuZXdFbnRyeS5pZF07XG4gICAgICAgIGlmIChleGlzdGluZ0VudHJ5KSB7XG4gICAgICAgICAgZXhpc3RpbmdFbnRyeSA9IHRoaXMudXBkYXRlU3RhdGVmdWxFbnRyeShleGlzdGluZ0VudHJ5LCBwYXlsb2FkLmRhdGEsIG5ld0VudHJ5KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Uga1N0YXRlcy5TWU5DRUQ6XG4gICAgICAgIGV4aXN0aW5nRW50cnkgPSB0aGlzLl9pdGVtc1tuZXdFbnRyeS5pZF07XG4gICAgICAgIGlmIChleGlzdGluZ0VudHJ5KSB7XG4gICAgICAgICAgZXhpc3RpbmdFbnRyeSA9IHRoaXMudXBkYXRlU3RhdGVmdWxFbnRyeShleGlzdGluZ0VudHJ5LCBwYXlsb2FkLmRhdGEsIG5ld0VudHJ5KTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGhhbmRsZUVudHJ5RGVsZXRlKHBheWxvYWQpIHtcbiAgICBjb25zb2xlLmRlYnVnKGAke3RoaXMuZ2V0U3RvcmVOYW1lKCl9OmhhbmRsZUVudHJ5RGVsZXRlOyBzdGF0ZT0ke3BheWxvYWQuc3RhdGV9YCk7XG5cbiAgICB2YXIgZXhpc3RpbmdFbnRyeSA9IHRoaXMuX2l0ZW1zW3BheWxvYWQuZGF0YS5pZF07XG5cbiAgICBpZiAoZXhpc3RpbmdFbnRyeSkge1xuICAgICAgc3dpdGNoKHBheWxvYWQuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBrU3RhdGVzLkRFTEVUSU5HOlxuICAgICAgICAgIGV4aXN0aW5nRW50cnkgPSB0aGlzLnVwZGF0ZVN0YXRlZnVsRW50cnkoZXhpc3RpbmdFbnRyeSwgcGF5bG9hZC5zdGF0ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2Uga1N0YXRlcy5TWU5DRUQ6XG4gICAgICAgICAgZGVsZXRlIHRoaXMuX2l0ZW1zW3BheWxvYWQuZGF0YS5pZF07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gRW50cnlTdG9yZTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pZEhKaGJuTm1iM0p0WldRdWFuTWlMQ0p6YjNWeVkyVnpJanBiSWk5VmMyVnljeTlvWW5WeWNtOTNjeTlrWlhZdmFHVnliMnQxTDNKbFlXTjBMV1pzZFhndGMzUmhjblJsY2k5d2RXSnNhV012YW1GMllYTmpjbWx3ZEhNdmMzUnZjbVZ6TDJsMFpXMXpMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxGbEJRVmtzUTBGQlF6czdRVUZGWWl4SlFVRkpMRU5CUVVNc1IwRkJSeXhQUVVGUExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdPMEZCUlRGQ0xFbEJRVWtzVTBGQlV5eEhRVUZITEU5QlFVOHNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenM3UVVGRmJFTXNTVUZCU1N4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExITkNRVUZ6UWl4RFFVRkRPMGxCUXpGRExFOUJRVThzUjBGQlJ5eFBRVUZQTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU03UVVGRE5VTXNTVUZCU1N4WFFVRlhMRWRCUVVjc1QwRkJUeXhEUVVGRExHdENRVUZyUWl4RFFVRkRMRU5CUVVNN08wRkJSVGxETEVsQlFVa3NVVUZCVVN4SFFVRkhMRU5CUVVNc1EwRkJReXhUUVVGVExFTkJRVU03UlVGRGVrSXNRMEZCUXl4UlFVRlJMRU5CUVVNc1YwRkJWeXhGUVVGRkxHTkJRV01zUTBGQlF6dEZRVU4wUXl4RFFVRkRMRkZCUVZFc1EwRkJReXhUUVVGVExFVkJRVVVzYlVKQlFXMUNMRU5CUVVNN1JVRkRla01zUTBGQlF5eFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRzFDUVVGdFFpeERRVUZETzBWQlEzaERMRU5CUVVNc1VVRkJVU3hEUVVGRExGZEJRVmNzUlVGQlJTeHRRa0ZCYlVJc1EwRkJRenRCUVVNM1F5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxGVkJRVlVzVTBGQlV5eFRRVUZUTEVOQlFVTTdPMFZCUldwRExGZEJRVmNzWVVGQllUdEpRVU4wUWl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03U1VGRGJFSXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRE5VSXNSMEZCUnpzN1JVRkZSQ3hWUVVGVkxFZEJRVWM3U1VGRFdDeFBRVUZQTEZGQlFWRXNRMEZCUXp0QlFVTndRaXhIUVVGSE96dEZRVVZFTEV0QlFVc3NSMEZCUnp0SlFVTk9MRmRCUVZjc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dEpRVU55UWl4UFFVRlBMRk5CUVZNc1EwRkJRenRCUVVOeVFpeEhRVUZIT3p0RlFVVkVMRk5CUVZNc1IwRkJSenRKUVVOV0xFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNTMEZCU3l4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1FVRkRiRVVzUjBGQlJ6czdSVUZGUkN4TlFVRk5MRWRCUVVjN1NVRkRVQ3hQUVVGUExFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVXNRMEZCUXp0QlFVTTFRaXhIUVVGSE96dEZRVVZFTEVkQlFVY3NTMEZCU3p0SlFVTk9MRVZCUVVVc1IwRkJSeXhSUVVGUkxFTkJRVU1zUlVGQlJTeEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGxCUTNSQ0xFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNTMEZCU3l4VFFVRlRMRWxCUVVrc1JVRkJSU3hKUVVGSkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVkQlFVY3NTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eEpRVUZKTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wRkJRMjVITEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3TzBWQlJVVXNXVUZCV1N4VlFVRlZPMEZCUTNoQ0xFbEJRVWtzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhaUVVGWkxFVkJRVVVzZDBKQlFYZENMRTlCUVU4c1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZET3p0SlFVVTNSU3hQUVVGUExFOUJRVThzUTBGQlF5eExRVUZMTzAxQlEyeENMRXRCUVVzc1QwRkJUeXhEUVVGRExFOUJRVTg3VVVGRGJFSXNTVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU03VVVGRGNrSXNUVUZCVFR0TlFVTlNMRXRCUVVzc1QwRkJUeXhEUVVGRExFMUJRVTA3VVVGRGFrSXNTVUZCU1N4RFFVRkRMRTFCUVUwc1IwRkJSeXhGUVVGRkxFTkJRVU03VVVGRGFrSXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc2FVSkJRV2xDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRXRCUVVzc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEyaEhMRWxCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzUzBGQlN5eERRVUZETzFGQlEzUkNMRTFCUVUwN1FVRkRaQ3hMUVVGTE96dEpRVVZFTEVsQlFVa3NRMEZCUXl4VlFVRlZMRVZCUVVVc1EwRkJRenRCUVVOMFFpeEhRVUZIT3p0RlFVVkVMR2xDUVVGcFFpeFZRVUZWTzBGQlF6ZENMRWxCUVVrc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRVZCUVVVc05rSkJRVFpDTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRE96dEpRVVZzUml4SlFVRkpMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeEpRVUZKTEVWQlFVVTdRVUZEYWtNc1VVRkJVU3hSUVVGUkxFVkJRVVVzWVVGQllTeERRVUZET3p0SlFVVTFRaXhQUVVGUExFOUJRVThzUTBGQlF5eExRVUZMTzAxQlEyeENMRXRCUVVzc1QwRkJUeXhEUVVGRExFZEJRVWM3VVVGRFpDeExRVUZMTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU1zVDBGQlR5eERRVUZETEV0QlFVc3NSVUZCUlN4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRE9VVXNUVUZCVFR0TlFVTlNMRXRCUVVzc1QwRkJUeXhEUVVGRExFMUJRVTA3UVVGRGVrSXNVVUZCVVN4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU5vUXpzN1FVRkZRU3hSUVVGUkxFbEJRVWtzVVVGQlVTeERRVUZETEVkQlFVY3NTMEZCU3l4aFFVRmhMRWRCUVVjc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlRzN1FVRkZNVVlzVlVGQlZTeFBRVUZQTEVOQlFVTXNTMEZCU3l4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGbEJRVmtzUlVGQlJTeDFSRUZCZFVRc1EwRkJReXhEUVVGRE96dEJRVVYyUnl4VlFVRlZMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1lVRkJZU3hGUVVGRkxFOUJRVThzUTBGQlF5eExRVUZMTEVWQlFVVXNVVUZCVVN4RFFVRkRMRU5CUVVNN1FVRkRNMFk3TzFWQlJWVXNUMEZCVHl4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNRMEZCUXp0VlFVTnlReXhMUVVGTExFTkJRVU1zWVVGQllTeERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1IwRkJSeXhoUVVGaExFTkJRVU03VTBGRE9VTTdZVUZEU1R0VlFVTklMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMR2xDUVVGcFFpeERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1VVRkJVU3hEUVVGRExFTkJRVU03VTBGRGRFVTdVVUZEUkN4TlFVRk5PMEZCUTJRc1MwRkJTenM3U1VGRlJDeEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZMRU5CUVVNN1FVRkRkRUlzUjBGQlJ6czdSVUZGUkN4cFFrRkJhVUlzVlVGQlZUdEJRVU0zUWl4SlFVRkpMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUjBGQlJ5eEpRVUZKTEVOQlFVTXNXVUZCV1N4RlFVRkZMRFpDUVVFMlFpeFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1EwRkJRenM3U1VGRmJFWXNTVUZCU1N4UlFVRlJMRWRCUVVjc1QwRkJUeXhEUVVGRExFbEJRVWs3UVVGREwwSXNVVUZCVVN4aFFVRmhMRU5CUVVNN08wbEJSV3hDTEU5QlFVOHNUMEZCVHl4RFFVRkRMRXRCUVVzN1RVRkRiRUlzUzBGQlN5eFBRVUZQTEVOQlFVTXNUVUZCVFR0UlFVTnFRaXhoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UlFVRlJMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03VVVGRGVrTXNTVUZCU1N4aFFVRmhMRVZCUVVVN1ZVRkRha0lzWVVGQllTeEhRVUZITEVsQlFVa3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF5eGhRVUZoTEVWQlFVVXNUMEZCVHl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFTkJRVU1zUTBGQlF6dFRRVU5xUmp0UlFVTkVMRTFCUVUwN1RVRkRVaXhMUVVGTExFOUJRVThzUTBGQlF5eE5RVUZOTzFGQlEycENMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJRenRSUVVONlF5eEpRVUZKTEdGQlFXRXNSVUZCUlR0VlFVTnFRaXhoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExHRkJRV0VzUlVGQlJTeFBRVUZQTEVOQlFVTXNTVUZCU1N4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8xTkJRMnBHTzFGQlEwUXNUVUZCVFR0QlFVTmtMRXRCUVVzN08wbEJSVVFzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUlN4RFFVRkRPMEZCUTNSQ0xFZEJRVWM3TzBWQlJVUXNhVUpCUVdsQ0xGVkJRVlU3UVVGRE4wSXNTVUZCU1N4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEZsQlFWa3NSVUZCUlN3MlFrRkJOa0lzVDBGQlR5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRMRU5CUVVNN08wRkJSWFJHTEVsQlFVa3NTVUZCU1N4aFFVRmhMRWRCUVVjc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRE96dEpRVVZxUkN4SlFVRkpMR0ZCUVdFc1JVRkJSVHROUVVOcVFpeFBRVUZQTEU5QlFVOHNRMEZCUXl4TFFVRkxPMUZCUTJ4Q0xFdEJRVXNzVDBGQlR5eERRVUZETEZGQlFWRTdWVUZEYmtJc1lVRkJZU3hIUVVGSExFbEJRVWtzUTBGQlF5eHRRa0ZCYlVJc1EwRkJReXhoUVVGaExFVkJRVVVzVDBGQlR5eERRVUZETEV0QlFVc3NRMEZCUXl4RFFVRkRPMVZCUTNaRkxFMUJRVTA3VVVGRFVpeExRVUZMTEU5QlFVOHNRMEZCUXl4TlFVRk5PMVZCUTJwQ0xFOUJRVThzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzFWQlEzQkRMRTFCUVUwN1FVRkRhRUlzVDBGQlR6czdUVUZGUkN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hGUVVGRkxFTkJRVU03UzBGRGJrSTdRVUZEVEN4SFFVRkhPenRCUVVWSUxFTkJRVU03TzBGQlJVUXNUVUZCVFN4RFFVRkRMRTlCUVU4c1IwRkJSeXhWUVVGVkxFTkJRVU1pTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJbmRYTmxJSE4wY21samRDYzdYRzVjYm5aaGNpQmZJRDBnY21WeGRXbHlaU2duYkc5a1lYTm9KeWs3WEc1Y2JuWmhjaUJDWVhObFUzUnZjbVVnUFNCeVpYRjFhWEpsS0NjdUwySmhjMlVuS1R0Y2JseHVkbUZ5SUd0QlkzUnBiMjV6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZMjl1YzNSaGJuUnpMMkZqZEdsdmJuTW5LU3hjYmlBZ0lDQnJVM1JoZEdWeklEMGdjbVZ4ZFdseVpTZ25MaTR2WTI5dWMzUmhiblJ6TDNOMFlYUmxjeWNwTEZ4dUlDQWdJRWwwWlcxQlkzUnBiMjV6SUQwZ2NtVnhkV2x5WlNnbkxpNHZZV04wYVc5dWN5OXBkR1Z0Y3ljcE8xeHVYRzUyWVhJZ1gyRmpkR2x2Ym5NZ1BTQmZMbnBwY0U5aWFtVmpkQ2hiWEc0Z0lGdHJRV04wYVc5dWN5NUpWRVZOWDBkRlZFRk1UQ3dnSjJoaGJtUnNaVk5sZEVGc2JDZGRMRnh1SUNCYmEwRmpkR2x2Ym5NdVNWUkZUVjlRVDFOVUxDQW5hR0Z1Wkd4bFJXNTBjbmxEY21WaGRHVW5YU3hjYmlBZ1cydEJZM1JwYjI1ekxrbFVSVTFmVUZWVUxDQW5hR0Z1Wkd4bFJXNTBjbmxWY0dSaGRHVW5YU3hjYmlBZ1cydEJZM1JwYjI1ekxrbFVSVTFmUkVWTVJWUkZMQ0FuYUdGdVpHeGxSVzUwY25sRVpXeGxkR1VuWFZ4dVhTazdYRzVjYm1Oc1lYTnpJRVZ1ZEhKNVUzUnZjbVVnWlhoMFpXNWtjeUJDWVhObFUzUnZjbVVnZTF4dVhHNGdJR052Ym5OMGNuVmpkRzl5S0dScGMzQmhkR05vWlhJcElIdGNiaUFnSUNCemRYQmxjaWhrYVhOd1lYUmphR1Z5S1R0Y2JpQWdJQ0IwYUdsekxsOXBkR1Z0Y3lBOUlIVnVaR1ZtYVc1bFpEdGNiaUFnZlZ4dVhHNGdJR2RsZEVGamRHbHZibk1vS1NCN1hHNGdJQ0FnY21WMGRYSnVJRjloWTNScGIyNXpPMXh1SUNCOVhHNWNiaUFnWDJ4dllXUW9LU0I3WEc0Z0lDQWdTWFJsYlVGamRHbHZibk11WjJWMFFXeHNLQ2s3WEc0Z0lDQWdjbVYwZFhKdUlIVnVaR1ZtYVc1bFpEdGNiaUFnZlZ4dVhHNGdJRjluWlhSSmRHVnRjeWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZmFYUmxiWE1nSVQwOUlIVnVaR1ZtYVc1bFpDQS9JSFJvYVhNdVgybDBaVzF6SURvZ2RHaHBjeTVmYkc5aFpDZ3BPMXh1SUNCOVhHNWNiaUFnWjJWMFFXeHNLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5blpYUkpkR1Z0Y3lncE8xeHVJQ0I5WEc1Y2JpQWdaMlYwS0dsa0tTQjdYRzRnSUNBZ2FXUWdQU0J3WVhKelpVbHVkQ2hwWkN3Z01UQXBPMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlwZEdWdGN5QWhQVDBnZFc1a1pXWnBibVZrSUQ4Z0tHbGtJR2x1SUhSb2FYTXVYMmwwWlcxeklEOGdkR2hwY3k1ZmFYUmxiWE5iYVdSZElEb2diblZzYkNrZ09pQjBhR2x6TGw5c2IyRmtLQ2s3WEc0Z0lIMWNibHh1SUNBdktseHVJQ0FxWEc0Z0lDb2dRV04wYVc5dUlFaGhibVJzWlhKelhHNGdJQ3BjYmlBZ0tpOWNibHh1SUNCb1lXNWtiR1ZUWlhSQmJHd29jR0Y1Ykc5aFpDa2dlMXh1SUNBZ0lHTnZibk52YkdVdVpHVmlkV2NvWUNSN2RHaHBjeTVuWlhSVGRHOXlaVTVoYldVb0tYMDZhR0Z1Wkd4bFUyVjBRV3hzT3lCemRHRjBaVDBrZTNCaGVXeHZZV1F1YzNSaGRHVjlZQ2s3WEc1Y2JpQWdJQ0J6ZDJsMFkyZ29jR0Y1Ykc5aFpDNXpkR0YwWlNrZ2UxeHVJQ0FnSUNBZ1kyRnpaU0JyVTNSaGRHVnpMa3hQUVVSSlRrYzZYRzRnSUNBZ0lDQWdJSFJvYVhNdWFXNW1iR2xuYUhRZ1BTQjBjblZsTzF4dUlDQWdJQ0FnSUNCaWNtVmhhenRjYmlBZ0lDQWdJR05oYzJVZ2ExTjBZWFJsY3k1VFdVNURSVVE2WEc0Z0lDQWdJQ0FnSUhSb2FYTXVYMmwwWlcxeklEMGdlMzA3WEc0Z0lDQWdJQ0FnSUY4dVpXRmphQ2h3WVhsc2IyRmtMbVJoZEdFc0lHbDBaVzBnUFQ0Z2RHaHBjeTVwZEdWdGMxdHBkR1Z0TG1sa1hTQTlJSFJvYVhNdWJXRnJaVk4wWVhSbFpuVnNSVzUwY25rb2NHRjViRzloWkM1emRHRjBaU3dnYVhSbGJTa3BPMXh1SUNBZ0lDQWdJQ0IwYUdsekxtbHVabXhwWjJoMElEMGdabUZzYzJVN1hHNGdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdVpXMXBkRU5vWVc1blpTZ3BPMXh1SUNCOVhHNWNiaUFnYUdGdVpHeGxSVzUwY25sRGNtVmhkR1VvY0dGNWJHOWhaQ2tnZTF4dUlDQWdJR052Ym5OdmJHVXVaR1ZpZFdjb1lDUjdkR2hwY3k1blpYUlRkRzl5WlU1aGJXVW9LWDA2YUdGdVpHeGxSVzUwY25sRGNtVmhkR1U3SUhOMFlYUmxQU1I3Y0dGNWJHOWhaQzV6ZEdGMFpYMWdLVHRjYmx4dUlDQWdJSFpoY2lCemRHRjBaU0E5SUhSb2FYTXVYMmwwWlcxeklIeDhJSHQ5TEZ4dUlDQWdJQ0FnSUNCdVpYZEZiblJ5ZVN3Z1pYaHBjM1JwYm1kRmJuUnllVHRjYmx4dUlDQWdJSE4zYVhSamFDaHdZWGxzYjJGa0xuTjBZWFJsS1NCN1hHNGdJQ0FnSUNCallYTmxJR3RUZEdGMFpYTXVUa1ZYT2x4dUlDQWdJQ0FnSUNCemRHRjBaVnR3WVhsc2IyRmtMbVJoZEdFdVkybGtYU0E5SUhSb2FYTXViV0ZyWlZOMFlYUmxablZzUlc1MGNua29jR0Y1Ykc5aFpDNXpkR0YwWlN3Z2NHRjViRzloWkM1a1lYUmhLVHRjYmlBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQmpZWE5sSUd0VGRHRjBaWE11VTFsT1EwVkVPbHh1SUNBZ0lDQWdJQ0J1WlhkRmJuUnllU0E5SUhCaGVXeHZZV1F1WkdGMFlUdGNiaUFnSUNBZ0lDQWdMeThnWTJobFkyc2dabTl5SUdFZ2JHOWpZV3dnWTJ4cFpXNTBJR2xrSUdGdVpDQnpkMmwwWTJnZ2RHOGdjMlZ5ZG1WeUlHbGtYRzRnSUNBZ0lDQWdJQzh2SUQ4L1B5QnBjeUIwYUdseklHSmxjM1FnWkc5dVpTQm9aWEpsSUc5eUlHVnVZMkZ3YzNWc1lYUmxaQ0JwYmlCRmJuUnllU0JOYjJSbGJDQS9QejljYmlBZ0lDQWdJQ0FnYVdZZ0tHNWxkMFZ1ZEhKNUxtTnBaQ0FtSmlBb1pYaHBjM1JwYm1kRmJuUnllU0E5SUhOMFlYUmxXMjVsZDBWdWRISjVMbU5wWkYwcElDWW1JQ0Z6ZEdGMFpWdHVaWGRGYm5SeWVTNXBaRjBwSUh0Y2JseHVJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXVaR1ZpZFdjb1lDUjdkR2hwY3k1blpYUlRkRzl5WlU1aGJXVW9LWDA2YUdGdVpHeGxSVzUwY25sRGNtVmhkR1U3SUdOdmJuWmxjblJwYm1jZ1kyeHBaVzUwTFdsa0lIUnZJSE5sY25abGNpMXBaR0FwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdaWGhwYzNScGJtZEZiblJ5ZVNBOUlIUm9hWE11ZFhCa1lYUmxVM1JoZEdWbWRXeEZiblJ5ZVNobGVHbHpkR2x1WjBWdWRISjVMQ0J3WVhsc2IyRmtMbk4wWVhSbExDQnVaWGRGYm5SeWVTazdYRzVjYmlBZ0lDQWdJQ0FnSUNBdkx5QnlaVzF2ZG1VZ2RHaGxJRndpYm1WM1hDSWdaVzUwY25rZ2QyaHBZMmdnYVhNZ1ltVnBibWNnY21Wd2JHRmpaV1FnWW5rZ2FYUnpJSEJsY20xaGJtVnVkQ0J2Ym1WY2JpQWdJQ0FnSUNBZ0lDQmtaV3hsZEdVZ2MzUmhkR1ZiWlhocGMzUnBibWRGYm5SeWVTNWtZWFJoTG1OcFpGMDdYRzRnSUNBZ0lDQWdJQ0FnYzNSaGRHVmJaWGhwYzNScGJtZEZiblJ5ZVM1a1lYUmhMbWxrWFNBOUlHVjRhWE4wYVc1blJXNTBjbms3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ2MzUmhkR1ZiYm1WM1JXNTBjbmt1YVdSZElEMGdkR2hwY3k1dFlXdGxVM1JoZEdWbWRXeEZiblJ5ZVNod1lYbHNiMkZrTG5OMFlYUmxMQ0J1WlhkRmJuUnllU2s3WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1bGJXbDBRMmhoYm1kbEtDazdYRzRnSUgxY2JseHVJQ0JvWVc1a2JHVkZiblJ5ZVZWd1pHRjBaU2h3WVhsc2IyRmtLU0I3WEc0Z0lDQWdZMjl1YzI5c1pTNWtaV0oxWnloZ0pIdDBhR2x6TG1kbGRGTjBiM0psVG1GdFpTZ3BmVHBvWVc1a2JHVkZiblJ5ZVZWd1pHRjBaVHNnYzNSaGRHVTlKSHR3WVhsc2IyRmtMbk4wWVhSbGZXQXBPMXh1WEc0Z0lDQWdkbUZ5SUc1bGQwVnVkSEo1SUQwZ2NHRjViRzloWkM1a1lYUmhMRnh1SUNBZ0lDQWdJQ0JsZUdsemRHbHVaMFZ1ZEhKNU8xeHVYRzRnSUNBZ2MzZHBkR05vS0hCaGVXeHZZV1F1YzNSaGRHVXBJSHRjYmlBZ0lDQWdJR05oYzJVZ2ExTjBZWFJsY3k1VFFWWkpUa2M2WEc0Z0lDQWdJQ0FnSUdWNGFYTjBhVzVuUlc1MGNua2dQU0IwYUdsekxsOXBkR1Z0YzF0dVpYZEZiblJ5ZVM1cFpGMDdYRzRnSUNBZ0lDQWdJR2xtSUNobGVHbHpkR2x1WjBWdWRISjVLU0I3WEc0Z0lDQWdJQ0FnSUNBZ1pYaHBjM1JwYm1kRmJuUnllU0E5SUhSb2FYTXVkWEJrWVhSbFUzUmhkR1ZtZFd4RmJuUnllU2hsZUdsemRHbHVaMFZ1ZEhKNUxDQndZWGxzYjJGa0xtUmhkR0VzSUc1bGQwVnVkSEo1S1R0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUdOaGMyVWdhMU4wWVhSbGN5NVRXVTVEUlVRNlhHNGdJQ0FnSUNBZ0lHVjRhWE4wYVc1blJXNTBjbmtnUFNCMGFHbHpMbDlwZEdWdGMxdHVaWGRGYm5SeWVTNXBaRjA3WEc0Z0lDQWdJQ0FnSUdsbUlDaGxlR2x6ZEdsdVowVnVkSEo1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdaWGhwYzNScGJtZEZiblJ5ZVNBOUlIUm9hWE11ZFhCa1lYUmxVM1JoZEdWbWRXeEZiblJ5ZVNobGVHbHpkR2x1WjBWdWRISjVMQ0J3WVhsc2IyRmtMbVJoZEdFc0lHNWxkMFZ1ZEhKNUtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbVZ0YVhSRGFHRnVaMlVvS1R0Y2JpQWdmVnh1WEc0Z0lHaGhibVJzWlVWdWRISjVSR1ZzWlhSbEtIQmhlV3h2WVdRcElIdGNiaUFnSUNCamIyNXpiMnhsTG1SbFluVm5LR0FrZTNSb2FYTXVaMlYwVTNSdmNtVk9ZVzFsS0NsOU9taGhibVJzWlVWdWRISjVSR1ZzWlhSbE95QnpkR0YwWlQwa2UzQmhlV3h2WVdRdWMzUmhkR1Y5WUNrN1hHNWNiaUFnSUNCMllYSWdaWGhwYzNScGJtZEZiblJ5ZVNBOUlIUm9hWE11WDJsMFpXMXpXM0JoZVd4dllXUXVaR0YwWVM1cFpGMDdYRzVjYmlBZ0lDQnBaaUFvWlhocGMzUnBibWRGYm5SeWVTa2dlMXh1SUNBZ0lDQWdjM2RwZEdOb0tIQmhlV3h2WVdRdWMzUmhkR1VwSUh0Y2JpQWdJQ0FnSUNBZ1kyRnpaU0JyVTNSaGRHVnpMa1JGVEVWVVNVNUhPbHh1SUNBZ0lDQWdJQ0FnSUdWNGFYTjBhVzVuUlc1MGNua2dQU0IwYUdsekxuVndaR0YwWlZOMFlYUmxablZzUlc1MGNua29aWGhwYzNScGJtZEZiblJ5ZVN3Z2NHRjViRzloWkM1emRHRjBaU2s3WEc0Z0lDQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0FnSUdOaGMyVWdhMU4wWVhSbGN5NVRXVTVEUlVRNlhHNGdJQ0FnSUNBZ0lDQWdaR1ZzWlhSbElIUm9hWE11WDJsMFpXMXpXM0JoZVd4dllXUXVaR0YwWVM1cFpGMDdYRzRnSUNBZ0lDQWdJQ0FnWW5KbFlXczdYRzRnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJSFJvYVhNdVpXMXBkRU5vWVc1blpTZ3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNTlYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnUlc1MGNubFRkRzl5WlR0Y2JpSmRmUT09IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG52YXIgQmFzZVN0b3JlID0gcmVxdWlyZSgnLi9iYXNlJyk7XG5cbnZhciBrQWN0aW9ucyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9hY3Rpb25zJyksXG4gICAga1N0YXRlcyA9IHJlcXVpcmUoJy4uL2NvbnN0YW50cy9zdGF0ZXMnKSxcbiAgICBTZXJ2ZXJBY3Rpb25zID0gcmVxdWlyZSgnLi4vYWN0aW9ucy9zZXJ2ZXItdGltZScpO1xuXG52YXIgX2FjdGlvbnMgPSBfLnppcE9iamVjdChbXG4gIFtrQWN0aW9ucy5TRVJWRVJUSU1FX0dFVCwgJ2hhbmRsZUdldCddXG5dKTtcblxuY2xhc3MgRW50cnlTdG9yZSBleHRlbmRzIEJhc2VTdG9yZSB7XG5cbiAgY29uc3RydWN0b3IoZGlzcGF0Y2hlcikge1xuICAgIHN1cGVyKGRpc3BhdGNoZXIpO1xuICAgIHRoaXMuX3NlcnZlclRpbWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBnZXRBY3Rpb25zKCkge1xuICAgIHJldHVybiBfYWN0aW9ucztcbiAgfVxuXG4gIF9sb2FkKCkge1xuICAgIFNlcnZlckFjdGlvbnMuZ2V0QWxsKCk7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIF9nZXRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXJ2ZXJUaW1lICE9PSB1bmRlZmluZWQgPyB0aGlzLl9zZXJ2ZXJUaW1lIDogdGhpcy5fbG9hZCgpO1xuICB9XG5cbiAgZ2V0U2VydmVyVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VGltZSgpO1xuICB9XG5cblxuICAvKlxuICAqXG4gICogQWN0aW9uIEhhbmRsZXJzXG4gICpcbiAgKi9cblxuICBoYW5kbGVTZXRBbGwocGF5bG9hZCkge1xuICAgIGNvbnNvbGUuZGVidWcoYCR7dGhpcy5nZXRTdG9yZU5hbWUoKX06aGFuZGxlU2V0QWxsOyBzdGF0ZT0ke3BheWxvYWQuc3RhdGV9YCk7XG5cbiAgICBzd2l0Y2gocGF5bG9hZC5zdGF0ZSkge1xuICAgICAgY2FzZSBrU3RhdGVzLkxPQURJTkc6XG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2Uga1N0YXRlcy5TWU5DRUQ6XG4gICAgICAgIHRoaXMuaW5mbGlnaHQgPSBmYWxzZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5fc2VydmVyVGltZSA9IHRoaXMubWFrZVN0YXRlZnVsRW50cnkocGF5bG9hZC5zdGF0ZSwgcGF5bG9hZC5kYXRhKTtcblxuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbnRyeVN0b3JlO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12YzNSdmNtVnpMM05sY25abGNpMTBhVzFsTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRmxCUVZrc1EwRkJRenM3UVVGRllpeEpRVUZKTEVOQlFVTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03TzBGQlJURkNMRWxCUVVrc1UwRkJVeXhIUVVGSExFOUJRVThzUTBGQlF5eFJRVUZSTEVOQlFVTXNRMEZCUXpzN1FVRkZiRU1zU1VGQlNTeFJRVUZSTEVkQlFVY3NUMEZCVHl4RFFVRkRMSE5DUVVGelFpeERRVUZETzBsQlF6RkRMRTlCUVU4c1IwRkJSeXhQUVVGUExFTkJRVU1zY1VKQlFYRkNMRU5CUVVNN1FVRkROVU1zU1VGQlNTeGhRVUZoTEVkQlFVY3NUMEZCVHl4RFFVRkRMSGRDUVVGM1FpeERRVUZETEVOQlFVTTdPMEZCUlhSRUxFbEJRVWtzVVVGQlVTeEhRVUZITEVOQlFVTXNRMEZCUXl4VFFVRlRMRU5CUVVNN1JVRkRla0lzUTBGQlF5eFJRVUZSTEVOQlFVTXNZMEZCWXl4RlFVRkZMRmRCUVZjc1EwRkJRenRCUVVONFF5eERRVUZETEVOQlFVTXNRMEZCUXpzN1FVRkZTQ3hOUVVGTkxGVkJRVlVzVTBGQlV5eFRRVUZUTEVOQlFVTTdPMFZCUldwRExGZEJRVmNzWVVGQllUdEpRVU4wUWl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFTkJRVU03U1VGRGJFSXNTVUZCU1N4RFFVRkRMRmRCUVZjc1IwRkJSeXhUUVVGVExFTkJRVU03UVVGRGFrTXNSMEZCUnpzN1JVRkZSQ3hWUVVGVkxFZEJRVWM3U1VGRFdDeFBRVUZQTEZGQlFWRXNRMEZCUXp0QlFVTndRaXhIUVVGSE96dEZRVVZFTEV0QlFVc3NSMEZCUnp0SlFVTk9MR0ZCUVdFc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF6dEpRVU4yUWl4UFFVRlBMRk5CUVZNc1EwRkJRenRCUVVOeVFpeEhRVUZIT3p0RlFVVkVMRkZCUVZFc1IwRkJSenRKUVVOVUxFOUJRVThzU1VGQlNTeERRVUZETEZkQlFWY3NTMEZCU3l4VFFVRlRMRWRCUVVjc1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1FVRkROVVVzUjBGQlJ6czdSVUZGUkN4aFFVRmhMRWRCUVVjN1NVRkRaQ3hQUVVGUExFbEJRVWtzUTBGQlF5eFJRVUZSTEVWQlFVVXNRMEZCUXp0QlFVTXpRaXhIUVVGSE8wRkJRMGc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wVkJSVVVzV1VGQldTeFZRVUZWTzBGQlEzaENMRWxCUVVrc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITEVsQlFVa3NRMEZCUXl4WlFVRlpMRVZCUVVVc2QwSkJRWGRDTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJReXhEUVVGRE96dEpRVVUzUlN4UFFVRlBMRTlCUVU4c1EwRkJReXhMUVVGTE8wMUJRMnhDTEV0QlFVc3NUMEZCVHl4RFFVRkRMRTlCUVU4N1VVRkRiRUlzU1VGQlNTeERRVUZETEZGQlFWRXNSMEZCUnl4SlFVRkpMRU5CUVVNN1VVRkRja0lzVFVGQlRUdE5RVU5TTEV0QlFVc3NUMEZCVHl4RFFVRkRMRTFCUVUwN1VVRkRha0lzU1VGQlNTeERRVUZETEZGQlFWRXNSMEZCUnl4TFFVRkxMRU5CUVVNN1VVRkRkRUlzVFVGQlRUdEJRVU5rTEV0QlFVczdPMEZCUlV3c1NVRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eFBRVUZQTEVOQlFVTXNTMEZCU3l4RlFVRkZMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6czdTVUZGZGtVc1NVRkJTU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBGQlEzUkNMRWRCUVVjN08wRkJSVWdzUTBGQlF6czdRVUZGUkN4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGVkJRVlVzUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUY4Z1BTQnlaWEYxYVhKbEtDZHNiMlJoYzJnbktUdGNibHh1ZG1GeUlFSmhjMlZUZEc5eVpTQTlJSEpsY1hWcGNtVW9KeTR2WW1GelpTY3BPMXh1WEc1MllYSWdhMEZqZEdsdmJuTWdQU0J5WlhGMWFYSmxLQ2N1TGk5amIyNXpkR0Z1ZEhNdllXTjBhVzl1Y3ljcExGeHVJQ0FnSUd0VGRHRjBaWE1nUFNCeVpYRjFhWEpsS0NjdUxpOWpiMjV6ZEdGdWRITXZjM1JoZEdWekp5a3NYRzRnSUNBZ1UyVnlkbVZ5UVdOMGFXOXVjeUE5SUhKbGNYVnBjbVVvSnk0dUwyRmpkR2x2Ym5NdmMyVnlkbVZ5TFhScGJXVW5LVHRjYmx4dWRtRnlJRjloWTNScGIyNXpJRDBnWHk1NmFYQlBZbXBsWTNRb1cxeHVJQ0JiYTBGamRHbHZibk11VTBWU1ZrVlNWRWxOUlY5SFJWUXNJQ2RvWVc1a2JHVkhaWFFuWFZ4dVhTazdYRzVjYm1Oc1lYTnpJRVZ1ZEhKNVUzUnZjbVVnWlhoMFpXNWtjeUJDWVhObFUzUnZjbVVnZTF4dVhHNGdJR052Ym5OMGNuVmpkRzl5S0dScGMzQmhkR05vWlhJcElIdGNiaUFnSUNCemRYQmxjaWhrYVhOd1lYUmphR1Z5S1R0Y2JpQWdJQ0IwYUdsekxsOXpaWEoyWlhKVWFXMWxJRDBnZFc1a1pXWnBibVZrTzF4dUlDQjlYRzVjYmlBZ1oyVjBRV04wYVc5dWN5Z3BJSHRjYmlBZ0lDQnlaWFIxY200Z1gyRmpkR2x2Ym5NN1hHNGdJSDFjYmx4dUlDQmZiRzloWkNncElIdGNiaUFnSUNCVFpYSjJaWEpCWTNScGIyNXpMbWRsZEVGc2JDZ3BPMXh1SUNBZ0lISmxkSFZ5YmlCMWJtUmxabWx1WldRN1hHNGdJSDFjYmx4dUlDQmZaMlYwVkdsdFpTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVmYzJWeWRtVnlWR2x0WlNBaFBUMGdkVzVrWldacGJtVmtJRDhnZEdocGN5NWZjMlZ5ZG1WeVZHbHRaU0E2SUhSb2FYTXVYMnh2WVdRb0tUdGNiaUFnZlZ4dVhHNGdJR2RsZEZObGNuWmxjbFJwYldVb0tTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMmRsZEZScGJXVW9LVHRjYmlBZ2ZWeHVYRzVjYmlBZ0x5cGNiaUFnS2x4dUlDQXFJRUZqZEdsdmJpQklZVzVrYkdWeWMxeHVJQ0FxWEc0Z0lDb3ZYRzVjYmlBZ2FHRnVaR3hsVTJWMFFXeHNLSEJoZVd4dllXUXBJSHRjYmlBZ0lDQmpiMjV6YjJ4bExtUmxZblZuS0dBa2UzUm9hWE11WjJWMFUzUnZjbVZPWVcxbEtDbDlPbWhoYm1Sc1pWTmxkRUZzYkRzZ2MzUmhkR1U5Skh0d1lYbHNiMkZrTG5OMFlYUmxmV0FwTzF4dVhHNGdJQ0FnYzNkcGRHTm9LSEJoZVd4dllXUXVjM1JoZEdVcElIdGNiaUFnSUNBZ0lHTmhjMlVnYTFOMFlYUmxjeTVNVDBGRVNVNUhPbHh1SUNBZ0lDQWdJQ0IwYUdsekxtbHVabXhwWjJoMElEMGdkSEoxWlR0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0JqWVhObElHdFRkR0YwWlhNdVUxbE9RMFZFT2x4dUlDQWdJQ0FnSUNCMGFHbHpMbWx1Wm14cFoyaDBJRDBnWm1Gc2MyVTdYRzRnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhSb2FYTXVYM05sY25abGNsUnBiV1VnUFNCMGFHbHpMbTFoYTJWVGRHRjBaV1oxYkVWdWRISjVLSEJoZVd4dllXUXVjM1JoZEdVc0lIQmhlV3h2WVdRdVpHRjBZU2s3WEc1Y2JpQWdJQ0IwYUdsekxtVnRhWFJEYUdGdVoyVW9LVHRjYmlBZ2ZWeHVYRzU5WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1JXNTBjbmxUZEc5eVpUdGNiaUpkZlE9PSIsIi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgRGlzcGF0Y2hlclxuICogQHR5cGVjaGVja3NcbiAqL1xuXG52YXIgaW52YXJpYW50ID0gcmVxdWlyZSgnLi9pbnZhcmlhbnQnKTtcblxudmFyIF9sYXN0SUQgPSAxO1xudmFyIF9wcmVmaXggPSAnSURfJztcblxuLyoqXG4gKiBEaXNwYXRjaGVyIGlzIHVzZWQgdG8gYnJvYWRjYXN0IHBheWxvYWRzIHRvIHJlZ2lzdGVyZWQgY2FsbGJhY2tzLiBUaGlzIGlzXG4gKiBkaWZmZXJlbnQgZnJvbSBnZW5lcmljIHB1Yi1zdWIgc3lzdGVtcyBpbiB0d28gd2F5czpcbiAqXG4gKiAgIDEpIENhbGxiYWNrcyBhcmUgbm90IHN1YnNjcmliZWQgdG8gcGFydGljdWxhciBldmVudHMuIEV2ZXJ5IHBheWxvYWQgaXNcbiAqICAgICAgZGlzcGF0Y2hlZCB0byBldmVyeSByZWdpc3RlcmVkIGNhbGxiYWNrLlxuICogICAyKSBDYWxsYmFja3MgY2FuIGJlIGRlZmVycmVkIGluIHdob2xlIG9yIHBhcnQgdW50aWwgb3RoZXIgY2FsbGJhY2tzIGhhdmVcbiAqICAgICAgYmVlbiBleGVjdXRlZC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgY29uc2lkZXIgdGhpcyBoeXBvdGhldGljYWwgZmxpZ2h0IGRlc3RpbmF0aW9uIGZvcm0sIHdoaWNoXG4gKiBzZWxlY3RzIGEgZGVmYXVsdCBjaXR5IHdoZW4gYSBjb3VudHJ5IGlzIHNlbGVjdGVkOlxuICpcbiAqICAgdmFyIGZsaWdodERpc3BhdGNoZXIgPSBuZXcgRGlzcGF0Y2hlcigpO1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY291bnRyeSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ291bnRyeVN0b3JlID0ge2NvdW50cnk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2Ygd2hpY2ggY2l0eSBpcyBzZWxlY3RlZFxuICogICB2YXIgQ2l0eVN0b3JlID0ge2NpdHk6IG51bGx9O1xuICpcbiAqICAgLy8gS2VlcHMgdHJhY2sgb2YgdGhlIGJhc2UgZmxpZ2h0IHByaWNlIG9mIHRoZSBzZWxlY3RlZCBjaXR5XG4gKiAgIHZhciBGbGlnaHRQcmljZVN0b3JlID0ge3ByaWNlOiBudWxsfVxuICpcbiAqIFdoZW4gYSB1c2VyIGNoYW5nZXMgdGhlIHNlbGVjdGVkIGNpdHksIHdlIGRpc3BhdGNoIHRoZSBwYXlsb2FkOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5kaXNwYXRjaCh7XG4gKiAgICAgYWN0aW9uVHlwZTogJ2NpdHktdXBkYXRlJyxcbiAqICAgICBzZWxlY3RlZENpdHk6ICdwYXJpcydcbiAqICAgfSk7XG4gKlxuICogVGhpcyBwYXlsb2FkIGlzIGRpZ2VzdGVkIGJ5IGBDaXR5U3RvcmVgOlxuICpcbiAqICAgZmxpZ2h0RGlzcGF0Y2hlci5yZWdpc3RlcihmdW5jdGlvbihwYXlsb2FkKSkge1xuICogICAgIGlmIChwYXlsb2FkLmFjdGlvblR5cGUgPT09ICdjaXR5LXVwZGF0ZScpIHtcbiAqICAgICAgIENpdHlTdG9yZS5jaXR5ID0gcGF5bG9hZC5zZWxlY3RlZENpdHk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBXaGVuIHRoZSB1c2VyIHNlbGVjdHMgYSBjb3VudHJ5LCB3ZSBkaXNwYXRjaCB0aGUgcGF5bG9hZDpcbiAqXG4gKiAgIGZsaWdodERpc3BhdGNoZXIuZGlzcGF0Y2goe1xuICogICAgIGFjdGlvblR5cGU6ICdjb3VudHJ5LXVwZGF0ZScsXG4gKiAgICAgc2VsZWN0ZWRDb3VudHJ5OiAnYXVzdHJhbGlhJ1xuICogICB9KTtcbiAqXG4gKiBUaGlzIHBheWxvYWQgaXMgZGlnZXN0ZWQgYnkgYm90aCBzdG9yZXM6XG4gKlxuICogICAgQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICBDb3VudHJ5U3RvcmUuY291bnRyeSA9IHBheWxvYWQuc2VsZWN0ZWRDb3VudHJ5O1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogV2hlbiB0aGUgY2FsbGJhY2sgdG8gdXBkYXRlIGBDb3VudHJ5U3RvcmVgIGlzIHJlZ2lzdGVyZWQsIHdlIHNhdmUgYSByZWZlcmVuY2VcbiAqIHRvIHRoZSByZXR1cm5lZCB0b2tlbi4gVXNpbmcgdGhpcyB0b2tlbiB3aXRoIGB3YWl0Rm9yKClgLCB3ZSBjYW4gZ3VhcmFudGVlXG4gKiB0aGF0IGBDb3VudHJ5U3RvcmVgIGlzIHVwZGF0ZWQgYmVmb3JlIHRoZSBjYWxsYmFjayB0aGF0IHVwZGF0ZXMgYENpdHlTdG9yZWBcbiAqIG5lZWRzIHRvIHF1ZXJ5IGl0cyBkYXRhLlxuICpcbiAqICAgQ2l0eVN0b3JlLmRpc3BhdGNoVG9rZW4gPSBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpIHtcbiAqICAgICBpZiAocGF5bG9hZC5hY3Rpb25UeXBlID09PSAnY291bnRyeS11cGRhdGUnKSB7XG4gKiAgICAgICAvLyBgQ291bnRyeVN0b3JlLmNvdW50cnlgIG1heSBub3QgYmUgdXBkYXRlZC5cbiAqICAgICAgIGZsaWdodERpc3BhdGNoZXIud2FpdEZvcihbQ291bnRyeVN0b3JlLmRpc3BhdGNoVG9rZW5dKTtcbiAqICAgICAgIC8vIGBDb3VudHJ5U3RvcmUuY291bnRyeWAgaXMgbm93IGd1YXJhbnRlZWQgdG8gYmUgdXBkYXRlZC5cbiAqXG4gKiAgICAgICAvLyBTZWxlY3QgdGhlIGRlZmF1bHQgY2l0eSBmb3IgdGhlIG5ldyBjb3VudHJ5XG4gKiAgICAgICBDaXR5U3RvcmUuY2l0eSA9IGdldERlZmF1bHRDaXR5Rm9yQ291bnRyeShDb3VudHJ5U3RvcmUuY291bnRyeSk7XG4gKiAgICAgfVxuICogICB9KTtcbiAqXG4gKiBUaGUgdXNhZ2Ugb2YgYHdhaXRGb3IoKWAgY2FuIGJlIGNoYWluZWQsIGZvciBleGFtcGxlOlxuICpcbiAqICAgRmxpZ2h0UHJpY2VTdG9yZS5kaXNwYXRjaFRva2VuID1cbiAqICAgICBmbGlnaHREaXNwYXRjaGVyLnJlZ2lzdGVyKGZ1bmN0aW9uKHBheWxvYWQpKSB7XG4gKiAgICAgICBzd2l0Y2ggKHBheWxvYWQuYWN0aW9uVHlwZSkge1xuICogICAgICAgICBjYXNlICdjb3VudHJ5LXVwZGF0ZSc6XG4gKiAgICAgICAgICAgZmxpZ2h0RGlzcGF0Y2hlci53YWl0Rm9yKFtDaXR5U3RvcmUuZGlzcGF0Y2hUb2tlbl0pO1xuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgZ2V0RmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICpcbiAqICAgICAgICAgY2FzZSAnY2l0eS11cGRhdGUnOlxuICogICAgICAgICAgIEZsaWdodFByaWNlU3RvcmUucHJpY2UgPVxuICogICAgICAgICAgICAgRmxpZ2h0UHJpY2VTdG9yZShDb3VudHJ5U3RvcmUuY291bnRyeSwgQ2l0eVN0b3JlLmNpdHkpO1xuICogICAgICAgICAgIGJyZWFrO1xuICogICAgIH1cbiAqICAgfSk7XG4gKlxuICogVGhlIGBjb3VudHJ5LXVwZGF0ZWAgcGF5bG9hZCB3aWxsIGJlIGd1YXJhbnRlZWQgdG8gaW52b2tlIHRoZSBzdG9yZXMnXG4gKiByZWdpc3RlcmVkIGNhbGxiYWNrcyBpbiBvcmRlcjogYENvdW50cnlTdG9yZWAsIGBDaXR5U3RvcmVgLCB0aGVuXG4gKiBgRmxpZ2h0UHJpY2VTdG9yZWAuXG4gKi9cblxuICBmdW5jdGlvbiBEaXNwYXRjaGVyKCkge1widXNlIHN0cmljdFwiO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzID0ge307XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmcgPSB7fTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzSGFuZGxlZCA9IHt9O1xuICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyA9IGZhbHNlO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfcGVuZGluZ1BheWxvYWQgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBhIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgd2l0aCBldmVyeSBkaXNwYXRjaGVkIHBheWxvYWQuIFJldHVybnNcbiAgICogYSB0b2tlbiB0aGF0IGNhbiBiZSB1c2VkIHdpdGggYHdhaXRGb3IoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKGNhbGxiYWNrKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGlkID0gX3ByZWZpeCArIF9sYXN0SUQrKztcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0gPSBjYWxsYmFjaztcbiAgICByZXR1cm4gaWQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBjYWxsYmFjayBiYXNlZCBvbiBpdHMgdG9rZW4uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgRGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3Rlcj1mdW5jdGlvbihpZCkge1widXNlIHN0cmljdFwiO1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXSxcbiAgICAgICdEaXNwYXRjaGVyLnVucmVnaXN0ZXIoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICBpZFxuICAgICk7XG4gICAgZGVsZXRlIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzW2lkXTtcbiAgfTtcblxuICAvKipcbiAgICogV2FpdHMgZm9yIHRoZSBjYWxsYmFja3Mgc3BlY2lmaWVkIHRvIGJlIGludm9rZWQgYmVmb3JlIGNvbnRpbnVpbmcgZXhlY3V0aW9uXG4gICAqIG9mIHRoZSBjdXJyZW50IGNhbGxiYWNrLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IGEgY2FsbGJhY2sgaW5cbiAgICogcmVzcG9uc2UgdG8gYSBkaXNwYXRjaGVkIHBheWxvYWQuXG4gICAqXG4gICAqIEBwYXJhbSB7YXJyYXk8c3RyaW5nPn0gaWRzXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKGlkcykge1widXNlIHN0cmljdFwiO1xuICAgIGludmFyaWFudChcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogTXVzdCBiZSBpbnZva2VkIHdoaWxlIGRpc3BhdGNoaW5nLidcbiAgICApO1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpZHMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICB2YXIgaWQgPSBpZHNbaWldO1xuICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICBpbnZhcmlhbnQoXG4gICAgICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdLFxuICAgICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogQ2lyY3VsYXIgZGVwZW5kZW5jeSBkZXRlY3RlZCB3aGlsZSAnICtcbiAgICAgICAgICAnd2FpdGluZyBmb3IgYCVzYC4nLFxuICAgICAgICAgIGlkXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaW52YXJpYW50KFxuICAgICAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0sXG4gICAgICAgICdEaXNwYXRjaGVyLndhaXRGb3IoLi4uKTogYCVzYCBkb2VzIG5vdCBtYXAgdG8gYSByZWdpc3RlcmVkIGNhbGxiYWNrLicsXG4gICAgICAgIGlkXG4gICAgICApO1xuICAgICAgdGhpcy4kRGlzcGF0Y2hlcl9pbnZva2VDYWxsYmFjayhpZCk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGEgcGF5bG9hZCB0byBhbGwgcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXlsb2FkXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaD1mdW5jdGlvbihwYXlsb2FkKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgaW52YXJpYW50KFxuICAgICAgIXRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZyxcbiAgICAgICdEaXNwYXRjaC5kaXNwYXRjaCguLi4pOiBDYW5ub3QgZGlzcGF0Y2ggaW4gdGhlIG1pZGRsZSBvZiBhIGRpc3BhdGNoLidcbiAgICApO1xuICAgIHRoaXMuJERpc3BhdGNoZXJfc3RhcnREaXNwYXRjaGluZyhwYXlsb2FkKTtcbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy4kRGlzcGF0Y2hlcl9jYWxsYmFja3MpIHtcbiAgICAgICAgaWYgKHRoaXMuJERpc3BhdGNoZXJfaXNQZW5kaW5nW2lkXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJERpc3BhdGNoZXJfaW52b2tlQ2FsbGJhY2soaWQpO1xuICAgICAgfVxuICAgIH0gZmluYWxseSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX3N0b3BEaXNwYXRjaGluZygpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogSXMgdGhpcyBEaXNwYXRjaGVyIGN1cnJlbnRseSBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLmlzRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuJERpc3BhdGNoZXJfaXNEaXNwYXRjaGluZztcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbCB0aGUgY2FsbGJhY2sgc3RvcmVkIHdpdGggdGhlIGdpdmVuIGlkLiBBbHNvIGRvIHNvbWUgaW50ZXJuYWxcbiAgICogYm9va2tlZXBpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX2ludm9rZUNhbGxiYWNrPWZ1bmN0aW9uKGlkKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc1BlbmRpbmdbaWRdID0gdHJ1ZTtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2NhbGxiYWNrc1tpZF0odGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCk7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0hhbmRsZWRbaWRdID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogU2V0IHVwIGJvb2trZWVwaW5nIG5lZWRlZCB3aGVuIGRpc3BhdGNoaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGF5bG9hZFxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIERpc3BhdGNoZXIucHJvdG90eXBlLiREaXNwYXRjaGVyX3N0YXJ0RGlzcGF0Y2hpbmc9ZnVuY3Rpb24ocGF5bG9hZCkge1widXNlIHN0cmljdFwiO1xuICAgIGZvciAodmFyIGlkIGluIHRoaXMuJERpc3BhdGNoZXJfY2FsbGJhY2tzKSB7XG4gICAgICB0aGlzLiREaXNwYXRjaGVyX2lzUGVuZGluZ1tpZF0gPSBmYWxzZTtcbiAgICAgIHRoaXMuJERpc3BhdGNoZXJfaXNIYW5kbGVkW2lkXSA9IGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLiREaXNwYXRjaGVyX3BlbmRpbmdQYXlsb2FkID0gcGF5bG9hZDtcbiAgICB0aGlzLiREaXNwYXRjaGVyX2lzRGlzcGF0Y2hpbmcgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciBib29ra2VlcGluZyB1c2VkIGZvciBkaXNwYXRjaGluZy5cbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBEaXNwYXRjaGVyLnByb3RvdHlwZS4kRGlzcGF0Y2hlcl9zdG9wRGlzcGF0Y2hpbmc9ZnVuY3Rpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9wZW5kaW5nUGF5bG9hZCA9IG51bGw7XG4gICAgdGhpcy4kRGlzcGF0Y2hlcl9pc0Rpc3BhdGNoaW5nID0gZmFsc2U7XG4gIH07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwYXRjaGVyO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lkSEpoYm5ObWIzSnRaV1F1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTlWYzJWeWN5OW9ZblZ5Y205M2N5OWtaWFl2YUdWeWIydDFMM0psWVdOMExXWnNkWGd0YzNSaGNuUmxjaTl3ZFdKc2FXTXZhbUYyWVhOamNtbHdkSE12ZG1WdVpHOXlMMlpzZFhndlJHbHpjR0YwWTJobGNpNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeEpRVUZKTEZOQlFWTXNSMEZCUnl4UFFVRlBMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU03TzBGQlJYWkRMRWxCUVVrc1QwRkJUeXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU5vUWl4SlFVRkpMRTlCUVU4c1IwRkJSeXhMUVVGTExFTkJRVU03TzBGQlJYQkNPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFc1IwRkJSenM3UlVGRlJDeFRRVUZUTEZWQlFWVXNSMEZCUnl4RFFVRkRMRmxCUVZrc1EwRkJRenRKUVVOc1F5eEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFZEJRVWNzUlVGQlJTeERRVUZETzBsQlEyaERMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNSMEZCUnl4RlFVRkZMRU5CUVVNN1NVRkRhRU1zU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhIUVVGSExFVkJRVVVzUTBGQlF6dEpRVU5vUXl4SlFVRkpMRU5CUVVNc2VVSkJRWGxDTEVkQlFVY3NTMEZCU3l4RFFVRkRPMGxCUTNaRExFbEJRVWtzUTBGQlF5d3dRa0ZCTUVJc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRE0wTXNSMEZCUnpzN1FVRkZTQ3hGUVVGRk8wRkJRMFk3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMHRCUlVzN1JVRkRTQ3hWUVVGVkxFTkJRVU1zVTBGQlV5eERRVUZETEZGQlFWRXNRMEZCUXl4VFFVRlRMRkZCUVZFc1JVRkJSU3hEUVVGRExGbEJRVmtzUTBGQlF6dEpRVU0zUkN4SlFVRkpMRVZCUVVVc1IwRkJSeXhQUVVGUExFZEJRVWNzVDBGQlR5eEZRVUZGTEVOQlFVTTdTVUZETjBJc1NVRkJTU3hEUVVGRExIRkNRVUZ4UWl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExGRkJRVkVzUTBGQlF6dEpRVU14UXl4UFFVRlBMRVZCUVVVc1EwRkJRenRCUVVOa0xFZEJRVWNzUTBGQlF6czdRVUZGU2l4RlFVRkZPMEZCUTBZN1FVRkRRVHM3UzBGRlN6dEZRVU5JTEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1ZVRkJWU3hEUVVGRExGTkJRVk1zUlVGQlJTeEZRVUZGTEVOQlFVTXNXVUZCV1N4RFFVRkRPMGxCUTNwRUxGTkJRVk03VFVGRFVDeEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUlVGQlJTeERRVUZETzAxQlF6bENMSGxGUVVGNVJUdE5RVU42UlN4RlFVRkZPMHRCUTBnc1EwRkJRenRKUVVOR0xFOUJRVThzU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzBGQlF6RkRMRWRCUVVjc1EwRkJRenM3UVVGRlNpeEZRVUZGTzBGQlEwWTdRVUZEUVR0QlFVTkJPMEZCUTBFN08wdEJSVXM3UlVGRFNDeFZRVUZWTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFZEJRVWNzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXp0SlFVTjJSQ3hUUVVGVE8wMUJRMUFzU1VGQlNTeERRVUZETEhsQ1FVRjVRanROUVVNNVFpdzJSRUZCTmtRN1MwRkRPVVFzUTBGQlF6dEpRVU5HTEV0QlFVc3NTVUZCU1N4RlFVRkZMRWRCUVVjc1EwRkJReXhGUVVGRkxFVkJRVVVzUjBGQlJ5eEhRVUZITEVOQlFVTXNUVUZCVFN4RlFVRkZMRVZCUVVVc1JVRkJSU3hGUVVGRk8wMUJRM1JETEVsQlFVa3NSVUZCUlN4SFFVRkhMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF6dE5RVU5xUWl4SlFVRkpMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSVHRSUVVOc1F5eFRRVUZUTzFWQlExQXNTVUZCU1N4RFFVRkRMSEZDUVVGeFFpeERRVUZETEVWQlFVVXNRMEZCUXp0VlFVTTVRaXc0UkVGQk9FUTdWVUZET1VRc2JVSkJRVzFDTzFWQlEyNUNMRVZCUVVVN1UwRkRTQ3hEUVVGRE8xRkJRMFlzVTBGQlV6dFBRVU5XTzAxQlEwUXNVMEZCVXp0UlFVTlFMRWxCUVVrc1EwRkJReXh4UWtGQmNVSXNRMEZCUXl4RlFVRkZMRU5CUVVNN1VVRkRPVUlzYzBWQlFYTkZPMUZCUTNSRkxFVkJRVVU3VDBGRFNDeERRVUZETzAxQlEwWXNTVUZCU1N4RFFVRkRMREJDUVVFd1FpeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRPMHRCUTNKRE8wRkJRMHdzUjBGQlJ5eERRVUZET3p0QlFVVktMRVZCUVVVN1FVRkRSanRCUVVOQk96dExRVVZMTzBWQlEwZ3NWVUZCVlN4RFFVRkRMRk5CUVZNc1EwRkJReXhSUVVGUkxFTkJRVU1zVTBGQlV5eFBRVUZQTEVWQlFVVXNRMEZCUXl4WlFVRlpMRU5CUVVNN1NVRkROVVFzVTBGQlV6dE5RVU5RTEVOQlFVTXNTVUZCU1N4RFFVRkRMSGxDUVVGNVFqdE5RVU12UWl4elJVRkJjMFU3UzBGRGRrVXNRMEZCUXp0SlFVTkdMRWxCUVVrc1EwRkJReXcwUWtGQk5FSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRKUVVNelF5eEpRVUZKTzAxQlEwWXNTMEZCU3l4SlFVRkpMRVZCUVVVc1NVRkJTU3hKUVVGSkxFTkJRVU1zY1VKQlFYRkNMRVZCUVVVN1VVRkRla01zU1VGQlNTeEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUlVGQlJTeERRVUZETEVWQlFVVTdWVUZEYkVNc1UwRkJVenRUUVVOV08xRkJRMFFzU1VGQlNTeERRVUZETERCQ1FVRXdRaXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETzA5QlEzSkRPMHRCUTBZc1UwRkJVenROUVVOU0xFbEJRVWtzUTBGQlF5d3lRa0ZCTWtJc1JVRkJSU3hEUVVGRE8wdEJRM0JETzBGQlEwd3NSMEZCUnl4RFFVRkRPenRCUVVWS0xFVkJRVVU3UVVGRFJqdEJRVU5CT3p0TFFVVkxPMFZCUTBnc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eGhRVUZoTEVOQlFVTXNWMEZCVnl4RFFVRkRMRmxCUVZrc1EwRkJRenRKUVVNeFJDeFBRVUZQTEVsQlFVa3NRMEZCUXl4NVFrRkJlVUlzUTBGQlF6dEJRVU14UXl4SFFVRkhMRU5CUVVNN08wRkJSVW9zUlVGQlJUdEJRVU5HTzBGQlEwRTdRVUZEUVR0QlFVTkJPenRMUVVWTE8wVkJRMGdzVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXl3d1FrRkJNRUlzUTBGQlF5eFRRVUZUTEVWQlFVVXNSVUZCUlN4RFFVRkRMRmxCUVZrc1EwRkJRenRKUVVONlJTeEpRVUZKTEVOQlFVTXNjVUpCUVhGQ0xFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRPMGxCUTNSRExFbEJRVWtzUTBGQlF5eHhRa0ZCY1VJc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNNRUpCUVRCQ0xFTkJRVU1zUTBGQlF6dEpRVU5vUlN4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRE8wRkJRekZETEVkQlFVY3NRMEZCUXpzN1FVRkZTaXhGUVVGRk8wRkJRMFk3UVVGRFFUdEJRVU5CT3p0TFFVVkxPMFZCUTBnc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5dzBRa0ZCTkVJc1EwRkJReXhUUVVGVExFOUJRVThzUlVGQlJTeERRVUZETEZsQlFWa3NRMEZCUXp0SlFVTm9SaXhMUVVGTExFbEJRVWtzUlVGQlJTeEpRVUZKTEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUlVGQlJUdE5RVU42UXl4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1MwRkJTeXhEUVVGRE8wMUJRM1pETEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNN1MwRkRlRU03U1VGRFJDeEpRVUZKTEVOQlFVTXNNRUpCUVRCQ0xFZEJRVWNzVDBGQlR5eERRVUZETzBsQlF6RkRMRWxCUVVrc1EwRkJReXg1UWtGQmVVSXNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRNVU1zUjBGQlJ5eERRVUZET3p0QlFVVktMRVZCUVVVN1FVRkRSanRCUVVOQk96dExRVVZMTzBWQlEwZ3NWVUZCVlN4RFFVRkRMRk5CUVZNc1EwRkJReXd5UWtGQk1rSXNRMEZCUXl4WFFVRlhMRU5CUVVNc1dVRkJXU3hEUVVGRE8wbEJRM2hGTEVsQlFVa3NRMEZCUXl3d1FrRkJNRUlzUjBGQlJ5eEpRVUZKTEVOQlFVTTdTVUZEZGtNc1NVRkJTU3hEUVVGRExIbENRVUY1UWl4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVNelF5eEhRVUZITEVOQlFVTTdRVUZEU2pzN1FVRkZRU3hOUVVGTkxFTkJRVU1zVDBGQlR5eEhRVUZITEZWQlFWVXNRMEZCUXlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpOHFYRzRnS2lCRGIzQjVjbWxuYUhRZ0tHTXBJREl3TVRRc0lFWmhZMlZpYjI5ckxDQkpibU11WEc0Z0tpQkJiR3dnY21sbmFIUnpJSEpsYzJWeWRtVmtMbHh1SUNwY2JpQXFJRlJvYVhNZ2MyOTFjbU5sSUdOdlpHVWdhWE1nYkdsalpXNXpaV1FnZFc1a1pYSWdkR2hsSUVKVFJDMXpkSGxzWlNCc2FXTmxibk5sSUdadmRXNWtJR2x1SUhSb1pWeHVJQ29nVEVsRFJVNVRSU0JtYVd4bElHbHVJSFJvWlNCeWIyOTBJR1JwY21WamRHOXllU0J2WmlCMGFHbHpJSE52ZFhKalpTQjBjbVZsTGlCQmJpQmhaR1JwZEdsdmJtRnNJR2R5WVc1MFhHNGdLaUJ2WmlCd1lYUmxiblFnY21sbmFIUnpJR05oYmlCaVpTQm1iM1Z1WkNCcGJpQjBhR1VnVUVGVVJVNVVVeUJtYVd4bElHbHVJSFJvWlNCellXMWxJR1JwY21WamRHOXllUzVjYmlBcVhHNGdLaUJBY0hKdmRtbGtaWE5OYjJSMWJHVWdSR2x6Y0dGMFkyaGxjbHh1SUNvZ1FIUjVjR1ZqYUdWamEzTmNiaUFxTDF4dVhHNTJZWElnYVc1MllYSnBZVzUwSUQwZ2NtVnhkV2x5WlNnbkxpOXBiblpoY21saGJuUW5LVHRjYmx4dWRtRnlJRjlzWVhOMFNVUWdQU0F4TzF4dWRtRnlJRjl3Y21WbWFYZ2dQU0FuU1VSZkp6dGNibHh1THlvcVhHNGdLaUJFYVhOd1lYUmphR1Z5SUdseklIVnpaV1FnZEc4Z1luSnZZV1JqWVhOMElIQmhlV3h2WVdSeklIUnZJSEpsWjJsemRHVnlaV1FnWTJGc2JHSmhZMnR6TGlCVWFHbHpJR2x6WEc0Z0tpQmthV1ptWlhKbGJuUWdabkp2YlNCblpXNWxjbWxqSUhCMVlpMXpkV0lnYzNsemRHVnRjeUJwYmlCMGQyOGdkMkY1Y3pwY2JpQXFYRzRnS2lBZ0lERXBJRU5oYkd4aVlXTnJjeUJoY21VZ2JtOTBJSE4xWW5OamNtbGlaV1FnZEc4Z2NHRnlkR2xqZFd4aGNpQmxkbVZ1ZEhNdUlFVjJaWEo1SUhCaGVXeHZZV1FnYVhOY2JpQXFJQ0FnSUNBZ1pHbHpjR0YwWTJobFpDQjBieUJsZG1WeWVTQnlaV2RwYzNSbGNtVmtJR05oYkd4aVlXTnJMbHh1SUNvZ0lDQXlLU0JEWVd4c1ltRmphM01nWTJGdUlHSmxJR1JsWm1WeWNtVmtJR2x1SUhkb2IyeGxJRzl5SUhCaGNuUWdkVzUwYVd3Z2IzUm9aWElnWTJGc2JHSmhZMnR6SUdoaGRtVmNiaUFxSUNBZ0lDQWdZbVZsYmlCbGVHVmpkWFJsWkM1Y2JpQXFYRzRnS2lCR2IzSWdaWGhoYlhCc1pTd2dZMjl1YzJsa1pYSWdkR2hwY3lCb2VYQnZkR2hsZEdsallXd2dabXhwWjJoMElHUmxjM1JwYm1GMGFXOXVJR1p2Y20wc0lIZG9hV05vWEc0Z0tpQnpaV3hsWTNSeklHRWdaR1ZtWVhWc2RDQmphWFI1SUhkb1pXNGdZU0JqYjNWdWRISjVJR2x6SUhObGJHVmpkR1ZrT2x4dUlDcGNiaUFxSUNBZ2RtRnlJR1pzYVdkb2RFUnBjM0JoZEdOb1pYSWdQU0J1WlhjZ1JHbHpjR0YwWTJobGNpZ3BPMXh1SUNwY2JpQXFJQ0FnTHk4Z1MyVmxjSE1nZEhKaFkyc2diMllnZDJocFkyZ2dZMjkxYm5SeWVTQnBjeUJ6Wld4bFkzUmxaRnh1SUNvZ0lDQjJZWElnUTI5MWJuUnllVk4wYjNKbElEMGdlMk52ZFc1MGNuazZJRzUxYkd4OU8xeHVJQ3BjYmlBcUlDQWdMeThnUzJWbGNITWdkSEpoWTJzZ2IyWWdkMmhwWTJnZ1kybDBlU0JwY3lCelpXeGxZM1JsWkZ4dUlDb2dJQ0IyWVhJZ1EybDBlVk4wYjNKbElEMGdlMk5wZEhrNklHNTFiR3g5TzF4dUlDcGNiaUFxSUNBZ0x5OGdTMlZsY0hNZ2RISmhZMnNnYjJZZ2RHaGxJR0poYzJVZ1pteHBaMmgwSUhCeWFXTmxJRzltSUhSb1pTQnpaV3hsWTNSbFpDQmphWFI1WEc0Z0tpQWdJSFpoY2lCR2JHbG5hSFJRY21salpWTjBiM0psSUQwZ2UzQnlhV05sT2lCdWRXeHNmVnh1SUNwY2JpQXFJRmRvWlc0Z1lTQjFjMlZ5SUdOb1lXNW5aWE1nZEdobElITmxiR1ZqZEdWa0lHTnBkSGtzSUhkbElHUnBjM0JoZEdOb0lIUm9aU0J3WVhsc2IyRmtPbHh1SUNwY2JpQXFJQ0FnWm14cFoyaDBSR2x6Y0dGMFkyaGxjaTVrYVhOd1lYUmphQ2g3WEc0Z0tpQWdJQ0FnWVdOMGFXOXVWSGx3WlRvZ0oyTnBkSGt0ZFhCa1lYUmxKeXhjYmlBcUlDQWdJQ0J6Wld4bFkzUmxaRU5wZEhrNklDZHdZWEpwY3lkY2JpQXFJQ0FnZlNrN1hHNGdLbHh1SUNvZ1ZHaHBjeUJ3WVhsc2IyRmtJR2x6SUdScFoyVnpkR1ZrSUdKNUlHQkRhWFI1VTNSdmNtVmdPbHh1SUNwY2JpQXFJQ0FnWm14cFoyaDBSR2x6Y0dGMFkyaGxjaTV5WldkcGMzUmxjaWhtZFc1amRHbHZiaWh3WVhsc2IyRmtLU2tnZTF4dUlDb2dJQ0FnSUdsbUlDaHdZWGxzYjJGa0xtRmpkR2x2YmxSNWNHVWdQVDA5SUNkamFYUjVMWFZ3WkdGMFpTY3BJSHRjYmlBcUlDQWdJQ0FnSUVOcGRIbFRkRzl5WlM1amFYUjVJRDBnY0dGNWJHOWhaQzV6Wld4bFkzUmxaRU5wZEhrN1hHNGdLaUFnSUNBZ2ZWeHVJQ29nSUNCOUtUdGNiaUFxWEc0Z0tpQlhhR1Z1SUhSb1pTQjFjMlZ5SUhObGJHVmpkSE1nWVNCamIzVnVkSEo1TENCM1pTQmthWE53WVhSamFDQjBhR1VnY0dGNWJHOWhaRHBjYmlBcVhHNGdLaUFnSUdac2FXZG9kRVJwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmdvZTF4dUlDb2dJQ0FnSUdGamRHbHZibFI1Y0dVNklDZGpiM1Z1ZEhKNUxYVndaR0YwWlNjc1hHNGdLaUFnSUNBZ2MyVnNaV04wWldSRGIzVnVkSEo1T2lBbllYVnpkSEpoYkdsaEoxeHVJQ29nSUNCOUtUdGNiaUFxWEc0Z0tpQlVhR2x6SUhCaGVXeHZZV1FnYVhNZ1pHbG5aWE4wWldRZ1lua2dZbTkwYUNCemRHOXlaWE02WEc0Z0tseHVJQ29nSUNBZ1EyOTFiblJ5ZVZOMGIzSmxMbVJwYzNCaGRHTm9WRzlyWlc0Z1BTQm1iR2xuYUhSRWFYTndZWFJqYUdWeUxuSmxaMmx6ZEdWeUtHWjFibU4wYVc5dUtIQmhlV3h2WVdRcElIdGNiaUFxSUNBZ0lDQnBaaUFvY0dGNWJHOWhaQzVoWTNScGIyNVVlWEJsSUQwOVBTQW5ZMjkxYm5SeWVTMTFjR1JoZEdVbktTQjdYRzRnS2lBZ0lDQWdJQ0JEYjNWdWRISjVVM1J2Y21VdVkyOTFiblJ5ZVNBOUlIQmhlV3h2WVdRdWMyVnNaV04wWldSRGIzVnVkSEo1TzF4dUlDb2dJQ0FnSUgxY2JpQXFJQ0FnZlNrN1hHNGdLbHh1SUNvZ1YyaGxiaUIwYUdVZ1kyRnNiR0poWTJzZ2RHOGdkWEJrWVhSbElHQkRiM1Z1ZEhKNVUzUnZjbVZnSUdseklISmxaMmx6ZEdWeVpXUXNJSGRsSUhOaGRtVWdZU0J5WldabGNtVnVZMlZjYmlBcUlIUnZJSFJvWlNCeVpYUjFjbTVsWkNCMGIydGxiaTRnVlhOcGJtY2dkR2hwY3lCMGIydGxiaUIzYVhSb0lHQjNZV2wwUm05eUtDbGdMQ0IzWlNCallXNGdaM1ZoY21GdWRHVmxYRzRnS2lCMGFHRjBJR0JEYjNWdWRISjVVM1J2Y21WZ0lHbHpJSFZ3WkdGMFpXUWdZbVZtYjNKbElIUm9aU0JqWVd4c1ltRmpheUIwYUdGMElIVndaR0YwWlhNZ1lFTnBkSGxUZEc5eVpXQmNiaUFxSUc1bFpXUnpJSFJ2SUhGMVpYSjVJR2wwY3lCa1lYUmhMbHh1SUNwY2JpQXFJQ0FnUTJsMGVWTjBiM0psTG1ScGMzQmhkR05vVkc5clpXNGdQU0JtYkdsbmFIUkVhWE53WVhSamFHVnlMbkpsWjJsemRHVnlLR1oxYm1OMGFXOXVLSEJoZVd4dllXUXBJSHRjYmlBcUlDQWdJQ0JwWmlBb2NHRjViRzloWkM1aFkzUnBiMjVVZVhCbElEMDlQU0FuWTI5MWJuUnllUzExY0dSaGRHVW5LU0I3WEc0Z0tpQWdJQ0FnSUNBdkx5QmdRMjkxYm5SeWVWTjBiM0psTG1OdmRXNTBjbmxnSUcxaGVTQnViM1FnWW1VZ2RYQmtZWFJsWkM1Y2JpQXFJQ0FnSUNBZ0lHWnNhV2RvZEVScGMzQmhkR05vWlhJdWQyRnBkRVp2Y2loYlEyOTFiblJ5ZVZOMGIzSmxMbVJwYzNCaGRHTm9WRzlyWlc1ZEtUdGNiaUFxSUNBZ0lDQWdJQzh2SUdCRGIzVnVkSEo1VTNSdmNtVXVZMjkxYm5SeWVXQWdhWE1nYm05M0lHZDFZWEpoYm5SbFpXUWdkRzhnWW1VZ2RYQmtZWFJsWkM1Y2JpQXFYRzRnS2lBZ0lDQWdJQ0F2THlCVFpXeGxZM1FnZEdobElHUmxabUYxYkhRZ1kybDBlU0JtYjNJZ2RHaGxJRzVsZHlCamIzVnVkSEo1WEc0Z0tpQWdJQ0FnSUNCRGFYUjVVM1J2Y21VdVkybDBlU0E5SUdkbGRFUmxabUYxYkhSRGFYUjVSbTl5UTI5MWJuUnllU2hEYjNWdWRISjVVM1J2Y21VdVkyOTFiblJ5ZVNrN1hHNGdLaUFnSUNBZ2ZWeHVJQ29nSUNCOUtUdGNiaUFxWEc0Z0tpQlVhR1VnZFhOaFoyVWdiMllnWUhkaGFYUkdiM0lvS1dBZ1kyRnVJR0psSUdOb1lXbHVaV1FzSUdadmNpQmxlR0Z0Y0d4bE9seHVJQ3BjYmlBcUlDQWdSbXhwWjJoMFVISnBZMlZUZEc5eVpTNWthWE53WVhSamFGUnZhMlZ1SUQxY2JpQXFJQ0FnSUNCbWJHbG5hSFJFYVhOd1lYUmphR1Z5TG5KbFoybHpkR1Z5S0daMWJtTjBhVzl1S0hCaGVXeHZZV1FwS1NCN1hHNGdLaUFnSUNBZ0lDQnpkMmwwWTJnZ0tIQmhlV3h2WVdRdVlXTjBhVzl1Vkhsd1pTa2dlMXh1SUNvZ0lDQWdJQ0FnSUNCallYTmxJQ2RqYjNWdWRISjVMWFZ3WkdGMFpTYzZYRzRnS2lBZ0lDQWdJQ0FnSUNBZ1pteHBaMmgwUkdsemNHRjBZMmhsY2k1M1lXbDBSbTl5S0Z0RGFYUjVVM1J2Y21VdVpHbHpjR0YwWTJoVWIydGxibDBwTzF4dUlDb2dJQ0FnSUNBZ0lDQWdJRVpzYVdkb2RGQnlhV05sVTNSdmNtVXVjSEpwWTJVZ1BWeHVJQ29nSUNBZ0lDQWdJQ0FnSUNBZ1oyVjBSbXhwWjJoMFVISnBZMlZUZEc5eVpTaERiM1Z1ZEhKNVUzUnZjbVV1WTI5MWJuUnllU3dnUTJsMGVWTjBiM0psTG1OcGRIa3BPMXh1SUNvZ0lDQWdJQ0FnSUNBZ0lHSnlaV0ZyTzF4dUlDcGNiaUFxSUNBZ0lDQWdJQ0FnWTJGelpTQW5ZMmwwZVMxMWNHUmhkR1VuT2x4dUlDb2dJQ0FnSUNBZ0lDQWdJRVpzYVdkb2RGQnlhV05sVTNSdmNtVXVjSEpwWTJVZ1BWeHVJQ29nSUNBZ0lDQWdJQ0FnSUNBZ1JteHBaMmgwVUhKcFkyVlRkRzl5WlNoRGIzVnVkSEo1VTNSdmNtVXVZMjkxYm5SeWVTd2dRMmwwZVZOMGIzSmxMbU5wZEhrcE8xeHVJQ29nSUNBZ0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNvZ0lDQWdJSDFjYmlBcUlDQWdmU2s3WEc0Z0tseHVJQ29nVkdobElHQmpiM1Z1ZEhKNUxYVndaR0YwWldBZ2NHRjViRzloWkNCM2FXeHNJR0psSUdkMVlYSmhiblJsWldRZ2RHOGdhVzUyYjJ0bElIUm9aU0J6ZEc5eVpYTW5YRzRnS2lCeVpXZHBjM1JsY21Wa0lHTmhiR3hpWVdOcmN5QnBiaUJ2Y21SbGNqb2dZRU52ZFc1MGNubFRkRzl5WldBc0lHQkRhWFI1VTNSdmNtVmdMQ0IwYUdWdVhHNGdLaUJnUm14cFoyaDBVSEpwWTJWVGRHOXlaV0F1WEc0Z0tpOWNibHh1SUNCbWRXNWpkR2x2YmlCRWFYTndZWFJqYUdWeUtDa2dlMXdpZFhObElITjBjbWxqZEZ3aU8xeHVJQ0FnSUhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmWTJGc2JHSmhZMnR6SUQwZ2UzMDdYRzRnSUNBZ2RHaHBjeTRrUkdsemNHRjBZMmhsY2w5cGMxQmxibVJwYm1jZ1BTQjdmVHRjYmlBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgybHpTR0Z1Wkd4bFpDQTlJSHQ5TzF4dUlDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhWE5FYVhOd1lYUmphR2x1WnlBOUlHWmhiSE5sTzF4dUlDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZjR1Z1WkdsdVoxQmhlV3h2WVdRZ1BTQnVkV3hzTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGSmxaMmx6ZEdWeWN5QmhJR05oYkd4aVlXTnJJSFJ2SUdKbElHbHVkbTlyWldRZ2QybDBhQ0JsZG1WeWVTQmthWE53WVhSamFHVmtJSEJoZVd4dllXUXVJRkpsZEhWeWJuTmNiaUFnSUNvZ1lTQjBiMnRsYmlCMGFHRjBJR05oYmlCaVpTQjFjMlZrSUhkcGRHZ2dZSGRoYVhSR2IzSW9LV0F1WEc0Z0lDQXFYRzRnSUNBcUlFQndZWEpoYlNCN1puVnVZM1JwYjI1OUlHTmhiR3hpWVdOclhHNGdJQ0FxSUVCeVpYUjFjbTRnZTNOMGNtbHVaMzFjYmlBZ0lDb3ZYRzRnSUVScGMzQmhkR05vWlhJdWNISnZkRzkwZVhCbExuSmxaMmx6ZEdWeVBXWjFibU4wYVc5dUtHTmhiR3hpWVdOcktTQjdYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNGdJQ0FnZG1GeUlHbGtJRDBnWDNCeVpXWnBlQ0FySUY5c1lYTjBTVVFyS3p0Y2JpQWdJQ0IwYUdsekxpUkVhWE53WVhSamFHVnlYMk5oYkd4aVlXTnJjMXRwWkYwZ1BTQmpZV3hzWW1GamF6dGNiaUFnSUNCeVpYUjFjbTRnYVdRN1hHNGdJSDA3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRkpsYlc5MlpYTWdZU0JqWVd4c1ltRmpheUJpWVhObFpDQnZiaUJwZEhNZ2RHOXJaVzR1WEc0Z0lDQXFYRzRnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCcFpGeHVJQ0FnS2k5Y2JpQWdSR2x6Y0dGMFkyaGxjaTV3Y205MGIzUjVjR1V1ZFc1eVpXZHBjM1JsY2oxbWRXNWpkR2x2YmlocFpDa2dlMXdpZFhObElITjBjbWxqZEZ3aU8xeHVJQ0FnSUdsdWRtRnlhV0Z1ZENoY2JpQWdJQ0FnSUhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmWTJGc2JHSmhZMnR6VzJsa1hTeGNiaUFnSUNBZ0lDZEVhWE53WVhSamFHVnlMblZ1Y21WbmFYTjBaWElvTGk0dUtUb2dZQ1Z6WUNCa2IyVnpJRzV2ZENCdFlYQWdkRzhnWVNCeVpXZHBjM1JsY21Wa0lHTmhiR3hpWVdOckxpY3NYRzRnSUNBZ0lDQnBaRnh1SUNBZ0lDazdYRzRnSUNBZ1pHVnNaWFJsSUhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmWTJGc2JHSmhZMnR6VzJsa1hUdGNiaUFnZlR0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nVjJGcGRITWdabTl5SUhSb1pTQmpZV3hzWW1GamEzTWdjM0JsWTJsbWFXVmtJSFJ2SUdKbElHbHVkbTlyWldRZ1ltVm1iM0psSUdOdmJuUnBiblZwYm1jZ1pYaGxZM1YwYVc5dVhHNGdJQ0FxSUc5bUlIUm9aU0JqZFhKeVpXNTBJR05oYkd4aVlXTnJMaUJVYUdseklHMWxkR2h2WkNCemFHOTFiR1FnYjI1c2VTQmlaU0IxYzJWa0lHSjVJR0VnWTJGc2JHSmhZMnNnYVc1Y2JpQWdJQ29nY21WemNHOXVjMlVnZEc4Z1lTQmthWE53WVhSamFHVmtJSEJoZVd4dllXUXVYRzRnSUNBcVhHNGdJQ0FxSUVCd1lYSmhiU0I3WVhKeVlYazhjM1J5YVc1blBuMGdhV1J6WEc0Z0lDQXFMMXh1SUNCRWFYTndZWFJqYUdWeUxuQnliM1J2ZEhsd1pTNTNZV2wwUm05eVBXWjFibU4wYVc5dUtHbGtjeWtnZTF3aWRYTmxJSE4wY21samRGd2lPMXh1SUNBZ0lHbHVkbUZ5YVdGdWRDaGNiaUFnSUNBZ0lIUm9hWE11SkVScGMzQmhkR05vWlhKZmFYTkVhWE53WVhSamFHbHVaeXhjYmlBZ0lDQWdJQ2RFYVhOd1lYUmphR1Z5TG5kaGFYUkdiM0lvTGk0dUtUb2dUWFZ6ZENCaVpTQnBiblp2YTJWa0lIZG9hV3hsSUdScGMzQmhkR05vYVc1bkxpZGNiaUFnSUNBcE8xeHVJQ0FnSUdadmNpQW9kbUZ5SUdscElEMGdNRHNnYVdrZ1BDQnBaSE11YkdWdVozUm9PeUJwYVNzcktTQjdYRzRnSUNBZ0lDQjJZWElnYVdRZ1BTQnBaSE5iYVdsZE8xeHVJQ0FnSUNBZ2FXWWdLSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhWE5RWlc1a2FXNW5XMmxrWFNrZ2UxeHVJQ0FnSUNBZ0lDQnBiblpoY21saGJuUW9YRzRnSUNBZ0lDQWdJQ0FnZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDlwYzBoaGJtUnNaV1JiYVdSZExGeHVJQ0FnSUNBZ0lDQWdJQ2RFYVhOd1lYUmphR1Z5TG5kaGFYUkdiM0lvTGk0dUtUb2dRMmx5WTNWc1lYSWdaR1Z3Wlc1a1pXNWplU0JrWlhSbFkzUmxaQ0IzYUdsc1pTQW5JQ3RjYmlBZ0lDQWdJQ0FnSUNBbmQyRnBkR2x1WnlCbWIzSWdZQ1Z6WUM0bkxGeHVJQ0FnSUNBZ0lDQWdJR2xrWEc0Z0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lHTnZiblJwYm5WbE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2FXNTJZWEpwWVc1MEtGeHVJQ0FnSUNBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgyTmhiR3hpWVdOcmMxdHBaRjBzWEc0Z0lDQWdJQ0FnSUNkRWFYTndZWFJqYUdWeUxuZGhhWFJHYjNJb0xpNHVLVG9nWUNWellDQmtiMlZ6SUc1dmRDQnRZWEFnZEc4Z1lTQnlaV2RwYzNSbGNtVmtJR05oYkd4aVlXTnJMaWNzWEc0Z0lDQWdJQ0FnSUdsa1hHNGdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ2RHaHBjeTRrUkdsemNHRjBZMmhsY2w5cGJuWnZhMlZEWVd4c1ltRmpheWhwWkNrN1hHNGdJQ0FnZlZ4dUlDQjlPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkVhWE53WVhSamFHVnpJR0VnY0dGNWJHOWhaQ0IwYnlCaGJHd2djbVZuYVhOMFpYSmxaQ0JqWVd4c1ltRmphM011WEc0Z0lDQXFYRzRnSUNBcUlFQndZWEpoYlNCN2IySnFaV04wZlNCd1lYbHNiMkZrWEc0Z0lDQXFMMXh1SUNCRWFYTndZWFJqYUdWeUxuQnliM1J2ZEhsd1pTNWthWE53WVhSamFEMW1kVzVqZEdsdmJpaHdZWGxzYjJGa0tTQjdYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNGdJQ0FnYVc1MllYSnBZVzUwS0Z4dUlDQWdJQ0FnSVhSb2FYTXVKRVJwYzNCaGRHTm9aWEpmYVhORWFYTndZWFJqYUdsdVp5eGNiaUFnSUNBZ0lDZEVhWE53WVhSamFDNWthWE53WVhSamFDZ3VMaTRwT2lCRFlXNXViM1FnWkdsemNHRjBZMmdnYVc0Z2RHaGxJRzFwWkdSc1pTQnZaaUJoSUdScGMzQmhkR05vTGlkY2JpQWdJQ0FwTzF4dUlDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZjM1JoY25SRWFYTndZWFJqYUdsdVp5aHdZWGxzYjJGa0tUdGNiaUFnSUNCMGNua2dlMXh1SUNBZ0lDQWdabTl5SUNoMllYSWdhV1FnYVc0Z2RHaHBjeTRrUkdsemNHRjBZMmhsY2w5allXeHNZbUZqYTNNcElIdGNiaUFnSUNBZ0lDQWdhV1lnS0hSb2FYTXVKRVJwYzNCaGRHTm9aWEpmYVhOUVpXNWthVzVuVzJsa1hTa2dlMXh1SUNBZ0lDQWdJQ0FnSUdOdmJuUnBiblZsTzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lIUm9hWE11SkVScGMzQmhkR05vWlhKZmFXNTJiMnRsUTJGc2JHSmhZMnNvYVdRcE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgwZ1ptbHVZV3hzZVNCN1hHNGdJQ0FnSUNCMGFHbHpMaVJFYVhOd1lYUmphR1Z5WDNOMGIzQkVhWE53WVhSamFHbHVaeWdwTzF4dUlDQWdJSDFjYmlBZ2ZUdGNibHh1SUNBdktpcGNiaUFnSUNvZ1NYTWdkR2hwY3lCRWFYTndZWFJqYUdWeUlHTjFjbkpsYm5Sc2VTQmthWE53WVhSamFHbHVaeTVjYmlBZ0lDcGNiaUFnSUNvZ1FISmxkSFZ5YmlCN1ltOXZiR1ZoYm4xY2JpQWdJQ292WEc0Z0lFUnBjM0JoZEdOb1pYSXVjSEp2ZEc5MGVYQmxMbWx6UkdsemNHRjBZMmhwYm1jOVpuVnVZM1JwYjI0b0tTQjdYQ0oxYzJVZ2MzUnlhV04wWENJN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhWE5FYVhOd1lYUmphR2x1Wnp0Y2JpQWdmVHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMkZzYkNCMGFHVWdZMkZzYkdKaFkyc2djM1J2Y21Wa0lIZHBkR2dnZEdobElHZHBkbVZ1SUdsa0xpQkJiSE52SUdSdklITnZiV1VnYVc1MFpYSnVZV3hjYmlBZ0lDb2dZbTl2YTJ0bFpYQnBibWN1WEc0Z0lDQXFYRzRnSUNBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCcFpGeHVJQ0FnS2lCQWFXNTBaWEp1WVd4Y2JpQWdJQ292WEc0Z0lFUnBjM0JoZEdOb1pYSXVjSEp2ZEc5MGVYQmxMaVJFYVhOd1lYUmphR1Z5WDJsdWRtOXJaVU5oYkd4aVlXTnJQV1oxYm1OMGFXOXVLR2xrS1NCN1hDSjFjMlVnYzNSeWFXTjBYQ0k3WEc0Z0lDQWdkR2hwY3k0a1JHbHpjR0YwWTJobGNsOXBjMUJsYm1ScGJtZGJhV1JkSUQwZ2RISjFaVHRjYmlBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgyTmhiR3hpWVdOcmMxdHBaRjBvZEdocGN5NGtSR2x6Y0dGMFkyaGxjbDl3Wlc1a2FXNW5VR0Y1Ykc5aFpDazdYRzRnSUNBZ2RHaHBjeTRrUkdsemNHRjBZMmhsY2w5cGMwaGhibVJzWldSYmFXUmRJRDBnZEhKMVpUdGNiaUFnZlR0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nVTJWMElIVndJR0p2YjJ0clpXVndhVzVuSUc1bFpXUmxaQ0IzYUdWdUlHUnBjM0JoZEdOb2FXNW5MbHh1SUNBZ0tseHVJQ0FnS2lCQWNHRnlZVzBnZTI5aWFtVmpkSDBnY0dGNWJHOWhaRnh1SUNBZ0tpQkFhVzUwWlhKdVlXeGNiaUFnSUNvdlhHNGdJRVJwYzNCaGRHTm9aWEl1Y0hKdmRHOTBlWEJsTGlSRWFYTndZWFJqYUdWeVgzTjBZWEowUkdsemNHRjBZMmhwYm1jOVpuVnVZM1JwYjI0b2NHRjViRzloWkNrZ2Uxd2lkWE5sSUhOMGNtbGpkRndpTzF4dUlDQWdJR1p2Y2lBb2RtRnlJR2xrSUdsdUlIUm9hWE11SkVScGMzQmhkR05vWlhKZlkyRnNiR0poWTJ0ektTQjdYRzRnSUNBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgybHpVR1Z1WkdsdVoxdHBaRjBnUFNCbVlXeHpaVHRjYmlBZ0lDQWdJSFJvYVhNdUpFUnBjM0JoZEdOb1pYSmZhWE5JWVc1a2JHVmtXMmxrWFNBOUlHWmhiSE5sTzF4dUlDQWdJSDFjYmlBZ0lDQjBhR2x6TGlSRWFYTndZWFJqYUdWeVgzQmxibVJwYm1kUVlYbHNiMkZrSUQwZ2NHRjViRzloWkR0Y2JpQWdJQ0IwYUdsekxpUkVhWE53WVhSamFHVnlYMmx6UkdsemNHRjBZMmhwYm1jZ1BTQjBjblZsTzF4dUlDQjlPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRiR1ZoY2lCaWIyOXJhMlZsY0dsdVp5QjFjMlZrSUdadmNpQmthWE53WVhSamFHbHVaeTVjYmlBZ0lDcGNiaUFnSUNvZ1FHbHVkR1Z5Ym1Gc1hHNGdJQ0FxTDF4dUlDQkVhWE53WVhSamFHVnlMbkJ5YjNSdmRIbHdaUzRrUkdsemNHRjBZMmhsY2w5emRHOXdSR2x6Y0dGMFkyaHBibWM5Wm5WdVkzUnBiMjRvS1NCN1hDSjFjMlVnYzNSeWFXTjBYQ0k3WEc0Z0lDQWdkR2hwY3k0a1JHbHpjR0YwWTJobGNsOXdaVzVrYVc1blVHRjViRzloWkNBOUlHNTFiR3c3WEc0Z0lDQWdkR2hwY3k0a1JHbHpjR0YwWTJobGNsOXBjMFJwYzNCaGRHTm9hVzVuSUQwZ1ptRnNjMlU3WEc0Z0lIMDdYRzVjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCRWFYTndZWFJqYUdWeU8xeHVJbDE5IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgaW52YXJpYW50XG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbnZhciBpbnZhcmlhbnQgPSBmdW5jdGlvbihjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAoZmFsc2UpIHtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YXJpYW50IHJlcXVpcmVzIGFuIGVycm9yIG1lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHZhciBlcnJvcjtcbiAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnTWluaWZpZWQgZXhjZXB0aW9uIG9jY3VycmVkOyB1c2UgdGhlIG5vbi1taW5pZmllZCBkZXYgZW52aXJvbm1lbnQgJyArXG4gICAgICAgICdmb3IgdGhlIGZ1bGwgZXJyb3IgbWVzc2FnZSBhbmQgYWRkaXRpb25hbCBoZWxwZnVsIHdhcm5pbmdzLidcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBhcmdzID0gW2EsIGIsIGMsIGQsIGUsIGZdO1xuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAnSW52YXJpYW50IFZpb2xhdGlvbjogJyArXG4gICAgICAgIGZvcm1hdC5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107IH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBpbnZhcmlhbnQ7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSm1hV3hsSWpvaWRISmhibk5tYjNKdFpXUXVhbk1pTENKemIzVnlZMlZ6SWpwYklpOVZjMlZ5Y3k5b1luVnljbTkzY3k5a1pYWXZhR1Z5YjJ0MUwzSmxZV04wTFdac2RYZ3RjM1JoY25SbGNpOXdkV0pzYVdNdmFtRjJZWE5qY21sd2RITXZkbVZ1Wkc5eUwyWnNkWGd2YVc1MllYSnBZVzUwTG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdPMEZCUlVFc1IwRkJSenM3UVVGRlNDeFpRVUZaTEVOQlFVTTdPMEZCUldJN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVRzN1FVRkZRU3hIUVVGSE96dEJRVVZJTEVsQlFVa3NVMEZCVXl4SFFVRkhMRk5CUVZNc1UwRkJVeXhGUVVGRkxFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlR0RlFVTTFSQ3hKUVVGSkxFdEJRVXNzUlVGQlJUdEpRVU5VTEVsQlFVa3NUVUZCVFN4TFFVRkxMRk5CUVZNc1JVRkJSVHROUVVONFFpeE5RVUZOTEVsQlFVa3NTMEZCU3l4RFFVRkRMRGhEUVVFNFF5eERRVUZETEVOQlFVTTdTMEZEYWtVN1FVRkRUQ3hIUVVGSE96dEZRVVZFTEVsQlFVa3NRMEZCUXl4VFFVRlRMRVZCUVVVN1NVRkRaQ3hKUVVGSkxFdEJRVXNzUTBGQlF6dEpRVU5XTEVsQlFVa3NUVUZCVFN4TFFVRkxMRk5CUVZNc1JVRkJSVHROUVVONFFpeExRVUZMTEVkQlFVY3NTVUZCU1N4TFFVRkxPMUZCUTJZc2IwVkJRVzlGTzFGQlEzQkZMRFpFUVVFMlJEdFBRVU01UkN4RFFVRkRPMHRCUTBnc1RVRkJUVHROUVVOTUxFbEJRVWtzU1VGQlNTeEhRVUZITEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenROUVVNNVFpeEpRVUZKTEZGQlFWRXNSMEZCUnl4RFFVRkRMRU5CUVVNN1RVRkRha0lzUzBGQlN5eEhRVUZITEVsQlFVa3NTMEZCU3p0UlFVTm1MSFZDUVVGMVFqdFJRVU4yUWl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUlVGQlJTeFhRVUZYTEVWQlFVVXNUMEZCVHl4SlFVRkpMRU5CUVVNc1VVRkJVU3hGUVVGRkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTTdUMEZETDBRc1EwRkJRenRCUVVOU0xFdEJRVXM3TzBsQlJVUXNTMEZCU3l4RFFVRkRMRmRCUVZjc1IwRkJSeXhEUVVGRExFTkJRVU03U1VGRGRFSXNUVUZCVFN4TFFVRkxMRU5CUVVNN1IwRkRZanRCUVVOSUxFTkJRVU1zUTBGQlF6czdRVUZGUml4TlFVRk5MRU5CUVVNc1QwRkJUeXhIUVVGSExGTkJRVk1zUTBGQlF5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaThxS2x4dUlDb2dRMjl3ZVhKcFoyaDBJQ2hqS1NBeU1ERTBMQ0JHWVdObFltOXZheXdnU1c1akxseHVJQ29nUVd4c0lISnBaMmgwY3lCeVpYTmxjblpsWkM1Y2JpQXFYRzRnS2lCVWFHbHpJSE52ZFhKalpTQmpiMlJsSUdseklHeHBZMlZ1YzJWa0lIVnVaR1Z5SUhSb1pTQkNVMFF0YzNSNWJHVWdiR2xqWlc1elpTQm1iM1Z1WkNCcGJpQjBhR1ZjYmlBcUlFeEpRMFZPVTBVZ1ptbHNaU0JwYmlCMGFHVWdjbTl2ZENCa2FYSmxZM1J2Y25rZ2IyWWdkR2hwY3lCemIzVnlZMlVnZEhKbFpTNGdRVzRnWVdSa2FYUnBiMjVoYkNCbmNtRnVkRnh1SUNvZ2IyWWdjR0YwWlc1MElISnBaMmgwY3lCallXNGdZbVVnWm05MWJtUWdhVzRnZEdobElGQkJWRVZPVkZNZ1ptbHNaU0JwYmlCMGFHVWdjMkZ0WlNCa2FYSmxZM1J2Y25rdVhHNGdLbHh1SUNvZ1FIQnliM1pwWkdWelRXOWtkV3hsSUdsdWRtRnlhV0Z1ZEZ4dUlDb3ZYRzVjYmx3aWRYTmxJSE4wY21samRGd2lPMXh1WEc0dktpcGNiaUFxSUZWelpTQnBiblpoY21saGJuUW9LU0IwYnlCaGMzTmxjblFnYzNSaGRHVWdkMmhwWTJnZ2VXOTFjaUJ3Y205bmNtRnRJR0Z6YzNWdFpYTWdkRzhnWW1VZ2RISjFaUzVjYmlBcVhHNGdLaUJRY205MmFXUmxJSE53Y21sdWRHWXRjM1I1YkdVZ1ptOXliV0YwSUNodmJteDVJQ1Z6SUdseklITjFjSEJ2Y25SbFpDa2dZVzVrSUdGeVozVnRaVzUwYzF4dUlDb2dkRzhnY0hKdmRtbGtaU0JwYm1admNtMWhkR2x2YmlCaFltOTFkQ0IzYUdGMElHSnliMnRsSUdGdVpDQjNhR0YwSUhsdmRTQjNaWEpsWEc0Z0tpQmxlSEJsWTNScGJtY3VYRzRnS2x4dUlDb2dWR2hsSUdsdWRtRnlhV0Z1ZENCdFpYTnpZV2RsSUhkcGJHd2dZbVVnYzNSeWFYQndaV1FnYVc0Z2NISnZaSFZqZEdsdmJpd2dZblYwSUhSb1pTQnBiblpoY21saGJuUmNiaUFxSUhkcGJHd2djbVZ0WVdsdUlIUnZJR1Z1YzNWeVpTQnNiMmRwWXlCa2IyVnpJRzV2ZENCa2FXWm1aWElnYVc0Z2NISnZaSFZqZEdsdmJpNWNiaUFxTDF4dVhHNTJZWElnYVc1MllYSnBZVzUwSUQwZ1puVnVZM1JwYjI0b1kyOXVaR2wwYVc5dUxDQm1iM0p0WVhRc0lHRXNJR0lzSUdNc0lHUXNJR1VzSUdZcElIdGNiaUFnYVdZZ0tHWmhiSE5sS1NCN1hHNGdJQ0FnYVdZZ0tHWnZjbTFoZENBOVBUMGdkVzVrWldacGJtVmtLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMmx1ZG1GeWFXRnVkQ0J5WlhGMWFYSmxjeUJoYmlCbGNuSnZjaUJ0WlhOellXZGxJR0Z5WjNWdFpXNTBKeWs3WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnYVdZZ0tDRmpiMjVrYVhScGIyNHBJSHRjYmlBZ0lDQjJZWElnWlhKeWIzSTdYRzRnSUNBZ2FXWWdLR1p2Y20xaGRDQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNCbGNuSnZjaUE5SUc1bGR5QkZjbkp2Y2loY2JpQWdJQ0FnSUNBZ0owMXBibWxtYVdWa0lHVjRZMlZ3ZEdsdmJpQnZZMk4xY25KbFpEc2dkWE5sSUhSb1pTQnViMjR0YldsdWFXWnBaV1FnWkdWMklHVnVkbWx5YjI1dFpXNTBJQ2NnSzF4dUlDQWdJQ0FnSUNBblptOXlJSFJvWlNCbWRXeHNJR1Z5Y205eUlHMWxjM05oWjJVZ1lXNWtJR0ZrWkdsMGFXOXVZV3dnYUdWc2NHWjFiQ0IzWVhKdWFXNW5jeTRuWEc0Z0lDQWdJQ0FwTzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQjJZWElnWVhKbmN5QTlJRnRoTENCaUxDQmpMQ0JrTENCbExDQm1YVHRjYmlBZ0lDQWdJSFpoY2lCaGNtZEpibVJsZUNBOUlEQTdYRzRnSUNBZ0lDQmxjbkp2Y2lBOUlHNWxkeUJGY25KdmNpaGNiaUFnSUNBZ0lDQWdKMGx1ZG1GeWFXRnVkQ0JXYVc5c1lYUnBiMjQ2SUNjZ0sxeHVJQ0FnSUNBZ0lDQm1iM0p0WVhRdWNtVndiR0ZqWlNndkpYTXZaeXdnWm5WdVkzUnBiMjRvS1NCN0lISmxkSFZ5YmlCaGNtZHpXMkZ5WjBsdVpHVjRLeXRkT3lCOUtWeHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbGNuSnZjaTVtY21GdFpYTlViMUJ2Y0NBOUlERTdJQzh2SUhkbElHUnZiaWQwSUdOaGNtVWdZV0p2ZFhRZ2FXNTJZWEpwWVc1MEozTWdiM2R1SUdaeVlXMWxYRzRnSUNBZ2RHaHliM2NnWlhKeWIzSTdYRzRnSUgxY2JuMDdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnYVc1MllYSnBZVzUwTzF4dUlsMTkiXX0=
