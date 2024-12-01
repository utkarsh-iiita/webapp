import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

import { api } from "~/trpc/react";

interface IPlacementType {
  selectedPlacementTypes: string | null;
  setSelectedPlacementTypes: (selectedPlacementTypes: string | null) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function PlacementTypeSelector(props: IPlacementType) {
  const { data: placementTypes, isLoading } =
    api.jobType.getPlacementTypes.useQuery();

  if (isLoading) {
    return null;
  }

  return (
    <FormControl sx={{ width: 180 }} size="small">
      <InputLabel id="job-type-selector-label">Job Types</InputLabel>
      <Select
        labelId="job-type-selector-label"
        id="job-type-selector"
        value={props.selectedPlacementTypes ?? "all"}
        onChange={(e) => {
          if (e.target.value.length) {
            let value: string | null = e.target.value;
            if (value === "all") {
              value = null;
            }
            props.setSelectedPlacementTypes(value);
          }
        }}
        input={<OutlinedInput label="Job Types" />}
        renderValue={(selected) => {
          if (selected === "all") {
            return "All";
          }
          const selectedJobType = placementTypes.find(
            (jobType) => jobType.id === selected,
          );
          return selectedJobType?.name;
        }}
        MenuProps={MenuProps}
      >
        <MenuItem key="all" value="all">
          All
        </MenuItem>
        {placementTypes.map((jobType) => (
          <MenuItem key={jobType.id} value={jobType.id}>
            {jobType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
