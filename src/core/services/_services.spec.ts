import { TestBed } from "@angular/core/testing";

import { DarkModeService } from '@services/dark-mode.service';
// import { FirebaseService } from "@services/firebase.service";
// import { GithubService } from "@services/github.service";
// import { UtilityService } from "@services/utility.service";
// import { ApiService } from "@services/api.service";

describe("DarkModeService", () => {
	beforeEach(() => TestBed.configureTestingModule({}));

	it("should be created", () => {
		const service: DarkModeService = TestBed.get(DarkModeService);
		expect(service).toBeTruthy();
	});

	it("retrieve dark mode status", () => {
		const service: DarkModeService = TestBed.get(DarkModeService);

		service.enableDarkMode();
		service.currentState.subscribe((result) => expect(result).toBeTruthy()).unsubscribe();

		service.disableDarkMode();
		service.currentState.subscribe((result) => expect(result).toBeFalsy()).unsubscribe();
	});
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

// ng9 generated test case
describe("ApiService", () => {
	// let service: ApiService;

	// beforeEach(() => {
	// 	TestBed.configureTestingModule({});
	// 	service = TestBed.inject(ApiService);
	// });

	// it("should be created", () => {
	// 	expect(service).toBeTruthy();
	// });
});
