"use strict";

require("dotenv").config({ path: "./src/assets/.env" });

var fs = require("fs");
var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var series = require("gulp").series;
var parallel = require("gulp").parallel;

var browserSync = require("browser-sync");
var browserSyncSpa = require("browser-sync-spa");

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

task("serve", series("dev", function () {
	browserSyncInit([
		join(conf.paths.tmp, "/serve"),
		conf.paths.src
	]);
}));

task("serve:dist", series("build", function () {
	browserSyncInit(conf.paths.dist);
}));

task("clean", function (done) {
	syncDeleteFolder([
		conf.paths.tmp,
		conf.paths.dist,
		conf.paths.www
	]);

	done();
});

task("dev",
	series(
		parallel("lazyload", "fonts", "scripts:watch"),
		"styles",
		"inject",
		"watch"
	)
);

task("build",
	series(
		"clean",
		parallel("lazyload:dist", "fonts:dist", "scripts"),
		"styles",
		parallel("inject", "partials", "other", "robots"),
		"html",
		function(done) {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	)
);

task("bundle",
	series(
		"clean",
		parallel("lazyload:dist", "fonts:dist", "inject:bundle", "partials", "other", "robots"),
		"html",
		"relocate",
		function(done) {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	)
);
