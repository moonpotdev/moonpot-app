import {withStyles} from '@material-ui/core';
import {BaseButton} from './BaseButton';

export const ButtonWhitePurpleDark = withStyles({
	root: {
		backgroundColor: '#FFFFFF',
		color: '#594C7B',
		'&:hover': {
			backgroundColor: '#e8e8e8',
		},
		'&.Mui-disabled': {
			color: '#594C7B',
			backgroundColor: 'rgba(255, 255, 255, 0.6)',
		}
	}
})(BaseButton);