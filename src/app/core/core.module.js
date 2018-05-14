import { FirebaseFactory } from "./services/firebase.factory";

import { NavbarDirective } from "./directives/navbar/navbar.directive";
import { FooterDirective } from "./directives/footer/footer.directive";
import { QualityLegendDirective } from "./directives/quality-legend/quality-legend.directive";
import { SkillsetBarDirective } from "./directives/skillset-bar/skillset-bar.directive";

export default angular
	.module("core", [])

	.factory("firebase", FirebaseFactory)

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("qualityLegend", QualityLegendDirective)
	.directive("skillsetBar", SkillsetBarDirective);
