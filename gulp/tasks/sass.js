'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  handleErrors = require('../util/handleErrors'),
  config = require('../config').sass;

gulp.task('sass', function() {
  return gulp.src(config.src)
    .pipe(sass({
      sourceComments: config.production ? 'none' : 'map',
      precision: 10,
      includePaths: ['bower_components']
    }))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest));
});
