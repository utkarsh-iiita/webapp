import { Avatar, Paper, Typography } from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";
import ApplicationStatusChip from "~/app/common/components/ApplicationStatusChip";
import { type api as API } from "~/trpc/server";

type Applications = ReturnType<
  typeof API.jobApplication.getStudentApplications.query
> extends Promise<infer T>
  ? T
  : never;

interface ApplicationsRowProps {
  application: Applications[number];
}

export default function ApplicationsRow(props: ApplicationsRowProps) {
  return (
    <Paper className="p-2 flex flex-row gap-4">
      <Avatar
        src={props.application.jobOpening.company.logo}
        variant="square"
        className="rounded-md h-14 w-14"
      />
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <Typography variant="h6" className="m-0 text-sm md:text-lg">
            {props.application.jobOpening.title}
          </Typography>
          <ApplicationStatusChip
            status={props.application.latestStatus.status}
          />
        </div>
        <div className="flex flex-row items-center gap-2 flex-wrap">
          <Typography variant="subtitle2" color="primary" className="m-0">
            {props.application.jobOpening.company.name}{" "}
          </Typography>
          <div className="self-end ml-auto">
            <Typography variant="subtitle2" color="gray">
              Applied {dayjs(props.application.createdAt).fromNow()}
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  );
}
