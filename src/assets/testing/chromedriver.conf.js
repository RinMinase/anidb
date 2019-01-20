const chromedriver = require("chromedriver");

module.exports = {
	before: (done) => {
		chromedriver.start([
			"--port=9515",
			"--url-base=/wd/hub",
			"--silent",
		]);
		done();
	},

	after: (done) => {
		chromedriver.stop();
		done();
	},
};
