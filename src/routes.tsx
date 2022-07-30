import { h } from "preact";
/** @jsxImportSource preact */

import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Test from "./test";
import Login from "./login";
import Page404 from "@components/Page404";

const Lazy = () => import("./lazy").then((c) => c.default);

const Routes = () => (
  <Router>
    <Route path="/" component={Login} />

    <Route path="/test" component={Test} />
    <AsyncRoute path="/lazy" getComponent={Lazy} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
