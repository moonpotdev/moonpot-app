const styles = theme => ({
  mainTitle: {
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '40px',
    textAlign: 'center',
    color: '#B4B3CC',
    marginBottom: '24px',
    width: '368px',
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    '& span': {
      color: '#F3BA2E',
      '&:last-of-type': {
        color: '#FFFFFF',
      },
    },
  },
  totalTVL: {
    marginBottom: '32px',
  },
  tvlSpacer: {
    paddingLeft: '16px',
    paddingRight: '16px',
    margin: '0 auto',
  },
});

export default styles;
