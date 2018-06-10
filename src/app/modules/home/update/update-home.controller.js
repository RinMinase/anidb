export class UpdateHomeController {
	constructor (
		$log,
		$uibModalInstance,
		firebase,
		data
	) {
		"ngInject";

		_.extend(this, {
			$log,
			$uibModalInstance,
			firebase,
			data,
			titleList: [],
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						data.map((value) => {
							this.titleList.push(value.title);
						});
					});
			}).catch(() => {
				this.$state.go("login");
			});
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
