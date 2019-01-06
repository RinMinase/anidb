const { readdirSync } = require("fs");
const { join } = require("path");
const { registry, task, series } = require("gulp");
const log = require("fancy-log");
const fwdRef = require("undertaker-forward-reference");

registry(fwdRef());

/**
 *  This will load all js files to load all gulp tasks
 */
readdirSync("./src/assets/gulp")
	.filter((file) => (/\.(js)$/i).test(file))
	.map((file) => {
		require("./src/assets/gulp/" + file); //eslint-disable-line
	});

task("default", series("build"));

exports.paths = {
	root: join(__dirname),
	src: "src",
	dist: "dist",
	www: "www",
	tmp: ".tmp",
};

exports.errorHandler = function(title) {
	return function(err) {
		log(`[ ${title} ]`, err.toString());
		this.emit("end");
	};
};
