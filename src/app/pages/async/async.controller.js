"use strict";

function AsyncController($log) {
	"ngInject";

	$log.debug("Hello from Lazy Loaded controller!");
}

export default AsyncController;
