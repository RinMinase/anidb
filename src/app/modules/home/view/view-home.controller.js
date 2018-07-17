import moment from "moment";

import updateHomeDOM from "../update/update-home.html";

export class ViewHomeController {
	constructor (
		$scope,
		$state,
		$stateParams,
		$uibModal,
		firebase,
		SweetAlert
	) {
		"ngInject";

		_.extend(this, {
			$scope,
			$state,
			$stateParams,
			$uibModal,
			firebase,
			SweetAlert,

			data: {},
			dataLoaded: false,
		});

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve("anime", this.$stateParams.id)
					.then((data) => {
						if (data.variants) {
							data.shortTitle = data.variants.split(",")
								.sort((a, b) => a.length - b.length)[0];
						}

						data.variants = data.variants.split(",");
						data.offquel = data.offquel.split(",");
						data.filesize = this._convertFilesize(data.filesize);
						data.dateFinished = moment.unix(data.dateFinished)
							.format("MMMM DD, YYYY");

						if (data.duration) {
							const { duration } = data;
							const hours = parseInt(duration / 3600)
								.toString()
								.padStart(2, "0");
							const minutes = parseInt((duration % 3600) / 60)
								.toString()
								.padStart(2, "0");
							const seconds = parseInt((duration % 3600) % 60)
								.toString()
								.padStart(2, "0");

							data.duration = {
								hours,
								minutes,
								seconds,
							};
						}

						this.data = data;
						this.dataLoaded = true;
						this.$scope.$digest();
					}).catch(() => {
						this.$state.go("home.manage");
					});
			}).catch(() => {
				this.$state.go("login");
			});
	}

	deleteTitle() {
		this.SweetAlert.swal({
			title: "Are you sure?",
			text: "Your will not be able to recover this entry!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete it!",
			closeOnConfirm: false,
			closeOnCancel: false,
		}, (isConfirm) => {
			if (isConfirm) {
				this.SweetAlert.swal({
					title: "Deleted",
					text: "Entry has been deleted",
					type: "success",
				});
			} else {
				this.SweetAlert.swal({
					title: "Cancelled",
					text: "Action has been cancelled",
					type: "error",
				});
			}

		});
	}

	editTitle() {
		this.$uibModal.open({
			templateUrl: updateHomeDOM,
			controller: "UpdateHomeController",
			controllerAs: "vm",
			backdrop: "static",
			size: "lg",
			resolve: {
				data: () => this.data,
			},
		});
	}

	_convertFilesize(filesize) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "-";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}
}
