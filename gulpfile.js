'use strict';

var gulp = require("gulp"),
  connect = require("gulp-connect"),
  opn = require("opn"),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  notify = require("gulp-notify"),
  concatCss = require('gulp-concat-css'),
  minifyCSS = require('gulp-minify-css');

// Local server
gulp.task('connect', function() {
  connect.server({
  root: 'app',
  livereload: true,
  port: 8000
  });
  opn('http://localhost:8000');
});

//Jade
gulp.task('jade', function() {
  gulp.src('./app/jade/*.jade')
    .pipe(jade({
     pretty: true
    }))
    .pipe(gulp.dest('./app/'))
    .pipe(notify("Jade Complete!"))
    .pipe(connect.reload());
});

// SASS
gulp.task('sass', function () {
  gulp.src('./app/scss/*.scss')
    .pipe(sass())
     .on('error', console.log)
    .pipe(gulp.dest('./app/css/'))
});


// CSS
gulp.task('css', function () {
  gulp.src('./app/css/*.css')
  .pipe(concatCss("build/base.min.css"))
  .pipe(minifyCSS())
  .pipe(gulp.dest('./app/css/'))
  .pipe(connect.reload());
});

// js
gulp.task('js', function () {
  gulp.src('./app/js/*.js')
  .pipe(connect.reload());
});

// Watch
gulp.task('watch', function () {
  gulp.watch(['./app/jade/*.jade'], ['jade']);
  gulp.watch(['./app/scss/*.scss'], ['sass']);
  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);
});

// default task
gulp.task('default', ['connect', 'watch']);