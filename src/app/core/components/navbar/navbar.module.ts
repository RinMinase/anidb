import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbCollapseModule, NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

import { NavbarComponent } from "./navbar.component";

@NgModule({
	declarations: [NavbarComponent],
	imports: [
		CommonModule,
		RouterModule,

		NgbCollapseModule,
		NgbDropdownModule,
	],
	exports: [NavbarComponent],
})
export class NavbarModule { }
