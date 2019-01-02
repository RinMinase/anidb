"use strict";

var join = require("path").join;
var log = require("fancy-log");
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var src = require("gulp").src;
var dest = require("gulp").dest;

var browserSync = require("browser-sync");
var dotenv = require('dotenv').config({ path: "./src/assets/.env" });
var webpack = require("webpack");
var webpackStream = require("webpack-stream");
var CompressionPlugin = require("compression-webpack-plugin");

function webpackWrapper(watch, callback) {
	var webpackOptions = {
		watch: watch,
		module: {
			rules: [{
				test: /\.js$/,
				enforce: "pre",
				exclude: /node_modules/,
				loader: "eslint-loader"
			}, {
				test: /\.html$/,
				exclude: /node_modules/,
				use: [{
					loader: "ngtemplate-loader",
					options: { relativeTo: join(conf.paths.root, conf.paths.src) }
				}, { loader: "html-loader" }]
			}, {
				test: /\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: "ng-annotate-loader",
					options: {
						ngAnnotate: "ng-annotate-patched",
						es6: true,
						explicitOnly: false
					}
				}, {
					loader: "babel-loader",
					options: { presets: ["@babel/preset-env"] }
				}],
			}]
		},
		optimization: {
			splitChunks: { chunks: "all" }
		},
		output: {
			filename: "index.module.js",
			path: join(conf.paths.root, conf.paths.tmp, "/serve/app"),
		},
		performance: { hints: false },
		plugins: []
	};

	if (watch) {
		webpackOptions.mode = "development";
		webpackOptions.devtool = "inline-source-map";
	} else {
		webpackOptions.mode = "production";
		webpackOptions.plugins.push(new CompressionPlugin());
		webpackOptions.plugins.push(new webpack.DefinePlugin({ "process.env": dotenv.parsed }));
	}

	var webpackChangeHandler = function(err, stats) {
		if (err) {
			conf.errorHandler("Webpack")(err);
		}

		log(
			stats.toString({
				builtAt: false,
				colors: true,
				chunks: false,
				entrypoints: false,
				hash: false,
				modules: false,
				version: false
			})
		);

		browserSync.reload();

		if (watch) {
			watch = false;
			callback();
		}
	};

	return src(conf.paths.src + "/app/index.module.js")
		.pipe(
			webpackStream(
				webpackOptions,
				webpack,
				webpackChangeHandler
			)
		)
		.pipe(dest(join(conf.paths.tmp, "/serve/app")));
}

task("scripts", function () {
	return webpackWrapper(false);
});

task("scripts:watch", function (callback) {
	return webpackWrapper(true, callback);
});
