"use strict";

var path = require("path");
var gulp = require("gulp");
var conf = require("../../../gulpfile.js");
var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync");
var webpack = require("webpack-stream");
var Dotenv = require("dotenv-webpack");

gulp.task("inject-reload", ["inject"], function() {
	browserSync.reload();
});

gulp.task("inject", ["scripts", "styles"], function () {
	var injectStyles = gulp.src([
		path.join(conf.paths.tmp, "/serve/app/**/*.css"),
		path.join("!" + conf.paths.tmp, "/serve/app/vendor.css")
	], { read: false });

	var injectScripts = gulp.src([
		path.join(conf.paths.tmp, "/serve/app/**/*.module.js")
	], { read: false });

	var injectOptions = {
		ignorePath: [
			conf.paths.src,
			path.join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false
	};

	return gulp.src(
			path.join(conf.paths.src, "/*.html")
		)
		.pipe(
			$.inject(injectStyles, injectOptions)
		)
		.pipe(
			$.inject(injectScripts, injectOptions)
		)
		.pipe(
			gulp.dest(
				path.join(conf.paths.tmp, "/serve")
			)
		);
});


/**
 * Script Tasks
 */
function webpackWrapper(watch, callback) {
	var webpackOptions = {
		watch: watch,
		module: {
			preLoaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: "eslint-loader"
			}],
			loaders: [{
				test: /\.html$/,
				loaders: [
					"ngtemplate-loader",
					"html-loader"
				],
				options: {
					relativeTo: conf.paths.src
				}
			}],
			loaders: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [
					"ng-annotate",
					"babel-loader?presets[]=env"
				]
			}]
		},
		plugins: [ new Dotenv({ path: "./src/assets/.env" }) ],
		output: { filename: "index.module.js" }
	};

	if (watch) {
		webpackOptions.devtool = "inline-source-map";
	}

	var webpackChangeHandler = function(err, stats) {
		if (err) {
			conf.errorHandler("Webpack")(err);
		}

		$.util.log(
			stats.toString({
				colors: $.util.colors.supportsColor,
				chunks: false,
				hash: false,
				version: false
			}
		));

		browserSync.reload();

		if (watch) {
			watch = false;
			callback();
		}
	};

	return gulp.src(
			path.join(conf.paths.src, "/app/index.module.js")
		)
		.pipe(
			webpack(
				webpackOptions,
				null,
				webpackChangeHandler
			)
		)
		.pipe(
			gulp.dest(
				path.join(conf.paths.tmp, "/serve/app")
			)
		);
}

gulp.task("scripts", function () {
	return webpackWrapper(false);
});

gulp.task("scripts:watch", ["scripts"], function (callback) {
	return webpackWrapper(true, callback);
});


/**
 * Stylesheet Tasks
 */
gulp.task("styles-reload", ["styles"], function() {
	return buildStyles()
		.pipe(browserSync.stream());
});

gulp.task("styles", function() {
	return buildStyles();
});

var buildStyles = function() {
	var sassOptions = {
		outputStyle: "expanded",
		precision: 10
	};

	var injectFiles = gulp.src([
		path.join(conf.paths.src, "/app/**/*.scss"),
	], { read: false });

	var injectOptions = {
		transform: function(filePath) {
			return "@import \"" + filePath + "\";";
		},
		starttag: "// injector",
		endtag: "// endinjector",
		addRootSlash: false
	};


	return gulp.src([path.join(conf.paths.src, "/assets/styles/index.scss")])
		.pipe(
			$.inject(
				injectFiles,
				injectOptions
			)
		)
		.pipe($.sourcemaps.init())
		.pipe($.sass(sassOptions))
		.on(
			"error",
			conf.errorHandler("Sass")
		)
		.pipe($.autoprefixer())
		.on(
			"error",
			conf.errorHandler("Autoprefixer")
		)
		.pipe($.sourcemaps.write())
		.pipe(
			gulp.dest(
				path.join(
					conf.paths.tmp,
					"/serve/app/"
				)
			)
		);
};


/**
 * Font Tasks
 */
var fontpaths = [
	"node_modules/font-awesome/fonts/*",
	"node_modules/bootstrap-sass/assets/fonts/bootstrap/*"
];

var robotofonts = "node_modules/roboto-fontface/fonts/roboto/*";

gulp.task("fonts_roboto", function () {
	return gulp.src(robotofonts)
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts/roboto")));
});

gulp.task("fonts_roboto:dist", function () {
	return gulp.src(robotofonts)
		.pipe(gulp.dest(path.join(conf.paths.dist, "/fonts/roboto")));
});

gulp.task("fonts", ["fonts_roboto"], function () {
	return gulp.src(fontpaths)
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts")));
});

gulp.task("fonts:dist", ["fonts_roboto:dist"], function () {
	return gulp.src(fontpaths)
		.pipe(gulp.dest(path.join(conf.paths.dist, "/fonts")));
});
