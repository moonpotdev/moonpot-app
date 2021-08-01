const styles = (theme) => ({
    icon: {
        width: 22,
        height: 22,
        backgroundColor: '#8374DA',
        opacity: 0.75,
        borderRadius: '11px',
        lineHeight: '28px',
    },
    wallet: {
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: '24px',
        color: '#F3BA2E',
        border: '2px solid #F3BA2E',
        borderRadius: '38px',
        padding: '10px',
        height: 'auto',
        textTransform: 'none',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading: {
        paddingTop: '16px',
        paddingBottom: '16px',
    },
    connected: {
        borderColor: '#4D4D80',
    },
    disconnected: {

    },
    small: {
        padding: '2px 24px',
        borderRadius: '32px',
        '&$loading': {
            paddingTop: '8px',
            paddingBottom: '8px',
        }
    }
});

export default styles;
