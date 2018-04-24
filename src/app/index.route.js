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
