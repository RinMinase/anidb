import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { bool, date, number, object, string } from "yup";

import { emptyStringToNull } from "@components";

export type ComponentForm = {
  id_type?: string;
  name: string;
  description?: string;
  price?: number;
  purchase_date: Date | null;
  purchase_location?: string;
  purchase_notes?: string;
};

export const componentFormDefaultValues: ComponentForm = {
  id_type: "",
  name: "",
  purchase_date: null,
};

const componentFormSchema = object({
  id_type: string().required("Required"),
  name: string().required("Required"),

  description: string().nullable(),
  price: number()
    .typeError("Value should be a number")
    .transform(emptyStringToNull)
    .nullable(),

  purchase_date: date().nullable().default(undefined).typeError("Invalid date"),
  purchase_location: string().nullable(),
  purchase_notes: string().nullable(),
});

export const componentFormResolver: Resolver<ComponentForm> = yupResolver(
  componentFormSchema,
) as any;

export type ComponentTypeForm = {
  type: string;
  name: string;
  is_peripheral: boolean;
};

export const componentTypeFormDefaultValues: ComponentTypeForm = {
  type: "",
  name: "",
  is_peripheral: true,
};

const componentTypeFormSchema = object({
  type: string().required("Required"),
  name: string().required("Required"),
  is_peripheral: bool().required("Required"),
});

export const componentTypeFormResolver: Resolver<ComponentTypeForm> =
  yupResolver(componentTypeFormSchema) as any;
