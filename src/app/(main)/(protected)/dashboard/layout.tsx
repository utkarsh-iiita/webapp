import { Suspense } from "react";
import { redirect } from "next/navigation";

import FullPageLoader from "~/app/common/components/FullPageLoader";
import { getServerAuthSession } from "~/server/auth";
export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = await getServerAuthSession();
  if (session?.user?.userGroup !== "student") {
    return redirect("/admin");
  }
  if (session?.user?.isOnboardingComplete === false) {
    return redirect("/onboarding");
  }
  return <Suspense fallback={<FullPageLoader />}>{children}</Suspense>;
}
