"use strict";

export default class LoginController {
	constructor($log) {
		"ngInject";
		this.$log = $log;
	}

	$onInit() {
		this.$log.log("Testing");
	}
}
