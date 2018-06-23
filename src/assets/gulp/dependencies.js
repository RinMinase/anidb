"use strict";

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var gutil = require("gulp-util");
var conf = require("../../../gulpfile.js");

var autoprefixer = require("gulp-autoprefixer");
var inject = require("gulp-inject");
var sass = require("gulp-sass");

var browserSync = require("browser-sync");
var webpackStream = require("webpack-stream");
var CompressionPlugin = require("compression-webpack-plugin");
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

	return gulp.src(path.join(conf.paths.src, "/*.html"))
		.pipe(inject(injectStyles, injectOptions))
		.pipe(inject(injectScripts, injectOptions))
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve")));
});


/**
 * Script Tasks
 */
function webpackWrapper(watch, callback) {
	var webpackOptions = {
		watch: watch,
		mode: "production",
		module: {
			rules: [{
				test: /\.js$/,
				enforce: "pre",
				exclude: /node_modules/,
				loader: "eslint-loader"
			}, {
				test: /\.html$/,
				use: [{
					loader: "ngtemplate-loader",
					options: { relativeTo: path.join(conf.paths.root, conf.paths.src) }
				}, { loader: "html-loader" }]
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					"ng-annotate-loader",
					"babel-loader?presets[]=env"
				]
			}]
		},
		optimization: {
			splitChunks: { chunks: "all" }
		},
		output: {
			filename: "index.module.js",
			path: path.join(conf.paths.root, conf.paths.tmp, "/serve/app"),
		},
		performance: { hints: false },
		plugins: [new Dotenv({ path: "./src/assets/.env" })]
	};

	if (watch) {
		webpackOptions.devtool = "inline-source-map";
	} else {
		webpackOptions.plugins.push(new CompressionPlugin());
	}

	var webpackChangeHandler = function(err, stats) {
		if (err) {
			conf.errorHandler("Webpack")(err);
		}

		gutil.log(
			stats.toString({
				colors: gutil.colors.supportsColor,
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

	return gulp.src(path.join(conf.paths.src, "/app/index.module.js"))
		.pipe(
			webpackStream(
				webpackOptions,
				require("webpack"),
				webpackChangeHandler
			)
		)
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/app")));
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
		outputStyle: "compressed",
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
			inject(
				injectFiles,
				injectOptions
			)
		)
		.pipe(sass(sassOptions))
		.on("error", conf.errorHandler("Sass"))
		.pipe(autoprefixer())
		.on("error",conf.errorHandler("Autoprefixer"))
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/app/")));
};


/**
 * Font Tasks
 *
 * Used *.woff2 formatting
 *    Remove compatibility in IE11 to reduce files in the compiled (dist/tmp) folder
 */
var fontpaths = [
	"node_modules/font-awesome/fonts/*.woff2",
];

var robotofonts = [
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Regular.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-RegularItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Medium.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-MediumItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Bold.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Light.woff2"
];

gulp.task("fonts_roboto", function () {
	if (!fs.existsSync(path.join(conf.paths.tmp, "/serve/fonts/roboto"))) {
		return gulp.src(robotofonts)
			.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts/roboto")));
	}
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
