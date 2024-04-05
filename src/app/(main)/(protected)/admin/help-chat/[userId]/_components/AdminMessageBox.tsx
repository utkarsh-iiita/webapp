import dayjs from "dayjs";

import { Paper, Typography } from "@mui/material";

dayjs.extend(require("dayjs/plugin/isToday"));
dayjs.extend(require("dayjs/plugin/isYesterday"));

export default function AdminMessageBox(props: {
  message: string;
  author: string;
  time: Date;
}) {
  return (
    <Paper
      elevation={6}
      className="flex flex-col max-w-[calc(min(75%,400px))] self-end p-2 pb-0 relative mt-5"
    >
      <Typography variant="caption" className="absolute -top-5 right-1">
        {props.author}
      </Typography>
      <Typography variant="body1">{props.message}</Typography>
      <Typography
        variant="caption"
        className="self-end p-0 m-0 select-none"
        color="text.disabled"
      >
        {dayjs(props.time).format("hh:mm A")}
      </Typography>
    </Paper>
  );
}
