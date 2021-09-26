import { withStyles } from '@material-ui/core';
import { styledBy } from '../../helpers/utils';
import { BaseButton } from '../Buttons/BaseButton';

export const MaxButton = withStyles({
  root: {
    color: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: styledBy('variant', {
      teal: '#6B96BD',
      purple: '#B6ADCC',
      purpleAlt: '#656FA5',
      green: '#2E657A',
      greenStable: '#508276',
    }),
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#628cad',
        purple: '#B6ADCC',
        purpleAlt: '#656FA5',
        green: '#2E657A',
        greenStable: '#508276',
      }),
    },
    '&:focus': {
      color: 'rgba(255, 255, 255, 0.95)',
      backgroundColor: styledBy('variant', {
        teal: '#628cad',
        purple: '#B6ADCC',
        purpleAlt: '#656FA5',
        green: '#2E657A',
        greenStable: '#508276',
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
