var gulp         = require('gulp');
var sass         = require('gulp-sass');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var imagemin     = require('gulp-imagemin');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync').create();
var runSequence  = require('run-sequence');

var config = {
    devUrl: 'localhost/'
};

var paths = {
    base: 'assets/',
    dist: 'dist/',
    styles: {
        source: 'styles/main.scss',
        dist: './styles'
    },  
    scripts: {
        source: 'scripts/*.js',
        dist: './scripts'
    },
    images: {
        source: 'images/*',
        dist: './images'
    }
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 1%', 'Firefox ESR']
};

gulp.task('styles', function() {
    return gulp
        .src(paths.base + paths.styles.source)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(paths.dist + paths.styles.dist))
        .pipe(browserSync.stream());    
});

gulp.task('scripts', function() {
    return gulp
        .src(paths.base + paths.scripts.source)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist + paths.scripts.dist))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    return gulp.src(paths.base + paths.images.source)
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(paths.dist + paths.images.dist))
        .pipe(browserSync.stream());    
});

gulp.task('clean', function() {
    return require('del')(paths.dist);
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        ['images', 'styles', 'scripts'],
        callback
    );
});

gulp.task('start', ['build'], function() {
    browserSync.init({
        files: ['{template}/**/*.tpl', '*.tpl'],
        proxy: config.devUrl
    });

    gulp.watch(paths.base + 'images/*', ['images']);
    gulp.watch(paths.base + 'styles/**/*.scss', ['styles']);
    gulp.watch(paths.base + 'scripts/*.js', ['scripts']);
});