"use strict";

var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var series = require("gulp").series;
var src = require("gulp").src;
var dest = require("gulp").dest;

var autoprefixer = require("gulp-autoprefixer");
var browserSync = require("browser-sync");
var inject = require("gulp-inject");
var sass = require("gulp-sass");

task("styles-reload", series("styles", function() {
	return buildStyles()
		.pipe(browserSync.stream());
}));

task("styles", function() {
	return buildStyles();
});

var buildStyles = function() {
	var sassOptions = {
		outputStyle: "compressed",
		precision: 10
	};

	var injectFiles = src([
		join(conf.paths.src, "/app/**/*.scss"),
	], { read: false });

	var injectOptions = {
		transform: function(filePath) {
			return "@import \"" + filePath + "\";";
		},
		starttag: "// injector",
		endtag: "// endinjector",
		addRootSlash: false
	};

	return src([conf.paths.src + "/assets/styles/index.scss"])
		.pipe(
			inject(
				injectFiles,
				injectOptions
			)
		)
		.pipe(sass(sassOptions))
		.on("error", conf.errorHandler("Sass"))
		.pipe(autoprefixer())
		.on("error",conf.errorHandler("Autoprefixer"))
		.pipe(dest(join(conf.paths.tmp, "/serve/app/")));
};
