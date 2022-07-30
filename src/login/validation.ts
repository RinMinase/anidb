import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export type Form = {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required("Email is required"),
  password: yup.string().required("Password is required")
});

const resolver = yupResolver(schema);

export { resolver };
