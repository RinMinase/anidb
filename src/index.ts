import "zone.js/dist/zone";
import "@angular/localize/init";

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app.module";

const { error } = console;

enableProdMode();
platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => error(err));
