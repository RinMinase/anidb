"use strict";

var path = require("path");
var gulp = require("gulp");
var conf = require("./conf");
var $ = require("gulp-load-plugins")();
var browserSync = require("browser-sync");

gulp.task("styles-reload", ["styles"], function() {
	return buildStyles()
		.pipe(browserSync.stream());
});

gulp.task("styles", function() {
	return buildStyles();
});

var buildStyles = function() {
	var sassOptions = {
		outputStyle: "expanded",
		precision: 10
	};

	var injectFiles = gulp.src([
		path.join(conf.paths.src, "/app/**/*.scss"),
	], { read: false });

	var injectOptions = {
		transform: function(filePath) {
			return "@import \"" + filePath + "\";";
		},
		starttag: "// injector",
		endtag: "// endinjector",
		addRootSlash: false
	};


	return gulp.src([
			path.join(conf.paths.src, "/assets/styles/index.scss")
		])
		.pipe(
			$.inject(
				injectFiles,
				injectOptions
			)
		)
		.pipe($.sourcemaps.init())
		.pipe($.sass(sassOptions))
		.on(
			"error",
			conf.errorHandler("Sass")
		)
		.pipe($.autoprefixer())
		.on(
			"error",
			conf.errorHandler("Autoprefixer")
		)
		.pipe($.sourcemaps.write())
		.pipe(
			gulp.dest(
				path.join(
					conf.paths.tmp,
					"/serve/app/"
				)
			)
		);
};
