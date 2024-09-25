export type ParticipatingGroup = {
  placementType: {
    name: string;
    id: string;
  };
} & {
  id: string;
  year: number;
  placementTypeId: string;
  admissionYear: number;
  program: string;
};

export interface ParticipatingGroupSelectorProps {
  participatingGroups: string[];
  setParticipatingGroups: (groups: string[]) => void;
  disabled?: boolean;
}
