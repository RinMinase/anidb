import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ChildComponent } from "./child.component";
import { ManageComponent } from "./manage/manage.component";
import { AddComponent } from "./add/add.component";

@NgModule({
	declarations: [ChildComponent, ManageComponent, AddComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([{
			path: "",
			component: ChildComponent,
			children: [{
				path: "",
				component: ManageComponent,
			}, {
				path: "add",
				component: AddComponent,
			}],
		}]),
	],
})
export class ChildModule { }
