'use strict';

var kActions = require('../constants/actions');
var kStates = require('../constants/states');

var ajax = require('../common/ajax');
var meteredGET = require('../common/metered-request').get;

var BaseAction = require('./base');

// used for generating client-side ids for new entries
var _cid = 0;

class ItemActions extends BaseAction {

  constructor () {
    super();
  }

  getAll() {
    meteredGET(
      '/api/items',
      () => this.dispatchServerAction(kActions.ITEM_GETALL, kStates.LOADING),
      data => this.dispatchServerAction(kActions.ITEM_GETALL, kStates.SYNCED, data),
      err => this.dispatchServerAction(kActions.ITEM_GETALL, kStates.ERRORED, err)
    );
  }

  requestCreateEntry (first, last) {

    console.debug(`${this.getClassname()}:requestCreateEntry`);

    var cid = 'c' + (_cid += 1),
        payload = { cid: cid, first: first, last: last };

    ajax({
      url: "/api/items",
      type: "POST",
      data: payload,
      accepts: {
        'json': "application/json",
        'text': 'text/plain'
      }
    })
    .then(function (data) {
      this.dispatchServerAction(kActions.ITEM_POST, kStates.SYNCED, data);
    }.bind(this))
    .catch(function (err) {
      this.dispatchServerAction(kActions.ITEM_POST, kStates.ERRORED, err);
    }.bind(this));

    this.dispatchServerAction(kActions.ITEM_POST, kStates.NEW, payload);
  }

}

module.exports = new ItemActions();
