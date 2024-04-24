"use client";

import { useMemo, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { api } from "~/trpc/react";

import ExtraApplicationFields from "./ExtraApplicationFields";

export default function ApplicationForm(props: ApplicationFormProps) {
  const utils = api.useUtils();

  const [hasApproved, setHasApproved] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [extraData, setExtraData] = useState<ExtraApplicationData>({});
  const [isExtraDataRemaining, setIsExtraDataRemaining] =
    useState<boolean>(false);

  const [
    { data: jobOpening, isLoading: isJobOpeningLoading },
    { data: resumes, isLoading: isResumesLoading },
  ] = api.useQueries((t) => [
    t.jobApplication.getRegistrationDetails(props.jobOpeningId, {
      enabled: props.open,
    }),
    t.studentResume.getStudentResumes(null, { enabled: props.open }),
  ]);

  const handleClose = () => props.setOpen(false);

  const createApplicationMutation =
    api.jobApplication.createApplication.useMutation({
      onSuccess: () => {
        handleClose();
        utils.jobApplication.invalidate();
        utils.jobOpenings.invalidate();
      },
    });

  const isLoading = useMemo(
    () => isJobOpeningLoading || isResumesLoading,
    [isResumesLoading, isJobOpeningLoading],
  );

  return (
    <>
      <Dialog
        open={props.open}
        onClose={handleClose}
        maxWidth="sm"
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (
              isExtraDataRemaining ||
              !hasApproved ||
              (!jobOpening.noResumes && !selectedResume)
            )
              return;

            createApplicationMutation.mutate({
              jobId: jobOpening.id,
              resumeId: selectedResume,
              additionalInfo: extraData,
            });
          },
        }}
      >
        {isLoading ? (
          <DialogContent className="flex items-center justify-center py-6 w-full">
            <CircularProgress />
          </DialogContent>
        ) : (
          <>
            <DialogTitle>Apply for {jobOpening.title}</DialogTitle>
            <DialogContent className="flex flex-col gap-4">
              <DialogContentText>
                Please fill the following fields to apply for the job opening.
              </DialogContentText>
              <ExtraApplicationFields
                extraApplicationFields={jobOpening.extraApplicationFields}
                extraData={extraData}
                setExtraData={setExtraData}
                setIsExtraDataRemaining={setIsExtraDataRemaining}
              />
              {!jobOpening.noResumes && (
                <FormControl>
                  <InputLabel>Select your Resume *</InputLabel>
                  <Select
                    label="Select your Resume"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                    required
                  >
                    {resumes.map((resume, index) => (
                      <MenuItem key={index} value={resume.id}>
                        {resume.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <FormControlLabel
                className="mt-4"
                label={`By selecting this checkbox I have allowed to share all my academic and personal data available on this platform to the company named: ${jobOpening.company.name} for hiring purposes.`}
                control={
                  <Checkbox
                    size="small"
                    required
                    checked={hasApproved}
                    onChange={(e) => {
                      setHasApproved(e.target.checked);
                    }}
                  />
                }
              />
            </DialogContent>
            <DialogActions className="p-4">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                disabled={
                  isExtraDataRemaining ||
                  !hasApproved ||
                  (!jobOpening.noResumes && !selectedResume)
                }
                loading={createApplicationMutation.isLoading}
              >
                Apply
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
