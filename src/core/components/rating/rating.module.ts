import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";

import { RatingComponent } from "./rating.component";

@NgModule({
	declarations: [RatingComponent],
	imports: [CommonModule, NgbRatingModule],
	exports: [RatingComponent],
	bootstrap: [RatingComponent],
})
export class RatingModule {}
