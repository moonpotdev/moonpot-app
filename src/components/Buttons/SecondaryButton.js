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
      blueCommunity: '#2a2e47',
    }),
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: styledBy('variant', {
        teal: '#0C151C',
        purple: '#2B253C',
        blueCommunity: '#262940',
      }),
    },
    '&:focus': {
      color: '#FFFFFF',
      backgroundColor: styledBy('variant', {
        teal: '#0C151C',
        purple: '#2B253C',
        blueCommunity: '#262940',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#05080B',
        purple: '#201B2C',
        blueCommunity: '#222539',
      }),
    },
  },
})(BaseButton);
