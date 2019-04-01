module.exports = (config) => {
	config.set({
		basePath: "../../../../",
		frameworks: ["jasmine", "@angular-devkit/build-angular"],
		plugins: [
			require("karma-jasmine"),
			require("karma-chrome-launcher"),
			require("@angular-devkit/build-angular/plugins/karma"),
			require("karma-coverage"),
			require("karma-coverage-istanbul-reporter"),
		],
		client: { clearContext: false },
		coverageIstanbulReporter: {
			dir: "coverage",
			reports: ["lcov", "text-summary"],
			fixWebpackSourcePaths: true,
		},
		reporters: ["progress", "coverage"],
		port: 9876,
		colors: true,
		logLevel: config.LOG_WARN,
		autoWatch: true,
		browsers: ["ChromeHeadless"],
		singleRun: true,
	});
};
