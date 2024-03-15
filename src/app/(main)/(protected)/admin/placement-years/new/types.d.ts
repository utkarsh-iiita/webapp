type PlacementConfig = {
  name?: string;
  id?: string;
  batches?: {
    program?: string;
    admissionYear?: number;
  }[];
};

type JobTypeConfigurationProps = {
  placementTypes: { id: string; name: string }[];
  yearWisePrograms: {
    [key: number]: string[];
  };
  placementConfig: PlacementConfig;
  setPlacementConfig: (newConfig: PlacementConfig) => void;
  onDelete: () => void;
};

type GroupCardProps = {
  index: number;
  group: PlacementConfig["batches"][number];
  onDelete: () => void;
  onChange: (newGroup: PlacementConfig["batches"][number]) => void;
  allGroups: {
    [key: number]: string[];
  };
};
