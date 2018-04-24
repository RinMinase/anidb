import { GithubContributorService } from "./services/githubContributor.service";
import { WebDevTecService } from "./services/webDevTec.service";

import { NavbarDirective } from "./directives/navbar/navbar.directive";
import { FooterDirective } from "./directives/footer/footer.directive";
import { MalarkeyDirective } from "./directives/malarkey/malarkey.directive";

export default angular
	.module("core", [])

	.service("githubContributor", GithubContributorService)
	.service("webDevTec", WebDevTecService)

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("anidbMalarkey", MalarkeyDirective);
