const config = require('../nightwatch.conf.js');

module.exports = {
	'Guinea Pig Assert Title': function(browser) {
		browser
			.url(browser.launchUrl)
			.waitForElementVisible('body')
			.assert.title('I am a page title - Sauce Labs')
			.end();
	}
};
