"use strict";

var path = require("path");
var gulp = require("gulp");
var conf = require("../gulpfile");
var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync");
var webpack = require("webpack-stream");
// var Dotenv = require("dotenv-webpack");

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
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [
					"ng-annotate",
					"babel-loader?presets[]=env"
				]
			}]
		},
		// plugins: [ new Dotenv() ],
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

	// var sources = [  ];

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
