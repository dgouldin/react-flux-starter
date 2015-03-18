'use strict';

var React = require('react/addons');

var OverlayMixin = require('../../mixins/overlay');


module.exports = React.createClass({

  mixins: [OverlayMixin, React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      text: this.props.text || ''
    };
  },

  render: function () {
    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
              <h4 className="modal-title">Add New Todo</h4>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="text">Text</label>
                  <input ref="text" type="text" className="form-control" id="text" placeholder="Text" valueLink={this.linkState('text')} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" onClick={this._handleCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={this._handleAdd}>OK</button>
            </div>
          </div>
        </div>
      </div>
    );
  },

  // uses Bootstrap modal's
  handleModalShown: function() {
    this.refs.text.getDOMNode().focus();
  },

  handleModalHidden: function() {
    if (this.confirmed) {
      if (this.props.okCallback) {
        this.props.okCallback(this.state.text);
      }
    }
    else {
      if (this.props.cancelCallback) {
        this.props.cancelCallback();
      }
    }
  },

  _handleAdd: function () {
    this.confirmed = true;
    this.hideModal();
  },

  _handleCancel: function () {
    this.hideModal();
  }

});
