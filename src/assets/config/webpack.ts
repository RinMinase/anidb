// tslint:disable-next-line:no-var-requires
const webpack = require("webpack");

module.exports = {
	plugins: [
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
	],
};
