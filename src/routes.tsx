import { h } from "preact";
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Login from "./login";

import Page404 from "@components/pages/Page404";

type Props = {
  onChange: () => void;
}

const Registration = () => import("./registration").then((c) => c.default);
const Home = () => import("./home").then((c) => c.default);

const Routes = (props: Props) => (
  <Router onChange={props.onChange}>
    <Route path="/" component={Login} />

    <AsyncRoute path="/register" getComponent={Registration} />
    <AsyncRoute path="/home" getComponent={Home} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
