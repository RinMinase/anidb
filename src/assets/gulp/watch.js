"use strict";

var fs = require("fs");
var path = require("path");
var gulp = require("gulp");
var conf = require("../../../gulpfile.js");

var browserSync = require("browser-sync");

/**
 * Watch Tasks
 */
function isOnlyChange(event) {
	return event.type === "changed";
}

gulp.task("watch", function () {
	gulp.watch(
		path.join(conf.paths.src, "/*.html"),
		["inject-reload"]
	);

	gulp.watch([
		path.join(conf.paths.src, "/app/**/*.css"),
		path.join(conf.paths.src, "/app/**/*.scss"),
		path.join(conf.paths.src, "/assets/styles/*.css"),
		path.join(conf.paths.src, "/assets/styles/*.scss")
	], function(event) {
		isOnlyChange(event) ? gulp.start("styles-reload") : gulp.start("inject-reload");
	});

	gulp.watch([
		path.join(conf.paths.src, "/app/**/*.html"),
		path.join(conf.paths.src, "/assets/index.html")
	], function(event) {
		browserSync.reload(event.path);
	});
});
