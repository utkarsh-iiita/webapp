import { useMemo } from "react";
import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "@/utils/api";
import { getTheme } from "@/utils/theme";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { AppCacheProvider } from "@mui/material-nextjs/v14-pagesRouter";

import "@/styles/globals.css";

import "@fontsource-variable/oswald";
import "@fontsource-variable/dm-sans";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  let theme = useMemo(() => getTheme("dark"), []);

  return (
    <SessionProvider session={session}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <AppCacheProvider {...pageProps}>
            <Component {...pageProps} />
          </AppCacheProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
