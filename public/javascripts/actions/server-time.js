'use strict';

var kActions = require('../constants/actions');
var kStates = require('../constants/states');

var meteredGET = require('../common/metered-request').get;

var BaseAction = require('./base');

class ItemActions extends BaseAction {

  constructor () {
    super();
  }

  getTime() {
    meteredGET(
      '/api/servertime',
      () => this.dispatchServerAction(kActions.SERVERTIME_GET, kStates.LOADING),
      data => this.dispatchServerAction(kActions.SERVERTIME_GET, kStates.SYNCED, data),
      err => this.dispatchServerAction(kActions.SERVERTIME_GET, kStates.ERRORED, err)
    );
  }

}

module.exports = new ItemActions();
