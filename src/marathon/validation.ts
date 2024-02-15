import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { date, object, ref, string } from "yup";

export type Form = {
  title: string;
  dateFrom: Date;
  dateTo: Date;
};

const defaultValues = {
  title: "",
  dateFrom: new Date(),
  dateTo: new Date(),
};

const schema = object({
  title: string().required("Title / Description is required"),
  dateFrom: date().required("Date From is required").min(new Date(1900, 1, 1)),
  dateTo: date()
    .required("Date To is required")
    .min(ref("dateFrom"), "Date needs to be after 'From'"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
