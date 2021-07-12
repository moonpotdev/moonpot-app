const styles = (theme) => ({
    footer: {
        minHeight: '100%',
        padding: '8px 40px',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: '32px',
        // backgroundColor: 'red',
    },
    footerBtn: {
        width: '100%',
        marginTop: '56px',
        marginBottom: '20px',
        paddingLeft: '10%',
        paddingRight: '10%',
        color: '#CDCDE4',
        borderColor: '#CDCDE4',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
            marginLeft: '10px',
            marginRight: '10px',
        },
    },
    footerIcons: {
        flex: 1,
        justifyContent: 'flex-end',
        '& img': {
            padding: '0 10px',
        }
    }
})

export default styles;