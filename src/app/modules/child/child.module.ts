import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ChildComponent } from "./child.component";
import { SubchildComponent } from "./subchild/subchild.component";

@NgModule({
	declarations: [ChildComponent, SubchildComponent],
	imports: [
		CommonModule,
		RouterModule.forChild([
			{ path: "", component: ChildComponent, children: [
				{ path: "subchild", component: SubchildComponent },
			]},
		]),
	],
})
export class ChildModule { }
