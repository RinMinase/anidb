export class ManageHomeController {
	constructor ($log) {
		"ngInject";

		this.$log = $log;

		this.activate();
	}

	activate() {
		this.$log.log("testing!!");
	}
}
