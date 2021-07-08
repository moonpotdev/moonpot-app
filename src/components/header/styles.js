const styles = (theme) => ({
    logo: {
        cursor: 'pointer',
        marginLeft: '7.5%',
    },
    navHeader: {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        paddingTop: '20px',
        position: 'static',
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
    },
})

export default styles;