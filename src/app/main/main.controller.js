import firebase from "firebase";

export class MainController {
	constructor ($log,
		$timeout,
		webDevTec,
		toastr,
		moment) {
		"ngInject";

		this.awesomeThings = [];
		this.classAnimation = "";
		this.creationDate = 1523752554551;
		this.toastr = toastr;
		this.$log = $log;

		this.firebaseVersion = firebase.SDK_VERSION;
		this.momentVersion = moment.version;

		this.activate($timeout, webDevTec);
	}

	activate($timeout, webDevTec) {
		this.getWebDevTec(webDevTec);
		$timeout(() => {
			this.classAnimation = "rubberBand";
		}, 4000);
	}

	getWebDevTec(webDevTec) {
		this.awesomeThings = webDevTec.getTec();

		angular.forEach(this.awesomeThings, (awesomeThing) => {
			awesomeThing.rank = Math.random();
		});
	}

	showToastr() {
		this.toastr.info(
			"Fork <a href=\"https://github.com/Swiip/generator-gulp-angular\" target=\"_blank\">\
				<b>generator-gulp-angular</b>\
			</a>"
		);
		this.classAnimation = "";
	}
}
