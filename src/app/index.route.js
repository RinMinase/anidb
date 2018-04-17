export function routerConfig ($stateProvider, $urlRouterProvider) {
	"ngInject";

	$stateProvider
		.state("home_manage", {
			url: "/",
			templateUrl: "app/modules/home/manage/manage-home.html",
			controller: "ManageHomeController",
			controllerAs: "vm",
		})
		.state("login", {
			url: "/login",
			templateUrl: "app/modules/login/login.html",
			controller: "LoginController",
			controllerAs: "vm",
		})
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

	$urlRouterProvider.otherwise("/");
}
