import { h } from "preact";
import { Router, Route } from "preact-router";
import AsyncRoute from "preact-async-route";

import Login from "./login";

import Page404 from "@components/pages/Page404";

type Props = {
  onChange: () => void;
};

const Registration = () => import("./registration").then((c) => c.default);

const Home = () => import("./home").then((c) => c.default);
const HomeAdd = () => import("./home/add").then((c) => c.default);

const LastWatch = () => import("./lastwatch").then((c) => c.default);
const ByName = () => import("./by-name").then((c) => c.default);
const ByYear = () => import("./by-year").then((c) => c.default);

const Catalog = () => import("./catalog").then((c) => c.default);
const Marathon = () => import("./marathon").then((c) => c.default);
const Bucket = () => import("./bucket").then((c) => c.default);

const BucketSim = () => import("./bucket-sim").then((c) => c.default);
const BucketSimAdd = () => import("./bucket-sim/add").then((c) => c.default);
const BucketSimEdit = () => import("./bucket-sim/edit").then((c) => c.default);

const DataManagement = () => import("./data-management").then((c) => c.default);

const Routes = (props: Props) => (
  <Router onChange={props.onChange}>
    <Route path="/" component={Login} />

    <AsyncRoute path="/register" getComponent={Registration} />

    <AsyncRoute path="/home" getComponent={Home} />
    <AsyncRoute path="/home/add" getComponent={HomeAdd} />

    <AsyncRoute path="/last-watch" getComponent={LastWatch} />
    <AsyncRoute path="/by-name" getComponent={ByName} />
    <AsyncRoute path="/by-year" getComponent={ByYear} />

    <AsyncRoute path="/catalogs" getComponent={Catalog} />
    <AsyncRoute path="/marathons" getComponent={Marathon} />
    <AsyncRoute path="/buckets" getComponent={Bucket} />

    <AsyncRoute path="/bucket-sims" getComponent={BucketSim} />
    <AsyncRoute path="/bucket-sims/add" getComponent={BucketSimAdd} />
    <AsyncRoute path="/bucket-sims/edit/:id" getComponent={BucketSimEdit} />

    <AsyncRoute path="/data-management" getComponent={DataManagement} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
