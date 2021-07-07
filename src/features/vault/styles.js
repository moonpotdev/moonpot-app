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
    vaultPotItem: {
        backgroundColor: '#345675',
        height: '431px',
        width: '452px',
        margin: '80px auto 0px auto',
        borderRadius: '16px',
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
    input: {
        border: '4px solid #8A7CE3',
        borderRadius: '5px',
        width: '100%',
        backgroundColor: '#C5BDF5',
        padding: 0,
        position: 'relative',
        '& .MuiInputBase-input': {
            fontWeight: 700,
            fontSize: '20px',
            padding: '8px 12px',
        },
        '& .MuiButton-root': {
            color: '#ffffff',
            backgroundColor: '#8A7CE3',
            position: 'absolute',
            top: '5px',
            right: '5px',
            padding: '3px',
        }
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
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '20px',
    }
});

export default styles;