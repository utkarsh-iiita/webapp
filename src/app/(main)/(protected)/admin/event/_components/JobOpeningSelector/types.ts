export interface JobOpeningSelectorProps {
  jobOpeningId: string | null;
  jobOpeningDetails: JobOpening | null;
  setJobOpeningId: (jobOpeningId: string | null) => void;
  setJobOpeningDetails: (jobOpeningDetails: JobOpening | null) => void;
  disabled?: boolean;
}
