import { yupResolver } from "@hookform/resolvers/yup";
import { object, ref, string } from "yup";

export type Form = {
  email: string;
  password: string;
  password_confirmation: string;
};

const schema = object({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
  password_confirmation: string().oneOf(
    [ref("password")],
    "Passwords does not match",
  ),
});

const resolver = yupResolver(schema);

export { resolver };
