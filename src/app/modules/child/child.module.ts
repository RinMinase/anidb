import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChildComponent } from "./child.component";
import { ManageComponent } from "./manage/manage.component";
import { AddComponent } from "./add/add.component";

@NgModule({
	declarations: [ChildComponent, ManageComponent, AddComponent],
	imports: [
		CommonModule,
	],
})
export class ChildModule { }
