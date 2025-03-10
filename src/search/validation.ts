// commit to change to lf
import { array, object, string } from "yup";
import { Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { OptionsKeyedProps } from "@components";

export const SearchDropdownValues = ["any", "yes", "no"] as const;
export type SearchDropdownType = (typeof SearchDropdownValues)[number];
export const SearchDropdownOptions: OptionsKeyedProps = [
  {
    label: "Any",
    key: "any",
    value: "any",
  },
  {
    label: "Yes",
    key: "yes",
    value: "yes",
  },
  {
    label: "No",
    key: "no",
    value: "no",
  },
];

export const ColumnDropdownValues = [
  "id_quality",
  "title",
  "date_finished",
  "filesize",
  "episodes",
  "ovas",
  "specials",
  "release_year",
  "release_season",
  "remarks",
] as const;

export type ColumnDropdownType = (typeof ColumnDropdownValues)[number];

export const ColumnDropDownOptions: OptionsKeyedProps = [
  {
    label: "Quality",
    key: "id_quality",
    value: "id_quality",
  },
  {
    label: "Title",
    key: "title",
    value: "title",
  },
  {
    label: "Date Finished",
    key: "date_finished",
    value: "date_finished",
  },
  {
    label: "Filesize",
    key: "filesize",
    value: "filesize",
  },
  {
    label: "Episodes",
    key: "episodes",
    value: "episodes",
  },
  {
    label: "OVAs",
    key: "ovas",
    value: "ovas",
  },
  {
    label: "Specials",
    key: "specials",
    value: "specials",
  },
  {
    label: "Release Year",
    key: "release_year",
    value: "release_year",
  },
  {
    label: "Release Season",
    key: "release_season",
    value: "release_season",
  },
  {
    label: "Remarks",
    key: "remarks",
    value: "remarks",
  },
];

export const OrderDropdownValues = ["asc", "desc"] as const;
export type OrderDropdownType = (typeof OrderDropdownValues)[number];
export const OrderDropDownOptions: OptionsKeyedProps = [
  {
    label: "Ascending",
    key: "asc",
    value: "asc",
  },
  {
    label: "Descending",
    key: "desc",
    value: "desc",
  },
];

export type Form = {
  quality?: string;
  title?: string;
  date?: string;
  filesize?: string;

  episodes?: string;
  ovas?: string;
  specials?: string;

  encoder?: string;
  encoder_video?: string;
  encoder_audio?: string;
  encoder_subs?: string;

  release?: string;
  rating?: string;
  remarks?: string;

  has_remarks: SearchDropdownType;
  has_image: SearchDropdownType;
  is_hdr: SearchDropdownType;

  codec_video?: Array<string>;
  codec_audio?: Array<string>;
  genres?: Array<string>;
  watcher?: string;

  column?: ColumnDropdownType;
  order: OrderDropdownType;
};

const defaultValues: Form = {
  quality: "",
  title: "",
  date: "",
  filesize: "",

  episodes: "",
  ovas: "",
  specials: "",

  encoder: "",
  encoder_video: "",
  encoder_audio: "",
  encoder_subs: "",

  release: "",
  rating: "",
  remarks: "",

  has_remarks: "any",
  has_image: "any",
  is_hdr: "any",

  codec_video: [],
  codec_audio: [],
  genres: [],
  watcher: "",

  column: "id_quality",
  order: "asc",
};

const schema = object().shape({
  quality: string(),
  title: string(),
  date: string(),
  filesize: string(),

  episodes: string(),
  ovas: string(),
  specials: string(),

  release: string(),
  rating: string(),
  remarks: string(),

  has_remarks: string().oneOf(SearchDropdownValues),
  has_image: string().oneOf(SearchDropdownValues),
  is_hdr: string().oneOf(SearchDropdownValues),

  codec_video: array(string()),
  codec_audio: array(string()),
  genres: array(string()),
  watcher: string(),

  column: string(),
  order: string().oneOf(OrderDropdownValues),
});

const resolver: Resolver<Form> = yupResolver(schema) as any;

export { defaultValues, resolver };
