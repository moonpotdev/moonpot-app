const styles = theme => ({
  container: {
    marginBottom: '32px',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: '0 -12px -24px -12px',
  },
  item: {
    padding: '0 12px 24px 12px',
  },
  itemSection: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
      marginRight: 'auto',
    },
  },
  filterSection: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'fit-content',
    },
  },
  itemDropdown: {
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      flexGrow: 0,
    },
  },
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
    fontSize: '15px',
    fontWeight: '500',
    lineHeight: '24px',
    color: '#fff',
    boxSizing: 'border-box',
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
      fontSize: '15px',
      fontWeight: '500',
      lineHeight: '24px',
      padding: `8px ${24 - 2}px`,
      '& .MuiListItem-root + .MuiListItem-root': {
        marginTop: '16px',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '&.Mui-selected': {
        background: 'transparent',
        color: '#8F8FBC',
      },
      '&:hover': {
        background: '#434370',
        color: '#FFF',
      },
    },
  },
});

export default styles;
