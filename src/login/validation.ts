import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, string } from "yup";

export type Form = {
  email: string;
  password: string;
};

const schema = object({
  email: string().required("Email is required"),
  password: string().required("Password is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { resolver };
