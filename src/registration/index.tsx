import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { Grid2 as Grid, Stack, TextField, Typography } from "@mui/material";

import { ButtonLoading, ErrorResponseType } from "@components";

import { Form, resolver } from "./validation";

const Registration = () => {
  const [isLoading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const handleSubmitForm = async (formdata: Form) => {
    setLoading(true);

    try {
      await axios.post("/auth/register", formdata);
      toast.success("Success");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        toast.error("Form validation failed");
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

            <ButtonLoading
              variant="contained"
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Register
            </ButtonLoading>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default Registration;
