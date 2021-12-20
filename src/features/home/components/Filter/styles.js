const styles = theme => ({
  buttonContainer: {
    width: 'max-content',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '450px',
      width: 'auto',
      padding: '0 16px',
    },
  },
  button: {
    fontSize: '15px',
    lineHeight: '24px',
    fontWeight: '500',
    color: '#696996',
    borderRadius: '0',
    width: 'auto',
    whiteSpace: 'nowrap',
  },
  buttonActive: {
    color: '#FFFFFF',
    borderBottom: '2px solid #fff',
  },
  buttonsOuterContainer: {
    overflow: 'auto',
  },
  select: {
    border: '2px solid #555590',
    borderRadius: '8px',
    width: '220px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0 0 16px 0',
    },
    '& .MuiSelect-select': {
      padding: '8px 24px',
      height: '24px',
      background: 'none',
    },
    marginLeft: '16px',
  },
  selectValue: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectLabel: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#8F8FBC',
    fontWeight: '500',
  },
  menuStyle: {
    border: '2px solid #555590',
    borderRadius: '8px',
    backgroundColor: '#393960',
  },
});

export default styles;
