import { useEffect } from "react";

export default function useValueUx(
  jobOpening: JobOpening | null,
  company: Company | null,
  setCompany: (company: Company | null) => void,
) {
  useEffect(() => {
    if (jobOpening?.company) {
      setCompany(jobOpening.company);
    }
  }, [jobOpening]);
}
