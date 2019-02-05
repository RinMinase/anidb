import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HddComponent } from "./hdd.component";
import { ManageHddComponent } from "./manage-hdd/manage-hdd.component";

@NgModule({
	declarations: [HddComponent, ManageHddComponent],
	imports: [
		CommonModule,
	],
})
export class HddModule { }
