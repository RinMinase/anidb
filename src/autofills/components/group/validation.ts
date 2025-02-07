import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, string } from "yup";

export type Form = {
  name: string;
};

const defaultValues: Form = {
  name: "",
};

const schema = object({
  name: string().required("Name is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
