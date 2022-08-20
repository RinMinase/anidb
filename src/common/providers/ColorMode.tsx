import { createContext } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import Cookies from "js-cookie";

import { createTheme, ThemeProvider } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const preferDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
const modeFromCookies = Cookies.get('color-mode') as "light" | "dark" | undefined;
const defaultMode = modeFromCookies ?? (preferDark ? "dark" : "light");

const ColorMode = (props: any) => {
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

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

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [],
  );

  useEffect(() => {
    Cookies.set('color-mode', mode);
  }, [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorMode;
