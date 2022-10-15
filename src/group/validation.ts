import { yupResolver } from "@hookform/resolvers/yup";
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

const resolver = yupResolver(schema);

export { defaultValues, resolver };
