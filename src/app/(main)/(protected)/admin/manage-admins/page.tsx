import { Suspense } from "react";

import {
  CircularProgress,
  Container,
  Divider,
  Typography,
} from "@mui/material/index";

import SearchFilter from "~/app/common/SearchFilter";

import AdminList from "./AdminList";
import NewAdminModal from "./NewAdminModal";
import RequestModal from "./RequestModal";

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
        <div className="flex gap-2">
          <NewAdminModal />
          <RequestModal />
        </div>
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
