import { useContext } from "preact/hooks";
import { useForm } from "react-hook-form";

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
import { Form, resolver } from "./validation";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const handleSubmitForm = (formdata: Form) => {
    console.log(formdata);
  };

  return (
    <>
      <LoginContainer container justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <LoginStack spacing={3}>
              <Typography variant="h4">Login</Typography>

              <TextField
                variant="outlined"
                label="Email Address"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
              <TextField
                type="password"
                variant="outlined"
                label="Password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register("password")}
              />

              <Button variant="contained" size="large" type="submit">
                Login
              </Button>
            </LoginStack>
          </form>
        </Grid>
      </LoginContainer>

      <DarkModeContainer>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </DarkModeContainer>
    </>
  );
};

export default Login;
