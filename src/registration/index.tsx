import { useContext, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import axios from "axios";

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

const RegistrationContainer = styled(Grid)({
  height: "calc(100vh - 48px)",
  alignItems: "center",
});

const LoginStack = styled(Stack)({
  paddingTop: 24,
  textAlign: "center",
});

const Registration = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const [dialog, setDialog] = useState<AlertProps>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    try {
      await axios.post("/auth/register", formdata);
      setDialog(() => ({
        open: true,
        message: "Success",
        severity: "success",
      }));
    } catch (error: any) {
      const {
        response: { data: err },
      } = error;

      if (err.status === 401) {
        for (const field in err.data) {
          setError(field as any, {
            type: "server",
            message: err.data[field][0],
          });
        }
      } else {
        setDialog(() => ({
          open: true,
          message: err.message,
          severity: "error",
        }));
      }
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <RegistrationContainer container justifyContent="center">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <LoginStack spacing={3}>
            <Typography variant="h4">Register</Typography>

            <TextField
              variant="outlined"
              label="Email Address"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              {...register("email")}
            />
            <TextField
              type="password"
              variant="outlined"
              label="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              {...register("password")}
            />
            <TextField
              type="password"
              variant="outlined"
              label="Confirm Password"
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              disabled={isLoading}
              {...register("password_confirmation")}
            />

            <Alert onClose={() => setDialog({ open: false })} {...dialog} />

            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={isLoading}
            >
              {!isLoading ? (
                "Register"
              ) : (
                <CircularProgress color="inherit" size="1.75em" />
              )}
            </Button>
          </LoginStack>
        </form>
      </Grid>
    </RegistrationContainer>
  );
};

export default Registration;
