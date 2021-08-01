import { withStyles } from '@material-ui/core';
import { BaseButton } from './BaseButton';

export const ButtonWhiteTeal = withStyles({
  root: {
    backgroundColor: '#FFFFFF',
    color: '#3675A2',
    '&:hover': {
      backgroundColor: '#e8e8e8',
    },
    '&.Mui-disabled': {
      color: '#3675A2',
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
  },
})(BaseButton);
