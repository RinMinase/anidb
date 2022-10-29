import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

export type Form = {
  codec: string;
};

const defaultValues: Form = {
  codec: "",
};

const schema = object({
  codec: string().required("Codec name is required"),
});

const resolver = yupResolver(schema);

export { defaultValues, resolver };
