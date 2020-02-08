import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { DownloadComponent } from "./download.component";
import { AddSeasonComponent } from "./add-season/add-season.component";
import { AddTitleComponent } from "./add-title/add-title.component";

const routes: Routes = [{ path: "", component: DownloadComponent }];

@NgModule({
	declarations: [AddSeasonComponent, AddTitleComponent, DownloadComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModalModule,
		FontAwesomeModule,
	],
})
export class DownloadModule {}
