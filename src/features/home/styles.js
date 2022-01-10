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
  backgroundWrapper: {
    background: '#393960',
    borderTop: '2px solid #4C4C80',
    paddingTop: '32px',
  },
  filters: {
    width: 'auto',
    maxWidth: '1572px',
    margin: '0 auto',
  },
  filterContainerLeft: {
    margin: '0 12px',
    width: '500px',
    [theme.breakpoints.down('1073')]: {
      margin: '0 auto',
      width: '532px',
    },
  },
  placeholder: {
    width: '500px',
    margin: '0 12px',
    [theme.breakpoints.down('1597')]: {
      width: 0,
      margin: 0,
    },
  },
  filterContainerRight: {
    margin: '0 12px',
    width: '500px',
    [theme.breakpoints.down('1073')]: {
      width: '100%',
      margin: 0,
    },
  },
});

export default styles;
