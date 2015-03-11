'use strict';

var _ = require('lodash');

var BaseStore = require('./base');

var kActions = require('../constants/actions'),
    kStates = require('../constants/states'),
    ServerActions = require('../actions/server-time');

var _actions = _.zipObject([
  [kActions.SERVERTIME_GET, 'handleGet']
]);

class EntryStore extends BaseStore {

  constructor(dispatcher) {
    super(dispatcher);
    this._serverTime = undefined;
  }

  getActions() {
    return _actions;
  }

  _load() {
    ServerActions.getAll();
    return undefined;
  }

  _getTime() {
    return this._serverTime !== undefined ? this._serverTime : this._load();
  }

  getServerTime() {
    return this._getTime();
  }


  /*
  *
  * Action Handlers
  *
  */

  handleSetAll(payload) {
    console.debug(`${this.getStoreName()}:handleSetAll; state=${payload.state}`);

    switch(payload.state) {
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

}

module.exports = EntryStore;
