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
        border: '2px solid #6B96BD',
        borderRadius: '8px',
        width: '100%',
        backgroundColor: '#3F688D',
        alignItems: 'center',
        '& .MuiInputBase-root': {
            alignItems: 'center',
            height: '100%',
        },
        '& .MuiInputBase-input': {
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: '24px',
            height: '100%',
            letterSpacing: '0.2px',
            color: '#AAC3D9',
        },
    },
    inputRoot: {
        fontWeight: 700,
        fontSize: '20px',
        padding: '0 10px',
    },
    actionBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        height: '48px',
        width: '100%',
        fontWeight: 700,
        fontStyle: 'Bold',
        fontSize: '15px',
        lineHeight: '139%',
        letterSpacing: '0.2px',
        color: '#345675',
        verticalAlign: 'center',
        margin: '16px 0 20px 0',
    },
    timelockRemaining: {
        fontWeight: 700,
        fontSize: '12px',
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
    potsMaxButton: {
        backgroundColor: '#6B96BD',
        textTransform: 'uppercase',
        width: '60px',
        borderRadius: '4px',
        margin: '10px',

    },
    tokenIcon: {
        borderRadius: '25px',
        margin: '15px',
        
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