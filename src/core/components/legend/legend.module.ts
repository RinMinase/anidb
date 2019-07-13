import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

import { LegendComponent } from "./legend.component";

@NgModule({
	declarations: [LegendComponent],
	imports: [
		CommonModule,
		NgbTooltipModule,
	],
	exports: [LegendComponent],
})
export class LegendModule { }
