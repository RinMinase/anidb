import { render } from "preact";

import Routes from "./routes";

import { Container, CssBaseline } from "@mui/material";

import { Nav, NavCommon } from "@components";

import "./service";

import ColorMode from "@components/providers/ColorMode";
import GlobalLoader from "@components/providers/GlobalLoader";

const Layout = () => {
  const isAuth = window.location.pathname !== "/";

  return (
    <ColorMode>
      <CssBaseline />

      {isAuth && <Nav />}
      {!isAuth && <NavCommon />}

      <GlobalLoader>
        <Container>
          <Routes />
        </Container>
      </GlobalLoader>
    </ColorMode>
  );
};

render(<Layout />, document.getElementById("app") as HTMLElement);

/**
 * Preconnection to API
 */

if (import.meta.env.VITE_API_URL) {
  const link = document.createElement("link");

  link.rel = "preconnect";
  link.href = import.meta.env.VITE_API_URL
  link.crossOrigin = "true";

  document.getElementsByTagName('head')[0].appendChild(link);
}
