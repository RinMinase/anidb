import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { format } from "date-fns";
import { array, date, number, object, string } from "yup";

import { emptyStringToNull } from "@components";

export type Form = {
  date: Date;
  description: string;
  odometer?: number;
  parts: Array<string>;
};

const defaultValues: Form = {
  date: new Date(),
  description: "",
  parts: [],
};

const minDate = "1990-01-01";

const maxDateRaw = new Date();
maxDateRaw.setDate(maxDateRaw.getDate() + 1);
const maxDate = format(maxDateRaw, "yyyy-MM-dd");

const schema = object({
  date: date()
    .min(minDate, "Invalid date")
    .max(maxDate, "Date should not be in the future")
    .required("Date is required")
    .default(undefined)
    .typeError("Invalid date"),
  description: string().required("Description is required"),
  odometer: number()
    .min(0, "Invalid Odo number")
    .max(100000, "Odo should be less than or equal to 100,000")
    .transform(emptyStringToNull)
    .nullable(),
  parts: array()
    .of(string().required())
    .min(1, "Please select at least one part type")
    .required("Part types are required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
