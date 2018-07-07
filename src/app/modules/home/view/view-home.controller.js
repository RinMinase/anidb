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

						this.data = data;
						this.dataLoaded = true;
						this.$scope.$apply();
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
}
