import { yupResolver } from "@hookform/resolvers/yup";
import { array, number, object, string } from "yup";

export type Form = {
  description: string;
  buckets?: Array<{
    from: string;
    to: string;
    size: number | null;
  }>;
};

const defaultValues = {
  description: "",
  buckets: [
    {
      from: "",
      to: "",
      size: null,
    },
  ],
};

const schema = object().shape({
  description: string().required("Required"),
  buckets: array().of(
    object().shape({
      from: string()
        .required("Required")
        .min(1, "Single letter only")
        .max(1, "Single letter only"),
      to: string()
        .required("Required")
        .min(1, "Single letter only")
        .max(1, "Single letter only"),
      size: number()
        .typeError("Invalid")
        .min(1, "Too low")
        .max(30, "Too high"),
    }),
  ),
});

const resolver = yupResolver(schema);

export { defaultValues, resolver };
