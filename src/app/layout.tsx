import { type Metadata } from "next";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

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
            <AppRouterCacheProvider>
              <PageLayout>
                <NextTopLoader color="#3399FF" height={2} />
                {children}
              </PageLayout>
            </AppRouterCacheProvider>
          </ThemeRegistry>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
