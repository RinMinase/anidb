import { yupResolver } from "@hookform/resolvers/yup";
import { bool, date, number, object, string } from "yup";

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

  codec_video?: string;
  codec_audio?: string;
  hdr?: boolean;

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
  codec_video: "",
  codec_audio: "",
  hdr: false,
};

const rewatchDefaultValues = {
  dateRewatch: new Date(),
};

const schema = object().shape({
  id_quality: number().typeError("Required").required("Required"),
  title: string().required("Required"),
  date_finished: date().max(new Date()),
  duration: number().nullable(),
  filesize: number().nullable(),

  episodes: number().nullable(),
  ovas: number().nullable(),
  specials: number().nullable(),

  season_number: number().nullable(),
  season_first_title_id: string().nullable(),

  prequel_id: string().nullable(),
  sequel_id: string().nullable(),

  encoder_video: string().nullable(),
  encoder_audio: string().nullable(),
  encoder_subs: string().nullable(),

  release_year: string().nullable(),
  release_season: string().nullable(),

  codec_video: string().nullable(),
  codec_audio: string().nullable(),
  hdr: bool(),

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
