import { createTheme } from '@mui/material/styles';

export function getTheme(mode) {
  return createTheme({
    palette: {
      mode,
      // title: '#0172E4',
      ...(mode === 'light'
        ? {
          primary: {
            main: '#017eff',
          },
          background: {
            default: '#fefeff',
            paper: '#fefeff',
          },
          bgclear: '#fefeffcc',
          text: {
            disabled: 'rgba(0, 0, 0, 0.7)',
          },
        }
        : {
          primary: {
            main: '#66b2ff',
          },
          background: {
            default: '#0B1829',
            paper: '#0B1829',
          },
          bgclear: 'rgba(11, 24, 41, 0.8)',
        }),
    },
    typography: {
      fontFamily: '"IBM Plex Sans", sans-serif',
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiPopover: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
      MuiPopper: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
      MuiDialog: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
      MuiModal: {
        defaultProps: {
          container: () => document.getElementById('__next'),
        },
      },
    },
  });
}
