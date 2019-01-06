const { task, watch, series } = require("gulp");
const conf = require("../../../gulpfile.js");

task("watch", () => {
	watch(`${conf.paths.src}/**/*.html`, series("inject-reload"));
	watch(`${conf.paths.src}/**/*.scss`, series("styles-reload"));
});
