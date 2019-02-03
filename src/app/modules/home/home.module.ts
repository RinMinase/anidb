import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManageHomeComponent } from "./manage-home/manage-home.component";
import { RouterModule, Routes } from "@angular/router";
import { LegendComponent } from "../../core/components/legend/legend.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [{
	path: "", component: ManageHomeComponent,
}];

@NgModule({
	declarations: [
		ManageHomeComponent,
		LegendComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModule,
	],
})
export class HomeModule { }
