module.exports = {
	tags: ["login"],

	'Login: Spinner Test': function(browser) {
		browser
			.url(browser.launchUrl + "login")
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", "nightwatch@testing.com")
			.setValue("input[type=password]", "-")
			.submitForm("form")
			.assert.elementPresent(".spinner.eclipse")
			.end();
	},

	'Login: Invalid Credentials': function(browser) {
		browser
			.url(browser.launchUrl + "login")
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", "nightwatch@testing.com")
			.setValue("input[type=password]", "invalid")
			.submitForm("form")
			.assert.elementPresent(".alert.alert-dismissible")
			.end();
	},

	'Login: Valid Credentials': function(browser) {
		browser
			.url(browser.launchUrl + "login")
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", "nightwatch@testing.com")
			.setValue("input[type=password]", "nightwatch")
			.submitForm("form")
			.assert.urlEquals(browser.launchUrl)
			.waitForElementVisible("body")
			.assert.elementPresent("#animeTable")
			.end();
	}
};
