'use strict';

let gulp = require('gulp');
let del = require('del');
let less = require('gulp-less');
let uglifycss = require('gulp-uglifycss');
let uglify = require('gulp-uglify');
let rename = require('gulp-rename');
let eslint = require('gulp-eslint');
let concat = require('gulp-concat');
let htmlmin = require('gulp-html-minifier');

let modules = './node_modules/';
let tobuild = 'src/';
let src = {
    js: [
        modules + "chico/dist/ui/chico.min.js",
        modules + "chico/node_modules/tiny.js/dist/tiny.min.js"
    ],
    css: modules + 'chico/dist/ui/chico.min.css',
    assets: modules + 'chico/dist/assets/*',
}

gulp.task('clean', (cb) => {
    del.sync(['public/**','index.html']);
    cb(null);
});

gulp.task('copy', ['js','css','assets','html'], function(cb) {
    cb(null);
});

gulp.task('js', () => {
    return gulp.src(src.js)
        .pipe(gulp.dest(tobuild + 'js/'));
});

gulp.task('css', () => {
    return gulp.src(src.css)
        .pipe(gulp.dest(tobuild + 'css/'));
});

gulp.task('assets', () => {
    return gulp.src(src.assets)
        .pipe(gulp.dest('./public/assets/'));
});

gulp.task('js', () => {
    return gulp.src(src.js)
        .pipe(gulp.dest(tobuild + 'js/'));
});
gulp.task('html', function() {
  gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
});

gulp.task('less', () => {
    return gulp.src('./src/css/site.less')
        .pipe(less({
            keepSpecialComments: 1,
            processImport: false
        }))
        .pipe(uglifycss({
          "uglyComments": true
        }))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('scripts', ['eslint'], function() {
  return gulp.src([
        tobuild + "js/tiny.min.js",
        tobuild + "js/chico.min.js",
        tobuild + "js/app.js"])
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('eslint', function() {
    return gulp.src('./src/js/app.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task('build', ['clean', 'copy', 'less', 'scripts']);