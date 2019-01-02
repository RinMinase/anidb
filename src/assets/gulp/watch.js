const { join } = require("path");
const { task, watch, start } = require("gulp");
const conf = require("../../../gulpfile.js");
const browserSync = require("browser-sync");

function isOnlyChange(event) {
	return event.type === "changed";
}

task("watch", (done) => {
	watch(
		join(conf.paths.src, "/*.html"),
		() => {
			start("inject-reload");
		}
	);

	watch([
		join(conf.paths.src, "/app/**/*.css"),
		join(conf.paths.src, "/app/**/*.scss"),
		join(conf.paths.src, "/assets/styles/*.css"),
		join(conf.paths.src, "/assets/styles/*.scss"),
	], (event) => {
		isOnlyChange(event) ? start("styles-reload") : start("inject-reload");
	});

	watch([
		join(conf.paths.src, "/app/**/*.html"),
		join(conf.paths.src, "/assets/index.html"),
	], (event) => {
		browserSync.reload(event.path);
	});

	done();
});
