const styles = theme => ({
  buttonContainer: {
    width: 'max-content',
    marginRight: 0,
    marginLeft: 'auto',
    [theme.breakpoints.down('1073')]: {
      maxWidth: '532px',
      width: 'auto',
      margin: '0 auto',
      padding: '0 16px',
    },
    '& .Mui-focused': {
      '& .MuiSelect-root': {
        backgroundColor: '#303050 !important',
        borderRadius: '8px',
      },
    },
    '& .MuiInput-root': {
      '& .MuiSvgIcon-root': {
        marginRight: 12,
      },
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
    [theme.breakpoints.down('1073')]: {
      width: '100%',
      margin: '0 0 16px 0',
    },
    '& .MuiSelect-select': {
      padding: '8px 24px',
      height: '24px',
      background: 'none',
    },
    marginLeft: '16px',
    '& .MuiSelect-root': {
      '& div': {
        '& .MuiTypography-root': {
          display: 'initial',
        },
        '& p:nth-child(2)': {
          color: '#ffffff !important',
        },
      },
    },
  },
  selectRoot: {
    '&$selected': {
      backgroundColor: '#303050',
    },
  },
  selectValue: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectValueSelected: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#8F8FBC',
    fontWeight: '500',
  },
  selectLabel: {
    display: 'none',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#8F8FBC',
    fontWeight: '500',
  },
  selectLableSelected: {
    color: 'red !important',
  },
  menuStyle: {
    width: '220px',
    [theme.breakpoints.down('1073')]: {
      width: '500px',
      maxWidth: '90%',
    },
    marginLeft: '-2px',
    marginTop: '4px',
    border: '2px solid #555590',
    borderRadius: '8px',
    backgroundColor: '#303050',
    '& .MuiList-root': {
      padding: '4px 8px',
      '& .Mui-selected': {
        backgroundColor: '#303050',
      },
    },
  },
});

export default styles;
