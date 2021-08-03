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
        padding: '24px',
    },
    noActivePotsImage: {

    },
    noActivePotsTitle: {
        color: '#585464',
        fontWeight: 400,
        fontSize: '24px',
        lineHeight: '36px',
        marginBottom: '12px',
        marginTop: '24px',
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
        marginTop: '32px',
    },
    activeMyPot: {
        backgroundColor: '#70609A',
        height: '100%',
        width: 'min(100%, 500px)',
        margin: '80px auto 0px auto',
        marginTop: '56px',
        borderRadius: '16px',
        padding: '24px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)',
        border: '2px solid #8A7EAF',
        '& .MuiDivider-root': {
            
            color: '#8A7EAF',
            backgroundColor: '#8A7EAF',
            height: '2px',
        },
        '& .MuiPaper-root': {
            background: '#8375A9',
            border: '2px solid #B6ADCC',
        },
        '& .MuiInputBase-input': {
            color: '#B6ADCC',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '15px',
            lineHeight: '24px',
            letterSpacing: '0.2px',
        },
        '& .MuiButton-root': {
            color: '#6F609A',
        },
        '& .MuiPaper-root .MuiButtonBase-root': {
            background: '#B6ADCC',
            color: 'rgba(255, 255, 255, 0.95)',
        },
    },
    eolMyPot: {
        backgroundColor: '#594C7B',
        height: '100%',
        width: 'min(100%, 500px)',
        margin: '80px auto 0px auto',
        marginTop: '56px',
        borderRadius: '16px',
        padding: '24px',
        [theme.breakpoints.up('sm')]: {
            marginLeft: '20px',
            marginRight: '20px',
        },
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.2), 0px 12px 24px -10px rgba(0, 0, 0, 0.4)', 
        border: '2px solid #70609A',
        '& .MuiDivider-root': {
            
            color: '#70609A',
            backgroundColor: '#70609A',
            height: '2px',
        },

    },
    potImage: {
        width: '100%',
        marginBottom: '24px',
        '& img': {
            maxHeight: '85px',
        }
    },
    potUsdTop: {
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '20px',
        letterSpacing: '0.6px',
        marginTop: '10px',
        color: '#ffffff',
        '& span': {
            color: '#DFDDE7'
        }
    },
    potUsd: {
        fontWeight: 700,
        fontSize: '18px',
        lineHeight: '20px',
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
        marginBottom: '20px',
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
        '& span': {
            textDecoration: 'line-through',
            opacity: 0.6,
        }
    },
    potsItemText: {
        color: '#EBF3F9',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        textTransform: 'capitalize',
        margin: '8px 0',
    },
    potsItemValue: {
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        margin: '12px 0',
        '& span': {
            textDecoration: 'line-through',
            opacity: 0.6,
        }
    },
    potsPrizeWinners: {
        color: '#FFFFFF',
        fontWeight: 500,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        margin: '12px 12px',
        '& span': {
            fontWeight: 700,
        }
    },
    potsPrizeWinnersTransaction: {
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        margin: '12px 12px',
        color: '#F3BA2E',
    },
    myPotsInfoText: {
        color: '#EBF3F9',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
    },
    myPotsUpgradeText: {
        color: '#EBF3F9',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        paddingBottom: '16px',
    },
    learnMoreText: {
        color: '#F3BA2E',
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        paddingBottom: '8px',
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
        margin: '20px 0 16px 0',
    },
    eolMoveBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        height: '48px',
        width: '100%',
        fontWeight: 700,
        fontStyle: 'Bold',
        fontSize: '15px',
        lineHeight: '139%',
        letterSpacing: '0.2px',
        color: '#594C7B',
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
        margin: '20px 0 16px 0',
    },
    depositMoreExtraInfo: {
        fontWeight: 400,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '0.2px',
        color: '#EBF3F9',
    },
    dividerText: {
        color: '#EBF3F9',
        fontWeight: 700,
        fontSize: '12px',
        lineHeight: '20px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '16px',
    },
    divider: {
        marginBottom: '16px',
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
