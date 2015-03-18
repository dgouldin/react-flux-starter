'use strict';

var _ = require('lodash');

var CRUDBase = require('./crud-base');

var TodoActions = require('../actions/todos');

/**
 * Basic CRUD store for a RESTful JSON "resource".
 */
class TodosStore extends CRUDBase {

  // specify the action instance and action object identifier (and dispatcher)
  constructor(dispatcher) {
    super(dispatcher, TodoActions, 'TODO');
  }
}

module.exports = TodosStore;
