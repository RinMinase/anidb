import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { Resolver } from "react-hook-form";
import { bool, date, lazy, number, object, string } from "yup";

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

const dateTime = new Date();
dateTime.setDate(dateTime.getDate() + 1);

const dateOnly = new Date(
  dateTime.valueOf() + dateTime.getTimezoneOffset() * 60 * 1000,
);
const now = format(dateOnly, "yyyy-MM-dd");
const minDate = "1990-01-01";

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
    .typeError("Invalid date")
    .min(minDate, "Invalid date")
    .max(now, "Date should not be in the future")
    .nullable(),

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
});

const rewatchSchema = object({
  dateRewatch: date()
    .max(new Date(), "Invalid date")
    .required("Date is required"),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;
const rewatchResolver: Resolver<RewatchForm> = yupResolver(
  rewatchSchema,
) as any;

export { defaultValues, resolver, rewatchDefaultValues, rewatchResolver };
