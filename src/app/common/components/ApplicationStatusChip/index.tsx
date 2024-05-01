import CheckIcon from "@mui/icons-material/Check";
import { Chip } from "@mui/material";
interface ApplicationStatusChipProps {
  status: "REGISTERED" | "APPROVED" | "REJECTED" | "SHORTLISTED" | "SELECTED";
}

const statusColors = {
  REGISTERED: "primary",
  APPROVED: "secondary",
  REJECTED: "error",
  SHORTLISTED: "success",
  SELECTED: "success",
} as const;

export default function ApplicationStatusChip(
  props: ApplicationStatusChipProps,
) {
  return (
    <Chip
      label={props.status}
      color={statusColors[props.status]}
      size="small"
      className="text-[10px] md:text-[12px]"
      icon={props.status === "SELECTED" ? <CheckIcon /> : undefined}
      variant={props.status === "SELECTED" ? "filled" : "outlined"}
    />
  );
}
