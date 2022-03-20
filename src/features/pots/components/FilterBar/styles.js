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
  },
  dropdownSelect: {
    backgroundColor: '#303050',
    border: 'solid 2px #555590',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    lineHeight: '24px',
    color: '#fff',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    '&.MuiSelect-select': {
      padding: `${12 - 2}px ${24 + 24 - 2}px ${12 - 2}px ${24 - 2}px`,
    },
    '&::before': {
      content: 'attr(aria-label)',
      color: '#8F8FBC',
      marginRight: '0.5em',
    },
    '&:focus': {
      backgroundColor: '#303050',
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
    padding: `${16 - 2}px ${24 - 2}px`,
  },
  dropdownList: {
    padding: '0',
    '& .MuiListItem-root': {
      color: '#fff',
      fontSize: '15px',
      fontWeight: '500',
      lineHeight: '24px',
      '& .MuiListItem-root + .MuiListItem-root': {
        marginTop: '16px',
      },
      '& .MuiTouchRipple-root': {
        display: 'none',
      },
      '&.Mui-selected, &:hover': {
        background: 'transparent',
        color: '#8F8FBC',
      },
    },
  },
});

export default styles;
