import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { date, number, object, string } from "yup";

export type Form = {
  id_quality: number;
  title: string;
  date_finished: string;
  duration?: number;
  filesize?: number;

  episodes?: number;
  ovas?: number;
  specials?: number;

  season_number?: number
  season_first_title_id?: string;

  prequel_id?: string;
  sequel_id?: string;

  encoder_video?: string;
  encoder_audio?: string;
  encoder_subs?: string;

  release_year?: number;
  release_season?: string;

  variants?: string;
  remarks?: string;
};

const defaultValues = {
  id_quality: 2,
  title: "",
  date_finished: format(new Date(), "MM-dd-yyyy"),
};

const schema = object().shape({
  id_quality: number().required("Required"),
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

  release_year: number().nullable(),
  release_season: string().nullable(),

  variants: string().nullable(),
  remarks: string().nullable(),
});

const resolver = yupResolver(schema);

export { defaultValues, resolver };
