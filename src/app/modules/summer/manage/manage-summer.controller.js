import _ from "lodash";

export class ManageSummerController {
	constructor (
		$log
	) {
		"ngInject";

		_.extend(this, {
			$log,
		});

		this.activate();
	}

	activate() {

	}
}
