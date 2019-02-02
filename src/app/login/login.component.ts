import { Component, OnInit, Renderer } from "@angular/core";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

	constructor(private renderer: Renderer) { }

	ngOnInit() { }

	rerenderInputFocus(event: any) {
		this.renderer.setElementClass(event.target.parentNode, "focused", true);
	}

	rerenderInputBlur(event: any) {
		if (!event.target.value){
			this.renderer.setElementClass(event.target, "filled", false);
			this.renderer.setElementClass(event.target.parentNode, "focused", false);
		} else {
			this.renderer.setElementClass(event.target, "focused", true);
		}
	}
}
