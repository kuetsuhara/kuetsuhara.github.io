'use strict'
gulp = require 'gulp'
$ = (require 'gulp-load-plugins') lazy: false

gulp.task 'css', ->
  gulp.src 'sass/*.scss'
    .pipe $.plumber()
    .pipe $.sass outputStyle: 'nested'
    .pipe $.autoprefixer 'last 1 version'
    .pipe gulp.dest 'css'

gulp.task 'default', ->
  gulp.start 'css'
