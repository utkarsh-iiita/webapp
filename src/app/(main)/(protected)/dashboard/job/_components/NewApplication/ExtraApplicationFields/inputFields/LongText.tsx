import {
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";

export default function LongTextFormField(props: FieldProps) {
  return (
    <FormControl>
      <Typography className="mb-1 ml-1" variant="body1">
        {props.title}
        {props.required && "*"}
      </Typography>
      <FormHelperText className="">{props.description}</FormHelperText>
      <TextField
        placeholder="Type here..."
        value={props.value || ""}
        multiline
        minRows={5}
        maxRows={5}
        onChange={(e) => props.setValue(e.target.value)}
        inputProps={{ maxLength: 2000 }}
      />
      <FormHelperText className="text-right">
        {props.value?.toString()?.length ?? 0}/2000
      </FormHelperText>
    </FormControl>
  );
}
