"use client";

import * as React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { debounce } from "@mui/material/utils";

import { api } from "~/trpc/react";

type SearchFilterValue<Value, Multiple> = Multiple extends true
  ? Array<Value>
  : Value;

type UserFullDetails<Value> = {
  id: Value;
  name: Value;
  username: Value;
};

type FullDetails<Value> = Array<UserFullDetails<Value>>;

type CustomAPIFilters = {
  exclude?: string[];
  isAdmin?: boolean;
};

interface SearchUserInputProps<Value, Multiple extends boolean | undefined> {
  label: string;
  value: SearchFilterValue<Value, Multiple>;
  setValue: (
    value: SearchFilterValue<Value, Multiple>,
    fullDetails?: FullDetails<Value>,
  ) => void;
  customAPIFilters?: CustomAPIFilters;
  multiple?: Multiple;
  disabled?: boolean;
  required?: boolean;
}

export default function SearchUserInput<
  Value extends string,
  Multiple extends boolean | undefined = false,
>({
  value,
  setValue,
  label,
  disabled = false,
  multiple,
  required,
  customAPIFilters,
}: SearchUserInputProps<Value, Multiple>) {
  const [inputValue, setInputValue] = React.useState("");
  const [names, setNames] = React.useState<{ [key: string]: string }>({});
  const [userNames, setUserNames] = React.useState<{ [key: string]: string }>(
    {},
  );

  const handleInputChange = debounce((_, newInputValue: string) => {
    setInputValue(newInputValue);
  }, 300);
  const { isLoading, data } = api.user.searchUser.useQuery({
    q: !value ? inputValue : "",
    include: Array.isArray(value) ? value : value ? [value] : undefined,
    ...customAPIFilters,
  });

  const options = React.useMemo(() => {
    if (!data?.length) return [];
    return data.map((user) => user.id);
  }, [data]);

  React.useEffect(() => {
    if (!data) return;
    setNames({
      ...names,
      ...Object.fromEntries(data.map((user) => [user.id, user.name])),
    });
    setUserNames({
      ...userNames,
      ...Object.fromEntries(
        data.map((user) => [user.id, user.username.toUpperCase()]),
      ),
    });
  }, [data]);

  return (
    <Autocomplete
      multiple={multiple === undefined || multiple}
      disabled={disabled}
      value={value}
      onChange={(_, newValue) => {
        setValue(
          // @ts-ignore
          newValue,
          Array.isArray(newValue)
            ? newValue.map((id) => ({
                id,
                name: names[id],
                username: userNames[id],
              }))
            : [
                {
                  id: newValue,
                  // @ts-ignore
                  name: names[newValue],
                  // @ts-ignore
                  username: userNames[newValue],
                },
              ],
        );
      }}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) =>
        names[option] ? `${names[option]} (${userNames[option]})` : option
      }
      noOptionsText="No More Users"
      filterSelectedOptions
      limitTags={5}
      autoHighlight
      includeInputInList
      autoComplete
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            required,
            endAdornment: (
              <React.Fragment>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
