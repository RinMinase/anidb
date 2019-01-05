require("dotenv").config({ path: "./src/assets/.env" });

const {
	existsSync,
	readdirSync,
	lstatSync,
	unlinkSync,
	rmdirSync,
} = require("fs");
const { join } = require("path");
const { task, series, parallel } = require("gulp");
const conf = require("../../../gulpfile.js");

const browserSync = require("browser-sync");
const browserSyncSpa = require("browser-sync-spa");

function browserSyncInit(baseDir, browser) {
	browser = browser || "default";

	/**
	 * You can add a proxy to your backend by uncommenting the line below.
	 * You just have to configure a context which will we redirected and the target url.
	 * Example: $http.get("/users") requests will be automatically proxified.
	 *
	 * Example:
	 * var proxyMiddleware = require("http-proxy-middleware");
	 * server.middleware = proxyMiddleware(
	 * 		"/users", { target: "http://jsonplaceholder.typicode.com", changeOrigin: true }
	 * );
	 */

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

browserSync.use(browserSyncSpa({
	selector: "[ng-app]",
}));

task("serve", series("dev", () => {
	browserSyncInit([
		join(conf.paths.tmp, "/serve"),
		conf.paths.src,
	]);
}));

task("serve:dist", series("build", () => {
	browserSyncInit(conf.paths.dist);
}));

task("browsersync", () => {
	browserSyncInit([
		join(conf.paths.tmp, "/serve"),
		conf.paths.src,
	]);
});

task("clean", (done) => {
	syncDeleteFolder([
		conf.paths.tmp,
		conf.paths.dist,
		conf.paths.www,
	]);

	done();
});

task("dev",
	series(
		parallel("lazyload", "fonts", "scripts:watch"),
		"styles",
		"inject",
		parallel("watch", "browsersync")
	)
);

task("build",
	series(
		"clean",
		parallel("lazyload:dist", "fonts:dist", "scripts"),
		"styles",
		parallel("inject", "partials", "other", "robots"),
		"html",
		(done) => {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	)
);

task("bundle",
	series(
		"clean",
		parallel("lazyload:dist", "fonts:dist", "inject:bundle", "partials", "other", "robots"),
		"html",
		"relocate",
		(done) => {
			syncDeleteFolder(conf.paths.tmp);
			done();
		}
	)
);
