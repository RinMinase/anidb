// commit to change to lf
import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Eye, EyeOff } from "react-feather";
import { route } from "preact-router";
import axios, { AxiosError } from "axios";

import {
  Grid2 as Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { ButtonLoading, ErrorResponseType, IconButton } from "@components";

import { Form, resolver } from "./validation";

const Registration = () => {
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const handleSubmitForm = async (formdata: Form) => {
    setLoading(true);

    try {
      const {
        data: { data },
      } = await axios.post("/auth/register", formdata);

      toast.success("Success");

      localStorage.setItem("authToken", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      route("/home");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        if (data) {
          toast.error("Form validation failed");
        } else {
          toast.error("An unknown error has occurred");
        }
      } else {
        console.error(err);
        toast.error("Failed");
      }
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
        <Stack spacing={3} sx={{ paddingTop: 3, textAlign: "center" }}>
          <Typography variant="h4">Register</Typography>

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
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register("password")}
          />
          <TextField
            type={showPasswordConf ? "text" : "password"}
            variant="outlined"
            label="Confirm Password"
            error={!!errors.password_confirmation}
            helperText={errors.password_confirmation?.message}
            disabled={isLoading}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPasswordConf((show) => !show)}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseUp={(e) => e.preventDefault()}
                    >
                      {showPasswordConf ? (
                        <EyeOff size={24} />
                      ) : (
                        <Eye size={24} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register("password_confirmation")}
          />
          <TextField
            variant="outlined"
            label="Admin / Root Password"
            error={!!errors.root_password}
            helperText={errors.root_password?.message}
            disabled={isLoading}
            {...register("root_password")}
          />

          <ButtonLoading
            variant="contained"
            type="button"
            disabled={isLoading}
            loading={isLoading}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Register
          </ButtonLoading>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Registration;
