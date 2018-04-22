"use strict";

var path = require("path");
var gulp = require("gulp");
var conf = require("./conf");
var browserSync = require("browser-sync");
var browserSyncSpa = require("browser-sync-spa");
// var proxyMiddleware = require("http-proxy-middleware");

function browserSyncInit(baseDir, browser) {
	browser = browser || "default";

	/*
	 * You can add a proxy to your backend by uncommenting the line below.
	 * You just have to configure a context which will we redirected and the target url.
	 * Example: $http.get("/users") requests will be automatically proxified.
	 *
	 * For more details and option,
	 * https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
	 *
	 * Example:
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
		open: false
	});
}

browserSync.use(browserSyncSpa({
	// Only needed for angular apps
	selector: "[ng-app]"
}));

gulp.task("serve_fonts", function () {
	return gulp.src("node_modules/font-awesome/fonts/*")
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts")));
});

gulp.task("serve", ["serve_fonts", "watch"], function () {
	browserSyncInit([path.join(conf.paths.tmp, "/serve"), conf.paths.src]);
});

gulp.task("serve:dist", ["copy", "build"], function () {
	browserSyncInit(conf.paths.dist);
});
