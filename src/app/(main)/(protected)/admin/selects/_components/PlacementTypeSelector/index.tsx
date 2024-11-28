import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";

import { api } from "~/trpc/react";

interface IPlacementType {
  selectedPlacementTypes: string[] | null;
  setSelectedPlacementTypes: (selectedPlacementTypes: string[] | null) => void;
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
      <InputLabel id="demo-multiple-name-label">Job Types</InputLabel>
      <Select
        labelId="demo-multiple-name-label"
        id="demo-multiple-name"
        multiple
        value={
          props.selectedPlacementTypes ?? placementTypes.map((item) => item.id)
        }
        onChange={(e) => {
          if (e.target.value.length) {
            props.setSelectedPlacementTypes(e.target.value as string[]);
          }
        }}
        input={<OutlinedInput label="Job Types" />}
        renderValue={(selected) =>
          selected.length === placementTypes.length
            ? "All"
            : selected.length === 1
              ? placementTypes.find((item) => item.id === selected[0])?.name
              : placementTypes
                  .filter((item) => selected.includes(item.id))
                  .map((item) => item.name)
                  .join(", ")
        }
        MenuProps={MenuProps}
      >
        {placementTypes.map((jobType) => (
          <MenuItem key={jobType.id} value={jobType.id}>
            {jobType.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
