// tslint:disable-next-line:no-var-requires
const IgnorePlugin = require("webpack").IgnorePlugin;

module.exports = {
	plugins: [
		new IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
	resolve: {
		alias: { "./dist/cpexcel.js": "" },
	},
};
