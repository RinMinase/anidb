import { FirebaseFactory } from "./services/firebase.factory";
import { GithubApiFactory } from "./services/github-api.factory";

import { NavbarDirective } from "./directives/navbar/navbar.directive";
import { FooterDirective } from "./directives/footer/footer.directive";
import { QualityLegendDirective } from "./directives/quality-legend/quality-legend.directive";
import { RatingDirective } from "./directives/rating/rating.directive";
import { setFocusDirective } from "./directives/set-focus/set-focus.directive";
import { SkillsetBarDirective } from "./directives/skillset-bar/skillset-bar.directive";

import { githubConstants } from "./constants/github-api.constant.js";

export default angular
	.module("core", [])

	.factory("firebase", FirebaseFactory)
	.factory("githubApi", GithubApiFactory)

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("qualityLegend", QualityLegendDirective)
	.directive("rating", RatingDirective)
	.directive("setFocus", setFocusDirective)
	.directive("skillsetBar", SkillsetBarDirective)

	.constant("GITHUB_API", githubConstants());
