// import moment from "moment";

export class ViewRewatchHomeController {
	constructor($uibModalInstance) {
		"ngInject";

		_.extend(this, {
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
