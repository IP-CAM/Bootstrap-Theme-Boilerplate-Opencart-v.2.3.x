var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var config = {
    devUrl: 'localhost/'
};

var paths = {
    base: 'assets/'
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
};

gulp.task('styles', function() {
    return gulp
        .src(paths.base + 'styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest('./stylesheet'))
        .pipe(browserSync.stream());    
});

gulp.task('scripts', function() {
    return gulp
        .src(paths.base + 'scripts/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./scripts'))
        .pipe(browserSync.stream());
});

gulp.task('build', ['styles', 'scripts']);

gulp.task('start', ['build'], function() {
    browserSync.init({
        files: ['{template}/**/*.tpl', '*.tpl'],
        proxy: config.devUrl
    });

    gulp.watch(paths.base + 'styles/**/*.scss', ['styles']);
    gulp.watch(paths.base + 'scripts/*.js', ['scripts']);
})