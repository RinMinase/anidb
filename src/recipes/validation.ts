import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { array, object, string } from "yup";

export type Form = {
  title: string;
  description: string;
  ingredients?: { value: string }[];
  instructions: string;
};

const defaultValues: Form = {
  title: "",
  description: "",
  ingredients: [],
  instructions: "",
};

const schema = object({
  title: string().required("Title is required"),
  description: string().nullable(),
  ingredients: array().of(
    object({
      value: string().required(),
    }),
  ),
  // .compact() // automatically removes empty strings
  // .notRequired()
  // .default([]),
  instructions: string().nullable(),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
