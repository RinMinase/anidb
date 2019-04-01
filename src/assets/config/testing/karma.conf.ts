module.exports = (config) => {
	config.set({
		basePath: "",
		frameworks: ["jasmine", "@angular-devkit/build-angular"],
		plugins: [
			require("karma-jasmine"),
			require("karma-chrome-launcher"),
			require("karma-jasmine-html-reporter"),
			require("karma-coverage-istanbul-reporter"),
			require("@angular-devkit/build-angular/plugins/karma"),
			require("karma-coverage"),
		],
		client: { clearContext: false },
		coverageIstanbulReporter: {
			dir: require("path").join(__dirname, "../../../../coverage"),
			reports: ["html", "lcovonly", "text-summary"],
			fixWebpackSourcePaths: true,
		},
		reporters: ["progress", "kjhtml", "coverage"],
		port: 9876,
		colors: true,
		logLevel: config.LOG_WARN,
		autoWatch: true,
		browsers: ["ChromeHeadless"],
		singleRun: true,
	});
};
