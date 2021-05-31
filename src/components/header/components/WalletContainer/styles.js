const styles = (theme) => ({
    btnWrapper: {
        '& .MuiButton-outlined': {
            fontWeight: 500,
            fontSize: '14px',
            color: '#FDB700',
            textTransform: 'capitalize'
        }
    },
    icon: {
        width: 22,
        height: 22,
        backgroundColor: '#8374DA',
        opacity: 0.75,
        borderRadius: '11px',
        marginRight: '5px',
        lineHeight: '28px',
    },
    loading: {
        paddingTop: '5px',
        paddingBottom: '5px',
    }
});

export default styles;
