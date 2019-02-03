import { Component, OnInit, Input, NgModule } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
	selector: "app-legend",
	templateUrl: "./legend.component.html",
	styleUrls: ["./legend.component.scss"],
})
export class LegendComponent implements OnInit {
	@Input() value: string;

	constructor() { }

	ngOnInit() {
	}
}
