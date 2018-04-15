"use strict";

// eslint-disable-next-line angular/module-setter
const shared = angular.module("core", []);

import validationTestDirective from "./directives/validationTest.directive";

import constants from "./services/constants";
import storeFactory from "./services/store.factory";
import resolverProvider from "./services/resolver.provider";

validationTestDirective(shared);

constants(shared);
storeFactory(shared);
resolverProvider(shared);

export default shared;
