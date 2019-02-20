import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { ExportComponent } from "./export.component";
import { ExportCsvComponent } from "./export-csv/export-csv.component";
import { ExportExcelComponent } from "./export-excel/export-excel.component";

const routes: Routes = [{
	path: "",
	component: ExportComponent,
	children: [{
		path: "",
		component: ExportExcelComponent,
	}, {
		path: "csv",
		component: ExportCsvComponent,
	}, {
		path: "excel",
		component: ExportExcelComponent,
	}],
}];

@NgModule({
	declarations: [ExportComponent, ExportCsvComponent, ExportExcelComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
})
export class ExportModule { }
