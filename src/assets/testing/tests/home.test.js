require("dotenv").config({ path: "./src/assets/.env" });

module.exports = {
	tags: ["home"],

	"Home: Navbar and Footer": (browser) => {
		browser
			.url(`${browser.launchUrl}/login`)
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.waitForElementVisible("input[type=email]")
			.waitForElementVisible("input[type=password]")
			.setValue("input[type=email]", process.env.TEST_USERNAME)
			.setValue("input[type=password]", process.env.TEST_PASSWORD)
			.submitForm("form")
			.assert.urlEquals(`${browser.launchUrl}/`)
			.waitForElementVisible("body")
			.assert.elementPresent("anidb-navbar")
			.assert.elementPresent("anidb-footer")
			.closeWindow()
			.end();
	},

	"Home: Add Modal": (browser) => {
		browser
			.url(`${browser.launchUrl}/login`)
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.waitForElementVisible("input[type=email]")
			.waitForElementVisible("input[type=password]")
			.setValue("input[type=email]", process.env.TEST_USERNAME)
			.setValue("input[type=password]", process.env.TEST_PASSWORD)
			.submitForm("form")
			.assert.urlEquals(`${browser.launchUrl}/`)
			.waitForElementVisible("body")
			.assert.elementPresent("a.btn-success")
			.click(".manage-home .row .form-group a.btn-success")
			.waitForElementVisible(".modal")
			.assert.containsText(".modal h4.modal-title", "Add Title")
			.closeWindow()
			.end();
	},
};
