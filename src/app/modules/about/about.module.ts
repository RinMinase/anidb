import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgbPaginationModule, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

import { AboutComponent } from "./about.component";

const routes: Routes = [{ path: "", component: AboutComponent }];

@NgModule({
	declarations: [AboutComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbPaginationModule,
		NgbTooltipModule,
	],
})
export class AboutModule { }
