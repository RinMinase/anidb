"use strict";

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");

var conf = require("../../../gulpfile.js");
/**
 * Lazyload Tasks
 */
var lazyLoadedModules = [
	"node_modules/xlsx/dist/xlsx.full.min.js"
]

gulp.task("lazyload", function () {
	return gulp.src(lazyLoadedModules)
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/dependencies")));
});

gulp.task("lazyload:dist", function () {
	return gulp.src(lazyLoadedModules)
		.pipe(gulp.dest(path.join(conf.paths.dist, "/dependencies")));
});
