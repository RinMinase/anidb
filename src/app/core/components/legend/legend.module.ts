import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { LegendComponent } from "./legend.component";

@NgModule({
	declarations: [LegendComponent],
	imports: [
		CommonModule,
		NgbModule,
	],
	exports: [LegendComponent],
})
export class LegendModule { }
