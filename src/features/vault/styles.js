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
            fontStyle: 'Medium',
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
    enabledActionBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        height: '48px',
        width: '100%',
        fontWeight: 700,
        fontStyle: 'Bold',
        fontSize: '15px',
        lineHeight: '139%',
        letterSpacing: '0.2px',
        color: '#3675A2',
        margin: '16px 0 8px 0',
    },
    disabledActionBtn: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        height: '48px',
        width: '100%',
        fontWeight: 700,
        fontStyle: 'Bold',
        fontSize: '15px',
        lineHeight: '139%',
        letterSpacing: '0.2px',
        color: 'rgba(54, 117, 162, 0.4)',
        margin: '16px 0 8px 0',
    },
    connectWalletBtn: {
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
        margin: '16px 0 8px 0',
    },
    divider: {
        color: '#436F97',
        backgroundColor: '#436F97',
        height: '2px',
    },
    timelockRemaining: {
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '14px',
        color: '#172734',
    },
    oddsPerDeposit: {
        fontWeight: 300,
        fontSize: '12px',
        lineHeight: '145%',
        textAlign: 'center',
        color: '#DFDDE7',
    },
    expandToggle: {
        color: '#FFFFFF',
        alignText: 'right',
        cursor: 'pointer',
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
    withdrawText: {
        fontWeight: 700,
        fontSize: '12px',
        fontStyle: 'Bold',
        letterSpacing: '1px',
        lineHeight: '145%',
        textTransform: 'uppercase',
        color: '#EBF3F9',
        marginBottom: '25px',
        cursor: 'pointer',
    },
    withdrawItemText: {
        color: '#EBF3F9',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '145%',
        letterSpacing: '0.2px',
    },
    withdrawItemValue: {
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '145%',
        fontStyle: 'Bold',
        letterSpacing: '0.2px',
    },
    withdrawPenaltyWarning: {
        fontWeight: 300,
        fontStyle: 'Light',
        fontSize: '12px',
        lineHeight: '145%',
        color: '#EBF3F9',
        letterSpacing: '0.2px',
        marginBottom: '20px',
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