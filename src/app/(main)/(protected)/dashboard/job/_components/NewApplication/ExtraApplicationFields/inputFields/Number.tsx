import {
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

export default function NumberFormField(props: FieldProps) {
  return (
    <FormControl>
      <Typography className="mb-1 ml-1" variant="body1">
        {props.title}
        {props.required && "*"}
      </Typography>
      <FormHelperText className="m-1">{props.description}</FormHelperText>
      <TextField
        type="number"
        placeholder="Type the number here..."
        value={props.value || ""}
        onChange={(e) => props.setValue(e.target.value)}
      />
    </FormControl>
  );
}
