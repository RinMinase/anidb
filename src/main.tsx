import { createContext, render } from "preact";
import { useMemo, useState } from "preact/hooks";

import Routes from "./routes";

import {
  Container,
  createTheme,
  CssBaseline,
  LinearProgress,
  ThemeProvider,
} from "@mui/material";

import { Nav, NavCommon } from "@components";

import "./service";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const GlobalLoaderContext = createContext({
  isLoading: false,
  toggleLoader: (value: boolean) => {},
});

const preferDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
const defaultMode = preferDark ? "dark" : "light";

const Layout = () => {
  const isAuth = window.location.pathname !== "/";

  const [loader, setLoader] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        console.log("set mode");
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#198754" : "#105434",
          },
          secondary: {
            main: mode === "light" ? "#00b0ff" : "#1c54b2",
          },
        },
      }),
    [mode],
  );

  const globalLoader = useMemo(
    () => (value: boolean) => {
      setLoader(() => value);
    },
    [],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {isAuth && <Nav />}
        {!isAuth && <NavCommon />}

        <GlobalLoaderContext.Provider
          value={{
            isLoading: loader,
            toggleLoader: globalLoader,
          }}
        >
          {loader && <LinearProgress color="secondary" />}

          <Container>
            <Routes />
          </Container>
        </GlobalLoaderContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

render(<Layout />, document.getElementById("app") as HTMLElement);
