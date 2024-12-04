"use client";

import { useMemo, useState } from "react";

import { api } from "~/trpc/react";

import { BASE_COLUMNS } from "./EnhancedTable/constants";
import {
  type BasicStudentDetails,
  type DataColumn,
} from "./EnhancedTable/types";
import EnhancedTable from "./EnhancedTable";

interface ApplicantsTableProps {
  jobId: string;
  extraApplicationFields: any;
}

export default function ApplicantsTable(props: ApplicantsTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [selected, setSelected] = useState<BasicStudentDetails[]>([]);
  const [columns, setColumns] = useState<string[]>([
    "username",
    "name",
    "status",
    "createdAt",
  ]);
  const [query, setQuery] = useState("");

  const allColumns = useMemo(() => {
    const cols: DataColumn[] = [...BASE_COLUMNS];
    if (props.extraApplicationFields) {
      props.extraApplicationFields.forEach((field) => {
        const newCol = {
          id: field.title,
          numeric: field.format === "Number",
          disablePadding: false,
          label: field.title,
          disableSort: true,
          isExtraData: true,
        };
        cols.push(newCol);
      });
    }
    return cols;
  }, [props.extraApplicationFields]);

  const { data, isLoading } = api.jobApplication.getJobApplicants.useQuery({
    jobId: props.jobId,
    filterColumn,
    filterValue,
    page,
    pageSize,
    orderBy,
    sort,
    query
  });

  const downloadCSVMutation =
    api.jobApplication.getJobApplicantsCSV.useMutation({
      onSuccess: (data) => {
        const url = window.URL.createObjectURL(
          new Blob([data.data], { type: "text/csv" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.setAttribute("download", data.title);
        document.body.appendChild(link);
        link.click();
      },
    });

  return (
    <EnhancedTable
      page={page}
      pageSize={pageSize}
      sort={sort}
      orderBy={orderBy}
      filterColumn={filterColumn}
      filterValue={filterValue}
      selected={selected}
      data={data}
      isLoading={isLoading}
      columns={columns}
      allColumns={allColumns}
      isDownloadLoading={downloadCSVMutation.isLoading}
      handleDownload={() => downloadCSVMutation.mutate(props.jobId)}
      query={query}
      setQuery={setQuery}
      setPage={setPage}
      setPageSize={setPageSize}
      setOrderBy={setOrderBy}
      setSort={setSort}
      setFilterColumn={setFilterColumn}
      setFilterValue={setFilterValue}
      setSelected={setSelected}
      setColumns={setColumns}
    />
  );
}
