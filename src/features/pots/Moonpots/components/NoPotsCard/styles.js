const styles = theme => ({
  card: {
    textAlign: 'center',
  },
  title: {
    color: '#5952B4',
    fontSize: '24px',
    lineHeight: '21px',
    fontWeight: '700',
    letterSpacing: '0.6px',
    margin: '0 0 16px 0',
  },
  text: {
    fontSize: '15px',
    color: '#585464',
    lineHeight: '24px',
    margin: '0 0 16px 0',
    '& p:first-child': {
      marginTop: 0,
    },
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  button: {
    marginLeft: 'auto',
    marginRight: 'auto',
    border: 'solid 2px #6753DB',
    color: '#6753DB',
    backgroundColor: 'rgba(103, 83, 219, 0.1)',
    '&:hover': {
      color: '#6753DB',
      backgroundColor: 'rgba(103, 83, 219, 0.1)',
    },
    '&:focus': {
      color: '#6753DB',
      backgroundColor: 'rgba(103, 83, 219, 0.1)',
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: 'rgba(103, 83, 219, 0.1)',
    },
  },
});

export default styles;
