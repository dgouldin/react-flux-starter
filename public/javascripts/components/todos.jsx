'use strict';

var _ = require('lodash');

var React = require('react/addons');

var Stores = require('../stores'),
    storeChangeMixin = require('../mixins/store-change');

var kStates = require('../constants/states');

var TodoActions = require('../actions/todos');

var Overlays = require('../actions/overlays');

/**
 * Simple example of a basic CRUD interface.  List todos and supports
 * create, edit, delete of todos in list.
 *
 * Uses the CRUD based Todo Store and Actions.  Listens to changes to the
 * Todo store.  Uses Reacts PureRenderMixin to only render when state or
 * props have changed (would work even better if using Immutable JS)
 */

module.exports = React.createClass({

  mixins: [storeChangeMixin(Stores.TodosStore), React.addons.PureRenderMixin],

  getInitialState: function () {
    return {
      todos: Stores.TodosStore.getAll(),
      selection: null
    };
  },

  storeChange: function () {
    this.setState({todos: Stores.TodosStore.getAll()});
  },

  render: function () {
    
    var content;

    if (!this.state.todos) {
      content = <div>Loading...</div>;
    }
    else {
      content = (
        <table className="table">
          <thead>
            <tr><th>Text</th><th>Id</th></tr>
           </thead>
           <tbody>
             {_.map(this.state.todos, todo =>
               <tr key={todo.data.id}
                   className={this.state.selection === todo.data.id ? 'active' : ''}
                   style={{
                     color: _.contains([kStates.NEW, kStates.SAVING, kStates.DELETING], todo.state) ? '#ccc' : 'inherit',
                     textDecoration: todo.state === kStates.DELETING ? 'line-through' : 'none'}}
                   onClick={this._onClick.bind(this, todo.data.id)} >
                 <td>{todo.data.text}</td>
                 <td>{todo.data.id}</td>
               </tr>
             )}
          </tbody>
        </table>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-12">
            <header>
              <h3 style={{display:'inline-block',marginTop:'0'}}>Todos</h3>
              <button type="button" className="btn btn-default pull-right" disabled={!this.state.selection} onClick={this._onDelete}>
                <span className="glyphicon glyphicon-trash"></span>
              </button>
              <button type="button" className="btn btn-default pull-right" disabled={!this.state.selection} onClick={this._onUpdate}>
                <span className="glyphicon glyphicon-pencil"></span>
              </button>
              <button type="button" className="btn btn-default pull-right" onClick={this._onAdd}>
                <span className="glyphicon glyphicon-plus"></span>
              </button>
            </header>
          </div>
          <div className="col-xs-12">
            {content}
          </div>
        </div>
      </div>
    );
  },

  _onClick: function (id) {
    this.setState({selection: id});
  },

  _onAdd: function () {
    var overlay = React.createFactory(require('./overlays/todo-form.jsx'));
    return Overlays.push(overlay({
      okCallback: (text) => TodoActions.post(text)
    }, null));
  },

  _onUpdate: function () {
    var todo = Stores.TodosStore.get(this.state.selection);
    var overlay = React.createFactory(require('./overlays/todo-form.jsx'));
    return Overlays.push(overlay({
      text: todo.data.text,
      done: todo.data.done,
      okCallback: (text, done) => TodoActions.put(this.state.selection, text, done)
    }, null));
  },

  _onDelete: function () {
    TodoActions.delete(this.state.selection);
    this.setState({selection: null});
  }

});
