const styles = theme => ({
  stats: {
    '& $stat + $stat': {
      marginTop: '16px',
    },
  },
  stat: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
  },
  statLabel: {
    marginRight: '16px',
  },
  statValue: {
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  migrationNotice: {
    marginTop: '16px',
  },
  buttonHolder: {
    marginTop: '16px',
  },
  fairplayNotice: {
    marginTop: '8px',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: '#EBF3F9',
    textAlign: 'center',
  },
  learnMore: {
    color: '#F3BA2E',
    textDecoration: 'underline',
  },
  zapInfoHolder: {
    marginBottom: '12px',
  },
  selectContainer: {
    width: '100%',
    height: '48px',
  },
  select: {
    borderRadius: '8px',
    height: '100%',
    paddingTop: '4px',
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
  menuStyle: {
    color: '#FFFFFF',
    borderRadius: '8px',
    marginTop: '4px',
    marginLeft: '-2px',
    '& ul': {
      padding: '0',
    },
    '& li': {
      paddingLeft: '0',
    },
  },
  token: {
    marginLeft: '12px',
    marginRight: '12px',
    width: '24px',
    height: '24px',
  },
  variantPurple: {
    background: '#8375A9',
    border: '2px solid #B6ADCC',
    '& ul': {
      background: '#8375A9',
    },
    '& li': {
      background: '#8375A9',
    },
  },
  variantGreen: {
    background: '#275668',
    border: '2px solid #2E657A',
    '& ul': {
      background: '#275668',
    },
    '& li': {
      background: '#275668',
    },
  },
  inputField: {
    width: `calc(100% - 75px)`,
  },
  selectField: {
    width: '73px',
    paddingRight: '8px',
  },
});

export default styles;
