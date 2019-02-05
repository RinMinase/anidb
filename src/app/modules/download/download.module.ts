import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DownloadComponent } from "./download.component";
import { ManageDownloadComponent } from "./manage-download/manage-download.component";

@NgModule({
	declarations: [DownloadComponent, ManageDownloadComponent],
	imports: [
		CommonModule,
	],
})
export class DownloadModule { }
