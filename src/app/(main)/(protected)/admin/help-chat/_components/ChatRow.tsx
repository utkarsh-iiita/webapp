import Link from "next/link";

import { Paper, Typography } from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";

export default function ChatRow(props: {
  createdAt: Date;
  message: string;
  participant: {
    id: string;
    name: string;
    username: string;
  };
}) {
  return (
    <Link href={"./help-chat/" + props.participant.id}>
      <Paper className="flex flex-col gap-2 py-2 px-4">
        <div className="flex flex-row justify-between">
          <Typography variant="body1">
            <strong>{props.participant.name}</strong> (
            {props.participant.username.toUpperCase()})
          </Typography>
          <Typography variant="caption" className="whitespace-nowrap">
            {dayjs(props.createdAt).fromNow()}
          </Typography>
        </div>
        <Typography
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            textOverflow: "ellipsis",
          }}
          variant="body2"
        >
          {props.message}
        </Typography>
      </Paper>
    </Link>
  );
}
