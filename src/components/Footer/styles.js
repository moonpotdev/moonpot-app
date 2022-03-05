const styles = theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    width: '100%',
  },
  wrapperTop: {
    marginBottom: 'auto',
  },
  footer: {
    marginTop: '40px',
    padding: '40px 12px',
    textAlign: 'center',
    background: '#262640',
  },
  nav: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '0',
    margin: '0 -12px -12px -12px',
    listStyle: 'none',
  },
  navItem: {
    margin: '0 12px 12px 12px',
  },
  navLink: {
    color: '#CDCDE4',
    display: 'block',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '24px',
    '&:hover': {
      color: '#ffffff',
    },
  },
  navLinkIcon: {
    color: '#ffffff',
    opacity: '0.7',
    '& svg': {
      display: 'block',
      fill: 'currentColor',
      width: '24px',
      height: '24px',
    },
    '&:hover': {
      opacity: '1',
    },
  },
  stats: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '0',
    margin: '24px -8px -8px -8px',
    listStyle: 'none',
  },
  statsItem: {
    margin: '0 8px 16px 8px',
  },
  stat: {
    display: 'flex',
    background: '#393960',
    borderRadius: '48px',
    padding: '4px 12px 4px 4px',
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '24px',
  },
  statLabel: {
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    padding: '2px 8px',
    borderRadius: '40px',
    background: '#5F5FA0',
    marginRight: '8px',
  },
  socials: {
    marginTop: '24px',
  },
});

export default styles;
