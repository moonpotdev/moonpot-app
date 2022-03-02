const responsiveBreakpoint = 764;

const styles = theme => ({
  buttonsOuterContainer: {
    overflow: 'auto',
    maxWidth: '1218px',
    margin: '0 auto 24px',
    [theme.breakpoints.down(1300)]: {
      padding: '0 12px',
    },
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      margin: '0 auto',
    },
  },
  buttonContainer: {
    width: 'max-content',
    marginRight: 0,
    marginLeft: 'auto',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      width: 'auto',
      margin: '0 auto',
      padding: '0 0 8px',
    },
  },
  select: {
    border: '2px solid #555590',
    borderRadius: '8px',
    width: '320px',
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
      color: '#ffffff',
      fontWeight: '500',
      textTransform: 'capitalize',
      lineHeight: '22px',
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
  selectLabel: {
    display: 'none',
    fontSize: '15px',
    lineHeight: '24px',
    color: '#8F8FBC',
    fontWeight: '500',
  },
  potSelectLabel: {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#8F8FBC',
    fontWeight: '500',
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
  menuStyle: {
    width: '320px',
    marginLeft: '-2px',
    marginTop: '4px',
    border: '2px solid #555590',
    borderRadius: '8px',
    backgroundColor: '#303050',
    [theme.breakpoints.down(responsiveBreakpoint)]: {
      //width: '500px',
      maxWidth: '90%',
    },
    '& .MuiList-root': {
      padding: '4px 8px',
      '& .Mui-selected': {
        backgroundColor: '#303050',
      },
      '& .MuiButtonBase-root': {
        '& div': {
          '& .MuiListItemIcon-root': {
            '& .MuiButtonBase-root': {
              padding: 0,
              '& .MuiIconButton-label': {
                '& .MuiSvgIcon-root': {
                  color: '#ffffff',
                },
              },
            },
          },
        },
      },
    },
  },
});

export default styles;
