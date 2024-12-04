import { Divider, Typography } from "@mui/material";

import { type api as API } from "~/trpc/server";

type studentAPIRes = ReturnType<
  typeof API.student.getStudentDetails.query
> extends Promise<infer T>
  ? T
  : never;

interface ISelectionsDataDisplay {
  data: studentAPIRes["selections"];
}

export default function SelectionsDataDisplay(props: ISelectionsDataDisplay) {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="h5" color="primary" className="px-2">
        Selections
      </Typography>
      <Divider />
    </div>
  );
}
