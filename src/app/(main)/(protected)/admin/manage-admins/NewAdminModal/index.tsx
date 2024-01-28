"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";

import SearchUserInput from "~/app/common/components/SearchUserClient";
import { api } from "~/trpc/react";

export default function NewAdminModal() {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>(null);
  const createAdminMutation = api.admin.createAdmin.useMutation({
    onSuccess: () => {
      handleClose();
      router.refresh();
    },
  });

  const handleClose = () => {
    setOpen(false);
    setValue(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAdminMutation.mutate({
      id: value,
      permissions: 1,
    });
  };

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
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent className="flex flex-col gap-4">
          <DialogContentText>
            Select the User that you want to make an Admin. You can search by
            user's name or username.
          </DialogContentText>
          <SearchUserInput
            multiple={false}
            label="Search user"
            value={value}
            setValue={setValue}
            customAPIFilters={{ isAdmin: false }}
            required
          />
        </DialogContent>
        <DialogActions className="p-4">
          <Button color="error" onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            loading={createAdminMutation.isLoading}
          >
            Submit
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
