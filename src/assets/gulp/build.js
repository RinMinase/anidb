"use strict";

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

gulp.task("robots", function () {
	gulp.src(conf.paths.src + "/assets/robots.txt")
		.pipe(gulp.dest(path.join(conf.paths.dist, "/")));
});

gulp.task("relocate", function () {
	gulp.src(conf.paths.dist + "/**/*")
		.pipe(gulp.dest(conf.paths.www));
});
