"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import Navbar from "../Navbar";

const NO_DRAWER_PAGES = ["/", "/login"];

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const noSidebar = useMemo(
    () => NO_DRAWER_PAGES.includes(pathname),
    [pathname],
  );
  return (
    <>
      <Navbar setIsDrawerOpen={setIsDrawerOpen} noSidebar={noSidebar} />
      {children}
    </>
  );
}
