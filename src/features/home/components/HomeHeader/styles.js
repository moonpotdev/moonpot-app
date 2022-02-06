const responsiveBreakpoint = 725;

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
  nextDrawCard: {
    background: 'linear-gradient(105.09deg, #4139AC 0.63%, #615DA9 100%, #615DA9 100%);',
    borderRadius: '10px',
    padding: '24px',
    width: '100%',
  },
  nextDrawInner: {
    display: 'flex',
    width: '100%',
    marginBottom: '24px',
  },
  nextDrawPrizeText: {
    fontWeight: 500,
    fontSize: '15px',
    lineHeight: '24px',
    marginBottom: '12px',
    color: '#EBF3F9',
    textTransform: 'uppercase',
    '& span': {
      color: '#F3BA2E',
    },
  },
  nextDrawTimeContainer: {
    display: 'flex',
  },
  nextDrawTimeValue: {
    padding: '4px',
    border: '2px solid #F3BA2E',
    borderRadius: '4px',
    fontSize: '24px',
    lineHeight: '28px',
    fontWeight: 700,
    width: '48px',
    height: '40px',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  nextDrawTimeLabel: {
    fontSize: '10px',
    lineHeight: '20px',
    fontWeight: 700,
    color: '#FFFFFF',
    width: '48px',
    textAlign: 'center',
    padding: '2px 0',
  },
  nextDrawTimeSeparator: {
    fontSize: '24px',
    lineHeight: '24px',
    height: '40px',
    padding: '8px',
    color: '#FFFFFF',
  },
  nextDrawLogoContainer: {
    marginRight: '0',
    marginLeft: 'auto',
  },
  statsCardBuffer: {
    paddingLeft: '20px',
    marginRight: '0px',
    marginLeft: 'auto',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
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
    fontSize: '12px',
    lineHeight: '14px',
    color: '#8585A6',
    marginBottom: '8px',
    height: '14px',
    textTransform: 'uppercase',
  },
  statsCardValue: {
    fontWeight: 700,
    fontSize: '24px',
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
