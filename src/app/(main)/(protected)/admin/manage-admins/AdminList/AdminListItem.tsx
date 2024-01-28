"use client";

import { useRouter } from "next/navigation";

import LoadingButton from "@mui/lab/LoadingButton";
import { Button, TableCell, TableRow } from "@mui/material/index";

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
        <LoadingButton
          color="error"
          variant="outlined"
          onClick={() => {
            removeAdminMutation.mutate(admin.user.id);
          }}
          loading={removeAdminMutation.isLoading}
        >
          Remove
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
}
