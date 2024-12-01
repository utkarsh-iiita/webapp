interface NewJobOpening {
  title: string;
  description: string;
  location: string;
  role: string;
  pay: string;
  payNumeric: number;
  empBenefits: string;
  company: {
    name: string;
    domain: string;
    logo: string;
  } | null;
  jobType: string | null;
  registrationStart: Dayjs | null;
  registrationEnd: Dayjs | null;
  extraApplicationFields: extraApplicationField[] | null;
  hidden: boolean;
  autoApprove: boolean;
  autoVisible: boolean;
  participatingGroups: {
    admissionYear?: number;
    program?: string;
    minCgpa?: number;
    minCredits?: number;
  }[];
}

type extraApplicationField = {
  title: string;
  description: string;
  format: string;
  required: boolean;
};

type Company = {
  name: string;
  website: string;
  logo: string;
};

type JobOpening = {
  placementType: {
    name: string;
  };
  company: Company;
  title: string;
  id: string;
  location: string;
  role: string;
  pay: string;
  registrationStart: Date;
  registrationEnd: Date;
};
