import { useEffect } from "react";

import {
  Autocomplete,
  Avatar,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import { type JobOpeningSelectorProps } from "./types";

export default function JobOpeningSelector(props: JobOpeningSelectorProps) {
  const { data: jobOpenings, isLoading } =
    api.jobOpenings.adminGetJobOpenings.useQuery({
      limit: -1,
    });

  useEffect(() => {
    if (props.jobOpeningId && jobOpenings?.data) {
      const selectedOpening = jobOpenings.data?.find(
        (opening) => opening.id === props.jobOpeningId,
      );
      if (selectedOpening) {
        props.setJobOpeningDetails(selectedOpening);
      } else {
        props.setJobOpeningId(null);
      }
    }
  }, [jobOpenings]);

  return (
    <Autocomplete
      value={props.jobOpeningDetails}
      disabled={props.disabled}
      onChange={(_, newValue) => {
        props.setJobOpeningId(newValue?.id ?? null);
        props.setJobOpeningDetails(newValue);
      }}
      clearText="Clear"
      options={jobOpenings?.data ?? []}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.title}
      renderInput={(params) => (
        <div className="flex flex-row gap-2 items-center">
          {props.jobOpeningDetails?.company?.logo && (
            <Avatar
              sx={{
                borderRadius: 1,
                height: 54,
                width: 54,
              }}
              variant="square"
              src={props.jobOpeningDetails.company.logo}
            />
          )}
          <TextField
            {...params}
            label="Job Opening"
            name="jobOpening"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        </div>
      )}
      renderOption={(props, option) => (
        // @ts-ignore
        <div
          key={option.id}
          {...props}
          className="flex flex-row items-center gap-2 px-3 py-2 cursor-pointer"
        >
          <Avatar
            sx={{
              borderRadius: 1,
            }}
            variant="square"
            src={option.company?.logo}
          />
          <div className="flex flex-col justify-between">
            <Typography variant="body2">{option.title}</Typography>
            <Typography variant="caption" color="textSecondary">
              {option.company?.name} - {option.placementType.name} -{" "}
              {option.role}
            </Typography>
          </div>
        </div>
      )}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
    />
  );
}
