import { useContext } from "preact/hooks";

import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { Brightness4, Brightness7 } from "@mui/icons-material";

import { ColorModeContext } from "../main";

const DarkModeContainer = styled(Box)({
  position: "absolute",
  right: 0,
  top: 0,
});

const LoginContainer = styled(Grid)({
  height: "100vh",
  alignItems: "center",
});

const LoginStack = styled(Stack)({
  paddingTop: 24,
  textAlign: "center",
});

const Login = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <>
      <LoginContainer container justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <LoginStack spacing={3}>
            <Typography variant="h4">Login</Typography>

            <TextField variant="outlined" label="Email Address" />
            <TextField type="password" variant="outlined" label="Password" />

            <Button variant="contained" size="large">
              Login
            </Button>
          </LoginStack>
        </Grid>
      </LoginContainer>

      <DarkModeContainer>
        <IconButton
          sx={{ ml: 1 }}
          onClick={colorMode.toggleColorMode}
          color="inherit"
        >
          {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </DarkModeContainer>
    </>
  );
};

export default Login;
