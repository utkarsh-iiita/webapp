import { Divider, Typography } from "@mui/material";

import { type api as API } from "~/trpc/server";
import SelectionRow from "./SelectRow";

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
        Selections ({props.data.length})
      </Typography>
      <Divider />
      {props.data.length > 0 ? (
        props.data.map((selection) => (
          <SelectionRow data={selection} key={selection.id} />
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
