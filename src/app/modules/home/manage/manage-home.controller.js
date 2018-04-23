export class ManageHomeController {
	constructor (
		$log,
		$scope,
		$uibModal
	) {
		"ngInject";

		this.$log = $log;
		this.$uibModal = $uibModal;

		this.activate();
	}

	activate() {
		this.$log.log("testing!!");
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
