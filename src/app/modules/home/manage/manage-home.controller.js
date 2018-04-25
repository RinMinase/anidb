import firebase from "firebase";
import moment from "moment";
import Promise from "bluebird";

export class ManageHomeController {
	constructor (
		$log,
		$scope,
		$uibModal,
		$window
	) {
		"ngInject";

		this.$log = $log;
		this.$scope = $scope;
		this.$uibModal = $uibModal;
		this.$window = $window;

		this.activate();
	}

	activate() {
		this.validateUser();
	}

	validateUser() {
		const authValidation = () => new Promise((resolve) => {
			firebase.auth().onAuthStateChanged((isAuthenticated) => {
				if (isAuthenticated) {
					dataRetrieve();
					resolve();
				} else {
					this.$window.location.href = "/login";
				}
			});
		});

		const dataRetrieve = () => new Promise((resolve) => {
			firebase.database()
				.ref("/anime")
				.once("value")
				.then((data) => {
					this.data = data.val();

					this.data.map((value) => {
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
					});

					this.$scope.$apply();
					resolve();
				});
		});

		authValidation();
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
