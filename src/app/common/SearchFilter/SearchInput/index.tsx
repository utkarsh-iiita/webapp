"use client";

import { type ReadonlyURLSearchParams } from "next/navigation";

import { TextField } from "@mui/material";

const DEFAULT_SEARCH_PARAM_KEY = "q";

interface SearchInputProps {
  onChange: (key: string, value: string) => void;
  defaultValues?: ReadonlyURLSearchParams;
}

export default function SearchInput(props: SearchInputProps) {
  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      className="flex-grow"
      defaultValue={props.defaultValues?.[DEFAULT_SEARCH_PARAM_KEY]}
      onChange={(e) => {
        props.onChange(DEFAULT_SEARCH_PARAM_KEY, e.target.value);
      }}
    />
  );
}
