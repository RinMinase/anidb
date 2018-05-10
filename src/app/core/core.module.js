import { GithubContributorService } from "./services/githubContributor.service";
import { WebDevTecService } from "./services/webDevTec.service";

import { FirebaseFactory } from "./services/firebase.factory";

import { NavbarDirective } from "./directives/navbar/navbar.directive";
import { FooterDirective } from "./directives/footer/footer.directive";
import { SkillsetBarDirective } from "./directives/skillset-bar/skillset-bar.directive";

export default angular
	.module("core", [])

	.service("githubContributor", GithubContributorService)
	.service("webDevTec", WebDevTecService)

	.factory("firebase", FirebaseFactory)

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("skillsetBar", SkillsetBarDirective);
