import { NgModule, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
	selector: "app-sidebar",
	templateUrl: "./sidebar.component.html",
	styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}

@NgModule({
	declarations: [SidebarComponent],
	imports: [CommonModule, RouterModule],
	exports: [SidebarComponent],
})
export class SidebarModule {}
