import firebase from "firebase/app";

export function config(
	$locationProvider,
	$logProvider,
	$urlRouterProvider
) {
	"ngInject";

	// Enable logging
	$logProvider.debugEnabled(true);

	$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode(true);

	// _.extend(toastrConfig, {
	// 	allowHtml: true,
	// 	positionClass: "toast-top-right",
	// 	preventDuplicates: true,
	// 	progressBar: true,
	// 	timeout: 3000,
	// });

	const firebaseConfig = {
		apiKey: "AIzaSyCVsm1c-nS9qS1fFfFo6JCAb908AfPU6Ag",
		authDomain: "rin-anidb.firebaseapp.com",
		databaseURL: "https://rin-anidb.firebaseio.com",
		projectId: "rin-anidb",
		storageBucket: "rin-anidb.appspot.com",
		messagingSenderId: "669722574117",
	};

	firebase.initializeApp(firebaseConfig);

	// eslint-disable-next-line no-unused-vars
	const fuseOptions = {
		shouldSort: true,
		threshold: 0.6,
		location: 0,
		distance: 100,
		maxPatternLength: 64,
		minMatchCharLength: 1,
		keys: [
			"title",
			"quality",
			"releaseSeason",
			"releaseYear",
			"encoder",
			"variants",
			"remarks",
		],
	};
}

export function run() {
	"ngInject";
}
