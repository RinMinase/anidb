import _ from "lodash";

export class HddController {
	constructor (
		$log
	) {
		"ngInject";

		_.extend(this, {
			$log,
		});

		this.activate();
	}

	activate() {
		// this.firebase.auth()
		// 	.then(() => {
		// 		this.firebase.retrieve("hdd")
		// 			.then((data) => {
		// 				this.formatData(data);
		// 				this.dataLoaded = true;
		// 				this.$scope.$apply();
		// 			});
		// 	}).catch(() => {
		// 		this.$state.go("login");
		// 	});

		this.$log.log("testing!!");
	}

	// formatData() {
	// return data;
	// }
}
