const responsiveBreakpoint = 1073;

const styles = theme => ({
  buttonContainer: {
    width: 'max-content',
    marginRight: 0,
    marginLeft: 'auto',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      maxWidth: '532px',
      width: 'auto',
      margin: '0 auto',
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
    marginLeft: '16px',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      width: '100%',
      margin: '0 0 16px 0',
    },
    '& .MuiSelect-select': {
      padding: '8px 24px',
      height: '24px',
      background: 'none',
    },
    '& .MuiSvgIcon-root': {
      marginRight: 12,
    },
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
    '&.Mui-focused': {
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
  menuStyle: {
    width: '220px',
    marginLeft: '-2px',
    marginTop: '4px',
    border: '2px solid #555590',
    borderRadius: '8px',
    backgroundColor: '#303050',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      width: '500px',
      maxWidth: '90%',
    },
    '& .MuiList-root': {
      padding: '4px 8px',
      '& .Mui-selected': {
        backgroundColor: '#303050',
      },
    },
  },
});

export default styles;
