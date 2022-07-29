import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export type Form = {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required("Required"),
  password: yup.string().required("Required")
});

const resolver = yupResolver(schema);

export { resolver };
