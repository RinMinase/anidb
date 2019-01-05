const { join } = require("path");
const { task, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const angularTemplatecache = require("gulp-angular-templatecache");
const del = require("del");
const filter = require("gulp-filter");
const htmlmin = require("gulp-htmlmin");
const inject = require("gulp-inject");
const rev = require("gulp-rev");
const revReplace = require("gulp-rev-replace");
const useref = require("gulp-useref");
const vinylPaths = require("vinyl-paths");

const htmlminOptions = {
	removeComments: true,
	removeEmptyAttributes: true,
	removeAttributeQuotes: true,
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
};

/**
 * Build Tasks
 */
task("html", () => {
	const partialsInjectFile = src(
		join(conf.paths.tmp, "/serve/app/index.template.js"),
		{ read: false }
	);

	const partialsInjectOptions = {
		starttag: "<!-- inject:partials -->",
		ignorePath: join(conf.paths.tmp, "/serve"),
		addRootSlash: false,
		transform: (path) => `<script src="${path}" defer></script>`,
	};

	const htmlFilter = filter("*.html", { restore: true });
	const jsFilter = filter("**/*.js", { restore: true });
	const cssFilter = filter("**/*.css", { restore: true });

	return src(`${conf.paths.tmp}/serve/*.html`)
		.pipe(inject(partialsInjectFile, partialsInjectOptions))
		.pipe(useref({ noconcat: true }))
		.pipe(jsFilter)
		.pipe(rev())
		.pipe(jsFilter.restore)
		.pipe(cssFilter)
		.pipe(rev())
		.pipe(cssFilter.restore)
		.pipe(revReplace())
		.pipe(htmlFilter)
		.pipe(htmlFilter.restore)
		.pipe(dest(`${conf.paths.dist}/`))
		.on("end", () =>
			src(`${conf.paths.dist}/index.html`)
				.pipe(vinylPaths(del))
				.pipe(htmlmin(htmlminOptions))
				.pipe(dest(`${conf.paths.dist}/`))
		);
});

task("partials", () =>
	src([
		`${conf.paths.src}/app/**/*.html`,
		`${conf.paths.tmp}/serve/app/**/*.html`,
	]).pipe(htmlmin(htmlminOptions)).pipe(
		angularTemplatecache(
			"index.template.js", {
				module: "anidbAngular",
				root: "app",
			}
		)
	).pipe(dest(`${conf.paths.tmp}/serve/app/`))
);

task("other", () =>
	src([
		`${conf.paths.src}/**/*`,
		`!${conf.paths.src}/**/*.{html,css,js,scss}`,
		`!${conf.paths.src}/assets/firebase/*`,
		`!${conf.paths.src}/assets/testing/*`,
		`!${conf.paths.src}/assets/robots.txt`,
		`!${conf.paths.src}/res/**/*`,
	]).pipe(filter((file) => file.stat.isFile()))
		.pipe(dest(join(conf.paths.dist, "/")))
		.on("end", () =>
			src(`${conf.paths.src}/assets/robots.txt`)
				.pipe(dest(join(conf.paths.dist, "/")))
		)
);

task("relocate", () =>
	src(`${conf.paths.dist}/**/*`)
		.pipe(dest(conf.paths.www))
);
