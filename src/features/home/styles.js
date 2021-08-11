const styles = theme => ({
  mainTitle: {
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '40px',
    textAlign: 'center',
    color: '#B4B3CC',
    marginBottom: '56px',
    '& span': {
      color: '#F3BA2E',
      '&:last-of-type': {
        color: '#FFFFFF',
      },
    },
  },
  potsFilter: {
    marginBottom: '48px',
  },
  potsMigrationNotice: {
    marginBottom: '24px',
  },
  potList: {
    width: `${500 * 2 + 24 * 2}px`,
    maxWidth: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  potListInner: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginLeft: '-12px',
    marginRight: '-12px',
    marginBottom: '-24px',
    '& > *': {
      marginBottom: '24px',
      marginLeft: '12px',
      marginRight: '12px',
    },
  },
  communityJoin: {
    margin: '0 auto',
    width: '500px',
    maxWidth: '100%',
    textAlign: 'center',
  },
  ziggyMaintenance: {
    marginBottom: '24px',
  },
  communityTitle: {
    fontWeight: 'normal',
    fontSize: '24px',
    lineHeight: '36px',
    color: '#FFFFFF',
    marginBottom: '12px',
  },
  communityDescription: {
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#C7C3D5',
    letterSpacing: '0.2px',
  },
  socialMediaSection: {
    marginTop: `${40 - theme.spacing(3) / 2}px`,
  },
  poweredBy: {
    paddingTop: '12px',
    fontWeight: 300,
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.01em',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  poweredByItem: {
    paddingLeft: '0.12em',
    paddingRight: '0.12em',
  },
  beefyLink: {
    color: '#FFFFFF',
    textDecoration: 'underline',
    '&:hover, &focus': {
      color: '#FFFFFF',
    },
  },
  beefyLogo: {
    verticalAlign: 'middle',
  },
});

export default styles;
