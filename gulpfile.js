const { series, src, dest, watch} = require('gulp');
const pug = require('gulp-pug');
const fileInclude = require("gulp-file-include");
const del = require("del");
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const rev = require('gulp-rev-append');

const config = {
    outputDir: './dist',
    outputAssetsDir: './dist/assets',
    srcAssetsGlob: ['./src/assets/**/*'],
    srcHtmlGlob: ['./src/**/*.html', '!./src/**/html-parts/*'],
    watchHtmlGlob: ['./src/**/*.html'],
    srcPugGlob: ['./src/pug/**/*.pug', '!./src/**/html-parts/*', '!./src/**/pug/components/*'],
    watchPugGlob: ['./src/**/*.pug'],
    srcStyleGlob: ['./src/styles/style.scss'],
    watchStyleGlob: ['./src/styles/**/*.scss'],
    srcScriptGlob: ['./src/scripts/script.js'],
    watchScriptGlob: ['./src/scripts/**/*.js'],
    svg: ['./src/assets/img/icons/*.svg']
}

function clean() {
    return del(config.outputDir)
}
function cleanSprite() {
    return del(config.svg)
}

function copyAssets() {
    return src(config.srcAssetsGlob)
        .pipe(dest(config.outputAssetsDir))
}

function pugToHtml() {
    return src(config.srcPugGlob)
        .pipe(pug({pretty: '\t'}))
        .pipe(rename({dirname: ""}))
        .pipe(dest(config.outputDir))
        .pipe(browserSync.stream())
}

function htmlHandler () {
    return src(config.srcHtmlGlob)
        .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
        .pipe(dest(config.outputDir))
        .pipe(browserSync.stream())
}

function style() {
    return src(config.srcStyleGlob)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('style.min.css'))
        .pipe(dest(config.outputDir))
        .pipe(browserSync.stream())
}

function buildStyle() {
    return src(config.srcStyleGlob)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(rename('style.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(config.outputDir))
}

function script() {
    return src(config.srcScriptGlob)
        .pipe(webpack({
            mode: 'development',
            devtool: 'inline-source-map',
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },

        }))
        .pipe(rename('script.min.js'))
        .pipe(sourcemaps.write())
        .pipe(dest(config.outputDir))
        .pipe(browserSync.stream())
}

function buildScript() {
    return src(config.srcScriptGlob)
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: "script.min.js"
            },
            devtool: 'source-map',
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            },

        }))
        .pipe(dest(config.outputDir))
}

function minifyHtml() {
    return src(config.outputDir + '/*.html')
        .pipe(rev())
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest(config.outputDir));
}

function watcher() {
    browserSync.init({
        server: config.outputDir
    })

    watch(config.watchStyleGlob, style)
    watch(config.watchScriptGlob, script)
    watch(config.watchPugGlob, pugToHtml).on("change", browserSync.reload)
    watch(config.watchHtmlGlob, htmlHandler)
    watch(config.srcAssetsGlob, series(clean, copyAssets)).on('change', browserSync.reload)
}

function bitrixWatcher() {
    browserSync.init({
        proxy: "http://192.168.56.114/"
    })

    watch(config.watchStyleGlob, style).on("change", browserSync.reload)
    watch(config.watchScriptGlob, script).on("change", browserSync.reload)
    watch("../../../**/*.php").on("change", browserSync.reload)
    watch(config.srcAssetsGlob, copyAssets).on('change', browserSync.reload)
}


exports.dev = series(copyAssets, style, script, pugToHtml, htmlHandler, watcher);
exports.prod = series(clean, copyAssets, buildScript, buildStyle, pugToHtml, htmlHandler, minifyHtml);
exports.test = series(buildStyle);
exports.bitrix = series(clean, copyAssets, buildStyle, buildScript, htmlHandler, minifyHtml, bitrixWatcher);
