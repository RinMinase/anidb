require("dotenv").config({ path: "./src/assets/.env" });

const { log } = console;

log("\nConfiguration Detals:");
log("=====================");
log(`URL: ${process.env.TEST_URL}`);
log(`Username: ${process.env.TEST_USERNAME}`);
log(`Headless: ${process.env.TEST_HEADLESS || "false"}\n`);

const args = [
	"--log-level=3",
	"--disable-extensions",
	"--silent",
];

if (process.env.TEST_HEADLESS === "true") {
	args.push("--proxy-server='direct://'");
	args.push("--proxy-bypass-list=*");
	args.push("--headless");
}

/* eslint-disable camelcase */
module.exports = {
	src_folders: ["src/assets/testing/tests"],
	output_folder: false,
	selenium: { start_process: false },
	globals_path: "./chromedriver.conf.js",
	test_settings: {
		default: {
			selenium_host: "127.0.0.1",
			selenium_port: 9515,
			silent: true,
			launch_url : process.env.TEST_URL || "http://localhost:3000",
			globals: {
				waitForConditionTimeout: 5000,
				retryAssertionTimeout: 20000,
			},
			desiredCapabilities: {
				browserName: "chrome",
				javascriptEnabled: true,
				chromeOptions: { args },
			},
		},
	},
};
