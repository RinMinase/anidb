import DirectivesModule from "./directives/directives.module";

import { FirebaseFactory } from "./services/firebase.factory";
import { GithubApiFactory } from "./services/github-api.factory";
import { JikanApiFactory } from "./services/jikan-api.factory";
import { RandomizerFactory } from "./services/randomizer.factory";

import { FuseOptionsBuilder } from "./services/builders/fuse-options.builder";

import { githubConstants } from "./constants/github-api.constant.js";

export default angular
	.module("core", [ DirectivesModule.name ])

	.factory("firebase", FirebaseFactory)
	.factory("githubApi", GithubApiFactory)
	.factory("jikanApi", JikanApiFactory)
	.factory("randomizer", RandomizerFactory)

	.factory("fuseOptionsBuilder", FuseOptionsBuilder)

	.constant("GITHUB_API", githubConstants());
