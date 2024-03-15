import { redirect } from "next/navigation";

import { getServerAuthSession } from "~/server/auth";
export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = await getServerAuthSession();
  if (!session || !session.user) {
    redirect("/login");
  }
  return <div className="h-full">{children}</div>;
}
