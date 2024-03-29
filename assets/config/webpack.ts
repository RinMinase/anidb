/* tslint:disable:no-var-requires */
const Dotenv = require("dotenv-webpack");
const IgnorePlugin = require("webpack").IgnorePlugin;
/* tslint:enable */

module.exports = {
	plugins: [
		new Dotenv({
			systemvars: true,
			silent: true,
		}),
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
	],
	resolve: {
		alias: { "./dist/cpexcel.js": false },
	},
};
