"use strict";

import "./footer.scss";

import footerDOM from "./footer.html";
import FooterController from "./footer.controller";

export default angular
	.module("footer", [])
	.component("footerTest", {
		templateUrl: footerDOM,
		controller: FooterController,
	});
