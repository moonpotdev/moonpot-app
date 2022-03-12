const styles = theme => ({
  buttonsContainer: {
    borderRadius: '8px',
    border: '2px solid #555590',
    background: '#393960',
    height: '42px',
    width: 'fit-content',
    marginBottom: '32px',
    [theme.breakpoints.down('764')]: {
      margin: '0 0 16px',
    },
  },
  button: {
    borderRadius: '8px',
    marginTop: '-2px',
    marginLeft: '-2px',
    border: 'none',
    height: '42px',
    fontSize: '15px',
    lineHeight: '24px',
    width: 'auto',
    padding: '0 24px',
  },
  buttonSelected: {
    border: '2px solid #F3BA2E',
    color: '#F3BA2E',
  },
});

export default styles;
