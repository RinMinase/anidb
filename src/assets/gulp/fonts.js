"use strict";

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");

var conf = require("../../../gulpfile.js");

/**
 * Font Tasks
 *
 * Used *.woff2 formatting
 *    Remove compatibility in IE11 to reduce files in the compiled (dist/tmp) folder
 */
var fontpaths = [
	"node_modules/font-awesome/fonts/fontawesome-webfont.woff2",
];

var robotofonts = [
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Regular.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-RegularItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Medium.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-MediumItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Bold.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-BoldItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Light.woff2"
];

gulp.task("fonts_roboto", function () {
	if (!fs.existsSync(path.join(conf.paths.tmp, "/serve/fonts/roboto"))) {
		return gulp.src(robotofonts)
			.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts/roboto")));
	}
});

gulp.task("fonts_roboto:dist", function () {
	return gulp.src(robotofonts)
		.pipe(gulp.dest(path.join(conf.paths.dist, "/fonts/roboto")));
});

gulp.task("fonts", ["fonts_roboto"], function () {
	if (!fs.existsSync(path.join(conf.paths.tmp, "/serve/fonts/fontawesome-webfont.woff2"))) {
		return gulp.src(fontpaths)
			.pipe(gulp.dest(path.join(conf.paths.tmp, "/serve/fonts")));
	}
});

gulp.task("fonts:dist", ["fonts_roboto:dist"], function () {
	return gulp.src(fontpaths)
		.pipe(gulp.dest(path.join(conf.paths.dist, "/fonts")));
});
