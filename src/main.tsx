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
