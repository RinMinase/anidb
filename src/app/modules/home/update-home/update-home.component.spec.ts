import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { UpdateHomeComponent } from "./update-home.component";

describe("UpdateHomeComponent", () => {
	let component: UpdateHomeComponent;
	let fixture: ComponentFixture<UpdateHomeComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ UpdateHomeComponent ],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UpdateHomeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
