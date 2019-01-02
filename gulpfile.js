const { readdirSync } = require("fs");
const { join } = require("path");
const { registry, task, series } = require("gulp");
const log = require("fancy-log");
const colors = require("ansi-colors");
const fwdRef = require("undertaker-forward-reference");

registry(fwdRef());

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
readdirSync("./src/assets/gulp")
	.filter((file) => (/\.(js|coffee)$/i).test(file))
	.map((file) => {
		require("./src/assets/gulp/" + file); //eslint-disable-line
	});

task("default", series("build"));

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
	root: join(__dirname),
	src: "src",
	dist: "dist",
	www: "www",
	tmp: ".tmp",
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 *
 *  Example
 *  exports.wiredep = {
 *  	directory: "bower_components"
 *  };
 */

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
	return function(err) {
		log(colors.red(`[ ${title} ]`), err.toString());
		this.emit("end");
	};
};
