const { join } = require("path");
const { task, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const lazyLoadedModules = [
	"node_modules/xlsx/dist/xlsx.full.min.js",
];

task("lazyload", () =>
	src(lazyLoadedModules)
		.pipe(dest(join(conf.paths.tmp, "/serve/dependencies")))
);

task("lazyload:dist", () =>
	src(lazyLoadedModules)
		.pipe(dest(join(conf.paths.dist, "/dependencies")))
);
