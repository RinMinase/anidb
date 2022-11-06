import "@fortawesome/fontawesome-svg-core/styles.css";
import "animate.css";

import { render } from "preact";

import Routes from "./routes";

import { Container, CssBaseline } from "@mui/material";

import { Nav, NavCommon } from "@components";

import "./service";

import ColorMode from "@components/providers/ColorMode";
import GlobalLoader from "@components/providers/GlobalLoader";
import { useState } from "preact/hooks";

const Layout = () => {
  const [navCommon, setNavCommon] = useState<boolean>(true);

  const handleRouteChange = async ({ url }: { url: string }) => {
    const commonURLs = ["/", "/register"];
    setNavCommon(commonURLs.includes(url));
  };

  return (
    <ColorMode>
      <CssBaseline />

      {navCommon ? <NavCommon /> : <Nav />}

      <GlobalLoader disableScroll={navCommon} id="main">
        <Container>
          <Routes onChange={handleRouteChange as any} />
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
  link.href = import.meta.env.VITE_API_URL;
  link.crossOrigin = "true";

  document.getElementsByTagName("head")[0].appendChild(link);
}
