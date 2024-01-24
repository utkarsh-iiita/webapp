import { type Metadata } from "next";

import seo from "~/app/_components/SEO";
// site meta
export const metadata: Metadata = seo({
  title: "Home",
  desc: "Home page of the IIIT Allahabad Placement Portal",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
