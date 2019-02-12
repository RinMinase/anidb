import { TestBed, async } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbCollapse } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { NavbarComponent } from "@components/navbar/navbar.component";
import { FooterComponent } from "@components/footer/footer.component";

import { FuseService } from "@builders/fuse.service";
import { FirebaseQueryService } from "@builders/firebase-query.service";

import { GithubService } from "@services/github.service";
import { FirebaseService } from "@services/firebase.service";

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
