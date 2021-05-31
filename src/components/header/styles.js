const styles = (theme) => ({
    logo: {
        cursor: 'pointer',
    },
    navHeader: {
        backgroundColor: 'transparent',
        border: 'none',
        boxShadow: 'none',
        paddingTop: '20px',
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
})

export default styles;