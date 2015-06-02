'use strict';

var gulp = require("gulp"),
  connect = require("gulp-connect"),
  opn = require("opn"),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  notify = require("gulp-notify"),
  concatCss = require('gulp-concat-css'),
  minifyCSS = require('gulp-minify-css'),
  filter = require('gulp-filter'),
  useref = require('gulp-useref'),
  clean = require('gulp-clean'),
  gulpif = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  uglify = require('gulp-uglify'),
  size = require('gulp-size');

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

//====================================
//====================================
//==============Building==============

gulp.task('clean', function () {
  return gulp.src('dist')
    .pipe(clean());
});

gulp.task('useref', function () {
  var assets = useref.assets();
  return gulp.src('app/*.html')
    .pipe(assets)
    //.pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCSS({
      compatibility: 'ie8'
    })))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  gulp.src('app/fonts/*')
    .pipe(filter(['*.eot','*.svg','*.ttf','*.woff','*.woff2']))
    .pipe(gulp.dest('dist/fonts/'))
});

gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ]).pipe(gulp.dest('dist'));
});

gulp.task('backend', function() {
  return gulp.src(
    'app/server/**/*.*'
  ).pipe(gulp.dest('dist/server'))
});

gulp.task('dist', ['useref', 'images', 'fonts', 'extras', 'backend'], function () {
  return gulp.src('dist/**/*').pipe(size({title: 'build'}));
});

gulp.task('build', ['clean', 'jade'], function () {
  gulp.start('dist');
});

gulp.task('server-dist', function () {  
  connect.server({
  root: 'dist',
  livereload: true,
  port: 8000
  });
  opn('http://localhost:8000');
});