import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import axios from "axios";
import { useForm } from "react-hook-form";

import {
  CircularProgress,
  Grid2 as Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { Alert, AlertProps, Button, GlobalLoaderContext } from "@components";
import { Form, resolver } from "./validation";

const ModuleContainer = styled(Grid)({
  height: "calc(100vh - 48px)",
  alignItems: "center",
});

const LoginStack = styled(Stack)({
  paddingTop: 24,
  textAlign: "center",
});

const Login = () => {
  const loader = useContext(GlobalLoaderContext);

  const [dialog, setDialog] = useState<AlertProps>({
    open: false,
    message: "",
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    resetField,
  } = useForm<Form>({ resolver });

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      route("/home");
    }
  }, []);

  const handleSubmitForm = (formdata: Form) => {
    loader.toggleLoader(true);

    axios
      .post("/auth/login", formdata)
      .then(({ data: { data } }) => {
        localStorage.setItem("authToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        route("/home");
      })
      .catch(({ response: { data: err } }) => {
        if (err?.status === 401) {
          if (err?.message) {
            setDialog(() => ({
              open: true,
              message: err.message,
              severity: "error",
            }));
          } else {
            for (const field in err.data) {
              setError(field as any, {
                type: "server",
                message: err.data[field][0],
              });
            }
          }
        } else {
          setDialog(() => ({
            open: true,
            message: "An unknown error has ocurred",
            severity: "error",
          }));
        }

        resetField("password");
      })
      .finally(() => {
        loader.toggleLoader(false);
      });
  };

  return (
    <ModuleContainer container justifyContent="center">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <LoginStack spacing={3}>
            <Typography variant="h4">Login</Typography>

            <TextField
              variant="outlined"
              label="Email Address"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={loader.isLoading}
              {...register("email")}
            />
            <TextField
              type="password"
              variant="outlined"
              label="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loader.isLoading}
              {...register("password")}
            />

            <Alert onClose={() => setDialog({ open: false })} {...dialog} />

            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={loader.isLoading}
            >
              {!loader.isLoading ? (
                "Login"
              ) : (
                <CircularProgress color="inherit" size="1.75em" />
              )}
            </Button>
          </LoginStack>
        </form>
      </Grid>
    </ModuleContainer>
  );
};

export default Login;
