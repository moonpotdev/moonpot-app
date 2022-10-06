const styles = theme => ({
  poweredBy: {
    fontSize: '10px',
    lineHeight: '20px',
    letterSpacing: '0.01em',
    color: '#B4B2CC',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    '& a': {
      color: '#B4B2CC',
      textDecoration: 'underline',
      '&:hover, &focus': {
        color: '#B4B2CC',
      },
    },
  },
  beefyLogoItem: {
    padding: '0 8px',
  },
  beefyLogo: {
    verticalAlign: 'middle',
  },
});

export default styles;
