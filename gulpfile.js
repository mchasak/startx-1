/**
 * Gulpfile.
 *
 * Gulp with Devx.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in PHP.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *      9. Generates .pot file for i18n and l10n.
 *
 * @author Ahmad Awais (@ahmadawais), devx
 * @version 1.0.3
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// START Editing Project Variables.
// Project related.
var project = 'Devx HTML' // Project Name.
var productURL = './build' // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Style related.
var allStylesSRC = './styles/**/*.scss' // Path to all .scss files.
var styleSRC = './styles/style.scss' // Path to style .scss file.
var styleDestination = './build/styles/' // Path to place the compiled CSS file.

// JS Vendor related.
var scriptsSRC = './javascripts/**/*.js' // Path to JS vendor folder.
var scriptsDestination = './build/javascripts/' // Path to place the compiled JS vendors file.
var scriptsFile = 'main' // Compiled JS vendors file name.

// Images related.
var imagesSRC = './images/**/*.{png,jpg,gif,svg}' // Source folder of images which should be optimized.
var imagesDestination = './build/images/' // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Icons related.
var symbolicIconsSRC = './icons/**/shape.**.svg' // Source folder of symbolic icons which should be used for svg sprite.
var imageIconsSRC = './icons/**/ready.**.svg' // Source folder of image icons which should be used for svg sprite.
var advancedIconsSRC = './icons/**/class.**.svg' // Source folder of advanced icons which should be used for svg sprite.
var iconsDestination = './build/icons/' // Destination folder of svg sprites. Must be different from the sources folder.

// HTML related.
var htmlDataSRC = './data/**/*' // HTML config source
var htmlSRC = './html/**/*.html' // HTML files
var htmlDestination = './build/' // destination folder

// Fonts related.
var fontsSRC = './fonts/**/*' // Source folder of fonts which should be copied.
var fontsDestination = './build/fonts/' // Destination folder of copied fonts. Must be different from the fontsSRC folder.

// Sounds related.
var soundsSRC = './sounds/**/*' // Source folder of sounds which should be copied.
var soundsDestination = './build/sounds/' // Destination folder of copied sounds. Must be different from the fontsSRC folder.

// Watch files paths.
var styleWatchFiles = './styles/**/**/*.scss' // Path to all *.scss files inside css folder and inside them.
var scriptsWatchFiles = './javascripts/**/*.js' // Path to all JS files.
var projectHTMLWatchFiles = './html/**/*.html' // Path to all html files.

// icons configs
//https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md
var configSpriteReady = {
    shape: {
        dest: 'svg/', //puts all files separatly into this dir
        dimension: {
            maxWidth: 128, //TODO
            maxHeight: 128,
            precision: 2
        },
        spacing: {
            padding: 0,
        },
        transform: [
            {
                svgo: {
                    plugins: [
                        {
                            removeDoctype: true
                        },
                        {
                            removeTitle: true
                        },
                        {
                            removeDimensions: true
                        },
                    ],
                    js2svg: {
                        pretty: true
                    }
                }
            }
        ]
    },
    mode: {
        defs: {
            dest: '.',
            sprite: './sprite.ready.svg',
            example: false,
        }
    }
}

var configClass = {
    plugins: [
        {
            removeDoctype: true
        },
        {
            removeTitle: true
        },
        {
            removeAttrs: {
                attrs: ['stroke', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'fill', 'fill-rule', 'stroke-dasharray']
            }
        },
        {
            removeDimensions: true
        }
    ],
    js2svg: {
        pretty: true
    }
}

var configSymbolic = {
    shape: {
        dest: 'svg/',
        dimension: { // Set maximum dimensions
            maxWidth: 32,
            maxHeight: 32
        },
        spacing: { // Add padding
            padding: 2
        },
        transform: [
            {
                svgo: {
                    plugins: [
                        /*
                        { transformsWithOnePath: {
                        shiftX: 10,
                        shiftY: 100,
                        floatPrecision: 3,
                        scale: 3,
                        hcrop: false,
                        vcenter: true,
                      } },
                      */
                        {
                            removeDoctype: true
                        },
                        {
                            removeTitle: true
                        },
                        {
                            removeAttrs: {
                                attrs: ['stroke', 'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'stroke-opacity', 'fill', 'fill-rule']
                            }
                        },
                        {
                            removeDimensions: true
                        },
                    ],
                    js2svg: {
                        pretty: true
                    }
                }
            }
        ],
        //dest: 'out/intermediate-svg' // Keep the intermediate files
    },
    mode: {
        // view: { // Activate the «view» mode
        // 	bust: false,
        // 	render: {
        // 		scss: true // Activate Sass output (with default options)
        // 	}
        // },
        symbol: {
            dest: '.',
            sprite: './sprite.symbolic.svg',
            // bust:		false,
        }
    }
}


// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
]

// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and assing them semantic names.
 */
var gulp = require('gulp') // Gulp of-course

// CSS related plugins.
var sass = require('gulp-sass') // Gulp pluign for Sass compilation.
var minifycss = require('gulp-uglifycss') // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer') // Autoprefixing magic.
var mmq = require('gulp-merge-media-queries') // Combine matching media queries into one media query definition.

// JS related plugins.
var concat = require('gulp-concat') // Concatenates JS files
var uglify = require('gulp-uglify') // Minifies JS files
var wrap = require('gulp-wrap') // declare template namespaces and make templates available for use in the browser
var declare = require('gulp-declare') // declare template namespaces and make templates available for use in the browser

// Image realted plugins.
var imagemin = require('gulp-imagemin') // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Icons realted plugins.
var svgSprite = require('gulp-svg-sprite') // create svg sprite.
var svgmin = require('gulp-svgmin') // minifies svg

// Utility related plugins.
const del = require("del") // Delete files and folders using globs
var rename = require('gulp-rename') // Renames files E.g. style.css -> style.min.css
var replace = require('gulp-replace') // replaces strings
var lineec = require('gulp-line-ending-corrector') // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter = require('gulp-filter') // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps = require('gulp-sourcemaps') // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var browsersync = require('browser-sync').create() // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var sort = require('gulp-sort') // Recommended to prevent unnecessary changes in pot-file.
var hb = require('gulp-hb') // A sane static Handlebars Gulp plugin.


/**
 * Task: `clean`.
 */
function clean() {
    return del(productURL)
}

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */
function browserSync(done) {
    browsersync.init({
        server: productURL,
        port: 3000,
        open: true,
        injectChanges: true
    })
    done()
}

function browserSyncReload(done) {
    browsersync.reload()
    done()
}


/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
function styles() {
    return gulp.src(styleSRC)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compact',
            precision: 10
        }))
        .on('error', console.error.bind(console))
        .pipe(sourcemaps.write({includeContent: false}))
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))

        .pipe(sourcemaps.write(styleDestination))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.

        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(mmq({log: true})) // Merge Media Queries only for .min.css version.

        .pipe(browsersync.stream()) // Reloads style.css if that is enqueued.

        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss({
            maxLineLen: 10
        }))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(styleDestination))

        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browsersync.stream())// Reloads style.min.css if that is enqueued.
}


/**
 * Task: `scripts`.
 *
 * Concatenate and uglify vendor JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS vendor files
 *     2. Concatenates all the files and generates vendors.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates vendors.min.js
 */
function scripts() {
    return gulp.src(scriptsSRC)
        .pipe(concat(scriptsFile + '.js'))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(rename({
            basename: scriptsFile,
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest(scriptsDestination))
}

/**
 * Task: `images`.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp images`.
 */
function images() {
    return gulp.src(imagesSRC)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 3, // 0-7 low-high
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest(imagesDestination))
}


/**
 * Task: `icons`.
 *
 * creates SVG sprites
 */
function symbolicIcons(callback) {
    return gulp.src(symbolicIconsSRC)
        .pipe(svgSprite(configSymbolic))
        .pipe(replace('id="shape.', 'id="'))
        .pipe(gulp.dest(iconsDestination))
}

function imageIcons(callback) {
    return gulp.src(imageIconsSRC)
        .pipe(svgSprite(configSpriteReady))
        .pipe(replace('id="ready.', 'id="'))
        .pipe(gulp.dest(iconsDestination))
}

function advancedIcons(callback) {
    return gulp.src(advancedIconsSRC)
        .pipe(replace('id=', 'class='))
        .pipe(replace('class="wire-', 'class="wire '))
        .pipe(replace('<svg ', '<svg class="svg classy" '))
        .pipe(svgmin(configClass))
        .pipe(rename(function (path) {
            path.extname = '.hbs'
        }))
        .pipe(gulp.dest(iconsDestination))
        .on('end', function () {
            callback()
        })
}


/**
 * Task: `fonts`.
 *
 * Copies all fonts
 */
function fonts() {
    return gulp.src(fontsSRC)
        .pipe(gulp.dest(fontsDestination))
}


/**
 * Task: `sounds`.
 *
 * Copies all sounds
 */
function sounds() {
    return gulp.src(soundsSRC)
        .pipe(gulp.dest(soundsDestination))
}


/**
 * Task: `html`.
 *
 * Create HTML files from .html
 */
function templates() {
    return gulp.src('./html/*.html')
        .pipe(hb()
            .partials(htmlSRC)
            .helpers(require('handlebars-helpers'))
            .helpers({
                ifEquals: function (arg1, arg2, options) {
                    return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
                },
                ifNotEquals: function (arg1, arg2, options) {
                    return (arg1 !== arg2) ? options.fn(this) : options.inverse(this)
                }
            })
            .data('./html-data/**/*.json')
        )
        .pipe(gulp.dest('./build'))
}

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
function watchFiles() {
    gulp.watch(allStylesSRC, styles)
    gulp.watch(scriptsSRC, gulp.series(scripts, browserSyncReload))
    gulp.watch(htmlSRC, gulp.series(templates, browserSyncReload))
    gulp.watch(htmlDataSRC, gulp.series(templates, browserSyncReload))
}

const build = gulp.series(clean, gulp.parallel(
    styles,
    scripts,
    images,
    symbolicIcons,
    imageIcons,
    advancedIcons,
    fonts,
    sounds,
    templates,
))
const watch = gulp.parallel(watchFiles, browserSync)

exports.styles = styles
exports.scripts = scripts
exports.images = images
exports.symbolicIcons = symbolicIcons
exports.imageIcons = imageIcons
exports.advancedIcons = advancedIcons
exports.fonts = fonts
exports.sounds = sounds
exports.templates = templates

exports.clean = clean
exports.build = build
exports.watch = watch
exports.default = build
