import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { ExportComponent } from "./export.component";
import { CsvComponent } from "./csv/csv.component";
import { ExcelComponent } from "./excel/excel.component";

const routes: Routes = [{
	path: "",
	component: ExportComponent,
	children: [{
		path: "",
		component: ExcelComponent,
	}, {
		path: "csv",
		component: CsvComponent,
	}, {
		path: "excel",
		component: ExcelComponent,
	}],
}];

@NgModule({
	declarations: [ExportComponent, CsvComponent, ExcelComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	],
})
export class ExportModule { }
