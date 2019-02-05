import extend from "lodash/extend";
import moment from "moment-mini";

import updateHomeDOM from "../update/update-home.html";
import viewRewatchHomeDOM from "./rewatch/view-rewatch-home.html";

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

		extend(this, {
			$scope,
			$state,
			$stateParams,
			$uibModal,
			firebase,
			SweetAlert,

			data: {},
			dataLoaded: false,
			filesizeForUpdateModal: 0,
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

						if (data.variants) {
							data.variants = data.variants.split(",");
						}

						if (data.offquel) {
							data.offquel = data.offquel.split(",");
						}

						this.filesizeForUpdateModal = data.filesize;
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

						if (data.rewatch) {
							data.rewatchCount = data.rewatch.split(",").length;
							data.lastRewatch = moment.unix(data.rewatchLast).format("MMMM DD, YYYY");
						} else {
							data.rewatchCount = 0;
						}

						this.data = data;
						this.dataLoaded = true;
						this.$scope.$digest();
					}).catch(() => this.$state.go("home.manage"));
			}).catch(() => this.$state.go("login"));
	}

	back() {
		this.$state.go("home.manage", {
			id: this.$stateParams.id,
			search: this.$stateParams.search,
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
				this.firebase.hardDelete("anime", this.$stateParams.id)
					.then(() => {
						this.SweetAlert.swal({
							title: "Deleted",
							text: "Entry has been deleted",
							type: "success",
						}, () => {
							this.$state.go("home.manage");
						});
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
				data: () => angular.copy(this.data),
				filesize: () => this.filesizeForUpdateModal,
				id: () => this.$stateParams.id,
				years: () => this._iterateYears(),
			},
		});
	}

	openRewatch() {
		this.$uibModal.open({
			templateUrl: viewRewatchHomeDOM,
			controller: "ViewRewatchHomeController",
			controllerAs: "vm",
			backdrop: "static",
			resolve: {
				id: () => this.$stateParams.id,
				rewatch: () => this.data.rewatch || [],
			},
		});
	}

	_convertFilesize(filesize) {
		filesize = parseFloat(filesize);

		if (filesize === 0) {
			return "";
		} else if (filesize < 1073741824) {
			return `${(filesize / 1048576).toFixed(2)} MB`;
		} else {
			return `${(filesize / 1073741824).toFixed(2)} GB`;
		}
	}

	_iterateYears() {
		const limit = 1995;
		const yearToday = moment().year();
		const years = [{
			id: "0",
			label: "",
		}];

		for (let i = yearToday; i >= limit; i--) {
			years.push({
				id: i.toString(),
				label: i.toString(),
			});
		}

		return years;
	}
}
