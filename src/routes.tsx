import { h } from "preact";
/** @jsxImportSource preact */

import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Home from "./home";
import Login from "./login";

const Lazy = () => import("./lazy").then((c) => c.default);

const Routes = () => (
  <Router>
    <Route path="/" component={Home} />
    <Route path="/login" component={Login} />

    <AsyncRoute path="/lazy" getComponent={Lazy} />
  </Router>
);

export default Routes;
