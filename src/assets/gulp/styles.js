const { task, series, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync");
const inject = require("gulp-inject");
const sass = require("gulp-sass");
const sassLint = require("gulp-sass-lint");

task("styles-reload", series("lint-styles", "stream-styles"));

task("styles", series("lint-styles", "build-styles"));

task("stream-styles", () => buildStyles().pipe(browserSync.stream()));

task("build-styles", buildStyles);

task("lint-styles", () =>
	src(`${conf.paths.src}/app/**/*.scss`)
		.pipe(sassLint({ configFile: "./.sasslint.yml" }))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())
);

function buildStyles() {
	const injectFiles = src(`${conf.paths.src}/app/**/*.scss`, { read: false });
	const sassOptions = {
		outputStyle: "compressed",
		precision: 10,
	};

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
		.pipe(dest(`${conf.paths.tmp}/serve/app/`));
}
