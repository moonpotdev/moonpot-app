const styles = () => ({
  filterDropdown: {
    width: '100%',
    '&.Mui-focused $dropdownSelect': {
      backgroundColor: '#303050',
    },
  },
  dropdownSelect: {
    backgroundColor: 'transparent',
    border: 'solid 2px #555590',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 500,
    lineHeight: '24px',
    color: '#fff',
    boxSizing: 'border-box' as const,
    display: 'flex',
    '&.MuiSelect-select': {
      padding: `${12 - 2}px ${24 + 24 - 2}px ${12 - 2}px ${24 - 2}px`,
    },
    '&::before': {
      content: 'attr(aria-label)',
      color: '#8F8FBC',
      marginRight: '0.5em',
    },
    '&:focus': {
      backgroundColor: 'transparent',
      borderRadius: '8px',
    },
  },
  dropdownIcon: {
    right: '12px',
    fill: '#8F8FBC',
  },
  dropdownPaper: {
    border: '2px solid #555590',
    borderRadius: '8px',
    backgroundColor: '#303050',
    padding: `${8 - 2}px 0`,
  },
  dropdownList: {
    padding: '0',
    '& .MuiListItem-root': {
      color: '#fff',
      fontSize: '13px',
      fontWeight: 500,
      lineHeight: '24px',
      padding: `8px ${24 - 2}px`,
      display: 'flex',
      '&::before': {
        content: '""',
        width: '20px',
        height: '20px',
        border: 'solid 2px #EBEBF9',
        borderRadius: '4px',
        background: 'transparent',
        display: 'block',
        marginRight: '8px',
        textAlign: 'center' as const,
        lineHeight: `${20 - 2 * 2}px`,
      },
      '& .MuiListItem-root + .MuiListItem-root': {
        marginTop: '16px',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '&.Mui-selected': {
        background: 'transparent',
        color: '#EBEBF9',
        '&::before': {
          content: '"\\02713"',
          color: '#303050',
          backgroundColor: '#EBEBF9',
        },
      },
      '&:hover': {
        background: '#434370',
        color: '#FFF',
      },
    },
  },
});

export default styles;
