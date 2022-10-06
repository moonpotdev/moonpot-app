const responsiveBreakpoint = 'xs';

const styles = theme => ({
  container: {
    width: `1240px`,
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0 0 40px',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      width: 'calc(100% - 28px)',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 0 40px',
    },
  },
  nextDrawCardWrapper: {
    padding: '0 10px',
    maxWidth: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: '0 10px 0 0',
    },
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      flex: '100%',
      width: '100%',
      padding: '0',
    },
  },
  statsCardBuffer: {
    paddingLeft: '20px',
    marginRight: '0px',
    marginLeft: 'auto',
    paddingRight: '10px',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      paddingRight: '0px',
      paddingLeft: '0px',
      marginTop: '24px',
      flex: '100%',
      width: '100%',
      maxWidth: '100%',
    },
  },
  statsCard: {
    background: '#303050',
    border: '1px solid #4C4C80',
    borderRadius: '10px',
    width: '800px',
    minHeight: '165px',
    padding: '24px',
    maxWidth: '100%',
    display: 'flex',
    height: '100%',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      padding: '16px 24px',
    },
  },
  statsCardLabel: {
    fontWeight: 700,
    fontSize: '10px',
    lineHeight: '14px',
    color: '#8585A6',
    marginBottom: '8px',
    height: '14px',
    textTransform: 'uppercase',
  },
  statsCardValue: {
    fontWeight: 700,
    fontSize: '22px',
    lineHeight: '28px',
    color: '#FFFFFF',
    height: '28px',
  },
  statsVertCenterOuter: {
    position: 'relative',
  },
  statsVertCenterInner: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(0,-50%)',
  },
  ziggyImage: {
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
});

export default styles;
