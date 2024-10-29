import axios, { AxiosError } from "axios";
import { useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Grid2 as Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { ButtonLoading, ErrorResponseType } from "@components";

import { Form, resolver } from "./validation";

const ModuleContainer = styled(Grid)({
  height: "calc(100vh - 48px)",
  alignItems: "center",
});

const Login = () => {
  const [isLoading, setLoading] = useState(false);

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

  const handleSubmitForm = async (formdata: Form) => {
    setLoading(true);

    try {
      const {
        data: { data },
      } = await axios.post("/auth/login", formdata);

      localStorage.setItem("authToken", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      toast.dismiss();
      route("/home");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data, message } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        if (message) {
          toast.error(message, { duration: Infinity, closeButton: true });
        } else {
          toast.error("An unknown error has occurred");
        }
      } else {
        console.error(err);
        toast.error("Failed");
      }

      resetField("password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleContainer container justifyContent="center">
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Stack spacing={3} sx={{ paddingTop: 3, textAlign: "center" }}>
            <Typography variant="h4">Login</Typography>

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

            <ButtonLoading
              variant="contained"
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Login
            </ButtonLoading>
          </Stack>
        </form>
      </Grid>
    </ModuleContainer>
  );
};

export default Login;
