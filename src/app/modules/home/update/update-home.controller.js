export class UpdateHomeController {
	constructor (
		$log,
		$uibModalInstance,
		data
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$uibModalInstance,
			data,
		});

		this.activate();
	}

	activate() {

	}

	cancel() {
		this.$uibModalInstance.close(false);
	}
}
