const { join } = require("path");
const { task, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const log = require("fancy-log");
const browserSync = require("browser-sync");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");

function webpackWrapper(watch, callback) {
	const webpackOptions = {
		watch,
		module: {
			rules: [{
				test: /^(?!.*\.test\.js$).*\.js$/,
				enforce: "pre",
				exclude: /node_modules/,
				loader: "eslint-loader",
			}, {
				test: /\.html$/,
				exclude: /node_modules/,
				use: [{
					loader: "ngtemplate-loader",
					options: { relativeTo: join(conf.paths.root, conf.paths.src) },
				}, { loader: "html-loader" }],
			}, {
				test: /^(?!.*\.test\.js$).*\.js$/,
				exclude: /node_modules/,
				use: [{
					loader: "ng-annotate-loader",
					options: {
						ngAnnotate: "ng-annotate-patched",
						es6: true,
						explicitOnly: false,
					},
				}, {
					loader: "babel-loader",
					options: { presets: ["@babel/preset-env"] },
				}],
			}],
		},
		optimization: {
			splitChunks: {
				chunks: "all",
			},
		},
		output: {
			filename: "index.module.js",
			path: join(conf.paths.root, conf.paths.tmp, "/serve/app"),
		},
		performance: { hints: false },
		plugins: [],
	};

	if (watch) {
		webpackOptions.mode = "development";
	} else {
		webpackOptions.mode = "production";
		webpackOptions.optimization.splitChunks.minSize = 153600;
		webpackOptions.optimization.splitChunks.maxSize = 512000;
		webpackOptions.plugins.push(new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 5,
			minChunkSize: 153600,
		}));
	}

	const webpackChangeHandler = function(err, stats) {
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
				version: false,
			})
		);

		browserSync.reload();

		if (watch) {
			watch = false;
			callback(); //eslint-disable-line
		}
	};

	return src(`${conf.paths.src}/app/index.module.js`)
		.pipe(
			webpackStream(
				webpackOptions,
				webpack,
				webpackChangeHandler
			)
		)
		.pipe(dest(join(conf.paths.tmp, "/serve/app")));
}

task("scripts", () => webpackWrapper(false));

task("scripts:watch", (callback) => webpackWrapper(true, callback));
