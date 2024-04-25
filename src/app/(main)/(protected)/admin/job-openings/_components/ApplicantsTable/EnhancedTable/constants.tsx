import Link from "next/link";

export const BASE_COLUMNS = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
    disableSort: false,
  },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Enrollment No.",
    format: (value: string) => value.toUpperCase(),
    disableSort: false,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    disableSort: false,
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    label: "Applied At",
    format: (value: string) => new Date(value).toLocaleString(),
    disableSort: false,
  },
  {
    id: "resume",
    numeric: false,
    disablePadding: false,
    label: "Resume",
    format: (value: string) => (
      <Link
        href={value}
        target="_blank"
        passHref
        className="underline"
        onClick={(e) => e.stopPropagation()}
      >
        View Resume
      </Link>
    ),
    disableSort: true,
  },
  {
    id: "admissionYear",
    numeric: false,
    disablePadding: false,
    label: "Admission Year",
    disableSort: false,
  },
  {
    id: "program",
    numeric: false,
    disablePadding: false,
    label: "Program",
    disableSort: false,
  },
  {
    id: "gender",
    numeric: false,
    disablePadding: false,
    label: "Gender",
    disableSort: false,
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    disableSort: false,
  },
  {
    id: "cgpa",
    numeric: false,
    disablePadding: false,
    label: "CGPA",
    disableSort: false,
  },
  {
    id: "completedCredits",
    numeric: false,
    disablePadding: false,
    label: "Completed Credits",
    disableSort: false,
  },
  {
    id: "totalCredits",
    numeric: false,
    disablePadding: false,
    label: "Total Credits",
    disableSort: true,
  },
];
