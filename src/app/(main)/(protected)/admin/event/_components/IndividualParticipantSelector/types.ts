export type UserMicro = {
  id: string;
  name: string;
  username: string;
};

export interface IndividualParticipantSelectorProps {
  individualParticipants: UserMicro[];
  setIndividualParticipants: (value: UserMicro[]) => void;
  disabled?: boolean;
}
