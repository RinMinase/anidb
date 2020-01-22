// tslint:disable-next-line:no-var-requires
const Dotenv = require("dotenv-webpack");
const IgnorePlugin = require("webpack").IgnorePlugin;

module.exports = {
	plugins: [
		new Dotenv(),
		new IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
	resolve: {
		alias: { "./dist/cpexcel.js": "" },
	},
};
