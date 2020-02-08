import { TestBed } from "@angular/core/testing";
import { HttpClientModule } from '@angular/common/http';

import { DarkModeService } from "@services/dark-mode.service";
import { FirebaseService } from "@services/firebase.service";
import { GithubService } from "@services/github.service";
import { UtilityService } from "@services/utility.service";
import { ApiService } from "@services/api.service";
import { UserService } from "@services/user.service";

describe("DarkModeService", () => {
	let service: DarkModeService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DarkModeService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	it("retrieve dark mode status", () => {
		service.enableDarkMode();
		service.currentState.subscribe((result) => expect(result).toBeTruthy()).unsubscribe();

		service.disableDarkMode();
		service.currentState.subscribe((result) => expect(result).toBeFalsy()).unsubscribe();
	});
});

describe("GithubService", () => {
	let service: GithubService;

	beforeEach(() => {
		TestBed.configureTestingModule({ imports: [HttpClientModule] });
		service = TestBed.inject(GithubService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});

describe("FirebaseService", () => {
	let service: FirebaseService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(FirebaseService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});

describe("UtilityService", () => {
	let service: UtilityService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(UtilityService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});

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
