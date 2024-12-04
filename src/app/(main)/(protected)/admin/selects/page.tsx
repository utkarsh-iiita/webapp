"use client";

import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Button, Container, Typography } from "@mui/material";

import { api } from "~/trpc/react";

import PlacementTypeSelector from "../_components/PlacementTypeSelector";

import EnhancedTable from "./_components/EnhancedTable";
import {
  COLUMNS,
  DEFAULT_COLUMNS,
} from "./_components/EnhancedTable/constants";
import Link from "next/link";


export default function SelectsPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [query, setQuery] = useState("");
  const [jobTypes, setJobTypes] = useState<string | null>(null);

  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  const { data, isLoading } = api.selections.getSelectedStudents.useQuery({
    page,
    pageSize,
    query,
    jobTypes,
    orderBy,
    sort,
  });
  const downloadCSVMutation =
    api.selections.getSelectedStudentsCSV.useMutation({
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
    <Container
      className="flex flex-col w-full relative box-border"
      maxWidth="xl"
    >
      <div className="flex flex-row gap-4 items-center py-3">
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Selections
        </Typography>

        <PlacementTypeSelector
          selectedPlacementTypes={jobTypes}
          setSelectedPlacementTypes={setJobTypes}
        />
        <Link href="./selects/new">
          <Button
            variant="outlined"
            color="primary"
            className="inline-flex p-2 min-w-0"
          >
            <AddCircleIcon />
          </Button>
        </Link>
      </div>
      <div className="absolute py-4 w-[calc(100%-3em)] top-12 box-border">
        <EnhancedTable
          allColumns={COLUMNS}
          columns={columns}
          filterColumn={filterColumn}
          filterValue={filterValue}
          isLoading={isLoading}
          orderBy={orderBy}
          page={page}
          pageSize={pageSize}
          setColumns={setColumns}
          setFilterColumn={setFilterColumn}
          setFilterValue={setFilterValue}
          setOrderBy={setOrderBy}
          setPage={setPage}
          setPageSize={setPageSize}
          setSort={setSort}
          data={data}
          sort={sort}
          query={query}
          setQuery={setQuery}
          isDownloadLoading={downloadCSVMutation.isLoading}
          handleDownload={() => downloadCSVMutation.mutate({ jobTypes })}
        />
      </div>
    </Container>
  );
}
