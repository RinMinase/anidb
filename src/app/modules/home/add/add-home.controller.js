export class AddHomeController {
	constructor(
		$uibModalInstance,
		titleList
	) {
		"ngInject";

		_.extend(this, {
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

	removeNonNumeric() {
		this.data.filesize = this.data.filesize.replace(/\D/g, "");
	}
}
