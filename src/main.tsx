import { render } from "preact";

import Routes from "./routes";

import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#198754",
    },
  },
});

const Layout = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />

    <Container>
      <Routes />
    </Container>
  </ThemeProvider>
);

render(<Layout />, document.getElementById("app") as HTMLElement);
