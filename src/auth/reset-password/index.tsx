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

const ResetPassword = () => {
  const location = useLocation();

  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver });

  useEffect(() => {
    if (!location.query.token || !location.query.email) {
      toast.error("Invalid URL");
      location.route("/");
    }
  }, []);

  const handleSubmitForm = async (formdata: Form) => {
    try {
      if (!location.query.token || !location.query.email) {
        toast.error("Invalid URL");
        location.route("/");
      }

      setLoading(true);

      await axios.post("/auth/reset-password", {
        ...formdata,
        email: location.query.email,
        token: location.query.token,
      });

      toast.success("Successfully reset password.");
      location.route("/");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data, message } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        if (data?.email) {
          toast.error("Email is invalid");
        } else if (message) {
          toast.error(message, { duration: Infinity, closeButton: true });
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
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Stack spacing={3} sx={{ paddingTop: 3, textAlign: "center" }}>
            <Typography variant="h4">Reset Password</Typography>

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

            <TextField
              type={showPasswordConfirm ? "text" : "password"}
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
                        onClick={() => setShowPasswordConfirm((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                      >
                        {showPasswordConfirm ? (
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

            <ButtonLoading
              variant="contained"
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Reset Password
            </ButtonLoading>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
