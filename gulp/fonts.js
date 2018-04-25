"use strict";

var path = require("path");
var gulp = require("gulp");
var conf = require("./conf");

gulp.task("fonts_roboto", function () {
	return gulp.src("node_modules/roboto-fontface/fonts/roboto/*")
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts/roboto")));
});

gulp.task("fonts_roboto:dist", function () {
	return gulp.src("node_modules/roboto-fontface/fonts/roboto/*")
		.pipe(gulp.dest(path.join(conf.paths.dist, "/serve/fonts/roboto")));
});

gulp.task("fonts", ["fonts_roboto"], function () {
	return gulp.src([
			"node_modules/font-awesome/fonts/*",
			"node_modules/bootstrap-sass/assets/fonts/bootstrap/*"
		])
		.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts")));
});

gulp.task("fonts:dist", ["fonts_roboto:dist"], function () {
	return gulp.src([
			"node_modules/font-awesome/fonts/*",
			"node_modules/bootstrap-sass/assets/fonts/bootstrap/*"
		])
		.pipe(gulp.dest(path.join(conf.paths.dist, "/fonts")));
});
