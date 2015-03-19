'use strict';

var keyMirror = require('react/lib/keyMirror');

/**
 * Action type constants. Should follow the format:
 * <OBJECT ALIAS>_<VERB>
 *
 * For example, an action for fetching a specific "Todo" object:
 * TODO_GET
 *
 * If you're using the CRUD Action and Store base classes the verbs must be the following:
 * GETALL                   <- Retrieving a list of objects. (e.g. GET /items)
 * GETONE                   <- Get a single object (e.g. GET /items/:id)
 * POST                     <- Creating an object. (e.g. POST /items)
 * PUT                      <- Update an existing object. (e.g. PUT /items/:id)
 * DELETE                   <- Deleting an object. (e.g. DELETE /items/:id)
 *
 * Some actions types may not have a receiver, which is OK. The result of POST, PUT, and DELETE actions
 * may enter back into the system through subscriptions rather than in response to API requests.
 */

module.exports = keyMirror({

  // item actions
  TODO_GETALL: null,
  TODO_GETONE: null,
  TODO_POST: null,
  TODO_PUT: null,
  TODO_DELETE: null,

  // servertime actions
  SERVERTIME_GET: null,
  SERVERTIME_PUT: null,

  // overlay actions
  OVERLAY_PUSH: null,
  OVERLAY_POP: null,

});
