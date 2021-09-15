import { height } from '@material-ui/system';

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
      color: '#AAC3D9',
    },
  },
  token: {
    marginLeft: '14px',
    marginRight: '14px',
    width: '24px',
    height: '24px',
    [`@media (max-width: 400px)`]: {
      marginLeft: '5px',
    },
  },
  max: {
    marginRight: '8px',
    borderRadius: '4px',
    background: '#6B96BD',
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
  select: {
    borderRadius: '8px',
    height: '100%',
    paddingTop: '4px',
    '&:before': {
      display: 'none',
    },
    '&:after': {
      display: 'none',
    },
  },
  menuStyle: {
    color: '#FFFFFF',
    borderRadius: '8px',
    marginTop: '4px',
    marginLeft: '-2px',
    '& ul': {
      padding: '0',
    },
    '& li': {
      paddingLeft: '0',
    },
  },
  selectContainer: {
    width: '100%',
    height: '48px',
  },
  variantTeal: {
    background: '#3F688D',
    border: '2px solid #6B96BD',
  },
  variantPurple: {
    background: '#8375A9',
    border: '2px solid #B6ADCC',
    '& ul': {
      background: '#8375A9',
    },
    '& li': {
      background: '#8375A9',
    },
  },
  variantPurpleAlt: {
    background: '#4F5887',
    border: '2px solid #586397',
  },
  variantGreen: {
    background: '#275668',
    border: '2px solid #2E657A',
    '& ul': {
      background: '#275668',
    },
    '& li': {
      background: '#275668',
    },
  },
  inputField: {
    [`@media (max-width: 400px)`]: {
      maxWidth: '78%',
    },
  },
  selectField: {
    [`@media (max-width: 400px)`]: {
      minWidth: '22%',
    },
  },
});

export default styles;
