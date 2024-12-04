import Link from "next/link";

import { type DataColumn } from "./types";

export const COLUMNS: DataColumn[] = [
  {
    id: "name",
    label: "Name",
    minWidth: 200,
    getData: (row: any) => row.student.user.name,
  },
  {
    id: "username",
    label: "Username",
    minWidth: 100,
    getData: (row: any) => row.student.user.username.toUpperCase(),
  },
  {
    id: "jobType",
    label: "Job Type",
    minWidth: 100,
    getData: (row: any) => row.placementType.name,
  },
  {
    id: "company",
    label: "Company",
    minWidth: 100,
    getData: (row: any) => row.company.name,
  },
  {
    id: "jobOpening",
    label: "Job Opening",
    minWidth: 100,
    getData: (row: any) => row.jobOpening?.id,
    format: (value: any) =>
      value ? (
        <Link href={`/admin/job-openings/${value}`} className="underline">
          View opening {">"}
        </Link>
      ) : (
        "N/A"
      ),
  },
  {
    id: "isOnCampus",
    label: "On Campus",
    minWidth: 50,
    getData: (row: any) => (row.isOnCampus ? "Yes" : "No"),
  },
  {
    id: "cgpa",
    label: "CGPA",
    minWidth: 100,
    getData: (row: any) => row.student.cgpa,
  },
  {
    id: "author",
    label: "Author",
    minWidth: 200,
    getData: (row: any) => row.author.name,
  },
  {
    id: "selectedAt",
    label: "Selected At",
    minWidth: 100,
    getData: (row: any) => row.selectedAt,
    format: (value: any) => new Date(value).toLocaleDateString(),
  },
];

export const DEFAULT_COLUMNS = [
  "name",
  "username",
  "jobType",
  "company",
  "jobOpening",
  "isOnCampus",
  "selectedAt",
];
