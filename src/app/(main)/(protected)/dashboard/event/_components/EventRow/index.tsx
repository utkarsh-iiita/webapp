import Link from "next/link";
import dayjs from "dayjs";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Avatar, Paper, Typography } from "@mui/material";
import { EventTooltipProps } from "../EventTooltip/types";


export default function EventRow(props: EventTooltipProps) {
  return (

    <Paper elevation={4} className="p-2">
      <div className="flex flex-col gap-1">
        <div className="flex flex-row gap-2">
          {props.event.company.logo && (
            <Avatar
              sx={{
                borderRadius: 1,
                height: 48,
                width: 48,
              }}
              variant="square"
              src={props.event.company.logo}
            />
          )}
          <div className="flex flex-col justify-between">
            <Typography variant="body1">{props.event.title}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {props.event.company ? `${props.event.company.name} ·` : ""}{" "}
              {props.event.type}
            </Typography>
          </div>
        </div>
        <div className="flex flex-row gap-4 flex-wrap justify-between px-2">
          <div className="flex flex-row gap-2 items-center">
            <Typography variant="subtitle2" color="textSecondary">
              Visibility:
            </Typography>
            <Typography
              variant="body2"
              className="flex flex-row items-center gap-2"
            >
              {props.event.hidden ? (
                <>
                  <VisibilityOffIcon fontSize="small" />
                  Hidden
                </>
              ) : (
                <>
                  <VisibilityIcon fontSize="small" /> Visible
                </>
              )}
            </Typography>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Typography variant="subtitle2" color="textSecondary">
              Start Time:
            </Typography>
            <Typography variant="body2">
              {dayjs(props.event.startTime).format("ddd D-M-YYYY, hh:mm A")}
            </Typography>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Typography variant="subtitle2" color="textSecondary">
              End Time:
            </Typography>
            <Typography variant="body2">
              {dayjs(props.event.endTime).format("ddd D-M-YYYY, hh:mm A")}
            </Typography>
          </div>
          {props.event.jobOpening ? <div className="flex flex-row gap-2 items-center">
            <Typography variant="subtitle2" color="textSecondary">
              Opening:
            </Typography>
            <Typography variant="body2">
              {props.event.jobOpening.title}
            </Typography>
          </div> : <></>}
        </div>
      </div>
    </Paper>

  );
}
