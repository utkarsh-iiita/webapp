"use client";

import { useState } from "react";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import { Button, IconButton } from "@mui/material";

export default function NewAdminModal() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddModeratorIcon />}
        className="hidden md:inline-flex"
        onClick={() => setOpen(true)}
      >
        New Admin
      </Button>
      <IconButton
        color="primary"
        className="inline-flex md:hidden"
        onClick={() => setOpen(true)}
      >
        <AddModeratorIcon />
      </IconButton>
    </>
  );
}
