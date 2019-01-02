"use strict";

var fs = require("fs");
var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var series = require("gulp").series;
var src = require("gulp").src;
var dest = require("gulp").dest;

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

task("fonts_roboto", function (done) {
	if (!fs.existsSync(join(conf.paths.tmp, "/serve/fonts/roboto"))) {
		return src(robotofonts)
			.pipe(dest(join(conf.paths.tmp, "/serve/fonts/roboto")));
	}

	done();
});

task("fonts_roboto:dist", function () {
	return src(robotofonts)
		.pipe(dest(join(conf.paths.dist, "/fonts/roboto")));
});

task("fonts", series("fonts_roboto", function (done) {
	if (!fs.existsSync(join(conf.paths.tmp, "/serve/fonts/fontawesome-webfont.woff2"))) {
		return src(fontpaths)
			.pipe(dest(join(conf.paths.tmp, "/serve/fonts")));
	}

	done();
}));

task("fonts:dist", series("fonts_roboto:dist", function () {
	return src(fontpaths)
		.pipe(dest(join(conf.paths.dist, "/fonts")));
}));
