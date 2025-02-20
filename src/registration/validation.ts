import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, ref, string } from "yup";

export type Form = {
  username: string;
  password: string;
  password_confirmation: string;
};

const schema = object({
  username: string().required("Email is required"),
  password: string().required("Password is required"),
  password_confirmation: string().oneOf(
    [ref("password")],
    "Passwords does not match",
  ),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { resolver };
