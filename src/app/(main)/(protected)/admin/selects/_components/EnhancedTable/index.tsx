import React from "react";

import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";

import EnhancedTableHead from "./Header";
import EnhancedTableToolbar from "./Toolbar";
import { type EnhancedTableProps } from "./types";

export default function EnhancedTable(props: EnhancedTableProps) {
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = props.orderBy === property && props.sort === "asc";
    props.setSort(isAsc ? "desc" : "asc");
    props.setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    props.setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    props.setPageSize(parseInt(event.target.value, 10));
    props.setPage(0);
  };

  const emptyRows =
    props.page > 0
      ? Math.max(0, (1 + props.page) * props.pageSize - props.data?.data.length)
      : 0;

  return (
    <Paper sx={{ mb: 2 }}>
      <EnhancedTableToolbar
        handleDownload={props.handleDownload}
        columns={props.columns}
        allColumns={props.allColumns}
        setColumns={props.setColumns}
        query={props.query}
        setQuery={props.setQuery} isDownloadLoading={false} />
      {!props.data ? (
        <div className="flex items-center justify-center py-24">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer>
            <Table
              sx={{
                minWidth: 750,
                overflowX: "auto",
              }}
              aria-labelledby="tableTitle"
            >
              <EnhancedTableHead
                order={props.sort}
                orderBy={props.orderBy}
                onRequestSort={handleRequestSort}
                columns={props.columns}
                allColumns={props.allColumns}
              />
              <TableBody>
                {props.data?.data.map((row) => {
                  return (
                    <TableRow tabIndex={-1} key={row.id}>
                      {props.columns.map((col) => {
                        const headCell = props.allColumns.find(
                          (column) => column.id === col,
                        );
                        const value = headCell.getData(row);
                        return (
                          <TableCell
                            key={col}
                            align={headCell.numeric ? "right" : "left"}
                          >
                            {headCell.format ? headCell.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="p-[26px]" />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={props.data?.total || 0}
            rowsPerPage={props.pageSize}
            page={props.page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
}
