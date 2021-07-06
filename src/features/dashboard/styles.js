const styles = (theme) => ({
    h1: {
        fontSize: '22px',
        lineHeight: '34px',
        fontWeight: 400,
        color: '#ffffff',
        padding: '30px 0',
        textAlign: 'center',
        '& span': {
            color: '#F3BA2E'
        }
    },
    potItem: {
        backgroundColor: '#7DAEDA',
        width: '330px',
        margin: '80px auto 0px auto',
        borderRadius: '10px',
        padding: '10px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
    },
    potImage: {
        width: '100%',
        textAlign: 'center',
        marginTop: '-48px',
    },
    split: {
        width: '118px',
        '& .MuiTypography-h1': {
            fontSize: '20px',
            fontFamily: 'Ubuntu',
            fontWeight: 400,
            color: '#ffffff',
        },
        '& .MuiTypography-h2': {
            fontSize: '12px',
            fontWeight: 700,
            color: '#ffffff',
        },
        '& .MuiTypography-h3': {
            fontSize: '10px',
            fontWeight: 700,
            color: '#DFDDE7',
            letterSpacing: '0.6px',
        }
    },
    seperator: {
        paddingTop: '8px',
    },
    btn: {
        width: '100%',
    },
    empty: {
        color: '#E1DDEA',
        padding: '20px',
        textAlign: 'center',
        '& .MuiTypography-body1': {
            paddingTop: '10px',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '22px',
            letterSpacing: '0.46px',
        }
    }
});

export default styles;
