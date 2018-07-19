"use strict";

require("dotenv").config({ path: "./src/assets/.env" });

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var conf = require("../../../gulpfile.js");

var angularTemplatecache = require("gulp-angular-templatecache");
var filter = require("gulp-filter");
var htmlmin = require("gulp-htmlmin");
var inject = require("gulp-inject");
var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");
var size = require("gulp-size");
var useref = require("gulp-useref");

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
		notify: false		// Removes top right browsersync notification
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

gulp.task("serve", ["fonts", "watch"], function () {
	browserSyncInit([
		path.join(conf.paths.tmp, "/serve"),
		conf.paths.src
	]);
});

gulp.task("serve:dist", ["build"], function () {
	browserSyncInit(conf.paths.dist);
});


/**
 * Watch Tasks
 */
function isOnlyChange(event) {
	return event.type === "changed";
}

gulp.task("watch", ["scripts:watch", "inject"], function () {

	gulp.watch(
		path.join(conf.paths.src, "/*.html"),
		["inject-reload"]
	);

	gulp.watch([
		path.join(conf.paths.src, "/app/**/*.css"),
		path.join(conf.paths.src, "/app/**/*.scss"),
		path.join(conf.paths.src, "/assets/styles/*.css"),
		path.join(conf.paths.src, "/assets/styles/*.scss")
	], function(event) {
		if (isOnlyChange(event)) {
			gulp.start("styles-reload");
		} else {
			gulp.start("inject-reload");
		}
	});

	gulp.watch([
		path.join(conf.paths.src, "/app/**/*.html"),
		path.join(conf.paths.src, "/assets/index.html")
	], function(event) {
			browserSync.reload(event.path);
		}
	);
});


/**
 * Build Tasks
 */

gulp.task("html", function () {
	var partialsInjectFile = gulp.src(
		path.join(conf.paths.tmp, "/partials/templateCacheHtml.js"),
		{ read: false }
	);
	var partialsInjectOptions = {
		starttag: "<!-- inject:partials -->",
		ignorePath: path.join(conf.paths.tmp, "/partials"),
		addRootSlash: false
	};

	var htmlFilter = filter("*.html", { restore: true });
	var jsFilter = filter("**/*.js", { restore: true });
	var cssFilter = filter("**/*.css", { restore: true });

	return gulp.src(path.join(conf.paths.tmp, "/serve/*.html"))
		.pipe(inject(partialsInjectFile, partialsInjectOptions))
		.pipe(useref())
		.pipe(jsFilter)
		.pipe(rev())
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(rev())
		.pipe(cssFilter.restore)
		.pipe(revReplace())
		.pipe(htmlFilter)
		.pipe(htmlFilter.restore)
		.pipe(gulp.dest(path.join(conf.paths.dist, "/")))
		.pipe(size({
			title: path.join(conf.paths.dist, "/"),
			showFiles: true
		}));
});

gulp.task("partials", function () {
	return gulp.src([
		path.join(conf.paths.src, "/app/**/*.html"),
		path.join(conf.paths.tmp, "/serve/app/**/*.html")
	])
	.pipe(
		htmlmin({
			removeComments: true,
			removeEmptyAttributes: true,
			removeAttributeQuotes: true,
			collapseBooleanAttributes: true,
			collapseWhitespace: true
		})
	)
	.pipe(
		angularTemplatecache(
			"templateCacheHtml.js", {
				module: "anidbAngular",
				root: "app"
			}
		)
	)
	.pipe(gulp.dest(conf.paths.tmp + "/partials/"));
});

gulp.task("other", function () {
	var fileFilter = filter(function (file) {
		return file.stat.isFile();
	});

	return gulp.src([
		path.join(conf.paths.src, "/**/*"),
		path.join("!" + conf.paths.src, "/**/*.{html,css,js,scss}"),
		path.join("!" + conf.paths.src, "/assets/firebase/*"),
		path.join("!" + conf.paths.src, "/assets/testing/*"),
		path.join("!" + conf.paths.src, "/res/**/*")
	])
	.pipe(fileFilter)
	.pipe(gulp.dest(path.join(conf.paths.dist, "/")));
});

gulp.task("relocate", function () {
	gulp.src(conf.paths.dist + "/**/*")
		.pipe(gulp.dest(conf.paths.www));
});

gulp.task("clean", function () {
	return syncDeleteFolder([
		conf.paths.tmp,
		conf.paths.dist,
		conf.paths.www
	]);
});

gulp.task("build", function (done) {
	runSequence(
		"clean",
		["fonts:dist", "inject", "partials", "other"],
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
		["fonts:dist", "inject:bundle", "partials", "other"],
		"html",
		"relocate",
		function() {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	);
});
