"use client";

import { Button, TableCell, TableRow } from "@mui/material/index";

import { type api } from "~/trpc/server";

type admins = ReturnType<typeof api.admin.getAdmins.query> extends Promise<
  infer T
>
  ? T
  : never;

interface AdminListItemProps {
  admin: admins[number];
  index: number;
}

export default function AdminListItem({ admin, index }: AdminListItemProps) {
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
        <Button color="error" variant="outlined">
          Remove
        </Button>
      </TableCell>
    </TableRow>
  );
}
