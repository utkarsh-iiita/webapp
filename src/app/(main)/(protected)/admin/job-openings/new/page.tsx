"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Autocomplete,
  Avatar,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";

import TextEditor from "~/app/common/components/TextEditor";
import { api } from "~/trpc/react";

import AdditionalFieldSelector from "../_components/AdditionalFieldsSelector";
import JobOpeningGroupSelector from "../_components/ParticipatingGroupsSelector";

import { DEFAULT_JOB_OPENING } from "./constants";

export default function NewJobOpening() {
  const [companyQuery, setCompanyQuery] = useState("");
  const [jobOpening, setJobOpening] = useState(DEFAULT_JOB_OPENING);
  const descEditorRef = useRef<any>();
  const router = useRouter();

  const { data: jobTypes, isLoading: isJobTypesLoading } =
    api.jobType.getPlacementTypes.useQuery();

  const { data: companyOptions, isLoading: isCompaniesLoading } = useQuery({
    queryKey: ["companies", companyQuery],
    queryFn: async () => {
      if (!companyQuery) return [];
      try {
        const data = await axios.get(
          `https://autocomplete.clearbit.com/v1/companies/suggest?query=${companyQuery}`,
        );

        return data.data;
      } catch (error) {
        return [];
      }
    },
  });

  const createJobOpeningMutation = api.jobOpenings.createJobOpening.useMutation(
    {
      onSuccess: () => {
        router.replace("/admin/job-openings");
        router.refresh();
      },
    },
  );

  const isCreationDisabled = useMemo(() => {
    if (
      !jobOpening.title ||
      !jobOpening.company ||
      !jobOpening.jobType ||
      !jobOpening.location ||
      !jobOpening.role ||
      !jobOpening.pay ||
      !jobOpening.payNumeric ||
      !jobOpening.registrationStart ||
      !jobOpening.registrationEnd ||
      !jobOpening.participatingGroups.length
    )
      return true;

    if (jobOpening.registrationStart > jobOpening.registrationEnd) return true;

    if (
      jobOpening.extraApplicationFields.some(
        (field) => !field.title || !field.format,
      )
    )
      return true;

    if (
      jobOpening.participatingGroups.some(
        (group) => !group.admissionYear || !group.program,
      )
    )
      return true;

    return false;
  }, [jobOpening]);

  return (
    <Container className="flex flex-col gap-4 py-4">
      <Typography variant="h5" color="primary" className="px-4">
        New Job Opening
      </Typography>
      <Divider />
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const reqData: any = jobOpening;
          reqData.registrationStart = new Date(
            reqData.registrationStart.toISOString(),
          );
          reqData.registrationEnd = new Date(
            reqData.registrationEnd.toISOString(),
          );
          reqData.description = descEditorRef.current.getContent();
          reqData.participatingGroups = reqData.participatingGroups.map(
            (group) => ({
              admissionYear: parseInt(group.admissionYear),
              program: group.program,
            }),
          );
          createJobOpeningMutation.mutate(reqData);
        }}
      >
        <FormControl variant="standard">
          <TextField
            label="Title"
            name="title"
            value={jobOpening.title}
            onChange={(e) =>
              setJobOpening({ ...jobOpening, title: e.target.value })
            }
            inputProps={{ maxLength: 180 }}
            required
          />
          <FormHelperText className="text-right">
            {jobOpening.title.length}/180
          </FormHelperText>
        </FormControl>
        <Autocomplete
          value={jobOpening.company}
          onChange={(_, newValue) =>
            setJobOpening({ ...jobOpening, company: newValue })
          }
          options={companyOptions || []}
          getOptionKey={(option) => option.domain}
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
                ({option.domain})
              </Typography>
            </div>
          )}
          renderInput={(params) => (
            <div className="flex flex-row gap-2 items-center">
              {jobOpening.company?.logo && (
                <Avatar
                  sx={{
                    borderRadius: 1,
                    height: 54,
                    width: 54,
                  }}
                  variant="square"
                  src={jobOpening.company.logo}
                />
              )}
              <TextField
                {...params}
                label="Company"
                name="company"
                onChange={(e) => setCompanyQuery(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  required: true,
                  endAdornment: (
                    <React.Fragment>
                      {isCompaniesLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
                required
              />
            </div>
          )}
        />
        <FormControl>
          <InputLabel>Job Type *</InputLabel>
          <Select
            value={jobOpening.jobType}
            onChange={(e) =>
              setJobOpening({ ...jobOpening, jobType: e.target.value })
            }
            label="Job Type"
            endAdornment={
              isJobTypesLoading && (
                <CircularProgress color="inherit" size={20} className="mr-8" />
              )
            }
            required
          >
            {jobTypes?.map((jobType, index) => (
              <MenuItem key={index} value={jobType.id}>
                {jobType.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Location"
          name="location"
          value={jobOpening.location}
          onChange={(e) =>
            setJobOpening({ ...jobOpening, location: e.target.value })
          }
          inputProps={{ maxLength: 180 }}
          required
        />
        <TextField
          label="Role"
          name="role"
          value={jobOpening.role}
          onChange={(e) =>
            setJobOpening({ ...jobOpening, role: e.target.value })
          }
          inputProps={{ maxLength: 180 }}
          required
        />
        <FormControl variant="standard">
          <TextField
            label="Pay"
            name="pay"
            value={jobOpening.pay}
            onChange={(e) =>
              setJobOpening({ ...jobOpening, pay: e.target.value })
            }
            inputProps={{ maxLength: 180 }}
            required
          />
          <FormHelperText>
            Specify the pay of the company as a string, same will be displayed
            to the user, e.g. "Rs. 12 LPA"
          </FormHelperText>
        </FormControl>
        <FormControl variant="standard">
          <TextField
            label="Pay(Numeric)"
            name="payNumeric"
            type="number"
            value={jobOpening.payNumeric}
            onChange={(e) =>
              setJobOpening({
                ...jobOpening,
                payNumeric: Number(e.target.value),
              })
            }
            inputProps={{ maxLength: 180, min: 0 }}
            required
          />
          <FormHelperText>
            Specify the pay of the company on per month basis for internship and
            per year basis for full time, this number will <strong>NOT</strong>{" "}
            be displayed to user. It will only be used for analytics.
          </FormHelperText>
        </FormControl>
        <DateTimePicker
          name="registrationStart"
          value={jobOpening.registrationStart}
          onChange={(date) =>
            setJobOpening({ ...jobOpening, registrationStart: date })
          }
          label="Registration Start Date and Time"
        />

        <DateTimePicker
          name="registrationEnd"
          value={jobOpening.registrationEnd}
          onChange={(date) =>
            setJobOpening({ ...jobOpening, registrationEnd: date })
          }
          label="Registration End Date and Time"
        />

        <JobOpeningGroupSelector
          jobTypeId={jobOpening.jobType}
          value={jobOpening.participatingGroups}
          onChange={(value) =>
            setJobOpening({ ...jobOpening, participatingGroups: value })
          }
        />

        <Typography variant="body1" color="text.disabled">
          Detailed Job Description:
        </Typography>
        <TextEditor
          height="60vmin"
          value={jobOpening.description}
          ref={descEditorRef}
        />
        <AdditionalFieldSelector
          value={jobOpening.extraApplicationFields}
          onChange={(value) =>
            setJobOpening({ ...jobOpening, extraApplicationFields: value })
          }
        />
        <div className="flex flex-row gap-4 justify-end flex-wrap">
          <FormControlLabel
            label="Create Hidden"
            control={
              <Checkbox
                size="small"
                checked={jobOpening.hidden}
                onChange={(e) => {
                  setJobOpening({ ...jobOpening, hidden: e.target.checked });
                }}
              />
            }
          />
          <FormControlLabel
            label="Auto Approve"
            control={
              <Checkbox
                size="small"
                checked={jobOpening.autoApprove}
                onChange={(e) => {
                  setJobOpening({
                    ...jobOpening,
                    autoApprove: e.target.checked,
                  });
                }}
              />
            }
          />
          <FormControlLabel
            label="Auto Visible"
            control={
              <Checkbox
                size="small"
                checked={jobOpening.autoVisible}
                onChange={(e) => {
                  setJobOpening({
                    ...jobOpening,
                    autoVisible: e.target.checked,
                  });
                }}
              />
            }
          />
          <FormControlLabel
            label="Allow Already Selected Students"
            control={
              <Checkbox
                size="small"
                checked={jobOpening.allowSelected}
                onChange={(e) => {
                  setJobOpening({
                    ...jobOpening,
                    allowSelected: e.target.checked,
                  });
                }}
              />
            }
          />
        </div>

        <Divider className="mt-12" />
        <Container className="flex flex-row justify-end">
          <LoadingButton
            type="submit"
            variant="contained"
            disabled={isCreationDisabled}
            loading={createJobOpeningMutation.isLoading}
          >
            Create
          </LoadingButton>
        </Container>
      </form>
    </Container>
  );
}
