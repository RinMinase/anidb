import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { DropzoneModule, DROPZONE_CONFIG, DropzoneConfigInterface } from "ngx-dropzone-wrapper";

import { ExportComponent } from "./export.component";
import { ExportCsvComponent } from "./export-csv/export-csv.component";
import { ExportExcelComponent } from "./export-excel/export-excel.component";
import { SampleDropzoneComponent } from "./sample-dropzone/sample-dropzone.component";
import { SampleUploadComponent } from "./sample-upload/sample-upload.component";

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
	}, {
		path: "dropzone",
		component: SampleDropzoneComponent,
	}],
}];

const OVERRIDE_DZ_CONFIG: DropzoneConfigInterface = {
	url: "https://localhost:3000/",
	maxFiles: 50,
	maxFilesize: 0.0001,
	acceptedFiles: "image/*",
	parallelUploads: 2,
};

@NgModule({
	declarations: [
		ExportComponent,
		ExportCsvComponent,
		ExportExcelComponent,
		SampleDropzoneComponent,
		SampleUploadComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),

		DropzoneModule,
	],
	providers: [{
		provide: DROPZONE_CONFIG,
		useValue: OVERRIDE_DZ_CONFIG,
	}],
})
export class ExportModule { }
