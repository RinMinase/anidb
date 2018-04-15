"use strict";

import "./login.scss";
import logo from "_images/logo.png";

export class LoginController {
	constructor($log, $scope) {
		"ngInject";

		this.$log = $log;
		this.scope = $scope;
		this.logo = logo;
		this.scope.email = "x";

		this.activate();
	}

	// $onInit() {
	// 	this.submitForm();
	// }

	activate() {
		this.$log.log(this.scope.email);
	}

	submitForm() {
		this.$log.log(this.scope.email);
	}
}
