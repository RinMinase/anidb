import { h } from "preact";
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Home from "./home";
import Login from "./login";

import Page404 from "@components/pages/Page404";

const Registration = () => import("./registration").then((c) => c.default);

const Routes = () => (
  <Router>
    <Route path="/" component={Login} />
    <Route path="/home" component={Home} />

    <AsyncRoute path="/register" getComponent={Registration} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
