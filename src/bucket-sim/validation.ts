import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
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
        .max(1, "Single letter only")
        .matches(/^[A-z]$/, "Letters only")
        .test(
          "is-greater-than-to",
          "From should be greater than or equal with to",
          (value, context) => {
            if (context.parent.to) {
              const from = value.charCodeAt(0);
              const to = context.parent.to.charCodeAt(0);

              return to >= from;
            }

            return true;
          },
        ),
      to: string()
        .required("Required")
        .min(1, "Single letter only")
        .max(1, "Single letter only")
        .matches(/^[A-z]$/, "Letters only")
        .test(
          "is-greater-than-from",
          "To should be greater than or equal with from",
          (value, context) => {
            if (context.parent.from) {
              const from = context.parent.from.charCodeAt(0);
              const to = value.charCodeAt(0);

              return to >= from;
            }

            return true;
          },
        ),
      // .when("from", {
      //   is: (val: string) => !!val,
      //   then: (schema) => schema.
      // }),
      size: number()
        .typeError("Invalid")
        .nullable()
        .required("Required")
        .min(1, "Too low")
        .max(30, "Too high"),
    }),
    // .test(
    //   "is-greater-than-from",
    //   "To should be greater than or equal to from",
    //   (val, context) => {
    //     const from = context.parent.from.charCodeAt(0);
    //     const to = context.parent.to.charCodeAt(0);

    //     if (to < from) {
    //       return false;
    //     }

    //     return true;
    //   },
    // ),
  ),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
