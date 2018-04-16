export function routerConfig ($stateProvider, $urlRouterProvider) {
	"ngInject";

	$stateProvider
		.state("login", {
			url: "/",
			templateUrl: "app/modules/login/login.html",
			controller: "LoginController",
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
