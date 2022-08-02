import { useForm } from "react-hook-form";
import { useEffect } from "preact/hooks";
import axios from "axios";

import {
  Button,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { Form, resolver } from "./validation";

const LoginContainer = styled(Grid)({
  height: "calc(100vh - 48px)",
  alignItems: "center",
});

const LoginStack = styled(Stack)({
  paddingTop: 24,
  textAlign: "center",
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver });

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      // TODO: Validate token on page load

      axios.defaults.headers.common = {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      };
    }
  }, []);

  const handleSubmitForm = (formdata: Form) => {
    axios.post("/auth/login", formdata).then(({ data: { data } }) => {
      localStorage.setItem("authToken", data.token);

      axios.defaults.headers.common = {
        Authorization: `Bearer ${data.token}`,
      };
    });
  };

  return (
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
  );
};

export default Login;
