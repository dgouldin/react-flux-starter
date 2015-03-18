'use strict';

var Dispatcher = require('../dispatcher');

var TodosStore = require('./todos'),
    OverlaysStore = require('./overlays');

exports.initialize = function () {

  exports.TodosStore = new TodosStore(Dispatcher);

  exports.OverlaysStore = new OverlaysStore(Dispatcher);

  return this;
};
