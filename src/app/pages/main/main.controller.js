"use strict";

import  _ from "lodash/core";
import moment from "moment";
import angularLogo from "_images/angular.png";

export default class MainController {
	constructor($log) {
		"ngInject";
		this.$log = $log;
	}

	$onInit() {
		this.lodashVersion = _.VERSION;
		this.momentVersion = moment.version;
		this.angularLogo = angularLogo;
	}
}
