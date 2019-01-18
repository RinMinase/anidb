require("dotenv").config({ path: "./src/assets/.env" });

module.exports = {
	tags: ["about"],

	"About: Content": (browser) => {
		browser
			.url(`${browser.launchUrl}/login`)
			.waitForElementVisible("body")
			.assert.title("Rin's Anime Database")
			.waitForElementVisible("input[type=email]")
			.waitForElementVisible("input[type=password]")
			.setValue("input[type=email]", process.env.TEST_USERNAME)
			.setValue("input[type=password]", process.env.TEST_PASSWORD)
			.submitForm("form")
			.waitForElementVisible("anidb-navbar")
			.click("anidb-navbar ul:nth-child(2) li:nth-child(1) > a")
			.waitForElementVisible("img.img-user")
			.perform(() => browser.expect.element("img.img-user").to.have.attribute("src"))
			.waitForElementVisible("#line")
			.waitForElementVisible("table.table-statistics")
			.assert.containsText("div.row.mt-4 div.card-header h6", "Changelog")
			.assert.containsText("div.row.my-3 div.card-header h6", "Issues and Future Changes")
			.assert.containsText("div.row.my-3 .card-body h5:nth-child(6)", "Package Update Issues")
			.closeWindow()
			.end();
	}
};
