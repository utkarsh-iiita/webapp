interface ParticipatingGroupConfig {
  admissionYear?: number;
  program?: string;
  minCgpa?: number;
  minCredits?: number;
}

interface JobOpeningGroupsSelectorProps {
  jobTypeId: string;
  value: ParticipatingGroupConfig[];
  onChange: (value: ParticipatingGroupConfig[]) => void;
}

type JobOpeningGroupCardProps = {
  index: number;
  group: ParticipatingGroupConfig;
  onDelete: () => void;
  onChange: (newGroup: ParticipatingGroupConfig) => void;
  allGroups: {
    [key: number]: string[];
  };
  disabled?: boolean;
};
