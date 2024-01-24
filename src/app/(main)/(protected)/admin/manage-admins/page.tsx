import { Suspense } from "react";

import AddModeratorIcon from "@mui/icons-material/AddModerator";
import {
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import SearchFilter from "~/app/common/SearchFilter";

import AdminList from "./AdminList";

export default async function ManageAdminsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = Array.isArray(searchParams?.q)
    ? searchParams?.q[0]
    : searchParams?.q;
  return (
    <Container className="flex flex-col gap-4 py-4">
      <div className="flex flex-row justify-between items-center">
        <Typography variant="h5" color="primary" className="px-4">
          Manage Admins
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddModeratorIcon />}
          className="hidden md:inline-flex"
        >
          New Admin
        </Button>
        <IconButton color="primary" className="inline-flex md:hidden">
          <AddModeratorIcon />
        </IconButton>
      </div>
      <Divider />
      <SearchFilter allowedFilters={{ textInput: true }} />
      <Suspense
        key={query}
        fallback={
          <div className="w-full flex justify-center items-center">
            <CircularProgress />
          </div>
        }
      >
        <AdminList query={query} />
      </Suspense>
    </Container>
  );
}
