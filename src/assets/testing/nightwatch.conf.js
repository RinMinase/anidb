const seleniumServer = require("selenium-server");
const chromedriver = require("chromedriver");

module.exports = {
  "src_folders": ["src/assets/testing/tests"],
  "output_folder": false,
  "selenium": {
    "start_process": true,
	"log_path": false,
    "server_path": seleniumServer.path,
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": { "webdriver.chrome.driver" : chromedriver.path }
  },
  "test_settings": {
    "default": {
      "launch_url" : "https://saucelabs.com/test/guinea-pig",
      "globals": { "waitForConditionTimeout": 3000 },
      "desiredCapabilities": { "browserName": "chrome" }
    },
    "chrome": {
      "launch_url" : "https://saucelabs.com/test/guinea-pig",
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true
      }
    }
  }
}
