'use strict';

var gulp = require('gulp'),
    Mincer = require('mincer'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    config = require('../config').assetRefresh;


// build local bootstrap from bower package -- copy sass/font assets and bundled js
gulp.task('asset-refresh', function () {

  /* BOOTSTRAP */

  // copy over all the fonts
  gulp.src(config.bootstrapHome + 'fonts/**/*')
    .pipe(gulp.dest(config.fonts));

  // ??? all bootstrap js is bundled into a single bootstrap.js file

  // bundle javascripts using mincer  This is a non gulp-esqe but was quick and did the trick
  //   NOTE: would use gulp-include but dependencies in bootstrap bundle don't include
  //         .js file extension which gulp-include trips-up on.
  var environment = new Mincer.Environment();
  environment.appendPath(config.bootstrapHome + 'javascripts');

  mkdirp(config.vendorDest, function (err) {
    if (err) { console.write('Unable to create directories: ' + err); }
    var asset = environment.findAsset('bootstrap.js');
    fs.writeFileSync(path.join(config.vendorDest, 'bootstrap.js'), asset.toString());
  });

});
