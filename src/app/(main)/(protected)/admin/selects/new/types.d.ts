interface NewSelectedStudent {
  userId: string;
  selectedAt: Date | null;
  jobType: string;
  role: string;
  payNumeric: number;
  basePay: number;
  stipend: number;
  company: {
    name: string;
    domain: string;
    logo: string;
  } | null;
  isOnCampus: boolean;
}


type Company = {
  name: string;
  website: string;
  logo: string;
};

type SelectedStudent = {
  userId: string;
  jobType: string;
  selectedAt: Date | null;
  role: string;
  payNumeric: number;
  basePay: number;
  stipend: number;
  company: Company;
  isOnCampus: boolean;


};
