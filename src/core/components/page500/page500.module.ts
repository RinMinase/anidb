import { NgModule, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-page500",
	templateUrl: "./page500.component.html",
	styleUrls: ["./page500.component.scss"],
})
export class Page500Component implements OnInit {
	constructor() {}

	ngOnInit() {}
}

@NgModule({
	declarations: [Page500Component],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: "500", component: Page500Component }]),
	],
	exports: [Page500Component],
})
export class Page500Module {}
