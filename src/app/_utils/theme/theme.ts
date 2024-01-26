import { createTheme } from "@mui/material/index";

declare module "@mui/material/styles" {
  interface Palette {
    title: string;
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    title?: string;
  }
}

export function getTheme(mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      title: "#0172E4",
      ...(mode === "light"
        ? {
          primary: {
            main: "#3399FF",
          },
          background: {
            default: "#F3F7F8",
            paper: "#F3F7F8",
          },
          bgclear: "#F3F7F8CC",
          text: {
            disabled: "rgba(0, 0, 0, 0.7)",
          },
        }
        : {
          primary: {
            main: "#66b2ff",
          },
          background: {
            default: "#101418",
            paper: "#101418",
          },
          bgclear: "rgba(16, 21, 25, 0.8)",
        }),
    },
    typography: {
      fontFamily: '"IBM Plex Sans", sans-serif',
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: () => document.getElementById("__next"),
        },
      },
      MuiPopper: {
        defaultProps: {
          container: () => document.getElementById("__next"),
        },
      },
      MuiDialog: {
        defaultProps: {
          container: () => document.getElementById("__next"),
        },
      },
      MuiModal: {
        defaultProps: {
          container: () => document.getElementById("__next"),
        },
      },
    },
  });
}