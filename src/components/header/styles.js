const styles = (theme) => ({
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
    navLink: {
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: '15px',
        lineHeight: '17px',
        letterSpacing: '0.6px',
        color: '#FFFFFF',
        padding: '32px',
    },
    wallet: {
        width: '50%',
    },
    navList: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
})

export default styles;