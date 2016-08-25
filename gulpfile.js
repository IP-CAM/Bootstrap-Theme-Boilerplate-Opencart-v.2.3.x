var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var paths = {
    base: 'source/'
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

gulp.task('watch', function() {
    gulp.watch(paths.base + 'styles/**/*.scss', ['styles']);
});

gulp.task('build', ['styles']);

gulp.task('start', ['build'], function() {
    browserSync.init({
        proxy: 'localhost/'
    });

    gulp.watch(paths.base + 'styles/**/*.scss', ['styles']);
})