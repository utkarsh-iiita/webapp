export type CompanyDropdownProps = {
  company: Company | null;
  setCompany: (company: Company | null) => void;
  required?: boolean;
  disabled?: boolean;
};
