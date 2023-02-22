const { src, dest, series, parallel, watch } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const browserSync = require('browser-sync').create();

function css() {
    return src('src/scss/style.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer("last 3 version","safari 5", "ie 8", "ie 9"))
        .pipe(dest('public/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(dest('public/'))
        .pipe(browserSync.stream());
}

function javascript() {
    return src('src/js/**/*.js')
        .pipe(babel())
        .pipe(src('vendor/*.js'))
        .pipe(dest('public/'))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest('public/'))
        .pipe(browserSync.stream());
}

exports.build = parallel(css, javascript);
exports.watch = function() {
    browserSync.init({
        server: {
            baseDir: "./public",
        }
    });

    watch('src/**/*', parallel(css, javascript));
    watch("public/index.html").on('change', browserSync.reload);
}
