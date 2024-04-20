"use client";

import { useCallback, useMemo, useState } from "react";
import { SessionProvider } from "next-auth/react";

import CssBaseline from "@mui/material/CssBaseline";
import { StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "~/app/_utils/extendedDayjs";

import { storeLS } from "../localStorage";

import { getTheme } from "./theme";
import { ThemeContext, useThemeHandler } from "./ThemeContext";
import NextAppDirEmotionCacheProvider from "./ThemeRegistryCacheProvider";

export default function ThemeRegistry(props) {
  const { options, children } = props;

  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark");

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
    storeLS("theme-mode", themeMode, true);
  }, []);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  useThemeHandler(themeMode, setThemeMode);

  return (
    <SessionProvider>
      <NextAppDirEmotionCacheProvider options={options}>
        <StyledEngineProvider injectFirst>
          <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDayjs} dateLibInstance={dayjs}>
                <CssBaseline />
                {children}
              </LocalizationProvider>
            </ThemeProvider>
          </ThemeContext.Provider>
        </StyledEngineProvider>
      </NextAppDirEmotionCacheProvider>
    </SessionProvider>
  );
}
