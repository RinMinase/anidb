import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "@components/navbar/navbar.component";
import { FooterComponent } from "@components/footer/footer.component";

// import { FuseOptionsBuilder } from "@builders/fuse-options.service";
// import { FirebaseQueryBuilder } from "@builders/firebase-query.service";

// import { GithubService } from "@services/github.service";
// import { FirebaseService } from "@services/firebase.service";
// import { UtilityService } from "@services/utility.service";
// import { DateService } from "@services/date.service";

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

describe("DateService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: DateService = TestBed.get(DateService);
	// 	expect(service).toBeTruthy();
	// });
});


describe("FuseService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: FuseService = TestBed.get(FuseService);
	// 	expect(service).toBeTruthy();
	// });
});

describe("FirebaseQueryService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: FirebaseQueryService = TestBed.get(FirebaseQueryService);
	// 	expect(service).toBeTruthy();
	// });
});

describe("GithubService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: GithubService = TestBed.get(GithubService);
	// 	expect(service).toBeTruthy();
	// });
});

describe("FirebaseService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: FirebaseService = TestBed.get(FirebaseService);
	// 	expect(service).toBeTruthy();
	// });
});

describe("UtilityService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: UtilityService = TestBed.get(UtilityService);
	// 	expect(service).toBeTruthy();
	// });
});

