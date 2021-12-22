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
      blueCommunity: '#464E77',
      green: '#275668',
      greenStable: '#508276',
      greySide: '#47566B',
      purpleNft: '#501B4E',
      purpleXmas: '#625CA2',
    }),
    '&:hover': {
      backgroundColor: '#E6E6E6',
      color: styledBy('variant', {
        teal: '#3675A2',
        purple: '#70609A',
        blueCommunity: '#464E77',
        green: '#275668',
        greenStable: '#508276',
        greySide: '#47566B',
        purpleNft: '#501B4E',
        purpleXmas: '#625CA2',
      }),
    },
    '&:focus': {
      backgroundColor: '#E6E6E6',
      color: styledBy('variant', {
        teal: '#3675A2',
        purple: '#70609A',
        blueCommunity: '#464E77',
        green: '#275668',
        greenStable: '#508276',
        greySide: '#47566B',
        purpleNft: '#501B4E',
        purpleXmas: '#625CA2',
      }),
    },
    '& .MuiTouchRipple-child': {
      backgroundColor: styledBy('variant', {
        teal: '#B8CDE0',
        purple: '#C7C0D8',
        blueCommunity: '#BFC3D9',
        green: '#275668',
        greenStable: '#508276',
        greySide: '#47566B',
        purpleNft: '#ab63a6',
        purpleXmas: '#a39ed9',
      }),
    },
  },
})(BaseButton);
