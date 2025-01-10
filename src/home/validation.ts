import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver } from "react-hook-form";
import { format } from "date-fns";
import { array, bool, date, lazy, number, object, string } from "yup";

import { emptyStringToNull, FILESIZES } from "@components";

export type Form = {
  id_quality: string;
  title: string;
  date_finished: Date;
  filesize?: number;

  episodes?: number;
  ovas?: number;
  specials?: number;

  season_number?: number;
  season_first_title?: { id: string; label: string };
  season_first_title_id?: string;

  prequel?: { id: string; label: string };
  prequel_id?: string;

  sequel?: { id: string; label: string };
  sequel_id?: string;

  encoder_video?: string;
  encoder_audio?: string;
  encoder_subs?: string;

  release_year?: string;
  release_season?: string;

  id_codec_video?: number | string;
  id_codec_audio?: number | string;
  codec_hdr?: boolean;

  variants?: string;
  remarks?: string;

  duration_hrs?: number;
  duration_mins?: number;
  duration_secs?: number;

  genres?: Array<string>;
  id_watcher?: string;
};

export type RewatchForm = {
  date_rewatched: Date;
};

export type OffquelForm = {
  offquel?: { id: string; label: string };
  offquel_id?: string;
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
  genres: [],
  id_watcher: "",
};

const rewatchDefaultValues = {
  date_rewatched: new Date(),
};

const minDate = "1990-01-01";

const maxDateRaw = new Date();
maxDateRaw.setDate(maxDateRaw.getDate() + 1);
const maxDate = format(maxDateRaw, "yyyy-MM-dd");

const schema = object().shape({
  id_quality: number().typeError("Required").required("Required"),
  title: lazy((value) => {
    if (typeof value === "object") {
      return object({
        id: string(),
        label: string(),
      })
        .nullable()
        .optional();
    }

    return string().required("Required");
  }),

  date_finished: date()
    .min(minDate, "Invalid date")
    .max(maxDate, "Date should not be in the future")
    .nullable()
    .default(undefined)
    .typeError("Invalid date"),

  filesize: number()
    .transform(emptyStringToNull)
    .max(FILESIZES.TB, "Filesize should be lesser than 1 TB")
    .nullable(),

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

  id_codec_video: number().transform(emptyStringToNull).nullable(),
  id_codec_audio: number().transform(emptyStringToNull).nullable(),
  codec_hdr: bool(),

  variants: string().nullable(),
  remarks: string().nullable(),
  genres: array(string()),

  duration_hrs: number()
    .transform(emptyStringToNull)
    .min(0, "Invalid hours value")
    .nullable(),

  duration_mins: number()
    .transform(emptyStringToNull)
    .min(0, "Invalid minutes value")
    .max(59, "Invalid minutes value")
    .nullable(),

  duration_secs: number()
    .transform(emptyStringToNull)
    .min(0, "Invalid seconds value")
    .max(59, "Invalid seconds value")
    .nullable(),

  id_watcher: number()
    .transform(emptyStringToNull)
    .min(0, "Invalid seconds value")
    .nullable(),
});

const rewatchSchema = object({
  date_rewatched: date()
    .min(minDate, "Invalid date")
    .max(new Date(), "Date should not be in the future")
    .required("Date is required")
    .default(undefined)
    .typeError("Invalid date"),
});

const offquelSchema = object({
  offquel_id: string().nullable(),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

const rewatchResolver: Resolver<RewatchForm> = yupResolver(
  rewatchSchema,
) as any;

const offquelResolver: Resolver<OffquelForm> = yupResolver(
  offquelSchema,
) as any;

export {
  defaultValues,
  resolver,
  rewatchDefaultValues,
  rewatchResolver,
  offquelResolver,
};
