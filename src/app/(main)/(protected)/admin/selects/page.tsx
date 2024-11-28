"use client";

import { useState } from "react";

import { Container, Typography } from "@mui/material";

import { api } from "~/trpc/react";

import EnhancedTable from "./_components/EnhancedTable";
import {
  COLUMNS,
  DEFAULT_COLUMNS,
} from "./_components/EnhancedTable/constants";
import PlacementTypeSelector from "./_components/PlacementTypeSelector";

export default function SelectsPage() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [query, setQuery] = useState("");
  const [jobTypes, setJobTypes] = useState<string[] | null>(null);

  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  const { data, isLoading } = api.selections.getSelectedStudents.useQuery({
    page,
    pageSize,
    query,
    jobTypes,
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
        />
      </div>
    </Container>
  );
}
