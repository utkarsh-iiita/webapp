"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    // TODO add startup logic here
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((serviceWorkerRegistration) => {
          console.info("Service worker was registered.");
          console.info({ serviceWorkerRegistration });
        })
        .catch((error) => {
          console.error(
            "An error occurred while registering the service worker.",
          );
          console.error(error);
        });
    } else {
      console.info(
        "!! Browser does not support service workers or push messages.",
      );
    }
  }, []);

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
