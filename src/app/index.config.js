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

	firebase.initializeApp(firebaseConfig);
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
