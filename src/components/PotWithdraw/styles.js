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
});

export default styles;
