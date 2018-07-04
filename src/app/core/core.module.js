import DirectivesModule from "./directives/directives.module";

import { FirebaseFactory } from "./services/firebase.factory";
import { GithubApiFactory } from "./services/github-api.factory";

import { githubConstants } from "./constants/github-api.constant.js";

export default angular
	.module("core", [
		DirectivesModule.name,
	])

	.factory("firebase", FirebaseFactory)
	.factory("githubApi", GithubApiFactory)

	.constant("GITHUB_API", githubConstants());
