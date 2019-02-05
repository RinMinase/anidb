import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SummerComponent } from "./summer.component";
import { ManageSummerComponent } from "./manage-summer/manage-summer.component";

@NgModule({
	declarations: [SummerComponent, ManageSummerComponent],
	imports: [
		CommonModule,
	],
})
export class SummerModule { }
