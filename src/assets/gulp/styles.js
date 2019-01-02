const { join } = require("path");
const { task, series, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");
const inject = require("gulp-inject");
const sass = require("gulp-sass");

task("styles-reload", series("styles", () =>
	buildStyles().pipe(browserSync.stream())
));

task("styles", () => buildStyles());

const buildStyles = function() {
	const sassOptions = {
		outputStyle: "compressed",
		precision: 10,
	};

	const injectFiles = src([
		join(conf.paths.src, "/app/**/*.scss"),
	], { read: false });

	const injectOptions = {
		transform: (filePath) => `@import "${filePath}";`,
		starttag: "// injector",
		endtag: "// endinjector",
		addRootSlash: false,
	};

	return src([`${conf.paths.src}/assets/styles/index.scss`])
		.pipe(inject(injectFiles, injectOptions))
		.pipe(sass(sassOptions))
		.on("error", conf.errorHandler("Sass"))
		.pipe(autoprefixer())
		.on("error", conf.errorHandler("Autoprefixer"))
		.pipe(dest(join(conf.paths.tmp, "/serve/app/")));
};
