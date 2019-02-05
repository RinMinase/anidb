import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SkillsetComponent } from "./skillset.component";

@NgModule({
	declarations: [SkillsetComponent],
	imports: [
		CommonModule,
	],
	exports: [SkillsetComponent],
})
export class SkillsetModule { }
