import { useContext, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import axios from "axios";

import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { Snackbar } from "@components";
import { GlobalLoaderContext } from "src/main";

import { Form, resolver } from "./validation";

const RegistrationContainer = styled(Grid)({
  height: "calc(100vh - 48px)",
  alignItems: "center",
});

const LoginStack = styled(Stack)({
  paddingTop: 24,
  textAlign: "center",
});

const Registration = () => {
  const loader = useContext(GlobalLoaderContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const [dialog, setDialog] = useState({
    open: false,
    message: "",
  });

  const handleDialogClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const handleSubmitForm = (formdata: Form) => {
    loader.toggleLoader(true);

    axios
      .post("/auth/register", formdata)
      .then(() => {
        setDialog(() => ({ open: true, message: "Success" }));
      })
      .catch(({ response: { data: err } }) => {
        if (err.status === 401) {
          for (let field in err.data) {
            setError(field as any, {
              type: "server",
              message: err.data[field][0],
            });
          }
        } else {
          console.error(err.message);
        }
      })
      .finally(() => { loader.toggleLoader(false) });
  };

  return (
    <>
      <RegistrationContainer container justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <form onSubmit={handleSubmit(handleSubmitForm)}>
            <LoginStack spacing={3}>
              <Typography variant="h4">Register</Typography>

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
              <TextField
                type="password"
                variant="outlined"
                label="Confirm Password"
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation?.message}
                disabled={loader.isLoading}
                {...register("password_confirmation")}
              />

              <Button variant="contained" size="large" type="submit"
              disabled={loader.isLoading}>
                {!loader.isLoading ? (
                "Register"
              ) : (
                <CircularProgress color="inherit" />
              )}
              </Button>
            </LoginStack>
          </form>
        </Grid>
      </RegistrationContainer>

      <Snackbar onClose={handleDialogClose} severity="success" {...dialog} />
    </>
  );
};

export default Registration;
