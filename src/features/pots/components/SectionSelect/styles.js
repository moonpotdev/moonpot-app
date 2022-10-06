const styles = theme => ({
  buttonsContainer: {
    borderRadius: '8px',
    border: '2px solid #555590',
    background: '#393960',
    height: '48px',
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  button: {
    borderRadius: '8px',
    marginTop: '-2px',
    marginLeft: '-2px',
    border: 'none',
    height: '48px',
    fontSize: '13px',
    lineHeight: '24px',
    width: 'auto',
    padding: '0 24px',
    flexGrow: '1',
  },
  buttonSelected: {
    border: '2px solid #F3BA2E',
    color: '#F3BA2E',
    background: '#303050',
  },
});

export default styles;
