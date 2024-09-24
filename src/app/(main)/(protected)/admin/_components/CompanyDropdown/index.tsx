"use client";

import { useState } from "react";
import axios from "axios";

import {
  Autocomplete,
  Avatar,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { type CompanyDropdownProps } from "./types";

export default function CompanyDropdown(props: CompanyDropdownProps) {
  const [companyQuery, setCompanyQuery] = useState("");

  const { data: companyOptions, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies", companyQuery],
    queryFn: async () => {
      if (!companyQuery) return [];
      try {
        const data = await axios.get(
          `https://autocomplete.clearbit.com/v1/companies/suggest?query=${companyQuery}`,
        );

        return data.data?.map((item) => {
          return {
            name: item.name,
            website: item.domain,
            logo: item.logo,
          };
        });
      } catch (error) {
        return [];
      }
    },
  });

  return (
    <Autocomplete
      value={props.company}
      onChange={(_, newValue) => props.setCompany(newValue)}
      disabled={props.disabled}
      options={companyOptions || []}
      getOptionKey={(option) => option.website}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => (
        // @ts-ignore
        <div
          {...props}
          className="flex flex-row items-center gap-2 px-3 py-2 cursor-pointer"
        >
          <Avatar
            sx={{
              borderRadius: 1,
            }}
            variant="square"
            src={option.logo}
          />
          <Typography variant="body2">{option.name}</Typography>
          <Typography variant="caption" color="textSecondary">
            ({option.website})
          </Typography>
        </div>
      )}
      renderInput={(params) => (
        <div className="flex flex-row gap-2 items-center">
          {props.company?.logo && (
            <Avatar
              sx={{
                borderRadius: 1,
                height: 54,
                width: 54,
              }}
              variant="square"
              src={props.company.logo}
            />
          )}
          <TextField
            {...params}
            label="Company"
            name="company"
            onChange={(e) => setCompanyQuery(e.target.value)}
            InputProps={{
              ...params.InputProps,
              required: props.required,
              endAdornment: (
                <>
                  {isCompaniesLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            required={props.required}
          />
        </div>
      )}
    />
  );
}
