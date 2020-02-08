import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { LegendModule } from "@components/legend/legend.module";
import { SummerComponent } from "./summer.component";
import { ManageSummerComponent } from "./manage-summer/manage-summer.component";
import { AddSummerComponent } from "./add-summer/add-summer.component";

const routes: Routes = [
	{
		path: "",
		component: SummerComponent,
		children: [
			{
				path: "",
				component: ManageSummerComponent,
			},
			{
				path: "manage",
				component: ManageSummerComponent,
			},
		],
	},
];

@NgModule({
	declarations: [SummerComponent, AddSummerComponent, ManageSummerComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModalModule,

		LegendModule,
		FontAwesomeModule,
	],
})
export class SummerModule {}
