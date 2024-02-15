import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { number, object, string } from "yup";

export type Form = {
  title: string;
  id_catalog?: string;
  id_priority: number | "";
};

const defaultValues: Form = {
  title: "",
  id_catalog: "",
  id_priority: "",
};

const schema = object({
  title: string().required("Title is required"),
  id_catalog: string().required("Catalog is required"),
  id_priority: number()
    .typeError("Priority is invalid")
    .required("Priority is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
