import { redirect } from "next/navigation";

import DrawerHeader from "~/app/_components/DrawerHeader";
import { getServerAuthSession } from "~/server/auth";
export default async function ProtectedPagesLayout({ children }: { children: React.ReactNode }) {
  let session = await getServerAuthSession();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <DrawerHeader />
      {children}
    </>
  );
}
