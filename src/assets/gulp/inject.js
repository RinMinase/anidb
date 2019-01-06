const { task, series, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const browserSync = require("browser-sync");
const inject = require("gulp-inject");
const rename = require("gulp-rename");

task("inject-reload", series("inject", function reload(done) {
	browserSync.reload();
	done();
}));

task("inject", () => {
	const injectScripts = src(`${conf.paths.tmp}/serve/app/**/*.module.js`, { read: false });
	const injectStyles = src([
		`${conf.paths.tmp}/serve/app/**/*.css`,
		`!${conf.paths.tmp}/serve/app/vendor.css`,
	], { read: false });

	const injectStylesOptions = {
		ignorePath: [ conf.paths.src, `${conf.paths.tmp}/serve`],
		addRootSlash: false,
	};

	const injectScriptsOptions = {
		ignorePath: [ conf.paths.src, `${conf.paths.tmp}/serve` ],
		addRootSlash: false,
		transform: (path) => `<script src='${path}' defer></script>`,
	};

	return src(`${conf.paths.src}/index.html`)
		.pipe(inject(injectStyles, injectStylesOptions))
		.pipe(inject(injectScripts, injectScriptsOptions))
		.pipe(dest(`${conf.paths.tmp}/serve`));
});

task("inject:bundle", series("scripts", "styles", () => {
	const injectScripts = src(`${conf.paths.tmp}/serve/app/**/*.module.js`, { read: false });
	const injectStyles = src([
		`${conf.paths.tmp}/serve/app/**/*.css`,
		`!${conf.paths.tmp}/serve/app/vendor.css`,
	], { read: false });

	const injectStylesOptions = {
		ignorePath: [ conf.paths.src, `${conf.paths.tmp}/serve`],
		addRootSlash: false,
	};

	const injectScriptsOptions = {
		ignorePath: [ conf.paths.src, `${conf.paths.tmp}/serve` ],
		addRootSlash: false,
		transform: (path) => `<script src='${path}' defer></script>`,
	};

	return src(`${conf.paths.src}/index-mobile.html`)
		.pipe(inject(injectStyles, injectStylesOptions))
		.pipe(inject(injectScripts, injectScriptsOptions))
		.pipe(rename("index.html"))
		.pipe(dest(`${conf.paths.tmp}/serve`));
}));
