const styles = (theme) => ({
    title: {
        fontSize: '22px',
        lineHeight: '34px',
        fontWeight: 500,
        color: '#ffffff',
        padding: '30px 0',
        textAlign: 'center',
        '& span': {
            color: '#F3BA2E'
        }
    },
    potItem: {
        backgroundColor: '#ffffff',
        width: '330px',
        margin: '60px auto 0px auto',
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
    countdown: {
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '16px',
        color: '#172734',
    },
    subTitle: {
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '12px',
        color: '#595465',
        letterSpacing: '0.6px',
    },
    apy: {
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '14px',
        color: '#172734',
        textAlign: 'right',
    },
    earn: {
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '12px',
        color: '#172734',
        letterSpacing: '0.6px',
    },
    potUsd: {
        fontWeight: 700,
        fontSize: '26px',
        lineHeight: '30px',
        color: '#000000',
        textAlign: 'center',
        paddingTop: '10px',
        '& span': {
            color: '#595465'
        }
    },
    potCrypto: {
        fontWeight: 500,
        fontSize: '10px',
        color: '#595465',
        textAlign: 'right',
        '& span': {
            color: '#000000',
        }
    },
    input: {
        fontWeight: 700,
        fontSize: '20px',
        border: '4px solid #8A7CE3',
        borderRadius: '5px',
        width: '100%',
        backgroundColor: '#C5BDF5',
        padding: 0,
        marginTop: '20px',
    },
    inputRoot: {
        fontWeight: 700,
        fontSize: '20px',
        padding: '0 10px',
    },
    actionBtn: {
        border: 'solid 4px #B38922',
        width: '100%',
        fontWeight: 700,
        fontSize: '20px',
        margin: '12px 0 20px 0',
        paddingTop: '2px',
        paddingBottom: '2px',
    },
    timelockRemaining: {
        fontSize: '12px',
        fontWeight: 700,
        lineHeight: '14px',
        color: '#172734',
    },
    link: {
        fontSize: '10px',
        fontWeight: 500,
        lineHeight: '12px',
        color: '#595465',
        textDecoration: 'underline',
        position: 'relative',
        cursor: 'pointer',
        '& .MuiSvgIcon-root': {
            position: 'absolute',
            right: '-4px',
        }
    },
    withdrawPenaltyWarning: {
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '30px',
        color: '#595465',
        padding: '20px 20px 0 20px',
        letterSpacing: '0.45px',
        '& span': {
            backgroundColor: '#FFEFC7',
            padding: '4px',
            borderRadius: '5px',
        }
    }
});

export default styles;