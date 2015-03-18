'use strict';

var React = require('react/addons');

var Router = require('react-router'),
    Route = Router.Route,
    NotFoundRoute = Router.NotFoundRoute,
    DefaultRoute = Router.Route;

module.exports = (

  <Route name="root" path="/" handler={require('./components/app.jsx')}>

    <DefaultRoute name="todos" path="/" handler={require('./components/todos.jsx')} />

    <NotFoundRoute handler={require('./components/route-not-found.jsx')} />

  </Route>
);
