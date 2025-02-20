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
    <ProtectedAsyncRoute path="/home/edit/:id" getComponent={HomeAdd} />
    <AsyncRoute path="/home/view/:id" getComponent={HomeView} />

    <ProtectedAsyncRoute path="/entries" getComponent={Entries} />
    <ProtectedAsyncRoute path="/search" getComponent={Search} />
    <ProtectedAsyncRoute path="/last-watch" getComponent={LastWatch} />

    <ProtectedAsyncRoute path="/by-name" getComponent={ByName} />
    <ProtectedAsyncRoute path="/by-year" getComponent={ByYear} />
    <ProtectedAsyncRoute path="/by-genre" getComponent={ByGenre} />

    <ProtectedAsyncRoute path="/catalogs" getComponent={Catalog} />
    <ProtectedAsyncRoute path="/catalogs/add" getComponent={CatalogAdd} />
    <ProtectedAsyncRoute path="/catalogs/edit/:id" getComponent={CatalogAdd} />
    <ProtectedAsyncRoute
      path="/catalogs/add-multi"
      getComponent={CatalogMulti}
    />
    <ProtectedAsyncRoute
      path="/catalogs/edit-multi/:id"
      getComponent={CatalogMulti}
    />
    <ProtectedAsyncRoute path="/catalogs/manage" getComponent={CatalogManage} />
    <ProtectedAsyncRoute
      path="/catalogs/manage-edit/:id"
      getComponent={CatalogManageEdit}
    />

    <ProtectedAsyncRoute path="/buckets" getComponent={Bucket} />

    <ProtectedAsyncRoute path="/marathons" getComponent={Marathon} />
    <ProtectedAsyncRoute path="/marathons/add" getComponent={MarathonAdd} />
    <ProtectedAsyncRoute
      path="/marathons/edit/:id"
      getComponent={MarathonAdd}
    />

    <ProtectedAsyncRoute path="/bucket-sims" getComponent={BucketSim} />
    <ProtectedAsyncRoute path="/bucket-sims/add" getComponent={BucketSimAdd} />
    <ProtectedAsyncRoute
      path="/bucket-sims/edit/:id"
      getComponent={BucketSimAdd}
    />

    <ProtectedAsyncRoute
      path="/data-management"
      getComponent={DataManagement}
    />
    <ProtectedAsyncRoute path="/logs" getComponent={Logs} />
    <ProtectedAsyncRoute path="/autofills" getComponent={Autofills} />

    <ProtectedAsyncRoute path="/rss" getComponent={Rss} />

    <ProtectedAsyncRoute path="/pc-setups" getComponent={PcSetup} />
    <ProtectedAsyncRoute
      path="/pc-setups/:ownerId/add"
      getComponent={PcSetupAdd}
    />
    <ProtectedAsyncRoute
      path="/pc-setups/:ownerId/edit/:infoId"
      getComponent={PcSetupAdd}
    />
    <ProtectedAsyncRoute
      path="/pc-setups/components"
      getComponent={PcComponent}
    />

    <Route default component={Page404} />
  </Router>
);

export default Routes;
