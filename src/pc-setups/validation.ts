// commit to change to lf
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { array, boolean, number, object, string } from "yup";

/**
 * Add Owner Form
 */
export type AddOwnerForm = {
  name: string;
};

const addOwnerDefaultValues: AddOwnerForm = {
  name: "",
};

const addOwnerSchema = object({
  name: string().required("Owner name is required"),
});

const addOwnerResolver: Resolver<AddOwnerForm> = yupResolver(
  addOwnerSchema,
) as any;

export { addOwnerDefaultValues, addOwnerResolver };

/**
 * Add Component Form
 */
export type AddComponentForm = {
  component?: {
    id: string;
    label: string;
  };
  id_type?: string;
  count: number | null;
  hidden: string;
};

export const addComponentDefaultValues: AddComponentForm = {
  id_type: "",
  count: 1,
  hidden: "FALSE",
};

export const addComponentSchema = object({
  id_component: object()
    .shape({
      id: string(),
      label: string(),
    })
    .required("Required"),
  id_type: string().required("Required"),
  count: number().typeError("Required").nullable().required("Required"),
  hidden: string().required("Required"),
});

export const addComponentResolver: Resolver<AddComponentForm> = yupResolver(
  addComponentSchema,
) as any;

/**
 * PC Setup Form
 */
export type PCSetupFormComponent = {
  // required for API
  id_component: string;
  count: number | null;
  hidden: boolean;

  // for table data
  type: string;
  name: string;
  price?: number;
  priceEstimate?: number;
  purchaseLocation?: string;
  purchaseDate?: string;
  purchaseNotes?: string;
  isOnhand?: boolean;
};

export type PCSetupForm = {
  label: string;
  hiddenSetup: boolean;
  components?: Array<PCSetupFormComponent>;
};

export const pcSetupDefaultValues: PCSetupForm = {
  label: "",
  hiddenSetup: false,
  components: [],
};

export const pcSetupSchema = object().shape({
  label: string().required("Required"),
  hiddenSetup: boolean().required("Required"),
  components: array().of(
    object().shape({
      id_component: string().required("Required"),
      count: number().typeError("Invalid").nullable().required("Required"),
      hidden: boolean().required("Required"),
    }),
  ),
});

export const pcSetupResolver: Resolver<PCSetupForm> = yupResolver(
  pcSetupSchema,
) as any;
