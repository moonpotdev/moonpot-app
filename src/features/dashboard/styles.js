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
    noActivePots: {
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        width: '100%',
        maxWidth: '350px',
        minHeight: '320px',
        border: '2px solid #F3F2F8',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)',
        borderRadius: '16px',
        boxSizing: 'border-box',
        marginTop: '48px',
    },
    noActivePotsImage: {
        marginTop: '24px',
    },
    noActivePotsTitle: {
        color: '#585464',
        fontWeight: 400,
        fontSize: '24px',
        lineHeight: '36px',
        marginBottom: '12px',
    },
    noActivePotsText: {
        color: '#585464',
        fontWeight: 400,
        fontSize: '15px',
        lineHeight: '24px',
    },
    noActivePotsPlayButton: {
        backgroundColor: 'rgba(103, 83, 219, 0.1)',
        border: '2px solid #6753DB',
        boxSizing: 'border-box',
        borderRadius: '20px',
        width: '100%',
        fontWeight: 500,
        fontSize: '15px',
        lineHeight: '17.24px',
        color: '#6753DB',
        marginTop: '24px',
        marginBottom: '24px',
    },
    vaultPotItem: {
        backgroundColor: '#345675',
        height: '100%',
        width: '452px',
        margin: '80px auto 0px auto',
        marginTop: '56px',
        borderRadius: '16px',
        padding: '10px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.4)', 

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
        marginTop: '10px',
        marginLeft: '10px',
    },
    potUsdTop: {
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '27.58px',
        letterSpacing: '0.6px',
        marginTop: '10px',
        color: '#ffffff',
        '& span': {
            color: '#DFDDE7'
        }
    },
    potUsd: {
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '27.58px',
        letterSpacing: '0.6px',
        color: '#ffffff',
        '& span': {
            color: '#DFDDE7'
        }
    },
    myPotsNextWeeklyDrawText: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#EBF3F9',
        padding: 0,
        margin: 0,
        '& span': {
            fontWeight: 700,
        }
    },
    myDetailsText: {
        color: '#EBF3F9',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        textTransform: 'capitalize',
        marginBottom: '16px',
    },
    myDetailsValue: {
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        marginBottom: '16px',
    },
    divider: {
        color: '#436F97',
        backgroundColor: '#436F97',
        height: '2px',
    },
    dividerText: {
        color: '#EBF3F9',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    expandToggle: {
        color: '#FFFFFF',
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
