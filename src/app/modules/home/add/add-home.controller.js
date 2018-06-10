export class AddHomeController {
	constructor(
		$log,
		$uibModalInstance,
		titleList
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$uibModalInstance,
			titleList,
		});

		this.activate();
	}

	activate() {

	}

	cancel() {
		this.$uibModalInstance.close(false);
	}
}
