"use strict";

var fs = require("fs");
var gulp = require("gulp");

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fs.readdirSync("./gulp").filter(function(file) {
	return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
	require("./gulp/" + file);
});

gulp.task("default", ["clean"], function () {
	gulp.start("build");
});
