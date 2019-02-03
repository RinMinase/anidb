import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { NavbarComponent } from "./navbar.component";

@NgModule({
	declarations: [NavbarComponent],
	imports: [
		CommonModule,
		RouterModule,
		NgbModule,
	],
	exports: [NavbarComponent],
})
export class NavbarModule { }
