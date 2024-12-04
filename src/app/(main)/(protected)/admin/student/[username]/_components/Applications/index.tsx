import { Divider, Typography } from "@mui/material";

import { type api as API } from "~/trpc/server";

import ApplicationDisplay from "./_components/ApplicationDisplay";

type studentAPIRes = ReturnType<
  typeof API.student.getStudentDetails.query
> extends Promise<infer T>
  ? T
  : never;

interface IApplicationsSection {
  data: studentAPIRes["applications"];
}

export default function ApplicationsSection(props: IApplicationsSection) {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h5" color="primary" className="px-2">
        Applications ({props.data.length})
      </Typography>
      <Divider />
      {props.data.length > 0 ? (
        props.data.map((application) => (
          <ApplicationDisplay data={application} key={application.id} />
        ))
      ) : (
        <div className="flex flex-col justify-center items-center py-20">
          <Typography variant="h6" color="textSecondary">
            Nothing here
          </Typography>
        </div>
      )}
    </div>
  );
}
