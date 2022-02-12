const styles = theme => ({
  potsMigrationNotice: {
    marginBottom: '24px',
  },
  potsContainer: {
    paddingBottom: '40px',
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
    //marginTop: `${40 - theme.spacing(3) / 2}px`,
    width: '100%',
    maxWidth: '2000px',
    margin: '28px auto 0',
  },
  poweredBy: {
    paddingTop: '12px',
  },
  spacer: {
    padding: '0 14px',
    [theme.breakpoints.down('sm')]: {
      padding: '0 6px',
    },
    margin: '0 auto',
  },
});

export default styles;
