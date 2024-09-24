interface ParticipatingGroupConfig {
  admissionYear?: number;
  program?: string;
  minCgpa?: number;
}

interface PostGroupsSelectorProps {
  value: ParticipatingGroupConfig[];
  onChange: (value: ParticipatingGroupConfig[]) => void;
  disabled?: boolean;
}

type PostGroupCardProps = {
  index: number;
  group: ParticipatingGroupConfig;
  onDelete: () => void;
  onChange: (newGroup: ParticipatingGroupConfig) => void;
  allGroups: {
    [key: number]: string[];
  };
  disabled?: boolean;
};
