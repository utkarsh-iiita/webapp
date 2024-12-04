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

import { api } from "~/trpc/react";



import { DEFAULT_SELECTED_STUDENTS } from "./constants";
import SearchUserInput from "~/app/common/components/SearchUserClient";

export default function NewSelectedStudent() {
  const [companyQuery, setCompanyQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(DEFAULT_SELECTED_STUDENTS);
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

  const createSelectedStudentMutation = api.selections.createSelectedStudent.useMutation(
    {
      onSuccess: () => {
        router.replace("/admin/selects");
        router.refresh();
      },
    },
  );

  const isCreationDisabled = useMemo(() => {
    console.log(selectedStudent)
    if (
      !selectedStudent.userId ||
      !selectedStudent.company ||
      !selectedStudent.jobType ||
      !selectedStudent.role ||
      !selectedStudent.basePay ||
      !selectedStudent.payNumeric ||
      !selectedStudent.selectedAt
    )
      return true;

    return false;
  }, [selectedStudent]);

  return (
    <Container className="flex flex-col gap-4 py-4">
      <Typography variant="h5" color="primary" className="px-4">
        Add selected Student
      </Typography>
      <Divider />
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const reqData: any = selectedStudent;
          reqData.selectedAt = new Date(
            reqData.selectedAt.toISOString(),
          )
          createSelectedStudentMutation.mutate(reqData);
        }}
      >
        <FormControl variant="standard">
          <SearchUserInput
            label="Search Student"
            value={selectedStudent.userId}
            setValue={(newValue: string) => setSelectedStudent({
              ...selectedStudent,
              userId: newValue
            })}
            multiple={false}
            required
          />
        </FormControl>
        <Autocomplete
          value={selectedStudent.company}
          onChange={(_, newValue) =>
            setSelectedStudent({ ...selectedStudent, company: newValue })
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
              {selectedStudent.company?.logo && (
                <Avatar
                  sx={{
                    borderRadius: 1,
                    height: 54,
                    width: 54,
                  }}
                  variant="square"
                  src={selectedStudent.company.logo}
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
            value={selectedStudent.jobType}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, jobType: e.target.value })
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
          label="Role"
          name="role"
          value={selectedStudent.role}
          onChange={(e) =>
            setSelectedStudent({ ...selectedStudent, role: e.target.value })
          }
          inputProps={{ maxLength: 180 }}
          required
        />
        <FormControl variant="standard">
          <TextField
            label="Pay(Numeric)"
            type="number"
            name="payNumeric"
            value={selectedStudent.payNumeric}
            onChange={(e) =>
              setSelectedStudent({ ...selectedStudent, payNumeric: Number(e.target.value) })
            }
            inputProps={{ maxLength: 180 }}
            required
          />

        </FormControl>
        <FormControl variant="standard">
          <TextField
            label="Base pay"
            name="basePay"
            type="number"
            value={selectedStudent.basePay}
            onChange={(e) =>
              setSelectedStudent({
                ...selectedStudent,
                basePay: Number(e.target.value),
              })
            }
            inputProps={{ maxLength: 180, min: 0 }}
            required
          />

        </FormControl>
        <FormControl variant="standard">
          <TextField
            label="Stipend"
            name="stipend"
            type="number"
            value={selectedStudent.stipend}
            onChange={(e) =>
              setSelectedStudent({
                ...selectedStudent,
                stipend: Number(e.target.value),
              })
            }
            inputProps={{ maxLength: 180, min: 0 }}
            required
          />

        </FormControl>

        <DateTimePicker
          name="selectedAt"
          value={selectedStudent.selectedAt}
          onChange={(date) =>
            setSelectedStudent({ ...selectedStudent, selectedAt: date })
          }
          label="Selected At"
        />
        <div className="flex flex-row gap-4 justify-end flex-wrap">
          <FormControlLabel
            label="Is selection on campus"
            control={
              <Checkbox
                size="small"
                checked={selectedStudent.isOnCampus}
                onChange={(e) => {
                  setSelectedStudent({
                    ...selectedStudent,
                    isOnCampus: e.target.checked,
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
            loading={createSelectedStudentMutation.isLoading}
          >
            Create
          </LoadingButton>
        </Container>
      </form>
    </Container >
  );
}
