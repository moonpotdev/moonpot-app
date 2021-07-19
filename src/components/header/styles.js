const styles = (theme) => ({
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        cursor: 'pointer',
        paddingLeft: '7.5%',
    },
    navHeader: {
        width: '100%',
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        paddingTop: '20px',
        paddingBottom: '56px',
        position: 'static',
        marginLeft: '0px',
        '& .MuiToolbar-root': {
            padding: 0,
        },
        '& .MuiButton-outlined': {
            borderColor: '#9F8FFF',
            paddingLeft: '4px',
            paddingRight: '4px',
        }
    },
    navDisplayFlex: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 0,
        paddingBottom: 0,
    },
    navList: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    navContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navLink: {
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: '15px',
        lineHeight: '17px',
        letterSpacing: '0.6px',
        color: '#FFFFFF',
        padding: '32px',
        '&:hover': {
            cursor: 'pointer'
        }
    },
    wallet: {
        width: '50%',
    },
    walletContainerContainer: {
        display: 'flex',
        alignItems: 'center',
    },
})

export default styles;