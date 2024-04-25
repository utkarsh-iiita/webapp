import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  alpha,
  Checkbox,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { type DataColumn } from "./types";
interface EnhancedTableToolbarProps {
  numSelected: number;
  columns: string[];
  allColumns: DataColumn[];
  setColumns: (cols: string[]) => void;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  const [columnSelectAnchorEl, setColumnSelectAnchorEl] =
    useState<null | HTMLElement>(null);
  const openColumnSelect = Boolean(columnSelectAnchorEl);
  const handleOpenColumnSelect = (event: React.MouseEvent<HTMLElement>) => {
    setColumnSelectAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setColumnSelectAnchorEl(null);
  };

  const handleMenuItemClick = (column: string) => {
    const index = props.columns.indexOf(column);
    const newColumns = [...props.columns];
    if (index === -1) {
      newColumns.push(column);
    } else {
      newColumns.splice(index, 1);
    }
    props.setColumns(newColumns);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Applications
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          <Tooltip title="Filter list">
            <IconButton onClick={handleOpenColumnSelect}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="lock-menu"
            anchorEl={columnSelectAnchorEl}
            open={openColumnSelect}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "lock-button",
              role: "listbox",
            }}
            slotProps={{
              paper: {
                style: {
                  maxHeight: 400,
                },
              },
            }}
          >
            {props.allColumns.map((col, index) => (
              <MenuItem
                key={index}
                selected={props.columns.find((c) => c === col.id) !== undefined}
                onClick={() => handleMenuItemClick(col.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    checked={
                      props.columns.find((c) => c === col.id) !== undefined
                    }
                    onChange={() => handleMenuItemClick(col.id)}
                  />
                </ListItemIcon>
                <Typography noWrap>{col.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Toolbar>
  );
}
