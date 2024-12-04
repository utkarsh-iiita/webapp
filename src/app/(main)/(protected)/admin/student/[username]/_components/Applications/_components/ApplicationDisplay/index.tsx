import Link from "next/link";
import dayjs from "dayjs";

import {
  Avatar,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";

import ApplicationStatusChip from "~/app/common/components/ApplicationStatusChip";
import { type api as API } from "~/trpc/server";

type studentAPIRes = ReturnType<
  typeof API.student.getStudentDetails.query
> extends Promise<infer T>
  ? T
  : never;

interface IApplicationDisplay {
  data: studentAPIRes["applications"][number];
}

export default function ApplicationDisplay(props: IApplicationDisplay) {
  return (
    <>
      <Paper className="p-2 flex flex-col gap-4">
        <div className="flex flex-row gap-4">
          <Avatar
            src={props.data.jobOpening.company.logo}
            variant="square"
            className="rounded-md h-14 w-14"
          />
          <div className="flex flex-col flex-1 gap-1">
            <div className="flex flex-row items-center gap-2 flex-wrap">
              <Link href={"/admin/job-openings/" + props.data.jobOpening.id}>
                <Typography
                  variant="h6"
                  className="m-0 text-sm md:text-lg underline"
                >
                  {props.data.jobOpening.title}
                </Typography>
              </Link>
              <ApplicationStatusChip status={props.data.latestStatus.status} />
            </div>
            <div className="flex flex-row items-center gap-2 flex-wrap">
              <Typography variant="subtitle2" color="primary" className="m-0">
                {props.data.jobOpening.company.name}{" "}
              </Typography>
              <div className="flex flex-row gap-1">
                <Typography variant="subtitle2" color="gray">
                  JobType:
                </Typography>
                <Typography variant="subtitle2">
                  {props.data.jobOpening.placementType.name}
                </Typography>
              </div>
              <div className="flex flex-row gap-1">
                <Typography variant="subtitle2" color="gray">
                  Placement Year:
                </Typography>
                <Typography variant="subtitle2">
                  {props.data.jobOpening.year}
                </Typography>
              </div>
              <Typography variant="subtitle2" color="gray">
                Applied:{" "}
                {dayjs(props.data.createdAt).format("DD MMM, YYYY hh:mm A")}
              </Typography>
            </div>
          </div>
        </div>
        <Stepper orientation="vertical" className="lg:hidden mx-auto">
          {props.data.statuses.map((step, index) => (
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
        <Stepper className="hidden lg:flex mb-2">
          {props.data.statuses.map((step, index) => (
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
      </Paper>
    </>
  );
}
