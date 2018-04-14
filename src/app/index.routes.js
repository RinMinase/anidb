"use strict";

// eslint-disable-next-line
import asyncTemplate from "!!file-loader?name=templates/[name].[ext]!./pages/async/async.html";

function routeConfig(
	$urlRouterProvider,
	$stateProvider,
	resolverProvider) {

	"ngInject";

	// eslint-disable-next-line angular/controller-as-route
	$stateProvider.state("main", {
		url: "/main",
		component: "main",
	}).state("login", {
		url: "/",
		component: "login",
	}).state("async", {
		url: "/async",
		templateUrl: asyncTemplate,
		resolve: {
			asyncPreloading: resolverProvider.asyncPagePrealoading,
		},
	});

	$urlRouterProvider.otherwise("/");
}

export default angular
	.module("index.routes", [])
	.config(routeConfig);
