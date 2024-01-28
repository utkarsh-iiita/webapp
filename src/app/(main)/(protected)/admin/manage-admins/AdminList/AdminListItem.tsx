"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow,
} from "@mui/material/index";

import { api } from "~/trpc/react";
import { type api as API } from "~/trpc/server";

type admins = ReturnType<typeof API.admin.getAdmins.query> extends Promise<
  infer T
>
  ? T
  : never;

interface AdminListItemProps {
  admin: admins[number];
  index: number;
}

export default function AdminListItem({ admin, index }: AdminListItemProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const removeAdminMutation = api.admin.removeAdmin.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <TableRow key={index} hover>
      <TableCell
        style={{
          width: 10,
        }}
      >
        {index + 1}
      </TableCell>
      <TableCell className="uppercase text-center whitespace-nowrap">
        {admin.user.username}
      </TableCell>
      <TableCell className="text-center whitespace-nowrap">
        {admin.user.name}
      </TableCell>
      <TableCell className="text-center capitalize whitespace-nowrap">
        {admin.user.userGroup}
      </TableCell>
      <TableCell className="text-center whitespace-nowrap">
        <Button color="error" variant="outlined" onClick={() => setOpen(true)}>
          Remove
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            component: "form",
            onSubmit: (e) => {
              e.preventDefault();
              removeAdminMutation.mutate(admin.user.id);
            },
          }}
        >
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            You will be removing admin privileges from{" "}
            <strong>
              {admin.user.name + " (" + admin.user.username.toUpperCase() + ")"}
            </strong>
            .
          </DialogContent>
          <DialogActions className="p-4">
            <Button onClick={() => setOpen(false)} variant="contained">
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              color="error"
              variant="outlined"
              loading={removeAdminMutation.isLoading}
            >
              Remove
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}
