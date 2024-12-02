import React from "react";

import {
  Checkbox,
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
import { type BasicStudentDetails, type EnhancedTableProps } from "./types";

export default function EnhancedTable(props: EnhancedTableProps) {
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = props.orderBy === property && props.sort === "asc";
    props.setSort(isAsc ? "desc" : "asc");
    props.setOrderBy(property);
  };

  const isSelected = (id: string) => !!props.selected.find((s) => s.id === id);

  const handleSelectAllClick = () => {
    const newSelected: BasicStudentDetails[] = [...props.selected];
    const allCurrSelected = props.data.data.every((n) => isSelected(n.id));
    if (!allCurrSelected) {
      props.data.data.forEach((n) => {
        if (isSelected(n.id)) return;
        newSelected.push({
          id: n.id,
          name: n.name,
          username: n.username,
          status: n.status,
          alreadySelected: n.alreadySelected,
        });
      });
    } else {
      props.data.data.forEach((n) => {
        const index = newSelected.findIndex((s) => s.id === n.id);
        if (index === -1) return;
        newSelected.splice(index, 1);
      });
    }
    props.setSelected(newSelected);
  };

  const handleClick = (id: string) => {
    const newSelected: BasicStudentDetails[] = [...props.selected];
    const n = props.data.data.find((n) => n.id === id);
    const index = newSelected.findIndex((s) => s.id === n.id);
    if (index === -1) {
      if (isSelected(n.id)) return;
      newSelected.push({
        id: n.id,
        name: n.name,
        username: n.username,
        status: n.status,
        alreadySelected: n.alreadySelected,
      });
    } else {
      newSelected.splice(index, 1);
    }
    props.setSelected(newSelected);
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    props.page > 0
      ? Math.max(0, (1 + props.page) * props.pageSize - props.data?.data.length)
      : 0;

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <EnhancedTableToolbar
        selected={props.selected}
        setSelected={props.setSelected}
        columns={props.columns}
        allColumns={props.allColumns}
        setColumns={props.setColumns}
        isDownloadLoading={props.isDownloadLoading}
        handleDownload={props.handleDownload}
        query={props.query}
        setQuery={props.setQuery}
      />
      {!props.data ? (
        <div className="flex items-center justify-center py-24">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={props.selected.length}
                order={props.sort}
                orderBy={props.orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={props.data?.total}
                columns={props.columns}
                allColumns={props.allColumns}
              />
              <TableBody>
                {props.data?.data.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={() => handleClick(row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      {props.columns.map((col) => {
                        const headCell = props.allColumns.find(
                          (column) => column.id === col,
                        );
                        const value = headCell?.isExtraData
                          ? row.additionalInfo[col]
                          : row[col];
                        return (
                          <TableCell
                            key={col}
                            align={headCell.numeric ? "right" : "left"}
                          >
                            {headCell.format
                              ? headCell.format(value)
                              : value instanceof Date
                                ? value.toLocaleString()
                                : value}
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
