// import Fuse from "fuse.js";
import moment from "moment";

export class ManageHomeController {
	constructor (
		$log,
		$scope,
		$uibModal,
		$window,
		firebase
	) {
		"ngInject";

		this.$log = $log;
		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.$window = $window;
		this.firebase = firebase;
		this.dataLoaded = false;
		// this.$scope.search = "";

		this.activate();
	}

	activate() {
		this.firebase.auth()
			.then(() => {
				this.firebase.retrieve()
					.then((data) => {
						this.formatData(data);

						this.data = data;
						this.dataLoaded = true;
						this.$scope.$apply();
					});
			}).catch(() => {
				this.$window.location.href = "/login";
			});
	}

	formatData(data) {
		return data.map((value) => {
			const filesize = parseFloat(value.filesize);

			if (filesize === 0) {
				value.filesize = "-";
			} else if (filesize < 1073741824) {
				value.filesize = `${(filesize / 1048576).toFixed(2)} MB`;
			} else {
				value.filesize = `${(filesize / 1073741824).toFixed(2)} GB`;
			}

			value.dateFinished = moment.unix(value.dateFinished)
				.format("MMM DD, YYYY");

			delete value.duration;
			delete value.firstSeasonTitle;
			delete value.inhdd;
			delete value.offquel;
			delete value.prequel;
			delete value.rating;
			delete value.seasonNumber;
			delete value.sequel;
			delete value.watchStatus;
		});
	}

	addTitle() {
		this.$uibModal.open({
			templateUrl: "app/modules/home/add/add-home.html",
			controller: "AddHomeController",
			controllerAs: "vm",
			backdrop: "static",
		});
	}
}
