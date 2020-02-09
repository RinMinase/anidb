import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ChartsModule } from "@rinminase/ng-charts";

import {
	NgbPaginationModule,
	NgbTooltipModule,
	NgbProgressbarModule,
} from "@ng-bootstrap/ng-bootstrap";

import { AboutComponent } from "./about.component";
import { SkillsetComponent } from "./skillsets/skillset/skillset.component";
import { UnitSpecsComponent } from "./unit-specs/unit-specs.component";
import { FrameworksComponent } from "./frameworks/frameworks.component";
import { SkillsetsComponent } from "./skillsets/skillsets.component";
import { ChangelogComponent } from "./changelog/changelog.component";
import { IssuesComponent } from "./issues/issues.component";
import { DeveloperComponent } from "./developer/developer.component";

const routes: Routes = [{ path: "", component: AboutComponent }];

@NgModule({
	declarations: [
		AboutComponent,
		SkillsetComponent,
		UnitSpecsComponent,
		FrameworksComponent,
		SkillsetsComponent,
		ChangelogComponent,
		IssuesComponent,
		DeveloperComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbPaginationModule,
		NgbProgressbarModule,
		NgbTooltipModule,
		ChartsModule,
		FontAwesomeModule,
	],
})
export class AboutModule {}
