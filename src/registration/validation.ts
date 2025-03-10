// commit to change to lf
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, ref, string } from "yup";

export type Form = {
  username: string;
  password: string;
  password_confirmation: string;
  root_password: string;
};

const schema = object({
  username: string().required("Username is required"),
  password: string().required("Password is required"),
  password_confirmation: string().oneOf(
    [ref("password")],
    "Passwords does not match",
  ),
  root_password: string().required("Root password is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { resolver };
