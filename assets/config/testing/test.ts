import "zone.js/dist/zone";
import "zone.js/dist/zone-testing";
import "@angular/localize/init";
import { getTestBed } from "@angular/core/testing";
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from "@angular/platform-browser-dynamic/testing";

declare const require: any;

getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);

const context = require.context("../../../", true, /\.spec\.ts$/);
context.keys().map(context);
