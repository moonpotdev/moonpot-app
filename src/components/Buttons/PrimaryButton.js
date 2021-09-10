import { withStyles } from '@material-ui/core';
import { BaseButton } from './BaseButton';
import { styledBy } from '../../helpers/utils';

export const PrimaryButton = withStyles({
  root: {
    backgroundColor: '#FFFFFF',
    color: styledBy('variant', {
      teal: '#3675A2',
      purple: '#70609A',
      purpleAlt: '#4F5887',
      blueCommunity: '#5A6881',
    }),
    '&:hover': {
      backgroundColor: '#E6E6E6',
      color: styledBy('variant', {
        teal: '#3675A2',
        purple: '#70609A',
        blueCommunity: '#5A6881',
      }),
    },
    '&:focus': {
      backgroundColor: '#E6E6E6',
      color: styledBy('variant', {
        teal: '#3675A2',
        purple: '#70609A',
        blueCommunity: '#5A6881',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#B8CDE0',
        purple: '#C7C0D8',
        blueCommunity: '#a9bee3',
      }),
    },
  },
})(BaseButton);
