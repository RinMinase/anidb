"use strict";
;
var join = require("path").join;
var conf = require("../../../gulpfile.js");

var task = require("gulp").task;
var src = require("gulp").src;
var dest = require("gulp").dest;

var lazyLoadedModules = [
	"node_modules/xlsx/dist/xlsx.full.min.js"
]

task("lazyload", function () {
	return src(lazyLoadedModules)
		.pipe(dest(join(conf.paths.tmp, "/serve/dependencies")));
});

task("lazyload:dist", function () {
	return src(lazyLoadedModules)
		.pipe(dest(join(conf.paths.dist, "/dependencies")));
});
