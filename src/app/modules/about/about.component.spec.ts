import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AboutComponent } from "./about.component";
import { UnitSpecsComponent } from "./unit-specs/unit-specs.component";
import { FrameworksComponent } from "./frameworks/frameworks.component";
import { SkillsetsComponent } from "./skillsets/skillsets.component";

describe("AboutComponent", () => {
	// let component: AboutComponent;
	// let fixture: ComponentFixture<AboutComponent>;

	// beforeEach(async(() => {
	// 	TestBed.configureTestingModule({
	// 		declarations: [ AboutComponent ],
	// 	})
	// 	.compileComponents();
	// }));

	// beforeEach(() => {
	// 	fixture = TestBed.createComponent(AboutComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();
	// });

	// it("should create", () => {
	// 	expect(component).toBeTruthy();
	// });
});

describe("UnitSpecsComponent", () => {
	// let component: UnitSpecsComponent;
	// let fixture: ComponentFixture<UnitSpecsComponent>;

	// beforeEach(async(() => {
	// 	TestBed.configureTestingModule({
	// 		declarations: [ UnitSpecsComponent ],
	// 	})
	// 	.compileComponents();
	// }));

	// beforeEach(() => {
	// 	fixture = TestBed.createComponent(UnitSpecsComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();
	// });

	// it("should create", () => {
	// 	expect(component).toBeTruthy();
	// });
});

describe("FrameworksComponent", () => {
	// let component: FrameworksComponent;
	// let fixture: ComponentFixture<FrameworksComponent>;

	// beforeEach(async(() => {
	// 	TestBed.configureTestingModule({
	// 		declarations: [ FrameworksComponent ],
	// 	})
	// 	.compileComponents();
	// }));

	// beforeEach(() => {
	// 	fixture = TestBed.createComponent(FrameworksComponent);
	// 	component = fixture.componentInstance;
	// 	fixture.detectChanges();
	// });

	// it("should create", () => {
	// 	expect(component).toBeTruthy();
	// });
});

describe("SkillsetsComponent", () => {
	let component: SkillsetsComponent;
	let fixture: ComponentFixture<SkillsetsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ SkillsetsComponent ],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SkillsetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
