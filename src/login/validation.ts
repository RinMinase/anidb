// commit to change to lf
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, string } from "yup";

export type Form = {
  username: string;
  password: string;
};

const schema = object({
  username: string().required("Username is required"),
  password: string().required("Password is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { resolver };
