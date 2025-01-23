import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { object, string } from "yup";

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
