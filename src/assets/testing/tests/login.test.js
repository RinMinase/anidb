require("dotenv").config({ path: "./src/assets/.env" });

module.exports = {
	tags: ["login"],

	'Login: Spinner Test': (browser) => {
		browser
			.url(`${browser.launchUrl}/login`)
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", process.env.TEST_USERNAME)
			.setValue("input[type=password]", process.env.TEST_PASSWORD)
			.submitForm("form")
			.assert.elementPresent(".spinner.eclipse")
			.closeWindow()
			.end();
	},

	'Login: Invalid Credentials': (browser) => {
		browser
			.url(`${browser.launchUrl}/login`)
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", process.env.TEST_USERNAME)
			.setValue("input[type=password]", "invalid")
			.submitForm("form")
			.assert.elementPresent(".alert.alert-dismissible")
			.closeWindow()
			.end();
	},

	'Login: Valid Credentials': (browser) => {
		browser
			.url(`${browser.launchUrl}/login`)
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", process.env.TEST_USERNAME)
			.setValue("input[type=password]", process.env.TEST_PASSWORD)
			.submitForm("form")
			.assert.urlEquals(`${browser.launchUrl}/`)
			.waitForElementVisible("body")
			.assert.elementPresent("#animeTable")
			.closeWindow()
			.end();
	}
};
