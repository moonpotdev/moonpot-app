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
        backgroundColor: '#8A7CE3',
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
    countdown: {
        fontWeight: 700,
        fontSize: '14px',
        lineHeight: '16px',
        color: '#ffffff',
    },
    subTitle: {
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '12px',
        color: '#DFDDE7',
        letterSpacing: '0.6px',
    },
    apy: {
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '14px',
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
    potUsd: {
        fontWeight: 700,
        fontSize: '26px',
        lineHeight: '30px',
        color: '#ffffff',
        textAlign: 'center',
        paddingTop: '10px',
        '& span': {
            color: '#DFDDE7'
        }
    },
    potCrypto: {
        fontWeight: 500,
        fontSize: '10px',
        color: '#ffffff',
        textAlign: 'right',
        '& span': {
            color: '#DFDDE7',
        }
    },
    play: {
        border: 'solid 4px #B38922',
        width: '100%',
        fontWeight: 700,
        fontSize: '20px',
        margin: '20px 0',
        paddingTop: '2px',
        paddingBottom: '2px',
    },
    oddsChance: {
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '14px',
        textAlign: 'right',
        color: '#ffffff',
        '& span': {
            color: '#DFDDE7',
        }
    },
    oddsPerDeposit: {
        fontWeight: 500,
        fontSize: '10px',
        lineHeight: '12px',
        textAlign: 'right',
        color: '#DFDDE7',
    },
    communityItem: {
        backgroundColor: '#ffffff',
        width: '330px',
        margin: '105px auto 0px auto',
        borderRadius: '10px',
        padding: '0 25px',
        '& h1': {
            fontWeight: 500,
            fontSize: '40px',
            lineHeight: '46px',
            padding: 0,
            margin: 0,
        },
        '& p': {
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '30px',
            letterSpacing: '0.45px',
            color: '#595465',
        },
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
    },
    ziggyMaintenance: {
        textAlign: 'center',
        marginTop: '-75px',
    },
});

export default styles;
