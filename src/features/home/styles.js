const styles = theme => ({
  mainTitle: {
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '40px',
    textAlign: 'center',
    color: '#B4B3CC',
    marginBottom: '12px',
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
    marginTop: '24px',
  },
  tvlSpacer: {
    paddingLeft: '16px',
    paddingRight: '16px',
    margin: '0 auto',
  },
  mainContainer: {
    marginTop: '32px',
  },
  backgroundWrapper: {
    background: '#393960',
    borderTop: '2px solid #4C4C80',
  },
  filters: {
    width: 'auto',
    maxWidth: '1596px',
    margin: '0 auto',
  },
  filterContainerLeft: {
    marginRight: 'auto',
    marginLeft: 0,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  filterContainerRight: {
    marginLeft: 'auto',
    marginRight: 32,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: 0,
    },
  },
});

export default styles;
