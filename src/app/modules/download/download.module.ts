import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";

import { DownloadComponent } from "./download.component";
import { AddSeasonComponent } from "./add-season/add-season.component";
import { AddTitleComponent } from "./add-title/add-title.component";

@NgModule({
	declarations: [
		AddSeasonComponent,
		AddTitleComponent,
		DownloadComponent,
	],
	imports: [
		CommonModule,
		NgbModalModule,
	],
	entryComponents: [
		AddSeasonComponent,
		AddTitleComponent,
	],
})
export class DownloadModule { }
