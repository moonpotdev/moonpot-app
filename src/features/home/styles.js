const styles = (theme) => ({
    h1: {
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
        backgroundColor: '#345675',
        height: '316px',
        width: '354px',
        margin: '80px auto 0px auto',
        borderRadius: '10px',
        padding: '10px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
        boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.4)',
    },
    potImage: {
        width: '100%',
        marginTop: '10px',
        marginLeft: '10px',
    },
    countdown: {
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '24px',
        letterSpacing: '0.2px',
        color: '#ffffff',
    },
    subTitle: {
        fontWeight: 700,
        fontSize: '10px',
        lineHeight: '20px',
        color: '#EBF3F9',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    apy: {
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '24px',
        color: '#ffffff',
        textAlign: 'right',
    },
    earn: {
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '12px',
        color: '#DFDDE7',
        letterSpacing: '0.6px',
    },
    potUsdTop: {
        marginTop: '10px',
        fontWeight: 700,
        fontSize: '24px',
        lineHeight: '27.58px',
        letterSpacing: '0.6px',
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
    potCrypto: {
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '20px',
        color: '#EBF3F9',
        textAlign: 'right',
        '& span': {
            color: '#FFFFFF',
        }
    },
    play: {
        backgroundColor: '#FFFFFF',
        border: 'solid #FFFFFF',
        borderRadius: '8px',
        width: '100%',
        height: '48px',
        fontWeight: 700,
        fontSize: '15px',
        letterSpacing: '0.2px',
        color: '#3675A2',
    },
    oddsPerDeposit: {
        fontWeight: 300,
        fontSize: '12px',
        lineHeight: '20px',
        textAlign: 'center',
        color: '#DFDDE7',
        left: 'calc(50% - 188px/2)',
        top: 'calc(50% - 20px/2 + 124px)',
    },
    communityItem: {
        margin: '105px auto 0px auto',
        borderRadius: '10px',
        padding: '0 25px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
    },
    communityTitle: {
        fontWeight: 400,
        fontSize: '25px',
        lineHeight: '36px',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    communityDescription: {
        fontWeight: 400,
        fontSize: '15px',
        lineHeight: '24px',
        color: '#C7C3D5',
        textAlign: 'center',
    },
    ziggyMaintenance: {
        textAlign: 'center',
        marginTop: '-55px',
        marginBottom: '25px',
    },
});

export default styles;
