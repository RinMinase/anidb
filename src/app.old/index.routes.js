"use strict";

// eslint-disable-next-line
import asyncTemplate from "!!file-loader?name=templates/[name].[ext]!./pages/async/async.html";

export function routeConfig(
	$urlRouterProvider,
	$stateProvider,
	resolverProvider) {

	"ngInject";

	$stateProvider.state("main", {
		url: "/main",
		component: "main",
	}).state("login", {
		url: "/",
		templateUrl: "/app/pages/login/login.html",
		controller: "LoginController",
		controllerAs: "vm",
	}).state("async", {
		url: "/async",
		templateUrl: asyncTemplate,
		resolve: {
			asyncPreloading: resolverProvider.asyncPagePrealoading,
		},
	});

	$urlRouterProvider.otherwise("/");
}

// export default angular
// 	.module("index.routes", [])
// 	.config(routeConfig);
