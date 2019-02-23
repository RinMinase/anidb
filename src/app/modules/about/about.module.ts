import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ChartsModule } from "ng2-charts";

import {
	NgbPaginationModule,
	NgbTooltipModule,
	NgbProgressbarModule,
} from "@ng-bootstrap/ng-bootstrap";

import { AboutComponent } from "./about.component";
import { SkillsetComponent } from "./skillset/skillset.component";
import { UnitSpecsComponent } from "./unit-specs/unit-specs.component";
import { FrameworksComponent } from "./frameworks/frameworks.component";

const routes: Routes = [{ path: "", component: AboutComponent }];

@NgModule({
	declarations: [
		AboutComponent,
		SkillsetComponent,
		UnitSpecsComponent,
		FrameworksComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbPaginationModule,
		NgbProgressbarModule,
		NgbTooltipModule,
		ChartsModule,
	],
})
export class AboutModule { }
