import firebase from "firebase/app";

export function config(
	$locationProvider,
	$logProvider,
	$ocLazyLoadProvider,
	$qProvider,
	$urlRouterProvider
) {
	"ngInject";

	// Enable logging
	$logProvider.debugEnabled(true);

	$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode(true);

	$qProvider.errorOnUnhandledRejections(false);

	// extend(toastrConfig, {
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

	$ocLazyLoadProvider.config({
		debug: true,
		events: true,
	});
}

export function run($document, $transitions) {
	"ngInject";

	$transitions.onSuccess({}, () => {
		$document[0].body.scrollTop = $document[0].documentElement.scrollTop = 0;
	});
}
