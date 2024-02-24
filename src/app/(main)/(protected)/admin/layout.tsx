import { type ReactNode } from "react";
import { redirect } from "next/navigation";

import { Container, Typography } from "@mui/material/index";

import { getServerAuthSession } from "~/server/auth";

import RequestAdminAccess from "./_components/RequestAdminAcess";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let session = await getServerAuthSession();
  if (session.user.userGroup === "student" && !session?.user.admin) {
    redirect("/");
  }
  if (!session?.user.admin) {
    return (
      <Container className="h-full flex flex-col items-center justify-center py-4">
        <Typography variant="h4">No Admin Access</Typography>
        <Typography variant="body1" className="mt-4 mb-2">
          You can raise new admin access request to the Portal Administrator by
          clicking on the button below.
        </Typography>
        <RequestAdminAccess />
      </Container>
    );
  }
  if (session?.user.admin.permissions === 0) {
    return (
      <Container className="h-full flex flex-col items-center justify-center py-4">
        <Typography variant="h4">Waiting for approval...</Typography>
        <Typography variant="body1" className="mt-4">
          Please contact the Portal Administrator to accept your request.
        </Typography>
        <Typography variant="body2" className="mt-2">
          If already accepted please try logging out and then logging in again.
        </Typography>
      </Container>
    );
  }
  return <>{children}</>;
}
