import { createContext } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { createTheme, ThemeProvider } from "@mui/material";
import Cookies from "js-cookie";

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const preferDark = window?.matchMedia("(prefers-color-scheme: dark)").matches;
const savedMode = Cookies.get("color-mode") as "light" | "dark" | undefined;
const defaultMode = savedMode ?? (preferDark ? "dark" : "light");

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
            main: mode === "light" ? "#B0BEC5" : "#BDBDBD",
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
    Cookies.set("color-mode", mode, { expires: 30, sameSite: "Lax" });
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorMode;
