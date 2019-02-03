import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";

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
