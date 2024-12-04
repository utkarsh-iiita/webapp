import { type api as API } from "~/trpc/server";

type Selects = ReturnType<
  typeof API.selections.getSelectedStudents.query
> extends Promise<infer T>
  ? T
  : never;

interface DataColumn {
  id: string;
  label: string;
  getData: (row: Selects[number]) => string | boolean;
  numeric?: boolean;
  minWidth?: number;
  disablePadding?: boolean;
  disableSort?: boolean;
  format?: (value: string | boolean) => string | JSX.Element;
}

interface EnhancedTableProps {
  page: number;
  pageSize: number;
  sort: "asc" | "desc";
  orderBy: string;
  filterColumn: string;
  filterValue: string;
  data?: Selects;
  isLoading: boolean;
  columns: string[];
  allColumns: DataColumn[];
  query: string;
  isDownloadLoading: boolean;
  handleDownload: () => void;
  setPage: (newPage: number) => void;
  setPageSize: (newPageSize: number) => void;
  setOrderBy: (newOrderBy: string) => void;
  setSort: (newSort: "asc" | "desc") => void;
  setFilterColumn: (newFilterColumn: string) => void;
  setFilterValue: (newFilterValue: string) => void;
  setQuery: (newQuery: string) => void;
  setColumns: (newColumns: string[]) => void;
}
