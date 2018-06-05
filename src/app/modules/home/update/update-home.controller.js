export class UpdateHomeController {
	constructor (
		$log,
		$uibModalInstance
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$uibModalInstance,
		});

		this.activate();
	}

	activate() {

	}

	cancel() {
		this.$uibModalInstance.close(false);
	}
}
