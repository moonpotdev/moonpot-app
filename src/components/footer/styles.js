const styles = theme => ({
  footer: {
    minHeight: '100%',
    padding: '8px 40px',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'red',
  },
  light: {
    backgroundColor: '#262640',
    maxWidth: 'none',
    marginTop: 8,
    paddingBottom: 32,
  },
  footerBtn: {
    width: '100%',
    marginTop: '56px',
    marginBottom: '20px',
    paddingLeft: '10%',
    paddingRight: '10%',
    color: '#CDCDE4',
    borderColor: '#CDCDE4',
    [theme.breakpoints.up('sm')]: {
      width: '500px',
      marginLeft: '10px',
      marginRight: '10px',
      padding: '0',
    },
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerStats: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    padding: '4px 8px !important',
  },
  textButton: {
    color: '#CDCDE4',
    textSize: '15px',
    paddingLeft: 12,
    paddingRight: 12,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  footerIcons: {
    flex: 1,
    justifyContent: 'flex-end',
    '& img': {
      padding: '0 10px',
    },
  },
  footerImage: {
    width: '52px',
    height: '52px',
  },
});

export default styles;
