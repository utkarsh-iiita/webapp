import { type Metadata } from "next";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

import PageLayout from "./_components/PageLayout";
import seo from "./_components/SEO";
import ThemeRegistry from "./_utils/theme/ThemeRegistry";

import "~/styles/globals.css";

import "@fontsource/ibm-plex-sans";
import "@fontsource-variable/oswald";

export const metadata: Metadata = seo({});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body id="__next">
        <TRPCReactProvider cookies={cookies().toString()}>
          <ThemeRegistry options={{ key: "css", prepend: true }}>
            <PageLayout>{children}</PageLayout>
          </ThemeRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
