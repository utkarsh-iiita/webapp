import { Typography } from "@mui/material";

export default function DataDisplay(props: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-row gap-1">
      <Typography variant="body1" color="textSecondary">
        {props.label}:
      </Typography>
      <Typography variant="body1">{props.value}</Typography>
    </div>
  );
}
