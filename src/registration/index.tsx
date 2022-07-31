import { useForm } from "react-hook-form";

import {
  Button,
  Grid,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ resolver });

  const handleSubmitForm = (formdata: Form) => {
    console.log(formdata);
  };

  return (
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
            <TextField
              type="password"
              variant="outlined"
              label="Confirm Password"
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              {...register("password_confirmation")}
            />

            <Button variant="contained" size="large" type="submit">
              Register
            </Button>
          </LoginStack>
        </form>
      </Grid>
    </RegistrationContainer>
  );
};

export default Registration;
