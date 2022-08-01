import { createContext, render } from "preact";
import { useMemo, useState } from "preact/hooks";

import Routes from "./routes";

import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import { Nav, NavCommon } from "@components";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const preferDark = window?.matchMedia('(prefers-color-scheme: dark)').matches;
const defaultMode = preferDark ? "dark" : "light"

const Layout = () => {
  const isAuth = window.location.pathname !== '/';

  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
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
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {isAuth && <Nav />}
        {!isAuth && <NavCommon />}

        <Container>
          <Routes />
        </Container>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

render(<Layout />, document.getElementById("app") as HTMLElement);
