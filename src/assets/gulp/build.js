"use strict";

var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var src = require("gulp").src;
var dest = require("gulp").dest;

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
task("html", function () {
	var partialsInjectFile = src(
		join(conf.paths.tmp, "/partials/templateCacheHtml.js"),
		{ read: false }
	);
	var partialsInjectOptions = {
		starttag: "<!-- inject:partials -->",
		ignorePath: join(conf.paths.tmp, "/partials"),
		addRootSlash: false
	};

	var htmlFilter = filter("*.html", { restore: true });
	var jsFilter = filter("**/*.js", { restore: true });
	var cssFilter = filter("**/*.css", { restore: true });

	return src(conf.paths.tmp + "/serve/*.html")
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
		.pipe(dest(join(conf.paths.dist, "/")))
		.pipe(size({
			title: join(conf.paths.dist, "/"),
			showFiles: true
		}));
});

task("partials", function () {
	return src([
		conf.paths.src + "/app/**/*.html",
		conf.paths.tmp + "/serve/app/**/*.html"
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
	.pipe(dest(conf.paths.tmp + "/partials/"));
});

task("other", function () {
	var fileFilter = filter(function (file) {
		return file.stat.isFile();
	});

	return src([
		conf.paths.src + "/**/*",
		"!" + conf.paths.src + "/**/*.{html,css,js,scss}",
		"!" + conf.paths.src + "/assets/firebase/*",
		"!" + conf.paths.src + "/assets/testing/*",
		"!" + conf.paths.src + "/assets/robots.txt",
		"!" + conf.paths.src + "/res/**/*"
	])
	.pipe(fileFilter)
	.pipe(dest(join(conf.paths.dist, "/")));
});

task("robots", function (done) {
	src(conf.paths.src + "/assets/robots.txt")
		.pipe(dest(join(conf.paths.dist, "/")));

	done();
});

task("relocate", function () {
	src(conf.paths.dist + "/**/*")
		.pipe(dest(conf.paths.www));
});
