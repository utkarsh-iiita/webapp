import { type api as API } from "~/trpc/server";

type Applications = ReturnType<
  typeof API.jobApplication.getJobApplicants.query
> extends Promise<infer T>
  ? T
  : never;

interface BasicStudentDetails {
  id: string;
  name: string;
  username: string;
}

interface DataColumn {
  id: string;
  label: string;
  numeric: boolean;
  disablePadding?: boolean;
  disableSort?: boolean;
  isExtraData?: boolean;
  format?: (value: string) => string | JSX.Element;
}

interface EnhancedTableProps {
  page: number;
  pageSize: number;
  sort: "asc" | "desc";
  orderBy: string;
  filterColumn: string;
  filterValue: string;
  selected: BasicStudentDetails[];
  data?: Applications;
  isLoading: boolean;
  columns: string[];
  allColumns: DataColumn[];
  setPage: (newPage: number) => void;
  setPageSize: (newPageSize: number) => void;
  setOrderBy: (newOrderBy: string) => void;
  setSort: (newSort: "asc" | "desc") => void;
  setFilterColumn: (newFilterColumn: string) => void;
  setFilterValue: (newFilterValue: string) => void;
  setSelected: (newSelected: BasicStudentDetails[]) => void;
  setColumns: (newColumns: string[]) => void;
}
