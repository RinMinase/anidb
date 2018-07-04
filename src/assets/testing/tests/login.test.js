module.exports = {
	'Login': function(browser) {
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
