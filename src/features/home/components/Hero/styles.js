const styles = theme => ({
  hero: {
    background: 'linear-gradient(40.93deg, #625DA4 0%, #000312 100%)',
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  },
  foreground: {
    position: 'relative',
    zIndex: 5,
    width: `${1220 + 2 * 16}px`,
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '84px 16px',
    margin: '0 auto',
  },
  foregroundSizer: {
    width: '510px',
    maxWidth: '100%',
    margin: '0 auto 0 0',
  },
  title: {
    fontSize: '43px',
    fontWeight: '500',
    lineHeight: '56px',
    color: '#ffffff',
    margin: 0,
  },
  text: {
    margin: '24px 0 0 0',
    fontSize: '17px',
    lineHeight: '32px',
    opacity: '0.8',
    color: '#ffffff',
    '& p:last-child': {
      marginBottom: 0,
    },
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '48px -8px -16px -8px',
    '& .MuiButton-root': {
      margin: '0 8px 16px 8px',
      '& .MuiButton-label': {
        whiteSpace: 'nowrap',
      },
    },
  },
  buttonIcon: {
    fill: '#ffffff',
    width: '24px',
    height: '24px',
    marginRight: '8px',
  },
});

export default styles;
