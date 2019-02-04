import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./about.component";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [{ path: "", component: AboutComponent }];

@NgModule({
	declarations: [AboutComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModule,
	],
})
export class AboutModule { }
