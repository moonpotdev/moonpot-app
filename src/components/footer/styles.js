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
    backgroundColor: '#393960',
    maxWidth: 'none',
    paddingBottom: '32px',
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
