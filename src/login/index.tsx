import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "react-feather";
import axios, { AxiosError } from "axios";

import {
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { ButtonLoading, ErrorResponseType, IconButton } from "@components";

import { Form, resolver } from "./validation";

const Login = () => {
  const location = useLocation();

  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    resetField,
  } = useForm<Form>({ resolver });

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      location.route("/home");
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
      location.route("/home");
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
    <Grid
      container
      justifyContent="center"
      sx={{ height: "calc(100vh - 48px)", alignItems: "center" }}
    >
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Stack spacing={3} sx={{ paddingTop: 3, textAlign: "center" }}>
            <Typography variant="h4">Login</Typography>

            <TextField
              variant="outlined"
              label="Username"
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isLoading}
              {...register("username")}
            />
            <TextField
              type={showPassword ? "text" : "password"}
              variant="outlined"
              label="Password"
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isLoading}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                      >
                        {showPassword ? (
                          <EyeOff size={24} />
                        ) : (
                          <Eye size={24} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
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
    </Grid>
  );
};

export default Login;
