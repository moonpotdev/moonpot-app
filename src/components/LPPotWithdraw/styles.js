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
    maxWidth: '100%',
  },
  select: {
    borderRadius: '8px',
    background: '#275668',
    border: '2px solid #2E657A',
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
    background: '#275668',
    border: '2px solid #2E657A',
    color: '#FFFFFF',
    borderRadius: '8px',
    marginTop: '4px',
    marginLeft: '-2px',
    '& ul': {
      padding: '0',
      background: '#275668',
    },
    '& li': {
      background: '#275668',
      paddingLeft: '0',
    },
  },
  token: {
    marginLeft: '14px',
    marginRight: '14px',
    width: '24px',
    height: '24px',
  },
});

export default styles;
