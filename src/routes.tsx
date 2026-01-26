import { useContext, useEffect } from "preact/hooks";
import { toast } from "sonner";

import { lazy, LocationProvider, Router, Route, useLocation } from "preact-iso";

import { AuthenticatedUserContext } from "@components";
import Page404 from "@components/pages/Page404";

import Login from "./login";

type Props = {
  onChange: (url: string) => void;
};

/**
 * Lazy loaded components
 */
const Registration = lazy(() => import("./registration"));

const Home = lazy(() => import("./home"));
const HomeAdd = lazy(() => import("./home/add"));
const HomeView = lazy(() => import("./home/view"));

const Entries = lazy(() => import("./entries"));
const Search = lazy(() => import("./search"));

const LastWatch = lazy(() => import("./lastwatch"));
const ByName = lazy(() => import("./by-name"));
const ByYear = lazy(() => import("./by-year"));
const ByGenre = lazy(() => import("./by-genre"));

const Catalog = lazy(() => import("./catalog"));
const CatalogAdd = lazy(() => import("./catalog/add"));
const CatalogMulti = lazy(() => import("./catalog/add-multi"));
const CatalogManage = lazy(() => import("./catalog/manage"));
const CatalogManageEdit = lazy(() => import("./catalog/manage-edit"));

const Bucket = lazy(() => import("./bucket"));

const Marathon = lazy(() => import("./marathon"));
const MarathonAdd = lazy(() => import("./marathon/add"));

const BucketSim = lazy(() => import("./bucket-sim"));
const BucketSimAdd = lazy(() => import("./bucket-sim/add"));

const DataManagement = lazy(() => import("./data-management"));
const Logs = lazy(() => import("./logs"));
const Autofills = lazy(() => import("./autofills"));
const Users = lazy(() => import("./users"));

const PcSetup = lazy(() => import("./pc-setups"));
const PcSetupAdd = lazy(() => import("./pc-setups/add"));
const PcComponent = lazy(() => import("./pc-components"));

/**
 * Route guard
 */
const ProtectedRoute = ({ path, component }: any) => {
  const location = useLocation();
  const isAdmin = useContext(AuthenticatedUserContext);

  useEffect(() => {
    if (isAdmin !== null && !isAdmin) {
      location.route("/", true);
      toast.error("Admin access is required");
    }
  }, [isAdmin]);

  if (isAdmin === null || isAdmin === false) {
    return <Route path={path} component={() => <></>} />;
  }

  return <Route path={path} component={component} />;
};

/**
 * 404 Boundary
 */
const Page404Boundary = () => {
  const location = useLocation();

  location.route("/404");

  return null;
};

/**
 * Route component
 */
const Routes = (props: Props) => (
  <LocationProvider>
    <Router
      // onRouteChange={props.onChange}
      // onLoadStart={props.onChange}
      onRouteChange={props.onChange}
      // onLoadStart={(url) => {
      //   // props.onChange(url);
      //   // console.log("Starting to load", url);
      // }}
    >
      <Route path="/" component={Login} />

      <Route path="/register" component={Registration} />

      <Route path="/home" component={Home} />
      <Route path="/home/view/:id" component={HomeView} />
      <ProtectedRoute path="/home/add" component={HomeAdd} />
      <ProtectedRoute path="/home/edit/:id" component={HomeAdd} />

      <ProtectedRoute path="/entries" component={Entries} />
      <ProtectedRoute path="/search" component={Search} />
      <ProtectedRoute path="/last-watch" component={LastWatch} />

      <ProtectedRoute path="/by-name" component={ByName} />
      <ProtectedRoute path="/by-year" component={ByYear} />
      <ProtectedRoute path="/by-genre" component={ByGenre} />

      <ProtectedRoute path="/catalogs" component={Catalog} />
      <ProtectedRoute path="/catalogs/add" component={CatalogAdd} />
      <ProtectedRoute path="/catalogs/edit/:id" component={CatalogAdd} />
      <ProtectedRoute path="/catalogs/add-multi" component={CatalogMulti} />
      <ProtectedRoute
        path="/catalogs/edit-multi/:id"
        component={CatalogMulti}
      />
      <ProtectedRoute path="/catalogs/manage" component={CatalogManage} />
      <ProtectedRoute
        path="/catalogs/manage-edit/:id"
        component={CatalogManageEdit}
      />

      <ProtectedRoute path="/buckets" component={Bucket} />

      <ProtectedRoute path="/marathons" component={Marathon} />
      <ProtectedRoute path="/marathons/add" component={MarathonAdd} />
      <ProtectedRoute path="/marathons/edit/:id" component={MarathonAdd} />

      <ProtectedRoute path="/bucket-sims" component={BucketSim} />
      <ProtectedRoute path="/bucket-sims/add" component={BucketSimAdd} />
      <ProtectedRoute path="/bucket-sims/edit/:id" component={BucketSimAdd} />

      <ProtectedRoute path="/data-management" component={DataManagement} />
      <ProtectedRoute path="/logs" component={Logs} />
      <ProtectedRoute path="/autofills" component={Autofills} />
      <ProtectedRoute path="/users" component={Users} />

      <ProtectedRoute path="/pc-setups" component={PcSetup} />
      <ProtectedRoute path="/pc-setups/:ownerId/add" component={PcSetupAdd} />
      <ProtectedRoute
        path="/pc-setups/:ownerId/edit/:infoId"
        component={PcSetupAdd}
      />
      <ProtectedRoute path="/pc-setups/components" component={PcComponent} />

      <Route path="/404" component={Page404} />
      <Route default component={Page404Boundary} />
    </Router>
  </LocationProvider>
);

export default Routes;
