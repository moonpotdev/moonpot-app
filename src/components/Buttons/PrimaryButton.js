import { withStyles } from '@material-ui/core';
import { BaseButton } from './BaseButton';

const styledBy = (property, mapping) => (props) => mapping[props[property]];

export const PrimaryButton = withStyles({
  root: {
    backgroundColor: '#FFFFFF',
    color: styledBy('variant', {
      teal: '#3675A2',
      purple: '#70609A',
    }),
    '&:hover': {
      backgroundColor: '#E6E6E6',
      color: styledBy('variant', {
        teal: '#3675A2',
        purple: '#70609A',
      }),
    },
    '&:focus': {
      backgroundColor: '#E6E6E6',
      color: styledBy('variant', {
        teal: '#3675A2',
        purple: '#70609A',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#B8CDE0',
        purple: '#C7C0D8',
      }),
    },
  },
})(BaseButton);