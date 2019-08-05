import "zone.js/dist/zone";

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

const { error } = console;

enableProdMode();
platformBrowserDynamic()
	.bootstrapModule(AppModule)
	.catch((err) => error(err));
