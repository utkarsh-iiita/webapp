"use client";

import { useSearchParams } from "next/navigation";

import { TextField } from "@mui/material/index";

const DEFAULT_SEARCH_PARAM_KEY = "q";

interface SearchInputProps {
  onChange: (key: string, value: string) => void;
}

export default function SearchInput(props: SearchInputProps) {
  const searchParams = useSearchParams();
  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      className="flex-grow"
      defaultValue={searchParams.get(DEFAULT_SEARCH_PARAM_KEY)}
      onChange={(e) => {
        props.onChange(DEFAULT_SEARCH_PARAM_KEY, e.target.value);
      }}
    />
  );
}
