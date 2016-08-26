/** 
 * Global gulp variables
 * Todo: create CLI configuration:
 * -p - production options
 */
var gulp         = require('gulp');
var $            = require('gulp-load-plugins')();
var del          = require('del');
var browserSync  = require('browser-sync').create();
var runSequence  = require('run-sequence');

/** Project configuration
 * config.devUrl - browserSync url
 * config.paths - paths to asset directories.
 * config.autoprefixerOptions - autoprefixer options
 */
var config = {
    devUrl: 'localhost/',
    paths: {
        base: 'assets/',
        dist: 'dist/',
        styles: {
            source: 'styles/main.scss',
            dist: 'styles'
        },  
        scripts: {
            source: 'scripts/*.js',
            dist: 'scripts'
        },
        images: {
            source: 'images/*',
            dist: 'images'
        }
    },
    autoprefixerOptions: {
        browsers: ['last 2 versions', '> 1%', 'Firefox ESR']    
    }
};

/**
 * Global configuration variables
 */
var paths = config.paths;
var autoprefixerOptions = config.autoprefixerOptions;

/**
 * Gulp 'styles' task - compile, writing sourcemaps and autoprefix project SCSS
 */
gulp.task('styles', function() {
    return gulp
        .src(paths.base + paths.styles.source)
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        .pipe($.sourcemaps.write())
        .pipe($.autoprefixer(autoprefixerOptions))
        .pipe(gulp.dest(paths.dist + paths.styles.dist))
        .pipe(browserSync.stream());    
});

/** 
 * Gulp 'scripts' task - compile and autoprefix project SCSS
 */ 
gulp.task('scripts', function() {
    return gulp
        .src(paths.base + paths.scripts.source)
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.js'))
        .pipe($.uglify())
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(paths.dist + paths.scripts.dist))
        .pipe(browserSync.stream());
});

/**
 * Gulp 'images' task - compressing project images
 */
gulp.task('images', function() {
    return gulp.src(paths.base + paths.images.source)
        .pipe($.imagemin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
        }))
        .pipe(gulp.dest(paths.dist + paths.images.dist))
        .pipe(browserSync.stream());    
});

/**
 * Gulp 'clean' task - deletes the build directory
 */
gulp.task('clean', function() {
    return del(paths.dist);
});

/**
 * Gulp 'start' task - using browserSync to synchronize code
 * changes with devices. Watch the assets and template files for
 * changes, run specific task for these and inject changes to page.
 * config.devUrl can be changed in the top of the file
 */
gulp.task('start', ['build'], function() {
    browserSync.init({
        files: ['{template}/**/*.tpl', '*.tpl'],
        proxy: config.devUrl
    });

    gulp.watch(paths.base + 'images/*', ['images']);
    gulp.watch(paths.base + 'styles/**/*.scss', ['styles']);
    gulp.watch(paths.base + 'scripts/*.js', ['scripts']);
});

/**
 * Gulp 'build' task - clean build directory and run all of the build tasks
 */
gulp.task('build', function(callback) {
    runSequence(
        'clean',
        ['images', 'styles', 'scripts'],
        callback
    );
});

/**
 * Gulp 'default' task - run the build task
 * See above.
 */
gulp.task('default', function() {
    gulp.start('build');
});