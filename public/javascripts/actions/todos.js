'use strict';

var CRUDBase = require('./crud-base');

/**
 * Basic CRUD actions for a RESTful JSON "resource".  Overriding "post" and "put"
 * to create JSON payload that the endpoint expects.
 */

class TodoActions extends CRUDBase {

  // specify the baseURL and action object identifier for dispatches
  constructor() {
    super('/api/todos', 'TODO');
  }

  // define create json data appropriate for resource
  post (text) {
    var data = {
      text: text
    };
    super.post(data);
  }

  // define update json data appropriate for resource
  put (id, text, done) {
    var data = {
      id: id,
      text: text,
      done: done
    };
    super.put(id, data);
  }

}

module.exports = new TodoActions();
