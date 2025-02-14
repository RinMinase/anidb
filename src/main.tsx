import { render } from "preact";
import { useState } from "preact/hooks";
import { toast, Toaster } from "sonner";
import { Container, CssBaseline } from "@mui/material";
import axios, { AxiosError } from "axios";

import { Nav, NavCommon } from "@components";
import ColorMode from "@components/providers/ColorMode";
import GlobalLoader from "@components/providers/GlobalLoader";

import Routes from "./routes";

import "./service";

const Layout = () => {
  const [navCommon, setNavCommon] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      await axios.get("/auth/user");
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.status === 401) {
          console.error(err);
          toast.error("Not Authenticated");
        }
      }
    }
  };

  const handleRouteChange = async ({ url }: { url: string }) => {
    const commonURLs = ["/", "/register"];
    const isCommonRoute = commonURLs.includes(url);
    setNavCommon(isCommonRoute);

    if (!isCommonRoute) {
      await checkAuth();
    }
  };

  return (
    <ColorMode>
      <CssBaseline />

      {navCommon ? <NavCommon /> : <Nav />}

      <GlobalLoader disableScroll={navCommon} id="main">
        <Container>
          <Routes onChange={handleRouteChange as any} />
          <Toaster position="bottom-right" richColors />
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
