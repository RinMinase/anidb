import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, ref, string } from "yup";

export type Form = {
  password: string;
  password_confirmation: string;
};

const schema = object({
  password: string()
    .min(4, "Minimum of 4 characters")
    .max(32, "Maximum of 32 characters")
    .matches(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed")
    .required("Password is required"),
  password_confirmation: string()
    .required("Password confirmation is required")
    .oneOf([ref("password")], "Passwords do not match"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { resolver };
