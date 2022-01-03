import { withStyles } from '@material-ui/core';
import { BaseButton } from './BaseButton';
import { styledBy } from '../../helpers/utils';

export const SecondaryButton = withStyles({
  root: {
    border: 'solid 2px #FFFFFF',
    color: '#FFFFFF',
    backgroundColor: styledBy('variant', {
      teal: '#14222E',
      purple: '#42385B',
      blueCommunity: '#24283D',
      purpleXmas: '#3B3762',
    }),
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: styledBy('variant', {
        teal: '#0C151C',
        purple: '#2B253C',
        blueCommunity: '#181B2A',
        purpleXmas: '#272541',
      }),
    },
    '&:focus': {
      color: '#FFFFFF',
      backgroundColor: styledBy('variant', {
        teal: '#0C151C',
        purple: '#2B253C',
        blueCommunity: '#181B2A',
        purpleXmas: '#272541',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#05080B',
        purple: '#201B2C',
        blueCommunity: '#06060A',
        purpleXmas: '#19182A',
      }),
    },
  },
})(BaseButton);
