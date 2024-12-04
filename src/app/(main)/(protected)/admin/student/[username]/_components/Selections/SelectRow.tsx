"use client";

import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import { Avatar, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";

import { type api as API } from "~/trpc/server";

type studentAPIRes = ReturnType<
    typeof API.student.getStudentDetails.query
> extends Promise<infer T>
    ? T
    : never;

interface ISelectionRow {
    data: studentAPIRes["selections"][number];
}
export default function SelectionRow(props: ISelectionRow) {
    return (
        <Paper className="flex flex-col gap-2 py-3 px-3">
            <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col justify-between">
                        <Typography variant="h6" color="primary">
                            <strong>{props.data.placementType.name} - {props.data.role}</strong>
                        </Typography>
                        <Typography variant="body2">{props.data.company.name}</Typography>
                    </div>

                    <Avatar
                        alt="Remy Sharp"
                        src={props.data.company.logo}
                        variant="square"
                        style={{
                            borderRadius: "8px",
                        }}
                    />
                </div>

                <div className="flex flex-row flex-wrap gap-2 justify-between mt-3">
                    <div className="flex flex-row items-end justify-between gap-2">
                        <Typography variant="subtitle2" color="gray">Author:</Typography>
                        <Typography variant="subtitle2">{props.data.author.name} ({props.data.author.username.toUpperCase()})</Typography>
                    </div>
                    <div className="flex flex-row items-end justify-between gap-2">
                        <Typography variant="subtitle2" color="gray">Placement Year:</Typography>
                        <Typography variant="subtitle2">{props.data.year}</Typography>
                    </div>
                    <div className="flex flex-row justify-between items-end gap-2">
                        <Typography variant="subtitle2" color="gray">Selected On:</Typography>
                        <Typography variant="subtitle2">{dayjs(props.data.selectedAt).format("DD MMM YYYY,  h:m A")}</Typography>
                    </div>
                </div>
            </div>
        </Paper>
    );
}
