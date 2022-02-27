const styles = theme => ({
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
    borderRadius: '32px',
    padding: '2px 24px',
    height: 'auto',
    textTransform: 'none',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    whiteSpace: 'nowrap',
    position: 'relative',
  },
  withIcon: {
    paddingLeft: '38px',
    '& img': {
      position: 'absolute',
      top: '50%',
      left: '4px',
      transform: 'translate(0, -50%)',
    },
  },
  loading: {
    paddingTop: '8px',
    paddingBottom: '8px',
  },
  connected: {
    borderColor: '#4D4D80',
  },
  disconnected: {},
});

export default styles;
