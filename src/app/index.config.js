import firebase from "firebase";

export function config ($logProvider, toastrConfig) {
	"ngInject";
	// Enable logging
	$logProvider.debugEnabled(true);

	toastrConfig.allowHtml = true;
	toastrConfig.timeOut = 3000;
	toastrConfig.positionClass = "toast-top-right";
	toastrConfig.preventDuplicates = true;
	toastrConfig.progressBar = true;

	const firebaseConfig = {
		apiKey: "AIzaSyCVsm1c-nS9qS1fFfFo6JCAb908AfPU6Ag",
		authDomain: "rin-anidb.firebaseapp.com",
		databaseURL: "https://rin-anidb.firebaseio.com",
		projectId: "rin-anidb",
		storageBucket: "rin-anidb.appspot.com",
		messagingSenderId: "669722574117",
	};

	firebase.initializeApp(firebaseConfig);
}

export function runBlock ($log) {
	"ngInject";

	$log.log("runblock!");
}
