import _ from "lodash";

export class ViewHomeController {
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
