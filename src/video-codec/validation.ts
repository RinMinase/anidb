import { yupResolver } from "@hookform/resolvers/yup";
import { number, object, string } from "yup";

import { emptyStringToNull } from "@components";

export type Form = {
  codec: string;
  order?: number;
};

const defaultValues: Form = {
  codec: "",
};

const schema = object({
  codec: string().required("Codec name is required"),
  order: number()
    .typeError("Order should be a number")
    .transform(emptyStringToNull)
    .nullable(),
});

const resolver = yupResolver(schema);

export { defaultValues, resolver };
