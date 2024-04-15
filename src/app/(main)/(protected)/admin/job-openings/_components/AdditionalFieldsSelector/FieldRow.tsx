import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { SUPPORTED_FIELD_TYPES } from "~/app/_utils/jobApplication/extraApplicationFields";

export default function FieldRow(props: FieldRowProps) {
  return (
    <Paper elevation={4} className="flex flex-col p-2 gap-2">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="body2" className="ml-1 italic">
          Field #{props.index + 1}
        </Typography>

        <IconButton color="error" size="small" onClick={props.onDelete}>
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </div>
      <TextField
        label="Question"
        size="small"
        required
        value={props.value.title}
        onChange={(e) => {
          props.onChange({
            ...props.value,
            title: e.target.value,
          });
        }}
      />
      <FormControl size="small" required>
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          value={props.value.format}
          onChange={(event) => {
            props.onChange({
              ...props.value,
              format: event.target.value,
            });
          }}
        >
          {SUPPORTED_FIELD_TYPES.map((field) => (
            <MenuItem value={field} key={field}>
              {field}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Description"
        size="small"
        multiline
        maxRows={3}
        value={props.value.description}
        onChange={(e) => {
          props.onChange({
            ...props.value,
            description: e.target.value,
          });
        }}
      />
      <div className="flex flex-row justify-end">
        <FormControlLabel
          label="Required"
          control={
            <Checkbox
              size="small"
              checked={props.value.required}
              onChange={(e) => {
                props.onChange({
                  ...props.value,
                  required: e.target.checked,
                });
              }}
            />
          }
        />
      </div>
    </Paper>
  );
}
