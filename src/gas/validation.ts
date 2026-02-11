import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { format } from "date-fns";
import { date, number, object, ref } from "yup";

import { emptyStringToNull } from "@components";

export type Form = {
  date: Date;
  from_bars: number;
  to_bars: number;
  odometer?: number;
  price_per_liter?: number;
  liters_filled?: number;
};

const defaultValues: Form = {
  date: new Date(),
  from_bars: 1,
  to_bars: 9,
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
  from_bars: number().min(0).max(9).required("From is required"),
  to_bars: number()
    .min(ref("from_bars"), "Must be greater than from")
    .max(9)
    .required("To is required"),
  odometer: number()
    .min(0, "Invalid Odo number")
    .max(100000, "Odo should be less than or equal to 100,000")
    .transform(emptyStringToNull)
    .required("Odo is required"),
  price_per_liter: number()
    .min(0, "Invalid price")
    .max(150, "Price should be less than or equal to 150")
    .typeError("Price should be a number")
    .transform(emptyStringToNull)
    .nullable(),
  liters_filled: number()
    .min(0, "Invalid value")
    .max(40, "Value should be less than or equal to 40")
    .typeError("Value should be a number")
    .transform(emptyStringToNull)
    .nullable(),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
