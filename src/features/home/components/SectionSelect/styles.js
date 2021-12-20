const styles = theme => ({
  buttonsContainer: {
    borderRadius: '8px',
    border: '2px solid #555590',
    background: '#393960',
    height: '44px',
    width: '344px',
    marginBottom: '32px',
    marginLeft: '32px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px',
      margin: 'auto',
    },
  },
  button: {
    borderRadius: '8px',
    padding: '0',
    marginTop: '-2px',
    marginLeft: '-2px',
    border: 'none',
    height: '42px',
    fontSize: '15px',
    lineHeight: '24px',
    width: '172px',
  },
  buttonSelected: {
    border: '2px solid #F3BA2E',
    color: '#F3BA2E',
  },
});

export default styles;
