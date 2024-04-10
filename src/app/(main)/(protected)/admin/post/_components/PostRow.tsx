import Link from "next/link";

import { Paper, Typography } from "@mui/material";

import dayjs from "~/app/_utils/extendedDayjs";

export default function PostRow(props: {
    createdAt: Date;
    title: string;
    id: string;


}) {
    return (
        <Link href={"./post/" + props.id}>
            <Paper className="flex flex-col gap-2 py-2 px-4">
                <div className="flex flex-row justify-between">
                    <Typography variant="body1">
                        <strong>{props.title}</strong>

                    </Typography>
                    <Typography variant="caption" className="whitespace-nowrap">
                        {dayjs(props.createdAt).fromNow()}
                    </Typography>
                </div>

            </Paper>
        </Link>
    );
}
