"use strict";

var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var watch = require("gulp").watch;
var start = require("gulp").start;

var browserSync = require("browser-sync");

function isOnlyChange(event) {
	return event.type === "changed";
}

task("watch", function (done) {
	watch(
		join(conf.paths.src, "/*.html"),
		function () {
			start("inject-reload")
		}
	);

	watch([
		join(conf.paths.src, "/app/**/*.css"),
		join(conf.paths.src, "/app/**/*.scss"),
		join(conf.paths.src, "/assets/styles/*.css"),
		join(conf.paths.src, "/assets/styles/*.scss")
	], function(event) {
		isOnlyChange(event) ? start("styles-reload") : start("inject-reload");
	});

	watch([
		join(conf.paths.src, "/app/**/*.html"),
		join(conf.paths.src, "/assets/index.html")
	], function(event) {
		browserSync.reload(event.path);
	});

	done();
});
