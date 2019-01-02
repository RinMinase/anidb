"use strict";

var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var series = require("gulp").series;
var src = require("gulp").src;
var dest = require("gulp").dest;

var browserSync = require("browser-sync");
var inject = require("gulp-inject");
var rename = require('gulp-rename');

/**
 * Injection Tasks
 */
task("inject", function () {
	var injectStyles = src([
		join(conf.paths.tmp, "/serve/app/**/*.css"),
		join("!" + conf.paths.tmp, "/serve/app/vendor.css")
	], { read: false });

	var injectScripts = src([
		join(conf.paths.tmp, "/serve/app/**/*.module.js")
	], { read: false });

	var injectStylesOptions = {
		ignorePath: [
			conf.paths.src,
			join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false
	};

	var injectScriptsOptions = {
		ignorePath: [
			conf.paths.src,
			join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false,
		transform: (path) => {
			return "<script src='" + path + "' defer></script>";
		}
	};

	return src(conf.paths.src + "/index.html")
		.pipe(inject(injectStyles, injectStylesOptions))
		.pipe(inject(injectScripts, injectScriptsOptions))
		.pipe(dest(join(conf.paths.tmp, "/serve")));
});

task("inject-reload", series("inject", function() {
	browserSync.reload();
}));

task("inject:bundle", series("scripts", "styles", function () {
	var injectStyles = src([
		join(conf.paths.tmp, "/serve/app/**/*.css"),
		join("!" + conf.paths.tmp, "/serve/app/vendor.css")
	], { read: false });

	var injectScripts = src([
		join(conf.paths.tmp, "/serve/app/**/*.module.js")
	], { read: false });

	var injectOptions = {
		ignorePath: [
			conf.paths.src,
			join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false
	};

	return src(conf.paths.src + "/index-mobile.html")
		.pipe(inject(injectStyles, injectOptions))
		.pipe(inject(injectScripts, injectOptions))
		.pipe(rename("index.html"))
		.pipe(dest(join(conf.paths.tmp, "/serve")));
}));
