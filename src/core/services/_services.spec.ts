import { TestBed } from "@angular/core/testing";

import { DarkModeService } from "@services/dark-mode.service";
// import { FirebaseService } from "@services/firebase.service";
// import { GithubService } from "@services/github.service";
// import { UtilityService } from "@services/utility.service";
import { ApiService } from "@services/api.service";
import { UserService } from "@services/user.service";
import { HttpClientModule } from '@angular/common/http';

describe("DarkModeService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: DarkModeService = TestBed.inject(DarkModeService);
		expect(service).toBeTruthy();
	});

	it("retrieve dark mode status", () => {
		const service: DarkModeService = TestBed.inject(DarkModeService);

		service.enableDarkMode();
		service.currentState.subscribe((result) => expect(result).toBeTruthy()).unsubscribe();

		service.disableDarkMode();
		service.currentState.subscribe((result) => expect(result).toBeFalsy()).unsubscribe();
	});
});

describe("GithubService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: GithubService = TestBed.inject(GithubService);
	// 	expect(service).toBeTruthy();
	// });
});

describe("FirebaseService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: FirebaseService = TestBed.inject(FirebaseService);
	// 	expect(service).toBeTruthy();
	// });
});

describe("UtilityService", () => {
	// beforeEach(() => TestBed.configureTestingModule({}));

	// it("should be created", () => {
	// 	const service: UtilityService = TestBed.inject(UtilityService);
	// 	expect(service).toBeTruthy();
	// });
});

// ng9 generated test cases
describe("ApiService", () => {
	let service: ApiService;

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HttpClientModule] });
		service = TestBed.inject(ApiService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});

describe("UserService", () => {
	let service: UserService;

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HttpClientModule] });
		service = TestBed.inject(UserService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
