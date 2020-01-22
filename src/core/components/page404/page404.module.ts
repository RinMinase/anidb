import { NgModule, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

@Component({
	selector: "app-page404",
	templateUrl: "./page404.component.html",
	styleUrls: ["./page404.component.scss"],
})
export class Page404Component implements OnInit {

	constructor() { }

	ngOnInit() {
	}

}

@NgModule({
	declarations: [Page404Component],
	imports: [
		CommonModule,
		RouterModule.forChild([{ path: "404", component: Page404Component }]),
	],
	exports: [Page404Component],
})
export class Page404Module { }
