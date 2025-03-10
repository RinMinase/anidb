import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, ref, string } from "yup";

export type Form = {
  username: string;
  password: string;
  password_confirmation: string;
};

const defaultValues: Form = {
  username: "",
  password: "",
  password_confirmation: "",
};

const schema = object({
  username: string()
    .min(4, "Should be at least 4 alphanumeric characters")
    .max(32, "Should be at most 32 alphanumeric characters")
    .matches(/^[a-zA-Z0-9]+$/, {
      message: "Only accepts alphanumeric characters",
    })
    .required("Username is required"),
  password: string()
    .min(4, "Should be at least 4 alphanumeric characters")
    .max(32, "Should be at most 32 alphanumeric characters")
    .matches(/^[a-zA-Z0-9]+$/, {
      message: "Only accepts alphanumeric characters",
    })
    .required("Password is required"),
  password_confirmation: string().oneOf(
    [ref("password")],
    "Passwords does not match",
  ),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
