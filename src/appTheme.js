import {createMuiTheme} from "@material-ui/core";

const appTheme = () => {
    return createMuiTheme({
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
            fontFamily: `"Ubuntu", "Roboto"`,
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    body: {
                        backgroundColor: '#303050',
                        overflowX: 'hidden',
                    },
                    
                },
            },
            MuiGrid: {
                container: {
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    boxSizing: 'border-box',
                    justifyContent: 'center',
                },
            },
            MuiButton: {
                root: {
                    width: '169px',
                    height: '34px',
                    borderRadius: 20,
                    borderWidth: '2px',
                    color: '#ffffff',
                    textTransform: 'none',
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
                    lineHeight: '17.24px',
                },
                outlinedPrimary: {
                    border: '2px solid #F3BA2E',
                    boxSizing: 'border-box',
                    borderRadius: '20px',
                    color: '#F3BA2E',
                    fontWeight: 500,
                    fontSize: '15px',
                    lineHeight: '17.24px',
                    '&:hover': {
                        borderWidth: '2px',
                    }
                },
            },
        },
    });
}

export default appTheme;