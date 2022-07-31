import { h } from "preact";
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Home from "./home";
import Login from "./login";

import Page404 from "@components/Page404";

import Test from "./test";

const Lazy = () => import("./lazy").then((c) => c.default);

const Routes = () => (
  <Router>
    <Route path="/" component={Login} />
    <Route path="/home" component={Home} />

    <Route path="/test" component={Test} />
    <AsyncRoute path="/lazy" getComponent={Lazy} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
