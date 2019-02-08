import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { ManageHomeComponent } from "./manage-home/manage-home.component";
import { LegendModule } from "../../core/components/legend/legend.module";
import { ViewHomeComponent } from "./view-home/view-home.component";
import { AddHomeComponent } from "./add-home/add-home.component";
import { UpdateHomeComponent } from "./update-home/update-home.component";
import { HomeComponent } from "./home.component";

const routes: Routes = [{
	path: "", component: ManageHomeComponent,
}];

@NgModule({
	declarations: [
		HomeComponent,
		ManageHomeComponent,
		ViewHomeComponent,
		AddHomeComponent,
		UpdateHomeComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,

		LegendModule,
	],
})
export class HomeModule { }
