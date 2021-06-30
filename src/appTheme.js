import {createMuiTheme} from "@material-ui/core";

const appTheme = () => {
    return createMuiTheme({
        palette: {
            primary: {
                main: '#F3BA2E',
                contrastText: '#ffffff',
            }
        },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    body: {
                        backgroundColor: '#6753DB',
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
                    borderRadius: 20,
                    borderWidth: '2px',
                    color: '#ffffff',
                    textTransform: 'capitalize',
                    paddingTop: '2px',
                    paddingBottom: '2px',
                },
                outlined: {
                    borderWidth: '2px',
                    borderColor: '#9F8FFF',
                    fontWeight: 500,
                    paddingTop: '2px',
                    paddingBottom: '2px',
                },
                outlinedPrimary: {
                    borderWidth: '2px',
                    borderColor: '#F3BA2E',
                    fontWeight: 500,
                    paddingTop: '2px',
                    paddingBottom: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    }
                }
            },
        },
    });
}

export default appTheme;