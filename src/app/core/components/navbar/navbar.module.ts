import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
	declarations: [NavbarComponent],
	imports: [
		CommonModule,
		NgbModule,
	],
	exports: [NavbarComponent],
})
export class NavbarModule { }
