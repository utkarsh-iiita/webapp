"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { debounce, Paper } from "@mui/material/index";

import SearchInput from "./SearchInput";

const FilterTypeMappings = {
  textInput: SearchInput,
} as const;

interface SearchFilterProps {
  allowedFilters: {
    [key in keyof typeof FilterTypeMappings]?: boolean;
  };
}

export default function SearchFilter({ allowedFilters }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = debounce((key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const queryString = params.toString();
    if (!queryString) {
      replace(pathname);
    } else {
      replace(pathname + "?" + queryString);
    }
  }, 300);

  return (
    <Paper
      elevation={2}
      className="p-2 flex md:flex-row flex-col gap-4 md:gap-2 md:items-center"
    >
      {Object.keys(allowedFilters).map((key, index) => {
        const Filter = FilterTypeMappings[key];
        return <Filter key={index} onChange={handleSearch} />;
      })}
    </Paper>
  );
}
