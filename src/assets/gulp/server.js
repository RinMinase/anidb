"use strict";

require("dotenv").config({ path: "./src/assets/.env" });

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var conf = require("../../../gulpfile.js");

var browserSync = require("browser-sync");
var browserSyncSpa = require("browser-sync-spa");
var runSequence = require("run-sequence");

function browserSyncInit(baseDir, browser) {
	browser = browser || "default";

	/**
	 * You can add a proxy to your backend by uncommenting the line below.
	 * You just have to configure a context which will we redirected and the target url.
	 * Example: $http.get("/users") requests will be automatically proxified.
	 *
	 * For more details and option,
	 * https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
	 *
	 * Example:
	 *
	 * var proxyMiddleware = require("http-proxy-middleware");
	 * server.middleware = proxyMiddleware(
	 * 		"/users", {
	 * 			target: "http://jsonplaceholder.typicode.com",
	 * 			changeOrigin: true
	 * 		}
	 * );
	 *
	 */

	browserSync.instance = browserSync.init({
		startPath: "/",
		server: {
			baseDir: baseDir,
			routes: null
		},
		browser: browser,
		port: process.env.PORT || 3000,
		ui: false,			// Disables :3001 browsersync options UI
		open: false,		// Disables opening of browser on serving
		notify: false,		// Removes top right browsersync notification
		ghostMode: false
	});
}

function syncDeleteFolder(path) {
	if (Array.isArray(path)) {
		path.forEach(function(el) {
			if (fs.existsSync(el)) {
				fs.readdirSync(el).forEach(function(file){
					var curPath = el + "/" + file;
					if (fs.lstatSync(curPath).isDirectory()) {
						syncDeleteFolder(curPath);
					} else {
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(el);
			}
		});
	} else {
		if (fs.existsSync(path) && path) {
			fs.readdirSync(path).forEach(function(file){
				var curPath = path + "/" + file;
				if (fs.lstatSync(curPath).isDirectory()) {
					syncDeleteFolder(curPath);
				} else {
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	}
};

browserSync.use(browserSyncSpa({
	selector: "[ng-app]"	// Only needed for angular apps
}));

gulp.task("serve", ["dev"], function () {
	browserSyncInit([
		path.join(conf.paths.tmp, "/serve"),
		conf.paths.src
	]);
});

gulp.task("serve:dist", ["build"], function () {
	browserSyncInit(conf.paths.dist);
});

gulp.task("clean", function () {
	return syncDeleteFolder([
		conf.paths.tmp,
		conf.paths.dist,
		conf.paths.www
	]);
});

gulp.task("dev", function (done) {
	runSequence(
		["lazyload", "fonts", "scripts:watch"],
		"styles",
		"inject",
		"watch",
		function() {
			done();
		}
	);
});

gulp.task("build", function (done) {
	runSequence(
		"clean",
		["lazyload:dist", "fonts:dist", "scripts"],
		"styles",
		["inject", "partials", "other"],
		"html",
		function() {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	);
});

gulp.task("bundle", function (done) {
	runSequence(
		"clean",
		["lazyload:dist", "fonts:dist", "inject:bundle", "partials", "other"],
		"html",
		"relocate",
		function() {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	);
});
