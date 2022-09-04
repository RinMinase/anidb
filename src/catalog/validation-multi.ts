import { yupResolver } from "@hookform/resolvers/yup";
import { object, string } from "yup";

export type Form = {
  season: string;
  year: string;
  low: string;
  normal: string;
  high: string;
};

const defaultValues: Form = {
  season: "",
  year: "",
  low: "",
  normal: "",
  high: "",
};

const schema = object({
  season: string().required("Season is required"),
  year: string().required("Year is required"),
  low: string().test(
    "test-others",
    "At least one title of either Low, Medium or High must be entered",
    (value, context) => value || context.parent.normal || context.parent.high,
  ),
  normal: string().test(
    "test-others",
    "At least one title of either Low, Medium or High must be entered",
    (value, context) => value || context.parent.low || context.parent.high,
  ),
  high: string().test(
    "test-others",
    "At least one title of either Low, Medium or High must be entered",
    (value, context) => value || context.parent.low || context.parent.normal,
  ),
});

const resolver = yupResolver(schema);

export { defaultValues, resolver };
