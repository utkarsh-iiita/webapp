import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function GroupCard(props: PostGroupCardProps) {
  return (
    <Paper elevation={4} className="group flex flex-col p-4 gap-3">
      <Typography variant="subtitle2" className="relative">
        <em>Group # {props.index + 1}</em>
        {!props.disabled && (
          <IconButton
            onClick={props.onDelete}
            className="absolute top-0 right-0 mt-[-4px]"
            color="error"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        )}
      </Typography>
      <FormControl size="small" required disabled={props.disabled}>
        <InputLabel>Admission Year</InputLabel>
        <Select
          value={props.group.admissionYear || ""}
          label="Admission Year"
          onChange={(event) => {
            props.onChange({
              ...props.group,
              admissionYear: parseInt(event.target.value.toString()),
            });
          }}
        >
          {Object.keys(props.allGroups).map((year) => (
            <MenuItem value={Number(year)} key={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl
        size="small"
        required
        disabled={props.disabled || !props.group.admissionYear}
      >
        <InputLabel>Program</InputLabel>
        <Select
          value={props.group.program || ""}
          label="Program"
          onChange={(event) => {
            props.onChange({
              ...props.group,
              program: event.target.value,
            });
          }}
        >
          {props.allGroups[props.group.admissionYear]?.map((program) => (
            <MenuItem value={program} key={program}>
              {program}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Min. CGPA"
        value={props.group.minCgpa}
        type="number"
        size="small"
        onChange={(e) =>
          props.onChange({
            ...props.group,
            minCgpa: Number(e.target.value),
          })
        }
      />
    </Paper>
  );
}
