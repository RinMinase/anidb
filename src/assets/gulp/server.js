require("dotenv").config({ path: "./src/assets/.env" });

const {
	existsSync,
	readdirSync,
	lstatSync,
	unlinkSync,
	rmdirSync,
} = require("fs");
const { task, series, parallel } = require("gulp");
const conf = require("../../../gulpfile.js");

const browserSync = require("browser-sync");
const browserSyncSpa = require("browser-sync-spa");

browserSync.use(browserSyncSpa({
	selector: "[ng-app]",
}));

function browserSyncInit(baseDir, browser) {
	browser = browser || "default";

	browserSync.instance = browserSync.init({
		startPath: "/",
		server: {
			baseDir,
			routes: null,
		},
		browser,
		port: process.env.PORT || 3000,
		ui: false,
		open: false,
		notify: false,
		ghostMode: false,
	});
}

function syncDeleteFolder(path) {
	if (Array.isArray(path)) {
		path.forEach((el) => {
			if (existsSync(el)) {
				readdirSync(el).forEach((file) => {
					const curPath = `${el}/${file}`;

					lstatSync(curPath).isDirectory() ? syncDeleteFolder(curPath) : unlinkSync(curPath);
				});
				rmdirSync(el);
			}
		});
	} else if (existsSync(path) && path) {
		readdirSync(path).forEach((file) => {
			const curPath = `${path}/${file}`;

			lstatSync(curPath).isDirectory() ? syncDeleteFolder(curPath) : unlinkSync(curPath);
		});
		rmdirSync(path);
	}
}

task("serve", series("dev"));

task("browsersync", () => {
	browserSyncInit([ `${conf.paths.tmp}/serve`, conf.paths.src ]);
});

task("serve:dist", series("build", function browsersync() {
	browserSyncInit(conf.paths.dist);
}));

task("clean", (done) => {
	syncDeleteFolder([
		conf.paths.tmp,
		conf.paths.dist,
		conf.paths.www,
	]);

	done();
});

task("clean:tmp", (done) => {
	syncDeleteFolder(conf.paths.tmp);
	done();
});

task("clean:dist", (done) => {
	syncDeleteFolder(conf.paths.dist);
	done();
});

task("dev",
	series(
		parallel("lazyload", "fonts", "scripts:watch"),
		"styles",
		"inject",
		"inject-base",
		parallel("watch", "browsersync")
	)
);

task("build",
	series(
		"clean",
		parallel("lazyload:dist", "fonts:dist", "scripts"),
		"styles",
		parallel("inject", "partials", "other"),
		"inject-base",
		"html",
		"clean:tmp"
	)
);

task("bundle",
	series(
		"clean",
		parallel("lazyload:dist", "fonts:dist", "scripts"),
		"styles",
		parallel("inject", "partials", "other"),
		"inject-base:bundle",
		"html",
		"relocate",
		"clean:tmp"
	)
);
