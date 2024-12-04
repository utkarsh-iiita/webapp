import { type api as API } from "~/trpc/server";

import { type STATUS_ORDER } from "./constants";

type Applications = ReturnType<
  typeof API.jobApplication.getJobApplicants.query
> extends Promise<infer T>
  ? T
  : never;

interface BasicStudentDetails {
  id: string;
  name: string;
  username: string;
  status: STATUS_ORDER[number] | "REJECTED";
  alreadySelected: boolean;
}

interface DataColumn {
  id: string;
  label: string;
  numeric: boolean;
  disablePadding?: boolean;
  disableSort?: boolean;
  isExtraData?: boolean;
  format?: (value: string | boolean) => string | JSX.Element;
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
  isDownloadLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  handleDownload: () => void;
  setPage: (newPage: number) => void;
  setPageSize: (newPageSize: number) => void;
  setOrderBy: (newOrderBy: string) => void;
  setSort: (newSort: "asc" | "desc") => void;
  setFilterColumn: (newFilterColumn: string) => void;
  setFilterValue: (newFilterValue: string) => void;
  setSelected: (newSelected: BasicStudentDetails[]) => void;
  setColumns: (newColumns: string[]) => void;
}
