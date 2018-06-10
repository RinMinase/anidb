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

			data: {
				offquel: "",
			},
		});

		this.activate();
	}

	activate() {

	}

	addOffquel() {
		if (!this.data.offquel) {
			this.data.offquel = this.offquelSelection;
			this.offquelSelection = "";
		} else {
			this.data.offquel += `, ${this.offquelSelection}`;
			this.offquelSelection = "";
		}
	}

	cancel() {
		this.$uibModalInstance.close(false);
	}
}
