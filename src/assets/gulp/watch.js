const { task, watch, series } = require("gulp");
const conf = require("../../../gulpfile.js");
const browserSync = require("browser-sync");

task("watch", () => {
	watch(`${conf.paths.src}/*.html`, series("styles-reload"));

	watch([
		`${conf.paths.src}/app/**/*.css`,
		`${conf.paths.src}/app/**/*.scss`,
		`${conf.paths.src}/assets/styles/*.css`,
		`${conf.paths.src}/assets/styles/*.scss`,
	], series("styles-reload"));

	watch([
		`${conf.paths.src}/app/**/*.html`,
		`${conf.paths.src}/assets/index.html`,
	], (event) => {
		browserSync.reload(event.path);
	});
});
