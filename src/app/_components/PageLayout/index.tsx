"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import Navbar from "../Navbar";
import ResponsiveDrawer from "../SideDrawer";

const NO_DRAWER_PAGES = ["/", "/login", "/onboarding"];

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
    <div className="flex flex-row w-full min-h-svh">
      {!noSidebar && (
        <ResponsiveDrawer
          open={isDrawerOpen}
          setOpen={setIsDrawerOpen}
          isAdmin={pathname.includes("/admin")}
        />
      )}
      <div className="flex flex-col w-full">
        <Navbar setIsDrawerOpen={setIsDrawerOpen} noSidebar={noSidebar} />
        <main className="flex-grow p-0">{children}</main>
      </div>
    </div>
  );
}
