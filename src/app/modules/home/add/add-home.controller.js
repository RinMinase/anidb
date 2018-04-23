export class AddHomeController {
	constructor(
		$log,
		$uibModalInstance
	) {
		"ngInject";

		this.$log = $log;
		this.$uibModalInstance = $uibModalInstance;

		this.activate();
	}

	activate() {

	}

	cancel() {
		this.$uibModalInstance.dismiss();
	}
}
