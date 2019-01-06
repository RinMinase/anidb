const { task, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

const lazyLoadedModules = [
	"node_modules/xlsx/dist/xlsx.full.min.js",
];

task("lazyload", () =>
	src(lazyLoadedModules)
		.pipe(dest(`${conf.paths.tmp}/serve/dependencies`))
);

task("lazyload:dist", () =>
	src(lazyLoadedModules)
		.pipe(dest(`${conf.paths.dist}/dependencies`))
);
