const styles = theme => ({
  poweredBy: {
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.01em',
    color: '#B4B2CC',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  poweredByItem: {
    paddingLeft: '0.12em',
    paddingRight: '0.12em',
  },
  beefyLink: {
    color: '#B4B2CC',
    textDecoration: 'underline',
    '&:hover, &focus': {
      color: '#B4B2CC',
    },
  },
  beefyLogo: {
    verticalAlign: 'middle',
  },
});

export default styles;
