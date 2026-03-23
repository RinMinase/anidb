import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, string } from "yup";

export type Form = {
  email: string;
};

const schema = object({
  email: string()
    .email("Should be a proper email format")
    .required("Email is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { resolver };
