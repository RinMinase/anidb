require("dotenv").config({ path: "./src/assets/.env" });

const seleniumServer = require("selenium-server");
const chromedriver = require("chromedriver");
const { log } = console;

log("\nConfiguration Detals:");
log("=====================");
log(`URL: ${process.env.TEST_URL}`);
log(`Username: ${process.env.TEST_USERNAME}`);
log(`Headless: ${process.env.TEST_HEADLESS || "false"}\n`);

const args = [];

if (process.env.TEST_HEADLESS === "true") {
	args.push("--proxy-server='direct://'");
	args.push("--proxy-bypass-list=*");
	args.push("--headless");
}

module.exports = {
	"src_folders": ["src/assets/testing/tests"],
	"output_folder": false,
	"selenium": {
		"start_process": true,
		"log_path": false,
		"server_path": seleniumServer.path,
		"host": "127.0.0.1",
		"port": 4444,
		"cli_args": { "webdriver.chrome.driver" : chromedriver.path },
	},
	"test_settings": {
		"default": {
			"silent": true,
			"launch_url" : process.env.TEST_URL || "http://localhost:3000",
			"globals": {
				"waitForConditionTimeout": 5000,
				"retryAssertionTimeout": 20000
			},
			"desiredCapabilities": {
				"browserName": "chrome",
				"javascriptEnabled": true,
				"chromeOptions": {
					"args": args,
				},
			},
		},
	},
}
