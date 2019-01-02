const { join } = require("path");
const { task, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const angularTemplatecache = require("gulp-angular-templatecache");
const filter = require("gulp-filter");
const htmlmin = require("gulp-htmlmin");
const inject = require("gulp-inject");
const rev = require("gulp-rev");
const revReplace = require("gulp-rev-replace");
const size = require("gulp-size");
const useref = require("gulp-useref");

/**
 * Build Tasks
 */
task("html", () => {
	const partialsInjectFile = src(
		join(conf.paths.tmp, "/partials/templateCacheHtml.js"),
		{ read: false }
	);

	const partialsInjectOptions = {
		starttag: "<!-- inject:partials -->",
		ignorePath: join(conf.paths.tmp, "/partials"),
		addRootSlash: false,
	};

	const htmlFilter = filter("*.html", { restore: true });
	const jsFilter = filter("**/*.js", { restore: true });
	const cssFilter = filter("**/*.css", { restore: true });

	return src(`${conf.paths.tmp}/serve/*.html`)
		.pipe(inject(partialsInjectFile, partialsInjectOptions))
		.pipe(useref())
		.pipe(jsFilter)
		.pipe(rev())
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(rev())
		.pipe(cssFilter.restore)
		.pipe(revReplace())
		.pipe(htmlFilter)
		.pipe(htmlFilter.restore)
		.pipe(dest(join(conf.paths.dist, "/")))
		.pipe(size({
			title: join(conf.paths.dist, "/"),
			showFiles: true,
		}));
});

task("partials", () => {
	return src([
		`${conf.paths.src}/app/**/*.html`,
		`${conf.paths.tmp}/serve/app/**/*.html`,
	]).pipe(
		htmlmin({
			removeComments: true,
			removeEmptyAttributes: true,
			removeAttributeQuotes: true,
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
		})
	).pipe(
		angularTemplatecache(
			"templateCacheHtml.js", {
				module: "anidbAngular",
				root: "app",
			}
		)
	).pipe(dest(`${conf.paths.tmp}/partials/`));
});

task("other", () => {
	const fileFilter = filter((file) => file.stat.isFile());

	return src([
		`${conf.paths.src}/**/*`,
		`!${conf.paths.src}/**/*.{html,css,js,scss}`,
		`!${conf.paths.src}/assets/firebase/*`,
		`!${conf.paths.src}/assets/testing/*`,
		`!${conf.paths.src}/assets/robots.txt`,
		`!${conf.paths.src}/res/**/*`,
	]).pipe(fileFilter)
		.pipe(dest(join(conf.paths.dist, "/")));
});

task("robots", () =>
	src(`${conf.paths.src}/assets/robots.txt`)
		.pipe(dest(join(conf.paths.dist, "/")))
);

task("relocate", () =>
	src(`${conf.paths.dist}/**/*`)
		.pipe(dest(conf.paths.www))
);
