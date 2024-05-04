"use client";

import { useCallback, useMemo, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import SwipeLeftAltIcon from "@mui/icons-material/SwipeLeftAlt";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  alpha,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { api } from "~/trpc/react";

import { STATUS_ORDER } from "./constants";
import { type BasicStudentDetails, type DataColumn } from "./types";
interface EnhancedTableToolbarProps {
  selected: BasicStudentDetails[];
  setSelected: (newSelected: BasicStudentDetails[]) => void;
  columns: string[];
  allColumns: DataColumn[];
  setColumns: (cols: string[]) => void;
}

export default function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const numSelected = props.selected.length;
  const utils = api.useUtils();

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [columnSelectAnchorEl, setColumnSelectAnchorEl] =
    useState<null | HTMLElement>(null);
  const openColumnSelect = Boolean(columnSelectAnchorEl);
  const handleOpenColumnSelect = (event: React.MouseEvent<HTMLElement>) => {
    setColumnSelectAnchorEl(event.currentTarget);
  };

  const upgradeStatusMutation = api.jobApplication.upgradeStatus.useMutation({
    onSuccess: () => {
      utils.jobApplication.getJobApplicants.invalidate();
      setIsUpgradeOpen(false);
      setIsRejectOpen(false);
      props.setSelected([]);
    },
  });

  const canUpgradeStatus = useMemo(() => {
    const uniqStatuses = new Set(props.selected.map((s) => s.status));
    return (
      uniqStatuses.size === 1 &&
      (uniqStatuses.has("SHORTLISTED")
        ? !props.selected.some((s) => s.alreadySelected)
        : true) &&
      !uniqStatuses.has("SELECTED") &&
      !uniqStatuses.has("REJECTED")
    );
  }, [props.selected]);

  const nextStatus = useMemo(() => {
    const uniqStatuses = new Set(props.selected.map((s) => s.status));
    if (
      uniqStatuses.size !== 1 ||
      uniqStatuses.has("SELECTED") ||
      uniqStatuses.has("REJECTED")
    )
      return "";
    const currStatus = Array.from(uniqStatuses)[0];
    return STATUS_ORDER[STATUS_ORDER.indexOf(currStatus) + 1];
  }, [props.selected]);

  const handleUpgradeStatus = useCallback(() => {
    const uniqStatuses = new Set(props.selected.map((s) => s.status));
    if (
      uniqStatuses.size !== 1 ||
      uniqStatuses.has("SELECTED") ||
      uniqStatuses.has("REJECTED")
    )
      return;
    const currStatus = Array.from(uniqStatuses)[0];
    const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(currStatus) + 1];
    if (nextStatus === "REGISTERED") return;
    upgradeStatusMutation.mutate({
      applicationId: props.selected.map((s) => s.id),
      status: nextStatus,
    });
  }, [props.selected]);

  const canReject = useMemo(() => {
    const uniqStatuses = new Set(props.selected.map((s) => s.status));
    return !uniqStatuses.has("SELECTED") && !uniqStatuses.has("REJECTED");
  }, [props.selected]);

  const handleReject = useCallback(() => {
    const uniqStatuses = new Set(props.selected.map((s) => s.status));
    console.log(uniqStatuses);
    if (uniqStatuses.has("SELECTED") || uniqStatuses.has("REJECTED")) return;

    upgradeStatusMutation.mutate({
      applicationId: props.selected.map((s) => s.id),
      status: "REJECTED",
    });
  }, [props.selected]);

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
        <>
          {canReject && (
            <>
              <Tooltip title="Reject">
                <IconButton onClick={() => setIsRejectOpen(true)}>
                  <SwipeLeftAltIcon />
                </IconButton>
              </Tooltip>
              <Dialog
                open={isRejectOpen}
                onClose={() => setIsRejectOpen(false)}
                PaperProps={{
                  component: "form",
                  onSubmit: (e) => {
                    e.preventDefault();
                    handleReject();
                  },
                }}
              >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                  You will be <strong>REJECTING</strong> applications of
                  <strong> {props.selected.length}</strong> students
                </DialogContent>
                <DialogActions className="p-4">
                  <Button
                    onClick={() => setIsRejectOpen(false)}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    color="error"
                    variant="outlined"
                    loading={upgradeStatusMutation.isLoading}
                  >
                    Confirm
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </>
          )}
          {canUpgradeStatus && (
            <>
              <Tooltip title="Upgrade Status">
                <IconButton onClick={() => setIsUpgradeOpen(true)}>
                  <KeyboardDoubleArrowUpIcon />
                </IconButton>
              </Tooltip>
              <Dialog
                open={isUpgradeOpen}
                onClose={() => setIsUpgradeOpen(false)}
                PaperProps={{
                  component: "form",
                  onSubmit: (e) => {
                    e.preventDefault();
                    handleUpgradeStatus();
                  },
                }}
              >
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                  You will be upgrading application status of
                  <strong> {props.selected.length}</strong> to{" "}
                  <strong>{nextStatus}</strong>
                </DialogContent>
                <DialogActions className="p-4">
                  <Button
                    onClick={() => setIsUpgradeOpen(false)}
                    variant="contained"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    type="submit"
                    color="success"
                    variant="outlined"
                    loading={upgradeStatusMutation.isLoading}
                  >
                    Confirm
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </>
          )}
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
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
