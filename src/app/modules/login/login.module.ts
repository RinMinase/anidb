import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { LoginComponent } from "./login.component";

const routes: Routes = [{
	path: "login", component: LoginComponent,
}];

@NgModule({
	declarations: [LoginComponent],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		NgbModule,
		ReactiveFormsModule,
	],
})
export class LoginModule { }
