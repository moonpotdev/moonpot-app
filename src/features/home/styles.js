const responsiveBreakpoint = 764;

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
    maxWidth: '1264px',
    margin: '0 auto',
    padding: '0 24px',
    [theme.breakpoints.down('sm')]: {
      padding: '0 16px',
    },
  },
  filterContainerLeft: {
    width: 'max-content',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      marginLeft: 0,
      marginRight: 'auto',
    },
  },
  filterContainerRight: {
    width: 'max-content',
    marginRight: 0,
    marginLeft: 'auto',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      width: '100%',
      margin: 0,
    },
  },
});

export default styles;
