import firebase from "firebase";

export function config (
	$locationProvider,
	$logProvider,
	$urlRouterProvider,
	toastrConfig
) {
	"ngInject";
	// Enable logging
	$logProvider.debugEnabled(true);

	$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode(true);

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

	if (process.env.DATABASE !== "testing") {
		firebase.initializeApp(firebaseConfig);
	}

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

export function runBlock () {
	"ngInject";
}

export function routerConfig ($stateProvider) {
	"ngInject";

	$stateProvider
		.state("firetest", {
			url: "/firetest",
			templateUrl: "app/firetest/firetest.html",
			controller: "FiretestController",
			controllerAs: "vm",
		})
		.state("main", {
			url: "/main",
			templateUrl: "app/main/main.html",
			controller: "MainController",
			controllerAs: "main",
		});
}
