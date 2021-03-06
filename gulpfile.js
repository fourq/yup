'use strict';
var gulp = require('gulp')
  , del = require('del')
  , plumber = require('gulp-plumber')
  , mocha = require('gulp-mocha')
  , rename = require('gulp-rename')
  , babelTransform = require('gulp-babel-helpers')

gulp.task('test-runner', function(){

	gulp.watch(['./src/**/*.js'], ['compile'])

  gulp.watch('./test/**/*.js', function(e){
    gulp.src(e.path)
      .pipe(plumber())
      .pipe(mocha({ reporter: 'spec' }))
  })
})

gulp.task('clean', function(cb){
  del('./lib', cb);
})

gulp.task('compile', [ 'clean' ], function(){

  return gulp.src('./src/**/*.js')
      .pipe(plumber())
      .pipe(babelTransform({
          experimental: true, loose: ['all'],
          whitelist: [
            'es6.classes',
            'es6.modules',
            'es6.spread',
            'es6.blockScoping',
            'es6.arrowFunctions',
            'es6.properties.computed',
            'es6.properties.shorthand',
            'es6.parameters.default',
            'es6.parameters.rest',
            'es6.templateLiterals',
            'es6.destructuring',
            'es7.objectRestSpread'
          ]
        }
        , './util/babelHelpers.js'
        , './lib/util/babelHelpers.js'))
      .pipe(rename({ extname: '.js' }))
      .pipe(gulp.dest('./lib'));
})

gulp.task('watch', function(){
  gulp.watch(['./src/**/*.js', './test/**/*.js'], ['build'])
})

gulp.task('mocha', function () {
    return gulp.src('test.js', { read: false })
        .pipe(mocha({ reporter: 'spec' }));
})