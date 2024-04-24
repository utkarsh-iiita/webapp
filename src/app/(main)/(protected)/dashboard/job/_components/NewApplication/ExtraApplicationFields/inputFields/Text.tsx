import {
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

export default function TextFormField(props: FieldProps) {
  return (
    <FormControl>
      <Typography className="mb-1 ml-1" variant="body1">
        {props.title}
        {props.required && "*"}
      </Typography>
      <FormHelperText className="m-1">{props.description}</FormHelperText>
      <TextField
        placeholder="Type here..."
        value={props.value || ""}
        onChange={(e) => props.setValue(e.target.value)}
        inputProps={{ maxLength: 180 }}
      />
      <FormHelperText className="text-right">
        {props.value?.toString()?.length ?? 0}/180
      </FormHelperText>
    </FormControl>
  );
}
