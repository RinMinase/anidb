import { yupResolver } from "@hookform/resolvers/yup";
import { bool, date, number, object, string } from "yup";

import { emptyStringToNull } from "@components";

export type Form = {
  id_quality: string;
  title: string;
  date_finished: Date;
  duration?: number;
  filesize?: number;

  episodes?: number;
  ovas?: number;
  specials?: number;

  season_number?: number;
  season_first_title_id?: string;

  prequel?: string;
  prequel_id?: string;
  sequel_id?: string;

  encoder_video?: string;
  encoder_audio?: string;
  encoder_subs?: string;

  release_year?: string;
  release_season?: string;

  id_codec_video?: string;
  id_codec_audio?: string;
  codec_hdr?: boolean;

  variants?: string;
  remarks?: string;
};

export type RewatchForm = {
  dateRewatch: Date;
};

const defaultValues = {
  id_quality: "",
  title: "",
  date_finished: new Date(),
  release_year: "",
  release_season: "",
  id_codec_video: "",
  id_codec_audio: "",
  codec_hdr: false,
};

const rewatchDefaultValues = {
  dateRewatch: new Date(),
};

const schema = object().shape({
  id_quality: number().typeError("Required").required("Required"),
  title: string().required("Required"),
  date_finished: date().max(new Date()),
  duration: string().nullable(),
  filesize: number().transform(emptyStringToNull).nullable(),

  episodes: number().transform(emptyStringToNull).nullable(),
  ovas: number().transform(emptyStringToNull).nullable(),
  specials: number().transform(emptyStringToNull).nullable(),

  season_number: number().transform(emptyStringToNull).nullable(),
  season_first_title_id: string().nullable(),

  prequel_id: string().nullable(),
  sequel_id: string().nullable(),

  encoder_video: string().nullable(),
  encoder_audio: string().nullable(),
  encoder_subs: string().nullable(),

  release_year: string().nullable(),
  release_season: string().nullable(),

  id_codec_video: string().nullable(),
  id_codec_audio: string().nullable(),
  codec_hdr: bool(),

  variants: string().nullable(),
  remarks: string().nullable(),
});

const rewatchSchema = object({
  dateRewatch: date()
    .max(new Date(), "Invalid date")
    .required("Date is required"),
});

const resolver = yupResolver(schema);
const rewatchResolver = yupResolver(rewatchSchema);

export { defaultValues, resolver, rewatchDefaultValues, rewatchResolver };
