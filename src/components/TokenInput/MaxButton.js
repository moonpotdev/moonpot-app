import { withStyles } from '@material-ui/core';
import { styledBy } from '../../helpers/utils';
import { BaseButton } from '../Buttons/BaseButton';

export const MaxButton = withStyles({
  root: {
    backgroundColor: styledBy('variant', {
      teal: '#6B96BD',
      purple: '#A094BD',
      purpleAlt: '#656FA5',
      green: '#2E657A',
      greenStable: '#508276',
    }),
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#8EAFCD',
        purple: '#BBB2D2',
        purpleAlt: '#858DB7',
        green: '#448097',
        greenStable: '#64A092',
      }),
    },
    '&:focus': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#8EAFCD',
        purple: '#BBB2D2',
        purpleAlt: '#858DB7',
        green: '#448097',
        greenStable: '#64A092',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#50758f',
        purple: '#B6ADCC',
        purpleAlt: '#656FA5',
        green: '#2E657A',
        greenStable: '#508276',
      }),
    },
  },
})(BaseButton);
