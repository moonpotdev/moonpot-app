const styles = theme => ({
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
  input: {
    height: `48px`,
    borderRadius: '8px',
    width: '100%',
    backgroundColor: '#3F688D',
    display: 'flex',
    alignItems: 'center',
    '& .MuiInputBase-input': {
      padding: '0 8px',
      height: '100%',
      fontWeight: '500',
      fontSize: '15px',
      lineHeight: '24px',
      letterSpacing: '0.2px',
      color: '#AAC3D9',
    },
  },
  max: {
    marginRight: '8px',
    borderRadius: '4px',
    outline: 'none',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '500',
    fontSize: '15px',
    lineHeight: '20px',
    letterSpacing: '1px',
    border: 'none',
    padding: '4px 12px',
    width: 'auto',
    height: 'auto',
    minWidth: 'auto',
    whiteSpace: 'nowrap',
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
    '& .MuiInputBase-input': {
      color: '#AAC3D9',
    },
  },
  inputVariantPurple: {
    background: '#8375A9',
    border: '2px solid #B6ADCC',
    '& .MuiInputBase-input': {
      color: '#D2CDE0',
    },
  },
  inputVariantPurpleAlt: {
    background: '#4F5887',
    border: '2px solid #586397',
    '& .MuiInputBase-input': {
      color: '#ABB2D9',
    },
  },
  inputVariantGreen: {
    background: '#275668',
    border: '2px solid #2E657A',
    '& .MuiInputBase-input': {
      color: '#DEE9ED',
    },
  },
  inputVariantGreenStable: {
    background: '#467268',
    border: '2px solid #508276',
    '& .MuiInputBase-input': {
      color: '#DEE9ED',
    },
  },
  tokenDropdownVariantTeal: {
    background: '#3C6259',
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
    border: '2px solid #508276',
  },
  tokenDropdownVariantGreenStable: {
    background: '#467268',
    border: '2px solid #508276',
  },
});

export default styles;
