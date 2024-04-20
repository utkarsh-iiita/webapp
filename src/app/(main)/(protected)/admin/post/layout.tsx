import { type ReactNode, Suspense } from "react";

import FullPageLoader from "~/app/common/components/FullPageLoader";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Suspense fallback={<FullPageLoader />}>{children}</Suspense>;
}
