var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');
var injectPartials = require('gulp-inject-partials');
var minify = require('gulp-minify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');

var SORCEPATHS = {
  sassSource : 'src/scss/*.scss',
  sassApp : 'src/scss/app.scss',
  htmlPartialSource : 'src/partial/*.html',
  htmlSource : 'src/*.html',
  jsSource : 'src/js/**',
  imgSource : 'src/img/**'
};
var APPPATH = {
  root: 'app/',
  css : 'app/css',
  js : 'app/js',
  fonts : 'app/fonts',
  img : 'app/img'
};

gulp.task('sass', function(){
//  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
//  var sassFiles;

      sassFiles = gulp.src(SORCEPATHS.sassApp)
          .pipe(autoprefixer())
          .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//        return merge(bootstrapCSS, sassFiles)
          .pipe(concat('app.css'))
          .pipe(gulp.dest(APPPATH.css));
});

gulp.task('html', function() {
  return gulp.src(SORCEPATHS.htmlSource)
  .pipe(injectPartials())
  .pipe(gulp.dest(APPPATH.root))
});

gulp.task('clean-html', function(){
  return gulp.src(APPPATH.root + '/*.html', {read : false, force : true})
  .pipe(clean());
});

gulp.task('clean-scripts', function(){
  return gulp.src(APPPATH.js + '/*.js', {read : false, force : true})
  .pipe(clean());
});

/* Production task */
gulp.task('compress', ['clean-scripts'], function(){
  gulp.src(SORCEPATHS.jsSource)
  .pipe(concat('main.js'))
  .pipe(minify())
  .pipe(gulp.dest(APPPATH.js))
});

gulp.task('compresscss', function(){
//  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
//  var sassFiles;

      sassFiles = gulp.src(SORCEPATHS.sassApp)
          .pipe(autoprefixer())
          .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
//        return merge(bootstrapCSS, sassFiles)
          .pipe(concat('app.css'))
          .pipe(cssmin())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest(APPPATH.css));
});
gulp.task('minifyhtml', function() {
  return gulp.src(SORCEPATHS.htmlSource)
  .pipe(injectPartials())
  .pipe(htmlmin({collapseWhitespace:true}))
  .pipe(gulp.dest(APPPATH.root))
});
/* Production task - End */

gulp.task('images', function(){
  return gulp.src(SORCEPATHS.imgSource)
  .pipe(newer(APPPATH.img))
  .pipe(imagemin())
  .pipe(gulp.dest(APPPATH.img));
});

/*
gulp.task('moveFonts', function() {
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest(APPPATH.fonts))
}); */

gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SORCEPATHS.jsSource)
  .pipe(concat('main.js'))
  .pipe(browserify())
  .pipe(gulp.dest(APPPATH.js))
});

/*
gulp.task('copy', ['clean-html'], function(){
  gulp.src(SORCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root));
});
*/

gulp.task('serve', ['sass'], function() {
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
})
});

gulp.task('watch', ['serve', 'sass', /*'copy',*/'images', 'clean-html', 'clean-scripts', /*'moveFonts',*/'scripts', 'html'], function() {
  gulp.watch([SORCEPATHS.sassSource], ['sass']);
//  gulp.watch([SORCEPATHS.htmlSource], ['copy']);
  gulp.watch([SORCEPATHS.jsSource], ['scripts']);
  gulp.watch([SORCEPATHS.imgSource], ['images']);
  gulp.watch([SORCEPATHS.htmlSource, SORCEPATHS.htmlPartialSource], ['html']);
});

gulp.task('production', ['compress', 'compresscss', 'minifyhtml']);

gulp.task('default', ['watch']);
