export class ManageHddController {
	constructor (
		$log,
		SweetAlert
	) {
		"ngInject";

		_.extend(this, {
			$log,
			SweetAlert,
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

		// this.sweet.option = {
		// 	title: "Are you sure?",
		// 	text: "You will not be able to recover this imaginary file!",
		// 	type: "warning",
		// 	showCancelButton: true,
		// 	confirmButtonColor: "#DD6B55",
		// 	confirmButtonText: "Yes, delete it!",
		// 	cancelButtonText: "No, cancel plx!",
		// 	closeOnConfirm: false,
		// 	closeOnCancel: false,
		// };

		// this.sweet.confirm = {
		// 	title: "Deleted!",
		// 	text: "Your imaginary file has been deleted.",
		// 	type: "success",
		// };

		// this.sweet.cancel = {
		// 	title: "Cancelled!",
		// 	text: "Your imaginary file is safe",
		// 	type: "error",
		// };
	}

	test() {
		this.SweetAlert.info("Testing", "Here's a message!!");
	}

	formatData() {
		return data;
	}
}
