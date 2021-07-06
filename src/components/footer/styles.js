const styles = (theme) => ({
    footer: {
        padding: '8px 40px',
        textAlign: 'center',
    },
    beefy: {
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '14px',
        color: '#ffffff',
        letterSpacing: '0.34px',
        marginTop: '16px',
        marginBottom: '100px',
        '& .MuiLink-root': {
            color: '#ffffff',
            textDecoration: 'underline',
        },
        '& img': {
            marginBottom: '-5px',
            marginLeft: '3px',
        }
    },
    footerBtn: {
        width: '184px',
        marginBottom: '20px',
        paddingLeft: '85px',
        paddingRight: '85px',
        color: '#CDCDE4',
        borderColor: '#CDCDE4',
        [theme.breakpoints.up('sm')]: {
            width: 'auto',
            marginLeft: '10px',
            marginRight: '10px',
        },
    },
    footerIcons: {
        '& img': {
            padding: '0 10px',
        }
    }
})

export default styles;