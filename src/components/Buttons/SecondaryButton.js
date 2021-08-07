import { withStyles } from '@material-ui/core';
import { BaseButton } from './BaseButton';

const styledBy = (property, mapping) => (props) => mapping[props[property]];

export const SecondaryButton = withStyles({
  root: {
    border: 'solid 2px #FFFFFF',
    color: '#FFFFFF',
    backgroundColor: styledBy('variant', {
      teal: '#14222E',
      purple: '#42385B',
    }),
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: styledBy('variant', {
        teal: '#0C151C',
        purple: '#2B253C',
      }),
    },
    '&:focus': {
      color: '#FFFFFF',
      backgroundColor: styledBy('variant', {
        teal: '#0C151C',
        purple: '#2B253C',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#05080B',
        purple: '#201B2C',
      }),
    },
  },
})(BaseButton);