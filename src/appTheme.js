import { createTheme } from '@material-ui/core/styles';

const appTheme = () => {
  return createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 720,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        main: '#F3BA2E',
        contrastText: '#ffffff',
      },
      notFocused: {
        main: '#7F7FB3',
      },
      info: {
        main: '#CDCDE4',
        contrastText: '#ffffff',
      },
    },
    typography: {
      fontFamily: `"Ubuntu", sans-serif`,
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            backgroundColor: '#303050',
            overflowX: 'hidden',
          },
          '#WEB3_CONNECT_MODAL_ID': {
            position: 'relative',
            zIndex: '100',
          },
        },
      },
      MuiGrid: {
        container: {
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          boxSizing: 'border-box',
        },
      },
      MuiButton: {
        root: {
          height: '34px',
          borderRadius: 20,
          borderWidth: '2px',
          color: '#ffffff',
          textTransform: 'capitalize',
          paddingTop: '2px',
          paddingBottom: '2px',
        },
        outlined: {
          border: '2px solid #7F7FB3',
          boxSizing: 'border-box',
          borderRadius: '20px',
          color: '#7F7FB3',
          fontWeight: 500,
          fontSize: '15px',
          lineHeight: '17px',
        },
        outlinedPrimary: {
          border: '2px solid #F3BA2E',
          boxSizing: 'border-box',
          borderRadius: '20px',
          color: '#F3BA2E',
          fontWeight: 500,
          fontSize: '15px',
          lineHeight: '17px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
  });
};

export default appTheme;
