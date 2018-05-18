export class SummerController {
	constructor (
		$log
	) {
		"ngInject";

		this.$log = $log;

		this.activate();
	}

	activate() {
		this.$log.log("Summer!!!");
	}
}
