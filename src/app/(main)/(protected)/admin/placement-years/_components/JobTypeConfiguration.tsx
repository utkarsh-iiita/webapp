import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";

import GroupCard from "./GroupCard";

export default function JobTypeConfiguration(props: JobTypeConfigurationProps) {
  return (
    <Paper elevation={2} className="p-4 flex flex-col gap-4 relative">
      {!props.disabled && (
        <IconButton
          onClick={props.onDelete}
          className="absolute top-1 right-1"
          color="error"
          size="small"
        >
          <CloseIcon />
        </IconButton>
      )}
      <div className="flex flex-row flex-wrap gap-3 items-center">
        <Typography variant="body2">Select Placement Type:</Typography>
        <FormControl
          className="w-full max-w-60"
          size="small"
          required
          disabled={props.disabled}
        >
          <InputLabel>Placement Type</InputLabel>
          <Select
            value={props.placementConfig.id || ""}
            label="Placement Type"
            placeholder="Placement Type"
            onChange={(e) => {
              props.setPlacementConfig({
                ...props.placementConfig,
                id: e.target.value as string,
                name: props.placementTypes.find(
                  (el) => el.id === e.target.value,
                )?.name,
              });
            }}
          >
            {props.placementTypes.map((el) => (
              <MenuItem value={el.id} key={el.id}>
                {el.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {props.placementConfig.id && (
        <>
          <Typography variant="body2">Add Applicable Batches:</Typography>
          <div className="grid gap-2 grid-cols-1 md:auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
            {props.placementConfig.batches?.map((batch, index) => (
              <GroupCard
                key={index}
                index={index}
                group={batch}
                disabled={props.disabled}
                allGroups={Object.fromEntries(
                  Object.keys(props.yearWisePrograms)
                    .filter((key) => {
                      return (
                        props.placementConfig.batches?.filter((el, elIdx) => {
                          elIdx !== index && el.admissionYear === Number(key);
                        }).length !== props.yearWisePrograms[Number(key)].length
                      );
                    })
                    .map((key) => [
                      key,
                      props.yearWisePrograms[Number(key)].filter((batch) => {
                        return !props.placementConfig.batches?.some(
                          (el, elIdx) =>
                            elIdx !== index &&
                            el.program === batch &&
                            el.admissionYear === Number(key),
                        );
                      }),
                    ]),
                )}
                onDelete={() => {
                  props.setPlacementConfig({
                    ...props.placementConfig,
                    batches: props.placementConfig.batches?.filter(
                      (_, i) => i !== index,
                    ),
                  });
                }}
                onChange={(newGroup) => {
                  const newBatches = [...(props.placementConfig.batches || [])];
                  newBatches[index] = newGroup;
                  props.setPlacementConfig({
                    ...props.placementConfig,
                    batches: newBatches,
                  });
                }}
              />
            )) || []}
            {!props.disabled &&
              props.placementConfig.batches?.length !==
                Object.keys(props.yearWisePrograms).reduce(
                  (totalLength, currVal) => {
                    return (
                      totalLength +
                      props.yearWisePrograms[Number(currVal)].length
                    );
                  },
                  0,
                ) && (
                <Button
                  variant="outlined"
                  className="border-dashed"
                  disabled={
                    props.placementConfig.batches?.length > 0 &&
                    (!props.placementConfig.batches.at(-1).admissionYear ||
                      !props.placementConfig.batches.at(-1).program)
                  }
                  onClick={(_) => {
                    props.setPlacementConfig({
                      ...props.placementConfig,
                      batches: [
                        ...(props.placementConfig.batches || []),
                        {
                          program: "",
                          admissionYear: 0,
                        },
                      ],
                    });
                  }}
                >
                  <AddIcon fontSize="large" />
                </Button>
              )}
          </div>
        </>
      )}
    </Paper>
  );
}
