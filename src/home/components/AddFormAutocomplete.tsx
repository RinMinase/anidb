import { ControlledAutocomplete } from "@components";
import { useEffect, useState } from "preact/hooks";
import { Control, FieldValues, Path, UseFormSetValue } from "react-hook-form";
import axios from "axios";
import DebouncePromise from "awesome-debounce-promise";

import { TitleObject } from "../types";

type Props<T extends FieldValues> = {
  entryId?: string;
  name: Path<T>;
  actualIdFieldName: string;
  label: string;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  error: boolean;
  helperText?: string;
  disabled: boolean;
  initialOptions: AutocompleteOptions;
  shouldExcludeEntry?: boolean;
};

type AutocompleteOptions = Array<{
  id: string;
  label: string;
}>;

const searchAPI = (
  id?: string,
  needle?: string,
  idExcluded: boolean = false,
) => {
  return axios.get("/entries/titles", {
    params: {
      id: id === "" ? null : id,
      needle: needle === "" ? null : needle,
      id_excluded: idExcluded,
    },
  });
};

const searchAPIDebounced = DebouncePromise(searchAPI, 250);

const AddFormAutocomplete = <T extends FieldValues>(props: Props<T>) => {
  const [options, setOptions] = useState<AutocompleteOptions>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: any) => {
    const element = e.target as HTMLInputElement;
    const val = element.value;

    setOptions([]);
    setLoading(true);

    const {
      data: { data },
    } = await searchAPIDebounced(props.entryId, val, props.shouldExcludeEntry);

    const values = data.map((data: TitleObject) => ({
      id: data.id,
      label: data.title,
    }));

    setOptions(structuredClone(values));
    setLoading(false);
  };

  const handleChangeInput = (_e: any, data: any) => {
    const item = options.find((i) => i.label === data);
    props.setValue(
      props.actualIdFieldName as any,
      (item?.id || undefined) as any,
    );
  };

  useEffect(() => {
    setOptions(props.initialOptions);
  }, [props.initialOptions]);

  return (
    <ControlledAutocomplete
      name={props.name}
      label={props.label}
      options={options}
      control={props.control}
      error={props.error}
      helperText={props.helperText}
      disabled={props.disabled}
      loadingContents={loading}
      onChange={handleChange}
      extraOnInputChange={handleChangeInput}
      fullWidth
    />
  );
};

export default AddFormAutocomplete;
