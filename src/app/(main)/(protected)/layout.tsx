import { redirect } from "next/navigation";

import { Container } from "@mui/material";

import { getServerAuthSession } from "~/server/auth";
export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <Container component="div" maxWidth="xl">
      {children}
    </Container>
  );
}
