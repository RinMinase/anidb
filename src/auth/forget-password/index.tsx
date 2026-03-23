import { useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { Box, Grid, Stack, TextField, Typography } from "@mui/material";

import { ButtonLoading, ErrorResponseType } from "@components";

import { Form, resolver } from "./validation";

const ForgetPassword = () => {
  const [isLoading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);
  const [isTimerLocked, setTimerLocked] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const handleSubmitForm = async (formdata: Form) => {
    if (timer > 0) {
      setTimerLocked(true);
      return;
    }

    try {
      setLoading(true);
      setTimerLocked(false);
      setTimer(90);

      await axios.post("/auth/forget-password", formdata);

      toast.success("Password reset sent to your email.");
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
      } else if (err instanceof AxiosError && err.status === 429) {
        toast.error("Please try again in a few moments");
      } else {
        console.error(err);
        toast.error("Failed");
      }

      setTimer(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setTimerLocked(false);
      clearInterval(interval!);
    }

    return () => {
      clearInterval(interval!);
    };
  }, [timer]);

  return (
    <Grid
      container
      justifyContent="center"
      sx={{ height: "calc(100vh - 48px)", alignItems: "center" }}
    >
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <Stack spacing={3} sx={{ paddingTop: 3, textAlign: "center" }}>
            <Typography variant="h4">Forget Password</Typography>

            <TextField
              variant="outlined"
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              disabled={isLoading}
              {...register("email")}
            />

            {isTimerLocked ? (
              <Box sx={{ width: "100%" }}>
                <Typography variant="body1">
                  Please wait {timer} seconds before trying again.
                </Typography>
              </Box>
            ) : null}

            <ButtonLoading
              variant="contained"
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Send Reset Link
            </ButtonLoading>
          </Stack>
        </form>
      </Grid>
    </Grid>
  );
};

export default ForgetPassword;
