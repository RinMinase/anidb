module.exports = {
	'Login Testing': function(browser) {
		browser
			.url(browser.launchUrl + "login")
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.assert.visible("input[type=email]")
			.assert.visible("input[type=password]")
			.setValue("input[type=email]", "nightwatch@testing.com")
			.setValue("input[type=password]", "nightwatch")
			.waitForElementVisible("button", 1000)
			.click("button")
			.pause(2000)
			.url(browser.launchUrl)
			.pause(2000)
			.waitForElementVisible("body")
			.assert.elementPresent("#animeTable")
			.end();
	}
};
