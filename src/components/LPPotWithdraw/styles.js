const styles = theme => ({
  stats: {
    '& $stat + $stat': {
      marginTop: '16px',
    },
  },
  stat: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
  },
  statLabel: {
    marginRight: '16px',
  },
  statValue: {
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  migrationNotice: {
    marginTop: '16px',
  },
  buttonHolder: {
    marginTop: '16px',
  },
  fairplayNotice: {
    marginTop: '8px',
    fontSize: '12px',
    lineHeight: '20px',
    letterSpacing: '0.2px',
    color: '#EBF3F9',
    textAlign: 'center',
  },
  learnMore: {
    color: '#F3BA2E',
    textDecoration: 'underline',
  },
  zapInfoHolder: {
    marginBottom: '12px',
  },
  fieldsHolder: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputField: {
    flexShrink: '1',
    flexGrow: '1',
  },
  selectField: {
    flexShrink: '0',
    flexGrow: '0',
    flexBasis: '78px',
    width: '78px',
    paddingRight: '8px',
  },
  tokenSelect: {
    borderRadius: '8px',
    height: '100%',
    width: '100%',
    display: 'flex',
    padding: '0',
    '& .MuiSelect-root': {
      padding: `${12 - 2 * 2}px`,
    },
    '& .MuiSelect-icon': {
      color: '#FFFFFF',
      padding: '0',
      width: '14px',
      right: `${12 - 2}px`,
    },
    '& $tokenItemSymbol': {
      display: 'none',
    },
  },
  tokenItemSymbol: {
    /* needed for tokenSelect rule to work */
  },
  tokenDropdown: {
    color: '#FFFFFF',
    borderRadius: '8px',
    padding: '6px',
    '& .MuiList-root': {
      background: 'transparent',
      padding: '0',
    },
    '& .MuiMenuItem-root': {
      background: 'transparent',
      padding: '8px',
      '& $tokenItemSymbol': {
        marginLeft: '8px',
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    '& .Mui-selected': {
      background: 'transparent',
      opacity: 0.4,
    },
  },
  inputVariantTeal: {
    background: '#3F688D',
    border: '2px solid #6B96BD',
  },
  inputVariantPurple: {
    background: '#8375A9',
    border: '2px solid #B6ADCC',
  },
  inputVariantPurpleAlt: {
    background: '#4F5887',
    border: '2px solid #586397',
  },
  inputVariantGreen: {
    background: '#275668',
    border: '2px solid #2E657A',
  },
  tokenDropdownVariantTeal: {
    background: '#3F688D',
    border: '2px solid #6B96BD',
  },
  tokenDropdownVariantPurple: {
    background: '#8375A9',
    border: '2px solid #B6ADCC',
  },
  tokenDropdownVariantPurpleAlt: {
    background: '#4F5887',
    border: '2px solid #586397',
  },
  tokenDropdownVariantGreen: {
    background: '#275668',
    border: '2px solid #2E657A',
  },
});

export default styles;
