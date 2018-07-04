import { NavbarDirective } from "./navbar/navbar.directive";
import { FooterDirective } from "./footer/footer.directive";
import { QualityLegendDirective } from "./quality-legend/quality-legend.directive";
import { RatingDirective } from "./rating/rating.directive";
import { setFocusDirective } from "./set-focus/set-focus.directive";
import { SkillsetBarDirective } from "./skillset-bar/skillset-bar.directive";

export default angular
	.module("directives", [])

	.directive("anidbNavbar", NavbarDirective)
	.directive("anidbFooter", FooterDirective)
	.directive("qualityLegend", QualityLegendDirective)
	.directive("rating", RatingDirective)
	.directive("setFocus", setFocusDirective)
	.directive("skillsetBar", SkillsetBarDirective);
