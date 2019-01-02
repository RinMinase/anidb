const fs = require("fs");
const { join } = require("path");
const { task, series, src, dest } = require("gulp");
const conf = require("../../../gulpfile.js");

/**
 * Used *.woff2, removed compatibility in IE11
 * to reduce files in the compiled (dist/tmp) folder
 */
const fontpaths = [
	"node_modules/font-awesome/fonts/fontawesome-webfont.woff2",
];

const robotofonts = [
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Regular.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-RegularItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Medium.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-MediumItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Bold.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-BoldItalic.woff2",
	"node_modules/roboto-fontface/fonts/roboto/Roboto-Light.woff2"
];

task("fonts_roboto", (done) => {
	if (!fs.existsSync(join(conf.paths.tmp, "/serve/fonts/roboto"))) {
		return src(robotofonts)
			.pipe(dest(join(conf.paths.tmp, "/serve/fonts/roboto")));
	}

	done();
});

task("fonts", series("fonts_roboto", (done) => {
	if (!fs.existsSync(join(conf.paths.tmp, "/serve/fonts/fontawesome-webfont.woff2"))) {
		return src(fontpaths)
			.pipe(dest(join(conf.paths.tmp, "/serve/fonts")));
	}

	done();
}));

task("fonts_roboto:dist", () =>
	src(robotofonts)
		.pipe(dest(join(conf.paths.dist, "/fonts/roboto")))
);

task("fonts:dist", series("fonts_roboto:dist", () =>
	src(fontpaths)
		.pipe(dest(join(conf.paths.dist, "/fonts")))
));
