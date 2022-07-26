import { h } from "preact";
/** @jsxImportSource preact */

import Router from "preact-router";
import AsyncRoute from "preact-async-route";

import Home from "./home";

const Lazy = () => import("./lazy").then((c) => c.default);

const Routes = () => (
  <Router>
    <Home path="/" />

    <AsyncRoute path="/lazy" getComponent={Lazy} />
  </Router>
);

export default Routes;
