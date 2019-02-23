import { Component, OnInit, Input } from "@angular/core";

@Component({
	selector: "app-skillset",
	templateUrl: "./skillset.component.html",
	styleUrls: ["./skillset.component.scss"],
})
export class SkillsetComponent implements OnInit {
	@Input() sprite: string;
	@Input() name: string;
	@Input() value: number;

	constructor() { }

	ngOnInit() {
	}

}
