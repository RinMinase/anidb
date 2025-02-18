import { useContext, useEffect } from "preact/hooks";
import { Router, Route, route } from "preact-router";
import { toast } from "sonner";
import AsyncRoute from "preact-async-route";

import { AuthenticatedUserContext } from "@components";
import Page404 from "@components/pages/Page404";

import Login from "./login";

type Props = {
  onChange: () => void;
};

/**
 * Lazy loaded components
 */
const Registration = async () => (await import("./registration")).default;

const Home = async () => (await import("./home")).default;
const HomeAdd = async () => (await import("./home/add")).default;
const HomeView = async () => (await import("./home/view")).default;

const Entries = async () => (await import("./entries")).default;
const Search = async () => (await import("./search")).default;

const LastWatch = async () => (await import("./lastwatch")).default;
const ByName = async () => (await import("./by-name")).default;
const ByYear = async () => (await import("./by-year")).default;
const ByGenre = async () => (await import("./by-genre")).default;

const Catalog = async () => (await import("./catalog")).default;
const CatalogAdd = async () => (await import("./catalog/add")).default;
const CatalogMulti = async () => (await import("./catalog/add-multi")).default;
const CatalogManage = async () => (await import("./catalog/manage")).default;
const CatalogManageEdit = async () =>
  (await import("./catalog/manage-edit")).default;

const Bucket = async () => (await import("./bucket")).default;

const Marathon = async () => (await import("./marathon")).default;
const MarathonAdd = async () => (await import("./marathon/add")).default;

const BucketSim = async () => (await import("./bucket-sim")).default;
const BucketSimAdd = async () => (await import("./bucket-sim/add")).default;

const DataManagement = async () => (await import("./data-management")).default;
const Logs = async () => (await import("./logs")).default;
const Autofills = async () => (await import("./autofills")).default;

const Rss = async () => (await import("./rss")).default;

const PcSetup = async () => (await import("./pc-setups")).default;
const PcSetupAdd = async () => (await import("./pc-setups/add")).default;
const PcComponent = async () => (await import("./pc-components")).default;

/**
 * Route guard
 */
const ProtectedAsyncRoute = (props: any) => {
  const isAdmin = useContext(AuthenticatedUserContext);

  useEffect(() => {
    if (isAdmin !== null && !isAdmin) {
      route("/");
      toast.error("Admin access is required");
    }
  }, [isAdmin]);

  return <AsyncRoute {...props} />;
};

/**
 * Route component
 */
const Routes = (props: Props) => (
  <Router onChange={props.onChange}>
    <Route path="/" component={Login} />

    <AsyncRoute path="/register" getComponent={Registration} />

    <AsyncRoute path="/home" getComponent={Home} />
    <ProtectedAsyncRoute path="/home/add" getComponent={HomeAdd} />
    <AsyncRoute path="/home/edit/:id" getComponent={HomeAdd} />
    <AsyncRoute path="/home/view/:id" getComponent={HomeView} />

    <AsyncRoute path="/entries" getComponent={Entries} />
    <AsyncRoute path="/search" getComponent={Search} />
    <AsyncRoute path="/last-watch" getComponent={LastWatch} />

    <AsyncRoute path="/by-name" getComponent={ByName} />
    <AsyncRoute path="/by-year" getComponent={ByYear} />
    <AsyncRoute path="/by-genre" getComponent={ByGenre} />

    <AsyncRoute path="/catalogs" getComponent={Catalog} />
    <AsyncRoute path="/catalogs/add" getComponent={CatalogAdd} />
    <AsyncRoute path="/catalogs/edit/:id" getComponent={CatalogAdd} />
    <AsyncRoute path="/catalogs/add-multi" getComponent={CatalogMulti} />
    <AsyncRoute path="/catalogs/edit-multi/:id" getComponent={CatalogMulti} />
    <AsyncRoute path="/catalogs/manage" getComponent={CatalogManage} />
    <AsyncRoute
      path="/catalogs/manage-edit/:id"
      getComponent={CatalogManageEdit}
    />

    <AsyncRoute path="/buckets" getComponent={Bucket} />

    <AsyncRoute path="/marathons" getComponent={Marathon} />
    <AsyncRoute path="/marathons/add" getComponent={MarathonAdd} />
    <AsyncRoute path="/marathons/edit/:id" getComponent={MarathonAdd} />

    <AsyncRoute path="/bucket-sims" getComponent={BucketSim} />
    <AsyncRoute path="/bucket-sims/add" getComponent={BucketSimAdd} />
    <AsyncRoute path="/bucket-sims/edit/:id" getComponent={BucketSimAdd} />

    <AsyncRoute path="/data-management" getComponent={DataManagement} />
    <AsyncRoute path="/logs" getComponent={Logs} />
    <AsyncRoute path="/autofills" getComponent={Autofills} />

    <AsyncRoute path="/rss" getComponent={Rss} />

    <AsyncRoute path="/pc-setups" getComponent={PcSetup} />
    <AsyncRoute path="/pc-setups/:ownerId/add" getComponent={PcSetupAdd} />
    <AsyncRoute
      path="/pc-setups/:ownerId/edit/:infoId"
      getComponent={PcSetupAdd}
    />
    <AsyncRoute path="/pc-setups/components" getComponent={PcComponent} />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
