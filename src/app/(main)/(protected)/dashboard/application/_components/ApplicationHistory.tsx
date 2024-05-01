import dayjs from "dayjs";

import {
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import ApplicationStatusChip from "~/app/common/components/ApplicationStatusChip";

interface ApplicationStatus {
  status: "SHORTLISTED" | "REJECTED" | "SELECTED" | "REGISTERED" | "APPROVED";
  createdAt: Date;
}

interface ApplicationHistoryProps {
  history: ApplicationStatus[];
}

export default function ApplicationHistory(props: ApplicationHistoryProps) {
  return (
    <>
      <Stepper orientation="vertical">
        {props.history.map((step, index) => (
          <Step key={index} active>
            <StepLabel>
              <ApplicationStatusChip status={step.status} />
            </StepLabel>
            <StepContent>
              <Typography variant="subtitle2" color={"GrayText"}>
                {dayjs(step.createdAt).format("DD MMM YYYY,  h:m A")}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </>
  );
}
