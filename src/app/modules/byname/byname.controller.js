export class ByNameController {
	constructor(
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
