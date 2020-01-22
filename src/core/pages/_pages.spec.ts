import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NotFoundComponent } from "./not-found/not-found.component";
import { ServerErrorComponent } from "./server-error/server-error.component";

describe("NotFoundComponent", () => {
	let component: ServerErrorComponent;
	let fixture: ComponentFixture<ServerErrorComponent>;

	beforeEach(async(() => {
		TestBed
			.configureTestingModule({ declarations: [ ServerErrorComponent ] })
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ServerErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});


describe("NotFoundComponent", () => {
	let component: NotFoundComponent;
	let fixture: ComponentFixture<NotFoundComponent>;

	beforeEach(async(() => {
		TestBed
			.configureTestingModule({ declarations: [ NotFoundComponent ] })
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NotFoundComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
