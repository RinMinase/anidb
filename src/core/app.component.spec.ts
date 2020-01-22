import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "../app.module";
import { NavbarComponent } from "@components/navbar/navbar.module";
import { FooterComponent } from "@components/footer/footer.module";

describe("AppComponent", () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [
				AppComponent,
				NavbarComponent,
				FooterComponent,
				NgbCollapse,
			],
		}).compileComponents();
	}));

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	});
});
