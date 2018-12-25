"use strict";

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var conf = require("../../../gulpfile.js");

var browserSync = require("browser-sync");
var inject = require("gulp-inject");
var rename = require('gulp-rename');

/**
 * Injection Tasks
 */
gulp.task("inject-reload", ["inject"], function() {
	browserSync.reload();
});

gulp.task("inject", function () {
	var injectStyles = gulp.src([
		path.join(conf.paths.tmp, "/serve/app/**/*.css"),
		path.join("!" + conf.paths.tmp, "/serve/app/vendor.css")
	], { read: false });

	var injectScripts = gulp.src([
		path.join(conf.paths.tmp, "/serve/app/**/*.module.js")
	], { read: false });

	var injectStylesOptions = {
		ignorePath: [
			conf.paths.src,
			path.join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false
	};

	var injectScriptsOptions = {
		ignorePath: [
			conf.paths.src,
			path.join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false,
		transform: (path) => {
			return "<script src='" + path + "' defer></script>";
		}
	};

	return gulp.src(path.join(conf.paths.src, "/index.html"))
		.pipe(inject(injectStyles, injectStylesOptions))
		.pipe(inject(injectScripts, injectScriptsOptions))
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve")));
});

gulp.task("inject:bundle", ["scripts", "styles"], function () {
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

	return gulp.src(path.join(conf.paths.src, "/index-mobile.html"))
		.pipe(inject(injectStyles, injectOptions))
		.pipe(inject(injectScripts, injectOptions))
		.pipe(rename("index.html"))
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve")));
});
