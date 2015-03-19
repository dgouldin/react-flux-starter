'use strict';

var express = require('express');

var router = express.Router();

/**
 * Standard handler for returning index template
 * @function
 */
function indexRouteHandler (req, res) {
  res.render('index', {
    title: 'Example App',
    token: req['heroku-bouncer'] && req['heroku-bouncer'].token || '',
    herokuId: req['heroku-bouncer'] && req['heroku-bouncer'].id || ''
  });
}

/* GET home page. */
router.get('/*', indexRouteHandler);

module.exports = router;
