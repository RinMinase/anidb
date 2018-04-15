"use strict";

import "./async.scss";
import AsyncController from "./async.controller.js";

export default angular
	.module(
		"async",
		[]
	)
	.controller(
		"AsyncController",
		AsyncController
	);
