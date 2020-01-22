import { NgModule, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
	selector: "app-footer",
	templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

}

@NgModule({
	declarations: [FooterComponent],
	imports: [CommonModule],
	exports: [FooterComponent],
})
export class FooterModule { }
