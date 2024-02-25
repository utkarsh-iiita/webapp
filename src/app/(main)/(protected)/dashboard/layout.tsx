import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = await getServerAuthSession();
  if (session.user.userGroup !== "student") {
    redirect("/admin");
  }
  return <>{children}</>;
}
