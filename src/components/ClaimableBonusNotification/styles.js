const styles = () => ({
  claimable: {
    borderColor: '#4C4C80',
  },
  total: {
    display: 'flex',
    alignItems: 'center',
  },
  totalText: {
    marginLeft: '8px',
    fontWeight: '500',
    fontSize: '19px',
    lineHeight: '28px',
    letterSpacing: '0.2px',
  },
  description: {
    marginTop: '12px',
    fontSize: '15px',
    '& p': {
      marginTop: '0',
      marginBottom: '1em',
    },
    '& p:last-child': {
      marginBottom: '0',
    },
  },
  buttons: {
    marginTop: '24px',
  },
});

export default styles;
