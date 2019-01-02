const { join } = require("path");
const { task, series, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const browserSync = require("browser-sync");
const inject = require("gulp-inject");
const rename = require("gulp-rename");

task("inject", () => {
	const injectStyles = src([
		join(conf.paths.tmp, "/serve/app/**/*.css"),
		join(`!${conf.paths.tmp}`, "/serve/app/vendor.css")
	], { read: false });

	const injectScripts = src([
		join(conf.paths.tmp, "/serve/app/**/*.module.js")
	], { read: false });

	const injectStylesOptions = {
		ignorePath: [
			conf.paths.src,
			join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false,
	};

	const injectScriptsOptions = {
		ignorePath: [
			conf.paths.src,
			join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false,
		transform: (path) => {
			return `<script src='${path}' defer></script>`;
		}
	};

	return src(`${conf.paths.src}/index.html`)
		.pipe(inject(injectStyles, injectStylesOptions))
		.pipe(inject(injectScripts, injectScriptsOptions))
		.pipe(dest(join(conf.paths.tmp, "/serve")));
});

task("inject-reload", series("inject", () => {
	browserSync.reload();
}));

task("inject:bundle", series("scripts", "styles", () => {
	const injectStyles = src([
		join(conf.paths.tmp, "/serve/app/**/*.css"),
		join(`!${conf.paths.tmp}`, "/serve/app/vendor.css")
	], { read: false });

	const injectScripts = src([
		join(conf.paths.tmp, "/serve/app/**/*.module.js")
	], { read: false });

	const injectOptions = {
		ignorePath: [
			conf.paths.src,
			join(conf.paths.tmp, "/serve")
		],
		addRootSlash: false,
	};

	return src(`${conf.paths.src}/index-mobile.html`)
		.pipe(inject(injectStyles, injectOptions))
		.pipe(inject(injectScripts, injectOptions))
		.pipe(rename("index.html"))
		.pipe(dest(join(conf.paths.tmp, "/serve")));
}));
