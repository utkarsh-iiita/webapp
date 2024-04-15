import { Button, Paper, Typography } from "@mui/material";

import FieldRow from "./FieldRow";

export default function AdditionalFieldSelector(
  props: AdditionalFieldSelectorProps,
) {
  return (
    <Paper className="flex flex-col gap-4 pt-2 px-3 pb-3">
      <Typography>Extra Application Fields:</Typography>
      <div className="flex flex-col gap-4">
        {props.value?.map((field, index) => (
          <FieldRow
            key={index}
            index={index}
            value={field}
            onChange={(newField: extraApplicationField) => {
              const newFields = [...props.value];
              newFields[index] = newField;
              props.onChange(newFields);
            }}
            onDelete={() => {
              const newFields = [...props.value];
              newFields.splice(index, 1);
              props.onChange(newFields);
            }}
          />
        ))}
        <Button
          type="button"
          onClick={() => {
            props.onChange([
              ...props.value,
              {
                title: "",
                description: "",
                format: "",
                required: false,
              },
            ]);
          }}
          variant="outlined"
        >
          Add Field
        </Button>
      </div>
    </Paper>
  );
}
