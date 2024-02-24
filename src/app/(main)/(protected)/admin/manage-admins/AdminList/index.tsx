import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material/index";

import { api } from "~/trpc/server";

import AdminListItem from "./AdminListItem";

interface AdminListProps {
  query?: string;
}

export default async function AdminList({ query }: AdminListProps) {
  const admins = await api.admin.getAdmins.query({ query, permissions: 1 });
  if (!admins.length)
    return (
      <Typography variant="body1" className="text-center">
        No admins to show
      </Typography>
    );
  return (
    <TableContainer className="max-h-96 overflow-auto" component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sr.</TableCell>
            <TableCell className="min-w-[120px] text-center whitespace-nowrap">
              Username
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
              Name
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
              User Type
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {admins.map((admin, index) => (
            <AdminListItem key={admin.user.id} admin={admin} index={index} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
