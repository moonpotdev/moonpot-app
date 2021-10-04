const styles = theme => ({
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
    },
  },
  token: {
    marginLeft: '14px',
    width: '24px',
    height: '24px',
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
  variantTeal: {
    background: '#3F688D',
    border: '2px solid #6B96BD',
    '& .MuiInputBase-input': {
      color: '#AAC3D9',
    },
  },
  variantPurple: {
    background: '#8375A9',
    border: '2px solid #B6ADCC',
    '& .MuiInputBase-input': {
      color: '#D2CDE0',
    },
  },
  variantPurpleAlt: {
    background: '#4F5887',
    border: '2px solid #586397',
    '& .MuiInputBase-input': {
      color: '#ABB2D9',
    },
  },
});

export default styles;
